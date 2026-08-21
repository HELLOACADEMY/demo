'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, ShieldAlert, CreditCard, UserCheck, GraduationCap, FileCheck2, Check } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function NotificationsPage() {
  const { addAuditLog, currentRole } = useERP();

  const [notifications, setNotifications] = useState([
    { id: 1, category: 'Pembayaran', title: 'Pembayaran SPP Lunas Instant', desc: 'Invoice INV/2026/08/002 atas nama Rizky Pratama telah dibayar via QRIS Instant.', time: '5 Menit yang lalu', read: false, forRole: 'all' },
    { id: 2, category: 'Absensi', title: 'Presensi Masuk Ananda (Scan QR)', desc: 'Rizky Pratama telah melakukan scan QR absensi masuk pada pukul 07:45 WIB di Cabang Serdam Pusat.', time: '25 Menit yang lalu', read: false, forRole: 'all' },
    { id: 3, category: 'Absensi', title: 'Presensi Masuk Guru (Check-In)', desc: 'Bambang S., M.Pd. telah melakukan scan QR absensi pada pukul 06:45 WIB di Cabang Serdam Pusat.', time: '45 Menit yang lalu', read: false, forRole: 'staff_only' },
    { id: 4, category: 'PPDB', title: 'Pendaftaran PPDB Baru', desc: 'Calon siswa Dimas Setiawan mendaftar PPDB Online untuk Program Kedokteran 2026.', time: '2 Jam yang lalu', read: true, forRole: 'staff_only' },
    { id: 5, category: 'CBT', title: 'Sesi CBT Ujian Selesai', desc: 'Rizky Pratama telah menyelesaikan Ujian Tryout SNBT dengan Nilai 88 / 100.', time: '4 Jam yang lalu', read: true, forRole: 'all' },
  ]);

  const [activeCategory, setActiveCategory] = useState('ALL');

  // Filter out teacher attendance notifications if currentRole === 'wali_murid'
  const roleFilteredNotifs = currentRole === 'wali_murid' 
    ? notifications.filter(n => n.forRole !== 'staff_only')
    : notifications;

  const filteredNotifs = activeCategory === 'ALL' 
    ? roleFilteredNotifs 
    : roleFilteredNotifs.filter(n => n.category === activeCategory);

  const unreadCount = roleFilteredNotifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addAuditLog('Mark Notifications Read', 'Notifications', 'Seluruh notifikasi ditandai sudah dibaca');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell style={{ color: '#2575b9' }} /> Pusat Notifikasi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pesan peringatan realtime mengenai presensi ananda, pembayaran SPP, serta aktivitas akademik.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#2575b9', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Check size={16} /> Tandai Semua Dibaca ({unreadCount})
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['ALL', 'Pembayaran', 'Absensi', 'CBT'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: activeCategory === cat ? '2px solid #2575b9' : '1px solid #cbd5e1',
              background: activeCategory === cat ? '#eef2ff' : '#ffffff',
              color: activeCategory === cat ? '#2575b9' : '#475569',
              fontWeight: activeCategory === cat ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {cat === 'ALL' ? 'Semua Notifikasi' : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        {filteredNotifs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
            Tidak ada notifikasi dalam kategori ini.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div key={n.id} style={{ padding: '16px 20px', background: n.read ? '#f8fafc' : '#eef2ff', borderRadius: '12px', borderLeft: n.read ? '3px solid #cbd5e1' : '4px solid #2575b9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: n.read ? '#cbd5e1' : '#2575b9', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n.category === 'Pembayaran' ? <CreditCard size={20} /> : n.category === 'Absensi' ? <UserCheck size={20} /> : n.category === 'PPDB' ? <GraduationCap size={20} /> : <FileCheck2 size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.925rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>{n.desc}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {n.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
