'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { ArrowLeftRight, Filter, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function TransactionsPage() {
  const { currentBranchId, branches } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [typeFilter, setTypeFilter] = useState('ALL');

  const transactions = [
    { id: 'TX-2026-001', date: '20 Agt 2026', type: 'Income', category: 'Pembayaran Bimbel', amount: 1250000, account: 'Bank BCA', status: 'Berhasil', notes: 'SPP Bulan Agustus 2026' },
    { id: 'TX-2026-002', date: '20 Agt 2026', type: 'Expense', category: 'Peralatan & Modul', amount: 9250000, account: 'Bank Mandiri', status: 'Berhasil', notes: 'Beli Modul UTBK SNBT 50 Eksemplar' },
    { id: 'TX-2026-003', date: '19 Agt 2026', type: 'Payment', category: 'Payroll Gaji', amount: 6680000, account: 'Bank BCA', status: 'Berhasil', notes: 'Gaji Bambang S., M.Pd.' },
    { id: 'TX-2026-004', date: '18 Agt 2026', type: 'Transfer', category: 'Kas Internal', amount: 5000000, account: 'Kasir Cabang -> BCA', status: 'Berhasil', notes: 'Setoran Kas Tunai ke Bank BCA' },
    { id: 'TX-2026-005', date: '17 Agt 2026', type: 'Adjustment', category: 'Penyesuaian Kas', amount: 150000, account: 'Kasir Cabang', status: 'Berhasil', notes: 'Penyesuaian Kas Uang Kembali' },
  ];

  const filtered = transactions.filter(t => {
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowLeftRight style={{ color: '#2575b9' }} /> Buku Kas & Transaksi Keuangan (General Ledger)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Satu halaman terpadu untuk melihat seluruh aktivitas keuangan (Income, Expense, Transfer, Payment, Adjustment).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="select-field" style={{ width: '200px' }}>
            <option value="ALL">Semua Jenis Transaksi</option>
            <option value="Income">Income (Pemasukan)</option>
            <option value="Expense">Expense (Pengeluaran)</option>
            <option value="Payment">Payment (Pembayaran)</option>
            <option value="Transfer">Transfer (Antar Rekening)</option>
            <option value="Adjustment">Adjustment (Penyesuaian)</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>No. Transaksi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Tanggal</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jenis Transaksi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kategori</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Akun Rekening</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Keterangan</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>{t.id}</td>
                  <td style={{ padding: '14px', color: '#475569' }}>{t.date}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.775rem', background: t.type === 'Income' ? '#dcfce7' : t.type === 'Expense' ? '#fee2e2' : '#e0f2fe', color: t.type === 'Income' ? '#166534' : t.type === 'Expense' ? '#991b1b' : '#0369a1' }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>{t.category}</td>
                  <td style={{ padding: '14px', color: '#475569' }}>{t.account}</td>
                  <td style={{ padding: '14px', fontWeight: 900, color: t.type === 'Income' ? '#16a34a' : t.type === 'Expense' ? '#dc2626' : '#2575b9' }}>
                    {t.type === 'Income' ? `+ Rp ${t.amount.toLocaleString('id-ID')}` : `- Rp ${t.amount.toLocaleString('id-ID')}`}
                  </td>
                  <td style={{ padding: '14px', color: '#475569' }}>{t.notes}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {t.status} ✅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
