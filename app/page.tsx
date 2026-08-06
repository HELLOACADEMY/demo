'use client';

import React from 'react';
import { useERP } from '@/context/ERPContext';
import {
  Phone, ArrowRight, Lock, Sparkles, CheckCircle2, ChevronRight,
  Globe, GraduationCap, Heart, Award, ShieldCheck, Users,
  BookOpen, Clock, Star, MapPin, Target, Eye, Compass, Building2, QrCode
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyProfileLandingPage() {
  const { branches } = useERP();

  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflowX: 'hidden', paddingBottom: '60px' }}>

      {/* SVG DOTTED DECORATIVE LOOPS BACKGROUND (POSITIONED PERFECTLY BELOW HEADER MENU LINKS) */}
      <svg style={{ position: 'absolute', top: '75px', right: 0, width: '100%', height: '1800px', pointerEvents: 'none', zIndex: 0, opacity: 0.35 }} viewBox="0 0 1440 1800" fill="none">
        <path d="M 100 90 Q 600 10 1100 180 T 1350 670" stroke="#4f46e5" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 200 390 Q 700 740 1250 340" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M -50 790 Q 500 1040 1150 840" stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" />
      </svg>

      {/* 🧭 HEADER BAR (SPACIOUS PREMIUM TOP PADDING) */}
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
          <a href="#profile" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Profil Lembaga</a>
          <a href="#vision-mission" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Visi & Misi</a>
          <a href="#advantages" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Keunggulan</a>
          <a href="#programs" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Program Belajar</a>
          <a href="#branches" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>3 Cabang Pontianak</a>
          <a href="#contacts" className="hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>Kontak</a>
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

      {/* 🚀 1. HERO SECTION (LARGE PHOTO 1.55X FILLING RIGHT DESKTOP COLUMN) */}
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
            <a href="#profile" className="btn btn-secondary hover-lift" style={{ borderRadius: '999px', padding: '16px 32px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}>
              Pelajari Profil →
            </a>
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

        {/* Hero Right Visual Column (LARGE 1.55X PHOTO) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '580px', width: '100%', overflow: 'visible' }}>
          
          {/* Top Badge Floating Closer to Student Photo */}
          <div className="animate-float" style={{ position: 'absolute', top: '45px', right: '10px', background: '#ffffff', padding: '14px 26px', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: '#1e1b4b', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)', border: '2px solid #e0e7ff', zIndex: 12, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={28} style={{ color: '#4f46e5' }} />
            </div>
            <span>100% Pengajar dari PTN</span>
          </div>

          {/* Photo Scaled Up Large */}
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

          <div className="animate-float" style={{ position: 'absolute', bottom: '20px', left: '-35px', background: '#ffffff', padding: '14px 26px', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, color: '#10b981', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)', zIndex: 10, border: '2px solid #d1fae5', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={28} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            </div>
            <span>Lulus PTN & Kedinasan 2026</span>
          </div>
        </div>
      </section>

      {/* 🏛️ 2. PROFIL SINGKAT & SEJARAH LEMBAGA */}
      <section id="profile" className="animate-slide-up" style={{ maxWidth: '1400px', margin: '0 auto', padding: '50px 36px 80px', marginTop: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TENTANG PERUSAHAAN</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1e1b4b', marginTop: '8px', marginBottom: '20px' }}>
              Sejarah & Komitmen Hello Academy Pontianak
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.8, marginBottom: '20px' }}>
              Hello Academy Pontianak adalah lembaga pendidikan non-formal dan bimbingan belajar modern yang didirikan untuk memberikan solusi pendidikan berkualitas tinggi bagi peserta didik dari tingkat SD, SMP, SMA, hingga Gap Year di Kalimantan Barat.
            </p>
            <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.8, marginBottom: '28px' }}>
              Dengan menggabungkan pengajar profesional bersertifikasi (*Super Teacher* lulusan PTN), kurikulum terstruktur berbasis IRT Analytics, serta dukungan sistem informasi digital Enterprise ERP terpadu di 3 cabang utama, kami berkomitmen mendampingi setiap siswa meraih impian akademis terbaiknya.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Building2 size={24} style={{ color: '#4f46e5', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b' }}>Fasilitas Modern</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Ruang AC, Lab CBT Computer, & Perpustakaan Digital.</p>
              </div>

              <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Award size={24} style={{ color: '#10b981', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b' }}>Pengajar Unggulan</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>100% Super Teacher lulusan PTN favorit.</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ background: '#fff', padding: '40px', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 15px 40px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck style={{ color: '#4f46e5' }} /> Pilar Pelayanan Pendidikan
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 700, flexShrink: 0 }}>01</div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1b4b' }}>Pengajaran Berorientasi Hasil</h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>Fokus pada pemahaman konsep dasar, logika penyelesaian soal cepat, & kesiapan ujian CBT.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>02</div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1b4b' }}>Kemitraan Dengan Orang Tua</h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>Transparansi laporan nilai, presensi QR realtime, & E-Rapor digital melalui Portal Wali Murid.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 700, flexShrink: 0 }}>03</div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e1b4b' }}>Integritas & Karakter</h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>Membentuk kedisiplinan, etika belajar, serta kepercayaan diri tinggi peserta didik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 3. VISI & MISI PERUSAHAAN */}
      <section id="vision-mission" className="animate-slide-up" style={{ background: '#fff', padding: '90px 36px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ padding: '8px 20px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.85rem', fontWeight: 700 }}>
              ARAH & TUJUAN LEMBAGA
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1e1b4b', marginTop: '12px' }}>Visi & Misi Hello Academy Pontianak</h2>
            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '6px' }}>Pedoman utama seluruh sivitas akademika dalam melayani pendidikan Indonesia.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* CARD VISI */}
            <div className="glass-card hover-lift" style={{ background: '#f8fafc', padding: '40px', borderRadius: '28px', border: '1px solid #e2e8f0', borderTop: '6px solid #4f46e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <Eye size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1b4b' }}>Visi Perusahaan</h3>
              </div>
              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, fontWeight: 500 }}>
                "Menjadi lembaga bimbingan belajar & akademi pendidikan non-formal terdepan di Kalimantan Barat yang berstandar nasional, berorientasi prestasi tinggi, serta berbasis teknologi digital terintegrasi pada tahun 2030."
              </p>
            </div>

            {/* CARD MISI */}
            <div className="glass-card hover-lift" style={{ background: '#f8fafc', padding: '40px', borderRadius: '28px', border: '1px solid #e2e8f0', borderTop: '6px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <Target size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1b4b' }}>Misi Perusahaan</h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  Menyediakan pengajaran berkualitas tinggi yang didampingi oleh Super Teacher lulusan PTN favorit.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  Mengembangkan sistem asesmen belajar modern (IRT Analytics & CBT Engine) untuk mengukur kemajuan riil siswa.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  Membangun kemitraan erat dengan orang tua murid melalui transparansi presensi & laporan hasil belajar digital.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 4. PROGRAM BELAJAR LENGKAP */}
      <section id="programs" className="animate-slide-up" style={{ padding: '90px 36px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ padding: '8px 20px', borderRadius: '999px', background: '#fee2e2', color: '#dc2626', fontSize: '0.85rem', fontWeight: 700 }}>
            LAYANAN PENDIDIKAN
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1e1b4b', marginTop: '8px' }}>
            Program Belajar Lengkap (SD, SMP, SMA, & GAP YEAR)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px' }}>
          {[
            { level: 'SMA & UTBK PTN', title: 'Program Super Intensif SNBT & Kedokteran', desc: 'Pendampingan UTBK PTN, Kedokteran, & Ujian Mandiri dengan Try Out IRT berkala.', price: 'Jaminan Kelulusan PTN', color: '#ef4444' },
            { level: 'Kedinasan 2026', title: 'Short Class Sekolah Kedinasan (STIS, STAN, IPDN)', desc: 'Persiapan Tes SKD, TPA, Matematika Terapan, & Psikotes Kedinasan.', price: 'Persiapan SKD & TPA', color: '#4f46e5' },
            { level: 'SMP Favorit', title: 'Bimbel Lulus SMP Favorit & Ujian Sekolah', desc: 'Pemantapan materi sekolah, pendampingan PTM Hybrid, & persiapan masuk SMA Unggulan.', price: 'Pendampingan PTM Hybrid', color: '#10b981' },
            { level: 'SD Juara', title: 'Bimbel SD Juara Kelas & Fondasi Karakter', desc: 'Metode interaktif matematika dasar, membaca, sains, & pembentukan logika berikir.', price: 'Metode Interaktif', color: '#f59e0b' },
          ].map((p, idx) => (
            <div key={idx} className="hover-lift" style={{ background: '#fff', padding: '36px', borderRadius: '28px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, background: '#f8fafc', padding: '6px 14px', borderRadius: '999px', border: '1px solid #cbd5e1' }}>
                  {p.level}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', margin: '20px 0 10px' }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{p.desc}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1b4b' }}>{p.price}</span>
                <Link href="/ppdb?register=true" style={{ width: '42px', height: '42px', borderRadius: '50%', background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏢 5. LOKASI 3 CABANG UTAMA PONTIANAK */}
      <section id="branches" className="animate-slide-up" style={{ padding: '90px 36px', background: '#f1f5f9', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ padding: '8px 20px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.85rem', fontWeight: 700 }}>
              JARINGAN OPERASIONAL
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1e1b4b', marginTop: '14px' }}>Jaringan 3 Cabang Utama Hello Academy Pontianak</h2>
            <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '6px' }}>Tersebar di titik kota terdekat untuk melayani peserta didik secara maksimal.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {branches.map(b => (
              <div key={b.id} className="hover-lift" style={{ background: '#fff', padding: '36px', borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 10px 35px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', background: '#e0e7ff', padding: '6px 14px', borderRadius: '8px' }}>{b.code}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e1b4b', margin: '16px 0 12px' }}>{b.name}</h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>📍 <strong>Alamat:</strong> {b.address}</div>
                  <div>📞 <strong>Telepon / WA:</strong> {b.phone}</div>
                  <div>✉️ <strong>Email:</strong> {b.email}</div>
                  <div>👤 <strong>Penanggung Jawab (PIC):</strong> <strong style={{ color: '#1e1b4b' }}>{b.pic}</strong></div>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{b.totalStudents} Murid Aktif</span>
                  <Link href="/ppdb?register=true" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', textDecoration: 'none' }}>Daftar Cabang Ini →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔻 FOOTER */}
      <footer id="contacts" style={{ background: '#1e1b4b', color: '#94a3b8', padding: '56px 36px 32px', fontSize: '0.9rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Hello Academy Pontianak</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.7, maxWidth: '420px' }}>
              Lembaga Pendidikan & Bimbingan Belajar Terintegrasi dengan Sistem Informasi Manajemen Enterprise Multi-Cabang ERP.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📍 <strong>Kantor Pusat:</strong> Jl. Sungai Raya Dalam (Serdam) No. 88, Pontianak</div>
              <div>💬 <strong>WhatsApp Resmi:</strong> <a href="https://wa.me/6282153789821" target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>+62 821-5378-9821</a></div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Navigasi Profil</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <a href="#profile" style={{ color: 'inherit', textDecoration: 'none' }}>Profil Singkat</a>
              <a href="#vision-mission" style={{ color: 'inherit', textDecoration: 'none' }}>Visi & Misi Perusahaan</a>
              <a href="#programs" style={{ color: 'inherit', textDecoration: 'none' }}>Program Belajar</a>
              <a href="#branches" style={{ color: 'inherit', textDecoration: 'none' }}>3 Lokasi Cabang</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Akses Sistem ERP</h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Portal Manajemen 27 Modul Operasional untuk Staff, Pengajar, Siswa, & Wali Murid.
            </p>
            <Link href="/login" className="btn btn-red animate-glow hover-lift" style={{ borderRadius: '999px', padding: '12px 28px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
              <Lock size={16} /> Login
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <div>© 2026 Hello Academy Pontianak. All rights reserved.</div>
          <div>Pontianak • Kalimantan Barat</div>
        </div>
      </footer>

    </div>
  );
}
