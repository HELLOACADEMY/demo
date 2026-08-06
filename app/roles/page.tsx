'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Lock, Save } from 'lucide-react';
import { Role } from '@/lib/store';
import { useERP } from '@/context/ERPContext';

export default function RolesPage() {
  const { addAuditLog, isSuperAdmin } = useERP();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const modulesList = [
    'Dashboard', 'Multi Cabang', 'User Management', 'PPDB Online',
    'Student Management', 'Parent Management', 'Tutor Management',
    'Academic Master', 'Class Management', 'QR Attendance', 'CBT Examination',
    'Report Cards (E-Rapor)', 'Billing & Finance', 'Payment Gateway', 'Payroll Engine',
    'Audit Log & System Settings'
  ];

  const rolesList: Role[] = ['super_admin', 'admin_cabang', 'guru', 'staff_keuangan', 'wali_murid', 'siswa'];

  const [permissions, setPermissions] = useState<Record<string, Record<Role, boolean>>>(() => {
    const init: Record<string, Record<Role, boolean>> = {};
    modulesList.forEach(m => {
      init[m] = {
        super_admin: true,
        admin_cabang: !['Multi Cabang', 'Audit Log & System Settings'].includes(m),
        guru: ['Dashboard', 'Student Management', 'Academic Master', 'Class Management', 'QR Attendance', 'CBT Examination', 'Report Cards (E-Rapor)'].includes(m),
        staff_keuangan: ['Dashboard', 'Billing & Finance', 'Payment Gateway', 'Payroll Engine'].includes(m),
        wali_murid: ['Dashboard', 'Student Management', 'QR Attendance', 'CBT Examination', 'Report Cards (E-Rapor)', 'Billing & Finance', 'Payment Gateway'].includes(m),
        siswa: ['Dashboard', 'QR Attendance', 'CBT Examination', 'Report Cards (E-Rapor)', 'Billing & Finance'].includes(m),
      };
    });
    return init;
  });

  const togglePermission = (mod: string, role: Role) => {
    if (role === 'super_admin') return;
    setPermissions(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [role]: !prev[mod][role]
      }
    }));
  };

  const handleSave = () => {
    addAuditLog('Update RBAC Matrix', 'Role & Permission', 'Hak akses modul diperbarui');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ color: '#2575b9' }} /> Role & Permission (RBAC Engine)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Matriks pengaturan hak akses menu, tombol tindakan, dan cakupan data per peran pengguna.
          </p>
        </div>
        {isSuperAdmin ? (
          <button
            onClick={handleSave}
            style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={16} /> Simpan Perubahan RBAC
          </button>
        ) : (
          <span style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
            🔒 Mode Lihat (Pengubahan Hanya Oleh Super Admin)
          </span>
        )}
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Matriks Hak Akses (RBAC) Berhasil Diperbarui & Diterapkan ke Sistem!
        </div>
      )}

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ width: '30%', padding: '12px 14px', fontWeight: 600 }}>Modul ERP</th>
                {rolesList.map(r => (
                  <th key={r} style={{ textAlign: 'center', padding: '12px 14px', fontWeight: 600 }}>{r.replace('_', ' ').toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modulesList.map(m => (
                <tr key={m} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ fontWeight: 600, color: '#0f172a', padding: '12px 14px' }}>{m}</td>
                  {rolesList.map(r => {
                    const isGranted = permissions[m]?.[r];
                    return (
                      <td key={r} style={{ textAlign: 'center', padding: '12px 14px' }}>
                        <button
                          onClick={() => togglePermission(m, r)}
                          disabled={r === 'super_admin'}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: r === 'super_admin' ? 'not-allowed' : 'pointer',
                            background: isGranted ? '#dcfce7' : '#fee2e2',
                            color: isGranted ? '#166534' : '#991b1b',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {r === 'super_admin' ? <Lock size={12} /> : null}
                          {isGranted ? 'IZIN' : 'BLOK'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
