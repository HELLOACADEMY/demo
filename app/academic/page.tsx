'use client';

import React from 'react';
import { BookOpen, Calendar, Layers, FileText, Download } from 'lucide-react';

export default function AcademicPage() {
  const subjects = [
    { name: 'Matematika Terapan', code: 'MTK-101', level: 'SMA Class X-XII', curriculum: 'Kurikulum Merdeka', syllabus: 'Silabus_MTK_2026.pdf' },
    { name: 'Fisika Kuantum & Mekanika', code: 'FIS-102', level: 'SMA Class X-XII', curriculum: 'Kurikulum Merdeka', syllabus: 'Silabus_Fisika_2026.pdf' },
    { name: 'Kimia & Biologi Molekuler', code: 'KIM-103', level: 'SMA Class X-XII', curriculum: 'Kurikulum Merdeka', syllabus: 'Silabus_Kimia_2026.pdf' },
    { name: 'Bahasa Inggris Advanced', code: 'ENG-104', level: 'SMA Class X-XII', curriculum: 'Cambridge Standard', syllabus: 'Silabus_English_2026.pdf' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen style={{ color: '#2575b9' }} /> Master Akademik & Kurikulum
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Tahun ajaran aktif, semester, standar kurikulum nasional/internasional, dan silabus mata pelajaran.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tahun Ajaran Aktif</span>
            <Calendar size={18} style={{ color: '#2575b9' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>2025 / 2026</div>
          <span className="badge badge-success" style={{ marginTop: '8px' }}>Status: Berjalan</span>
        </div>

        <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Semester Aktif</span>
            <Layers size={18} style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>Semester Ganjil</div>
          <span className="badge badge-primary" style={{ marginTop: '8px' }}>Periode: Juli - Desember 2026</span>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Katalog Mata Pelajaran & Silabus</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kode Mapel</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Mata Pelajaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tingkat</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Standar Kurikulum</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>File Silabus</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{s.code}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{s.name}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{s.level}</td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{s.curriculum}</span></td>
                  <td style={{ padding: '12px 14px' }}>
                    <button style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={14} /> Download Silabus
                    </button>
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
