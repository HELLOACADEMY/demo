'use client';

import React, { useState } from 'react';
import { Receipt, Plus, AlertCircle, DollarSign, Calendar, Filter } from 'lucide-react';
import { useERP } from '@/context/ERPContext';
import Link from 'next/link';

export default function BillingPage() {
  const { filteredInvoices: branchInvoices, setInvoices, students, branches, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('ALL');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showWAModal, setShowWAModal] = useState(false);
  const [selectedInvForWA, setSelectedInvForWA] = useState<any | null>(null);
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

  const handleOpenWAModal = (inv: any) => {
    setSelectedInvForWA(inv);
    setShowWAModal(true);
  };

  const generateWAMessage = (inv: any) => {
    if (!inv) return '';
    return `PENGINGAT TAGIHAN SPP BSMART EDUCATION 📚\n\nYth. Wali Murid dari ${inv.studentName},\n\nDiberitahukan bahwa tagihan sekolah berikut belum terselesaikan:\n\n• No. Invoice: ${inv.invoiceNumber}\n• Jenis Biaya: ${inv.feeType}\n• Total Nominal: Rp ${inv.amount.toLocaleString('id-ID')}\n• Batas Jatuh Tempo: ${inv.dueDate}\n\nRekening Transfer Resmi Bsmart Education:\n• Bank BCA: 888-019-2831 a.n. PT Bsmart Education Pontianak\n• Bank Mandiri: 146-00-988273-1 a.n. PT Bsmart Education Pontianak\n• Bank BRI: 0089-01-002819-53-0 a.n. PT Bsmart Education Pontianak\n\nAtau bayar online & upload bukti transfer di:\nhttp://localhost:3000/finance/payment\n\nTerima kasih atas perhatian Bapak/Ibu. 🙏`;
  };

  const handleSendWAReminderSubmit = () => {
    if (!selectedInvForWA) return;
    addAuditLog('Send Payment Reminder WA', 'Finance', `Reminder WhatsApp pembayaran tagihan ${selectedInvForWA.invoiceNumber} dikirim ke wali murid ${selectedInvForWA.studentName}`);
    setReminderSent(selectedInvForWA.invoiceNumber);
    setShowWAModal(false);

    // Open WhatsApp Web API URL
    const messageText = encodeURIComponent(generateWAMessage(selectedInvForWA));
    const waUrl = `https://api.whatsapp.com/send?phone=628129876543&text=${messageText}`;
    window.open(waUrl, '_blank');

    setTimeout(() => setReminderSent(null), 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {reminderSent && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#166534', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} /> Reminder WhatsApp Pembayaran Tagihan {reminderSent} Berhasil Dikirimkan ke Wali Murid!
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt style={{ color: '#2563eb' }} /> Master Biaya & Tagihan (Billing Engine)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengelolaan SPP bulanan, uang pangkal, penagihan WA wali murid, penerbitan invoice otomatis, dan pengingat jatuh tempo.
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
            <button onClick={() => setShowGenerateModal(true)} style={{ padding: '10px 18px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem' }}>
              + Generate Invoice Massal
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>No. Invoice</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Nama Siswa</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jenis Biaya</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Nominal (Rp)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jatuh Tempo</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Cabang</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status Pembayaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>Tindakan Penagihan</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => {
                const brName = branches.find(b => b.id === inv.branchId)?.name || 'Cabang Utama';
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#2563eb' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>{inv.studentName}</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{inv.feeType}</span></td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#16a34a' }}>Rp {inv.amount.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{inv.dueDate}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${inv.status === 'Lunas' ? 'badge-success' : inv.status === 'Jatuh Tempo' ? 'badge-danger' : 'badge-warning'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      {inv.status !== 'Lunas' ? (
                        (currentRole === 'wali_murid' || currentRole === 'siswa') ? (
                          <Link href="/finance/payment" style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 700 }}>
                            Bayar
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleOpenWAModal(inv)}
                            style={{ padding: '6px 14px', background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            📱 Tagih via WA
                          </button>
                        )
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Lunas via {inv.paymentMethod || 'Instant'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REMINDER WHATSAPP TAGIHAN WALI MURID */}
      {showWAModal && selectedInvForWA && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '520px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📱 Preview Pesan WhatsApp Penagihan SPP
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '16px' }}>
              Pesan pengingat tagihan resmi ini akan dikirimkan langsung ke nomor WhatsApp Wali Murid dari <strong>{selectedInvForWA.studentName}</strong>.
            </div>

            {/* WA Box Chat Style Preview */}
            <div style={{ padding: '16px', background: '#e5ddd5', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
              <div style={{ background: '#dcf8c6', padding: '14px 16px', borderRadius: '10px', fontSize: '0.825rem', color: '#111b21', whiteSpace: 'pre-line', lineHeight: 1.5, border: '1px solid #b7e49b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {generateWAMessage(selectedInvForWA)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }} onClick={() => setShowWAModal(false)}>
                Batal
              </button>
              <button style={{ flex: 1.5, padding: '12px', background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)' }} onClick={handleSendWAReminderSubmit}>
                📱 Kirim Ke WhatsApp Wali Murid
              </button>
            </div>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', padding: '28px', background: '#ffffff', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <DollarSign size={48} style={{ color: '#2563eb', margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Generate Invoice SPP Massal</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 20px' }}>
              Sistem akan menerbitkan invoice SPP otomatis untuk seluruh <strong>{students.length} siswa aktif</strong> pada bulan ini.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }} onClick={() => setShowGenerateModal(false)}>Batal</button>
              <button style={{ flex: 1, padding: '10px', background: '#2563eb', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 800 }} onClick={handleGenerateMonthlySPP}>Konfirmasi Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
