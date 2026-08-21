'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { CreditCard, Plus, Clock, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Calendar } from 'lucide-react';

export interface PayableRecord {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: 'UNPAID' | 'DUE' | 'OVERDUE' | 'PAID';
  paymentReceipt?: string;
}

export default function PayablePage() {
  const { currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [payables, setPayables] = useState<PayableRecord[]>([
    { id: 'pay-1', vendorName: 'PT Sinar Jaya Printing Modul', invoiceNumber: 'INV-VEN/2026/08/101', invoiceDate: '01 Agt 2026', dueDate: '25 Agt 2026', amount: 14500000, status: 'DUE' },
    { id: 'pay-2', vendorName: 'CV Sarana Meubel Pontianak', invoiceNumber: 'INV-VEN/2026/07/044', invoiceDate: '15 Jul 2026', dueDate: '15 Agt 2026', amount: 8200000, status: 'OVERDUE' },
    { id: 'pay-3', vendorName: 'Gedung Ruko Sui Raya', invoiceNumber: 'INV-RENT/2026/01', invoiceDate: '01 Jan 2026', dueDate: '30 Agt 2026', amount: 45000000, status: 'UNPAID' },
    { id: 'pay-4', vendorName: 'PLN & Telkom Indihome', invoiceNumber: 'INV-UTIL/2026/08', invoiceDate: '05 Agt 2026', dueDate: '15 Agt 2026', amount: 3400000, status: 'PAID', paymentReceipt: '/images/receipt-dummy.png' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const totalPayable = payables.reduce((acc, curr) => acc + curr.amount, 0);
  const unpaidTotal = payables.filter(p => p.status !== 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const overdueTotal = payables.filter(p => p.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);

  const handleMarkPaid = (id: string, vendor: string) => {
    setPayables(prev => prev.map(p => p.id === id ? { ...p, status: 'PAID', paymentReceipt: '/images/receipt-dummy.png' } : p));
    addAuditLog('Pay Payable Invoice', 'Finance', `Pelunasan hutang vendor ${vendor}`);
    setNotice(`Hutang ke ${vendor} berhasil dilunasi.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard style={{ color: '#dc2626' }} /> Manajemen Hutang Usaha (Account Payable)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pemantauan kewajiban pembayaran perusahaan ke vendor, sewa gedung, dan suplier operasional.
          </p>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Dashboard Hutang Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Kewajiban Hutang</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
            Rp {totalPayable.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Semua Vendor & Suplier</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Belum Dibayar (Unpaid)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', margin: '4px 0 2px' }}>
            Rp {unpaidTotal.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Menunggu Pembayaran</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Hutang Terlamat (Overdue)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', margin: '4px 0 2px' }}>
            Rp {overdueTotal.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Melewati Tanggal Jatuh Tempo</div>
        </div>
      </div>

      {/* Main Payable Table */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nama Vendor / Suplier</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>No. Invoice Vendor</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Tgl Invoice & Jatuh Tempo</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal Hutang (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Pembayaran</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {payables.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {p.vendorName}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>
                    {p.invoiceNumber}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#475569' }}>Inv: {p.invoiceDate}</div>
                    <div style={{ fontWeight: 800, color: p.status === 'OVERDUE' ? '#dc2626' : '#d97706' }}>Jatuh Tempo: {p.dueDate}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#dc2626', fontSize: '1rem' }}>
                    Rp {p.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 12px', background: p.status === 'PAID' ? '#dcfce7' : p.status === 'OVERDUE' ? '#fee2e2' : '#fef3c7', color: p.status === 'PAID' ? '#166534' : p.status === 'OVERDUE' ? '#991b1b' : '#92400e', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {p.status === 'PAID' ? 'LUNAS ✅' : p.status === 'OVERDUE' ? 'TERLAMBAT ⚠️' : 'JATUH TEMPO ⏳'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {p.status !== 'PAID' ? (
                      <button onClick={() => handleMarkPaid(p.id, p.vendorName)} style={{ padding: '6px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                        Konfirmasi Pelunasan
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Pelunasan Selesai ✅</span>
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
