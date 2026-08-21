'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '@/context/ERPContext';
import Link from 'next/link';
import { QrCode, CheckCircle2, Clock, Camera, CameraOff, User, Printer, LogIn, LogOut, ShieldAlert, Award, Home, LayoutDashboard, RefreshCw, CalendarCheck, BookOpen, Check, MapPin, Calendar } from 'lucide-react';

export default function AttendancePage() {
  const { attendanceLogs, addAttendance, students, teachers, branches, currentRole, setCurrentRole, addAuditLog, currentBranchId, activeTeacher, isSuperAdmin } = useERP();
  const [activeTab, setActiveTab] = useState<'scan' | 'guru_daily' | 'guru_session'>('scan');
  const [selectedEntityType, setSelectedEntityType] = useState<'Siswa' | 'Guru' | 'Staff'>('Siswa');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ message: string; type: 'CHECK_IN' | 'CHECK_OUT' } | null>(null);
  const [accessDeniedModal, setAccessDeniedModal] = useState<{ message: string; details: string } | null>(null);

  // Admin filter for teacher profile
  const [selectedTeacherIdForAdmin, setSelectedTeacherIdForAdmin] = useState<string>(activeTeacher?.id || 'tch-1');
  const currentTeacher = (isSuperAdmin || currentRole === 'admin_cabang') ? (teachers.find(t => t.id === selectedTeacherIdForAdmin) || activeTeacher) : activeTeacher;
  const currentTeacherBranch = branches.find(b => b.id === currentTeacher.branchId) || branches[0];

  // Live WebCam State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Izin kamera ditolak atau perangkat kamera tidak ditemukan pada browser ini.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Live Digital Clock State with Seconds
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':');
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      setLiveTime(`${timeString} WIB`);
      setLiveDate(dateString);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Success Scan Pop-Up Modal State
  const [successModal, setSuccessModal] = useState<{
    entityName: string;
    entityType: 'Siswa' | 'Guru' | 'Staff';
    scanType: 'JAM MASUK' | 'JAM PULANG' | 'SESI MENGAJAR';
    time: string;
    date: string;
    branchName: string;
    sessionTitle?: string;
  } | null>(null);

  // Teacher Daily Check-in & Check-out Attendance State
  const [guruDailyLogs, setGuruDailyLogs] = useState<{
    [teacherId: string]: { checkIn?: string; checkOut?: string; date: string }
  }>({
    'tch-1': { checkIn: '07:45:12 WIB', date: new Date().toISOString().split('T')[0] }
  });

  // Monthly Attendance Log History Mock for 1 Month (Agustus 2026)
  const monthlyLogsHistory = [
    { date: 'Kamis, 20 Agt 2026', isToday: true, in: guruDailyLogs[currentTeacher.id]?.checkIn || null, out: guruDailyLogs[currentTeacher.id]?.checkOut || null, duration: 'Sesi Aktif', status: 'Hadir Hari Ini' },
    { date: 'Rabu, 19 Agt 2026', isToday: false, in: '07:42:10 WIB', out: '16:30:15 WIB', duration: '8 Jam 48 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Selasa, 18 Agt 2026', isToday: false, in: '07:50:05 WIB', out: '16:15:00 WIB', duration: '8 Jam 25 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Senin, 17 Agt 2026', isToday: false, in: '07:40:00 WIB', out: '16:20:00 WIB', duration: '8 Jam 40 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Sabtu, 15 Agt 2026', isToday: false, in: '08:00:00 WIB', out: '14:00:00 WIB', duration: '6 Jam 00 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Jumat, 14 Agt 2026', isToday: false, in: '07:45:00 WIB', out: '16:00:00 WIB', duration: '8 Jam 15 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Kamis, 13 Agt 2026', isToday: false, in: '07:48:30 WIB', out: '16:10:00 WIB', duration: '8 Jam 21 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Rabu, 12 Agt 2026', isToday: false, in: '07:52:00 WIB', out: '16:25:00 WIB', duration: '8 Jam 33 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Selasa, 11 Agt 2026', isToday: false, in: '07:44:12 WIB', out: '16:18:00 WIB', duration: '8 Jam 34 Menit', status: 'Hadir Terverifikasi ✅' },
    { date: 'Senin, 10 Agt 2026', isToday: false, in: '07:41:00 WIB', out: '16:30:00 WIB', duration: '8 Jam 49 Menit', status: 'Hadir Terverifikasi ✅' }
  ];

  // Teacher Session-by-Session Teaching Attendance State
  const [guruSessionLogs, setGuruSessionLogs] = useState<{
    [sessionId: string]: { time: string; verified: boolean; durationHours: number }
  }>({
    'ev-8': { time: '08:58:20 WIB', verified: true, durationHours: 1.5 }
  });

  // Teaching Sessions List for Today
  const teacherSessions = [
    { id: 'ev-8', title: 'Matematika 10A (Kedokteran)', room: 'Ruang 101 (AC)', time: '09.00 – 10.30 WIB', students: 24, duration: 1.5, branchId: 'br-1' },
    { id: 'ev-9', title: 'Fisika 11B (SNBT Intensif)', room: 'Ruang 102 (Lab)', time: '10.30 – 12.00 WIB', students: 20, duration: 1.5, branchId: 'br-1' },
    { id: 'ev-10', title: 'Bahasa Inggris 9A (Literacy)', room: 'Ruang 103 (Privat)', time: '13.00 – 14.30 WIB', students: 22, duration: 1.5, branchId: 'br-2' },
    { id: 'ev-11', title: 'Kimia 10B (Kedokteran)', room: 'Ruang 104 (AC)', time: '14.30 – 16.00 WIB', students: 18, duration: 1.5, branchId: 'br-1' }
  ];

  // Process Scan
  const handleQRScan = (entityName: string, entityType: 'Siswa' | 'Guru' | 'Staff', branchId: string) => {
    setIsScanning(true);
    const now = new Date();
    const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':');
    const fullDateFormatted = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const today = now.toISOString().split('T')[0];
    const brName = branches.find(b => b.id === branchId)?.name || 'Cabang Serdam Pontianak';

    setTimeout(() => {
      const existing = attendanceLogs.find(att => att.entityName === entityName && att.date === today);
      if (existing) {
        addAttendance({
          date: today,
          entityType,
          entityName,
          branchId,
          status: 'Hadir',
          time: `${existing.checkInTime || existing.time} - ${currentTime}`,
          scanType: 'Jam Pulang',
          checkInTime: existing.checkInTime || existing.time,
          checkOutTime: currentTime,
        });
        setScanResult({
          message: `Scan Ke-2 Berhasil! [${entityName}] Presensi JAM PULANG pukul ${currentTime} WIB`,
          type: 'CHECK_OUT',
        });
        setSuccessModal({
          entityName,
          entityType,
          scanType: 'JAM PULANG',
          time: `${currentTime} WIB`,
          date: fullDateFormatted,
          branchName: brName,
        });
      } else {
        addAttendance({
          date: today,
          entityType,
          entityName,
          branchId,
          status: 'Hadir',
          time: `${currentTime} WIB`,
          scanType: 'Jam Masuk',
          checkInTime: `${currentTime} WIB`,
        });
        setScanResult({
          message: `Scan Ke-1 Berhasil! [${entityName}] Presensi JAM MASUK pukul ${currentTime} WIB`,
          type: 'CHECK_IN',
        });
        setSuccessModal({
          entityName,
          entityType,
          scanType: 'JAM MASUK',
          time: `${currentTime} WIB`,
          date: fullDateFormatted,
          branchName: brName,
        });
      }
      setIsScanning(false);
    }, 800);
  };

  // Process Teacher Daily Attendance (Absen Masuk Guru & Absen Pulang Guru)
  const handleGuruDailyAttendance = (teacherId: string, teacherName: string, branchId: string, type: 'IN' | 'OUT') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':') + ' WIB';
    const dateStr = now.toISOString().split('T')[0];
    const fullDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const brName = branches.find(b => b.id === branchId)?.name || 'Cabang Sungai Raya Dalam';

    setGuruDailyLogs(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        date: dateStr,
        ...(type === 'IN' ? { checkIn: timeStr } : { checkOut: timeStr })
      }
    }));

    addAttendance({
      date: dateStr,
      entityType: 'Guru',
      entityName: teacherName,
      branchId,
      status: 'Hadir',
      time: timeStr,
      scanType: type === 'IN' ? 'Jam Masuk' : 'Jam Pulang',
      checkInTime: type === 'IN' ? timeStr : (guruDailyLogs[teacherId]?.checkIn || timeStr),
      checkOutTime: type === 'OUT' ? timeStr : undefined
    });

    addAuditLog(
      type === 'IN' ? 'Absen Masuk Guru' : 'Absen Pulang Guru',
      'Attendance',
      `Guru ${teacherName} berhasil ${type === 'IN' ? 'Absen Masuk' : 'Absen Pulang'} pada ${timeStr} di ${brName}`
    );

    setSuccessModal({
      entityName: teacherName,
      entityType: 'Guru',
      scanType: type === 'IN' ? 'JAM MASUK' : 'JAM PULANG',
      time: timeStr,
      date: fullDate,
      branchName: brName
    });
  };

  // Process Teacher Session Attendance
  const handleGuruSessionAttendance = (sessionId: string, sessionTitle: string, duration: number, branchId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':') + ' WIB';
    const dateStr = now.toISOString().split('T')[0];
    const fullDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const brName = branches.find(b => b.id === branchId)?.name || 'Cabang Sungai Raya Dalam';

    setGuruSessionLogs(prev => ({
      ...prev,
      [sessionId]: { time: timeStr, verified: true, durationHours: duration }
    }));

    addAuditLog(
      'Absen Ngajar Per Sesi',
      'Attendance',
      `Guru ${currentTeacher.name} berhasil Presensi Sesi Mengajar [${sessionTitle}] (${duration} Jam) pukul ${timeStr}`
    );

    setSuccessModal({
      entityName: currentTeacher.name,
      entityType: 'Guru',
      scanType: 'SESI MENGAJAR',
      time: timeStr,
      date: fullDate,
      branchName: brName,
      sessionTitle
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Kiosk Scanner Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Bsmart Education Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>MODUL PRESENSI GURU & QR CODE</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>BSMART EDUCATION PONTIANAK</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(currentRole === 'super_admin' || currentRole === 'admin_cabang') && (
            <button
              onClick={() => window.print()}
              style={{
                padding: '8px 16px',
                background: '#2575b9',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 117, 185, 0.25)'
              }}
            >
              <Printer size={16} /> Cetak PDF Laporan Kehadiran
            </button>
          )}

          <Link
            href="/dashboard"
            style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: '#334155',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
        </div>
      </header>

      {/* Printable CSS */}
      <style jsx global>{`
        @media print {
          header, .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Container Body */}
      <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Tabs Bar */}
        <div style={{ background: '#ffffff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('scan')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'scan' ? '#2575b9' : 'transparent',
              color: activeTab === 'scan' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'scan' ? '0 4px 12px rgba(37, 117, 185, 0.25)' : 'none'
            }}
          >
            <QrCode size={18} /> Scanner Barcode QR Code
          </button>

          <button
            onClick={() => setActiveTab('guru_daily')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'guru_daily' ? '#7c3aed' : 'transparent',
              color: activeTab === 'guru_daily' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'guru_daily' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            <CalendarCheck size={18} /> 👨‍🏫 Absen Masuk Guru (Harian)
          </button>

          <button
            onClick={() => setActiveTab('guru_session')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'guru_session' ? '#10b981' : 'transparent',
              color: activeTab === 'guru_session' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeTab === 'guru_session' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
            }}
          >
            <BookOpen size={18} /> 📚 Absen Ngajar Per Sesi
          </button>
        </div>

        {/* TAB 1: SCANNER QR CODE */}
        {activeTab === 'scan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '32px 24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              {/* Digital Clock */}
              <div style={{ margin: '0 auto 20px', padding: '14px 28px', background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '16px', display: 'inline-block' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2575b9', fontFamily: 'monospace' }}>
                  ⏰ {liveTime}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', marginTop: '4px' }}>
                  📅 {liveDate}
                </div>
              </div>

              {(currentRole === 'super_admin' || currentRole === 'admin_cabang') ? (
                <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0369a1', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} /> MODE ADMIN: MONITORING STREAM ABSENSI SISWA & GURU (READ-ONLY)
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Waktu Scan</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Nama Pengguna</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Kategori</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Pos Cabang</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>Status Log</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceLogs.slice(0, 5).map((log, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{log.time || log.date}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 800, color: '#2575b9' }}>{log.entityName}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: '6px', background: log.entityType === 'Guru' ? '#f3e8ff' : '#e0f2fe', color: log.entityType === 'Guru' ? '#7e22ce' : '#0369a1', fontWeight: 800, fontSize: '0.75rem' }}>
                                {log.entityType}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>
                              {branches.find(b => b.id === log.branchId)?.name || 'Cabang Sungai Raya Dalam (Pusat)'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                                HADIR TERVERIFIKASI ✅
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <>
                  {/* WebCam View Box */}
                  <div style={{ width: '100%', maxWidth: '440px', height: '260px', margin: '0 auto 20px', border: isCameraActive ? '3px solid #10b981' : '3px dashed #cbd5e1', borderRadius: '16px', overflow: 'hidden', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraActive ? 'block' : 'none' }} />
                    {!isCameraActive && (
                      <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                        <Camera size={48} style={{ margin: '0 auto 8px', color: '#64748b' }} />
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Kamera Scanner Siap Digunakan</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    {!isCameraActive ? (
                      <button onClick={startCamera} style={{ padding: '10px 20px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={18} /> Aktifkan Kamera WebCam
                      </button>
                    ) : (
                      <button onClick={stopCamera} style={{ padding: '10px 20px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <CameraOff size={18} /> Matikan Kamera
                      </button>
                    )}

                    <button onClick={() => {
                      handleQRScan(currentTeacher.name, 'Guru', currentTeacher.branchId);
                    }} style={{ padding: '10px 20px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <QrCode size={18} /> Simulasi Scan QR {currentTeacher.name}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ABSEN MASUK GURU (LOG 1 BULAN KHUSUS GURU INDIVIDU) */}
        {activeTab === 'guru_daily' && (
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CalendarCheck style={{ color: '#7c3aed' }} /> Riwayat Presensi Kehadiran Harian Guru (1 Bulan)
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                  Log lengkap presensi kedatangan dan kepulangan harian untuk <strong>{currentTeacher.name}</strong> ({currentTeacher.subject}).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {(isSuperAdmin || currentRole === 'admin_cabang') && (
                  <select
                    value={selectedTeacherIdForAdmin}
                    onChange={e => setSelectedTeacherIdForAdmin(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #7c3aed', fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', background: '#ffffff', outline: 'none' }}
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>👨‍🏫 {t.name} ({branches.find(b => b.id === t.branchId)?.code})</option>
                    ))}
                  </select>
                )}

                <div style={{ background: '#f5f3ff', padding: '8px 16px', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '0.825rem', fontWeight: 700, color: '#6d28d9' }}>
                  📍 {currentTeacherBranch.name}
                </div>
              </div>
            </div>

            {/* Profile Summary Header Box */}
            <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>AKUN GURU AKTIF</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{currentTeacher.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 600 }}>NIP: {currentTeacher.nip} • Mapel: {currentTeacher.subject}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL PRESENSI BULAN INI</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>22 Hari Hadir (100%)</div>
              </div>
            </div>

            {/* 1 Month Attendance Log Table for Individual Teacher */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Tanggal Presensi</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Pos Cabang Tugas</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jam Masuk Harian</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jam Pulang Harian</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Durasi Kerja Harian</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>Tindakan & Status Presensi</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyLogsHistory.map((item, idx) => {
                    const isTodayRow = item.isToday;
                    const log = guruDailyLogs[currentTeacher.id] || {};

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: isTodayRow ? '#f0fdf4' : 'transparent' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>
                          {item.date}
                          {isTodayRow && <span style={{ marginLeft: '6px', fontSize: '0.7rem', padding: '2px 6px', background: '#16a34a', color: '#ffffff', borderRadius: '4px', fontWeight: 800 }}>HARI INI</span>}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#2575b9' }}>
                          {currentTeacherBranch.name}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: (isTodayRow ? log.checkIn : item.in) ? '#166534' : '#dc2626' }}>
                          {(isTodayRow ? log.checkIn : item.in) ? `✅ ${isTodayRow ? log.checkIn : item.in}` : 'Belum Absen Masuk'}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: (isTodayRow ? log.checkOut : item.out) ? '#166534' : '#94a3b8' }}>
                          {(isTodayRow ? log.checkOut : item.out) ? `✅ ${isTodayRow ? log.checkOut : item.out}` : 'Belum Absen Pulang'}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#7c3aed' }}>
                          {isTodayRow ? (log.checkIn && log.checkOut ? '8 Jam 30 Menit' : 'Sesi Aktif') : item.duration}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          {isTodayRow ? (
                            (currentRole === 'super_admin' || currentRole === 'admin_cabang') ? (
                              <span style={{ fontSize: '0.775rem', padding: '6px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 800 }}>
                                Terverifikasi System ✅ (Read-Only)
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleGuruDailyAttendance(currentTeacher.id, currentTeacher.name, currentTeacher.branchId, 'IN')}
                                  disabled={!!log.checkIn}
                                  style={{
                                    padding: '8px 14px',
                                    background: log.checkIn ? '#cbd5e1' : '#10b981',
                                    color: log.checkIn ? '#64748b' : '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.775rem',
                                    cursor: log.checkIn ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {log.checkIn ? 'Check-In ✅' : 'Absen Masuk'}
                                </button>
                                <button
                                  onClick={() => handleGuruDailyAttendance(currentTeacher.id, currentTeacher.name, currentTeacher.branchId, 'OUT')}
                                  disabled={!log.checkIn || !!log.checkOut}
                                  style={{
                                    padding: '8px 14px',
                                    background: (!log.checkIn || log.checkOut) ? '#cbd5e1' : '#2575b9',
                                    color: (!log.checkIn || log.checkOut) ? '#64748b' : '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.775rem',
                                    cursor: (!log.checkIn || log.checkOut) ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {log.checkOut ? 'Check-Out ✅' : 'Absen Pulang'}
                                </button>
                              </div>
                            )
                          ) : (
                            <span style={{ fontSize: '0.775rem', color: '#166534', fontWeight: 700 }}>
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ABSEN NGAJAR PER SESI UNTUK GURU */}
        {activeTab === 'guru_session' && (
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen style={{ color: '#10b981' }} /> Presensi Sesi Mengajar: {currentTeacher.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                  Verifikasi jam mengajar per sesi kelas untuk akumulasi honor mengajar bulanan.
                </p>
              </div>

              <div style={{ background: '#ecfdf5', padding: '8px 16px', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.825rem', fontWeight: 700, color: '#065f46' }}>
                📅 Sesi Hari Ini: Kamis 20 Agustus 2026
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Jam Sesi Jadwal</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Kelas / Rombel & Ruangan</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>Durasi Sesi</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status Presensi Sesi</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'center' }}>Tindakan Presensi</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherSessions.map((ses) => {
                    const log = guruSessionLogs[ses.id];
                    return (
                      <tr key={ses.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#2575b9' }}>
                          {ses.time}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>
                          <div>{ses.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{ses.room} • {ses.students} Murid</div>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center', fontWeight: 800, color: '#7c3aed' }}>
                          {ses.duration} Jam
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700 }}>
                          {log ? (
                            <span style={{ color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '6px', fontSize: '0.775rem', border: '1px solid #bbf7d0' }}>
                              ✅ Diabsen ({log.time})
                            </span>
                          ) : (
                            <span style={{ color: '#9a3412', background: '#ffedd5', padding: '4px 10px', borderRadius: '6px', fontSize: '0.775rem', border: '1px solid #fed7aa' }}>
                              ⏳ Belum Presensi Sesi
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          {(currentRole === 'super_admin' || currentRole === 'admin_cabang') ? (
                            <span style={{ fontSize: '0.775rem', padding: '6px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: 800 }}>
                              Log Sesi Terverifikasi ✅ (Read-Only)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleGuruSessionAttendance(ses.id, ses.title, ses.duration, ses.branchId)}
                              disabled={!!log}
                              style={{
                                padding: '8px 16px',
                                background: log ? '#e2e8f0' : '#10b981',
                                color: log ? '#94a3b8' : '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: log ? 'not-allowed' : 'pointer',
                                boxShadow: log ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)'
                              }}
                            >
                              {log ? 'Sesi Terverifikasi ✅' : '🚀 Presensi Sesi Mengajar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Sukses Presensi */}
      {successModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              Presensi Berhasil Dicatat!
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '16px' }}>
              {successModal.entityName} ({successModal.entityType}) — <strong>{successModal.scanType}</strong>
            </p>

            {successModal.sessionTitle && (
              <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', fontSize: '0.825rem', fontWeight: 700, color: '#065f46', marginBottom: '16px' }}>
                Sesi: {successModal.sessionTitle}
              </div>
            )}

            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
              Waktu: {successModal.time} • {successModal.branchName}
            </div>

            <button
              onClick={() => setSuccessModal(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2575b9',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
