'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Database, Plus, Building2, CreditCard, Users, CheckCircle2, Trash2, Edit } from 'lucide-react';

export default function MasterDataPage() {
  const { currentBranchId, branches } = useERP();
  const [activeTab, setActiveTab] = useState<'accounts' | 'categories' | 'vendors'>('accounts');

  const vendors = [
    { id: 'v-1', name: 'PT Sinar Jaya Printing', contact: '0812-3456-7890 (Pak Sinar)', bankInfo: 'BCA 8830918231', totalTrx: 'Rp 45.000.000 (4 Transaksi)' },
    { id: 'v-2', name: 'PLN Persero Pontianak', contact: '123 (Call Center PLN)', bankInfo: 'Virtual Account PLN', totalTrx: 'Rp 12.400.000 (8 Transaksi)' },
    { id: 'v-3', name: 'CV Servis AC & Teknik', contact: '0852-9876-5432 (Pak Budi)', bankInfo: 'BRI 0019283719', totalTrx: 'Rp 3.600.000 (3 Transaksi)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database style={{ color: '#2575b9' }} /> Master Data Finansial (Rekening, Kategori & Vendor)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengaturan data dasar akun rekening kas/bank, kategori transaksi, dan data mitra vendor suplier.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('accounts')} style={{ padding: '8px 16px', background: activeTab === 'accounts' ? '#2575b9' : '#ffffff', color: activeTab === 'accounts' ? '#ffffff' : '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
            Akun Rekening
          </button>
          <button onClick={() => setActiveTab('categories')} style={{ padding: '8px 16px', background: activeTab === 'categories' ? '#2575b9' : '#ffffff', color: activeTab === 'categories' ? '#ffffff' : '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
            Kategori Transaksi
          </button>
          <button onClick={() => setActiveTab('vendors')} style={{ padding: '8px 16px', background: activeTab === 'vendors' ? '#2575b9' : '#ffffff', color: activeTab === 'vendors' ? '#ffffff' : '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
            Data Vendor
          </button>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        {activeTab === 'vendors' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Daftar Mitra Vendor & Suplier Sah</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Nama Vendor</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Kontak PIC</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Rekening Pembayaran</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Riwayat Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>{v.name}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{v.contact}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#2575b9' }}>{v.bankInfo}</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 700 }}>{v.totalTrx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Akun Rekening Kas & Bank Terdaftar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ fontWeight: 800, color: '#0284c7' }}>Bank BCA Utama</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No. Rek: 8830192831</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>Rp 98.500.000</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ fontWeight: 800, color: '#0284c7' }}>Bank Mandiri Ops</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No. Rek: 1460019283</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>Rp 28.400.000</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Kategori Pemasukan & Pengeluaran</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontWeight: 900, color: '#166534', marginBottom: '8px' }}>Kategori Pemasukan (Income)</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#065f46' }}>
                  <li>Pembayaran Bimbel SPP Bulanan</li>
                  <li>Pendaftaran PPDB & Uang Pangkal</li>
                  <li>Paket Belajar Intensif UTBK</li>
                  <li>Cicilan Bimbingan</li>
                  <li>Pendapatan Lainnya</li>
                </ul>
              </div>
              <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <div style={{ fontWeight: 900, color: '#991b1b', marginBottom: '8px' }}>Kategori Pengeluaran (Expense)</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#991b1b' }}>
                  <li>Beban Gaji & Honor Mengajar</li>
                  <li>Beban Sewa Gedung & Ruang Kelas</li>
                  <li>Beban Listrik, WiFi & Utilitas</li>
                  <li>Peralatan, Modul & Cetak</li>
                  <li>Marketing & Iklan WA</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
