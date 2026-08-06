'use client';

import React, { useState } from 'react';
import { Megaphone, Send, CheckCircle, MessageSquare, Mail, Bell, FileText, Check } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function AnnouncementsPage() {
  const { addAuditLog } = useERP();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [channelWA, setChannelWA] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const templates = [
    { name: 'Pengingat Jatuh Tempo SPP', title: 'Pengingat Pembayaran SPP Bulan Agustus 2026', body: 'Yth. Bapak/Ibu Wali Murid, diberitahukan bahwa batas jatuh tempo SPP bulan ini adalah tanggal 10 Agustus 2026. Pembayaran dapat dilakukan via QRIS atau Virtual Account BCA/Mandiri pada portal.' },
    { name: 'Pengumuman Ujian CBT', title: 'Pelaksanaan Tryout SNBT & UTBK 2026 Online', body: 'Diberitahukan kepada seluruh siswa kelas XII SMA bahwa Ujian CBT Tryout SNBT akan dilaksanakan pada hari Sabtu pukul 08:00 WIB melalui menu Engine CBT.' },
    { name: 'Undangan Rapat Wali Murid', title: 'Undangan Pertemuan Orang Tua / Wali Murid', body: 'Yth. Orang Tua / Wali Murid, kami mengundang Bapak/Ibu untuk menghadiri sosialisasi persiapan ujian SNBT & Kedokteran di Aula Cabang Serdam Pusat.' }
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.body);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    addAuditLog('Multi-Channel Broadcast WA', 'Announcements', `Broadcast "${title}" terkirim via WhatsApp API (${targetRole})`);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4500);
    setTitle(''); setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Megaphone style={{ color: '#2575b9' }} /> Broadcast WhatsApp Business API & Email Massal
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Kirim pengumuman massal instant via WhatsApp Gateway API, Email Blast Server, & Push Notification In-App.
        </p>
      </div>

      {broadcastSuccess && (
        <div style={{ padding: '20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '14px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
          <CheckCircle size={24} /> Broadcast Berhasil Terkirim ke 420 Nomor WhatsApp & Email Wali Murid Terhubung!
        </div>
      )}

      {/* Quick Template Pills */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2575b9', marginBottom: '8px' }}>Gunakan Template Pesan WhatsApp Instant:</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tpl)}
              style={{ padding: '8px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '20px', fontSize: '0.8rem', color: '#475569', cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} style={{ color: '#2575b9' }} /> {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleBroadcast} style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>Form Pengiriman Broadcast Pesan Massal</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Target Penerima Broadcast *</label>
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="select-field">
              <option value="ALL">Semua Pengguna (Siswa, Wali Murid, Guru)</option>
              <option value="wali_murid">Wali Murid / Orang Tua Sahaja</option>
              <option value="guru">Dewan Guru / Tutor</option>
              <option value="siswa">Siswa Terdaftar Sahaja</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Kanal Pengiriman *</label>
            <div style={{ display: 'flex', gap: '14px', paddingTop: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={channelWA} onChange={e => setChannelWA(e.target.checked)} /> WhatsApp API
              </label>
              <label style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={channelEmail} onChange={e => setChannelEmail(e.target.checked)} /> Email Blast
              </label>
              <label style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={channelPush} onChange={e => setChannelPush(e.target.checked)} /> Push App
              </label>
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Judul Pengumuman *</label>
          <input type="text" placeholder="misal: Pelaksanaan Ujian Tengah Semester Ganjil 2026" value={title} onChange={e => setTitle(e.target.value)} required className="input-field" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Isi Pesan Broadcast WhatsApp & Email *</label>
          <textarea placeholder="Tuliskan isi pesan lengkap yang akan terkirim..." value={message} onChange={e => setMessage(e.target.value)} required className="input-field" style={{ minHeight: '120px', width: '100%' }} />
        </div>

        <button type="submit" style={{ alignSelf: 'flex-start', marginTop: '6px', padding: '12px 24px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Send size={16} /> Send Broadcast WhatsApp & Email Now →
        </button>
      </form>
    </div>
  );
}
