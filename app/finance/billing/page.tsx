'use client';

import React, { useState } from 'react';
import { Receipt, Plus, AlertCircle, DollarSign, Calendar, Filter } from 'lucide-react';
import { useERP } from '@/context/ERPContext';
import Link from 'next/link';

export default function BillingPage() {
  const { filteredInvoices: branchInvoices, setInvoices, students, branches, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('ALL');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const filteredInvoices = feeTypeFilter === 'ALL' ? branchInvoices : branchInvoices.filter(i => i.feeType === feeTypeFilter);

  const handleGenerateMonthlySPP = () => {
    const newInvoices = students.map((s, idx) => ({
      id: `inv-${Date.now()}-${idx}`,
      invoiceNumber: `INV/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      studentName: s.name,
      branchId: s.branchId,
      feeType: 'SPP' as const,
      amount: 1250000,
      dueDate: '2026-08-10',
      status: 'Belum Bayar' as const
    }));
    setInvoices(prev => [...newInvoices, ...prev]);
    addAuditLog('Generate Monthly Invoices', 'Finance', `Invoice SPP bulanan terbit massal untuk ${students.length} siswa`);
    setShowGenerateModal(false);
  };

  const handleSendReminder = (inv: any) => {
    addAuditLog('Send Payment Reminder', 'Finance', `Reminder WhatsApp pembayaran tagihan ${inv.invoiceNumber} dikirim ke wali murid ${inv.studentName}`);
    setReminderSent(inv.invoiceNumber);
    setTimeout(() => setReminderSent(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {reminderSent && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#166534', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} /> Reminder WhatsApp Pembayaran Tagihan {reminderSent} Berhasil Dikirimkan ke Wali Murid!
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt style={{ color: '#2575b9' }} /> Master Biaya & Tagihan (Billing Engine)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Pengelolaan SPP bulanan, uang pangkal, biaya ujian, penerbitan invoice otomatis, dan pengingat jatuh tempo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={feeTypeFilter} onChange={e => setFeeTypeFilter(e.target.value)} className="select-field" style={{ width: '160px' }}>
            <option value="ALL">Semua Biaya</option>
            <option value="SPP">SPP Bulanan</option>
            <option value="Uang Pangkal">Uang Pangkal</option>
            <option value="Buku">Buku & Seragam</option>
            <option value="Ujian">Exam Fee</option>
          </select>
          {(isSuperAdmin || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan') && (
            <button onClick={() => setShowGenerateModal(true)} style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
              + Generate Invoice Massal
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>No. Invoice</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Siswa</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jenis Biaya</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nominal (Rp)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jatuh Tempo</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Cabang</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status Pembayaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tindakan Bayar</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => {
                const brName = branches.find(b => b.id === inv.branchId)?.name || 'Cabang Utama';
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{inv.studentName}</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{inv.feeType}</span></td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#16a34a' }}>Rp {inv.amount.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{inv.dueDate}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${inv.status === 'Lunas' ? 'badge-success' : inv.status === 'Jatuh Tempo' ? 'badge-danger' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {inv.status !== 'Lunas' ? (
                        (currentRole === 'wali_murid' || currentRole === 'siswa') ? (
                          <Link href="/finance/payment" style={{ padding: '6px 12px', background: '#2575b9', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600 }}>
                            Bayar
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleSendReminder(inv)}
                            style={{ padding: '6px 14px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(37, 117, 185, 0.2)' }}
                          >
                            Kirim Reminder Pembayaran
                          </button>
                        )
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Lunas via {inv.paymentMethod}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showGenerateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', padding: '28px', background: '#ffffff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <DollarSign size={48} style={{ color: '#2575b9', margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600 }}>Generate Invoice SPP Massal</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 20px' }}>
              Sistem akan menerbitkan invoice SPP otomatis untuk seluruh <strong>{students.length} siswa aktif</strong> pada bulan ini.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => setShowGenerateModal(false)}>Batal</button>
              <button style={{ flex: 1, padding: '10px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} onClick={handleGenerateMonthlySPP}>Konfirmasi Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
