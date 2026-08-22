'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { GraduationCap, QrCode, ArrowRightLeft, Download, Share2, CheckCircle2, Plus, UserX, UserCheck, ShieldAlert, AlertTriangle, Search, Filter } from 'lucide-react';
import { Student } from '@/lib/store';

export default function StudentsPage() {
  const { filteredStudents, branches, setStudents, addStudent, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Aktif' | 'Non-Aktif' | 'Alumni' | 'Mutasi'>('ALL');
  
  const [selectedStudentQR, setSelectedStudentQR] = useState<Student | null>(null);
  const [selectedStudentMutate, setSelectedStudentMutate] = useState<Student | null>(null);
  const [selectedStudentDeactivate, setSelectedStudentDeactivate] = useState<Student | null>(null);

  const [deactivationReason, setDeactivationReason] = useState('Sudah Tidak Ikut Bimbel Lagi');
  const [deactivateParentAccount, setDeactivateParentAccount] = useState(true);
  const [deactivationNotes, setDeactivationNotes] = useState('');

  const [newBranchId, setNewBranchId] = useState(branches[0]?.id || 'br-1');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
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
    setActionNotice(`Siswa baru ${newName} berhasil ditambahkan.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const filtered = filteredStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'Non-Aktif' ? (s.status === 'Non-Aktif' || s.status === 'Inactive' as any) : s.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Handle Deactivating Student & Parent Account (For Super Admin)
  const handleConfirmDeactivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentDeactivate) return;

    const studentName = selectedStudentDeactivate.name;
    const finalReason = deactivationNotes ? `${deactivationReason}: ${deactivationNotes}` : deactivationReason;

    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudentDeactivate.id) {
        return {
          ...s,
          status: 'Non-Aktif',
          deactivationReason: finalReason
        } as Student & { deactivationReason?: string };
      }
      return s;
    }));

    const auditDetail = deactivateParentAccount
      ? `Super Admin mematikan akun Siswa ${studentName} & Wali Murid (Alasan: ${finalReason})`
      : `Super Admin mematikan akun Siswa ${studentName} (Alasan: ${finalReason})`;

    addAuditLog('Deactivate Student & Parent Account', 'Students', auditDetail);

    setActionNotice(`Akun Siswa ${studentName} ${deactivateParentAccount ? '& Wali Murid ' : ''}berhasil DIMATIKAN/NONAKTIFKAN (Alasan: ${deactivationReason}).`);
    setSelectedStudentDeactivate(null);
    setDeactivationNotes('');
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Reactivate Student Account
  const handleReactivateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          status: 'Aktif',
          deactivationReason: undefined
        };
      }
      return s;
    }));

    addAuditLog('Reactivate Student Account', 'Students', `Super Admin mengaktifkan kembali akun Siswa ${student.name}`);
    setActionNotice(`Akun Siswa ${student.name} berhasil DIAKTIFKAN KEMBALI ✅`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleMutateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentMutate) return;
    setStudents(prev => prev.map(s => s.id === selectedStudentMutate.id ? { ...s, branchId: newBranchId, status: 'Mutasi' } : s));
    addAuditLog('Student Branch Transfer', 'Students', `Siswa ${selectedStudentMutate.name} dipindahkan ke cabang ${newBranchId}`);
    setSelectedStudentMutate(null);
    setActionNotice(`Siswa ${selectedStudentMutate.name} berhasil dimutasi.`);
    setTimeout(() => setActionNotice(null), 3500);
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
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1d4ed8');
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
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.strokeRect(170, 165, 260, 260);

      // Student Name directly BELOW Barcode
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 28px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(student.name, 300, 475);

      // NISN directly below Name
      ctx.fillStyle = '#2563eb';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap style={{ color: '#2563eb' }} /> Data & Direktori Siswa
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Manajemen direktori siswa, kartu Barcode QR digital scannable, mutasi cabang, dan penonaktifan akun (Sudah Tidak Ikut Bimbel).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <input
              type="text"
              placeholder="Cari Nama / NISN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', fontWeight: 600 }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="select-field"
            style={{ padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}
          >
            <option value="ALL">🌐 Semua Status Siswa</option>
            <option value="Aktif">✅ Siswa Aktif Bimbel</option>
            <option value="Non-Aktif">⛔ Non-Aktif / Sudah Tidak Ikut</option>
            <option value="Alumni">🎓 Alumni / Lulus</option>
            <option value="Mutasi">🔄 Siswa Mutasi</option>
          </select>

          {(isSuperAdmin || currentRole === 'admin_cabang') && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 18px',
                background: '#2563eb',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={16} /> Tambah Siswa Baru
            </button>
          )}
        </div>
      </div>

      {actionNotice && (
        <div style={{ padding: '14px 20px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#1e40af', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)' }}>
          <CheckCircle2 size={20} style={{ color: '#2563eb' }} /> {actionNotice}
        </div>
      )}

      {/* Main Table Directory */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>NISN</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nama Siswa</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Gender</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kelas / Program</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Cabang</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kartu Barcode QR</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Akun Portal</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'right' }}>Tindakan Super Admin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const br = branches.find(b => b.id === s.branchId)?.name || 'Cabang Serdam Pontianak';
                const isInactive = s.status === 'Non-Aktif' || s.status === ('Inactive' as any);
                const reason = (s as any).deactivationReason;

                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: isInactive ? '#fff1f2' : 'transparent' }}>
                    <td style={{ padding: '14px', fontWeight: 800, color: '#2563eb' }}>{s.nisn}</td>
                    <td style={{ padding: '14px', fontWeight: 800, color: isInactive ? '#991b1b' : '#0f172a' }}>
                      {s.name}
                      {isInactive && (
                        <div style={{ fontSize: '0.725rem', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>
                          ⛔ Akun Dimatikan ({reason || 'Sudah Tidak Ikut Bimbel'})
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{s.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{s.grade}</td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{br}</td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => setSelectedStudentQR(s)}
                        style={{
                          padding: '6px 12px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          color: '#2563eb',
                          fontWeight: 700,
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
                    <td style={{ padding: '14px' }}>
                      {!isInactive ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: '#dcfce7',
                          color: '#166534',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} /> AKTIF (Bimbel)
                        </span>
                      ) : (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: '#fee2e2',
                          color: '#991b1b',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <UserX size={12} /> NON-AKTIF (Berhenti)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {(isSuperAdmin || currentRole === 'admin_cabang') && (
                          <>
                            <button
                              onClick={() => { setSelectedStudentMutate(s); setNewBranchId(s.branchId); }}
                              style={{
                                padding: '6px 10px',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                color: '#475569',
                                fontWeight: 700,
                                fontSize: '0.775rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title="Mutasi Cabang"
                            >
                              <ArrowRightLeft size={14} /> Mutasi
                            </button>

                            {!isInactive ? (
                              <button
                                onClick={() => setSelectedStudentDeactivate(s)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#fee2e2',
                                  border: '1px solid #fca5a5',
                                  borderRadius: '8px',
                                  color: '#dc2626',
                                  fontWeight: 800,
                                  fontSize: '0.775rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.15)'
                                }}
                              >
                                <UserX size={14} /> Mematikan Akun
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivateStudent(s)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#dcfce7',
                                  border: '1px solid #86efac',
                                  borderRadius: '8px',
                                  color: '#166534',
                                  fontWeight: 800,
                                  fontSize: '0.775rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <UserCheck size={14} /> Aktifkan Kembali
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL MEMATIKAN AKUN SISWA & WALI MURID (Khusus Super Admin) */}
      {selectedStudentDeactivate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleConfirmDeactivation}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #fee2e2' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UserX size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#991b1b', fontWeight: 800, margin: 0 }}>
                  Mematikan Akun Siswa & Wali Murid
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Konfirmasi penonaktifan akses portal bimbel
                </div>
              </div>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '12px', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Siswa <strong>{selectedStudentDeactivate.name}</strong> (NISN: {selectedStudentDeactivate.nisn}) tidak dapat lagi login ke Portal Siswa atau melakukan presensi.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Alasan Penonaktifan Akun:
                </label>
                <select
                  value={deactivationReason}
                  onChange={e => setDeactivationReason(e.target.value)}
                  className="select-field"
                  style={{ width: '100%', padding: '10px 12px', fontWeight: 700 }}
                >
                  <option value="Sudah Tidak Ikut Bimbel Lagi">🚫 Sudah Tidak Ikut Bimbel Lagi (Berhenti)</option>
                  <option value="Lulus / Alumni">🎓 Lulus / Alumni Program</option>
                  <option value="Mengundurkan Diri">📝 Mengundurkan Diri Atas Permintaan Sendiri</option>
                  <option value="Tunggakan Administrasi">⚠️ Tunggakan Administrasi / SPP</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  placeholder="Contoh: Pindah sekolah ke luar kota per 22 Agustus 2026..."
                  value={deactivationNotes}
                  onChange={e => setDeactivationNotes(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', minHeight: '70px' }}
                />
              </div>

              <div style={{ padding: '12px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.825rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={deactivateParentAccount}
                    onChange={e => setDeactivateParentAccount(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#dc2626' }}
                  />
                  <span>Otomatis matikan juga akses Login Portal Wali Murid</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedStudentDeactivate(null)}
                style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{ padding: '10px 18px', background: '#dc2626', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)' }}
              >
                🔴 Konfirmasi Mematikan Akun
              </button>
            </div>
          </form>
        </div>
      )}

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
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.05em' }}>
              KARTU PRESENSI DIGITAL SISWA
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 16px' }}>
              BSMART EDUCATION PONTIANAK
            </div>

            <div style={{
              padding: '12px',
              background: '#ffffff',
              border: '2px solid #2563eb',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>
                {selectedStudentQR.name}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 700 }}>
                NISN: {selectedStudentQR.nisn}
              </div>
            </div>

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
              <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Kartu Presensi Siswa Berhasil Diunduh!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleDownloadFullCard(selectedStudentQR)}
                style={{
                  width: '100%',
                  padding: '11px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
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
                  fontWeight: 800,
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
                  fontWeight: 700,
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
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: '0 0 8px' }}>
              Mutasi Cabang Siswa
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '16px' }}>
              Memindahkan data siswa <strong>{selectedStudentMutate.name}</strong> ke lokasi cabang tujuan.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
                Pilih Cabang Tujuan:
              </label>
              <select
                value={newBranchId}
                onChange={e => setNewBranchId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff', fontSize: '0.875rem', fontWeight: 700 }}
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
                style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{ padding: '10px 16px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Konfirmasi Mutasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Tambah Siswa Baru */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateStudent} style={{ width: '100%', maxWidth: '460px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px' }}>Tambah Siswa Baru</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>NISN (10 Digit)*</label>
                <input type="text" placeholder="00xxxxxxxx" value={newNisn} onChange={e => setNewNisn(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Lengkap Siswa *</label>
                <input type="text" placeholder="Nama Siswa" value={newName} onChange={e => setNewName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontWeight: 700 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Jenis Kelamin</label>
                  <select value={newGender} onChange={e => setNewGender(e.target.value as 'L' | 'P')} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontWeight: 700 }}>
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Kelas / Program</label>
                  <select value={newGrade} onChange={e => setNewGrade(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontWeight: 700 }}>
                    <option value="XII SMA (Kedokteran)">XII SMA (Kedokteran)</option>
                    <option value="XI SMA (Intensif)">XI SMA (Intensif)</option>
                    <option value="IX SMP (Kedinasan)">IX SMP (Kedinasan)</option>
                    <option value="SD (Juara Kelas)">SD (Juara Kelas)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.825rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Cabang Pendaftaran</label>
                <select value={newStudentBranch} onChange={e => setNewStudentBranch(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontWeight: 700 }}>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}>Batal</button>
              <button type="submit" style={{ padding: '10px 16px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem' }}>Simpan Siswa</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
