'use client';

import React, { useState } from 'react';
import { ClipboardList, Upload, CheckCircle, Clock, FileText, Plus, Award, Download, Check, AlertCircle } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function AssignmentsPage() {
  const { students, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('ALL');

  const [assignmentList, setAssignmentList] = useState([
    {
      id: 'asg-1',
      title: 'Tugas 3 - Differential Equations & Calculus',
      subject: 'Matematika Terapan',
      teacherName: 'Bambang S., M.Pd.',
      dueDate: '2026-08-10',
      totalSubmissions: 28,
      totalStudents: 32,
      description: 'Kerjakan soal latihan nomor 1 sampai 10 di buku paket kalkulus bab 4.',
      status: 'Aktif'
    },
    {
      id: 'asg-2',
      title: 'Laporan Lab - Pembiasan Cahaya & Kuantum',
      subject: 'Fisika Kuantum',
      teacherName: 'Dra. Endang Lestari',
      dueDate: '2026-08-08',
      totalSubmissions: 30,
      totalStudents: 35,
      description: 'Kumpulkan laporan hasil praktikum pembiasan cahaya lensa cembung format PDF.',
      status: 'Aktif'
    },
    {
      id: 'asg-3',
      title: 'Essay Essay Writing & IELTS Practice',
      subject: 'Bahasa Inggris',
      teacherName: 'Kevin Sanjaya, S.Si.',
      dueDate: '2026-08-15',
      totalSubmissions: 15,
      totalStudents: 30,
      description: 'Write a 500-word essay about artificial intelligence impact on education.',
      status: 'Aktif'
    }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: 'Matematika Terapan',
    dueDate: '2026-08-15',
    description: ''
  });

  const filteredAssignments = filterSubject === 'ALL' ? assignmentList : assignmentList.filter(a => a.subject === filterSubject);

  const simulateUpload = (asgTitle: string) => {
    setSubmittedSuccess(true);
    addAuditLog('Assignment Submitted', 'Assignments', `Siswa mengunggah jawaban untuk ${asgTitle}`);
    setTimeout(() => setSubmittedSuccess(false), 3500);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;
    const created = {
      id: `asg-${Date.now()}`,
      title: newAssignment.title,
      subject: newAssignment.subject,
      teacherName: 'Bambang S., M.Pd.',
      dueDate: newAssignment.dueDate,
      totalSubmissions: 0,
      totalStudents: students.length || 32,
      description: newAssignment.description || 'Kumpulkan tepat waktu sebelum batas deadline.',
      status: 'Aktif'
    };
    setAssignmentList(prev => [created, ...prev]);
    addAuditLog('Create Assignment', 'Assignments', `Tugas baru "${newAssignment.title}" berhasil dibuat`);
    setShowAddModal(false);
    setNewAssignment({ title: '', subject: 'Matematika Terapan', dueDate: '2026-08-15', description: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList style={{ color: '#2575b9' }} /> Papan Tugas Siswa & Submission Board
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Pengumpulan tugas online, pengunggahan berkas jawaban siswa (PDF/Word), dan penilaian guru.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="select-field" style={{ width: '180px' }}>
            <option value="ALL">Semua Mapel</option>
            <option value="Matematika Terapan">Matematika Terapan</option>
            <option value="Fisika Kuantum">Fisika Kuantum</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
          </select>

          {(isSuperAdmin || currentRole === 'admin_cabang' || currentRole === 'guru') && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Buat Tugas Baru
            </button>
          )}
        </div>
      </div>

      {submittedSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> Berkas Tugas Jawaban Berhasil Diunggah & Dikirim ke Guru Pengampu!
        </div>
      )}

      {/* Grid Cards Papan Tugas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredAssignments.map(a => (
          <div key={a.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge badge-primary">{a.subject}</span>
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Deadline: {a.dueDate}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}>{a.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#2575b9', marginBottom: '8px', fontWeight: 500 }}>Pengajar: {a.teacherName}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
              {a.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <span>Progress Pengumpulan:</span>
              <strong style={{ color: '#16a34a' }}>{a.totalSubmissions} / {a.totalStudents} Siswa ({Math.round((a.totalSubmissions / a.totalStudents) * 100)}%)</strong>
            </div>

            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center', marginBottom: '16px' }}>
              <Upload size={24} style={{ color: '#2575b9', margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>Drag & Drop file jawaban siswa (PDF / Word)</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Maksimal ukuran file: 25MB</div>
            </div>

            <button
              style={{ width: '100%', padding: '10px 16px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => simulateUpload(a.title)}
            >
              <Upload size={16} /> Upload & Kumpulkan Jawaban Siswa
            </button>
          </div>
        ))}
      </div>

      {/* FORM MODAL BUAT TUGAS BARU */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateAssignment} style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Buat Tugas Siswa Baru</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Judul Tugas *</label>
                <input type="text" placeholder="Masukkan judul tugas" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Mata Pelajaran *</label>
                  <select value={newAssignment.subject} onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })} className="select-field">
                    <option value="Matematika Terapan">Matematika Terapan</option>
                    <option value="Fisika Kuantum">Fisika Kuantum</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Batas Deadline *</label>
                  <input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} required className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Instruksi / Deskripsi Tugas *</label>
                <textarea placeholder="Tuliskan petunjuk pengerjaan tugas..." value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} className="input-field" style={{ minHeight: '90px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Terbitkan Tugas</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
