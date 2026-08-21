'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { TrendingDown, Plus, Filter, CheckCircle2, Trash2, Edit, X, DollarSign, Building2, ShoppingCart } from 'lucide-react';

export interface ExpenseRecord {
  id: string;
  txNumber: string;
  date: string;
  vendor: string;
  category: 'Gaji' | 'Sewa' | 'Listrik' | 'Internet' | 'Operasional' | 'Marketing' | 'Peralatan' | 'Transportasi' | 'Maintenance' | 'Lainnya';
  amount: number;
  paymentMethod: string;
  notes: string;
  receiptUrl?: string;
}

export default function ExpensesPage() {
  const { currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    { id: 'exp-1', txNumber: 'EXP-2026-08-001', date: '20 Agt 2026', vendor: 'PLN Persero & Indihome Telkom', category: 'Listrik', amount: 3400000, paymentMethod: 'Transfer Bank Mandiri', notes: 'Tagihan Listrik & Internet WiFi High-Speed', receiptUrl: '/images/receipt-dummy.png' },
    { id: 'exp-2', txNumber: 'EXP-2026-08-002', date: '19 Agt 2026', vendor: 'PT Sinar Jaya Printing', category: 'Peralatan', amount: 9250000, paymentMethod: 'Transfer Bank BCA', notes: 'Cetak 500 Eksemplar Modul SNBT 2026', receiptUrl: '/images/receipt-dummy.png' },
    { id: 'exp-3', txNumber: 'EXP-2026-08-003', date: '15 Agt 2026', vendor: 'Meta Ads & Google Marketing', category: 'Marketing', amount: 4500000, paymentMethod: 'Kartu Kredit Corporate', notes: 'Iklan Promosi PPDB Gelombang II', receiptUrl: '/images/receipt-dummy.png' },
    { id: 'exp-4', txNumber: 'EXP-2026-08-004', date: '10 Agt 2026', vendor: 'CV Servis AC Pontianak', category: 'Maintenance', amount: 1200000, paymentMethod: 'Kasir Tunai Cabang', notes: 'Maintenance & Cuci AC 8 Unit Kelas', receiptUrl: '/images/receipt-dummy.png' },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<ExpenseRecord | null>(null);

  // Form State
  const [txNumber, setTxNumber] = useState('');
  const [date, setDate] = useState('20 Agt 2026');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Operasional');
  const [amount, setAmount] = useState(1500000);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [notes, setNotes] = useState('');

  const [notice, setNotice] = useState<string | null>(null);

  const filteredExpenses = expenses.filter(exp => {
    if (filterCategory !== 'ALL' && exp.category !== filterCategory) return false;
    return true;
  });

  const totalExpenseAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleOpenAddModal = () => {
    setEditingExp(null);
    setTxNumber(`EXP-2026-08-${Math.floor(100 + Math.random() * 900)}`);
    setDate('20 Agt 2026');
    setVendor('');
    setCategory('Operasional');
    setAmount(1500000);
    setPaymentMethod('Transfer Bank BCA');
    setNotes('');
    setShowModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !amount) return;

    if (editingExp) {
      setExpenses(prev => prev.map(eItem => eItem.id === editingExp.id ? {
        ...eItem,
        txNumber,
        date,
        vendor,
        category,
        amount: Number(amount),
        paymentMethod,
        notes
      } : eItem));
      addAuditLog('Update Expense Record', 'Finance', `Memperbarui transaksi pengeluaran ${txNumber} (${vendor})`);
      setNotice(`Pengeluaran ${txNumber} berhasil diperbarui.`);
    } else {
      const newExp: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        txNumber,
        date,
        vendor,
        category,
        amount: Number(amount),
        paymentMethod,
        notes
      };
      setExpenses(prev => [newExp, ...prev]);
      addAuditLog('Create Expense Record', 'Finance', `Menambah pengeluaran baru ${txNumber} - Rp ${Number(amount).toLocaleString('id-ID')} (${vendor})`);
      setNotice(`Pengeluaran baru ${txNumber} berhasil dicatat.`);
    }

    setShowModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDelete = (id: string, tx: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan pengeluaran ${tx}?`)) {
      setExpenses(prev => prev.filter(eItem => eItem.id !== id));
      addAuditLog('Delete Expense Record', 'Finance', `Menghapus catatan pengeluaran ${tx}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingDown style={{ color: '#ef4444' }} /> Manajemen Pengeluaran & Beban Operasional
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pencatatan pengeluaran beban sewa, listrik, wifi, vendor, marketing, dan perawatan sarpras.
          </p>
        </div>

        <button onClick={handleOpenAddModal} style={{ padding: '10px 18px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}>
          <Plus size={16} /> Catat Pengeluaran Baru
        </button>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Filter & Summary Banner */}
      <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={18} style={{ color: '#2575b9' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Filter Kategori Beban:</span>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="select-field" style={{ width: '220px' }}>
            <option value="ALL">Semua Kategori (All)</option>
            <option value="Gaji">Beban Gaji & Honor</option>
            <option value="Sewa">Beban Sewa Gedung</option>
            <option value="Listrik">Beban Listrik</option>
            <option value="Internet">Beban Internet WiFi</option>
            <option value="Operasional">Beban Operasional</option>
            <option value="Marketing">Beban Marketing & Iklan</option>
            <option value="Peralatan">Peralatan & Modul</option>
            <option value="Maintenance">Maintenance & Servis</option>
          </select>
        </div>

        <div style={{ background: '#fee2e2', padding: '10px 18px', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>Total Beban Pengeluaran:</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626' }}>
            Rp {totalExpenseAmount.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Main Expense Table */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>No. Transaksi & Tanggal</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Vendor / Penerima</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kategori Beban</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Metode Pembayaran</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Keterangan Ops</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 800, color: '#ef4444' }}>{exp.txNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.date}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {exp.vendor}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontWeight: 800, fontSize: '0.775rem' }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#dc2626', fontSize: '1rem' }}>
                    - Rp {exp.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px', color: '#2575b9', fontWeight: 700 }}>
                    {exp.paymentMethod}
                  </td>
                  <td style={{ padding: '14px', color: '#475569' }}>
                    {exp.notes}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingExp(exp); setShowModal(true); setTxNumber(exp.txNumber); setVendor(exp.vendor); setAmount(exp.amount); setNotes(exp.notes); }} style={{ padding: '6px 10px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(exp.id, exp.txNumber)} style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Expense */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveExpense} style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingExp ? 'Edit Transaksi Pengeluaran' : 'Catat Pengeluaran Baru'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Vendor / Penerima Uang *</label>
                <input type="text" placeholder="Contoh: PLN Persero / Vendor Modul" value={vendor} onChange={e => setVendor(e.target.value)} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Kategori Beban *</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="select-field">
                    <option value="Operasional">Beban Operasional</option>
                    <option value="Listrik">Beban Listrik</option>
                    <option value="Internet">Beban Internet WiFi</option>
                    <option value="Sewa">Beban Sewa Gedung</option>
                    <option value="Marketing">Beban Marketing & Iklan</option>
                    <option value="Peralatan">Peralatan & Modul</option>
                    <option value="Maintenance">Maintenance & Servis</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nominal Pengeluaran (Rp) *</label>
                  <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Metode Pembayaran *</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="select-field">
                    <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="Kasir Tunai Cabang">Kasir Tunai Cabang</option>
                    <option value="Kartu Kredit Corporate">Kartu Kredit Corporate</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Transaksi</label>
                  <input type="text" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Keterangan Beban</label>
                <input type="text" placeholder="Keterangan pengeluaran" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                Simpan Transaksi Pengeluaran
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
