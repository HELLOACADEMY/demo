'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useERP } from '@/context/ERPContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserCheck, CheckCircle2, Phone, MapPin, School, GraduationCap, ArrowLeft, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

function PublicPPDBContent() {
  const { branches, addAuditLog } = useERP();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !parentPhone || !previousSchool) return;

    const newRegNum = `REG/2026/08/${Math.floor(1000 + Math.random() * 9000)}`;
    setRegNumber(newRegNum);

    try {
      await fetch('/api/ppdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNumber: newRegNum,
          applicantName,
          targetBranchId,
          grade,
          parentPhone,
          status: 'Pending',
          testScore: 85,
          downpaymentStatus: 'Unpaid',
        }),
      });
    } catch (e) {
      console.error('Failed to submit PPDB to API:', e);
    }

    await addAuditLog('Public PPDB Form Submit', 'PPDB', `Pendaftaran calon siswa baru ${applicantName} (${newRegNum})`);
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '36px 20px 80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Top Public Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#4f46e5', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>H</span>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ef4444', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>E</span>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f59e0b', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>L</span>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#10b981', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>L</span>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#06b6d4', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>O!</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5' }}>PONTIANAK</span>
          </div>
        </div>

        {submitted ? (
          /* SUCCESS SUBMISSION CARD */
          <div style={{ background: '#fff', padding: '48px 36px', borderRadius: '24px', boxShadow: '0 10px 35px rgba(0,0,0,0.06)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={42} />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '10px' }}>
              Pendaftaran PPDB Berhasil Terkirim!
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Selamat <strong>{applicantName}</strong>! Data registrasi Anda telah tercatat di sistem akademik Hello Academy Pontianak.
            </p>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'inline-block', textAlign: 'left', marginBottom: '28px', minWidth: '280px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Nomor Registrasi Resmi:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.05em', marginTop: '4px' }}>{regNumber}</div>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '32px' }}>
              Tim Admin Cabang kami akan segera menghubungi WhatsApp <strong>{parentPhone}</strong> untuk konfirmasi jadwal Placement Test & rincian bea siswa.
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{ padding: '12px 28px', background: '#4f46e5', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Kembali ke Beranda Utama
              </Link>
              <a href="https://wa.me/6282153789821" target="_blank" rel="noreferrer" style={{ padding: '12px 28px', background: '#dcfce7', color: '#16a34a', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> Hubungi CS WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* FORM PENDAFTARAN PPDB PUBLIC */
          <div style={{ background: '#fff', padding: '40px 36px', borderRadius: '24px', boxShadow: '0 10px 35px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={26} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>
                  Form Pendaftaran PPDB 2026 / 2027
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Isikan data lengkap calon siswa baru Hello Academy Pontianak di bawah ini.
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0 0 24px' }} />

            <form onSubmit={handleSubmitRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nama Lengkap Siswa *</label>
                  <input type="text" placeholder="Masukkan nama lengkap siswa" value={applicantName} onChange={e => setApplicantName(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>NISN Siswa *</label>
                  <input type="text" placeholder="10 digit NISN" value={nisn} onChange={e => setNisn(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Jenis Kelamin *</label>
                  <select value={gender} onChange={e => setGender(e.target.value as 'L' | 'P')} className="select-field" style={{ padding: '12px 14px', borderRadius: '10px' }}>
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Tempat & Tanggal Lahir *</label>
                  <input type="text" placeholder="Contoh: Pontianak, 14 Mei 2008" value={birthInfo} onChange={e => setBirthInfo(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Asal Sekolah *</label>
                  <input type="text" placeholder="Contoh: SMA Negeri 1 Pontianak" value={previousSchool} onChange={e => setPreviousSchool(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Program / Kelas Pilihan *</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className="select-field" style={{ padding: '12px 14px', borderRadius: '10px' }}>
                    <option value="XII SMA (Kedokteran)">XII SMA - Garansi Kedokteran & UTBK PTN</option>
                    <option value="XI SMA (Intensif)">XI SMA - Program Intensif SNBT</option>
                    <option value="IX SMP (Kedinasan)">IX SMP - Persiapan SMA Unggulan / Kedinasan</option>
                    <option value="SD (Juara)">SD - Bimbel Juara Kelas & Fondasi Karakter</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nama Orang Tua / Wali *</label>
                  <input type="text" placeholder="Nama lengkap ibu / ayah" value={parentName} onChange={e => setParentName(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>No. WhatsApp Wali *</label>
                  <input type="text" placeholder="08xxxxxxxxxx" value={parentPhone} onChange={e => setParentPhone(e.target.value)} required className="input-field" style={{ padding: '12px 14px', borderRadius: '10px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Target Cabang Belajar *</label>
                <select value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} className="select-field" style={{ padding: '12px 14px', borderRadius: '10px' }}>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.address})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Alamat Rumah Lengkap *</label>
                <textarea placeholder="Alamat domisili lengkap di Kota Pontianak" value={homeAddress} onChange={e => setHomeAddress(e.target.value)} required className="input-field" style={{ minHeight: '80px', padding: '12px 14px', borderRadius: '10px' }} />
              </div>

              <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button type="submit" className="btn btn-red animate-glow hover-lift" style={{ width: '100%', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', border: 'none' }}>
                  <Send size={18} /> Kirim Pendaftaran PPDB 2026 Sekarang →
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PublicPPDBPage() {
  return (
    <Suspense fallback={<div style={{ padding: '30px', color: '#64748b' }}>Memuat Form Pendaftaran PPDB...</div>}>
      <PublicPPDBContent />
    </Suspense>
  );
}
