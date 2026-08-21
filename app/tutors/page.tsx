'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { UserCheck, Plus, BookOpen, Clock, DollarSign, Phone, Edit, Key, Copy, Check, Mail, ShieldCheck, X } from 'lucide-react';

export default function TutorsPage() {
  const { filteredTeachers, setTeachers, branches, addTeacher, isSuperAdmin, currentRole, currentBranchId, addAuditLog } = useERP();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [selectedCredTeacher, setSelectedCredTeacher] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [hourlyRate, setHourlyRate] = useState(150000);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetBranchId, setTargetBranchId] = useState(currentBranchId === 'ALL' ? 'br-1' : currentBranchId);

  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const canManage = isSuperAdmin || currentRole === 'admin_cabang';

  const handleOpenAddModal = () => {
    setName('');
    setNip(`19900${Math.floor(10000 + Math.random() * 90000)}`);
    setSubject('');
    setHourlyRate(150000);
    setPhone('');
    setEmail('');
    setTargetBranchId(currentBranchId === 'ALL' ? 'br-1' : currentBranchId);
    setEditingTeacher(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (t: any) => {
    setEditingTeacher(t);
    setName(t.name);
    setNip(t.nip);
    setSubject(t.subject);
    setHourlyRate(t.hourlyRate);
    setPhone(t.phone);
    setEmail(`${t.name.toLowerCase().split(' ')[0]}@bsmart.sch.id`);
    setTargetBranchId(t.branchId);
    setShowAddModal(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) return;

    if (editingTeacher) {
      // Edit existing teacher
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? {
        ...t,
        name,
        nip,
        subject,
        hourlyRate: Number(hourlyRate),
        phone,
        branchId: targetBranchId
      } : t));
      addAuditLog('Update Teacher Profile', 'Academic', `Admin memperbarui data pengajar ${name} (${nip})`);
      setNotice(`Data pengajar ${name} berhasil diperbarui.`);
    } else {
      // Create new teacher & auto-generate User Account Login
      const newTeacherObj = {
        id: `tch-${Date.now()}`,
        nip: nip || `19900${Math.floor(10000 + Math.random() * 90000)}`,
        name,
        subject,
        branchId: targetBranchId,
        hourlyRate: Number(hourlyRate),
        teachingHoursThisMonth: 0,
        phone: phone || '081299887766'
      };

      setTeachers(prev => [newTeacherObj, ...prev]);

      addAuditLog('Create Teacher & Account', 'Academic', `Admin menambahkan pengajar baru ${name} (${nip}) & menerbitkan akun login ERP`);
      setNotice(`Pengajar baru ${name} & Akun Login ERP berhasil ditambahkan.`);
    }

    setShowAddModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const copyCreds = (t: any) => {
    const credText = `AKUN LOGIN ERP BSMART EDUCATION PONTIANAK\nNama: ${t.name}\nEmail Login: ${t.name.toLowerCase().split(' ')[0]}@bsmart.sch.id\nPassword Default: guru123\nPortal Akses: http://localhost:3000/login`;
    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck style={{ color: '#2575b9' }} /> Manajemen Pengajar, Guru & Tutor Akademi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Direktori pengajar, penetapan honor jam mengajar, dan pengelolaan akun login ERP Guru.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAddModal}
            style={{
              padding: '12px 20px',
              background: '#2575b9',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 117, 185, 0.3)',
            }}
          >
            <Plus size={18} /> Tambah Guru / Tutor Baru
          </button>
        )}
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} /> {notice}
        </div>
      )}

      {/* Grid Cards Multi-Teacher */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredTeachers.map(t => {
          const brName = branches.find(b => b.id === t.branchId)?.name || 'Cabang Sungai Raya Dalam (Pusat)';
          const estimatedGaji = t.hourlyRate * t.teachingHoursThisMonth;
          const defaultEmail = `${t.name.toLowerCase().split(' ')[0]}@bsmart.sch.id`;

          return (
            <div key={t.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '6px', fontWeight: 700 }}>NIP: {t.nip}</span>
                    <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>{t.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{brName}</div>
                  </div>
                  <span className="badge badge-success" style={{ fontWeight: 800 }}>Pengajar Aktif</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#475569', marginBottom: '18px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} style={{ color: '#2575b9' }} /> Bidang Studi: <strong style={{ color: '#0f172a' }}>{t.subject}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} style={{ color: '#0284c7' }} /> Jam Mengajar Bulan Ini: <strong style={{ color: '#0f172a' }}>{t.teachingHoursThisMonth} Jam</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} style={{ color: '#16a34a' }} /> Honor per Jam: <strong style={{ color: '#16a34a' }}>Rp {t.hourlyRate.toLocaleString('id-ID')} / jam</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} style={{ color: '#8b5cf6' }} /> Email Login: <strong style={{ color: '#6d28d9' }}>{defaultEmail}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} style={{ color: '#d97706' }} /> WhatsApp: {t.phone}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ padding: '12px 14px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '14px' }}>
                  <span style={{ color: '#065f46', fontWeight: 700 }}>Estimasi Gaji Bulan Ini:</span>
                  <span style={{ fontWeight: 900, color: '#166534', fontSize: '1.1rem' }}>
                    Rp {estimatedGaji.toLocaleString('id-ID')}
                  </span>
                </div>

                {canManage && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      style={{ flex: 1, padding: '8px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', color: '#334155', fontWeight: 700, fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Edit size={14} /> Edit Data Guru
                    </button>

                    <button
                      onClick={() => setSelectedCredTeacher(t)}
                      style={{ flex: 1, padding: '8px', background: '#e0f2fe', border: '1.5px solid #7dd3fc', borderRadius: '8px', color: '#0369a1', fontWeight: 800, fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Key size={14} /> Akun Login Guru
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT TEACHER MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveTeacher} style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>
                {editingTeacher ? 'Edit Data Pengajar / Guru' : 'Tambah Pengajar / Guru Baru'}
              </h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Lengkap & Gelar Guru *</label>
                <input type="text" placeholder="Contoh: Dra. Endang Lestari" value={name} onChange={e => setName(e.target.value)} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>NIP (Nomor Induk)</label>
                  <input type="text" placeholder="19900xxxx" value={nip} onChange={e => setNip(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Mata Pelajaran Utama *</label>
                  <input type="text" placeholder="Fisika / Matematika" value={subject} onChange={e => setSubject(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Honor per Jam (Rp) *</label>
                  <input type="number" placeholder="150000" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} required className="input-field" />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nomor WA / Telepon *</label>
                  <input type="text" placeholder="08xxxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} required className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Pos Cabang Mengajar *</label>
                <select value={targetBranchId} onChange={e => setTargetBranchId(e.target.value)} className="select-field">
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem' }}>
                {editingTeacher ? 'Simpan Perubahan' : 'Simpan & Dapatkan Akun Login'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TEACHER ACCOUNT CREDENTIALS MODAL */}
      {selectedCredTeacher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '440px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key style={{ color: '#2575b9' }} /> Akun Akses ERP Guru Diterbitkan
              </div>
              <button onClick={() => setSelectedCredTeacher(null)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Pengajar / Guru: <strong>{selectedCredTeacher.name}</strong></div>
              
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Email Login Guru:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2575b9' }}>{selectedCredTeacher.name.toLowerCase().split(' ')[0]}@bsmart.sch.id</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Password Default ERP:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a', fontFamily: 'monospace' }}>guru123</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => copyCreds(selectedCredTeacher)}
                style={{ flex: 1, padding: '10px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '8px', color: '#0369a1', fontWeight: 800, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Tersalin!' : 'Salin Akun Login'}
              </button>

              <a
                href={`https://wa.me/62${selectedCredTeacher.phone.replace(/^0/, '')}?text=Halo%20${encodeURIComponent(selectedCredTeacher.name)},%20berikut%20adalah%20Akun%20Login%20ERP%20Bsmart%20Education%20Anda:%0AEmail:%20${encodeURIComponent(selectedCredTeacher.name.toLowerCase().split(' ')[0])}@bsmart.sch.id%0APassword:%20guru123%0APortal:%20http://localhost:3000/login`}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '10px 16px', background: '#25d366', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Phone size={16} /> Kirim via WA
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
