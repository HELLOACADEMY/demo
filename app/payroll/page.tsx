'use client';

import React, { useState } from 'react';
import { DollarSign, Printer, Download, Clock, CheckCircle, Receipt, UserCheck, ShieldCheck } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function PayrollPage() {
  const { teachers, branches, addAuditLog, isSuperAdmin } = useERP();
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || 'tch-1');
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [transferredSuccess, setTransferredSuccess] = useState(false);

  const activeTch = teachers.find(t => t.id === selectedTeacherId) || teachers[0];

  const honorMengajar = (activeTch?.hourlyRate || 150000) * (activeTch?.teachingHoursThisMonth || 42);
  const bonusKinerja = 500000;
  const potonganBPJS = 120000;
  const totalGajiBersih = honorMengajar + bonusKinerja - potonganBPJS;

  const handleTransferPayroll = () => {
    addAuditLog('Process Payroll Transfer', 'Payroll', `Gaji ${activeTch?.name} (Rp ${totalGajiBersih.toLocaleString('id-ID')}) berhasil diproses via Bank Transfer`);
    setTransferredSuccess(true);
    setTimeout(() => setTransferredSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign style={{ color: '#2575b9' }} /> Payroll Engine & Slip Gaji Guru
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Kalkulasi otomatis honor jam mengajar guru, tunjangan kinerja, potongan BPJS, dan penerbitan slip gaji digital.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="select-field" style={{ width: '220px' }}>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
            ))}
          </select>
          <button onClick={() => setShowSlipModal(true)} style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Lihat Slip Gaji PDF
          </button>
        </div>
      </div>

      {transferredSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> Transfer Gaji ke Rekening {activeTch?.name} Berhasil Diproses!
        </div>
      )}

      {/* Summary Cards Gaji */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Honor Jam Mengajar ({activeTch?.name})</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>
            Rp {honorMengajar.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 500 }}>{activeTch?.teachingHoursThisMonth} jam × Rp {activeTch?.hourlyRate.toLocaleString('id-ID')}/jam</span>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tunjangan & Bonus Kinerja</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#16a34a', marginTop: '4px' }}>
            + Rp {bonusKinerja.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Insentif Pengajar PTN Super Teacher</span>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Take Home Pay (THP)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#16a34a', marginTop: '4px' }}>
            Rp {totalGajiBersih.toLocaleString('id-ID')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Siap Ditransfer via Payroll Bank</span>
        </div>
      </div>

      {/* Tabel Daftar Penggajian Guru */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600 }}>Rekap Payroll Dewan Guru Periode Agustus 2026</h3>
          {isSuperAdmin && (
            <button onClick={handleTransferPayroll} style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Diproses Transfer Payroll Massal
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>NIP Guru</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Pengajar</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Mata Pelajaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Total Jam</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Honor per Jam</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Gaji Bersih (THP)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Slip Gaji</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => {
                const thp = (t.hourlyRate * t.teachingHoursThisMonth) + bonusKinerja - potonganBPJS;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{t.nip}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{t.name}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{t.subject}</td>
                    <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 500 }}>{t.teachingHoursThisMonth} Jam</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>Rp {t.hourlyRate.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#16a34a' }}>Rp {thp.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => { setSelectedTeacherId(t.id); setShowSlipModal(true); }}
                        style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#2575b9', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Receipt size={14} /> Cetak Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SLIP GAJI DIGITAL */}
      {showSlipModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '440px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginBottom: '4px', textAlign: 'center' }}>SLIP GAJI GURU & TENAGA PENDIDIK</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginBottom: '16px' }}>Periode: Agustus 2026 • Hello Academy Pontianak</p>

            <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div>Nama Guru: <strong style={{ color: '#0f172a' }}>{activeTch?.name}</strong></div>
              <div>NIP: <strong style={{ color: '#0f172a' }}>{activeTch?.nip}</strong></div>
              <div>Mata Pelajaran: <strong style={{ color: '#0f172a' }}>{activeTch?.subject}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Honor Mengajar ({activeTch?.teachingHoursThisMonth} Jam):</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Rp {honorMengajar.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Bonus Kinerja Kualitas:</span>
                <span>+ Rp {bonusKinerja.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                <span>Potongan BPJS & Kas:</span>
                <span>- Rp {potonganBPJS.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>
                <span>Total Diterima (THP):</span>
                <span style={{ color: '#16a34a' }}>Rp {totalGajiBersih.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => setShowSlipModal(false)}>Tutup</button>
              <button style={{ flex: 1, padding: '10px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => setShowSlipModal(false)}>
                <Download size={16} /> Download Slip PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
