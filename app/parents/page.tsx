'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import {
  Users2, Clock, CheckCircle2, ShieldCheck, LogIn, LogOut, FileText, CreditCard,
  Calendar, Award, Download, QrCode, AlertCircle, Bell, ArrowRight, Check,
  BookOpen, ChevronRight, PieChart, TrendingUp, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function ParentsPage() {
  const { attendanceLogs, branches, currentRole, invoices, students } = useERP();
  const [selectedParentId, setSelectedParentId] = useState('p-1');
  const [activeTab, setActiveTab] = useState<'beranda' | 'attendance' | 'grades' | 'billing' | 'schedule'>('beranda');

  const parentsData = [
    { id: 'p-1', name: 'Ibu Susanti', phone: '08129876543', email: 'susanti@gmail.com', occupation: 'Wiraswasta', childName: 'Rizky Pratama', childGrade: 'XII SMA (SNBT UTBK Kedokteran)', branchId: 'br-1' },
    { id: 'p-2', name: 'Bapak Hartono', phone: '081311223344', email: 'hartono@yahoo.com', occupation: 'PNS Pemprov Kalbar', childName: 'Anisa Rahmawati', childGrade: 'XII SMA (Kedokteran)', branchId: 'br-1' },
    { id: 'p-3', name: 'Dr. Hendri S.', phone: '085677889900', email: 'hendri@klinik.com', occupation: 'Dokter Sp.A', childName: 'Bagas Aditya', childGrade: 'XI SMA (Intensif)', branchId: 'br-2' },
  ];

  const activeParent = parentsData.find(p => p.id === selectedParentId) || parentsData[0];
  const activeBranch = branches.find(b => b.id === activeParent.branchId) || branches[0];

  // STRICT PRIVACY FILTER: Parents ONLY see their OWN child's records!
  const myChildLogs = attendanceLogs.filter(att => att.entityName === activeParent.childName);
  const myChildInvoices = invoices.filter(inv => inv.studentName === activeParent.childName);

  // Mock Grades & Progress Data for Child
  const childGrades = [
    { subject: 'Matematika Terapan (SNBT)', score: 88, tryoutRank: 'Peringkat 2 Cabang', teacherNote: 'Rizky sangat menguasai pemecahan soal Penalaran Matematika.' },
    { subject: 'Fisika Kuantum & Mekanika', score: 92, tryoutRank: 'Peringkat 1 Cabang', teacherNote: 'Pemahaman konsep Fisika sangat matang, konsisten nilai di atas 90.' },
    { subject: 'Penalaran Umum (TPS)', score: 85, tryoutRank: 'Peringkat 3 Cabang', teacherNote: 'Perlu latihan kecepatan membaca pada soal logika cerita panjang.' },
    { subject: 'Literasi Bahasa Inggris', score: 90, tryoutRank: 'Peringkat 2 Cabang', teacherNote: 'Sangat menguasai pemahaman struktur bacaan bahasa Inggris.' }
  ];

  // Mock Today Schedule Items for Child
  const todaySchedules = [
    { time: '09.00', subject: 'Matematika Terapan', teacher: 'Pak Hendra Kusuma', room: 'Ruang 101', status: 'Selesai', color: '#10b981' },
    { time: '13.00', subject: 'Bahasa Inggris (Privat)', teacher: 'Bu Ratna Dewi', room: 'Ruang 103', status: 'Berlangsung', color: '#2575b9' },
    { time: '15.30', subject: 'Fisika Kuantum', teacher: 'Dra. Endang Lestari', room: 'Ruang 102', status: 'Mendatang', color: '#64748b' }
  ];

  // Mock Recent Activities
  const recentActivities = [
    { icon: <CheckCircle2 size={16} style={{ color: '#10b981' }} />, bg: '#dcfce7', text: 'Absensi Matematika tercatat — Hadir 09.02', time: '2 jam lalu' },
    { icon: <FileText size={16} style={{ color: '#2575b9' }} />, bg: '#e0f2fe', text: 'Catatan pelajaran baru dari Pak Hendra', time: '3 jam lalu' },
    { icon: <CreditCard size={16} style={{ color: '#f59e0b' }} />, bg: '#fef3c7', text: 'Tagihan SPP Agustus 2026 diterbitkan', time: '1 hari lalu' },
    { icon: <CheckCircle2 size={16} style={{ color: '#10b981' }} />, bg: '#dcfce7', text: 'Pembayaran SPP Juli 2026 dikonfirmasi', time: '3 hari lalu' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Mode Admin: Selector Parent Profile */}
      {currentRole !== 'wali_murid' && (
        <div style={{ padding: '14px 20px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users2 size={18} /> Mode Admin: Pilih Akun Wali Murid yang Ingin Dilihat:
          </div>
          <select
            value={selectedParentId}
            onChange={e => setSelectedParentId(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #0284c7', background: '#ffffff', color: '#0f172a', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
          >
            {parentsData.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Wali {p.childName} — {branches.find(b => b.id === p.branchId)?.name || 'Cabang Pontianak'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Top Title & Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Portal Wali
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#0f172a', fontWeight: 800, margin: '2px 0 4px' }}>
            Beranda
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Ringkasan perkembangan ananda <strong>{activeParent.childName}</strong> ({activeParent.childGrade}).
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ background: '#ffffff', padding: '5px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'beranda', label: 'Beranda', icon: <Users2 size={16} /> },
            { id: 'attendance', label: 'Absensi Ananda', icon: <Clock size={16} /> },
            { id: 'grades', label: 'Nilai & Rapor', icon: <Award size={16} /> },
            { id: 'billing', label: 'Tagihan SPP', icon: <CreditCard size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#2575b9' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BERANDA MAIN TAB */}
      {activeTab === 'beranda' && (
        <>
          {/* Top 4 Stat Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Card 1: Kehadiran Anak */}
            <div
              onClick={() => setActiveTab('attendance')}
              className="hover-lift"
              style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px' }}>
                  +2%
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Kehadiran Anak</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>94%</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Agustus 2026</div>
            </div>

            {/* Card 2: Kelas Minggu Ini */}
            <div
              onClick={() => setActiveTab('schedule')}
              className="hover-lift"
              style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
                  2 selesai
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Kelas Minggu Ini</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>6</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Matematika, Bahasa Inggris</div>
            </div>

            {/* Card 3: Tagihan Belum Dibayar */}
            <div
              onClick={() => setActiveTab('billing')}
              className="hover-lift"
              style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#ffedd5', color: '#9a3412', borderRadius: '20px' }}>
                  1 tagihan
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Tagihan Belum Dibayar</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>Rp 1.250.000</div>
              <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Jatuh tempo 5 Agu 2026 (Maksimal Tgl 5)</div>
            </div>

            {/* Card 4: Nilai Placement Terakhir */}
            <div
              onClick={() => setActiveTab('grades')}
              className="hover-lift"
              style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '20px' }}>
                  Level B2
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Nilai Tryout SNBT Terakhir</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>88</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Matematika Terapan · 4 Agu 2026</div>
            </div>
          </div>

          {/* Middle Section: Jadwal Hari Ini (Left) & Ringkasan Absensi (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Left: Jadwal Hari Ini */}
            <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Jadwal Hari Ini</h3>
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '2px' }}>Kamis, 20 Agustus 2026</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', background: '#ecfdf5', color: '#065f46', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
                    3 berlangsung
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  {todaySchedules.map((sch, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2575b9', width: '45px' }}>{sch.time}</span>
                        <div style={{ borderLeft: '3px solid #2575b9', paddingLeft: '10px' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>{sch.subject}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sch.teacher} · {sch.room}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: sch.status === 'Selesai' ? '#f1f5f9' : sch.status === 'Berlangsung' ? '#ecfdf5' : '#fffbeb',
                        color: sch.status === 'Selesai' ? '#64748b' : sch.status === 'Berlangsung' ? '#065f46' : '#b45309'
                      }}>
                        {sch.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setActiveTab('schedule')} style={{ background: 'transparent', border: 'none', color: '#2575b9', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Lihat jadwal lengkap <ArrowRight size={16} />
              </button>
            </div>

            {/* Right: Ringkasan Absensi Doughnut Chart Card */}
            <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ringkasan Absensi</h3>
                  <select style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', outline: 'none' }}>
                    <option>Hari ini</option>
                    <option>Bulan ini</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {/* Visual Doughnut Representation */}
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'conic-gradient(#10b981 0% 85%, #ef4444 85% 96%, #f59e0b 96% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 16px #ffffff', position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>85%</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>Hadir</div>
                    </div>
                  </div>

                  {/* Legend List */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Hadir
                      </span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>218 <span style={{ color: '#94a3b8', fontSize: '0.725rem' }}>85%</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span> Tidak hadir
                      </span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>29 <span style={{ color: '#94a3b8', fontSize: '0.725rem' }}>11%</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span> Terlambat
                      </span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>9 <span style={{ color: '#94a3b8', fontSize: '0.725rem' }}>4%</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setActiveTab('attendance')} style={{ width: '100%', padding: '10px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', color: '#0f172a', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer' }}>
                Buka absensi
              </button>
            </div>
          </div>

          {/* Bottom Section: Aktivitas Terbaru (Left) & Aksi Cepat (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Left: Aktivitas Terbaru */}
            <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Aktivitas Terbaru</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentActivities.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: act.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {act.icon}
                      </div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>{act.text}</div>
                    </div>
                    <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 600, flexShrink: 0 }}>{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Aksi Cepat (4 Quick Action Buttons) */}
            <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Aksi Cepat</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('attendance')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={16} />
                  </div>
                  Lihat Absensi
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={16} />
                  </div>
                  Lihat Jadwal
                </button>

                <button
                  onClick={() => setActiveTab('grades')}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} />
                  </div>
                  Catatan Pelajaran
                </button>

                <Link
                  href="/finance/payment"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={16} />
                  </div>
                  Bayar Tagihan
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: ABSENSI ANANDA */}
      {activeTab === 'attendance' && (
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} style={{ color: '#2575b9' }} /> Monitoring Log Presensi Kehadiran Ananda
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Catatan jam masuk dan jam pulang yang tercatat via QR Code Scanner di {activeBranch.name}.
              </p>
            </div>
            <span style={{ padding: '6px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> Akses Privat Terproteksi Wali Murid
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Tanggal Presensi</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status Scan</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jam Masuk</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jam Pulang</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Pos Cabang Belajar</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {myChildLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      Belum ada rekam presensi untuk ananda <strong>{activeParent.childName}</strong> hari ini.
                    </td>
                  </tr>
                ) : (
                  myChildLogs.map((att, idx) => {
                    const brName = branches.find(b => b.id === att.branchId)?.name || activeBranch.name;
                    const isCheckOut = att.scanType === 'Jam Pulang' || att.checkOutTime;

                    return (
                      <tr key={att.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>
                          {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isCheckOut ? '#dbeafe' : '#dcfce7',
                            color: isCheckOut ? '#1e40af' : '#166534',
                          }}>
                            {isCheckOut ? <LogOut size={14} /> : <LogIn size={14} />}
                            {isCheckOut ? 'JAM PULANG' : 'JAM MASUK'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', color: '#16a34a', fontWeight: 800 }}>
                          {att.checkInTime || att.time} WIB
                        </td>
                        <td style={{ padding: '14px', color: '#2563eb', fontWeight: 800 }}>
                          {att.checkOutTime ? `${att.checkOutTime} WIB` : '-'}
                        </td>
                        <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{brName}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> {att.status || 'Hadir Tepat Waktu'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NILAI & RAPOR */}
      {activeTab === 'grades' && (
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} style={{ color: '#7c3aed' }} /> Capaian Nilai Tryout & E-Rapor Ananda
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Rekapitulasi perkembangan akademik ananda <strong>{activeParent.childName}</strong> semester ini.
              </p>
            </div>

            <Link
              href="/reports"
              style={{
                padding: '10px 18px',
                background: '#7c3aed',
                color: '#ffffff',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.825rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
              }}
            >
              <FileText size={16} /> Download E-Rapor PDF 1 Lembar Landscape
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {childGrades.map((g, idx) => (
              <div key={idx} style={{ padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', background: '#ede9fe', color: '#6d28d9', borderRadius: '6px' }}>
                    {g.tryoutRank}
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>{g.score}</div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{g.subject}</div>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, fontStyle: 'italic', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  &ldquo;{g.teacherNote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TAGIHAN SPP */}
      {activeTab === 'billing' && (
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} style={{ color: '#10b981' }} /> Informasi Tagihan & Status SPP Ananda
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Transparansi pembayaran SPP dan biaya pendidikan ananda <strong>{activeParent.childName}</strong>.
              </p>
            </div>

            <Link
              href="/finance/payment"
              style={{
                padding: '10px 18px',
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.825rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <QrCode size={16} /> Bayar
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>No. Invois</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jenis Biaya</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Nominal Tagihan</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jatuh Tempo</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status Bayar</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {myChildInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                      Tidak ada tagihan tertunggak untuk ananda <strong>{activeParent.childName}</strong>.
                    </td>
                  </tr>
                ) : (
                  myChildInvoices.map((inv) => (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>{inv.invoiceNumber}</td>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#2575b9' }}>{inv.feeType}</td>
                      <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>Rp {inv.amount.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '14px', color: '#64748b' }}>{inv.dueDate}</td>
                      <td style={{ padding: '14px' }}>
                        <span className={`badge ${inv.status === 'Lunas' ? 'badge-success' : 'badge-danger'}`}>
                          {inv.status === 'Lunas' ? 'LUNAS ✅' : 'BELUM BAYAR ⏳'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        {inv.status === 'Lunas' ? (
                          <span style={{ fontSize: '0.775rem', color: '#166534', fontWeight: 700 }}>Lunas via {inv.paymentMethod || 'QRIS'}</span>
                        ) : (
                          <Link
                            href="/finance/payment"
                            style={{ padding: '6px 14px', background: '#10b981', color: '#ffffff', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.775rem' }}
                          >
                            Bayar
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
