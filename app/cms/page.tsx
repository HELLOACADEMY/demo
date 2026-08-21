'use client';

import React, { useState } from 'react';
import { Globe, Save, Check, Eye, ExternalLink, Image, Layout, FileText, Megaphone } from 'lucide-react';
import { useERP } from '@/context/ERPContext';
import Link from 'next/link';

export default function CMSPage() {
  const { addAuditLog } = useERP();
  const [heroTitle, setHeroTitle] = useState('Bimbingan Belajar Berstandar Kedokteran & Sekolah Kedinasan Terbaik');
  const [heroSubtitle, setHeroSubtitle] = useState('Bsmart Education Pontianak - Melahirkan Generasi Pemimpin Masa Depan di 3 Cabang Utama Kota Pontianak.');
  const [announcementTicker, setAnnouncementTicker] = useState('🔥 PENDAFTARAN PPDB GELOMBANG 1 TAHUN 2026 DISKON UTAMA 25% HINGGA 31 AGUSTUS! DENGAN BEASISWA TEST PLACEMENT.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('Update CMS Public Website', 'CMS', 'Hero section & marquee pengumuman publik dipublikasikan');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe style={{ color: '#2575b9' }} /> CMS Editor Website Public & Landing Page
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Kelola konten halaman depan website publik, running marquee, berita publik, promo PPDB, dan informasi cabang.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          style={{ padding: '10px 18px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', color: '#2575b9', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ExternalLink size={16} /> 🌐 Preview Landing Page Public Live
        </Link>
      </div>

      {savedSuccess && (
        <div style={{ padding: '16px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={20} /> Konten Website Sekolah Berhasil Diperbarui & Dipublikasikan ke Pengunjung Public!
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSaveCMS} style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layout size={18} style={{ color: '#2575b9' }} /> Header Hero Banner Editor
        </h3>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Judul Utama Banner Hero Landing Page *</label>
          <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} required className="input-field" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Deskripsi Subtitle Hero *</label>
          <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} required className="input-field" style={{ minHeight: '80px', width: '100%' }} />
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={18} style={{ color: '#d97706' }} /> Running Ticker / Marquee Pengumuman Public
          </h3>
          <label style={{ fontSize: '0.85rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Teks Running Marquee Pengumuman Promo PPDB *</label>
          <input type="text" value={announcementTicker} onChange={e => setAnnouncementTicker(e.target.value)} required className="input-field" style={{ width: '100%' }} />
        </div>

        <button type="submit" style={{ alignSelf: 'flex-start', marginTop: '8px', padding: '10px 20px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Dipublikasikan ke Website Utama
        </button>
      </form>
    </div>
  );
}
