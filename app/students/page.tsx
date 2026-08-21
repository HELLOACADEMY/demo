'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { GraduationCap, QrCode, ArrowRightLeft, Download, Share2, CheckCircle2, Plus } from 'lucide-react';
import { Student } from '@/lib/store';

export default function StudentsPage() {
  const { filteredStudents, branches, setStudents, addStudent, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [search, setSearch] = useState('');
  const [selectedStudentQR, setSelectedStudentQR] = useState<Student | null>(null);
  const [selectedStudentMutate, setSelectedStudentMutate] = useState<Student | null>(null);
  const [newBranchId, setNewBranchId] = useState(branches[0]?.id || 'br-1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form state
  const [newNisn, setNewNisn] = useState('');
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newGrade, setNewGrade] = useState('XII SMA (Kedokteran)');
  const [newStudentBranch, setNewStudentBranch] = useState(branches[0]?.id || 'br-1');

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNisn) return;
    await addStudent({
      nisn: newNisn,
      name: newName,
      gender: newGender,
      grade: newGrade,
      branchId: newStudentBranch,
      parentId: 'pr-1',
      status: 'Aktif',
    });
    setShowAddModal(false);
    setNewNisn(''); setNewName('');
  };

  const filtered = filteredStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search));

  const handleMutateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentMutate) return;
    setStudents(prev => prev.map(s => s.id === selectedStudentMutate.id ? { ...s, branchId: newBranchId, status: 'Mutasi' } : s));
    addAuditLog('Student Branch Transfer', 'Students', `Siswa ${selectedStudentMutate.name} dipindahkan ke cabang ${newBranchId}`);
    setSelectedStudentMutate(null);
  };

  // Download Full Official Student Card Image (PNG) with Name & Details below Barcode
  const handleDownloadFullCard = (student: Student) => {
    const branchName = branches.find(b => b.id === student.branchId)?.name || 'Cabang Serdam Pontianak (Pusat)';
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 820;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 820);

    // Header Gradient Banner
    const gradient = ctx.createLinearGradient(0, 0, 600, 0);
    gradient.addColorStop(0, '#2575b9');
    gradient.addColorStop(1, '#1d5f9a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 140);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KARTU PRESENSI DIGITAL SISWA', 300, 55);
    ctx.font = '400 18px Inter, system-ui, sans-serif';
    ctx.fillText('BSMART EDUCATION PONTIANAK', 300, 92);

    // Load QR Image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(student.qrCode || `QR-${student.id}`)}`;

    img.onload = () => {
      // Draw QR Code in Center
      ctx.drawImage(img, 175, 170, 250, 250);

      // Border around QR Code
      ctx.strokeStyle = '#2575b9';
      ctx.lineWidth = 3;
      ctx.strokeRect(170, 165, 260, 260);

      // Student Name directly BELOW Barcode
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 28px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(student.name, 300, 475);

      // NISN directly below Name
      ctx.fillStyle = '#2575b9';
      ctx.font = '500 20px Inter, system-ui, sans-serif';
      ctx.fillText(`NISN: ${student.nisn}`, 300, 515);

      // Divider Line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 550);
      ctx.lineTo(540, 550);
      ctx.stroke();

      // Grade / Class & Branch Info below NISN
      ctx.fillStyle = '#334155';
      ctx.font = '400 19px Inter, system-ui, sans-serif';
      ctx.fillText(`Kelas / Tingkat: ${student.grade}`, 300, 595);
      ctx.fillText(`Cabang: ${branchName}`, 300, 635);

      // Barcode ID Code
      ctx.fillStyle = '#64748b';
      ctx.font = '400 16px monospace';
      ctx.fillText(`ID Barcode: ${student.qrCode || `QR-${student.id}`}`, 300, 685);

      // Footer Instructions
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 14px Inter, system-ui, sans-serif';
      ctx.fillText('Wajib di-scan saat Jam Masuk (Check-In) & Jam Pulang (Check-Out)', 300, 755);

      // Trigger Download
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `Kartu_Presensi_${student.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap style={{ color: '#4f46e5' }} /> Data & Direktori Siswa
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Manajemen direktori siswa, kartu Barcode QR digital scannable, dan mutasi antar cabang.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '260px' }}>
            <input
              type="text"
              placeholder="Cari Nama / NISN Siswa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          {(isSuperAdmin || currentRole === 'admin_cabang') && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 18px',
                background: '#4f46e5',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={16} /> Tambah Siswa Baru
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>NISN</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Siswa</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Gender</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kelas / Tingkat</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Cabang</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kartu Barcode QR</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status Siswa</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const br = branches.find(b => b.id === s.branchId)?.name || 'Cabang Serdam Pontianak';
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#4f46e5' }}>{s.nisn}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{s.grade}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{br}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setSelectedStudentQR(s)}
                        style={{
                          padding: '6px 12px',
                          background: '#eef2ff',
                          border: '1px solid #c7d2fe',
                          borderRadius: '6px',
                          color: '#4f46e5',
                          fontWeight: 500,
                          fontSize: '0.775rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <QrCode size={14} /> Lihat Barcode QR
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: s.status === 'Aktif' ? '#dcfce7' : '#fef3c7',
                        color: s.status === 'Aktif' ? '#166534' : '#92400e',
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {(isSuperAdmin || currentRole === 'admin_cabang') ? (
                        <button
                          onClick={() => { setSelectedStudentMutate(s); setNewBranchId(s.branchId); }}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            color: '#475569',
                            fontWeight: 500,
                            fontSize: '0.775rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <ArrowRightLeft size={14} /> Mutasi
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          Read-Only (Hanya Admin)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Official Student Barcode Card */}
      {selectedStudentQR && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '28px 24px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          }}>
            {/* Header Title inside Card */}
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2575b9', letterSpacing: '0.05em' }}>
              KARTU PRESENSI DIGITAL SISWA
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '2px 0 16px' }}>
              BSMART EDUCATION PONTIANAK
            </div>

            {/* Scannable Barcode QR Code Image */}
            <div style={{
              padding: '12px',
              background: '#ffffff',
              border: '2px solid #2575b9',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(selectedStudentQR.qrCode || `QR-${selectedStudentQR.id}-${selectedStudentQR.name}`)}`}
                alt={`QR Code ${selectedStudentQR.name}`}
                style={{ width: '180px', height: '180px', borderRadius: '6px', display: 'block' }}
              />
            </div>

            {/* Information directly BELOW Barcode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>
                {selectedStudentQR.name}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#2575b9', fontWeight: 600 }}>
                NISN: {selectedStudentQR.nisn}
              </div>
            </div>

            {/* Details Box below Name & NISN */}
            <div style={{
              margin: '0 0 18px',
              fontSize: '0.85rem',
              color: '#334155',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              lineHeight: 1.6,
            }}>
              <div><strong>Kelas / Tingkat:</strong> {selectedStudentQR.grade}</div>
              <div><strong>Cabang:</strong> {branches.find(b => b.id === selectedStudentQR.branchId)?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
                ID Code: {selectedStudentQR.qrCode || `QR-${selectedStudentQR.id}`}
              </div>
            </div>

            {downloadSuccess && (
              <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Kartu Presensi Siswa Berhasil Diunduh!
              </div>
            )}

            {/* Action Buttons: Download Full Card & Bagikan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleDownloadFullCard(selectedStudentQR)}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#2575b9',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 117, 185, 0.3)',
                }}
              >
                <Download size={16} /> Download Kartu Presensi Lengkap (PNG)
              </button>

              <button
                onClick={() => {
                  const text = `Kartu Barcode QR Presensi Siswa Bsmart Education:%0ANama: ${selectedStudentQR.name}%0ANISN: ${selectedStudentQR.nisn}%0AKelas: ${selectedStudentQR.grade}%0ABarcode ID: ${selectedStudentQR.qrCode}%0AQR Link: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedStudentQR.qrCode)}`;
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#16a34a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Share2 size={16} /> Bagikan ke WhatsApp Siswa / Ortuk
              </button>

              <button
                onClick={() => setSelectedStudentQR(null)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#475569',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  marginTop: '2px',
                }}
              >
                Tutup Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Mutasi Cabang */}
      {selectedStudentMutate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <form
            onSubmit={handleMutateBranch}
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: '0 0 8px' }}>
              Mutasi Cabang Siswa
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '16px' }}>
              Memindahkan data siswa <strong>{selectedStudentMutate.name}</strong> ke lokasi cabang tujuan.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '6px', display: 'block', fontWeight: 500 }}>
                Pilih Cabang Tujuan:
              </label>
              <select
                value={newBranchId}
                onChange={e => setNewBranchId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', background: '#fff', fontSize: '0.875rem' }}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedStudentMutate(null)}
                style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{ padding: '10px 16px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Konfirmasi Mutasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Tambah Siswa Baru */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateStudent} style={{ width: '100%', maxWidth: '460px', padding: '28px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Tambah Siswa Baru</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'block', marginBottom: '4px', fontWeight: 500 }}>NISN (10 Digit)*</label>
                <input type="text" placeholder="00xxxxxxxx" value={newNisn} onChange={e => setNewNisn(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nama Lengkap Siswa *</label>
                <input type="text" placeholder="Nama Siswa" value={newName} onChange={e => setNewName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Jenis Kelamin</label>
                  <select value={newGender} onChange={e => setNewGender(e.target.value as 'L' | 'P')} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}>
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Kelas / Program</label>
                  <select value={newGrade} onChange={e => setNewGrade(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}>
                    <option value="XII SMA (Kedokteran)">XII SMA (Kedokteran)</option>
                    <option value="XI SMA (Intensif)">XI SMA (Intensif)</option>
                    <option value="IX SMP (Kedinasan)">IX SMP (Kedinasan)</option>
                    <option value="SD (Juara Kelas)">SD (Juara Kelas)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#4f46e5', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Cabang Pendaftaran</label>
                <select value={newStudentBranch} onChange={e => setNewStudentBranch(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 16px', background: '#4f46e5', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Simpan Siswa</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
