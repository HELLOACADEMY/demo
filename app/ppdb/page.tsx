'use client';

import React, { useState, Suspense } from 'react';
import { useERP } from '@/context/ERPContext';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  UserCheck, CheckCircle2, Phone, MapPin, School, GraduationCap, ArrowLeft, Send, Sparkles,
  Filter, Check, X, Award, ShieldCheck, Plus, Eye, FileText, Printer, Clock, AlertCircle,
  Building2, Users, FileCheck2, User
} from 'lucide-react';
import Link from 'next/link';

function PublicPPDBContent() {
  const { branches, addAuditLog, currentRole, currentBranchId, filteredPpdbList, setPpdbList, students, setStudents } = useERP();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'admin_data' | 'public_form'>(
    (currentRole === 'super_admin' || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan') ? 'admin_data' : 'public_form'
  );

  // Candidate Registration Form State
  const [applicantName, setApplicantName] = useState('');
  const [nisn, setNisn] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthInfo, setBirthInfo] = useState('Pontianak, 14 Mei 2008');
  const [previousSchool, setPreviousSchool] = useState('');
  const [grade, setGrade] = useState('XII SMA (Kedokteran)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [targetBranchId, setTargetBranchId] = useState(branches[0]?.id || 'br-1');

  const [submitted, setSubmitted] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Detail Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  // PPDB Metrics
  const totalCount = filteredPpdbList.length;
  const approvedCount = filteredPpdbList.filter(p => p.status === 'Approved').length;
  const interviewCount = filteredPpdbList.filter(p => p.status === 'Interview').length;
  const pendingCount = filteredPpdbList.filter(p => p.status === 'Pending').length;

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !parentPhone || !previousSchool) return;

    const newRegNum = `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`;
    setRegNumber(newRegNum);

    const newCandidate = {
      id: `ppdb-${Date.now()}`,
      regNumber: newRegNum,
      nisn: nisn || `008${Math.floor(1000000 + Math.random() * 9000000)}`,
      applicantName,
      gender,
      birthInfo,
      previousSchool,
      grade,
      parentName: parentName || `Wali ${applicantName}`,
      parentPhone,
      homeAddress: homeAddress || 'Jl. Sui Raya Dalam No. 15, Pontianak',
      targetBranchId,
      status: 'Pending' as const,
      testScore: 85,
      downpaymentStatus: 'Unpaid' as const,
    };

    setPpdbList(prev => [newCandidate, ...prev]);

    try {
      await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate),
      });
    } catch (err) {
      console.error('Failed to submit PPDB API:', err);
    }

    await addAuditLog('Public PPDB Form Submit', 'PPDB', `Pendaftaran calon siswa baru ${applicantName} (${newRegNum}) di ${branches.find(b => b.id === targetBranchId)?.name}`);
    setSubmitted(true);
  };

  const handleApproveCandidate = (cand: any) => {
    setPpdbList(prev => prev.map(p => p.id === cand.id ? { ...p, status: 'Approved', downpaymentStatus: 'Paid' } : p));

    const newStudent: any = {
      id: `std-${Date.now()}`,
      nisn: cand.nisn || `008${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: cand.applicantName,
      gender: 'L',
      grade: cand.grade,
      branchId: cand.targetBranchId,
      parentId: 'p-1',
      status: 'Aktif',
      qrCode: `QR-STD-${cand.regNumber}`
    };
    setStudents(prev => [newStudent, ...prev]);

    addAuditLog('Approve PPDB Candidate', 'PPDB', `Calon siswa ${cand.applicantName} (NISN: ${cand.nisn || '-'}) resmi DITERIMA dan diterbitkan NIM`);
    setActionNotice(`Selamat! Calon siswa ${cand.applicantName} berhasil DITERIMA dan dikonversi ke Data Siswa Aktif.`);
    if (selectedCandidate?.id === cand.id) {
      setSelectedCandidate((prev: any) => ({ ...prev, status: 'Approved', downpaymentStatus: 'Paid' }));
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck style={{ color: '#2575b9' }} /> Pendaftaran & Seleksi NISN Calon Siswa Baru
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengelolaan data registrasi, placement test, dan verifikasi berkas terisolasi per pos cabang Pontianak.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ background: '#ffffff', padding: '5px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('admin_data')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'admin_data' ? '#2575b9' : 'transparent',
              color: activeTab === 'admin_data' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'admin_data' ? '0 4px 12px rgba(37, 117, 185, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={16} /> Data Calon Siswa ({filteredPpdbList.length})
          </button>
          <button
            onClick={() => setActiveTab('public_form')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'public_form' ? '#2575b9' : 'transparent',
              color: activeTab === 'public_form' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'public_form' ? '0 4px 12px rgba(37, 117, 185, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} /> Form Registrasi Publik
          </button>
        </div>
      </div>

      {actionNotice && (
        <div style={{ padding: '16px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '14px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
          <CheckCircle2 size={22} /> {actionNotice}
        </div>
      )}

      {/* TAB 1: DATA CALON SISWA BARU CABANG (ERP INTERNAL DASHBOARD VIEW) */}
      {activeTab === 'admin_data' && (
        <>
          {/* Top Modern Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
                  {activeBranch?.code}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total Pendaftar PPDB</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>{totalCount} Calon Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Tahun Ajaran 2026/2027</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px' }}>
                  Lulus Seleksi
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Siswa Diterima (NIM)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 2px' }}>{approvedCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Konversi Siswa Aktif</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '20px' }}>
                  Placement Test
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Proses Tes & Wawancara</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '4px 0 2px' }}>{interviewCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Jadwal Tes Minggu Ini</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#fee2e2', color: '#991b1b', borderRadius: '20px' }}>
                  Menunggu
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Pendaftaran Pending</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', margin: '4px 0 2px' }}>{pendingCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Belum Verifikasi Berkas</div>
            </div>
          </div>

          {/* Main Candidate Table Section */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <School size={20} style={{ color: '#2575b9' }} /> Data Pendaftar NISN — {currentBranchId === 'ALL' ? 'Semua Pos Cabang' : activeBranch?.name}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px' }}>
                  Klik nama atau baris calon siswa untuk melihat dossier berkas detail pendaftaran.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('public_form')}
                style={{ padding: '10px 18px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
              >
                <Plus size={16} /> Input Pendaftaran Baru
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '14px', fontWeight: 700 }}>No. Reg & NISN</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>Nama Calon Siswa</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>Program Pilihan</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>No. WA Ortu / Wali</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>Pos Cabang Belajar</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>Nilai Tes</th>
                    <th style={{ padding: '14px', fontWeight: 700 }}>Status Registrasi</th>
                    <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPpdbList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                        Belum ada pendaftar calon siswa baru di {activeBranch?.name}.
                      </td>
                    </tr>
                  ) : (
                    filteredPpdbList.map((cand) => {
                      const brName = branches.find(b => b.id === cand.targetBranchId)?.name || activeBranch.name;
                      return (
                        <tr
                          key={cand.id}
                          className="hover-lift"
                          style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onClick={() => setSelectedCandidate(cand)}
                        >
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{cand.regNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>NISN: {cand.nisn || '0089123451'}</div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cand.applicantName.substring(0, 1)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: '#2575b9' }}>{cand.applicantName}</div>
                                <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Eye size={12} style={{ color: '#2575b9' }} /> Klik detail dossier
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px', color: '#334155', fontWeight: 700 }}>
                            {cand.grade}
                          </td>
                          <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>
                            {cand.parentPhone}
                          </td>
                          <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>
                            {brName}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ padding: '4px 10px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                              {cand.testScore ? `${cand.testScore} / 100` : 'Belum Tes'}
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span className={`badge ${cand.status === 'Approved' ? 'badge-success' : cand.status === 'Interview' ? 'badge-warning' : 'badge-primary'}`}>
                              {cand.status === 'Approved' ? 'DITERIMA ✅' : cand.status === 'Interview' ? 'PROSES TES ⏳' : 'PENDING 📝'}
                            </span>
                          </td>
                          <td style={{ padding: '14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                            {cand.status === 'Approved' ? (
                              <span style={{ fontSize: '0.775rem', color: '#166534', fontWeight: 800, padding: '6px 12px', background: '#dcfce7', borderRadius: '20px' }}>NIM Terbit ✅</span>
                            ) : (
                              <button
                                onClick={() => handleApproveCandidate(cand)}
                                style={{ padding: '6px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)' }}
                              >
                                <Check size={14} /> Terima & NIM
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: FORM PENDAFTARAN PUBLIC / INPUT PPDB */}
      {activeTab === 'public_form' && (
        <div style={{ background: '#ffffff', padding: '36px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={56} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Pendaftaran Calon Siswa Berhasil!</h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '6px 0 20px' }}>
                Nomor Registrasi Resmi: <strong>{regNumber}</strong>. Data telah tersimpan di sistem PPDB {branches.find(b => b.id === targetBranchId)?.name}.
              </p>
              <button onClick={() => { setSubmitted(false); setActiveTab('admin_data'); }} style={{ padding: '10px 24px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Lihat Data Calon Siswa Cabang →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <UserCheck size={28} style={{ color: '#2575b9' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Form Pendaftaran PPDB NISN Calon Siswa Baru</h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>Input data registrasi siswa baru untuk pos cabang target.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nama Lengkap Siswa *</label>
                  <input type="text" placeholder="Nama lengkap calon siswa" value={applicantName} onChange={e => setApplicantName(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>NISN Siswa *</label>
                  <input type="text" placeholder="10 digit NISN" value={nisn} onChange={e => setNisn(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Asal Sekolah *</label>
                  <input type="text" placeholder="Contoh: SMAN 1 Pontianak" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Program / Kelas Pilihan *</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="select-field">
                    <option value="XII SMA (Kedokteran)">XII SMA - Garansi Kedokteran & UTBK PTN</option>
                    <option value="XI SMA (Intensif)">XI SMA - Program Intensif SNBT</option>
                    <option value="IX SMP (Unggulan)">IX SMP - Persiapan SMA Unggulan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>No. WhatsApp Wali *</label>
                  <input type="text" placeholder="08xxxxxxxxxx" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Target Pos Cabang Belajar *</label>
                  <select value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} className="select-field">
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" style={{ padding: '14px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.925rem', cursor: 'pointer', marginTop: '10px' }}>
                Kirim Pendaftaran & Simpan ke Cabang →
              </button>
            </form>
          )}
        </div>
      )}

      {/* 📄 INTERACTIVE CANDIDATE DOSSIER DETAIL MODAL */}
      {selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div id="printable-candidate-dossier" style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '640px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontWeight: 900, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedCandidate.applicantName.substring(0, 1)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedCandidate.applicantName}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span>No. Reg: <strong>{selectedCandidate.regNumber}</strong></span>
                    <span>•</span>
                    <span>NISN: <strong>{selectedCandidate.nisn || '0089123451'}</strong></span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedCandidate(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            {/* Dossier Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.875rem' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Jenis Kelamin:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCandidate.gender === 'P' ? 'Perempuan (P)' : 'Laki-laki (L)'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Tempat & Tanggal Lahir:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedCandidate.birthInfo || 'Pontianak, 14 Mei 2008'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Program / Kelas Target:</span>
                  <div style={{ fontWeight: 800, color: '#2575b9', marginTop: '2px' }}>{selectedCandidate.grade}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Pos Cabang Belajar:</span>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {branches.find(b => b.id === selectedCandidate.targetBranchId)?.name || activeBranch.name}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Asal Sekolah:</span>
                  <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{selectedCandidate.previousSchool || 'SMA Negeri 1 Pontianak'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>No. WhatsApp Wali:</span>
                  <div style={{ fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>{selectedCandidate.parentPhone}</div>
                </div>
              </div>

              {/* Test Score & DP Status Card */}
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '14px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#92400e' }}>HASIL PLACEMENT TEST SNBT</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#78350f' }}>
                    {selectedCandidate.testScore ? `${selectedCandidate.testScore} / 100 (Pass Grade A)` : '79 / 100'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#92400e' }}>STATUS UANG PANGKAL</div>
                  <span style={{ padding: '4px 12px', background: selectedCandidate.downpaymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2', color: selectedCandidate.downpaymentStatus === 'Paid' ? '#166534' : '#991b1b', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-block', marginTop: '4px' }}>
                    {selectedCandidate.downpaymentStatus === 'Paid' ? 'DP LUNAS ✅' : 'BELUM DP ⏳'}
                  </span>
                </div>
              </div>

              {/* Parent Details */}
              <div style={{ padding: '16px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>DATA ORANG TUA / WALI SISWA</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#475569', fontSize: '0.825rem' }}>
                  <div>Nama Orang Tua / Wali: <strong>{selectedCandidate.parentName || 'Ibu Susanti'}</strong></div>
                  <div>Alamat Domisili Rumah: <strong>{selectedCandidate.homeAddress || 'Jl. Sui Raya Dalam No. 15, Pontianak Tenggara'}</strong></div>
                </div>
              </div>
            </div>

            {/* Printable CSS for Candidate Dossier */}
            <style jsx global>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-candidate-dossier, #printable-candidate-dossier * {
                  visibility: visible;
                }
                #printable-candidate-dossier {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .no-print {
                  display: none !important;
                }
              }
            `}</style>

            {/* Modal Actions */}
            <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              {selectedCandidate.status !== 'Approved' ? (
                <button
                  onClick={() => handleApproveCandidate(selectedCandidate)}
                  style={{ flex: 1, padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                >
                  <Check size={16} /> Terima Siswa & Terbitkan NIM
                </button>
              ) : (
                <button disabled style={{ flex: 1, padding: '12px', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem' }}>
                  Siswa Ini Sudah Diterima & Terdaftar NIM ✅
                </button>
              )}

              <button
                onClick={() => window.print()}
                style={{ padding: '12px 18px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)' }}
              >
                <Printer size={16} /> Cetak Dossier PDF
              </button>

              <a
                href={`https://wa.me/62${selectedCandidate.parentPhone.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '12px 18px', background: '#25d366', color: '#ffffff', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Phone size={16} /> WhatsApp Ortu
              </a>

              <button onClick={() => setSelectedCandidate(null)} style={{ padding: '12px 18px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function PublicPPDBPage() {
  return (
    <Suspense fallback={<div style={{ padding: '30px', color: '#64748b' }}>Memuat Aplikasi PPDB Online...</div>}>
      <PublicPPDBContent />
    </Suspense>
  );
}
