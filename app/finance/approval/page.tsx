'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Image as ImageIcon, FileCheck, X } from 'lucide-react';

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
  const { invoices, approvePaymentProof, rejectPaymentProof, addAuditLog } = useERP();

  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    { id: 'APP-001', txType: 'Pengeluaran Besar', requestedBy: 'Staf Logistik Aset', amount: 14500000, description: 'Pembayaran Vendor Cetak Modul UTBK 500 Eksemplar', date: '20 Agt 2026', status: 'Pending Review' },
    { id: 'APP-002', txType: 'Transfer Dana', requestedBy: 'Staff Keuangan', amount: 5000000, description: 'Setoran Kas Tunai Kasir ke Bank BCA Utama', date: '19 Agt 2026', status: 'Finance Approved' },
    { id: 'APP-003', txType: 'Refund Siswa', requestedBy: 'Petugas PPDB', amount: 1250000, description: 'Refund Pengembalian DP Pembatalan Pendaftaran', date: '18 Agt 2026', status: 'Posted' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);
  const [previewProofModal, setPreviewProofModal] = useState<any | null>(null);

  // Invoices needing Admin ACC
  const pendingInvoices = invoices.filter(i => i.status === 'Menunggu ACC Admin');

  const handleACCInvoice = (inv: any) => {
    approvePaymentProof(inv.id);
    setNotice(`Pembayaran Bukti Transfer invoice ${inv.invoiceNumber} (${inv.studentName}) sebesar Rp ${inv.amount.toLocaleString('id-ID')} BERHASIL DI-ACC & STATUS LUNAS! ✅`);
    setPreviewProofModal(null);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleRejectInvoice = (inv: any) => {
    rejectPaymentProof(inv.id, 'Bukti transfer tidak dapat diverifikasi');
    setNotice(`Bukti transfer invoice ${inv.invoiceNumber} telah ditolak. Status dikembalikan ke Belum Bayar.`);
    setPreviewProofModal(null);
    setTimeout(() => setNotice(null), 5000);
  };

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
            <ShieldCheck style={{ color: '#2563eb' }} /> Persetujuan & ACC Bukti Pembayaran Wali Siswa
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Panel Admin Keuangan: Verifikasi bukti transfer manual wali murid (ACC/Tolak) dan approval pengeluaran kas.
          </p>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* SECTION 1: VERIFIKASI & ACC BUKTI TRANSFER WALI MURID */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1.5px solid #bfdbfe', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck style={{ color: '#2563eb' }} /> Antrean Bukti Transfer Wali Siswa (Perlu ACC Admin)
          </h3>
          <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
            {pendingInvoices.length} Tagihan Menunggu ACC
          </span>
        </div>

        {pendingInvoices.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
            <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 800, color: '#0f172a' }}>Tidak ada antrean bukti transfer wali murid saat ini.</div>
            <div style={{ fontSize: '0.825rem', marginTop: '4px' }}>Seluruh bukti pembayaran transfer manual yang diunggah wali siswa telah diproses & diverifikasi.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#eff6ff', borderBottom: '2px solid #bfdbfe', textAlign: 'left', color: '#1e40af' }}>
                  <th style={{ padding: '14px', fontWeight: 800 }}>No. Invoice</th>
                  <th style={{ padding: '14px', fontWeight: 800 }}>Siswa & Wali Murid</th>
                  <th style={{ padding: '14px', fontWeight: 800 }}>Jenis Tagihan</th>
                  <th style={{ padding: '14px', fontWeight: 800 }}>Transfer Bank Pengirim</th>
                  <th style={{ padding: '14px', fontWeight: 800 }}>Nominal (Rp)</th>
                  <th style={{ padding: '14px', fontWeight: 800, textAlign: 'center' }}>Bukti Gambar</th>
                  <th style={{ padding: '14px', fontWeight: 800, textAlign: 'center' }}>Tindakan ACC Admin</th>
                </tr>
              </thead>
              <tbody>
                {pendingInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0', background: '#fffbeb' }}>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#2563eb' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{inv.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wali: {inv.senderName || 'Ibu Susanti'}</div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#1e40af' }}>{inv.feeType}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{inv.senderBank || inv.paymentMethod || 'Bank BCA'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tgl: {inv.transferDate || 'Hari ini'}</div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 900, color: '#16a34a', fontSize: '1rem' }}>
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <button
                        onClick={() => setPreviewProofModal(inv)}
                        style={{ padding: '6px 12px', background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> Lihat Bukti
                      </button>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleACCInvoice(inv)}
                          style={{ padding: '8px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckCircle2 size={14} /> ACC (Disetujui ✅)
                        </button>
                        <button
                          onClick={() => handleRejectInvoice(inv)}
                          style={{ padding: '8px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <XCircle size={14} /> Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: WORKFLOW APPROVAL PENGELUARAN KAS GENERAL */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Daftar Antrean Approval Finansial Pengeluaran & Operasional</h3>

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
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2563eb' }}>{app.id}</td>
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

      {/* MODAL PREVIEW BUKTI TRANSFER UNTUK ACC ADMIN */}
      {previewProofModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Verifikasi Bukti Transfer Wali Siswa</div>
              <button onClick={() => setPreviewProofModal(null)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No. Invoice: <strong>{previewProofModal.invoiceNumber}</strong> ({previewProofModal.feeType})</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Siswa: <strong>{previewProofModal.studentName}</strong></div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Wali Pengirim: <strong>{previewProofModal.senderName || 'Ibu Susanti'} ({previewProofModal.senderBank || 'BCA'})</strong></div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>Nominal: Rp {previewProofModal.amount.toLocaleString('id-ID')}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Gambar Bukti Transfer Terlampir:</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewProofModal.paymentProofUrl || '/images/receipt-dummy.png'}
                  alt="Bukti Transfer Uploaded"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '10px', border: '1.5px solid #cbd5e1', background: '#f8fafc', padding: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleRejectInvoice(previewProofModal)}
                style={{ flex: 1, padding: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <XCircle size={16} /> Tolak Transfer
              </button>
              <button
                onClick={() => handleACCInvoice(previewProofModal)}
                style={{ flex: 1.5, padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CheckCircle2 size={16} /> ACC & Setujui Lunas ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
