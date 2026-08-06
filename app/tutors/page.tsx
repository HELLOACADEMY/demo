'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { UserCheck, Plus, BookOpen, Clock, DollarSign, Phone } from 'lucide-react';
import { initialTeachers, Teacher } from '@/lib/store';

export default function TutorsPage() {
  const { filteredTeachers, branches, addAuditLog, isSuperAdmin } = useERP();
  const [teachers, setTeachers] = useState<Teacher[]>(filteredTeachers);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [hourlyRate, setHourlyRate] = useState(150000);
  const [phone, setPhone] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) return;
    const newTch: Teacher = {
      id: `tch-${Date.now()}`,
      nip: nip || `19900${Math.floor(10000 + Math.random() * 90000)}`,
      name,
      subject,
      branchId: branches[0]?.id || 'br-1',
      hourlyRate: Number(hourlyRate),
      teachingHoursThisMonth: 0,
      phone: phone || '0812000000'
    };
    setTeachers(prev => [newTch, ...prev]);
    addAuditLog('Add Teacher', 'Tutors', `Guru baru ${name} (${subject}) berhasil ditambahkan`);
    setShowModal(false);
    setName(''); setNip(''); setSubject(''); setPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck style={{ color: '#2575b9' }} /> Manajemen Guru & Tutor
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Direktori pengajar, mata pelajaran, rate honor per jam, total jam mengajar, dan status kontrak.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              background: '#2575b9',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus size={16} /> Tambah Guru Baru
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {teachers.map(t => {
          const brName = branches.find(b => b.id === t.branchId)?.name || 'Cabang Serdam Pontianak';
          const estimatedGaji = t.hourlyRate * t.teachingHoursThisMonth;

          return (
            <div key={t.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '6px' }}>NIP: {t.nip}</span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>{t.name}</h3>
                </div>
                <span className="badge badge-success">Pengajar Aktif</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#475569', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={15} style={{ color: '#2575b9' }} /> Bidang Studi: <strong style={{ color: '#0f172a' }}>{t.subject}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} style={{ color: '#0284c7' }} /> Jam Mengajar Bulan Ini: <strong style={{ color: '#0f172a' }}>{t.teachingHoursThisMonth} Jam</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={15} style={{ color: '#16a34a' }} /> Honor per Jam: <strong style={{ color: '#16a34a' }}>Rp {t.hourlyRate.toLocaleString('id-ID')} / jam</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={15} style={{ color: '#d97706' }} /> Telepon: {t.phone}
                </div>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Estimasi Honor Bulan Ini:</span>
                <span style={{ fontWeight: 600, color: '#16a34a', fontSize: '1.05rem' }}>
                  Rp {estimatedGaji.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleCreate} style={{ width: '100%', maxWidth: '460px', padding: '28px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Tambah Guru / Tutor Baru</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nama Lengkap & Gelar Guru</label>
                <input type="text" placeholder="Nama Guru" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>NIP (Nomor Induk Pegawai)</label>
                <input type="text" placeholder="19900xxxx" value={nip} onChange={e => setNip(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Mata Pelajaran Utama</label>
                <input type="text" placeholder="misal: Matematika / Fisika" value={subject} onChange={e => setSubject(e.target.value)} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Honor per Jam (Rp)</label>
                <input type="number" placeholder="150000" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nomor WA / Telepon</label>
                <input type="text" placeholder="08123456789" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 16px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Simpan Data Guru</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
