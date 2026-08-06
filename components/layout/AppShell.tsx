'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useERP } from '@/context/ERPContext';
import { Role } from '@/lib/store';
import {
  LayoutDashboard, Building2, Users, ShieldCheck, UserCheck, GraduationCap,
  HeartHandshake, Award, BookOpen, Clock, FileText, ClipboardList, CheckSquare,
  FileCheck2, DollarSign, CreditCard, Receipt, Package, Library, Globe,
  Volume2, Bell, Target, BarChart3, Settings, ShieldAlert, LogOut, ChevronDown,
  Sparkles, Menu, X, ArrowLeft, Shield
} from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  moduleNum: number;
}

const navItems: NavItem[] = [
  { name: 'Dashboard Central', href: '/dashboard', icon: <LayoutDashboard size={18} />, moduleNum: 2 },
  { name: 'Multi-Cabang', href: '/branches', icon: <Building2 size={18} />, moduleNum: 3 },
  { name: 'User Management', href: '/users', icon: <Users size={18} />, moduleNum: 4 },
  { name: 'Matriks RBAC & Peran', href: '/roles', icon: <ShieldCheck size={18} />, moduleNum: 5 },
  { name: 'PPDB Online NISN', href: '/ppdb', icon: <UserCheck size={18} />, moduleNum: 6 },
  { name: 'Direktori Siswa & QR', href: '/students', icon: <GraduationCap size={18} />, moduleNum: 7 },
  { name: 'Portal Wali Murid', href: '/parents', icon: <HeartHandshake size={18} />, moduleNum: 8 },
  { name: 'Manajemen Pengajar/Guru', href: '/tutors', icon: <Award size={18} />, moduleNum: 9 },
  { name: 'Kurikulum & Silabus', href: '/academic', icon: <BookOpen size={18} />, moduleNum: 10 },
  { name: 'Jadwal & Ruang Kelas', href: '/classes', icon: <Clock size={18} />, moduleNum: 11 },
  { name: 'Scanner Presensi QR', href: '/attendance', icon: <CheckSquare size={18} />, moduleNum: 12 },
  { name: 'Jurnal / Catatan Les', href: '/lesson-notes', icon: <FileText size={18} />, moduleNum: 13 },
  { name: 'Papan Tugas Siswa', href: '/assignments', icon: <ClipboardList size={18} />, moduleNum: 14 },
  { name: 'Engine Ujian CBT Online', href: '/exams', icon: <FileCheck2 size={18} />, moduleNum: 15 },
  { name: 'E-Rapor Digital PDF', href: '/reports', icon: <FileText size={18} />, moduleNum: 16 },
  { name: 'Master Biaya & Tagihan', href: '/finance/billing', icon: <DollarSign size={18} />, moduleNum: 17 },
  { name: 'Payment Simulator QRIS', href: '/finance/payment', icon: <CreditCard size={18} />, moduleNum: 18 },
  { name: 'Payroll & Slip Gaji Guru', href: '/payroll', icon: <Receipt size={18} />, moduleNum: 19 },
  { name: 'Inventaris & Aset Cabang', href: '/inventory', icon: <Package size={18} />, moduleNum: 20 },
  { name: 'Perpustakaan & Denda', href: '/library', icon: <Library size={18} />, moduleNum: 21 },
  { name: 'CMS Editor Website Public', href: '/cms', icon: <Globe size={18} />, moduleNum: 22 },
  { name: 'Broadcast WA & Email', href: '/announcements', icon: <Volume2 size={18} />, moduleNum: 23 },
  { name: 'Pusat Notifikasi Real-time', href: '/notifications', icon: <Bell size={18} />, moduleNum: 24 },
  { name: 'Pipeline Prospek CRM', href: '/crm', icon: <Target size={18} />, moduleNum: 25 },
  { name: 'Laporan & Analytics ERP', href: '/reports-analytics', icon: <BarChart3 size={18} />, moduleNum: 26 },
  { name: 'Pengaturan Sistem Global', href: '/settings', icon: <Settings size={18} />, moduleNum: 27 },
  { name: 'Log Audit Keamanan', href: '/audit-log', icon: <ShieldAlert size={18} />, moduleNum: 27 },
];

const roleAllowedRoutes: Record<Role, string[]> = {
  super_admin: [
    '/dashboard', '/branches', '/users', '/roles', '/ppdb', '/students',
    '/parents', '/tutors', '/academic', '/classes', '/attendance',
    '/lesson-notes', '/assignments', '/exams', '/reports', '/finance/billing',
    '/finance/payment', '/payroll', '/inventory', '/library', '/cms',
    '/announcements', '/notifications', '/crm', '/reports-analytics',
    '/settings', '/audit-log'
  ],
  admin_cabang: [
    '/dashboard', '/branches', '/users', '/ppdb', '/students',
    '/parents', '/tutors', '/academic', '/classes', '/attendance',
    '/lesson-notes', '/assignments', '/exams', '/reports', '/finance/billing',
    '/finance/payment', '/payroll', '/inventory', '/library',
    '/announcements', '/notifications', '/crm', '/reports-analytics'
  ],
  guru: [
    '/dashboard', '/students', '/tutors', '/academic', '/classes',
    '/attendance', '/lesson-notes', '/assignments', '/exams', '/reports',
    '/announcements', '/notifications'
  ],
  staff_keuangan: [
    '/dashboard', '/ppdb', '/students', '/parents', '/finance/billing',
    '/finance/payment', '/payroll', '/announcements', '/notifications', '/reports-analytics'
  ],
  wali_murid: [
    '/dashboard', '/parents', '/students', '/attendance', '/assignments',
    '/exams', '/reports', '/finance/billing', '/finance/payment', '/notifications'
  ],
  siswa: [
    '/dashboard', '/students', '/attendance', '/lesson-notes', '/assignments',
    '/exams', '/reports', '/finance/billing', '/notifications'
  ]
};

const roleLabels: Record<Role, string> = {
  super_admin: '⚡ Super Admin (Akses Penuh)',
  admin_cabang: '👩‍💼 Admin Cabang Pontianak',
  guru: '👨‍🏫 Guru / Pengajar Akademi',
  staff_keuangan: '📊 Staff Keuangan & Billing',
  wali_murid: '👵 Wali Murid (Orang Tua)',
  siswa: '🎓 Siswa / Peserta Didik'
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, setCurrentRole, currentBranchId, setCurrentBranchId, branches, addAuditLog } = useERP();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter navigation items dynamically based on currentRole
  const allowedHrefs = roleAllowedRoutes[currentRole] || roleAllowedRoutes.super_admin;
  const filteredNavItems = navItems.filter(item => allowedHrefs.includes(item.href));

  // Redirect if currently on a forbidden route for the selected role
  useEffect(() => {
    if (pathname !== '/' && pathname !== '/login') {
      if (!allowedHrefs.includes(pathname)) {
        router.push('/dashboard');
        setToastMessage(`Peran ${roleLabels[currentRole]} tidak memiliki akses ke halaman "${pathname}". Anda dialihkan ke Dashboard.`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    }
  }, [currentRole, pathname, allowedHrefs, router]);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    addAuditLog('Switch Active ERP Role', 'Authentication', `Memindahkan peran ERP aktif ke ${newRole.toUpperCase()}`);
    setToastMessage(`Role ERP berhasil diubah ke: ${roleLabels[newRole]}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Full-bleed mode for public landing page, login, & standalone kiosk scanner page
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/attendance';

  if (isPublicRoute) {
    return <main style={{ width: '100%', minHeight: '100vh' }}>{children}</main>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>

      {/* 📍 DYNAMIC ROLE-BASED SIDEBAR */}
      <aside style={{
        width: '280px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Sidebar Brand Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#4f46e5', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>H</span>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#ef4444', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>E</span>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#f59e0b', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>L</span>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#10b981', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>L</span>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#06b6d4', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>O!</span>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>HELLO ACADEMY</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5' }}>ERP PORTAL PONTIANAK</div>
            </div>
          </Link>
          <Link href="/" style={{ color: '#64748b', display: 'flex', alignItems: 'center', textDecoration: 'none' }} title="Kembali ke Landing Page Public">
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* Current Active Role Indicator */}
        <div style={{ padding: '12px 16px', background: '#eef2ff', borderBottom: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} style={{ color: '#2575b9' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.675rem', fontWeight: 600, color: '#2575b9', textTransform: 'uppercase' }}>Mode Akses ERP:</div>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roleLabels[currentRole]}
            </div>
          </div>
        </div>

        {/* Navigation Modules Scrollable List (Filtered by Role) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {filteredNavItems.length} Modul Akses ({currentRole.replace('_', ' ').toUpperCase()})
          </div>

          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#2575b9' : '#475569',
                  background: isActive ? '#eef2ff' : 'transparent',
                  border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ color: isActive ? '#2575b9' : '#64748b' }}>{item.icon}</div>
                <span style={{ flex: 1 }}>{item.name}</span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: isActive ? '#ffffff' : '#f1f5f9',
                  color: isActive ? '#2575b9' : '#94a3b8'
                }}>
                  M{item.moduleNum}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Current User & Public Site Link */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
            🌐 Lihat Landing Page Public
          </Link>
        </div>
      </aside>

      {/* 🏛️ MAIN CONTENT AREA WITH WHITE TOPBAR */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* TOPBAR */}
        <header style={{
          height: '70px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
        }}>

          {/* Left: Active Branch Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={18} style={{ color: '#2575b9' }} />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#64748b' }}>Cabang Pontianak:</span>
            <select
              value={currentBranchId}
              onChange={(e) => setCurrentBranchId(e.target.value)}
              className="select-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', background: '#f8fafc', borderColor: '#e2e8f0' }}
            >
              <option value="ALL">Semua 3 Cabang Pontianak</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Right: Functional Dynamic Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 14px', borderRadius: '10px', border: '1px solid #2575b9' }}>
              <ShieldCheck size={16} style={{ color: '#2575b9' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2575b9' }}>Role ERP:</span>
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className="select-field"
                style={{ width: 'auto', border: 'none', background: 'transparent', padding: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer' }}
              >
                <option value="super_admin">⚡ Super Admin</option>
                <option value="admin_cabang">👩‍💼 Admin Cabang</option>
                <option value="guru">👨‍🏫 Guru / Pengajar</option>
                <option value="staff_keuangan">📊 Staff Keuangan</option>
                <option value="wali_murid">👵 Wali Murid</option>
                <option value="siswa">🎓 Siswa</option>
              </select>
            </div>

            <Link href="/login" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              <LogOut size={14} /> Keluar
            </Link>
          </div>
        </header>

        {/* Dynamic Toast Notification when changing Role ERP */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '32px',
            zIndex: 1000,
            padding: '12px 20px',
            background: '#2575b9',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px rgba(37, 117, 185, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUpFade 0.3s ease-out'
          }}>
            <ShieldCheck size={18} /> {toastMessage}
          </div>
        )}

        {/* ⚡ PAGE BODY CONTENT */}
        <main className="animate-slide-up" style={{ padding: '32px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

    </div>
  );
}
