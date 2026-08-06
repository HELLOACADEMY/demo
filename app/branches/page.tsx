'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Building2, Plus, Phone, Mail, MapPin, User, Power, Users } from 'lucide-react';

export default function BranchesPage() {
  const { branches, setBranches, addAuditLog, isSuperAdmin } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState('');

  const toggleStatus = (id: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));
    addAuditLog('Toggle Branch Status', 'Multi-Branch', `Status cabang ${id} diperbarui`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    const newBranch = {
      id: `br-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      address: address || 'Jl. Utama Pontianak',
      phone: phone || '0561-700000',
      email: email || 'cabang@hello-academy.sch.id',
      pic: pic || 'Admin Cabang Pontianak',
      status: 'Active' as const,
      totalStudents: 0
    };
    setBranches(prev => [...prev, newBranch]);
    addAuditLog('Create Branch', 'Multi-Branch', `Cabang baru ${name} (${code}) berhasil dibuat`);
    setShowAddModal(false);
    setName(''); setCode(''); setAddress(''); setPhone(''); setEmail(''); setPic('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 style={{ color: '#2575b9' }} /> Manajemen Multi-Cabang Pontianak
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Kelola 3 cabang utama di Kota Pontianak (Serdam Pusat, Karya Baru, & Danau Sentarum) dalam satu sistem terpusat.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
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
              boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)',
            }}
          >
            <Plus size={16} /> Tambah Cabang Baru
          </button>
        )}
      </div>

      {/* Grid Cards Multi-Cabang */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {branches.map(b => (
          <div
            key={b.id}
            style={{
              padding: '24px',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: '#eef2ff',
                    color: '#2575b9',
                    display: 'inline-block',
                    marginBottom: '6px',
                  }}>
                    {b.code}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>
                    {b.name}
                  </h3>
                </div>
                <button
                  onClick={() => toggleStatus(b.id)}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: b.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: b.status === 'Active' ? '#166534' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Power size={12} /> {b.status}
                </button>
              </div>

              {/* Branch Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#475569', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} style={{ color: '#2575b9', flexShrink: 0 }} />
                  <span>{b.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span>{b.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <span>{b.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={16} style={{ color: '#d97706', flexShrink: 0 }} />
                  <span>PIC: <strong style={{ color: '#0f172a' }}>{b.pic}</strong></span>
                </div>
              </div>
            </div>

            {/* Total Students Counter Footer */}
            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
            }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} style={{ color: '#2575b9' }} /> Jumlah Siswa Aktif:
              </span>
              <span style={{ fontWeight: 600, color: '#2575b9', fontSize: '1.05rem' }}>
                {b.totalStudents} Siswa
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Cabang */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <form
            onSubmit={handleCreate}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: '0 0 16px' }}>
              Tambah Cabang Pendidikan
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nama Cabang</label>
                <input
                  type="text"
                  placeholder="misal: Cabang Pontianak Barat"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Kode Cabang</label>
                <input
                  type="text"
                  placeholder="misal: PTK-04"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="Jl. Kom Yos Sudarso, Pontianak"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nomor Telepon</label>
                <input
                  type="text"
                  placeholder="0561-700000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Email Cabang</label>
                <input
                  type="email"
                  placeholder="cabang@hello-academy.sch.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  placeholder="Nama Admin Cabang"
                  value={pic}
                  onChange={e => setPic(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{ padding: '10px 16px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Simpan Cabang
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
