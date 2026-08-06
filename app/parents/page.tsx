'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Users2, Phone, Mail, Briefcase, GraduationCap, Clock, CheckCircle2, ShieldCheck, LogIn, LogOut } from 'lucide-react';

export default function ParentsPage() {
  const { attendanceLogs, branches, currentRole } = useERP();
  const [selectedParentId, setSelectedParentId] = useState('p-1');

  const parentsData = [
    { id: 'p-1', name: 'Ibu Susanti', phone: '08129876543', email: 'susanti@gmail.com', occupation: 'Wiraswasta', childName: 'Rizky Pratama', childGrade: 'XII SMA Kedokteran' },
    { id: 'p-2', name: 'Bapak Hartono', phone: '081311223344', email: 'hartono@yahoo.com', occupation: 'PNS', childName: 'Anisa Rahmawati', childGrade: 'XII SMA Kedokteran' },
    { id: 'p-3', name: 'Dr. Hendri S.', phone: '085677889900', email: 'hendri@klinik.com', occupation: 'Dokter Sp.A', childName: 'Bagas Aditya', childGrade: 'XI SMA' },
  ];

  const activeParent = parentsData.find(p => p.id === selectedParentId) || parentsData[0];

  // STRICT PRIVACY FILTER: Parents ONLY see their OWN child's attendance record!
  const myChildLogs = attendanceLogs.filter(att => att.entityName === activeParent.childName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users2 style={{ color: '#2575b9' }} /> Portal Wali Murid & Monitoring Presensi Ananda
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Akses privat wali murid untuk memantau jam masuk & jam pulang khusus untuk ananda tersayang.
          </p>
        </div>

        {/* Parent Switcher Demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Simulasi Akun Orang Tua:</span>
          <select
            value={selectedParentId}
            onChange={e => setSelectedParentId(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid #c7d2fe', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#2575b9', background: '#eef2ff', outline: 'none' }}
          >
            {parentsData.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Wali {p.childName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Parent & Child Card Banner */}
      <div style={{ padding: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2575b9 100%)', borderRadius: '16px', color: '#ffffff', boxShadow: '0 8px 20px rgba(37, 117, 185, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AKUN WALI MURID TERVERIFIKASI
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '4px 0 8px' }}>
            {activeParent.name}
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span>📞 {activeParent.phone}</span>
            <span>✉️ {activeParent.email}</span>
            <span>💼 {activeParent.occupation}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ fontSize: '0.75rem', color: '#bfdbfe', fontWeight: 600 }}>ANANDA TERHUBUNG</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, margin: '2px 0' }}>{activeParent.childName}</div>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>{activeParent.childGrade}</div>
        </div>
      </div>

      {/* PRIVATE CHILD ATTENDANCE LOGS TABLE */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#2575b9' }} /> Riwayat Presensi Ananda {activeParent.childName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Hanya menampilkan data kehadiran pribadi ananda <strong>{activeParent.childName}</strong> demi menjaga privasi & keamanan data siswa.
            </p>
          </div>
          <span style={{ padding: '6px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Akses Privat Terproteksi
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tanggal</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status Scan</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jam Masuk</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jam Pulang</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Cabang Belajar</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Keterangan Presensi</th>
              </tr>
            </thead>
            <tbody>
              {myChildLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '28px', textAlign: 'center', color: '#94a3b8' }}>
                    Belum ada catatan presensi untuk ananda <strong>{activeParent.childName}</strong> hari ini.
                  </td>
                </tr>
              ) : (
                myChildLogs.map((att, idx) => {
                  const brName = branches.find(b => b.id === att.branchId)?.name || 'Cabang Serdam Pontianak';
                  const isCheckOut = att.scanType === 'Jam Pulang' || att.checkOutTime;

                  return (
                    <tr key={att.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                        {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
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
                      <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 700 }}>
                        {att.checkInTime || att.time} WIB
                      </td>
                      <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: 700 }}>
                        {att.checkOutTime ? `${att.checkOutTime} WIB` : '-'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> {att.status || 'Hadir Tepat Waktu'}
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
    </div>
  );
}

