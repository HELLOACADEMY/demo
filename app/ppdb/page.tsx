'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useERP } from '@/context/ERPContext';
import { useSearchParams } from 'next/navigation';
import { UserCheck, Plus, CheckCircle, FileText, Download, Phone, MapPin, School, GraduationCap, Eye, User, Calendar, ShieldCheck, Send } from 'lucide-react';
import { PPDBApplication } from '@/lib/store';

function PPDBContent() {
  const { ppdbList, filteredPpdbList, branches, addStudent, addAuditLog, isSuperAdmin } = useERP();
  const searchParams = useSearchParams();

  const [applications, setApplications] = useState<PPDBApplication[]>(filteredPpdbList);
  const [showModal, setShowModal] = useState(false);
  const [selectedDetailApp, setSelectedDetailApp] = useState<PPDBApplication | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('register') === 'true') {
      setShowModal(true);
    }
  }, [searchParams]);

  // Form Complete Registration Data Fields
  const [applicantName, setApplicantName] = useState('');
  const [nisn, setNisn] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthInfo, setBirthInfo] = useState('Pontianak, 14 Mei 2008');
  const [previousSchool, setPreviousSchool] = useState('SMA Negeri 1 Pontianak');
  const [grade, setGrade] = useState('XII SMA (Kedokteran)');
  const [parentName, setParentName] = useState('Hendra Wijaya');
  const [parentPhone, setParentPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('Jl. Ahmad Yani No. 45, Pontianak');
  const [targetBranchId, setTargetBranchId] = useState(branches[0]?.id || 'br-1');

  const approveApplicant = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));

    // Automatically convert to registered student
    addStudent({
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: app.applicantName,
      gender: 'L',
      grade: app.grade,
      branchId: app.targetBranchId,
      parentId: 'prt-1',
      status: 'Aktif'
    });

    addAuditLog('Approve PPDB Registration', 'PPDB', `Calon siswa ${app.applicantName} resmi diterima & terdaftar di database siswa`);
    setSuccessAlert(`Calon siswa ${app.applicantName} berhasil diterima & otomatis terdaftar di Direktori Siswa!`);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const handleCreateFullRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !parentPhone) return;

    const newApp: PPDBApplication = {
      id: `ppdb-${Date.now()}`,
      regNumber: `REG/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      applicantName,
      targetBranchId,
      grade,
      parentPhone,
      status: 'Pending',
      testScore: Math.floor(75 + Math.random() * 20),
      downpaymentStatus: 'Paid'
    };

    setApplications(prev => [newApp, ...prev]);
    addAuditLog('Submit PPDB Registration', 'PPDB', `Form registrasi lengkap calon siswa ${applicantName} berhasil dikirim`);
    setShowModal(false);

    // Reset Form
    setApplicantName(''); setNisn(''); setParentPhone('');
    setSuccessAlert(`Form Registrasi Lengkap Siswa ${applicantName} Berhasil Diterbitkan!`);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck style={{ color: '#2575b9' }} /> Daftar Registrasi Calon Siswa Baru (PPDB Online)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Data registrasi biodata lengkap calon siswa baru, berkas administrasi, nilai placement test, dan verifikasi cabang.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> + Registrasi Calon Siswa Baru (Data Lengkap)
        </button>
      </div>

      {successAlert && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> {successAlert}
        </div>
      )}

      {/* Tabel Daftar Registrasi Calon Siswa */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>
          Pendaftar PPDB Online 2026 / 2027
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>No. Registrasi</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Lengkap Siswa</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Program / Tingkat</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>WhatsApp Orang Tua</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Target Cabang</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Test Score</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status Pendaftaran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Aksi Detail</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(p => {
                const brName = branches.find(b => b.id === p.targetBranchId)?.name || 'Serdam Pusat';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{p.regNumber}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{p.applicantName}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{p.grade}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>📞 {p.parentPhone}</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-success">{brName}</span></td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{p.testScore || 85} / 100</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedDetailApp(p)}
                          style={{ padding: '6px 10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#2575b9', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={14} /> Lihat Biodata
                        </button>
                        {p.status === 'Pending' && (
                          <button
                            onClick={() => approveApplicant(p.id)}
                            style={{ padding: '6px 12px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Terima Siswa
                          </button>
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

      {/* MODAL BIODATA LENGKAP CALON SISWA */}
      {selectedDetailApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '540px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>BIODATA LENGKAP REGISTRASI SISWA</h2>
              <button type="button" onClick={() => setSelectedDetailApp(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#475569' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>No. Registrasi: <strong style={{ color: '#2575b9' }}>{selectedDetailApp.regNumber}</strong></span>
                <span className="badge badge-success">{selectedDetailApp.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>Nama Lengkap: <strong style={{ color: '#0f172a', display: 'block' }}>{selectedDetailApp.applicantName}</strong></div>
                <div>NISN: <strong style={{ color: '#0f172a', display: 'block' }}>0058291030</strong></div>
                <div>Tempat, Tanggal Lahir: <strong style={{ color: '#0f172a', display: 'block' }}>Pontianak, 14 Mei 2008</strong></div>
                <div>Jenis Kelamin: <strong style={{ color: '#0f172a', display: 'block' }}>Laki-laki (L)</strong></div>
                <div>Asal Sekolah: <strong style={{ color: '#0f172a', display: 'block' }}>SMA Negeri 1 Pontianak</strong></div>
                <div>Program Pilihan: <strong style={{ color: '#2575b9', display: 'block' }}>{selectedDetailApp.grade}</strong></div>
                <div>Nama Orang Tua / Wali: <strong style={{ color: '#0f172a', display: 'block' }}>Hendra Wijaya</strong></div>
                <div>No. WhatsApp Wali: <strong style={{ color: '#0f172a', display: 'block' }}>📞 {selectedDetailApp.parentPhone}</strong></div>
              </div>

              <div>Alamat Rumah Lengkap: <strong style={{ color: '#0f172a', display: 'block' }}>Jl. Ahmad Yani No. 45, Kota Pontianak</strong></div>

              <div style={{ padding: '10px', background: '#eef2ff', borderRadius: '8px', color: '#2575b9', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Hasil Test Placement SNBT:</span>
                <span style={{ fontSize: '1.1rem', color: '#16a34a' }}>{selectedDetailApp.testScore || 85} / 100</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setSelectedDetailApp(null)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Tutup</button>
              {selectedDetailApp.status === 'Pending' && (
                <button type="button" onClick={() => { approveApplicant(selectedDetailApp.id); setSelectedDetailApp(null); }} style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Terima Sebagai Siswa Aktif</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM REGISTRASI CALON SISWA DATA LENGKAP */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreateFullRegistration} style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Form Registrasi Data Lengkap Calon Siswa Baru</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nama Lengkap Siswa *</label>
                  <input type="text" placeholder="Nama lengkap siswa" value={applicantName} onChange={e => setApplicantName(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>NISN Siswa *</label>
                  <input type="text" placeholder="Nomor Induk Siswa Nasional" value={nisn} onChange={e => setNisn(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jenis Kelamin *</label>
                  <select value={gender} onChange={e => setGender(e.target.value as 'L' | 'P')} className="select-field">
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Tempat & Tanggal Lahir *</label>
                  <input type="text" value={birthInfo} onChange={e => setBirthInfo(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Asal Sekolah *</label>
                  <input type="text" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Program / Kelas Pilihan *</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="select-field">
                    <option value="XII SMA (Kedokteran)">XII SMA - Garansi Kedokteran</option>
                    <option value="XI SMA (Intensif)">XI SMA - Intensif SNBT</option>
                    <option value="IX SMP (Kedinasan)">IX SMP - Persiapan Kedinasan</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nama Orang Tua / Wali *</label>
                  <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>No. WhatsApp Wali *</label>
                  <input type="text" placeholder="08xxxxxxxxxx" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Target Cabang Hello Academy *</label>
                <select value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} className="select-field">
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Alamat Rumah Lengkap *</label>
                <textarea value={homeAddress} onChange={e => setHomeAddress(e.target.value)} required className="input-field" style={{ minHeight: '70px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Submit Registrasi Lengkap →</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PPDBPage() {
  return (
    <Suspense fallback={<div style={{ padding: '30px', color: '#64748b' }}>Memuat Form Pendaftaran PPDB...</div>}>
      <PPDBContent />
    </Suspense>
  );
}
