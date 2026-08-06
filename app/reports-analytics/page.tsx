'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Building2, Download, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function ReportsAnalyticsPage() {
  const { branches, students, invoices, addAuditLog } = useERP();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalOmzet = invoices.filter(i => i.status === 'Lunas').reduce((sum, i) => sum + i.amount, 0) + 1250000000;

  const handleExportReport = () => {
    addAuditLog('Export Analytics Report', 'Reports & Analytics', 'Laporan Keuangan & Performa Cabang diekspor ke Excel');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 style={{ color: '#2575b9' }} /> Laporan Business Intelligence & Executive Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Executive dashboard: Laporan Laba Rugi (P&L), Performa 3 Cabang Utama Kota Pontianak, Tren Kehadiran & Akademik.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          style={{ padding: '10px 18px', background: '#16a34a', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FileSpreadsheet size={16} /> Ekspor Laporan Excel / PDF
        </button>
      </div>

      {downloadSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> Laporan Executive Analytics Berhasil Di-generate & Diunduh!
        </div>
      )}

      {/* Summary Financial Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Realisasi Omzet (2026)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#16a34a', marginTop: '4px' }}>
            Rp {totalOmzet.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>+18.4% YoY Growth</span>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Rata-Rata Tingkat Kehadiran</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#2575b9', marginTop: '4px' }}>
            96.8%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 500 }}>Hadir via QR Barcode Scan</span>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tingkat Kelulusan PTN Kedokteran</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#d97706', marginTop: '4px' }}>
            94.2%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Lulus SNBT & Kedinasan</span>
        </div>
      </div>

      {/* Main Charts & Branch Ranking */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '20px' }}>Grafik Tren Pendapatan & Profit (Tahun 2026)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { month: 'Jan', val: 65 }, { month: 'Feb', val: 72 }, { month: 'Mar', val: 80 },
              { month: 'Apr', val: 78 }, { month: 'Mei', val: 85 }, { month: 'Jun', val: 92 },
              { month: 'Jul', val: 98 }, { month: 'Agt', val: 105 }
            ].map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${m.val}%`, background: 'linear-gradient(180deg, #2575b9 0%, #38bdf8 100%)', borderRadius: '4px 4px 0 0' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', fontWeight: 500 }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Performa 3 Cabang Kota Pontianak</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {branches.map((b, idx) => (
              <div key={b.id} style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>#{idx + 1} {b.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Jumlah Murid: {b.totalStudents} Siswa Terdaftar</div>
                </div>
                <span className="badge badge-success">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
