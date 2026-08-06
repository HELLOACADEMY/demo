'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Award, CheckCircle, Download } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function ReportsPage() {
  const { students } = useERP();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-101');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const activeStd = students.find(s => s.id === selectedStudentId) || students[0];

  const gradesData = [
    { subject: 'Matematika Terapan', harian: 88, uts: 85, uas: 90, finalScore: 87.5, grade: 'A', status: 'Lulus' },
    { subject: 'Fisika Kuantum', harian: 82, uts: 80, uas: 86, finalScore: 82.6, grade: 'A', status: 'Lulus' },
    { subject: 'Kimia & Biologi', harian: 78, uts: 82, uas: 84, finalScore: 81.3, grade: 'A', status: 'Lulus' },
    { subject: 'Bahasa Inggris', harian: 92, uts: 95, uas: 94, finalScore: 93.6, grade: 'A+', status: 'Lulus Sangat Memuaskan' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet style={{ color: '#2575b9' }} /> E-Rapor & Cetak Hasil Belajar
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Laporan rekapitulasi nilai akhir semester, ranking kelas, dan cetak dokumen resmi E-Rapor (PDF).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="select-field" style={{ width: '220px' }}>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
            ))}
          </select>
          <button onClick={() => setShowPrintModal(true)} style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Cetak E-Rapor PDF
          </button>
        </div>
      </div>

      {/* Rapor Preview Sheet */}
      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>LEMBAR HASIL BELAJAR SISWA (E-RAPOR)</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Tahun Ajaran 2025/2026 • Semester Ganjil</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#64748b' }}>
            <div>Nama Siswa: <strong style={{ color: '#0f172a' }}>{activeStd?.name}</strong></div>
            <div>NISN: <strong style={{ color: '#2575b9' }}>{activeStd?.nisn}</strong></div>
            <div>Tingkat / Kelas: <strong style={{ color: '#0f172a' }}>{activeStd?.grade}</strong></div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Mata Pelajaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nilai Harian</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>UTS</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>UAS</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nilai Akhir</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Predikat</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status Ketercapaian</th>
              </tr>
            </thead>
            <tbody>
              {gradesData.map((g, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{g.subject}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{g.harian}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{g.uts}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{g.uas}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{g.finalScore}</td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-success">{g.grade}</span></td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{g.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, marginBottom: '8px' }}>Rekap Kehadiran Semester Ini</h4>
            <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>Hadir: <strong style={{ color: '#16a34a' }}>98%</strong></span>
              <span>Izin: <strong>1 Hari</strong></span>
              <span>Sakit: <strong>0 Hari</strong></span>
              <span>Alpha: <strong>0 Hari</strong></span>
            </div>
          </div>
          <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 600, marginBottom: '8px' }}>Ranking & Prestasi Kelas</h4>
            <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} /> Peringkat 2 dari 36 Siswa di Kelas {activeStd?.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Modal Simulation */}
      {showPrintModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '420px', padding: '28px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <CheckCircle size={48} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600 }}>E-Rapor Siap Diunduh & Dicetak</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 20px' }}>
              Dokumen PDF resmi E-Rapor {activeStd?.name} dengan stempel digital telah di-generate.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => setShowPrintModal(false)}>Tutup</button>
              <button style={{ flex: 1, padding: '10px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => setShowPrintModal(false)}>
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
