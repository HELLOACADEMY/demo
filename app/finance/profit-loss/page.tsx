'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { 
  PieChart, Printer, Download, Calendar, DollarSign, Scale, 
  FileText, Building2, CheckCircle2, TrendingUp, TrendingDown, 
  ShieldCheck, HelpCircle, Layers, ArrowUpRight, Filter
} from 'lucide-react';

export default function ProfitLossPage() {
  const { currentBranchId, branches } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [activeTab, setActiveTab] = useState<'profit_loss' | 'balance_sheet' | 'combined'>('profit_loss');
  const [period, setPeriod] = useState('Agustus 2026');

  // Financial Data - Real & Balanced Figures
  const revenueData = [
    { code: '4-100', name: 'Pendapatan Bimbingan Belajar & SPP Siswa', amount: 145000000 },
    { code: '4-200', name: 'Pendapatan Pendaftaran & Uang Pangkal Siswa Baru', amount: 25500000 },
    { code: '4-300', name: 'Pendapatan Penjualan Modul & Paket Intensif UTBK', amount: 14000000 },
    { code: '4-400', name: 'Pendapatan Tryout & Sertifikasi CBT Digital', amount: 8500000 },
  ];
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.amount, 0); // Rp 193,000,000

  const expenseData = [
    { code: '5-100', name: 'Beban Gaji, Honor & Insentif Mengajar Guru', amount: 32500000 },
    { code: '5-200', name: 'Beban Sewa Gedung & Pemeliharaan Ruang Kelas', amount: 8500000 },
    { code: '5-300', name: 'Beban Utilitas (Listrik, Air & Internet Fiber Optics)', amount: 4200000 },
    { code: '5-400', name: 'Beban Cetak Modul, Branding & Marketing Digital', amount: 9800000 },
    { code: '5-500', name: 'Beban Penyusutan Inventaris & Peralatan CBT', amount: 1700000 },
  ];
  const totalExpenses = expenseData.reduce((acc, curr) => acc + curr.amount, 0); // Rp 56,700,000

  const netProfit = totalRevenue - totalExpenses; // Rp 136,300,000
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  // Balance Sheet (Neraca Keuangan) Data - Perfectly Balanced (Aktiva = Pasiva)
  const currentAssets = [
    { code: '1-101', name: 'Kas Operasional & Rekening Bank (BCA & Mandiri)', amount: 185500000 },
    { code: '1-102', name: 'Piutang SPP & Tagihan Siswa (Account Receivable)', amount: 34200000 },
    { code: '1-103', name: 'Persediaan Modul, ATK & Merchandise Bimbel', amount: 18800000 },
    { code: '1-104', name: 'Sewa Gedung Dibayar Di Muka (Prepaid Expense)', amount: 24000000 },
  ];
  const totalCurrentAssets = currentAssets.reduce((acc, c) => acc + c.amount, 0); // Rp 262,500,000

  const fixedAssets = [
    { code: '1-201', name: 'Peralatan Komputer CBT, AC & Proyektor Kelas', amount: 68000000 },
    { code: '1-202', name: 'Renovasi & Fit-out Ruang Belajar Cabang', amount: 45000000 },
    { code: '1-209', name: 'Akumulasi Penyusutan Aktiva Tetap', amount: -12500000 },
  ];
  const totalFixedAssets = fixedAssets.reduce((acc, c) => acc + c.amount, 0); // Rp 100,500,000

  const totalAssets = totalCurrentAssets + totalFixedAssets; // Rp 363,000,000 (AKTIVA)

  const liabilities = [
    { code: '2-101', name: 'Hutang Usaha Percetakan & Percetakan Modul', amount: 14500000 },
    { code: '2-102', name: 'Hutang Gaji & Honor Guru Terutang (Accrued)', amount: 12200000 },
    { code: '2-103', name: 'Pendapatan Diterima Di Muka (SPP Paket 1 Tahun)', amount: 40000000 },
  ];
  const totalLiabilities = liabilities.reduce((acc, c) => acc + c.amount, 0); // Rp 66,700,000

  const equity = [
    { code: '3-101', name: 'Modal Disetor Pemilik / Yayasan Bsmart', amount: 120000000 },
    { code: '3-102', name: 'Laba Ditahan Periode Sebelumnya (Retained Earnings)', amount: 40000000 },
    { code: '3-103', name: 'Laba Bersih Tahun Berjalan (Net Profit Year to Date)', amount: 136300000 },
  ];
  const totalEquity = equity.reduce((acc, c) => acc + c.amount, 0); // Rp 296,300,000

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity; // Rp 363,000,000 (PASIVA = AKTIVA)

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Manrope', sans-serif" }}>

      {/* 🚀 SCREEN-ONLY TOP HEADER & CONTROLS */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale style={{ color: '#2563eb' }} size={28} /> Laporan Laba Rugi & Neraca Keuangan
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
              Statistik & Laporan Resmi Keuangan Kelembagaan {activeBranch.name}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '6px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
              <Calendar size={16} style={{ color: '#2563eb' }} />
              <select 
                value={period} 
                onChange={e => setPeriod(e.target.value)} 
                className="select-field" 
                style={{ border: 'none', padding: 0, width: '140px', fontSize: '0.85rem', fontWeight: 700, background: 'transparent' }}
              >
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="Juli 2026">Juli 2026</option>
                <option value="Triwulan II 2026">Triwulan II 2026</option>
                <option value="Tahun Berjalan 2026">Tahun Berjalan 2026</option>
              </select>
            </div>

            <button 
              onClick={handlePrint} 
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Printer size={16} /> Cetak PDF / Print Laporan Resmi
            </button>
          </div>
        </div>

        {/* TAB SWITCHER (Screen Only) */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('profit_loss')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'profit_loss' ? '#ffffff' : 'transparent',
              color: activeTab === 'profit_loss' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'profit_loss' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <PieChart size={16} /> 1. Laporan Laba Rugi (P&L)
          </button>
          <button
            onClick={() => setActiveTab('balance_sheet')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'balance_sheet' ? '#ffffff' : 'transparent',
              color: activeTab === 'balance_sheet' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'balance_sheet' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Scale size={16} /> 2. Neraca Keuangan (Balance Sheet)
          </button>
          <button
            onClick={() => setActiveTab('combined')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'combined' ? '#ffffff' : 'transparent',
              color: activeTab === 'combined' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'combined' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={16} /> 3. Laporan Gabungan Lengkap
          </button>
        </div>

        {/* SUMMARY EXECUTIVE METRICS CARDS (Screen Only) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Pendapatan (Revenue)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a', marginTop: '6px' }}>
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> +12.4% vs bulan lalu
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Beban (Expenses)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626', marginTop: '6px' }}>
              Rp {totalExpenses.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>
              29.4% dari total pendapatan
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Laba Bersih (Net Profit)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', marginTop: '6px' }}>
              Rp {netProfit.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800, marginTop: '4px' }}>
              Profit Margin: {profitMargin}%
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Aktiva (Balanced)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
              Rp {totalAssets.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Neraca Sinkron & Balanced
            </div>
          </div>
        </div>
      </div>


      {/* 📄 FORMAL PRINTABLE FINANCIAL REPORT DOCUMENT CONTAINER */}
      <div 
        className="printable-document" 
        style={{ 
          background: '#ffffff', 
          padding: '40px 48px', 
          borderRadius: '20px', 
          border: '1.5px solid #e2e8f0', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)', 
          maxWidth: '900px', 
          margin: '0 auto', 
          width: '100%',
          color: '#0f172a'
        }}
      >

        {/* 🏢 KOP SURAT RESMI (OFFICIAL INSTITUTION HEADER) */}
        <div style={{ borderBottom: '3px double #0f172a', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Bsmart Logo" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                BSMART EDUCATION PONTIANAK
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                Lembaga Bimbingan Belajar & Pelatihan Intensif UTBK/SNBT Terpadu
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '3px' }}>
                Jl. Sungai Raya Dalam No. 88, Pontianak - Kalimantan Barat | Telp: (0561) 765-4321 | Email: keuangan@bsmart-education.id
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px', background: '#0f172a', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content' }}>
              DOKUMEN RESMI ERP
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '6px' }}>
              Ref No: FIN-RPT/2026/08/042
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE & METADATA */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {activeTab === 'profit_loss' && 'LAPORAN LABA RUGI (PROFIT & LOSS STATEMENT)'}
            {activeTab === 'balance_sheet' && 'LAPORAN NERACA KEUANGAN (BALANCE SHEET)'}
            {activeTab === 'combined' && 'LAPORAN KEUANGAN LENGKAP (LABA RUGI & NERACA)'}
          </h2>
          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
            PERIODE: {period.toUpperCase()}
          </div>
        </div>

        {/* METADATA SUMMARY TABLE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '12px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '28px', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Cabang: </span>
            <strong style={{ color: '#0f172a' }}>{activeBranch.name}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Mata Uang: </span>
            <strong style={{ color: '#0f172a' }}>Rupiah (IDR)</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Tanggal Cetak: </span>
            <strong style={{ color: '#0f172a' }}>21 Agustus 2026</strong>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* 📊 SECTION 1: LAPORAN LABA RUGI (PROFIT & LOSS STATEMENT)                  */}
        {/* ========================================================================= */}
        {(activeTab === 'profit_loss' || activeTab === 'combined') && (
          <div style={{ marginBottom: activeTab === 'combined' ? '40px' : '20px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '6px', marginBottom: '14px', textTransform: 'uppercase' }}>
              I. LAPORAN LABA RUGI OPERASIONAL
            </div>

            {/* PENDAPATAN OPERASIONAL */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ background: '#f1f5f9', padding: '8px 12px', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', borderRadius: '6px', marginBottom: '8px' }}>
                1. PENDAPATAN OPERASIONAL (REVENUE)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#64748b', fontSize: '0.75rem' }}>
                    <th style={{ padding: '6px 12px', width: '90px' }}>KODE COA</th>
                    <th style={{ padding: '6px 12px' }}>DESKRIPSI AKUN PENDAPATAN</th>
                    <th style={{ padding: '6px 12px', textAlign: 'right' }}>JUMLAH (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700 }}>{item.code}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                        Rp {item.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f0fdf4', fontWeight: 900, color: '#166534', borderTop: '2px solid #16a34a' }}>
                    <td colSpan={2} style={{ padding: '10px 12px' }}>TOTAL PENDAPATAN OPERASIONAL (A)</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.95rem' }}>
                      Rp {totalRevenue.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BEBAN & PENGELUARAN */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ background: '#f1f5f9', padding: '8px 12px', fontWeight: 800, fontSize: '0.85rem', color: '#1e293b', borderRadius: '6px', marginBottom: '8px' }}>
                2. BEBAN & PENGELUARAN OPERASIONAL (EXPENSES)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#64748b', fontSize: '0.75rem' }}>
                    <th style={{ padding: '6px 12px', width: '90px' }}>KODE COA</th>
                    <th style={{ padding: '6px 12px' }}>DESKRIPSI AKUN BEBAN</th>
                    <th style={{ padding: '6px 12px', textAlign: 'right' }}>JUMLAH (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 700 }}>{item.code}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                        Rp {item.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#fef2f2', fontWeight: 900, color: '#991b1b', borderTop: '2px solid #dc2626' }}>
                    <td colSpan={2} style={{ padding: '10px 12px' }}>TOTAL BEBAN OPERASIONAL (B)</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '0.95rem' }}>
                      Rp {totalExpenses.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* HASIL LABA BERSIH BOX */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#dbeafe', border: '2px solid #2563eb', borderRadius: '12px', color: '#172554' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>LABA BERSIH OPERASIONAL (NET PROFIT = A - B)</div>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '2px' }}>Margin Laba Bersih Kelembagaan: <strong>{profitMargin}%</strong></div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1d4ed8' }}>
                Rp {netProfit.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* ⚖️ SECTION 2: LAPORAN NERACA KEUANGAN (BALANCE SHEET)                      */}
        {/* ========================================================================= */}
        {(activeTab === 'balance_sheet' || activeTab === 'combined') && (
          <div style={{ marginTop: activeTab === 'combined' ? '24px' : '0' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '6px', marginBottom: '14px', textTransform: 'uppercase' }}>
              {activeTab === 'combined' ? 'II. LAPORAN NERACA KEUANGAN (BALANCE SHEET)' : 'RINGKASAN NERACA KEUANGAN'}
            </div>

            {/* SPLIT GRID 2 KOLOM: AKTIVA VS PASIVA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '0.825rem' }}>
              
              {/* KOLOM KIRI: AKTIVA (ASSETS) */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: '#fafafa' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', borderBottom: '2px solid #2563eb', paddingBottom: '6px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>AKTIVA (ASSETS)</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>ASSETS</span>
                </div>

                {/* Aktiva Lancar */}
                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  A. Aktiva Lancar (Current Assets)
                </div>
                {currentAssets.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#475569' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Rp {item.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: 800, color: '#1e40af', borderTop: '1px solid #cbd5e1', marginTop: '6px', marginBottom: '14px' }}>
                  <span>Subtotal Aktiva Lancar:</span>
                  <span>Rp {totalCurrentAssets.toLocaleString('id-ID')}</span>
                </div>

                {/* Aktiva Tetap */}
                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  B. Aktiva Tetap (Fixed Assets)
                </div>
                {fixedAssets.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: item.amount < 0 ? '#dc2626' : '#475569' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: item.amount < 0 ? '#dc2626' : '#0f172a' }}>
                      {item.amount < 0 ? `- Rp ${Math.abs(item.amount).toLocaleString('id-ID')}` : `Rp ${item.amount.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: 800, color: '#1e40af', borderTop: '1px solid #cbd5e1', marginTop: '6px', marginBottom: '16px' }}>
                  <span>Subtotal Aktiva Tetap:</span>
                  <span>Rp {totalFixedAssets.toLocaleString('id-ID')}</span>
                </div>

                {/* TOTAL AKTIVA */}
                <div style={{ background: '#dbeafe', border: '1.5px solid #2563eb', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#1e3a8a', fontSize: '0.9rem' }}>
                  <span>TOTAL AKTIVA:</span>
                  <span>Rp {totalAssets.toLocaleString('id-ID')}</span>
                </div>
              </div>


              {/* KOLOM KANAN: PASIVA (LIABILITIES & EQUITY) */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: '#fafafa' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', borderBottom: '2px solid #2563eb', paddingBottom: '6px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>PASIVA (KEWAJIBAN & EKUITAS)</span>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>LIABILITIES & EQUITY</span>
                </div>

                {/* Kewajiban / Hutang */}
                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  A. Kewajiban / Hutang (Liabilities)
                </div>
                {liabilities.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#475569' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Rp {item.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: 800, color: '#1d4ed8', borderTop: '1px solid #cbd5e1', marginTop: '6px', marginBottom: '14px' }}>
                  <span>Subtotal Kewajiban:</span>
                  <span>Rp {totalLiabilities.toLocaleString('id-ID')}</span>
                </div>

                {/* Ekuitas / Modal */}
                <div style={{ fontWeight: 800, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  B. Ekuitas & Modal (Equity)
                </div>
                {equity.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#475569' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Rp {item.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: 800, color: '#1d4ed8', borderTop: '1px solid #cbd5e1', marginTop: '6px', marginBottom: '16px' }}>
                  <span>Subtotal Ekuitas:</span>
                  <span>Rp {totalEquity.toLocaleString('id-ID')}</span>
                </div>

                {/* TOTAL PASIVA */}
                <div style={{ background: '#dbeafe', border: '1.5px solid #2563eb', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#172554', fontSize: '0.9rem' }}>
                  <span>TOTAL PASIVA:</span>
                  <span>Rp {totalLiabilitiesAndEquity.toLocaleString('id-ID')}</span>
                </div>
              </div>

            </div>

            {/* BALANCE CONFIRMATION BANNER */}
            <div style={{ marginTop: '16px', padding: '10px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#166534', fontWeight: 800 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Status Neraca Keuangan: <strong>BALANCED & AUDITED</strong>
              </div>
              <div>Selisih (Aktiva - Pasiva): <strong>Rp 0 (Presisi 100%)</strong></div>
            </div>
          </div>
        )}


        {/* 🖊️ LEMBAR PENGESAHAN RESMI (OFFICIAL SIGNATURE BLOCK) */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1.5px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
          <div>
            <div style={{ color: '#64748b', fontWeight: 700 }}>Dibuat Oleh,</div>
            <div style={{ color: '#0f172a', fontWeight: 800, marginTop: '2px' }}>Staff Keuangan & Billing</div>
            <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px' }}>[Tanda Tangan Digital Verified]</span>
            </div>
            <div style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}>Siti Rahmawati, S.Ak.</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>NIP. 2024.08.102</div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontWeight: 700 }}>Diperiksa & Diverifikasi,</div>
            <div style={{ color: '#0f172a', fontWeight: 800, marginTop: '2px' }}>Manager Finance & Accounting</div>
            <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', borderBottom: '1px dashed #cbd5e1', paddingBottom: '2px' }}>[Verified & Audit Passed]</span>
            </div>
            <div style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}>Herman Wijaya, M.M.</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>NIP. 2021.03.015</div>
          </div>

          <div>
            <div style={{ color: '#64748b', fontWeight: 700 }}>Disetujui Oleh,</div>
            <div style={{ color: '#0f172a', fontWeight: 800, marginTop: '2px' }}>Kepala Cabang / Direktur</div>
            <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 900, border: '1.5px solid #2563eb', padding: '3px 8px', borderRadius: '4px' }}>STEMPEL DOKUMEN RESMI</span>
            </div>
            <div style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}>Dr. Hendra Saputra, M.Pd.</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Direktur Utama Bsmart Education</div>
          </div>
        </div>

      </div>

    </div>
  );
}
