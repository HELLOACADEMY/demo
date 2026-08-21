'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Boxes, Plus, Printer, Edit, Trash2, CheckCircle2, DollarSign, Building2, Package, Receipt, X, FileText, Download } from 'lucide-react';

export interface InventoryItem {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  qty: number;
  unitValue: number;
  invoiceNumber: string;
  purchaseDate: string;
  condition: 'Baik' | 'Perlu Perbaikan' | 'Rusak';
  branchId: string;
}

export default function InventoryPage() {
  const { branches, currentBranchId, addAuditLog } = useERP();

  const [items, setItems] = useState<InventoryItem[]>([
    { id: 'inv-1', assetCode: 'AST-SRD-2026-001', name: 'Laptop Unit i7 (Lab Komputer 1)', category: 'Elektronik & IT', qty: 35, unitValue: 12500000, invoiceNumber: 'INV-PURCHASE/2026/05/012', purchaseDate: '15 Mei 2026', condition: 'Baik', branchId: 'br-1' },
    { id: 'inv-2', assetCode: 'AST-SRD-2026-002', name: 'Proyektor Epson HD 4K', category: 'Elektronik & IT', qty: 12, unitValue: 8500000, invoiceNumber: 'INV-PURCHASE/2026/06/044', purchaseDate: '10 Juni 2026', condition: 'Baik', branchId: 'br-1' },
    { id: 'inv-3', assetCode: 'AST-DNS-2026-003', name: 'Meja & Kursi Ergonomis Siswa', category: 'Mebel & Furniture', qty: 450, unitValue: 750000, invoiceNumber: 'INV-PURCHASE/2026/04/088', purchaseDate: '20 April 2026', condition: 'Baik', branchId: 'br-2' },
    { id: 'inv-4', assetCode: 'AST-KRB-2026-004', name: 'Buku Paket UTBK SNBT Kurikulum 2026', category: 'Buku Ajar', qty: 500, unitValue: 185000, invoiceNumber: 'INV-PURCHASE/2026/07/102', purchaseDate: '01 Juli 2026', condition: 'Baik', branchId: 'br-3' },
    { id: 'inv-5', assetCode: 'AST-SRD-2026-005', name: 'AC Split Daikin 2 PK Ruang Kelas', category: 'Elektronik & IT', qty: 8, unitValue: 6200000, invoiceNumber: 'INV-PURCHASE/2026/03/019', purchaseDate: '12 Maret 2026', condition: 'Baik', branchId: 'br-1' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [assetCode, setAssetCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Elektronik & IT');
  const [qty, setQty] = useState(1);
  const [unitValue, setUnitValue] = useState(1000000);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2026-08-01');
  const [condition, setCondition] = useState<'Baik' | 'Perlu Perbaikan' | 'Rusak'>('Baik');
  const [targetBranchId, setTargetBranchId] = useState(currentBranchId === 'ALL' ? 'br-1' : currentBranchId);

  const [notice, setNotice] = useState<string | null>(null);

  // Filter items by branch
  const filteredItems = items.filter(item => {
    if (currentBranchId === 'ALL') return true;
    return item.branchId === currentBranchId;
  });

  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  // Calculate Metrics
  const totalQty = filteredItems.reduce((acc, curr) => acc + curr.qty, 0);
  const totalAssetValue = filteredItems.reduce((acc, curr) => acc + (curr.qty * curr.unitValue), 0);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setAssetCode(`AST-${activeBranch.code}-2026-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setCategory('Elektronik & IT');
    setQty(1);
    setUnitValue(1000000);
    setInvoiceNumber(`INV-PURCHASE/2026/08/${Math.floor(100 + Math.random() * 900)}`);
    setPurchaseDate('20 Agustus 2026');
    setCondition('Baik');
    setTargetBranchId(currentBranchId === 'ALL' ? 'br-1' : currentBranchId);
    setShowModal(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setAssetCode(item.assetCode);
    setName(item.name);
    setCategory(item.category);
    setQty(item.qty);
    setUnitValue(item.unitValue);
    setInvoiceNumber(item.invoiceNumber);
    setPurchaseDate(item.purchaseDate);
    setCondition(item.condition);
    setTargetBranchId(item.branchId);
    setShowModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !invoiceNumber) return;

    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? {
        ...i,
        assetCode,
        name,
        category,
        qty: Number(qty),
        unitValue: Number(unitValue),
        invoiceNumber,
        purchaseDate,
        condition,
        branchId: targetBranchId
      } : i));
      addAuditLog('Update Inventory Item', 'Inventory', `Perubahan aset inventaris ${name} (Invoice: ${invoiceNumber})`);
      setNotice(`Aset inventaris ${name} berhasil diperbarui.`);
    } else {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        assetCode,
        name,
        category,
        qty: Number(qty),
        unitValue: Number(unitValue),
        invoiceNumber,
        purchaseDate,
        condition,
        branchId: targetBranchId
      };
      setItems(prev => [newItem, ...prev]);
      addAuditLog('Create Inventory Item', 'Inventory', `Penambahan aset inventaris ${name} (Invoice: ${invoiceNumber}) di cabang`);
      setNotice(`Aset inventaris baru ${name} (Invoice: ${invoiceNumber}) berhasil dicatat.`);
    }

    setShowModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aset inventaris ${name}?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      addAuditLog('Delete Inventory Item', 'Inventory', `Menghapus aset inventaris ${name}`);
    }
  };

  const handleTriggerPrint = () => {
    setShowPrintModal(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Strict Print CSS Rule: Hide Web App UI, Show Only Paper Document */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-printable-paper, #official-printable-paper * {
            visibility: visible !important;
          }
          #official-printable-paper {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 99999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Page */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Boxes style={{ color: '#2575b9' }} /> Inventaris Sarana & Prasarana Cabang Pontianak
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pencatatan aset cabang, invoice pembelian, jumlah unit, dan nilai investasi per pos cabang.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleTriggerPrint}
            style={{
              padding: '10px 18px',
              background: '#2575b9',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)'
            }}
          >
            <Printer size={16} /> Cetak PDF Dokumen Resmi
          </button>

          <button
            onClick={handleOpenAddModal}
            style={{
              padding: '10px 18px',
              background: '#10b981',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Plus size={16} /> Tambah Aset & No. Invoice
          </button>
        </div>
      </div>

      {notice && (
        <div className="no-print" style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
              {currentBranchId === 'ALL' ? 'Semua Cabang' : activeBranch.code}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Unit Barang & Aset</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>{totalQty} Unit</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Tercatat di Sistem</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px' }}>
              Estimasi Total
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Nilai Investasi Aset</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>
            Rp {totalAssetValue.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Akumulasi Nilai Pembelian</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '20px' }}>
              Invoice Legal
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Aset Terverifikasi Invoice</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7e22ce', margin: '4px 0 2px' }}>{filteredItems.length} Invoice</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Bukti Pembelian Sah</div>
        </div>
      </div>

      {/* Main Inventory Screen Table */}
      <div className="no-print" style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} style={{ color: '#2575b9' }} /> Daftar Aset Inventaris — {currentBranchId === 'ALL' ? 'Semua Pos Cabang' : activeBranch.name}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px' }}>
              Laporan terverifikasi inventarisir barang dan dokumen nomor invoice pembelian sah.
            </p>
          </div>

          <button
            onClick={handleTriggerPrint}
            style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', color: '#2575b9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} /> Pratinjau Dokumen Cetak
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kode & Nama Aset</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nomor Invoice Pembelian</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kategori</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jumlah</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nilai Unit & Total</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Lokasi Cabang</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kondisi Aset</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    Belum ada data barang aset inventaris di cabang ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const brName = branches.find(b => b.id === item.branchId)?.name || activeBranch.name;
                  const totalVal = item.qty * item.unitValue;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 700 }}>{item.assetCode}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 800, color: '#6d28d9', background: '#f3e8ff', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', fontSize: '0.8rem' }}>
                          🧾 {item.invoiceNumber}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>Tgl: {item.purchaseDate}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontWeight: 700, fontSize: '0.775rem' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>
                        {item.qty} Unit
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 800, color: '#16a34a' }}>Rp {totalVal.toLocaleString('id-ID')}</div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b' }}>@ Rp {item.unitValue.toLocaleString('id-ID')}</div>
                      </td>
                      <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>
                        {brName}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', background: item.condition === 'Baik' ? '#dcfce7' : item.condition === 'Perlu Perbaikan' ? '#fef3c7' : '#fee2e2', color: item.condition === 'Baik' ? '#166534' : item.condition === 'Perlu Perbaikan' ? '#92400e' : '#991b1b', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem' }}>
                          {item.condition}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            style={{ padding: '6px 10px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📄 OFFICIAL PRINTABLE PAPER DOCUMENT MODAL (SURAT DOKUMEN RESMI) */}
      {(showPrintModal || typeof window !== 'undefined') && (
        <div id="official-printable-paper" style={{ display: showPrintModal ? 'block' : 'none', background: '#ffffff', color: '#000000', padding: '32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          
          {/* Official Kop Surat Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #000000', paddingBottom: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Logo" style={{ height: '54px', width: 'auto' }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.02em' }}>
                  BSMART EDUCATION PONTIANAK
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#333333' }}>
                  YAYASAN PENDIDIKAN & BIMBINGAN BELAJAR UTAMA PONTIANAK
                </div>
                <div style={{ fontSize: '0.75rem', color: '#555555' }}>
                  Jl. Sungai Raya Dalam No. 12, Pontianak Tenggara • Telp: (0561) 765432 • Web: bsmart.sch.id
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>DOKUMEN RESMI ERP</div>
              <div style={{ fontSize: '0.7rem', color: '#555555' }}>Tgl Cetak: 20 Agustus 2026</div>
              <div style={{ fontSize: '0.7rem', color: '#555555' }}>Ref: DOC/INV-BSMART/2026/08</div>
            </div>
          </div>

          {/* Document Title Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, textDecoration: 'underline' }}>
              SURAT LAPORAN INVENTARIS SARANA & PRASARANA POS CABANG
            </h2>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#222222', marginTop: '4px' }}>
              {currentBranchId === 'ALL' ? 'Semua Pos Cabang Belajar Pontianak' : activeBranch.name}
            </div>
          </div>

          {/* Printable Official Data Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', border: '1.5px solid #000000', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #000000', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800 }}>No. Kode Aset</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800 }}>Nama Barang / Aset</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800 }}>Nomor Invoice Pembelian Sah</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800 }}>Kategori</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800, textAlign: 'center' }}>Jumlah</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800, textAlign: 'right' }}>Nilai Unit (Rp)</th>
                <th style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800, textAlign: 'right' }}>Total Investasi (Rp)</th>
                <th style={{ padding: '8px 10px', fontWeight: 800, textAlign: 'center' }}>Kondisi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const totalVal = item.qty * item.unitValue;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #000000' }}>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 700 }}>{index + 1}. {item.assetCode}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800 }}>{item.name}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', fontWeight: 800, fontFamily: 'monospace' }}>{item.invoiceNumber}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000' }}>{item.category}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', textAlign: 'center', fontWeight: 800 }}>{item.qty} Unit</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', textAlign: 'right' }}>Rp {item.unitValue.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #000000', textAlign: 'right', fontWeight: 800 }}>Rp {totalVal.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 800 }}>{item.condition}</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#f8fafc', fontWeight: 900 }}>
                <td colSpan={4} style={{ padding: '10px', borderRight: '1px solid #000000', textAlign: 'right' }}>TOTAL KESELURUHAN ASET:</td>
                <td style={{ padding: '10px', borderRight: '1px solid #000000', textAlign: 'center' }}>{totalQty} Unit</td>
                <td style={{ padding: '10px', borderRight: '1px solid #000000' }}>-</td>
                <td style={{ padding: '10px', borderRight: '1px solid #000000', textAlign: 'right' }}>Rp {totalAssetValue.toLocaleString('id-ID')}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          {/* Official Signatures */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '40px', fontSize: '0.8rem' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <div>Mengetahui,</div>
              <div style={{ fontWeight: 800, marginTop: '2px' }}>Kepala Pos Cabang Belajar</div>
              <div style={{ height: '55px' }}></div>
              <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Hendra Kusuma, M.Pd.</div>
              <div style={{ fontSize: '0.725rem', color: '#555555' }}>NIP: 19850112001</div>
            </div>

            <div style={{ textAlign: 'center', width: '220px' }}>
              <div>Pontianak, 20 Agustus 2026</div>
              <div style={{ fontWeight: 800, marginTop: '2px' }}>Petugas Inventaris & Sarpras</div>
              <div style={{ height: '55px' }}></div>
              <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Dedi Kurniawan, S.E.</div>
              <div style={{ fontSize: '0.725rem', color: '#555555' }}>Staf Logistik Aset</div>
            </div>
          </div>

          <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => window.print()} style={{ padding: '10px 20px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} /> Print / Save PDF Sekarang
            </button>
            <button onClick={() => setShowPrintModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              Tutup Pratinjau
            </button>
          </div>

        </div>
      )}

      {/* ADD / EDIT INVENTORY ASSET MODAL */}
      {showModal && (
        <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveItem} style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '580px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingItem ? 'Edit Data Aset & No. Invoice' : 'Tambah Barang Aset Inventaris Baru'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>Input nomor invoice bukti pembelian sah aset.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nama Barang / Aset Inventaris *</label>
                <input type="text" placeholder="Contoh: Laptop Unit i7 (Lab 1)" value={name} onChange={e => setName(e.target.value)} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kode Aset ID *</label>
                  <input type="text" value={assetCode} onChange={e => setAssetCode(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#6d28d9', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Nomor Invoice Pembelian *</label>
                  <input type="text" placeholder="INV-PURCHASE/2026/08/xxx" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #a855f7', background: '#faf5ff', fontWeight: 800, color: '#6d28d9', fontSize: '0.875rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kategori Aset *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="select-field">
                    <option value="Elektronik & IT">Elektronik & Perangkat IT</option>
                    <option value="Mebel & Furniture">Mebel & Furniture Kelas</option>
                    <option value="Buku Ajar">Buku Ajar & Modul Belajar</option>
                    <option value="Peralatan Lab">Peralatan Lab & Eksperimen</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Jumlah Unit *</label>
                  <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min={1} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Harga per Unit (Rp) *</label>
                  <input type="number" value={unitValue} onChange={e => setUnitValue(Number(e.target.value))} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Pos Cabang Lokasi *</label>
                  <select value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} className="select-field">
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tanggal Pembelian</label>
                  <input type="text" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Kondisi Barang *</label>
                  <select value={condition} onChange={e => setCondition(e.target.value as any)} className="select-field">
                    <option value="Baik">Baik ✅</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan ⏳</option>
                    <option value="Rusak">Rusak ❌</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" style={{ padding: '12px 24px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 117, 185, 0.3)' }}>
                {editingItem ? 'Simpan Perubahan Aset' : 'Simpan Aset & Nomor Invoice'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
