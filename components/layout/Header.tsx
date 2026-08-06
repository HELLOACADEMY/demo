'use client';

import React from 'react';
import { Branch, Role, initialBranches, initialUsers } from '@/lib/store';
import { Building2, Bell, Search, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  currentBranchId: string;
  onBranchChange: (branchId: string) => void;
  branches: Branch[];
}

export default function Header({
  currentRole,
  onRoleChange,
  currentBranchId,
  onBranchChange,
  branches
}: HeaderProps) {
  const activeUser = initialUsers.find(u => u.role === currentRole) || initialUsers[0];
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const roleLabels: Record<Role, string> = {
    super_admin: 'Super Admin',
    admin_cabang: 'Admin Cabang',
    guru: 'Guru / Tutor',
    staff_keuangan: 'Staff Keuangan',
    wali_murid: 'Wali Murid',
    siswa: 'Siswa'
  };

  return (
    <header className="header">
      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '280px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Cari siswa, guru, invoice, modul..."
            className="input-field"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)' }}
          />
        </div>
      </div>

      {/* Center Controls: Role Switcher & Branch Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Branch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Building2 size={16} style={{ color: 'var(--primary)' }} />
          <select
            value={currentBranchId}
            onChange={(e) => onBranchChange(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL" style={{ background: '#121826' }}> Semua Cabang (Global)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id} style={{ background: '#121826' }}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Bar (Instant Simulation Bar) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <UserCheck size={16} style={{ color: '#818cf8' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', marginRight: '4px' }}>Simulasi Role:</span>
          {(Object.keys(roleLabels) as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: currentRole === r ? 700 : 500,
                border: 'none',
                cursor: 'pointer',
                background: currentRole === r ? 'var(--primary)' : 'transparent',
                color: currentRole === r ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
          <Bell size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 8px var(--danger)' }}></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
            {activeUser.avatar}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff' }}>{activeUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>{roleLabels[currentRole]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
