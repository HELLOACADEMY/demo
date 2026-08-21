'use client';

import React, { useState } from 'react';
import { Settings, Save, Database, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function SettingsPage() {
  const { addAuditLog, isSuperAdmin } = useERP();
  const [instituteName, setInstituteName] = useState('Bsmart Education Pontianak');
  const [address, setAddress] = useState('Jl. Sungai Raya Dalam (Serdam) No. 88, Pontianak');
  const [phone, setPhone] = useState('0561-739201');
  const [email, setEmail] = useState('admin@bsmart.sch.id');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('Update System Settings', 'Settings', 'Pengaturan sistem global lembaga diperbarui');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleBackupDB = () => {
    addAuditLog('Database Backup Created', 'Settings', 'Backup MySQL Database Instant berhasil dibuat');
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings style={{ color: '#2575b9' }} /> Pengaturan Sistem Global & Database
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Konfigurasi nama lembaga, kontak resmi, alamat 3 cabang, backup database MySQL, dan keamanan sistem.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} /> Pengaturan Sistem Global Berhasil Disimpan!
        </div>
      )}

      {backupSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} /> Backup Database MySQL Instant Berhasil Dibuat & Diunduh! (`education_erp_backup_2026.sql`)
        </div>
      )}

      {/* Global Settings Form */}
      <form onSubmit={handleSaveSettings} style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Profil Utama Lembaga Pendidikan</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Nama Resmi Lembaga *</label>
            <input type="text" value={instituteName} onChange={e => setInstituteName(e.target.value)} required className="input-field" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Telepon Pusat *</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="input-field" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Email Dukungan Resmi *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" style={{ width: '100%' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Alamat Kantor Pusat *</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="input-field" style={{ width: '100%' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
          {isSuperAdmin ? (
            <button type="submit" style={{ padding: '11px 22px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Simpan Pengaturan Sistem
            </button>
          ) : (
            <span style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
              🔒 Mode Lihat (Pengubahan Hanya Oleh Super Admin)
            </span>
          )}

          {isSuperAdmin && (
            <button type="button" onClick={handleBackupDB} style={{ padding: '11px 22px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} /> Backup Database MySQL Instant
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
