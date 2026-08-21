'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Users, ShieldCheck, UserPlus, GraduationCap,
  Users2, UserCheck, BookOpen, School, QrCode, ClipboardList, BookCheck,
  FileSpreadsheet, Receipt, Wallet, DollarSign, Boxes, Library, Globe,
  Megaphone, Bell, Target, BarChart3, Settings, ShieldAlert, BookMarked
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
}

export default function Sidebar({ currentRole }: SidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'UTAMA',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Multi Cabang', href: '/branches', icon: Building2, roles: ['super_admin'] },
        { label: 'User Management', href: '/users', icon: Users, roles: ['super_admin', 'admin_cabang'] },
        { label: 'Role & Permission', href: '/roles', icon: ShieldCheck, roles: ['super_admin'] },
      ]
    },
    {
      title: 'PENDAFTARAN & KESISWAAN',
      items: [
        { label: 'PPDB Online', href: '/ppdb', icon: UserPlus },
        { label: 'Data Siswa', href: '/students', icon: GraduationCap },
        { label: 'Data Wali Murid', href: '/parents', icon: Users2 },
        { label: 'Data Guru / Tutor', href: '/tutors', icon: UserCheck },
      ]
    },
    {
      title: 'AKADEMIK & KELAS',
      items: [
        { label: 'Master Akademik', href: '/academic', icon: BookOpen },
        { label: 'Manajemen Kelas', href: '/classes', icon: School },
        { label: 'Absensi QR', href: '/attendance', icon: QrCode },
        { label: 'Lesson Notes', href: '/lesson-notes', icon: BookMarked },
        { label: 'Tugas / Assignment', href: '/assignments', icon: ClipboardList },
        { label: 'Ujian Online CBT', href: '/exams', icon: BookCheck },
        { label: 'Rapor & Nilai', href: '/reports', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'KEUANGAN & PAYROLL',
      items: [
        { label: 'Billing & Tagihan', href: '/finance/billing', icon: Receipt },
        { label: 'Pembayaran (Gateway)', href: '/finance/payment', icon: Wallet },
        { label: 'Payroll & Gaji', href: '/payroll', icon: DollarSign },
      ]
    },
    {
      title: 'SARPRAS & FASILITAS',
      items: [
        { label: 'Inventaris Asset', href: '/inventory', icon: Boxes },
        { label: 'Perpustakaan', href: '/library', icon: Library },
      ]
    },
    {
      title: 'KOMUNIKASI & CRM',
      items: [
        { label: 'CMS Website', href: '/cms', icon: Globe },
        { label: 'Pengumuman', href: '/announcements', icon: Megaphone },
        { label: 'Notifikasi', href: '/notifications', icon: Bell },
        { label: 'CRM & Pipeline', href: '/crm', icon: Target },
      ]
    },
    {
      title: 'SISTEM & ANALYTICS',
      items: [
        { label: 'Laporan & Analytics', href: '/reports-analytics', icon: BarChart3 },
        { label: 'Pengaturan Sistem', href: '/settings', icon: Settings },
        { label: 'Audit Log', href: '/audit-log', icon: ShieldAlert },
      ]
    }
  ];

  return (
    <aside className="sidebar" style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="Bsmart Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        <div>
          <h3 style={{ fontSize: '1rem', color: '#0f172a', lineHeight: 1.1, fontWeight: 700 }}>Bsmart Education</h3>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Multi-Branch Pontianak</span>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '20px' }}>
            <div style={{ padding: '0 12px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em' }}>
              {group.title}
            </div>
            {group.items.map((item, iIdx) => {
              if (item.roles && !item.roles.includes(currentRole)) return null;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#2575b9' : '#475569',
                    background: isActive ? '#eef2ff' : 'transparent',
                    borderLeft: isActive ? '3px solid #2575b9' : '3px solid transparent',
                    textDecoration: 'none',
                    marginBottom: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? '#2575b9' : '#64748b' }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
