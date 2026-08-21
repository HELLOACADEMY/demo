'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '@/context/ERPContext';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, MapPin, Users, Filter, CheckCircle2, PlayCircle, Timer } from 'lucide-react';
import Link from 'next/link';

interface ScheduleEvent {
  id: string;
  dayIndex: number; // 0: Sen 17, 1: Sel 18, 2: Rab 19, 3: Kam 20, 4: Jum 21, 5: Sab 22
  startTime: string;
  endTime: string;
  title: string;
  room: string;
  category: 'group' | 'private' | 'makeup' | 'ielts';
  studentsCount?: number;
  branchId: string;
  startMinutesFromMidnight: number; // For countdown calculation
  endMinutesFromMidnight: number;
}

export default function ClassesPage() {
  const { currentRole, currentBranchId, isSuperAdmin, addAuditLog } = useERP();
  const [viewMode, setViewMode] = useState<'Mingguan' | 'Harian' | 'Bulanan'>('Mingguan');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua Kelas');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Live ticking timer for countdown calculation (seconds ticker)
  const [nowSeconds, setNowSeconds] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNowSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Events list with precise start/end minute timestamps for countdown
  const events: ScheduleEvent[] = [
    // Senin 17
    { id: 'ev-1', dayIndex: 0, startTime: '09.00', endTime: '10.30', title: 'Matematika 10A', room: 'Ruang 101', category: 'group', studentsCount: 24, branchId: 'br-1', startMinutesFromMidnight: 540, endMinutesFromMidnight: 630 },
    { id: 'ev-2', dayIndex: 0, startTime: '13.00', endTime: '14.30', title: 'Fisika 11B', room: 'Ruang 102', category: 'group', studentsCount: 20, branchId: 'br-1', startMinutesFromMidnight: 780, endMinutesFromMidnight: 870 },

    // Selasa 18
    { id: 'ev-3', dayIndex: 1, startTime: '10.30', endTime: '12.00', title: 'Bahasa Inggris', room: 'Ruang 103 - Privat', category: 'private', studentsCount: 1, branchId: 'br-1', startMinutesFromMidnight: 630, endMinutesFromMidnight: 720 },
    { id: 'ev-4', dayIndex: 1, startTime: '13.00', endTime: '15.00', title: 'IELTS Batch 4', room: 'Ruang 105', category: 'ielts', studentsCount: 15, branchId: 'br-2', startMinutesFromMidnight: 780, endMinutesFromMidnight: 900 },

    // Rabu 19
    { id: 'ev-5', dayIndex: 2, startTime: '09.00', endTime: '10.30', title: 'Matematika 10A', room: 'Ruang 101', category: 'group', studentsCount: 24, branchId: 'br-1', startMinutesFromMidnight: 540, endMinutesFromMidnight: 630 },
    { id: 'ev-6', dayIndex: 2, startTime: '13.00', endTime: '14.00', title: 'Bahasa Inggris', room: 'Ruang 103 - Privat', category: 'private', studentsCount: 1, branchId: 'br-1', startMinutesFromMidnight: 780, endMinutesFromMidnight: 840 },
    { id: 'ev-7', dayIndex: 2, startTime: '14.30', endTime: '16.00', title: 'Kimia 10B', room: 'Ruang 104', category: 'group', studentsCount: 18, branchId: 'br-3', startMinutesFromMidnight: 870, endMinutesFromMidnight: 960 },

    // Kamis 20 (Hari Ini)
    { id: 'ev-8', dayIndex: 3, startTime: '09.00', endTime: '10.30', title: 'Matematika 10A', room: 'Ruang 101', category: 'group', studentsCount: 24, branchId: 'br-1', startMinutesFromMidnight: 540, endMinutesFromMidnight: 630 },
    { id: 'ev-9', dayIndex: 3, startTime: '10.30', endTime: '12.00', title: 'Fisika 11B', room: 'Ruang 102', category: 'group', studentsCount: 20, branchId: 'br-1', startMinutesFromMidnight: 630, endMinutesFromMidnight: 720 },
    { id: 'ev-10', dayIndex: 3, startTime: '13.00', endTime: '14.30', title: 'Bahasa Inggris 9A', room: 'Ruang 103', category: 'group', studentsCount: 22, branchId: 'br-2', startMinutesFromMidnight: 780, endMinutesFromMidnight: 870 },
    { id: 'ev-11', dayIndex: 3, startTime: '14.30', endTime: '16.00', title: 'Kimia 10B', room: 'Ruang 104', category: 'group', studentsCount: 18, branchId: 'br-1', startMinutesFromMidnight: 870, endMinutesFromMidnight: 960 },

    // Jumat 21
    { id: 'ev-12', dayIndex: 4, startTime: '09.00', endTime: '10.30', title: 'Bahasa Indonesia 12A', room: 'Ruang 107', category: 'group', studentsCount: 28, branchId: 'br-3', startMinutesFromMidnight: 540, endMinutesFromMidnight: 630 },
    { id: 'ev-13', dayIndex: 4, startTime: '13.00', endTime: '15.00', title: 'IELTS Batch 4', room: 'Ruang 105', category: 'ielts', studentsCount: 15, branchId: 'br-2', startMinutesFromMidnight: 780, endMinutesFromMidnight: 900 },

    // Sabtu 22
    { id: 'ev-14', dayIndex: 5, startTime: '10.00', endTime: '11.30', title: 'Matematika Susulan', room: 'Ruang 106', category: 'makeup', studentsCount: 5, branchId: 'br-1', startMinutesFromMidnight: 600, endMinutesFromMidnight: 690 }
  ];

  const daysHeader = [
    { label: 'SEN', date: '17' },
    { label: 'SEL', date: '18' },
    { label: 'RAB', date: '19' },
    { label: 'KAM', date: '20', isToday: true },
    { label: 'JUM', date: '21' },
    { label: 'SAB', date: '22' }
  ];

  const timeSlots = ['08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'];

  const getCategoryStyles = (category: ScheduleEvent['category']) => {
    switch (category) {
      case 'group':
        return { background: '#EFF6FF', borderLeft: '4px solid #3B82F6', textTitle: '#1E40AF', textSub: '#3B82F6' };
      case 'private':
        return { background: '#F5F3FF', borderLeft: '4px solid #8B5CF6', textTitle: '#5B21B6', textSub: '#8B5CF6' };
      case 'makeup':
        return { background: '#FFF7ED', borderLeft: '4px solid #F97316', textTitle: '#C2410C', textSub: '#F97316' };
      case 'ielts':
        return { background: '#F0FDF4', borderLeft: '4px solid #22C55E', textTitle: '#15803D', textSub: '#22C55E' };
      default:
        return { background: '#F8FAFC', borderLeft: '4px solid #64748B', textTitle: '#0F172A', textSub: '#64748B' };
    }
  };

  // Helper to calculate exact countdown for any specific event
  const getEventCountdown = (ev: ScheduleEvent) => {
    // Current simulated time offset (default: 09:45 AM = 585 minutes)
    const currentDayIndex = 3; // Kamis 20
    const nowMinutes = 585; // 09:45 AM

    if (ev.dayIndex < currentDayIndex) {
      return { status: 'completed', text: 'Sesi Selesai', color: '#64748b', isLive: false };
    }

    if (ev.dayIndex > currentDayIndex) {
      return { status: 'upcoming', text: `Jadwal Tgl ${ev.dayIndex + 17}`, color: '#2575b9', isLive: false };
    }

    // Today's events
    if (nowMinutes >= ev.endMinutesFromMidnight) {
      return { status: 'completed', text: 'Sesi Selesai Hari Ini', color: '#166534', isLive: false };
    }

    if (nowMinutes >= ev.startMinutesFromMidnight && nowMinutes < ev.endMinutesFromMidnight) {
      const remainingSeconds = (ev.endMinutesFromMidnight - nowMinutes) * 60 - (nowSeconds % 60);
      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;
      return {
        status: 'ongoing',
        text: `🔴 LIVE (Sisa: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')})`,
        color: '#dc2626',
        isLive: true,
        hours: 0,
        minutes: m,
        seconds: s
      };
    }

    // Upcoming today
    const startDiffSeconds = (ev.startMinutesFromMidnight - nowMinutes) * 60 - (nowSeconds % 60);
    const h = Math.floor(startDiffSeconds / 3600);
    const m = Math.floor((startDiffSeconds % 3600) / 60);
    const s = startDiffSeconds % 60;

    return {
      status: 'starting_soon',
      text: `⏳ Mulai: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      color: '#d97706',
      isLive: true,
      hours: h,
      minutes: m,
      seconds: s
    };
  };

  const filteredEvents = events.filter(e => {
    const matchesBranch = currentBranchId === 'ALL' || e.branchId === currentBranchId;
    const matchesClass = selectedClassFilter === 'Semua Kelas' || e.title.toLowerCase().includes(selectedClassFilter.toLowerCase());
    return matchesBranch && matchesClass;
  });

  // Featured upcoming event for top banner countdown strictly matching teacher branch & schedule
  const featuredEvent = events.find(e => {
    const matchesBranch = currentBranchId === 'ALL' || e.branchId === currentBranchId;
    return e.dayIndex === 3 && matchesBranch && e.endMinutesFromMidnight > 585;
  });
  const featuredCountdown = featuredEvent ? getEventCountdown(featuredEvent) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      {/* Breadcrumb Header */}
      <div style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Dashboard</span>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Jadwal Saya</span>
      </div>

      {/* Real-Time Countdown Banner (Only appears when schedule time matches) */}
      {featuredEvent && featuredCountdown ? (
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: '16px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(30, 27, 75, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              ⏳
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                HITUNG MUNDUR WAKTU MENGAJAR MAPEL BERIKUTNYA
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>
                {featuredEvent.title} • {featuredEvent.room} ({featuredEvent.studentsCount} Murid)
              </div>
              <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px', fontWeight: 500 }}>
                Sesi Mengajar: <strong>{featuredEvent.startTime} – {featuredEvent.endTime} WIB</strong> • Kamis 20 Agustus
              </div>
            </div>
          </div>

          {/* Live Countdown Timer Boxes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '12px', minWidth: '56px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>{String(featuredCountdown.hours || 0).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 700 }}>JAM</div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a5b4fc', alignSelf: 'center' }}>:</div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '12px', minWidth: '56px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>{String(featuredCountdown.minutes || 0).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 700 }}>MENIT</div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a5b4fc', alignSelf: 'center' }}>:</div>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 14px', borderRadius: '12px', minWidth: '56px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>{String(featuredCountdown.seconds || 0).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: 700 }}>DETIK</div>
              </div>
            </div>

            <Link
              href="/attendance"
              style={{
                padding: '12px 20px',
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Absen Masuk
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '18px 24px',
          background: '#f8fafc',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#475569',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🕒</span>
            <div>
              <strong style={{ color: '#0f172a' }}>Jadwal Sesi Mengajar Cabang Saat Ini Belum Dimulai</strong>
              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                Hitung mundur dan tombol Absen Masuk otomatis muncul ketika mendekati jadwal jam mengajar Anda.
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Jadwal Saya
        </h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          {(isSuperAdmin || currentRole === 'admin_cabang') && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 18px',
                background: '#2575b9',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 117, 185, 0.2)'
              }}
            >
              <Plus size={16} /> Tambah Sesi Mengajar
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: View Switcher (Left) & Date Navigation (Right) */}
      <div style={{
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Left: View Pills & Class Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            {(['Mingguan', 'Harian', 'Bulanan'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: viewMode === mode ? 700 : 500,
                  background: viewMode === mode ? '#ffffff' : 'transparent',
                  color: viewMode === mode ? '#0f172a' : '#64748b',
                  border: 'none',
                  boxShadow: viewMode === mode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.825rem',
              color: '#334155',
              fontWeight: 600,
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Semua Kelas">Semua Kelas</option>
            <option value="Matematika">Matematika</option>
            <option value="Fisika">Fisika</option>
            <option value="Kimia">Kimia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="IELTS">IELTS</option>
          </select>
        </div>

        {/* Right: Date Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              17 – 23 Agustus 2026
            </span>
            <button style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <button style={{ padding: '7px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            Hari Ini
          </button>
        </div>
      </div>

      {/* Main Weekly Time-Grid Calendar Container */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '940px' }}>
          {/* Calendar Header Row (Days of Week) */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(6, 1fr)', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ padding: '14px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}></div>
            {daysHeader.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderRight: i < 5 ? '1px solid #e2e8f0' : 'none',
                  background: d.isToday ? '#EFF6FF' : 'transparent',
                  color: d.isToday ? '#2575b9' : '#64748b'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: d.isToday ? '#2575b9' : '#0f172a', marginTop: '2px' }}>{d.date}</div>
              </div>
            ))}
          </div>

          {/* Time Grid Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {timeSlots.map((time, timeIdx) => (
              <div
                key={timeIdx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px repeat(6, 1fr)',
                  minHeight: '85px',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                {/* Time Label */}
                <div style={{
                  padding: '10px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textAlign: 'center',
                  borderRight: '1px solid #e2e8f0',
                  background: '#fafafa'
                }}>
                  {time}
                </div>

                {/* Day Columns Cells */}
                {daysHeader.map((d, dayIdx) => {
                  // Find event starting at this time slot and day
                  const matchingEvent = filteredEvents.find(e => e.dayIndex === dayIdx && e.startTime === time);
                  const cdInfo = matchingEvent ? getEventCountdown(matchingEvent) : null;

                  return (
                    <div
                      key={dayIdx}
                      style={{
                        borderRight: dayIdx < 5 ? '1px solid #f1f5f9' : 'none',
                        background: d.isToday ? '#F8FAFC' : 'transparent',
                        padding: '6px',
                        position: 'relative'
                      }}
                    >
                      {matchingEvent && (
                        <div
                          onClick={() => setSelectedEvent(matchingEvent)}
                          style={{
                            ...getCategoryStyles(matchingEvent.category),
                            borderRadius: '8px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            height: matchingEvent.startTime === '13.00' && matchingEvent.category === 'ielts' ? '150px' : 'auto'
                          }}
                          className="hover-lift"
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: getCategoryStyles(matchingEvent.category).textTitle, marginBottom: '2px' }}>
                            {matchingEvent.title}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: getCategoryStyles(matchingEvent.category).textSub, fontWeight: 500 }}>
                            {matchingEvent.startTime}–{matchingEvent.endTime}
                          </div>

                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                            {matchingEvent.room}
                          </div>

                          {/* Countdown Indicator Badge on Every Subject Card */}
                          {cdInfo && (
                            <div style={{
                              marginTop: '6px',
                              padding: '3px 6px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.85)',
                              fontSize: '0.675rem',
                              fontWeight: 800,
                              color: cdInfo.color,
                              display: 'inline-block',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                            }}>
                              {cdInfo.text}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend Footer Bar (Exact match to screenshot) */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '0.775rem',
          color: '#64748b',
          fontWeight: 600,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#3B82F6' }}></span>
            <span>Kelas grup</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8B5CF6' }}></span>
            <span>Kelas privat</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F97316' }}></span>
            <span>Kelas susulan</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#22C55E' }}></span>
            <span>IELTS / persiapan ujian</span>
          </div>
        </div>
      </div>

      {/* Modal Detail Sesi ketika event diklik */}
      {selectedEvent && (() => {
        const cd = getEventCountdown(selectedEvent);
        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                    {selectedEvent.category.toUpperCase()} CLASS
                  </span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {selectedEvent.title}
                  </h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
              </div>

              {/* Subject Countdown Box in Modal */}
              <div style={{
                padding: '14px',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Waktu Mundur Sesi {selectedEvent.title}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: cd.color, marginTop: '2px' }}>
                  {cd.text}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} style={{ color: '#2575b9' }} />
                  <span>Waktu Sesi: <strong>{selectedEvent.startTime} – {selectedEvent.endTime} WIB</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} style={{ color: '#16a34a' }} />
                  <span>Lokasi: <strong>{selectedEvent.room}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} style={{ color: '#7c3aed' }} />
                  <span>Jumlah Siswa: <strong>{selectedEvent.studentsCount} Murid Terdaftar</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  href="/attendance"
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}
                >
                  Scan Absen Murid Kelas Ini
                </Link>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    padding: '12px 18px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Penjadwalan Sesi Belajar / Makeup Class (Exact match to screenshot) */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              setShowAddModal(false);
              addAuditLog('Tambah Penjadwalan Sesi', 'Classes', 'Penjadwalan Sesi Belajar / Makeup Class berhasil disimpan');
            }}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Penjadwalan Sesi Belajar / Makeup Class
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Row 1: Hari & Jam Sesi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                    Hari *
                  </label>
                  <select className="select-field" style={{ borderRadius: '10px', padding: '10px 14px' }}>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                    Jam Sesi *
                  </label>
                  <select className="select-field" style={{ borderRadius: '10px', padding: '10px 14px' }}>
                    <option value="08:00 - 09:30">08:00 - 09:30 WIB</option>
                    <option value="09:45 - 11:15">09:45 - 11:15 WIB</option>
                    <option value="13:00 - 14:30">13:00 - 14:30 WIB</option>
                    <option value="14:45 - 16:15">14:45 - 16:15 WIB</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Nama Kelas / Rombel */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                  Nama Kelas / Rombel *
                </label>
                <input
                  type="text"
                  defaultValue="XII SMA Kedokteran"
                  required
                  className="input-field"
                  style={{ borderRadius: '10px', padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}
                />
              </div>

              {/* Row 3: Mata Pelajaran */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                  Mata Pelajaran *
                </label>
                <input
                  type="text"
                  defaultValue="Matematika Terapan"
                  required
                  className="input-field"
                  style={{ borderRadius: '10px', padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}
                />
              </div>

              {/* Row 4: Guru Pengampu & Alokasi Ruangan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                    Guru Pengampu *
                  </label>
                  <select className="select-field" style={{ borderRadius: '10px', padding: '10px 14px' }}>
                    <option value="bambang">Bambang S., M.Pd. (Matematika)</option>
                    <option value="endang">Dra. Endang Lestari (Fisika)</option>
                    <option value="kevin">Kevin Sanjaya, S.Si. (Kimia)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                    Alokasi Ruangan *
                  </label>
                  <select className="select-field" style={{ borderRadius: '10px', padding: '10px 14px' }}>
                    <option value="r101">Ruang 101 (AC)</option>
                    <option value="r102">Ruang 102 (Lab)</option>
                    <option value="r103">Ruang 103 (Privat)</option>
                    <option value="r104">Ruang 104</option>
                    <option value="r105">Ruang 105</option>
                    <option value="r106">Ruang 106</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Jenis Sesi */}
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#2575b9', marginBottom: '6px', display: 'block' }}>
                  Jenis Sesi *
                </label>
                <select className="select-field" style={{ borderRadius: '10px', padding: '10px 14px' }}>
                  <option value="regular">Regular SNBT & Kedokteran</option>
                  <option value="private">Kelas Privat</option>
                  <option value="makeup">Kelas Susulan (Makeup Class)</option>
                  <option value="ielts">IELTS / Persiapan Ujian</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 22px',
                  background: '#2575b9',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)'
                }}
              >
                Simpan Jadwal Sesi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
