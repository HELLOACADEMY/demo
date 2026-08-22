'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, PieChart, FileText, CheckCircle2, Clock, Calendar, ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const { currentBranchId, branches } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [period, setPeriod] = useState('Agustus 2026');

  // Transactions State
  const recentTransactions = [
    { id: 'TX-2026-001', date: '20 Agt 2026', desc: 'Pembayaran SPP Rizky Pratama (Agustus 2026)', category: 'Pembayaran Bimbel', income: 1250000, expense: 0, balance: 145800000, status: 'Berhasil', account: 'Bank BCA' },
    { id: 'TX-2026-002', date: '20 Agt 2026', desc: 'Pembayaran Pembelian Modul UTBK SNBT (50 Eksemplar)', category: 'Peralatan & Modul', income: 0, expense: 9250000, balance: 136550000, status: 'Berhasil', account: 'Bank Mandiri' },
    { id: 'TX-2026-003', date: '19 Agt 2026', desc: 'Pembayaran SPP Anisa Rahmawati via QRIS', category: 'Pembayaran Bimbel', income: 1250000, expense: 0, balance: 145800000, status: 'Berhasil', account: 'Bank BCA' },
    { id: 'TX-2026-004', date: '18 Agt 2026', desc: 'Bayar Listrik & WiFi High-Speed Cabang', category: 'Listrik & Internet', income: 0, expense: 3400000, balance: 144550000, status: 'Berhasil', account: 'Kas Utama' },
    { id: 'TX-2026-005', date: '17 Agt 2026', desc: 'Pendaftaran PPDB Calon Siswa Baru (Dimas Setiawan)', category: 'Pendaftaran', income: 2500000, expense: 0, balance: 147950000, status: 'Berhasil', account: 'Bank BRI' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard style={{ color: '#2575b9' }} /> Dashboard Keuangan & Financial Overview
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Gambaran cepat kondisi finansial, saldo kas, piutang, hutang, dan arus kas cabang {activeBranch.name}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="select-field" style={{ width: '160px' }}>
            <option value="Agustus 2026">Agustus 2026</option>
            <option value="Juli 2026">Juli 2026</option>
            <option value="Juni 2026">Juni 2026</option>
          </select>

          <Link href="/finance/income" style={{ padding: '10px 16px', background: '#10b981', color: '#ffffff', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            + Catat Pemasukan
          </Link>
          <Link href="/finance/expenses" style={{ padding: '10px 16px', background: '#ef4444', color: '#ffffff', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            + Catat Pengeluaran
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Pendapatan</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>Rp 184.500.000</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +14.2% dari bulan lalu
          </div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Pengeluaran</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626' }}>Rp 48.200.000</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Gaji, Sewa, Ops & Listrik</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Saldo Kas & Bank</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7' }}>Rp 136.300.000</div>
          <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, marginTop: '4px' }}>Kasir, BCA, BRI, Mandiri</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Piutang (Receivable)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706' }}>Rp 12.500.000</div>
          <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, marginTop: '4px' }}>10 Tagihan Belum Bayar</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Laba Bersih (Net Profit)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1d4ed8' }}>Rp 136.300.000</div>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, marginTop: '4px' }}>Pendapatan - Beban</div>
        </div>
      </div>

      {/* Visual Chart Bars Simulation */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#2575b9' }} /> Grafik Pendapatan vs Pengeluaran (Cash Flow Stream 2026)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Update Otomatis Realtime</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', height: '180px', padding: '20px 10px 10px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          {[
            { month: 'Mei', inc: 70, exp: 30 },
            { month: 'Jun', inc: 85, exp: 35 },
            { month: 'Jul', inc: 90, exp: 40 },
            { month: 'Agt', inc: 100, exp: 28 },
          ].map((item, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                <div style={{ width: '28px', height: `${item.inc}%`, background: '#10b981', borderRadius: '6px 6px 0 0' }} title={`Pendapatan: ${item.inc}%`} />
                <div style={{ width: '28px', height: `${item.exp}%`, background: '#ef4444', borderRadius: '6px 6px 0 0' }} title={`Pengeluaran: ${item.exp}%`} />
              </div>
              <span style={{ fontSize: '0.775rem', fontWeight: 800, color: '#475569' }}>{item.month}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '14px', fontSize: '0.825rem', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534' }}>
            <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} /> Pendapatan Uang Masuk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b' }}>
            <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px' }} /> Pengeluaran Beban
          </div>
        </div>
      </div>

      {/* Tabel Transaksi Terbaru */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeftRight size={18} style={{ color: '#2575b9' }} /> Transaksi Keuangan Terbaru (Buku Kas Ledger)
          </h3>
          <Link href="/finance/transactions" style={{ fontSize: '0.825rem', color: '#2575b9', fontWeight: 800, textDecoration: 'none' }}>
            Lihat Seluruh Transaksi →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>No. Transaksi</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Tanggal</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Keterangan</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Kategori</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Rekening Akun</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Pemasukan (+)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Pengeluaran (-)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>{tx.id}</td>
                  <td style={{ padding: '14px', color: '#475569' }}>{tx.date}</td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>{tx.desc}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontWeight: 700, fontSize: '0.775rem' }}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{tx.account}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#16a34a' }}>
                    {tx.income ? `+ Rp ${tx.income.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#dc2626' }}>
                    {tx.expense ? `- Rp ${tx.expense.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {tx.status} ✅
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
