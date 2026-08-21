'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { FileText, Plus, Printer, Download, Send, CheckCircle2, Clock, AlertTriangle, Eye, X } from 'lucide-react';

export interface InvoiceManagerRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';
}

export default function InvoiceManagerPage() {
  const { currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [invoices, setInvoices] = useState<InvoiceManagerRecord[]>([
    { id: 'inv-1', invoiceNumber: 'INV/2026/08/001', clientName: 'Rizky Pratama (Wali: Ibu Susanti)', issueDate: '01 Agt 2026', dueDate: '05 Agt 2026', amount: 1250000, status: 'Unpaid' },
    { id: 'inv-2', invoiceNumber: 'INV/2026/08/002', clientName: 'Anisa Rahmawati (Wali: Bapak Hartono)', issueDate: '01 Agt 2026', dueDate: '05 Agt 2026', amount: 1250000, status: 'Paid' },
    { id: 'inv-3', invoiceNumber: 'INV/2026/08/003', clientName: 'Bagas Aditya (Wali: Dr. Hendri S.)', issueDate: '01 Agt 2026', dueDate: '05 Agt 2026', amount: 1250000, status: 'Overdue' },
    { id: 'inv-4', invoiceNumber: 'INV/2026/08/004', clientName: 'Dimas Setiawan (Calon Siswa PPDB)', issueDate: '10 Agt 2026', dueDate: '15 Agt 2026', amount: 2500000, status: 'Paid' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const handleSendInvoice = (invNum: string, client: string) => {
    addAuditLog('Send Invoice WA', 'Finance', `Mengirim invoice ${invNum} ke WhatsApp ${client}`);
    setNotice(`Invoice ${invNum} berhasil dikirimkan via WhatsApp.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText style={{ color: '#2575b9' }} /> Manajemen Invoice & Pengagihan Resmi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengelolaan invoice otomatis (Draft, Sent, Unpaid, Paid, Overdue), pencetakan PDF, dan pengiriman via WA.
          </p>
        </div>

        <button onClick={() => window.print()} style={{ padding: '10px 18px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <th style={{ padding: '14px', fontWeight: 700 }}>Nama Klien / Siswa</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Tgl Terbit & Jatuh Tempo</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal Tagihan (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Invoice</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>{inv.clientName}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#475569' }}>Terbit: {inv.issueDate}</div>
                    <div style={{ fontWeight: 800, color: inv.status === 'Overdue' ? '#dc2626' : '#d97706' }}>Tempo: {inv.dueDate}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#10b981', fontSize: '1rem' }}>
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem', background: inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Overdue' ? '#fee2e2' : '#fef3c7', color: inv.status === 'Paid' ? '#166534' : inv.status === 'Overdue' ? '#991b1b' : '#92400e' }}>
                      {inv.status === 'Paid' ? 'PAID ✅' : inv.status === 'Overdue' ? 'OVERDUE ⚠️' : 'UNPAID ⏳'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => window.print()} style={{ padding: '6px 10px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '6px', color: '#0369a1', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                        PDF / Print
                      </button>
                      <button onClick={() => handleSendInvoice(inv.invoiceNumber, inv.clientName)} style={{ padding: '6px 10px', background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
