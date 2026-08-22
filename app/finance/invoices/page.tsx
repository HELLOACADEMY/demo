'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { FileText, Plus, Printer, Download, Send, CheckCircle2, Clock, AlertTriangle, Eye, X, Check } from 'lucide-react';

export default function InvoiceManagerPage() {
  const { invoices, approvePaymentProof, currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [notice, setNotice] = useState<string | null>(null);

  const handleSendInvoice = (invNum: string, client: string) => {
    addAuditLog('Send Invoice WA', 'Finance', `Mengirim invoice ${invNum} ke WhatsApp ${client}`);
    setNotice(`Invoice ${invNum} berhasil dikirimkan via WhatsApp.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleACC = (invId: string, invNum: string) => {
    approvePaymentProof(invId);
    setNotice(`Invoice ${invNum} berhasil di-ACC Admin & berstatus LUNAS! ✅`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText style={{ color: '#2563eb' }} /> Manajemen Invoice & Pengagihan Resmi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengelolaan invoice otomatis (Draft, Sent, Unpaid, Menunggu ACC, Paid), pencetakan PDF, dan verifikasi transfer manual.
          </p>
        </div>

        <button onClick={() => window.print()} style={{ padding: '10px 18px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={16} /> Cetak Daftar Invoice PDF
        </button>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Main Table */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>No. Invoice</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nama Siswa / Murid</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jenis Tagihan & Jatuh Tempo</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal Tagihan (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Invoice</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9', background: inv.status === 'Menunggu ACC Admin' ? '#fffbeb' : 'transparent' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2563eb' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>{inv.studentName}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#475569', fontWeight: 700 }}>{inv.feeType}</div>
                    <div style={{ fontWeight: 700, color: inv.status === 'Jatuh Tempo' ? '#dc2626' : '#d97706', fontSize: '0.775rem' }}>Tempo: {inv.dueDate}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#16a34a', fontSize: '1rem' }}>
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      background: inv.status === 'Lunas' ? '#dcfce7' : inv.status === 'Menunggu ACC Admin' ? '#fef3c7' : '#fee2e2',
                      color: inv.status === 'Lunas' ? '#166534' : inv.status === 'Menunggu ACC Admin' ? '#92400e' : '#991b1b'
                    }}>
                      {inv.status === 'Lunas' ? 'LUNAS ✅' : inv.status === 'Menunggu ACC Admin' ? '⏳ MENUNGGU ACC ADMIN' : 'BELUM BAYAR ⏳'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      {inv.status === 'Menunggu ACC Admin' && (
                        <button onClick={() => handleACC(inv.id, inv.invoiceNumber)} style={{ padding: '6px 12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} /> ACC Pembayaran
                        </button>
                      )}
                      <button onClick={() => window.print()} style={{ padding: '6px 10px', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '6px', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                        PDF / Print
                      </button>
                      <button onClick={() => handleSendInvoice(inv.invoiceNumber, inv.studentName)} style={{ padding: '6px 10px', background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Send size={12} /> Kirim WA
                      </button>
                    </div>
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
