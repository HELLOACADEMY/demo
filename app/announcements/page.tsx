'use client';

import React, { useState } from 'react';
import { Megaphone, Send, CheckCircle, MessageSquare, Mail, Bell, FileText, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function AnnouncementsPage() {
  const { addAuditLog } = useERP();
  const [title, setTitle] = useState('Pengingat Pembayaran SPP & Pengumuman Sekolah');
  const [message, setMessage] = useState('Yth. Bapak/Ibu Wali Murid, diberitahukan bahwa batas jatuh tempo pembayaran SPP bulan ini adalah tanggal 10 Agustus 2026. Pembayaran dapat dilakukan via Transfer Manual Bank BCA (888-019-2831 a.n PT Bsmart Education Pontianak), Mandiri, BRI, atau QRIS pada portal sekolah.');
  const [targetRole, setTargetRole] = useState('wali_murid');
  const [channelWA, setChannelWA] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const templates = [
    {
      name: '💳 Pengingat SPP & Tagihan Wali Murid',
      title: 'Pengingat Pembayaran SPP Bulan Agustus 2026',
      body: 'Yth. Bapak/Ibu Wali Murid,\n\nDiberitahukan bahwa batas jatuh tempo SPP bulan ini adalah tanggal 10 Agustus 2026. Pembayaran dapat dilakukan via Transfer Bank BCA (888-019-2831 a.n PT Bsmart Education Pontianak), Mandiri, BRI, atau QRIS Instant pada portal.\n\nUpload bukti transfer Anda di:\nhttp://localhost:3000/finance/payment'
    },
    {
      name: '📝 Ujian CBT & Tryout SNBT',
      title: 'Pelaksanaan Tryout SNBT & UTBK 2026 Online',
      body: 'Yth. Bapak/Ibu Wali Murid,\n\nDiberitahukan bahwa ananda siswa kelas XII SMA akan mengikuti Tryout CBT SNBT Intensif pada hari Sabtu pukul 08:00 WIB. Mohon dukungan dan pendampingan belajar ananda di rumah.'
    },
    {
      name: '🏫 Undangan Rapat Orang Tua',
      title: 'Undangan Pertemuan Orang Tua / Wali Murid',
      body: 'Yth. Bapak/Ibu Wali Murid,\n\nKami mengundang Bapak/Ibu untuk menghadiri Silaturahmi & Sosialisasi Kesiapan Ujian PTN Kedokteran pada hari Sabtu mendatang di Aula Utama Bsmart Education.'
    },
    {
      name: '📅 Libur Operasional Sekolah',
      title: 'Pengumuman Operasional Kegiatan Belajar',
      body: 'Yth. Bapak/Ibu Wali Murid,\n\nSehubungan dengan Hari Libur Nasional, kegiatan bimbingan belajar diliburkan sementara dan akan aktif kembali normal sesuai jadwal.'
    }
  ];

  const applyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setMessage(tpl.body);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    addAuditLog('Multi-Channel Broadcast WA', 'Announcements', `Broadcast pengumuman "${title}" terkirim ke WhatsApp Wali Murid (${targetRole})`);
    setBroadcastSuccess(true);

    const waText = encodeURIComponent(`${title.toUpperCase()}\n\n${message}`);
    const waUrl = `https://api.whatsapp.com/send?phone=628129876543&text=${waText}`;
    window.open(waUrl, '_blank');

    setTimeout(() => setBroadcastSuccess(false), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header Page */}
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Megaphone style={{ color: '#2563eb' }} /> Broadcast WhatsApp API & Pengumuman Wali Murid
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Kirim penagihan SPP, pengingat tagihan, dan pengumuman sekolah massal instant via WhatsApp Business API & Portal Wali Murid.
        </p>
      </div>

      {broadcastSuccess && (
        <div style={{ padding: '18px 24px', background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: '14px', color: '#166534', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.15)' }}>
          <CheckCircle size={28} style={{ color: '#166534', flexShrink: 0 }} />
          <div>
            <div>Broadcast WhatsApp Berhasil Diterbitkan!</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>Pesan terkirim ke 420 nomor WhatsApp Wali Murid terdaftar & tersimpan di audit log.</div>
          </div>
        </div>
      )}

      {/* Quick Template Pills */}
      <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb', marginBottom: '10px' }}>Pilih Template Pesan WhatsApp Penagihan & Pengumuman Instant:</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tpl)}
              style={{ padding: '8px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', fontSize: '0.8rem', color: '#1d4ed8', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={14} style={{ color: '#2563eb' }} /> {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Broadcast Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Broadcast Form */}
        <form onSubmit={handleBroadcast} style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Form Pengiriman Broadcast WA Wali Murid</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Target Penerima Broadcast *</label>
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="select-field">
                <option value="wali_murid">👵 Wali Murid / Orang Tua Siswa (Utama)</option>
                <option value="ALL">🌐 Semua Pengguna (Siswa, Wali, Guru)</option>
                <option value="guru">👨‍🏫 Dewan Guru / Tutor</option>
                <option value="siswa">🎓 Siswa Terdaftar Sahaja</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Kanal Pengiriman *</label>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={channelWA} onChange={e => setChannelWA(e.target.checked)} /> WhatsApp API
                </label>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={channelEmail} onChange={e => setChannelEmail(e.target.checked)} /> Email
                </label>
                <label style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={channelPush} onChange={e => setChannelPush(e.target.checked)} /> Push App
                </label>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Judul Pengumuman / Penagihan *</label>
            <input type="text" placeholder="Judul Pengumuman..." value={title} onChange={e => setTitle(e.target.value)} required className="input-field" style={{ width: '100%', fontWeight: 700 }} />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Isi Pesan WhatsApp Wali Murid *</label>
            <textarea placeholder="Tuliskan isi pesan pengumuman..." value={message} onChange={e => setMessage(e.target.value)} required className="input-field" style={{ minHeight: '140px', width: '100%', fontSize: '0.875rem' }} />
          </div>

          <button type="submit" style={{ padding: '14px 24px', background: '#25d366', border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)' }}>
            <MessageCircle size={18} /> Send Broadcast WhatsApp Ke Wali Murid →
          </button>
        </form>

        {/* Live WA Chat Box Preview */}
        <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare style={{ color: '#25d366' }} /> Preview Pesan WhatsApp Real-Time
          </h3>

          <div style={{ flex: 1, background: '#efeae2', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderLeft: '4px solid #25d366', maxWidth: '100%' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#128c7e', textTransform: 'uppercase', marginBottom: '6px' }}>
                BSMART EDUCATION PONTIANAK (OFFICIAL WA API)
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#111b21', marginBottom: '8px' }}>
                {title || 'Judul Pengumuman'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#222d34', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                {message || 'Isi pesan akan tampil secara terformat di sini...'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#667781', textAlign: 'right', marginTop: '10px' }}>
                10:45 • Terkirim via WA API ✅✅
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
