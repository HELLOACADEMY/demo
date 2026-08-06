'use client';

import React from 'react';
import { useERP } from '@/context/ERPContext';
import { Phone, Lock, GraduationCap, Star, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CompanyProfileLandingPage() {
  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflowX: 'hidden', paddingBottom: '60px' }}>

      {/* SVG DOTTED DECORATIVE LOOPS BACKGROUND */}
      <svg style={{ position: 'absolute', top: '75px', right: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.35 }} viewBox="0 0 1440 900" fill="none">
        <path d="M 100 90 Q 600 10 1100 180 T 1350 670" stroke="#4f46e5" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 200 390 Q 700 740 1250 340" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 6" />
      </svg>

      {/* 🧭 HEADER BAR */}
      <header className="animate-slide-up" style={{ maxWidth: '1400px', margin: '0 auto', padding: '36px 32px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 20, gap: '28px' }}>
        
        {/* Hello Playful Badge Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4f46e5', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(79,70,229,0.25)' }}>H</span>
            <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ef4444', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(239,68,68,0.25)' }}>E</span>
            <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(245,158,11,0.25)' }}>L</span>
            <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.25)' }}>L</span>
            <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#06b6d4', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 4px 10px rgba(6,182,212,0.25)' }}>O!</span>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.08em' }}>PONTIANAK</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '22px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', alignItems: 'center', flexShrink: 0 }}>
          <Link href="/ppdb" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Profil Lembaga</Link>
          <Link href="/academic" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Visi & Misi</Link>
          <Link href="/academic" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Keunggulan</Link>
          <Link href="/classes" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Program Belajar</Link>
          <Link href="/branches" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>3 Cabang Pontianak</Link>
          <Link href="/announcements" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Kontak</Link>
        </nav>

        {/* Phone Contact, Scan QR, & Login Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <a href="https://wa.me/6282153789821" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#1e1b4b', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0, boxShadow: '0 4px 12px rgba(22,163,74,0.15)' }}>
              <Phone size={18} />
            </div>
            <span>+62 821-5378-9821</span>
          </a>

          <Link href="/attendance" className="btn btn-secondary hover-lift" style={{ borderRadius: '999px', padding: '12px 20px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#047857', background: '#d1fae5', border: '1px solid #a7f3d0' }}>
            <QrCode size={18} /> Scan QR Kehadiran
          </Link>

          <Link href="/login" className="btn btn-primary animate-glow hover-lift" style={{ borderRadius: '999px', padding: '12px 24px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <Lock size={16} /> Login
          </Link>
        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="animate-slide-up" style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px 32px 0', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', alignItems: 'end', position: 'relative', zIndex: 10 }}>
        
        {/* Hero Left Content Column */}
        <div style={{ paddingBottom: '32px', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.95rem', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.22, letterSpacing: '-0.01em', marginBottom: '20px', maxWidth: '600px' }}>
            Meraih Prestasi Tertinggi Bersama <br />
            <span style={{ color: '#ef4444', fontWeight: 700 }}>Hello Academy Pontianak</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.75, marginBottom: '28px', maxWidth: '540px', fontWeight: 400 }}>
            Mencetak Generasi Berprestasi, Berkarakter, dan Siap Bersaing Masuk Perguruan Tinggi Negeri (PTN) Favorit, Kedokteran, & Sekolah Kedinasan Indonesia melalui 3 Cabang Utama Kota Pontianak.
          </p>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <Link href="/ppdb?register=true" className="btn btn-red hover-lift" style={{ borderRadius: '999px', padding: '16px 36px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none' }}>
              Pendaftaran PPDB 2026 →
            </Link>
            <Link href="/ppdb" className="btn btn-secondary hover-lift" style={{ borderRadius: '999px', padding: '16px 32px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}>
              Pelajari Profil →
            </Link>
          </div>

          {/* Key Company Fast Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#4f46e5' }}>1.150+</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Siswa Aktif</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ef4444' }}>3 Cabang</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Kota Pontianak</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981' }}>95%</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Lulus PTN & Kedinasan</div>
            </div>
          </div>
        </div>

        {/* Hero Right Visual Column */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '580px', width: '100%', overflow: 'visible' }}>
          
          {/* Top Badge Floating */}
          <div className="animate-float" style={{ position: 'absolute', top: '45px', right: '10px', background: '#ffffff', padding: '14px 26px', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)', border: '2px solid #e0e7ff', zIndex: 12, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={28} style={{ color: '#4f46e5' }} />
            </div>
            <span>100% Pengajar dari PTN</span>
          </div>

          {/* Student Hero Image */}
          <img
            src="/images/hero_students.png?v=2026"
            alt="Siswa Berprestasi Hello Academy Pontianak"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
              transform: 'scale(1.55)',
              transformOrigin: 'bottom center'
            }}
          />

          {/* Bottom Badge Floating */}
          <div className="animate-float" style={{ position: 'absolute', bottom: '20px', left: '-35px', background: '#ffffff', padding: '14px 26px', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: '#10b981', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)', zIndex: 10, border: '2px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={28} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            </div>
            <span>Lulus PTN & Kedinasan 2026</span>
          </div>
        </div>
      </section>

      {/* 📜 RUNNING MARQUEE TICKER ANIMATION (FIXED AT VERY BOTTOM OF SCREEN - SMOOTH 60s SPEED) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#1e1b4b', color: '#fff', padding: '14px 0', overflow: 'hidden', whiteSpace: 'nowrap', zIndex: 9999, borderTop: '2px solid #312e81', boxShadow: '0 -4px 20px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'inline-flex', gap: '44px', fontSize: '0.95rem', fontWeight: 700, animation: 'marquee 60s linear infinite' }}>
          <span>🔥 HELLO ACADEMY PONTIANAK - BIMBINGAN BELAJAR TERBAIK DI PONTIANAK</span>
          <span>✨ 3 CABANG UTAMA: SERDAM PUSAT • KARYA BARU • DANAU SENTARUM</span>
          <span>🚀 PENDAFTARAN PPDB 2026 / 2027 KINI DIBUKA - DISKON BEASISWA TEST PLACEMENT</span>
          <span>🎓 MENCETAK GENERASI UNGGUL LULUS PTN FAVORIT, KEDOKTERAN, & KEDINASAN</span>
          <span>📞 WHATSAPP RESMI: +62 821-5378-9821</span>
        </div>
      </div>

    </div>
  );
}
