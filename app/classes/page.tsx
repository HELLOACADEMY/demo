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
  startMinutesFromMidnight: number; // For positioning (08:00 = 480)
  endMinutesFromMidnight: number;
}

export default function ClassesPage() {
  const { currentRole, currentBranchId, isSuperAdmin, addAuditLog } = useERP();
  const [viewMode, setViewMode] = useState<'Mingguan' | 'Harian' | 'Bulanan'>('Mingguan');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua Kelas');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

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

  // Distinct category styles so 'Kelas grup' and 'Kelas privat' have separate colors
  const getCategoryStyles = (category: ScheduleEvent['category']) => {
    switch (category) {
      case 'group':
        return { background: '#EFF6FF', borderLeft: '4px solid #2563EB', textTitle: '#1E40AF', textSub: '#2563EB', legendColor: '#2563EB' };
      case 'private':
        return { background: '#F5F3FF', borderLeft: '4px solid #7C3AED', textTitle: '#5B21B6', textSub: '#7C3AED', legendColor: '#7C3AED' };
      case 'makeup':
        return { background: '#FFF7ED', borderLeft: '4px solid #F97316', textTitle: '#C2410C', textSub: '#F97316', legendColor: '#F97316' };
      case 'ielts':
        return { background: '#F0FDF4', borderLeft: '4px solid #16A34A', textTitle: '#15803D', textSub: '#16A34A', legendColor: '#16A34A' };
      default:
        return { background: '#F8FAFC', borderLeft: '4px solid #64748B', textTitle: '#0F172A', textSub: '#64748B', legendColor: '#64748B' };
    }
  };

  // Helper to calculate exact countdown for any specific event
  const getEventCountdown = (ev: ScheduleEvent) => {
    const currentDayIndex = 3; // Kamis 20
    const nowMinutes = 585; // 09:45 AM

    if (ev.dayIndex < currentDayIndex) {
      return { status: 'completed', text: 'Sesi Selesai', color: '#64748b', isLive: false };
    }

    if (ev.dayIndex > currentDayIndex) {
      return { status: 'upcoming', text: `Jadwal Tgl ${ev.dayIndex + 17}`, color: '#2563eb', isLive: false };
    }

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
        isLive: true
      };
    }

    const startDiffSeconds = (ev.startMinutesFromMidnight - nowMinutes) * 60 - (nowSeconds % 60);
    const h = Math.floor(startDiffSeconds / 3600);
    const m = Math.floor((startDiffSeconds % 3600) / 60);
    const s = startDiffSeconds % 60;

    return {
      status: 'starting_soon',
      text: `⏳ Mulai: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      color: '#d97706',
      isLive: true
    };
  };

  const filteredEvents = events.filter(e => {
    const matchesBranch = currentBranchId === 'ALL' || e.branchId === currentBranchId;
    const matchesClass = selectedClassFilter === 'Semua Kelas' || e.title.toLowerCase().includes(selectedClassFilter.toLowerCase());
    return matchesBranch && matchesClass;
  });

  const featuredEvent = events.find(e => {
    const matchesBranch = currentBranchId === 'ALL' || e.branchId === currentBranchId;
    return e.dayIndex === 3 && matchesBranch && e.endMinutesFromMidnight > 585;
  });
  const featuredCountdown = featuredEvent ? getEventCountdown(featuredEvent) : null;

  // Slot height calculation: 80px per 1 hour (60 minutes)
  const ROW_HEIGHT = 80;
  const START_HOUR_MINUTES = 480; // 08:00 AM

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      {/* Breadcrumb Header */}
      <div style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Dashboard</span>
        <span>›</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Jadwal Saya</span>
      </div>

      {/* Real-Time Countdown Banner */}
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
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {featuredEvent.title} • {featuredEvent.room} ({featuredEvent.studentsCount} Murid)
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                Sesi Mengajar: <strong>{featuredEvent.startTime} – {featuredEvent.endTime} WIB</strong> • Kamis 20 Agustus
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '10px 14px', borderRadius: '10px', minWidth: '55px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace' }}>00</div>
                <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>JAM</div>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, alignSelf: 'center', color: '#93c5fd' }}>:</span>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '10px 14px', borderRadius: '10px', minWidth: '55px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace' }}>44</div>
                <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>MENIT</div>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, alignSelf: 'center', color: '#93c5fd' }}>:</span>
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '10px 14px', borderRadius: '10px', minWidth: '55px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'monospace' }}>{String(nowSeconds % 60).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>DETIK</div>
              </div>
            </div>

            <Link
              href="/attendance"
              style={{
                padding: '12px 20px',
                background: '#10b981',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={18} /> Absen Sesi Mengajar
            </Link>
          </div>
        </div>
      ) : null}

      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Jadwal Saya</h1>
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

          {/* Time Grid Layout with Absolute Positioned Duration Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(6, 1fr)', position: 'relative' }}>
            
            {/* Time Slot Labels Column */}
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', background: '#fafafa' }}>
              {timeSlots.map((time, idx) => (
                <div key={idx} style={{ height: `${ROW_HEIGHT}px`, padding: '10px 8px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textAlign: 'center', borderBottom: '1px solid #f1f5f9', boxSizing: 'border-box' }}>
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns (6 Days: SEN - SAB) */}
            {daysHeader.map((d, dayIdx) => {
              const dayEvents = filteredEvents.filter(e => e.dayIndex === dayIdx);
              return (
                <div
                  key={dayIdx}
                  style={{
                    position: 'relative',
                    height: `${timeSlots.length * ROW_HEIGHT}px`,
                    borderRight: dayIdx < 5 ? '1px solid #f1f5f9' : 'none',
                    background: d.isToday ? '#F8FAFC' : 'transparent'
                  }}
                >
                  {/* Horizontal Guide Lines */}
                  {timeSlots.map((_, slotIdx) => (
                    <div key={slotIdx} style={{ height: `${ROW_HEIGHT}px`, borderBottom: '1px solid #f1f5f9', boxSizing: 'border-box' }} />
                  ))}

                  {/* Absolute Positioned Event Cards Spanning Dynamic Durations */}
                  {dayEvents.map(ev => {
                    const topPx = (ev.startMinutesFromMidnight - START_HOUR_MINUTES) * (ROW_HEIGHT / 60) + 4;
                    const durationMins = ev.endMinutesFromMidnight - ev.startMinutesFromMidnight;
                    const heightPx = durationMins * (ROW_HEIGHT / 60) - 8;
                    const styles = getCategoryStyles(ev.category);
                    const cdInfo = getEventCountdown(ev);

                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        style={{
                          position: 'absolute',
                          top: `${topPx}px`,
                          left: '6px',
                          right: '6px',
                          height: `${heightPx}px`,
                          background: styles.background,
                          borderLeft: styles.borderLeft,
                          borderRadius: '10px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          zIndex: 10,
                          boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                          overflow: 'hidden',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.15s ease'
                        }}
                        className="hover-lift"
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: styles.textTitle, marginBottom: '2px' }}>
                            {ev.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: styles.textSub, fontWeight: 700 }}>
                            {ev.startTime}–{ev.endTime}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                            {ev.room}
                          </div>
                        </div>

                        {cdInfo && (
                          <div style={{
                            alignSelf: 'flex-start',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.95)',
                            fontSize: '0.675rem',
                            fontWeight: 800,
                            color: cdInfo.color,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                          }}>
                            {cdInfo.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Footer Bar with Distinct Colors */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '0.8rem',
          color: '#475569',
          fontWeight: 700,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563EB' }}></span>
            <span>Kelas grup (Biru)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7C3AED' }}></span>
            <span>Kelas privat (Ungu)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F97316' }}></span>
            <span>Kelas susulan (Oranye)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#16A34A' }}></span>
            <span>IELTS / persiapan ujian (Hijau)</span>
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
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '460px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: getCategoryStyles(selectedEvent.category).background,
                    color: getCategoryStyles(selectedEvent.category).textSub
                  }}>
                    {selectedEvent.category.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: '8px 0 0' }}>
                    {selectedEvent.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800, color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: '#2575b9' }} />
                  <span>Waktu: <strong>{selectedEvent.startTime} – {selectedEvent.endTime} WIB</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: '#2575b9' }} />
                  <span>Lokasi: <strong>{selectedEvent.room}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} style={{ color: '#2575b9' }} />
                  <span>Peserta: <strong>{selectedEvent.studentsCount || 24} Siswa Terdaftar</strong></span>
                </div>

                <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', color: cd.color, fontWeight: 800, fontSize: '0.825rem' }}>
                  Status Sesi: {cd.text}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tutup
                </button>

                <Link
                  href="/attendance"
                  style={{
                    flex: 1.5,
                    padding: '10px',
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 800,
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  Absen Sekarang →
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
