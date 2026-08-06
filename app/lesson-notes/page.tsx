'use client';

import React, { useState } from 'react';
import { BookMarked, Plus, UserCheck, Calendar } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function LessonNotesPage() {
  const { students, addAuditLog } = useERP();
  const [notes, setNotes] = useState([
    { id: 'ln-1', date: '2026-08-05', teacherName: 'Bambang S., M.Pd.', studentName: 'Rizky Pratama', subject: 'Matematika Terapan', note: 'Sangat baik dalam memahami materi kalkulus dan integral dasar.', homework: 'Latihan Soal Halaman 42-45' },
    { id: 'ln-2', date: '2026-08-04', teacherName: 'Dra. Endang Lestari', studentName: 'Anisa Rahmawati', subject: 'Fisika Kuantum', note: 'Aktif bertanya saat praktikum pembiasan cahaya.', homework: 'Resume Praktikum Bab 3' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState(students[0]?.name || 'Rizky Pratama');
  const [subject, setSubject] = useState('Matematika Terapan');
  const [note, setNote] = useState('');
  const [homework, setHomework] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    const newEntry = {
      id: `ln-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      teacherName: 'Bambang S., M.Pd.',
      studentName,
      subject,
      note,
      homework: homework || 'Tidak ada PR'
    };
    setNotes(prev => [newEntry, ...prev]);
    addAuditLog('Add Lesson Note', 'Lesson Notes', `Catatan pembelajaran ditambahkan untuk ${studentName}`);
    setShowModal(false);
    setNote(''); setHomework('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookMarked style={{ color: '#2575b9' }} /> Catatan Guru & Progress Belajar (Lesson Notes)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Catatan perkembangan harian siswa, pekerjaan rumah (PR), dan evaluasi pengajar.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
          + Tambah Catatan Guru
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {notes.map(n => (
          <div key={n.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge badge-primary">{n.subject}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {n.date}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}>Siswa: {n.studentName}</h3>
            <p style={{ fontSize: '0.8rem', color: '#2575b9', marginBottom: '12px', fontWeight: 500 }}>Pengajar: {n.teacherName}</p>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>
              "{n.note}"
            </div>

            <div style={{ fontSize: '0.8rem', color: '#b45309', background: '#fef3c7', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
              📌 <strong>PR / Homework:</strong> {n.homework}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleAddNote} style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Input Lesson Notes Guru</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select value={studentName} onChange={e => setStudentName(e.target.value)} className="select-field">
                {students.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.grade})</option>
                ))}
              </select>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="select-field">
                <option value="Matematika Terapan">Matematika Terapan</option>
                <option value="Fisika Kuantum">Fisika Kuantum</option>
                <option value="Kimia & Biologi">Kimia & Biologi</option>
              </select>
              <textarea placeholder="Catatan Perkembangan Siswa..." value={note} onChange={e => setNote(e.target.value)} required className="input-field" style={{ minHeight: '90px' }} />
              <input type="text" placeholder="Tugas PR (Homework)" value={homework} onChange={e => setHomework(e.target.value)} className="input-field" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => setShowModal(false)}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Simpan Catatan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
