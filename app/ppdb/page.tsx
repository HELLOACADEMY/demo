'use client';

import React, { useState, Suspense } from 'react';
import { useERP } from '@/context/ERPContext';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  UserCheck, CheckCircle2, Phone, MapPin, School, GraduationCap, ArrowLeft, Send, Sparkles,
  Filter, Check, X, Award, ShieldCheck, Plus, Eye, FileText, Printer, Clock, AlertCircle,
  Building2, Users, FileCheck2, User, Trash2, CreditCard, Shield, ChevronRight, HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface StudentFormItem {
  id: string;
  package: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: string;
  gender: 'L' | 'P';
  school: string;
  address: string;
}

const PACKAGE_PRICES: Record<string, number> = {
  'Superclass PTN (Rp 7.199.450)': 7199450,
  'Kelas Reguler Intensif (Rp 3.500.000)': 3500000,
  'Garansi Kedokteran UTBK (Rp 9.800.000)': 9800000,
  'Kelas Persiapan SD/SMP/SMA (Rp 2.800.000)': 2800000,
};

function PublicPPDBContent() {
  const { branches, addAuditLog, currentRole, currentBranchId, filteredPpdbList, setPpdbList, students, setStudents } = useERP();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'admin_data' | 'public_form'>(
    (currentRole === 'super_admin' || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan') ? 'admin_data' : 'public_form'
  );

  // Selected Branch
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  // Handle browser back button navigation (tombol back pada browser komputer)
  React.useEffect(() => {
    const isAdminRole = currentRole === 'super_admin' || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan';
    if (isAdminRole) return; // Admin tetap di dashboard panel masing-masing

    // Push dummy state so hitting browser back button triggers popstate handler to landing page for public users
    window.history.pushState({ page: 'ppdb' }, '', window.location.href);

    const handlePopState = () => {
      window.location.href = '/';
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentRole]);

  // Dynamic Students List for registration
  const [studentsList, setStudentsList] = useState<StudentFormItem[]>([
    {
      id: 'std-form-1',
      package: 'Superclass PTN (Rp 7.199.450)',
      price: 7199450,
      name: '',
      email: '',
      phone: '',
      birthPlace: '',
      birthDate: '',
      gender: 'L',
      school: '',
      address: ''
    }
  ]);

  // Parent / Guardian Data
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [fatherJob, setFatherJob] = useState('');
  const [motherJob, setMotherJob] = useState('');

  // Syarat & Ketentuan Checkbox State & Modal
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  // Calculate Total Payment
  const totalPaymentAmount = studentsList.reduce((sum, s) => sum + (PACKAGE_PRICES[s.package] || 7199450), 0);

  const handleAddStudentRow = () => {
    setStudentsList(prev => [
      ...prev,
      {
        id: `std-form-${Date.now()}`,
        package: 'Superclass PTN (Rp 7.199.450)',
        price: 7199450,
        name: '',
        email: '',
        phone: '',
        birthPlace: '',
        birthDate: '',
        gender: 'L',
        school: '',
        address: ''
      }
    ]);
  };

  const handleRemoveStudentRow = (id: string) => {
    if (studentsList.length === 1) return;
    setStudentsList(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateStudent = (id: string, field: keyof StudentFormItem, value: any) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: value };
        if (field === 'package') {
          updated.price = PACKAGE_PRICES[value] || 7199450;
        }
        return updated;
      }
      return s;
    }));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) {
      alert('Silakan pilih cabang terlebih dahulu sebelum melanjutkan.');
      return;
    }

    if (!agreedTerms) {
      alert('Anda wajib menyetujui Syarat & Ketentuan Pendaftaran terlebih dahulu dengan mencentang kotak persetujuan.');
      return;
    }

    const firstStudent = studentsList[0];
    if (!firstStudent?.name || !parentPhone) {
      alert('Mohon lengkapi nama siswa dan nomor telepon orang tua.');
      return;
    }

    const newRegNum = `PPDB-2026-${Math.floor(100 + Math.random() * 900)}`;
    setRegNumber(newRegNum);

    const newCandidate = {
      id: `ppdb-${Date.now()}`,
      regNumber: newRegNum,
      nisn: `008${Math.floor(1000000 + Math.random() * 9000000)}`,
      applicantName: firstStudent.name,
      gender: firstStudent.gender,
      birthInfo: `${firstStudent.birthPlace || 'Pontianak'}, ${firstStudent.birthDate || '2008-05-14'}`,
      previousSchool: firstStudent.school || 'SMA Negeri 1 Pontianak',
      grade: firstStudent.package,
      parentName: fatherName ? `Bpk. ${fatherName}` : motherName ? `Ibu ${motherName}` : `Wali ${firstStudent.name}`,
      parentPhone,
      homeAddress: firstStudent.address || parentAddress || 'Jl. Sui Raya Dalam No. 15, Pontianak',
      targetBranchId: selectedBranchId,
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

    await addAuditLog('Public PPDB Form Submit', 'PPDB', `Pendaftaran calon siswa baru ${firstStudent.name} (${newRegNum}) di ${branches.find(b => b.id === selectedBranchId)?.name}`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: "'Manrope', sans-serif", margin: '20px auto 40px', maxWidth: '1280px', padding: '0 16px' }}>
      
      {/* Header Page (Hanya tampil di tampilan internal admin) */}
      {(currentRole === 'super_admin' || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan') && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck style={{ color: '#2563eb' }} /> Pendaftaran & Seleksi NISN Calon Siswa Baru
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
              Pengelolaan data registrasi, placement test, dan verifikasi berkas terisolasi per pos cabang Pontianak.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '5px', borderRadius: '14px', border: '1.5px solid #e2e8f0', display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('admin_data')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'admin_data' ? '#2563eb' : 'transparent',
                color: activeTab === 'admin_data' ? '#ffffff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={16} /> Data Calon Siswa ({filteredPpdbList.length})
            </button>
            <button
              onClick={() => setActiveTab('public_form')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'public_form' ? '#2563eb' : 'transparent',
                color: activeTab === 'public_form' ? '#ffffff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} /> Form Registrasi Publik
            </button>
          </div>
        </div>
      )}

      {actionNotice && (
        <div style={{ padding: '16px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '14px', color: '#166534', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
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
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
                  {activeBranch?.code}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Total Pendaftar PPDB</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 2px' }}>{totalCount} Calon Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Tahun Ajaran 2026/2027</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px' }}>
                  Lulus Seleksi
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Siswa Diterima (NIM)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#16a34a', margin: '4px 0 2px' }}>{approvedCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Konversi Siswa Aktif</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', background: '#fef3c7', color: '#92400e', borderRadius: '20px' }}>
                  Placement Test
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Proses Tes & Wawancara</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#d97706', margin: '4px 0 2px' }}>{interviewCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Jadwal Tes Minggu Ini</div>
            </div>

            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', background: '#fee2e2', color: '#991b1b', borderRadius: '20px' }}>
                  Menunggu
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Pendaftaran Pending</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ef4444', margin: '4px 0 2px' }}>{pendingCount} Siswa</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Belum Verifikasi Berkas</div>
            </div>
          </div>

          {/* Main Candidate Table Section */}
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <School size={20} style={{ color: '#2563eb' }} /> Data Pendaftar NISN — {currentBranchId === 'ALL' ? 'Semua Pos Cabang' : activeBranch?.name}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '4px' }}>
                  Klik nama atau baris calon siswa untuk melihat dossier berkas detail pendaftaran.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('public_form')}
                style={{ padding: '10px 18px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
              >
                <Plus size={16} /> Input Pendaftaran Baru
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '14px', fontWeight: 600 }}>No. Reg & NISN</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>Nama Calon Siswa</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>Program Pilihan</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>No. WA Ortu / Wali</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>Pos Cabang Belajar</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>Nilai Tes</th>
                    <th style={{ padding: '14px', fontWeight: 600 }}>Status Registrasi</th>
                    <th style={{ padding: '14px', fontWeight: 600, textAlign: 'center' }}>Tindakan</th>
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
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{cand.regNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>NISN: {cand.nisn || '0089123451'}</div>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cand.applicantName.substring(0, 1)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#2563eb' }}>{cand.applicantName}</div>
                                <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Eye size={12} style={{ color: '#2563eb' }} /> Klik detail dossier
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px', color: '#334155', fontWeight: 600 }}>
                            {cand.grade}
                          </td>
                          <td style={{ padding: '14px', color: '#475569', fontWeight: 500 }}>
                            {cand.parentPhone}
                          </td>
                          <td style={{ padding: '14px', color: '#475569', fontWeight: 500 }}>
                            {brName}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{ padding: '4px 10px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
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
                              <span style={{ fontSize: '0.775rem', color: '#166534', fontWeight: 600, padding: '6px 12px', background: '#dcfce7', borderRadius: '20px' }}>NIM Terbit ✅</span>
                            ) : (
                              <button
                                onClick={() => handleApproveCandidate(cand)}
                                style={{ padding: '6px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)' }}
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

      {/* TAB 2: FORM PENDAFTARAN PUBLIC / INPUT PPDB ULTRA-MODERN (CHECKOUT PORTAL STYLE) */}
      {activeTab === 'public_form' && (
        <div className="animate-slide-up" style={{ width: '100%' }}>

          {/* Top Hero Banner Header with Spacing */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)', padding: '36px 32px', borderRadius: '24px', color: '#ffffff', marginBottom: '32px', boxShadow: '0 12px 40px rgba(37, 99, 235, 0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '240px', height: '240px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
            
            {/* ⬅️ Kembali Button: Admin kembali ke Dashboard Panel, Publik kembali ke Landing Page */}
            {(currentRole === 'super_admin' || currentRole === 'admin_cabang' || currentRole === 'staff_keuangan') ? (
              <Link
                href={currentRole === 'staff_keuangan' ? '/finance/billing' : '/dashboard'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <ArrowLeft size={16} /> ← Kembali ke Dashboard Panel
              </Link>
            ) : (
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <ArrowLeft size={16} /> ← Kembali ke Beranda Landing Page
              </Link>
            )}

            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#ffffff', lineHeight: 1.2 }}>
              Lengkapi Data Pendaftaran Siswa
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#93C5FD', marginTop: '8px', maxWidth: '680px', fontWeight: 400, lineHeight: 1.6 }}>
              Pilih cabang lokasi belajar Pontianak, paket bimbingan belajar, dan isi data calon siswa baru secara instan.
            </p>

            {/* Interactive Step Progress Bar */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                <MapPin size={16} style={{ color: '#FCD34D' }} /> 1. Pilih Cabang
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                <GraduationCap size={16} style={{ color: '#60A5FA' }} /> 2. Data Siswa
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                <Users size={16} style={{ color: '#34D399' }} /> 3. Orang Tua
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#93C5FD' }}>
                <CreditCard size={16} /> 4. Pembayaran
              </div>
            </div>
          </div>

          {/* Form Content Split Layout: 2 Columns on Desktop */}
          {submitted ? (
            <div style={{ background: '#ffffff', padding: '48px 32px', borderRadius: '24px', border: '1.5px solid #e2e8f0', textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.05)', maxWidth: '720px', margin: '0 auto' }}>
              <CheckCircle2 size={72} style={{ color: '#10B981', margin: '0 auto 18px' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A' }}>Pendaftaran Berhasil Dikirim!</h2>
              <p style={{ fontSize: '1rem', color: '#64748B', margin: '10px 0 28px', lineHeight: 1.6 }}>
                Nomor Registrasi Resmi: <strong style={{ color: '#2563EB', fontSize: '1.1rem' }}>{regNumber}</strong>.<br />
                Tim Admin Cabang {branches.find(b => b.id === selectedBranchId)?.name || 'Pontianak'} akan segera menghubungi nomor WhatsApp orang tua untuk instruksi tes & jadwal belajar.
              </p>
              <Link href="/" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Kembali ke Beranda (Landing Page)
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitRegistration} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }} className="responsive-grid">
              
              {/* LEFT MAIN FORM COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* 📍 STEP 1: PILIH CABANG */}
                <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1.5px solid #DBEAFE', boxShadow: '0 8px 24px rgba(37,99,235,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Pilih Cabang Belajar *</h3>
                      <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>Tentukan lokasi bimbingan belajar terdekat di Pontianak</p>
                    </div>
                  </div>

                  <select
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchId(e.target.value)}
                    className="select-field"
                    style={{
                      width: '100%',
                      background: '#F8FAFC',
                      borderColor: selectedBranchId ? '#2563EB' : '#CBD5E1',
                      fontSize: '0.925rem',
                      padding: '12px 16px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                    required
                  >
                    <option value="">— Pilih Cabang Lokasi Belajar —</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>📍 {b.name} ({b.code}) — {b.address}</option>
                    ))}
                  </select>

                  {!selectedBranchId && (
                    <div style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 600, marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={14} /> Silakan pilih cabang terlebih dahulu sebelum melanjutkan.
                    </div>
                  )}
                </div>

                {/* 🎓 STEP 2: DATA SISWA (MULTI-SISWA CARDS) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {studentsList.map((std, index) => (
                    <div key={std.id} style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', position: 'relative' }}>
                      
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                            🎓
                          </div>
                          <span>Siswa {index + 1}</span>
                        </div>

                        {studentsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStudentRow(std.id)}
                            style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '10px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Trash2 size={14} /> Hapus Siswa Ini
                          </button>
                        )}
                      </div>

                      {/* Fields */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        
                        {/* Paket Belajar */}
                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                            Paket Belajar *
                          </label>
                          <select
                            value={std.package}
                            onChange={e => handleUpdateStudent(std.id, 'package', e.target.value)}
                            className="select-field"
                            style={{ width: '100%', padding: '12px 16px', background: '#F8FAFC', fontWeight: 600, borderRadius: '12px' }}
                          >
                            <option value="Superclass PTN (Rp 7.199.450)">Superclass PTN (Rp 7.199.450)</option>
                            <option value="Kelas Reguler Intensif (Rp 3.500.000)">Kelas Reguler Intensif (Rp 3.500.000)</option>
                            <option value="Garansi Kedokteran UTBK (Rp 9.800.000)">Garansi Kedokteran UTBK (Rp 9.800.000)</option>
                            <option value="Kelas Persiapan SD/SMP/SMA (Rp 2.800.000)">Kelas Persiapan SD/SMP/SMA (Rp 2.800.000)</option>
                          </select>
                        </div>

                        {/* Nama & Email */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Nama Lengkap *
                            </label>
                            <input
                              type="text"
                              placeholder="Nama siswa"
                              value={std.name}
                              onChange={e => handleUpdateStudent(std.id, 'name', e.target.value)}
                              required
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Email *
                            </label>
                            <input
                              type="email"
                              placeholder="email@contoh.com"
                              value={std.email}
                              onChange={e => handleUpdateStudent(std.id, 'email', e.target.value)}
                              required
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                        </div>

                        {/* Telepon & Tempat/Tgl Lahir */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              No. Telepon Siswa *
                            </label>
                            <input
                              type="text"
                              placeholder="08xxxxxxxxxx"
                              value={std.phone}
                              onChange={e => handleUpdateStudent(std.id, 'phone', e.target.value)}
                              required
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Tempat Lahir
                            </label>
                            <input
                              type="text"
                              placeholder="Jakarta"
                              value={std.birthPlace}
                              onChange={e => handleUpdateStudent(std.id, 'birthPlace', e.target.value)}
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Tanggal Lahir
                            </label>
                            <input
                              type="date"
                              value={std.birthDate}
                              onChange={e => handleUpdateStudent(std.id, 'birthDate', e.target.value)}
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                        </div>

                        {/* Jenis Kelamin & Asal Sekolah */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px', alignItems: 'center' }}>
                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Jenis Kelamin
                            </label>
                            <div style={{ display: 'flex', gap: '12px', padding: '6px 0' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: std.gender === 'L' ? '#DBEAFE' : '#F8FAFC', padding: '8px 14px', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                                <input
                                  type="radio"
                                  name={`gender-${std.id}`}
                                  checked={std.gender === 'L'}
                                  onChange={() => handleUpdateStudent(std.id, 'gender', 'L')}
                                /> ♂️ Laki-laki
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: std.gender === 'P' ? '#FCE7F3' : '#F8FAFC', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FBCFE8' }}>
                                <input
                                  type="radio"
                                  name={`gender-${std.id}`}
                                  checked={std.gender === 'P'}
                                  onChange={() => handleUpdateStudent(std.id, 'gender', 'P')}
                                /> ♀️ Perempuan
                              </label>
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                              Asal Sekolah
                            </label>
                            <input
                              type="text"
                              placeholder="SMA Negeri 1 Jakarta"
                              value={std.school}
                              onChange={e => handleUpdateStudent(std.id, 'school', e.target.value)}
                              className="input-field"
                              style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                            />
                          </div>
                        </div>

                        {/* Alamat Siswa */}
                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                            Alamat Siswa
                          </label>
                          <input
                            type="text"
                            placeholder="Jl. Contoh No. 123"
                            value={std.address}
                            onChange={e => handleUpdateStudent(std.id, 'address', e.target.value)}
                            className="input-field"
                            style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                          />
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Add Student Button */}
                  <button
                    type="button"
                    onClick={handleAddStudentRow}
                    style={{ padding: '14px', background: '#EFF6FF', border: '1.5px dashed #3B82F6', borderRadius: '16px', color: '#2563EB', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                  >
                    <Plus size={18} /> + Tambah Siswa (Daftarkan Kakak / Adik Sekaligus)
                  </button>
                </div>

                {/* 👵 STEP 3: DATA ORANG TUA / WALI */}
                <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Data Orang Tua / Wali</h3>
                      <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>Kontak resmi wali untuk laporan progres & notifikasi absensi</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Nama Ayah & Ibu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Nama Ayah
                        </label>
                        <input
                          type="text"
                          placeholder="Nama ayah"
                          value={fatherName}
                          onChange={e => setFatherName(e.target.value)}
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Nama Ibu
                        </label>
                        <input
                          type="text"
                          placeholder="Nama ibu"
                          value={motherName}
                          onChange={e => setMotherName(e.target.value)}
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                    </div>

                    {/* Telepon & Alamat Ortu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          No. Telepon Orang Tua *
                        </label>
                        <input
                          type="text"
                          placeholder="08xxxxxxxxxx"
                          value={parentPhone}
                          onChange={e => setParentPhone(e.target.value)}
                          required
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Alamat Orang Tua
                        </label>
                        <input
                          type="text"
                          placeholder="Jl. Contoh No. 123"
                          value={parentAddress}
                          onChange={e => setParentAddress(e.target.value)}
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                    </div>

                    {/* Pekerjaan Ayah & Ibu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Pekerjaan Ayah
                        </label>
                        <input
                          type="text"
                          placeholder="PNS / Wiraswasta"
                          value={fatherJob}
                          onChange={e => setFatherJob(e.target.value)}
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                          Pekerjaan Ibu
                        </label>
                        <input
                          type="text"
                          placeholder="IRT / Wiraswasta"
                          value={motherJob}
                          onChange={e => setMotherJob(e.target.value)}
                          className="input-field"
                          style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 16px' }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Submit Action Notice & Mandatory Checkbox */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  
                  {/* Mandatory Interactive Checkbox */}
                  <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '14px', border: agreedTerms ? '1.5px solid #3b82f6' : '1.5px solid #cbd5e1', width: '100%', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}>
                    <input
                      type="checkbox"
                      id="agreeTermsInput"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                      required
                    />
                    <label htmlFor="agreeTermsInput" style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer', flex: 1, lineHeight: 1.5 }}>
                      Saya telah membaca dan menyetujui <button type="button" onClick={() => setShowTermsModal(true)} style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 700, background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Syarat & Ketentuan Pendaftaran</button> yang berlaku di Bsmart Education. *
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-yellow"
                    style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 700, justifyContent: 'center', boxShadow: '0 10px 30px rgba(245,158,11,0.35)', borderRadius: '14px', opacity: agreedTerms ? 1 : 0.8 }}
                  >
                    <CreditCard size={20} /> Lanjut ke Pembayaran ({studentsList.length} Siswa)
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: FLOATING ORDER & PACKAGE SUMMARY PANEL */}
              <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Summary Box */}
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #DBEAFE', padding: '24px', boxShadow: '0 12px 32px rgba(37,99,235,0.08)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} style={{ color: '#2563EB' }} /> Ringkasan Pendaftaran
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Pos Cabang:</span>
                      <strong style={{ color: '#0F172A' }}>
                        {branches.find(b => b.id === selectedBranchId)?.name || 'Belum Dipilih'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Jumlah Siswa:</span>
                      <strong style={{ color: '#2563EB' }}>{studentsList.length} Siswa</strong>
                    </div>
                  </div>

                  {/* List Students Breakdown */}
                  <div style={{ padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1.5px solid #F1F5F9' }}>
                    {studentsList.map((s, idx) => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                        <span style={{ color: '#334155' }}>
                          Siswa {idx + 1}: <strong>{s.name || '(Nama Siswa)'}</strong>
                        </span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          Rp {(PACKAGE_PRICES[s.package] || 7199450).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Payment Price */}
                  <div style={{ paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Total Biaya Pendaftaran:</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16A34A' }}>
                        Rp {totalPaymentAmount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Included Features */}
                  <div style={{ marginTop: '20px', padding: '16px', background: '#EFF6FF', borderRadius: '14px', fontSize: '0.8rem', color: '#1E40AF', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontWeight: 700, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '2px' }}>
                      <CheckCircle2 size={16} /> Fasilitas Termasuk:
                    </div>
                    <div>• Ruang Belajar Nyaman & Ber-AC</div>
                    <div>• Pembelajaran Full Digital & Interaktif</div>
                    <div>• Guru Berpengalaman & Bersertifikasi</div>
                    <div>• Materi Belajar Lengkap & Terstruktur</div>
                    <div>• Latihan Soal & Tryout Tanpa Batas</div>
                    <div>• Pendampingan Belajar Fokus pada Target</div>
                    <div>• Program Belajar Berorientasi Prestasi</div>
                  </div>
                </div>

                {/* Trust & Security Badge */}
                <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={28} style={{ color: '#10B981', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.5 }}>
                    <strong>Pendaftaran Resmi & Aman.</strong> Data Anda terenkripsi dan langsung diteruskan ke Sistem Administrasi Bsmart Education Pontianak.
                  </div>
                </div>

              </div>

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
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', fontWeight: 600, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedCandidate.applicantName.substring(0, 1)}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
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
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedCandidate.gender === 'P' ? 'Perempuan (P)' : 'Laki-laki (L)'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Tempat & Tanggal Lahir:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedCandidate.birthInfo || 'Pontianak, 14 Mei 2008'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Program / Kelas Target:</span>
                  <div style={{ fontWeight: 600, color: '#2575b9', marginTop: '2px' }}>{selectedCandidate.grade}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Pos Cabang Belajar:</span>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                    {branches.find(b => b.id === selectedCandidate.targetBranchId)?.name || activeBranch.name}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>Asal Sekolah:</span>
                  <div style={{ fontWeight: 600, color: '#334155', marginTop: '2px' }}>{selectedCandidate.previousSchool || 'SMA Negeri 1 Pontianak'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.775rem' }}>No. WhatsApp Wali:</span>
                  <div style={{ fontWeight: 600, color: '#16a34a', marginTop: '2px' }}>{selectedCandidate.parentPhone}</div>
                </div>
              </div>

              {/* Test Score & DP Status Card */}
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '14px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#92400e' }}>HASIL PLACEMENT TEST SNBT</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#78350f' }}>
                    {selectedCandidate.testScore ? `${selectedCandidate.testScore} / 100 (Pass Grade A)` : '79 / 100'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#92400e' }}>STATUS UANG PANGKAL</div>
                  <span style={{ padding: '4px 12px', background: selectedCandidate.downpaymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2', color: selectedCandidate.downpaymentStatus === 'Paid' ? '#166534' : '#991b1b', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>
                    {selectedCandidate.downpaymentStatus === 'Paid' ? 'DP LUNAS ✅' : 'BELUM DP ⏳'}
                  </span>
                </div>
              </div>

              {/* Parent Details */}
              <div style={{ padding: '16px', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>DATA WALI / ORANG TUA SISWA</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><span style={{ color: '#94a3b8' }}>Nama Orang Tua:</span> <strong>{selectedCandidate.parentName}</strong></div>
                  <div><span style={{ color: '#94a3b8' }}>Kontak WA:</span> <strong>{selectedCandidate.parentPhone}</strong></div>
                  <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#94a3b8' }}>Alamat Tempat Tinggal:</span> <strong>{selectedCandidate.homeAddress}</strong></div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {selectedCandidate.status !== 'Approved' && (
                  <button
                    onClick={() => handleApproveCandidate(selectedCandidate)}
                    style={{ flex: 1, padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                  >
                    <Check size={18} /> Verifikasi & Terima Calon Siswa Ini
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  style={{ padding: '12px 20px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Printer size={16} /> Cetak Dossier
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 📜 SYARAT & KETENTUAN INTERACTIVE MODAL */}
      {showTermsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '680px', border: '1px solid #e2e8f0', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                📜 Syarat & Ketentuan Pendaftaran Bsmart Education
              </h3>
              <button onClick={() => setShowTermsModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.875rem', color: '#334155', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
              <div style={{ background: '#eff6ff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #bfdbfe', color: '#1e40af' }}>
                <strong>Syarat Pendaftaran Resmi Ajaran 2026/2027</strong><br />
                Dengan melakukan pendaftaran di Bsmart Education Pontianak, siswa dan orang tua/wali menyetujui ketentuan berikut:
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>1. Kelengkapan Identitas Siswa:</strong>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Orang tua/wali wajib mengisi data NISN, nama lengkap, sekolah asal, dan nomor WhatsApp aktif secara benar untuk kepentingan laporan presensi & hasil ujian.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>2. Placement Test & Pemetaan Rombel:</strong>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Calon siswa baru akan dijadwalkan mengikuti Tes Penjajakan (Placement Test) di pos cabang target untuk pemetaan kelas bimbingan yang optimal.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>3. Ketentuan Pembayaran & Uang Pangkal:</strong>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>DP / Uang pangkal pendaftaran yang dibayarkan otomatis memotong total biaya bimbingan belajar dan menjadi tanda jadi resmi kuota rombel.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>4. Laporan Presensi Real-Time Orang Tua:</strong>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Orang tua berhak menerima notifikasi otomatis WhatsApp setiap kali siswa melakukan scan QR code presensi masuk dan pulang.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>5. Hak Akses Modul & Portal LMS CBT:</strong>
                <p style={{ margin: '4px 0 0', color: '#64748b' }}>Siswa berhak menerima paket buku modul fisik dan akses akun ujian tryout online di Portal LMS Bsmart selama masa aktif belajar.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1.5px solid #f1f5f9' }}>
              <button
                onClick={() => { setAgreedTerms(true); setShowTermsModal(false); }}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}
              >
                <Check size={18} /> Setuju & Centang Syarat Ketentuan
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
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading PPDB Portal...</div>}>
      <PublicPPDBContent />
    </Suspense>
  );
}
