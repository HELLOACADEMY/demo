'use client';

import React, { useState, useRef } from 'react';
import { ClipboardList, Upload, CheckCircle, Clock, FileText, Plus, Award, Download, Check, AlertCircle, File, Trash2 } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function AssignmentsPage() {
  const { students, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState('ALL');

  // Selected file per assignment state
  const [selectedFiles, setSelectedFiles] = useState<{ [asgId: string]: File }>({});
  const fileInputRefs = useRef<{ [asgId: string]: HTMLInputElement | null }>({});

  const [assignmentList, setAssignmentList] = useState([
    {
      id: 'asg-1',
      title: 'Tugas 3 - Differential Equations & Calculus',
      subject: 'Matematika Terapan',
      teacherName: 'Bambang S., M.Pd.',
      dueDate: '2026-08-30',
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
      dueDate: '2026-08-28',
      totalSubmissions: 30,
      totalStudents: 35,
      description: 'Kumpulkan laporan hasil praktikum pembiasan cahaya lensa cembung format PDF.',
      status: 'Aktif'
    },
    {
      id: 'asg-3',
      title: 'Essay Writing & IELTS Practice',
      subject: 'Bahasa Inggris',
      teacherName: 'Kevin Sanjaya, S.Si.',
      dueDate: '2026-08-31',
      totalSubmissions: 15,
      totalStudents: 30,
      description: 'Write a 500-word essay about artificial intelligence impact on education.',
      status: 'Aktif'
    }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: 'Matematika Terapan',
    dueDate: '2026-08-31',
    description: ''
  });

  const filteredAssignments = filterSubject === 'ALL' ? assignmentList : assignmentList.filter(a => a.subject === filterSubject);

  const handleFileChange = (asgId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFiles(prev => ({ ...prev, [asgId]: file }));
    }
  };

  const handleRemoveFile = (asgId: string) => {
    setSelectedFiles(prev => {
      const updated = { ...prev };
      delete updated[asgId];
      return updated;
    });
  };

  const handleSubmitAssignment = (asgId: string, asgTitle: string) => {
    const file = selectedFiles[asgId];
    const fileName = file ? file.name : 'Berkas_Jawaban_Siswa.pdf';

    setAssignmentList(prev => prev.map(a => {
      if (a.id === asgId) {
        return { ...a, totalSubmissions: a.totalSubmissions + 1 };
      }
      return a;
    }));

    addAuditLog('Assignment Submitted', 'Assignments', `Siswa mengunggah berkas ${fileName} untuk tugas "${asgTitle}"`);
    setSubmittedSuccess(`Berkas "${fileName}" untuk "${asgTitle}" berhasil dikirimkan ke guru pengampu! ✅`);

    handleRemoveFile(asgId);
    setTimeout(() => setSubmittedSuccess(null), 4500);
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
    addAuditLog('Create Assignment', 'Assignments', `Tugas baru "${newAssignment.title}" berhasil diterbitkan`);
    setShowAddModal(false);
    setNewAssignment({ title: '', subject: 'Matematika Terapan', dueDate: '2026-08-31', description: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList style={{ color: '#2563eb' }} /> Papan Tugas Siswa & Submission Board
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengumpulan tugas online, pengunggahan berkas jawaban siswa (PDF/Word), dan pemantauan deadline.
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
              style={{ padding: '10px 18px', background: '#2563eb', border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
            >
              <Plus size={16} /> Terbitkan Tugas Baru
            </button>
          )}
        </div>
      </div>

      {submittedSuccess && (
        <div style={{ padding: '16px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.12)' }}>
          <CheckCircle size={22} style={{ flexShrink: 0 }} /> {submittedSuccess}
        </div>
      )}

      {/* Grid Cards Papan Tugas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredAssignments.map(a => {
          const hasFile = !!selectedFiles[a.id];
          const selectedFile = selectedFiles[a.id];

          return (
            <div key={a.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-primary" style={{ fontWeight: 800 }}>{a.subject}</span>
                  <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
                    <Clock size={12} /> Deadline: {a.dueDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, marginBottom: '4px' }}>{a.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#2563eb', marginBottom: '8px', fontWeight: 700 }}>Pengajar: {a.teacherName}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                  {a.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                  <span>Progress Pengumpulan:</span>
                  <strong style={{ color: '#16a34a', fontWeight: 800 }}>{a.totalSubmissions} / {a.totalStudents} Siswa ({Math.round((a.totalSubmissions / a.totalStudents) * 100)}%)</strong>
                </div>

                {/* Hidden Native File Input */}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  ref={el => { fileInputRefs.current[a.id] = el; }}
                  onChange={e => handleFileChange(a.id, e)}
                  style={{ display: 'none' }}
                />

                {/* Drag & Drop File Upload Box */}
                {!hasFile ? (
                  <div
                    onClick={() => fileInputRefs.current[a.id]?.click()}
                    style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', textAlign: 'center', marginBottom: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563eb')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    <Upload size={28} style={{ color: '#2563eb', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700 }}>Klik untuk Memilih File Jawaban Siswa</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Format: PDF, Word (DOCX), atau Foto (Maks 25MB)</div>
                  </div>
                ) : (
                  <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      <File size={24} style={{ color: '#2563eb', flexShrink: 0 }} />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e40af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#3b82f6', fontWeight: 600 }}>
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap Dikirim
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFile(a.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      title="Hapus pilihan berkas"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Action Button */}
              {!hasFile ? (
                <button
                  style={{ width: '100%', padding: '12px 16px', background: '#2563eb', border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
                  onClick={() => fileInputRefs.current[a.id]?.click()}
                >
                  <Upload size={16} /> Pilih File & Kumpulkan Jawaban
                </button>
              ) : (
                <button
                  style={{ width: '100%', padding: '12px 16px', background: '#10b981', border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                  onClick={() => handleSubmitAssignment(a.id, a.title)}
                >
                  <CheckCircle size={16} /> Kirim Jawaban Ke Guru Sekarang
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FORM MODAL BUAT TUGAS BARU */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateAssignment} style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Terbitkan Tugas Siswa Baru</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer', fontWeight: 800 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Judul Tugas *</label>
                <input type="text" placeholder="Masukkan judul tugas" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} required className="input-field" style={{ width: '100%', fontWeight: 700 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Mata Pelajaran *</label>
                  <select value={newAssignment.subject} onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })} className="select-field">
                    <option value="Matematika Terapan">Matematika Terapan</option>
                    <option value="Fisika Kuantum">Fisika Kuantum</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Batas Deadline *</label>
                  <input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} required className="input-field" style={{ fontWeight: 700 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Instruksi / Deskripsi Tugas *</label>
                <textarea placeholder="Tuliskan petunjuk pengerjaan tugas..." value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} className="input-field" style={{ minHeight: '90px', width: '100%' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>Terbitkan Tugas</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
