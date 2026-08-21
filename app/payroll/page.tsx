'use client';

import React, { useState } from 'react';
import { DollarSign, Printer, Download, Clock, CheckCircle, Receipt, UserCheck, ShieldCheck, Calendar, CreditCard, Building2, Eye, Check, X, Sparkles } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export interface TeacherPayrollRecord {
  teacherId: string;
  nip: string;
  teacherName: string;
  subject: string;
  teachingHours: number;
  hourlyRate: number;
  bonusKinerja: number;
  potonganBPJS: number;
  paymentStatus: 'Sudah Dibayarkan' | 'Belum Dibayarkan';
  paidDate?: string;
  paymentMethod?: string;
  accountNumber?: string;
}

export default function PayrollPage() {
  const { teachers, branches, addAuditLog, isSuperAdmin, currentRole, currentBranchId } = useERP();

  // State Payroll Records per Teacher
  const [payrollRecords, setPayrollRecords] = useState<TeacherPayrollRecord[]>([
    {
      teacherId: 'tch-1',
      nip: '19850112001',
      teacherName: 'Bambang S., M.Pd.',
      subject: 'Matematika Terapan',
      teachingHours: 42,
      hourlyRate: 150000,
      bonusKinerja: 500000,
      potonganBPJS: 120000,
      paymentStatus: 'Sudah Dibayarkan',
      paidDate: '20 Agustus 2026',
      paymentMethod: 'Transfer Bank BCA',
      accountNumber: 'BCA 8830192831 a.n. Bambang S.'
    },
    {
      teacherId: 'tch-2',
      nip: '19880315002',
      teacherName: 'Dra. Endang Lestari',
      subject: 'Fisika Kuantum',
      teachingHours: 38,
      hourlyRate: 160000,
      bonusKinerja: 450000,
      potonganBPJS: 120000,
      paymentStatus: 'Belum Dibayarkan',
      paidDate: undefined,
      paymentMethod: 'Transfer Bank Mandiri',
      accountNumber: 'Mandiri 1460019283 a.n. Endang L.'
    },
    {
      teacherId: 'tch-3',
      nip: '19920720003',
      teacherName: 'Kevin Sanjaya, S.Si.',
      subject: 'Kimia & Biologi',
      teachingHours: 50,
      hourlyRate: 140000,
      bonusKinerja: 600000,
      potonganBPJS: 120000,
      paymentStatus: 'Sudah Dibayarkan',
      paidDate: '19 Agustus 2026',
      paymentMethod: 'Transfer Bank BCA',
      accountNumber: 'BCA 7720918231 a.n. Kevin S.'
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<TeacherPayrollRecord | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Edit Payment Status Modal State
  const [editStatus, setEditStatus] = useState<'Sudah Dibayarkan' | 'Belum Dibayarkan'>('Sudah Dibayarkan');
  const [editPaidDate, setEditPaidDate] = useState('20 Agustus 2026');
  const [editMethod, setEditMethod] = useState('Transfer Bank BCA');
  const [editAccount, setEditAccount] = useState('BCA 8830192831 a.n. Guru');

  const [notice, setNotice] = useState<string | null>(null);

  const canManagePayroll = isSuperAdmin || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan';

  const handleOpenStatusModal = (rec: TeacherPayrollRecord) => {
    setSelectedRecord(rec);
    setEditStatus(rec.paymentStatus);
    setEditPaidDate(rec.paidDate || '20 Agustus 2026');
    setEditMethod(rec.paymentMethod || 'Transfer Bank BCA');
    setEditAccount(rec.accountNumber || `BCA 8830192831 a.n. ${rec.teacherName}`);
    setShowStatusModal(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setPayrollRecords(prev => prev.map(r => r.teacherId === selectedRecord.teacherId ? {
      ...r,
      paymentStatus: editStatus,
      paidDate: editStatus === 'Sudah Dibayarkan' ? editPaidDate : undefined,
      paymentMethod: editMethod,
      accountNumber: editAccount
    } : r));

    addAuditLog('Update Payroll Payment Status', 'Payroll', `Admin mengubah status payroll ${selectedRecord.teacherName} menjadi ${editStatus} via ${editMethod}`);
    setNotice(`Status pembayaran gaji ${selectedRecord.teacherName} berhasil diperbarui.`);
    setShowStatusModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleViewSlip = (rec: TeacherPayrollRecord) => {
    setSelectedRecord(rec);
    setShowSlipModal(true);
  };

  const handleTriggerPrintSlip = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Metrics
  const totalPaid = payrollRecords.filter(r => r.paymentStatus === 'Sudah Dibayarkan').length;
  const totalUnpaid = payrollRecords.filter(r => r.paymentStatus === 'Belum Dibayarkan').length;
  const totalPayrollValue = payrollRecords.reduce((acc, curr) => {
    const net = (curr.teachingHours * curr.hourlyRate) + curr.bonusKinerja - curr.potonganBPJS;
    return acc + net;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Strict Print CSS for Official Payslip */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-printable-payslip, #official-printable-payslip * {
            visibility: visible !important;
          }
          #official-printable-payslip {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 99999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Page */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign style={{ color: '#2575b9' }} /> Payroll Engine & Slip Gaji Digital Guru
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Kalkulasi otomatis honor mengajar, status pembayaran, tanggal dibayarkan, dan pencetakan slip gaji digital.
          </p>
        </div>
      </div>

      {notice && (
        <div className="no-print" style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> {notice}
        </div>
      )}

      {/* Metric Cards */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Anggaran Payroll Agustus 2026</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', margin: '4px 0 2px' }}>
            Rp {totalPayrollValue.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Honor Jam Mengajar + Bonus</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Sudah Dibayarkan (Lunas)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#166534', margin: '4px 0 2px' }}>
            {totalPaid} Pengajar ✅
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Tercatat Tanggal & Bank Transfer</div>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Belum Dibayarkan (Pending)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', margin: '4px 0 2px' }}>
            {totalUnpaid} Pengajar ⏳
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Menunggu Konfirmasi Transfer</div>
        </div>
      </div>

      {/* Tabel Daftar Payroll Guru */}
      <div className="no-print" style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={20} style={{ color: '#2575b9' }} /> Rekapitulasi Payroll & Status Pembayaran Gaji Guru — Periode Agustus 2026
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px' }}>
              Klik Ubah Status untuk memperbarui status dibayarkan, tanggal bayar, dan metode transfer bank.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>NIP & Nama Pengajar</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Mata Pelajaran</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jam & Honor / Jam</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Gaji Bersih (THP)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Pembayaran</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Tgl Dibayarkan & Via</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {payrollRecords.map(r => {
                const totalNet = (r.teachingHours * r.hourlyRate) + r.bonusKinerja - r.potonganBPJS;
                const isPaid = r.paymentStatus === 'Sudah Dibayarkan';

                return (
                  <tr key={r.teacherId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{r.teacherName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 700 }}>NIP: {r.nip}</div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#334155' }}>
                      {r.subject}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{r.teachingHours} Jam</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>@ Rp {r.hourlyRate.toLocaleString('id-ID')}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 900, color: '#16a34a', fontSize: '1rem' }}>
                        Rp {totalNet.toLocaleString('id-ID')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Includes Bonus Rp {r.bonusKinerja.toLocaleString('id-ID')}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '6px 14px', background: isPaid ? '#dcfce7' : '#fee2e2', color: isPaid ? '#166534' : '#991b1b', borderRadius: '20px', fontWeight: 800, fontSize: '0.775rem', display: 'inline-block' }}>
                        {isPaid ? 'Sudah Dibayarkan ✅' : 'Belum Dibayarkan ⏳'}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      {isPaid ? (
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem' }}>📅 {r.paidDate || '20 Agustus 2026'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 700 }}>🏦 {r.paymentMethod || 'Transfer BCA'}</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontStyle: 'italic' }}>Belum diproses transfer</div>
                      )}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {canManagePayroll && (
                          <button
                            onClick={() => handleOpenStatusModal(r)}
                            style={{ padding: '6px 10px', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CreditCard size={14} /> Ubah Status
                          </button>
                        )}

                        <button
                          onClick={() => handleViewSlip(r)}
                          style={{ padding: '6px 12px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(37, 117, 185, 0.25)' }}
                        >
                          <Receipt size={14} /> Lihat Slip Gaji
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PAYMENT STATUS MODAL */}
      {showStatusModal && selectedRecord && (
        <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveStatus} style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '460px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Ubah Status Pembayaran Payroll Guru
              </div>
              <button type="button" onClick={() => setShowStatusModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px 16px', background: '#e0f2fe', borderRadius: '10px', color: '#0369a1', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px' }}>
              Pengajar: {selectedRecord.teacherName} (NIP: {selectedRecord.nip})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Status Pembayaran Gaji *</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as any)} className="select-field">
                  <option value="Sudah Dibayarkan">Sudah Dibayarkan ✅ (Lunas)</option>
                  <option value="Belum Dibayarkan">Belum Dibayarkan ⏳ (Pending)</option>
                </select>
              </div>

              {editStatus === 'Sudah Dibayarkan' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tanggal Dibayarkan *</label>
                    <input type="text" value={editPaidDate} onChange={e => setEditPaidDate(e.target.value)} required className="input-field" placeholder="20 Agustus 2026" />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Metode Pembayaran (Via Bayar) *</label>
                    <select value={editMethod} onChange={e => setEditMethod(e.target.value)} className="select-field">
                      <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                      <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                      <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                      <option value="BCA Virtual Account">BCA Virtual Account</option>
                      <option value="Tunai Kasir Cabang">Tunai Kasir Cabang</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>No. Rekening & Rekening Tujuan</label>
                    <input type="text" value={editAccount} onChange={e => setEditAccount(e.target.value)} required className="input-field" placeholder="BCA 8830192831 a.n. Guru" />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" onClick={() => setShowStatusModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)' }}>
                Simpan Status & Tanggal Bayar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📄 OFFICIAL DIGITAL PAYSLIP MODAL & PRINT CONTAINER */}
      {selectedRecord && (
        <div id="official-printable-payslip" style={{ display: showSlipModal ? 'block' : 'none', background: '#ffffff', color: '#000000', padding: '32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          
          {/* Modal Header inside screen */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ color: '#2575b9' }} /> Slip Gaji Digital Resmi Dewan Guru
            </div>
            <button onClick={() => setShowSlipModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>

          {/* Kop Surat Printable Sheet */}
          <div style={{ border: '2px solid #000000', borderRadius: '16px', padding: '28px', background: '#ffffff' }}>
            {/* Kop Surat Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px double #000000', paddingBottom: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Logo" style={{ height: '50px', width: 'auto' }} />
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>
                    BSMART EDUCATION PONTIANAK
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#333333' }}>
                    SLIP GAJI RESMI DEWAN GURU & TENAGA PENDIDIK
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#555555' }}>
                    Jl. Sungai Raya Dalam No. 12, Pontianak • Periode: Agustus 2026
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ padding: '6px 16px', background: selectedRecord.paymentStatus === 'Sudah Dibayarkan' ? '#dcfce7' : '#fee2e2', color: selectedRecord.paymentStatus === 'Sudah Dibayarkan' ? '#166534' : '#991b1b', border: '1px solid #000000', borderRadius: '20px', fontWeight: 900, fontSize: '0.85rem' }}>
                  {selectedRecord.paymentStatus === 'Sudah Dibayarkan' ? 'PAID / LUNAS ✅' : 'UNPAID / PENDING ⏳'}
                </span>
              </div>
            </div>

            {/* Profile & Payment Meta */}
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <div>Nama Pengajar: <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedRecord.teacherName}</strong></div>
                <div>NIP Guru: <strong>{selectedRecord.nip}</strong></div>
                <div>Mata Pelajaran: <strong>{selectedRecord.subject}</strong></div>
              </div>
              <div>
                <div>Status Pembayaran: <strong style={{ color: selectedRecord.paymentStatus === 'Sudah Dibayarkan' ? '#166534' : '#dc2626' }}>{selectedRecord.paymentStatus}</strong></div>
                <div>Tanggal Dibayarkan: <strong>{selectedRecord.paidDate || 'Belum Transfer'}</strong></div>
                <div>Metode & Via Transfer: <strong>{selectedRecord.paymentMethod || '-'} ({selectedRecord.accountNumber || '-'})</strong></div>
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', border: '1px solid #000000', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #000000', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', borderRight: '1px solid #000000', fontWeight: 800 }}>Komponen Gaji & Honor</th>
                  <th style={{ padding: '10px 12px', borderRight: '1px solid #000000', fontWeight: 800, textAlign: 'center' }}>Perhitungan / Jam</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right' }}>Jumlah Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', fontWeight: 700 }}>Honor Jam Mengajar Kelas</td>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', textAlign: 'center' }}>{selectedRecord.teachingHours} Jam × Rp {selectedRecord.hourlyRate.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>Rp {(selectedRecord.teachingHours * selectedRecord.hourlyRate).toLocaleString('id-ID')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', fontWeight: 700 }}>Bonus & Tunjangan Kinerja PTN Super Teacher</td>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', textAlign: 'center' }}>Insentif Kinerja</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#166534' }}>+ Rp {selectedRecord.bonusKinerja.toLocaleString('id-ID')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', fontWeight: 700 }}>Potongan BPJS & Kas Pengajar</td>
                  <td style={{ padding: '10px 12px', borderRight: '1px solid #000000', textAlign: 'center' }}>Potongan Tetap</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#991b1b' }}>- Rp {selectedRecord.potonganBPJS.toLocaleString('id-ID')}</td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 900, fontSize: '0.95rem' }}>
                  <td colSpan={2} style={{ padding: '12px', borderRight: '1px solid #000000', textAlign: 'right' }}>TOTAL TAKE HOME PAY (GAJI BERSIH):</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#166534' }}>
                    Rp {((selectedRecord.teachingHours * selectedRecord.hourlyRate) + selectedRecord.bonusKinerja - selectedRecord.potonganBPJS).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signature Box */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', fontSize: '0.8rem' }}>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div>Diterima Oleh,</div>
                <div style={{ height: '48px' }}></div>
                <div style={{ fontWeight: 900, textDecoration: 'underline' }}>{selectedRecord.teacherName}</div>
                <div style={{ fontSize: '0.7rem', color: '#555555' }}>Pengajar Akademi</div>
              </div>

              <div style={{ textAlign: 'center', width: '200px' }}>
                <div>Pontianak, {selectedRecord.paidDate || '20 Agustus 2026'}</div>
                <div style={{ fontWeight: 800 }}>Finance & Payroll Manager</div>
                <div style={{ height: '48px' }}></div>
                <div style={{ fontWeight: 900, textDecoration: 'underline' }}>Budi Prasetyo, S.E.</div>
                <div style={{ fontSize: '0.7rem', color: '#555555' }}>Manager Keuangan</div>
              </div>
            </div>

          </div>

          <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={handleTriggerPrintSlip} style={{ padding: '10px 22px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)' }}>
              <Printer size={16} /> Cetak Slip Gaji PDF
            </button>
            <button onClick={handleTriggerPrintSlip} style={{ padding: '10px 22px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
              <Download size={16} /> Download Slip Gaji PDF
            </button>
            <button onClick={() => setShowSlipModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              Tutup
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
