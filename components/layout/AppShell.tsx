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
  Sparkles, Menu, X, ArrowLeft, Shield, TrendingUp, TrendingDown, Wallet,
  ArrowLeftRight, PieChart, Database
} from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  moduleNum?: number;
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
  { name: 'Jadwal Saya', href: '/classes', icon: <Clock size={18} />, moduleNum: 11 },
  { name: 'Absensi', href: '/attendance', icon: <CheckSquare size={18} />, moduleNum: 12 },
  { name: 'Jurnal / Catatan Les', href: '/lesson-notes', icon: <FileText size={18} />, moduleNum: 13 },
  { name: 'Lesson Plan & Evaluasi', href: '/lesson-plan', icon: <BookOpen size={18} />, moduleNum: 13 },
  { name: 'Papan Tugas Siswa', href: '/assignments', icon: <ClipboardList size={18} />, moduleNum: 14 },
  { name: 'Engine Ujian CBT Online', href: '/exams', icon: <FileCheck2 size={18} />, moduleNum: 15 },
  { name: 'E-Rapor Digital PDF', href: '/reports', icon: <FileText size={18} />, moduleNum: 16 },
  { name: 'Master Biaya & Tagihan', href: '/finance/billing', icon: <DollarSign size={18} />, moduleNum: 17 },
  { name: 'Finance Dashboard', href: '/finance/dashboard', icon: <LayoutDashboard size={18} />, moduleNum: 17 },
  { name: 'Pemasukan (Income)', href: '/finance/income', icon: <TrendingUp size={18} />, moduleNum: 17 },
  { name: 'Pengeluaran (Expense)', href: '/finance/expenses', icon: <TrendingDown size={18} />, moduleNum: 17 },
  { name: 'Hutang Usaha (Payable)', href: '/finance/payable', icon: <CreditCard size={18} />, moduleNum: 17 },
  { name: 'Kas & Rekening Bank', href: '/finance/cash-bank', icon: <Wallet size={18} />, moduleNum: 17 },
  { name: 'General Ledger Transaksi', href: '/finance/transactions', icon: <ArrowLeftRight size={18} />, moduleNum: 17 },
  { name: 'Manajemen Invoice', href: '/finance/invoices', icon: <FileText size={18} />, moduleNum: 17 },
  { name: 'Payment Monitor', href: '/finance/payment', icon: <CreditCard size={18} />, moduleNum: 18 },
  { name: 'Payroll & Slip Gaji Guru', href: '/payroll', icon: <Receipt size={18} />, moduleNum: 19 },
  { name: 'Cash Flow Arus Kas', href: '/finance/cashflow', icon: <TrendingUp size={18} />, moduleNum: 17 },
  { name: 'Laba Rugi (Profit & Loss)', href: '/finance/profit-loss', icon: <PieChart size={18} />, moduleNum: 17 },
  { name: 'Budget & Control', href: '/finance/budget', icon: <Target size={18} />, moduleNum: 17 },
  { name: 'Master Data Finance', href: '/finance/master-data', icon: <Database size={18} />, moduleNum: 17 },
  { name: 'Workflow Approval', href: '/finance/approval', icon: <ShieldCheck size={18} />, moduleNum: 17 },
  { name: 'Inventaris & Aset Cabang', href: '/inventory', icon: <Package size={18} />, moduleNum: 20 },
  { name: 'Perpustakaan & Denda', href: '/library', icon: <Library size={18} />, moduleNum: 21 },
  { name: 'CMS Editor Website Public', href: '/cms', icon: <Globe size={18} />, moduleNum: 22 },
  { name: 'Broadcast WA & Email', href: '/announcements', icon: <Volume2 size={18} />, moduleNum: 23 },
  { name: 'Pusat Notifikasi', href: '/notifications', icon: <Bell size={18} />, moduleNum: 24 },
  { name: 'Pipeline Prospek CRM', href: '/crm', icon: <Target size={18} />, moduleNum: 25 },
  { name: 'Laporan & Analytics', href: '/reports-analytics', icon: <BarChart3 size={18} /> },
  { name: 'Pengaturan Sistem Global', href: '/settings', icon: <Settings size={18} />, moduleNum: 27 },
  { name: 'Log Audit Keamanan', href: '/audit-log', icon: <ShieldAlert size={18} />, moduleNum: 27 },
];

const roleAllowedRoutes: Record<Role, string[]> = {
  super_admin: [
    '/dashboard', '/branches', '/users', '/roles', '/ppdb', '/students',
    '/parents', '/tutors', '/academic', '/attendance',
    '/lesson-notes', '/lesson-plan', '/assignments', '/exams', '/reports', '/finance/billing',
    '/finance/dashboard', '/finance/income', '/finance/expenses', '/finance/payable',
    '/finance/cash-bank', '/finance/transactions', '/finance/invoices',
    '/finance/cashflow', '/finance/profit-loss', '/finance/budget',
    '/finance/master-data', '/finance/approval',
    '/finance/payment', '/payroll', '/inventory', '/library', '/cms',
    '/announcements', '/notifications', '/crm', '/reports-analytics',
    '/settings', '/audit-log'
  ],
  admin_cabang: [
    '/dashboard', '/branches', '/ppdb', '/students',
    '/parents', '/tutors', '/academic', '/attendance',
    '/lesson-notes', '/lesson-plan', '/assignments', '/exams', '/reports', '/finance/billing',
    '/finance/dashboard', '/finance/income', '/finance/expenses', '/finance/payable',
    '/finance/cash-bank', '/finance/transactions', '/finance/invoices',
    '/finance/cashflow', '/finance/profit-loss', '/finance/budget',
    '/finance/master-data', '/finance/approval',
    '/finance/payment', '/payroll', '/inventory', '/library',
    '/announcements', '/notifications', '/crm', '/reports-analytics'
  ],
  guru: [
    '/dashboard', '/academic', '/classes',
    '/attendance', '/lesson-notes', '/lesson-plan', '/assignments', '/exams', '/reports',
    '/notifications'
  ],
  staff_keuangan: [
    '/finance/dashboard',
    '/finance/income',
    '/finance/expenses',
    '/finance/billing',
    '/finance/payable',
    '/finance/cash-bank',
    '/finance/transactions',
    '/finance/invoices',
    '/finance/payment',
    '/finance/cashflow',
    '/finance/profit-loss',
    '/reports-analytics',
    '/finance/budget',
    '/finance/master-data',
    '/finance/approval',
    '/payroll',
    '/notifications',
    '/audit-log',
    '/settings'
  ],
  wali_murid: [
    '/parents', '/assignments',
    '/exams', '/reports', '/finance/billing', '/finance/payment', '/notifications'
  ],
  siswa: [
    '/dashboard', '/students', '/attendance', '/lesson-notes', '/assignments',
    '/exams', '/reports', '/finance/billing', '/notifications'
  ]
};

const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin_cabang: 'Admin Cabang Pontianak',
  guru: 'Guru / Pengajar Akademi',
  staff_keuangan: 'Staff Keuangan & Billing',
  wali_murid: 'Portal Wali Murid',
  siswa: 'Siswa / Peserta Didik'
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, currentRole, setCurrentRole, currentTeacherId, setCurrentTeacherId, activeTeacher, teachers, currentBranchId, setCurrentBranchId, branches, addAuditLog } = useERP();
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive breakpoint check for mobile devices (<= 1024px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatically close mobile menu drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Filter navigation items dynamically based on currentRole
  const allowedHrefs = roleAllowedRoutes[currentRole] || roleAllowedRoutes.super_admin;
  const filteredNavItems = navItems.filter(item => allowedHrefs.includes(item.href));

  const publicRoutes = ['/', '/login', '/ppdb', '/attendance', '/terms', '/privacy'];

  // Redirect unauthenticated users or forbidden routes
  useEffect(() => {
    if (!publicRoutes.includes(pathname)) {
      const isLogged = typeof window !== 'undefined' ? localStorage.getItem('bsmart_erp_logged_in') === 'true' || localStorage.getItem('hello_erp_logged_in') === 'true' : false;
      const fallbackHome = currentRole === 'wali_murid' ? '/parents' : currentRole === 'staff_keuangan' ? '/finance/billing' : '/dashboard';
      if (!isAuthenticated && !isLogged) {
        router.push('/login');
        setToastMessage('Akses Ditolak: Anda wajib Login terlebih dahulu untuk mengakses Panel Admin.');
        setTimeout(() => setToastMessage(null), 4000);
      } else if (!allowedHrefs.includes(pathname)) {
        router.push(fallbackHome);
        setToastMessage(`Peran ${roleLabels[currentRole]} tidak memiliki akses ke halaman "${pathname}". Anda dialihkan ke Beranda.`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    }
  }, [isAuthenticated, currentRole, pathname, allowedHrefs, router]);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    addAuditLog('Switch Active Role', 'Authentication', `Memindahkan peran aktif ke ${newRole.toUpperCase()}`);
    setToastMessage(`Role berhasil diubah ke: ${roleLabels[newRole]}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Full-bleed mode for public landing page, login, standalone kiosk scanner page, & public PPDB registration page
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/attendance' || pathname === '/ppdb' || pathname === '/terms' || pathname === '/privacy';

  if (isPublicRoute) {
    return <main style={{ width: '100%', minHeight: '100vh' }}>{children}</main>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', position: 'relative' }}>

      {/* 📱 MOBILE OVERLAY BACKDROP */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* 📍 DYNAMIC ROLE-BASED SIDEBAR (SLIDING DRAWER ON MOBILE) */}
      <aside className="no-print" style={{
        width: '280px',
        background: '#ffffff',
        borderRight: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: isMobile ? (isMobileMenuOpen ? 0 : '-280px') : 0,
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(37, 99, 235, 0.1)',
        transition: 'left 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Sidebar Brand Header */}
        <div style={{ padding: '20px 20px', borderBottom: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Bsmart Education Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, fontFamily: "'Nunito', sans-serif" }}>Bsmart <span style={{ color: '#2563EB' }}>Education</span></div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#2563EB', letterSpacing: '0.1em' }}>PORTAL PONTIANAK</div>
            </div>
          </Link>

          {isMobile ? (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ background: '#dbeafe', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}
            >
              <X size={18} />
            </button>
          ) : (
            <Link href="/" style={{ color: '#2563EB', display: 'flex', alignItems: 'center', textDecoration: 'none', width: '32px', height: '32px', borderRadius: '8px', justifyContent: 'center', background: 'rgba(37,99,235,0.1)' }} title="Kembali ke Landing Page Public">
              <ArrowLeft size={16} />
            </Link>
          )}
        </div>

        {/* Current Active Role Indicator */}
        <div style={{ padding: '12px 16px', background: '#DBEAFE', borderBottom: '1.5px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} style={{ color: '#2563EB' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Nunito', sans-serif" }}>
              {roleLabels[currentRole]}
            </div>
          </div>
        </div>

        {/* Navigation Modules Scrollable List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#60A5FA', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Nunito', sans-serif" }}>
            {filteredNavItems.length} Modul Akses ({currentRole.replace('_', ' ').toUpperCase()})
          </div>

          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="hover-lift"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 800 : 700,
                  color: isActive ? '#2563EB' : '#64748B',
                  background: isActive ? '#DBEAFE' : 'transparent',
                  border: isActive ? '1.5px solid #BFDBFE' : '1.5px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                  fontFamily: "'Nunito', sans-serif"
                }}
              >
                <div style={{ color: isActive ? '#2563EB' : '#94A3B8' }}>{item.icon}</div>
                <span style={{ flex: 1 }}>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Current User & Public Site Link */}
        <div style={{ padding: '16px 20px', borderTop: '1.5px solid #E2E8F0', background: '#EFF6FF' }}>
          <Link href="/" className="btn btn-primary" style={{ width: '100%', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', justifyContent: 'center' }}>
            Lihat Website Public
          </Link>
        </div>
      </aside>

      {/* 🏛️ MAIN CONTENT AREA WITH RESPONSIVE TOPBAR */}
      <div
        className="app-main-content"
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : '280px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%'
        }}
      >

        {/* TOPBAR (DESKTOP & MOBILE RESPONSIVE) */}
        <header className="no-print" style={{
          minHeight: '65px',
          background: '#ffffff',
          borderBottom: '1.5px solid #E2E8F0',
          padding: isMobile ? '12px 16px' : '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.06)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>

          {/* Left: Mobile Hamburger Toggle + Active Branch Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  padding: '8px 12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  color: '#2563eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}
                title="Buka Menu Navigasi"
              >
                <Menu size={20} />
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} style={{ color: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563EB', fontFamily: "'Nunito', sans-serif", display: isMobile ? 'none' : 'inline' }}>Cabang Pontianak:</span>
              {currentRole === 'super_admin' ? (
                <select
                  value={currentBranchId}
                  onChange={(e) => setCurrentBranchId(e.target.value)}
                  className="select-field"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', background: '#EFF6FF', borderColor: '#BFDBFE', cursor: 'pointer' }}
                >
                  <option value="ALL">🌐 Semua 3 Cabang Pontianak</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>📍 {b.name}</option>
                  ))}
                </select>
              ) : (
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
                  📍 {branches.find(b => b.id === currentBranchId)?.name || 'Cabang Pontianak'}
                </span>
              )}
            </div>
          </div>

          {/* Right: Functional Dynamic Role Switcher & Individual Teacher Account Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {!isMobile && currentRole === 'guru' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                👨‍🏫 {activeTeacher?.name || 'Bambang S., M.Pd.'}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DBEAFE', padding: '6px 10px', borderRadius: '10px', border: '1.5px solid #BFDBFE' }}>
              <ShieldCheck size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#2563EB', fontFamily: "'Nunito', sans-serif", display: isMobile ? 'none' : 'inline' }}>Role:</span>
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className="select-field"
                style={{ width: 'auto', border: 'none', background: 'transparent', padding: 0, fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin_cabang">Admin Cabang</option>
                <option value="guru">Guru / Pengajar</option>
                <option value="staff_keuangan">Staff Keuangan</option>
                <option value="wali_murid">Wali Murid</option>
                <option value="siswa">Siswa</option>
              </select>
            </div>

            <button onClick={() => { logout(); router.push('/login'); }} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Keluar</span>
            </button>
          </div>
        </header>

        {/* Dynamic Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '75px',
            right: isMobile ? '16px' : '32px',
            left: isMobile ? '16px' : 'auto',
            zIndex: 1000,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#ffffff',
            borderRadius: '14px',
            fontWeight: 600,
            fontSize: '0.85rem',
            boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideUpFade 0.3s ease-out',
            fontFamily: "'Nunito', sans-serif",
            maxWidth: isMobile ? '100%' : '420px'
          }}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} /> {toastMessage}
          </div>
        )}

        {/* ⚡ PAGE BODY CONTENT */}
        <main className="animate-slide-up" style={{ padding: isMobile ? '16px' : '32px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', minWidth: 0 }}>
          {children}
        </main>
      </div>

    </div>
  );
}
