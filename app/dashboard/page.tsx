'use client';

import React from 'react';
import { useERP } from '@/context/ERPContext';
import {
  Users, Building2, BookOpen, GraduationCap, DollarSign, Calendar,
  TrendingUp, ArrowUpRight, ShieldCheck, Clock, CheckCircle2, QrCode,
  FileCheck2, ClipboardList, Download, CreditCard, HeartHandshake, Award
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    currentRole, currentBranchId, branches, students, teachers, invoices, ppdbList,
    filteredStudents, filteredTeachers, filteredInvoices, filteredPpdbList,
    auditLogs, attendanceLogs, isSuperAdmin
  } = useERP();

  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];
  const targetStudents = currentBranchId === 'ALL' ? students : filteredStudents;
  const targetTeachers = currentBranchId === 'ALL' ? teachers : filteredTeachers;
  const targetInvoices = currentBranchId === 'ALL' ? invoices : filteredInvoices;
  const targetPpdb = currentBranchId === 'ALL' ? ppdbList : filteredPpdbList;

  const totalStudentsCount = targetStudents.length;
  const pendingPPDBCount = targetPpdb.filter(p => p.status === 'Pending' || p.status === 'Interview').length;
  const totalUnpaidInvoices = targetInvoices.filter(i => i.status === 'Belum Bayar' || i.status === 'Jatuh Tempo').reduce((sum, i) => sum + i.amount, 0);
  const totalTeachersCount = targetTeachers.length;

  // Student Sample Profile for Siswa view
  const myStudentProfile = students[0] || {
    id: 'std-1',
    name: 'Anisa Rahmawati',
    nisn: '0058291030',
    gender: 'P',
    grade: 'XII SMA (Kedokteran)',
    branchId: 'br-1',
    qrCode: 'QR-STD-101-ANISA',
    status: 'Aktif'
  };

  const today = new Date().toISOString().split('T')[0];
  const myTodayAttendance = attendanceLogs.find(att => att.entityName === myStudentProfile.name && att.date === today);

  // 1. 🎓 TAMPILAN DASHBOARD PERAN SISWA
  if (currentRole === 'siswa') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Banner Header Portal Siswa */}
        <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, #2575b9 0%, #1d5f9a 100%)', borderRadius: '16px', color: '#ffffff', boxShadow: '0 10px 25px rgba(37, 117, 185, 0.25)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '8px' }}>
            PORTAL DIGTAL SISWA
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 600, margin: '0 0 6px' }}>
            Selamat Datang, {myStudentProfile.name}! 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            {myStudentProfile.grade} • NISN: {myStudentProfile.nisn} • {activeBranch?.name}
          </p>
        </div>

        {/* Dynamic Metric Cards Siswa */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', marginBottom: '10px' }}>
              <CheckCircle2 size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Presensi Hari Ini</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>
              {myTodayAttendance ? `HADIR (${myTodayAttendance.checkInTime || myTodayAttendance.time})` : 'BELUM SCAN'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              {myTodayAttendance?.scanType === 'Jam Pulang' ? 'Sudah Scan Pulang' : 'Silakan Scan Barcode'}
            </div>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2575b9', marginBottom: '10px' }}>
              <FileCheck2 size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Ujian CBT Mendatang</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>2 Ujian</div>
            <div style={{ fontSize: '0.75rem', color: '#2575b9', marginTop: '4px' }}>Tryout SNBT & UTBK 2026</div>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d97706', marginBottom: '10px' }}>
              <ClipboardList size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Papan Tugas Siswa</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>1 Tugas Aktif</div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px' }}>Fisika Kedokteran</div>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0284c7', marginBottom: '10px' }}>
              <CreditCard size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status SPP Saya</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#16a34a' }}>LUNAS</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Periode Bulan Agustus 2026</div>
          </div>
        </div>

        {/* Kartu Barcode QR Presensi Siswa Saya */}
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ padding: '12px', background: '#ffffff', border: '2px solid #2575b9', borderRadius: '12px', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(myStudentProfile.qrCode)}`}
              alt="QR Siswa"
              style={{ width: '160px', height: '160px', borderRadius: '6px' }}
            />
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#2575b9', marginTop: '6px', fontFamily: 'monospace' }}>
              {myStudentProfile.qrCode}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
              KARTU PRESENSI RESMI SISWA
            </span>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 600, margin: '8px 0 4px' }}>
              {myStudentProfile.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#2575b9', fontWeight: 500, margin: '0 0 12px' }}>
              NISN: {myStudentProfile.nisn} • Kelas: {myStudentProfile.grade}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
              Tunjukkan atau scan Barcode QR Code ini pada kamera stand presensi saat <strong>Jam Masuk (Check-In)</strong> dan <strong>Jam Pulang (Check-Out)</strong>.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/attendance" style={{ padding: '10px 18px', background: '#2575b9', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={16} /> Buka Scanner Presensi
              </Link>
              <Link href="/exams" style={{ padding: '10px 18px', background: '#f1f5f9', color: '#475569', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1' }}>
                <FileCheck2 size={16} /> Mulai Ujian CBT
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 👵 TAMPILAN DASHBOARD PERAN WALI MURID
  if (currentRole === 'wali_murid') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: '16px', color: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '8px' }}>
            PORTAL WALI MURID (ORANG TUA)
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 600, margin: '0 0 6px' }}>
            Selamat Datang, Wali Murid ({myStudentProfile.name}) 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Pantau perkembangan akademik, presensi QR, dan pembayaran SPP putra/putri Anda secara real-time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#16a34a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Kehadiran Anak Hari Ini</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>HADIR (06:55 AM)</div>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#2575b9', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} /> <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Rata-Rata Nilai CBT</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a' }}>88.5 / 100</div>
          </div>

          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#d97706', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} /> <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tagihan SPP Anak</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#16a34a' }}>LUNAS (Agustus)</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. 👨‍🏫 TAMPILAN DASHBOARD PERAN GURU
  if (currentRole === 'guru') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', borderRadius: '16px', color: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '8px' }}>
            PORTAL PENGAJAR & GURU AKADEMI
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 600, margin: '0 0 6px' }}>
            Dashboard Pengajar Hello Academy Pontianak
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Kelola jadwal mengajar, input Jurnal Les, pembuatan paket soal Ujian CBT, dan penilaian E-Rapor.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#7c3aed', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500 }}>Jam Mengajar Bulan Ini</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0f172a' }}>42 Jam</div>
          </div>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#2575b9', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500 }}>Kelas Diampu</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0f172a' }}>3 Kelas</div>
          </div>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#16a34a', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500 }}>Soal CBT Dibuat</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0f172a' }}>4 Paket</div>
          </div>
        </div>
      </div>
    );
  }

  // 4. 📊 TAMPILAN DASHBOARD PERAN STAFF KEUANGAN
  if (currentRole === 'staff_keuangan') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: '16px', color: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '8px' }}>
            PORTAL KEUANGAN & BILLING
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 600, margin: '0 0 6px' }}>
            Dashboard Keuangan & Invoicing SPP
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Kelola invoicing tagihan SPP, simulator QRIS, piutang, dan verifikasi slip penggajian guru.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Total Piutang SPP</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>
              Rp {totalUnpaidInvoices.toLocaleString('id-ID')}
            </div>
          </div>
          <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Total Tagihan Terbit</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>{invoices.length} Invoices</div>
          </div>
        </div>
      </div>
    );
  }

  // 5. ⚡ TAMPILAN DASHBOARD CENTRAL SUPER ADMIN & ADMIN CABANG
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 🚀 DASHBOARD HEADER BANNER */}
      <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '6px solid #2575b9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-primary">{activeBranch?.code}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2575b9' }}>{activeBranch?.name}</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            Dashboard ERP Central Hello Academy Pontianak
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sistem Informasi Manajemen Pendidikan Terpadu (27 Modul Operasional).
          </p>
        </div>

        {isSuperAdmin && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/ppdb" style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
              + PPDB Pendaftaran Baru
            </Link>
            <Link href="/finance/billing" style={{ padding: '10px 20px', background: '#2575b9', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
              + Buat Invoicing SPP
            </Link>
          </div>
        )}
      </div>

      {/* 📊 KEY STATS METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2575b9' }}>
              <GraduationCap size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>+12% bln ini</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a' }}>{totalStudentsCount}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Total Siswa Terdaftar</div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <Users size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#991b1b', background: '#fee2e2', padding: '2px 8px', borderRadius: '6px' }}>{pendingPPDBCount} Pending</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a' }}>{targetPpdb.length}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Aplikasi PPDB Online</div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <DollarSign size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>Tagihan Aktif</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: '#0f172a' }}>
            Rp {totalUnpaidInvoices.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Piutang SPP Unpaid</div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Building2 size={22} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>{currentBranchId === 'ALL' ? '3 Cabang' : activeBranch?.code}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#0f172a' }}>{totalTeachersCount}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Super Teacher PTN</div>
        </div>
      </div>

      {/* 🏛️ 3 CABANG PONTIANAK OVERVIEW CARDS */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
          Status 3 Cabang Utama Kota Pontianak
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {branches.map(b => (
            <div key={b.id} style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', borderTop: b.id === currentBranchId ? '4px solid #2575b9' : '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary">{b.code}</span>
                <span className="badge badge-success">{b.status}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>{b.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>{b.address}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 500, color: '#64748b' }}>Jumlah Murid:</span>
                <span style={{ fontWeight: 600, color: '#2575b9' }}>{b.totalStudents} Siswa</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📜 RECENT AUDIT LOG & ACTIVITIES */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
          Aktivitas & Log Audit Keamanan Terakhir
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Waktu</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Pengguna</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Modul ERP</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{log.userName}</td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{log.userRole}</span></td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{log.module}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
