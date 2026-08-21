'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export interface ApprovalItem {
  id: string;
  txType: string;
  requestedBy: string;
  amount: number;
  description: string;
  date: string;
  status: 'Pending Review' | 'Finance Approved' | 'Posted' | 'Rejected';
}

export default function ApprovalPage() {
  const { addAuditLog } = useERP();

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'APP-001', txType: 'Pengeluaran Besar', requestedBy: 'Staf Logistik Aset', amount: 14500000, description: 'Pembayaran Vendor Cetak Modul UTBK 500 Eksemplar', date: '20 Agt 2026', status: 'Pending Review' },
    { id: 'APP-002', txType: 'Transfer Dana', requestedBy: 'Staff Keuangan', amount: 5000000, description: 'Setoran Kas Tunai Kasir ke Bank BCA Utama', date: '19 Agt 2026', status: 'Finance Approved' },
    { id: 'APP-003', txType: 'Refund Siswa', requestedBy: 'Petugas PPDB', amount: 1250000, description: 'Refund Pengembalian DP Pembatalan Pendaftaran', date: '18 Agt 2026', status: 'Posted' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const handleApprove = (id: string, desc: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Posted' } : a));
    addAuditLog('Approve Finance Transaction', 'Finance', `Menyetujui transaksi pengeluaran/transfer ${desc}`);
    setNotice(`Transaksi ${desc} telah disetujui & diposting ke Jurnal Keuangan.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleReject = (id: string, desc: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    addAuditLog('Reject Finance Transaction', 'Finance', `Menolak transaksi ${desc}`);
    setNotice(`Transaksi ${desc} telah ditolak.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ color: '#7c3aed' }} /> Persetujuan Transaksi Keuangan (Finance Approval Workflow)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Workflow bertingkat: Input Transaksi → Review Finance → Approval → Posted Ke Jurnal Kas.
          </p>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Daftar Antrean Approval Finansial</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>ID Request</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jenis Transaksi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Pengaju / Dari</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Deskripsi Transaksi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Workflow</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan Approval</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#7c3aed' }}>{app.id}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>{app.txType}</td>
                  <td style={{ padding: '14px', color: '#475569' }}>{app.requestedBy}</td>
                  <td style={{ padding: '14px', color: '#334155', fontWeight: 600 }}>{app.description}</td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#dc2626', fontSize: '1rem' }}>
                    Rp {app.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem', background: app.status === 'Posted' ? '#dcfce7' : app.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: app.status === 'Posted' ? '#166534' : app.status === 'Rejected' ? '#991b1b' : '#92400e' }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {app.status !== 'Posted' && app.status !== 'Rejected' ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleApprove(app.id, app.description)} style={{ padding: '6px 12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                          Approve & Post
                        </button>
                        <button onClick={() => handleReject(app.id, app.description)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Selesai Diproses ✅</span>
                    )}
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
