'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { QrCode, CheckCircle2, Clock, Camera, User, Printer, LogIn, LogOut, ShieldAlert, Award } from 'lucide-react';

export default function AttendancePage() {
  const { attendanceLogs, addAttendance, students, teachers, branches } = useERP();
  const [activeTab, setActiveTab] = useState<'scan' | 'cards'>('scan');
  const [selectedEntityType, setSelectedEntityType] = useState<'Siswa' | 'Guru' | 'Staff'>('Siswa');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ message: string; type: 'CHECK_IN' | 'CHECK_OUT' } | null>(null);

  // Sample Staff List for Pontianak Branches
  const staffList = [
    { id: 'stf-1', name: 'Hendra Saputra', role: 'Staff Keuangan', branchId: 'br-1', qrCode: 'QR-STF-1-HENDRA' },
    { id: 'stf-2', name: 'Dewi Kartika', role: 'Admin Cabang', branchId: 'br-2', qrCode: 'QR-STF-2-DEWI' },
    { id: 'stf-3', name: 'Siti Rahma', role: 'Koordinator Cabang', branchId: 'br-3', qrCode: 'QR-STF-3-SITI' },
  ];

  // Perform Scan (Scan 1 = Jam Masuk, Scan 2 = Jam Pulang)
  const handleQRScan = (entityName: string, entityType: 'Siswa' | 'Guru' | 'Staff', branchId: string) => {
    setIsScanning(true);
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];

    // Check existing record today
    const existing = attendanceLogs.find(att => att.entityName === entityName && att.date === today);

    setTimeout(() => {
      if (existing) {
        // Scan 2 = Jam Pulang
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
          message: `Scan Ke-2 Berhasil! [${entityName}] Presensi JAM PULANG pukul ${currentTime}`,
          type: 'CHECK_OUT',
        });
      } else {
        // Scan 1 = Jam Masuk
        addAttendance({
          date: today,
          entityType,
          entityName,
          branchId,
          status: 'Hadir',
          time: currentTime,
          scanType: 'Jam Masuk',
          checkInTime: currentTime,
        });
        setScanResult({
          message: `Scan Ke-1 Berhasil! [${entityName}] Presensi JAM MASUK pukul ${currentTime}`,
          type: 'CHECK_IN',
        });
      }
      setIsScanning(false);
    }, 1000);
  };

  const simulateRandomScan = () => {
    if (selectedEntityType === 'Siswa' && students.length > 0) {
      const std = students[Math.floor(Math.random() * students.length)];
      handleQRScan(std.name, 'Siswa', std.branchId);
    } else if (selectedEntityType === 'Guru' && teachers.length > 0) {
      const tch = teachers[Math.floor(Math.random() * teachers.length)];
      handleQRScan(tch.name, 'Guru', tch.branchId);
    } else {
      const stf = staffList[Math.floor(Math.random() * staffList.length)];
      handleQRScan(stf.name, 'Staff', stf.branchId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <QrCode style={{ color: '#4f46e5' }} /> Presensi Barcode QR Code Digital
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sistem otomatis 2x Scan Barcode per hari: <strong>Scan 1 = Jam Masuk</strong> dan <strong>Scan 2 = Jam Pulang</strong> (Siswa, Guru, & Staff).
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '4px' }}>
          <button
            onClick={() => setActiveTab('scan')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'scan' ? '#ffffff' : 'transparent',
              color: activeTab === 'scan' ? '#4f46e5' : '#64748b',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: '0.875rem',
              boxShadow: activeTab === 'scan' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Scanner Barcode Live
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: activeTab === 'cards' ? '#ffffff' : 'transparent',
              color: activeTab === 'cards' ? '#4f46e5' : '#64748b',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: '0.875rem',
              boxShadow: activeTab === 'cards' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Cetak Kartu QR / Barcode
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <>
          {/* Alert Notification Scan Result */}
          {scanResult && (
            <div style={{
              padding: '16px 20px',
              background: scanResult.type === 'CHECK_IN' ? '#f0fdf4' : '#eff6ff',
              border: `1px solid ${scanResult.type === 'CHECK_IN' ? '#bbf7d0' : '#bfdbfe'}`,
              borderRadius: '12px',
              color: scanResult.type === 'CHECK_IN' ? '#166534' : '#1e40af',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {scanResult.type === 'CHECK_IN' ? <LogIn size={22} /> : <LogOut size={22} />}
                <span>{scanResult.message}</span>
              </div>
              <span style={{ fontSize: '0.75rem', background: scanResult.type === 'CHECK_IN' ? '#dcfce7' : '#dbeafe', padding: '4px 10px', borderRadius: '20px' }}>
                {scanResult.type === 'CHECK_IN' ? 'JAM MASUK' : 'JAM PULANG'}
              </span>
            </div>
          )}

          {/* Interactive Scanner Box Simulator */}
          <div style={{
            padding: '36px 24px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          }}>
            {/* Entity Category Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              {(['Siswa', 'Guru', 'Staff'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedEntityType(type)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: selectedEntityType === type ? '#4f46e5' : '#cbd5e1',
                    background: selectedEntityType === type ? '#eef2ff' : '#ffffff',
                    color: selectedEntityType === type ? '#4f46e5' : '#475569',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Kategori: {type}
                </button>
              ))}
            </div>

            <div style={{
              width: '130px',
              height: '130px',
              margin: '0 auto 20px',
              border: '3px dashed #4f46e5',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
            }}>
              <QrCode size={70} style={{ color: isScanning ? '#16a34a' : '#4f46e5', transition: 'all 0.3s ease' }} />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: '0 0 6px' }}>
              Stand Camera Barcode QR Reader
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '440px', margin: '0 auto 24px' }}>
              Arahkan Kartu QR / Barcode milik Siswa, Guru, atau Staff ke kamera.
              System otomatis mendeteksi <strong>Scan 1 = JAM MASUK</strong> dan <strong>Scan 2 = JAM PULANG</strong>.
            </p>

            <button
              onClick={simulateRandomScan}
              disabled={isScanning}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 8px 18px -4px rgba(79, 70, 229, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Camera size={18} /> {isScanning ? 'Memproses Barcode...' : `Simulasi Scan QR Kamera (${selectedEntityType})`}
            </button>
          </div>

          {/* Quick Barcode Tap Selector */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>
              Pilih Kartu Barcode Siap Scan (Tap untuk Scan Masuk / Pulang):
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {selectedEntityType === 'Siswa' && students.slice(0, 6).map(std => {
                const today = new Date().toISOString().split('T')[0];
                const existing = attendanceLogs.find(att => att.entityName === std.name && att.date === today);
                return (
                  <div
                    key={std.id}
                    onClick={() => handleQRScan(std.name, 'Siswa', std.branchId)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#4f46e5'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{std.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>NISN: {std.nisn} • {std.grade}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: existing ? '#dbeafe' : '#dcfce7',
                        color: existing ? '#1e40af' : '#166534',
                      }}>
                        {existing ? 'Berikutnya: PULANG' : 'Berikutnya: MASUK'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {selectedEntityType === 'Guru' && teachers.map(tch => {
                const today = new Date().toISOString().split('T')[0];
                const existing = attendanceLogs.find(att => att.entityName === tch.name && att.date === today);
                return (
                  <div
                    key={tch.id}
                    onClick={() => handleQRScan(tch.name, 'Guru', tch.branchId)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{tch.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>NIP: {tch.nip} • {tch.subject}</div>
                    </div>
                    <div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: existing ? '#dbeafe' : '#dcfce7',
                        color: existing ? '#1e40af' : '#166534',
                      }}>
                        {existing ? 'Berikutnya: PULANG' : 'Berikutnya: MASUK'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {selectedEntityType === 'Staff' && staffList.map(stf => {
                const today = new Date().toISOString().split('T')[0];
                const existing = attendanceLogs.find(att => att.entityName === stf.name && att.date === today);
                return (
                  <div
                    key={stf.id}
                    onClick={() => handleQRScan(stf.name, 'Staff', stf.branchId)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{stf.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>ID: {stf.id} • {stf.role}</div>
                    </div>
                    <div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: existing ? '#dbeafe' : '#dcfce7',
                        color: existing ? '#1e40af' : '#166534',
                      }}>
                        {existing ? 'Berikutnya: PULANG' : 'Berikutnya: MASUK'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Attendance Logs Table */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>
              Rekap Kehadiran Real-time Hari Ini (MySQL Database)
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jenis Scan</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Waktu Scan</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kategori</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Lengkap</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Cabang Sekolah</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jam Masuk</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jam Pulang</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                        Belum ada data presensi hari ini. Silakan lakukan Scan Barcode.
                      </td>
                    </tr>
                  ) : (
                    attendanceLogs.map((att, idx) => {
                      const brName = branches.find(b => b.id === att.branchId)?.name || 'Cabang Serdam Pontianak';
                      const isCheckOut = att.scanType === 'Jam Pulang' || att.checkOutTime;

                      return (
                        <tr key={att.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: isCheckOut ? '#dbeafe' : '#dcfce7',
                              color: isCheckOut ? '#1e40af' : '#166534',
                            }}>
                              {isCheckOut ? <LogOut size={14} /> : <LogIn size={14} />}
                              {isCheckOut ? 'JAM PULANG' : 'JAM MASUK'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#4f46e5' }}>{att.time}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155', fontWeight: 500, fontSize: '0.75rem' }}>
                              {att.entityType || 'Siswa'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{att.entityName}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                          <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 500 }}>{att.checkInTime || att.time}</td>
                          <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: 500 }}>{att.checkOutTime || '-'}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 500 }}>
                              <CheckCircle2 size={14} /> {att.status || 'Hadir'}
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
        </>
      ) : (
        /* Printable Barcode / QR Code Cards View */
        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600 }}>Cetak Kartu QR Code / Barcode Presensi</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                Kartu identitas resmi siswa, guru, dan staff dilengkapi Barcode QR untuk Scan Jam Masuk & Jam Pulang.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                padding: '10px 20px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Printer size={16} /> Cetak Semua Kartu
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Students Cards */}
            {students.map(std => (
              <div
                key={std.id}
                style={{
                  border: '2px solid #4f46e5',
                  borderRadius: '14px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', letterSpacing: '0.05em' }}>
                  KARTU PRESENSI DIGITAL
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 12px' }}>
                  HELLO ACADEMY PONTIANAK
                </div>

                <div style={{
                  padding: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  display: 'inline-block',
                  margin: '0 auto 12px',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(std.qrCode || `QR-${std.id}-${std.name}`)}`}
                    alt={`QR Code ${std.name}`}
                    style={{ width: '130px', height: '130px', borderRadius: '6px', display: 'block' }}
                  />
                </div>

                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>{std.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>NISN: {std.nisn}</div>
                <div style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 500, marginTop: '4px' }}>
                  Kategori: SISWA ({std.grade})
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '8px 0 10px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  Barcode ID: {std.qrCode}
                </div>

                <button
                  onClick={() => {
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(std.qrCode || `QR-${std.id}`)}`;
                    fetch(qrUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Barcode_QR_${std.name.replace(/\s+/g, '_')}.png`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    borderRadius: '6px',
                    color: '#4f46e5',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Download Barcode (PNG)
                </button>
              </div>
            ))}

            {/* Teacher Cards */}
            {teachers.map(tch => (
              <div
                key={tch.id}
                style={{
                  border: '2px solid #7c3aed',
                  borderRadius: '14px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', letterSpacing: '0.05em' }}>
                  KARTU PRESENSI GURU
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 12px' }}>
                  HELLO ACADEMY PONTIANAK
                </div>

                <div style={{
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 12px',
                  padding: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <QrCode size={68} style={{ color: '#7c3aed' }} />
                </div>

                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>{tch.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>NIP: {tch.nip}</div>
                <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 500, marginTop: '4px' }}>
                  Kategori: GURU ({tch.subject})
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  Barcode ID: QR-TCH-{tch.id}
                </div>
              </div>
            ))}

            {/* Staff Cards */}
            {staffList.map(stf => (
              <div
                key={stf.id}
                style={{
                  border: '2px solid #0284c7',
                  borderRadius: '14px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', letterSpacing: '0.05em' }}>
                  KARTU PRESENSI STAFF
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '4px 0 12px' }}>
                  HELLO ACADEMY PONTIANAK
                </div>

                <div style={{
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 12px',
                  padding: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <QrCode size={68} style={{ color: '#0284c7' }} />
                </div>

                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>{stf.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>ID: {stf.id}</div>
                <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 500, marginTop: '4px' }}>
                  Kategori: STAFF ({stf.role})
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                  Barcode ID: {stf.qrCode}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
