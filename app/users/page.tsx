'use client';

import React, { useState } from 'react';
import { initialUsers, Role, User } from '@/lib/store';
import { Users, Plus, Shield, Mail, CheckCircle2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredUsers = roleFilter === 'ALL' ? users : users.filter(u => u.role === roleFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users style={{ color: '#2575b9' }} /> User Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Pengelolaan seluruh akun pengguna (Super Admin, Admin Cabang, Guru, Staff, Ortu, Siswa).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="select-field" style={{ width: '180px' }}>
            <option value="ALL">Semua Peran</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_cabang">Admin Cabang</option>
            <option value="guru">Guru</option>
            <option value="staff_keuangan">Staff Keuangan</option>
            <option value="wali_murid">Wali Murid</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569' }}>
                <th style={{ fontWeight: 600 }}>Pengguna</th>
                <th style={{ fontWeight: 600 }}>Email</th>
                <th style={{ fontWeight: 600 }}>Peran Sistem</th>
                <th style={{ fontWeight: 600 }}>Cabang Active</th>
                <th style={{ fontWeight: 600 }}>Status Account</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: '#0f172a' }}>
                    <span style={{ fontSize: '1.2rem' }}>{u.avatar}</span>
                    {u.name}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                      <Mail size={14} /> {u.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{u.role.toUpperCase()}</span>
                  </td>
                  <td style={{ color: '#475569' }}>{u.branchId === 'br-1' ? 'Cabang Serdam Pontianak' : 'Cabang Karya Baru Pontianak'}</td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
