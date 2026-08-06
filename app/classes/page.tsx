'use client';

import React, { useState } from 'react';
import { School, Users, User, Clock, Building2, Calendar, Plus, CheckCircle, Monitor, MapPin } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function ClassesPage() {
  const { branches, teachers, addAuditLog, isSuperAdmin, currentRole } = useERP();
  const [activeTab, setActiveTab] = useState<'jadwal' | 'ruangan'>('jadwal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Senin');

  const [scheduleList, setScheduleList] = useState([
    { id: 'sch-1', day: 'Senin', time: '08:00 - 09:30', className: 'XII SMA Kedokteran', subject: 'Matematika Terapan', teacher: 'Bambang S., M.Pd.', room: 'Ruang 101 (AC)', type: 'Regular SNBT', branchId: 'br-1' },
    { id: 'sch-2', day: 'Senin', time: '09:45 - 11:15', className: 'XII SMA Kedokteran', subject: 'Fisika Kuantum', teacher: 'Dra. Endang Lestari', room: 'Ruang 101 (AC)', type: 'Intensif', branchId: 'br-1' },
    { id: 'sch-3', day: 'Selasa', time: '13:00 - 14:30', className: 'XI SMA Intensif', subject: 'Kimia & Biologi', teacher: 'Kevin Sanjaya, S.Si.', room: 'Ruang 102 (Lab)', type: 'Regular', branchId: 'br-1' },
    { id: 'sch-4', day: 'Rabu', time: '15:30 - 17:00', className: 'IX SMP Kedinasan', subject: 'Bahasa Inggris', teacher: 'Bambang S., M.Pd.', room: 'Ruang 204 (AC)', type: 'Makeup Class', branchId: 'br-2' },
  ]);

  const [classList, setClassList] = useState([
    { id: 'cls-1', name: 'XII SMA Kedokteran', grade: 'Kelas XII', room: 'Ruang 101 (Lab Komputer)', capacity: 36, enrolled: 32, waliKelas: 'Bambang S., M.Pd.', facilities: 'AC, Proyektor 4K, Smart TV, WiFi 100Mbps', branchId: 'br-1' },
    { id: 'cls-2', name: 'XI SMA Intensif', grade: 'Kelas XI', room: 'Ruang 102 (Kelas Multimedia)', capacity: 36, enrolled: 35, waliKelas: 'Dra. Endang Lestari', facilities: 'AC, Smart TV, Sound System, WiFi', branchId: 'br-1' },
    { id: 'cls-3', name: 'IX SMP Kedinasan', grade: 'Kelas IX', room: 'Ruang 204 (Ruang Diskusi)', capacity: 32, enrolled: 28, waliKelas: 'Kevin Sanjaya, S.Si.', facilities: 'AC, Whiteboard Magnetik, WiFi', branchId: 'br-2' },
  ]);

  const [formData, setFormData] = useState({
    day: 'Senin',
    time: '08:00 - 09:30',
    className: 'XII SMA Kedokteran',
    subject: 'Matematika Terapan',
    teacher: teachers[0]?.name || 'Bambang S., M.Pd.',
    room: 'Ruang 101 (AC)',
    type: 'Regular SNBT',
    branchId: branches[0]?.id || 'br-1'
  });

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredSchedule = scheduleList.filter(s => s.day === selectedDay);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSch = {
      id: `sch-${Date.now()}`,
      ...formData
    };
    setScheduleList(prev => [...prev, newSch]);
    addAuditLog('Add Class Schedule', 'Classes', `Jadwal baru ${formData.className} (${formData.subject}) ditambahkan untuk hari ${formData.day}`);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <School style={{ color: '#2575b9' }} /> Jadwal Mingguan, Alokasi Ruangan & Kelas
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Kelola alokasi ruang kelas, jadwal mata pelajaran harian, guru pengampu, dan sesi kelas pengganti (makeup class).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {(isSuperAdmin || currentRole === 'admin_cabang' || currentRole === 'guru') && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Penjadwalan Sesi / Makeup Class
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector: Jadwal Mingguan vs Alokasi Ruangan */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('jadwal')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'jadwal' ? '#2575b9' : '#ffffff',
            color: activeTab === 'jadwal' ? '#ffffff' : '#475569',
            border: activeTab === 'jadwal' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Calendar size={16} /> Jadwal Mingguan Sesi Belajar
        </button>

        <button
          onClick={() => setActiveTab('ruangan')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'ruangan' ? '#2575b9' : '#ffffff',
            color: activeTab === 'ruangan' ? '#ffffff' : '#475569',
            border: activeTab === 'ruangan' ? 'none' : '1px solid #cbd5e1',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.875rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} /> Alokasi Ruangan & Rombel Kelas
        </button>
      </div>

      {/* TAB 1: JADWAL MINGGUAN BELAJAR */}
      {activeTab === 'jadwal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Day Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: selectedDay === day ? '2px solid #2575b9' : '1px solid #cbd5e1',
                  background: selectedDay === day ? '#eef2ff' : '#ffffff',
                  color: selectedDay === day ? '#2575b9' : '#475569',
                  fontWeight: selectedDay === day ? 600 : 400,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Timetable Table Grid */}
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>
              Jadwal Sesi Belajar Hari {selectedDay}
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jam Sesi</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kelas / Rombel</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Mata Pelajaran</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Guru Pengampu</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Alokasi Ruangan</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jenis Sesi</th>
                    <th style={{ padding: '12px 14px', fontWeight: 600 }}>Lokasi Cabang</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                        Tidak ada jadwal sesi belajar pada hari {selectedDay}.
                      </td>
                    </tr>
                  ) : (
                    filteredSchedule.map(s => {
                      const brName = branches.find(b => b.id === s.branchId)?.name || 'Serdam Pusat';
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} /> {s.time}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{s.className}</td>
                          <td style={{ padding: '12px 14px', color: '#0f172a' }}>{s.subject}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{s.teacher}</td>
                          <td style={{ padding: '12px 14px', color: '#0284c7', fontWeight: 500 }}>{s.room}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span className={`badge ${s.type === 'Makeup Class' ? 'badge-warning' : 'badge-primary'}`}>
                              {s.type}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALOKASI RUANGAN & KAPASITAS */}
      {activeTab === 'ruangan' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {classList.map(c => {
            const brName = branches.find(b => b.id === c.branchId)?.name || 'Serdam Pusat';
            const capPercent = Math.round((c.enrolled / c.capacity) * 100);

            return (
              <div key={c.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{c.room}</span>
                    <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 600, margin: '4px 0 0' }}>{c.name} ({c.grade})</h3>
                  </div>
                  <span className="badge badge-success">{brName}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} style={{ color: '#d97706' }} /> Wali Kelas: <strong style={{ color: '#0f172a' }}>{c.waliKelas}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={14} style={{ color: '#2575b9' }} /> Peserta Terdaftar: <strong style={{ color: '#0f172a' }}>{c.enrolled} / {c.capacity} Siswa</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={14} style={{ color: '#16a34a' }} /> Fasilitas Ruangan: <span style={{ color: '#475569' }}>{c.facilities}</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Kapasitas Keterisian Ruangan</span>
                    <span style={{ color: capPercent > 90 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{capPercent}% Penuh</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    <div style={{ height: '100%', width: `${capPercent}%`, background: capPercent > 90 ? '#ef4444' : '#2575b9', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM MODAL PENJADWALAN KELAS BARU */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleAddSchedule} style={{ width: '100%', maxWidth: '520px', padding: '28px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Penjadwalan Sesi Belajar / Makeup Class</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Hari *</label>
                  <select value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })} className="select-field">
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jam Sesi *</label>
                  <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="select-field">
                    <option value="08:00 - 09:30">08:00 - 09:30 WIB</option>
                    <option value="09:45 - 11:15">09:45 - 11:15 WIB</option>
                    <option value="13:00 - 14:30">13:00 - 14:30 WIB</option>
                    <option value="15:30 - 17:00">15:30 - 17:00 WIB</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nama Kelas / Rombel *</label>
                <input type="text" value={formData.className} onChange={e => setFormData({ ...formData, className: e.target.value })} required className="input-field" />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Mata Pelajaran *</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Guru Pengampu *</label>
                  <select value={formData.teacher} onChange={e => setFormData({ ...formData, teacher: e.target.value })} className="select-field">
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Alokasi Ruangan *</label>
                  <select value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} className="select-field">
                    <option value="Ruang 101 (AC)">Ruang 101 (AC)</option>
                    <option value="Ruang 102 (Lab)">Ruang 102 (Lab Komputer)</option>
                    <option value="Ruang 204 (AC)">Ruang 204 (AC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Jenis Sesi *</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="select-field">
                  <option value="Regular SNBT">Regular SNBT & Kedokteran</option>
                  <option value="Intensif">Kelas Intensif</option>
                  <option value="Makeup Class">Makeup Class (Kelas Pengganti)</option>
                  <option value="Private Sesi">Privat Sesi Saja</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>Simpan Jadwal Sesi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
