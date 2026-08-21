'use client';

import React, { useState, useEffect } from 'react';
import { useERP } from '@/context/ERPContext';
import {
  Phone, ArrowRight, Star, BookOpen, MapPin, ChevronRight,
  Menu, X, QrCode, GraduationCap, Clock, Heart, Sparkles,
  Quote, Building2, Mail, Share2, ThumbsUp, PlayCircle,
  Calculator, FlaskConical, Globe, Monitor, PenLine, Palette,
  ShieldCheck, Layers, Laptop, CheckCircle2, Users, Award,
  BarChart3, Home
} from 'lucide-react';
import Link from 'next/link';

const PROGRAMS = [
  { IconComp: Calculator, title: 'Matematika', desc: 'Kuasai berhitung cepat, aljabar, dan geometri dengan metode yang efektif.', color: '#3B82F6', bg: '#DBEAFE', age: 'Semua Jenjang' },
  { IconComp: FlaskConical, title: 'IPA & Sains', desc: 'Eksplorasi dunia ilmu pengetahuan alam dengan eksperimen yang menarik.', color: '#10B981', bg: '#D1FAE5', age: 'SD – SMA' },
  { IconComp: Globe, title: 'Bahasa Inggris', desc: 'Percaya diri berbicara, menulis, dan memahami bahasa Inggris dengan lancar.', color: '#F59E0B', bg: '#FEF3C7', age: 'Semua Jenjang' },
  { IconComp: Monitor, title: 'Komputer & Coding', desc: 'Belajar dasar-dasar pemrograman dan teknologi untuk masa depan.', color: '#8B5CF6', bg: '#EDE9FE', age: 'SD – SMA' },
  { IconComp: PenLine, title: 'Bahasa Indonesia', desc: 'Tingkatkan kemampuan membaca, menulis, dan memahami teks dengan baik.', color: '#EC4899', bg: '#FCE7F3', age: 'Semua Jenjang' },
  { IconComp: Palette, title: 'Seni & Kreativitas', desc: 'Kembangkan bakat seni, gambar, dan kreativitas anak secara optimal.', color: '#F97316', bg: '#FFEDD5', age: 'SD – SMP' },
];

const TESTIMONIALS = [
  { name: 'Ibu Sari Dewi', role: 'Wali Murid – Cabang Khatulistiwa', text: 'Nilai matematika anak saya naik drastis setelah belajar di Bsmart Education. Guru-gurunya sabar dan metode belajarnya sangat menyenangkan!', rating: 5, initials: 'SD' },
  { name: 'Bpk. Ahmad Rifai', role: 'Wali Murid – Cabang Karya Baru', text: 'Anak saya yang dulunya susah fokus, sekarang rajin belajar sendiri. Terima kasih Bsmart Education Pontianak!', rating: 5, initials: 'AR' },
  { name: 'Ibu Mardiyah', role: 'Wali Murid – Cabang Sungai Raya', text: 'Pelayanan sangat bagus, lingkungan belajar nyaman, dan anak saya senang datang ke sini setiap hari!', rating: 5, initials: 'MY' },
];

const STATS = [
  { value: '12+', label: 'Tahun Pengalaman', IconComp: Award, color: '#7C3AED' },
  { value: '50+', label: 'Tenaga Pengajar', IconComp: Users, color: '#10B981' },
  { value: '2000+', label: 'Siswa Aktif', IconComp: GraduationCap, color: '#F59E0B' },
  { value: '3', label: 'Cabang Pontianak', IconComp: Building2, color: '#EC4899' },
];

const BRANCHES = [
  { name: 'Cabang Khatulistiwa', address: 'Jl. Khatulistiwa No. 88, Pontianak Utara', phone: '0821-5378-9821', hours: 'Senin – Sabtu: 07.00 – 20.00', color: '#7C3AED' },
  { name: 'Cabang Karya Baru', address: 'Jl. Karya Baru No. 45, Pontianak Barat', phone: '0821-5378-9822', hours: 'Senin – Sabtu: 07.00 – 20.00', color: '#10B981' },
  { name: 'Cabang Sungai Raya', address: 'Jl. Sungai Raya Dalam No. 12, Kubu Raya', phone: '0821-5378-9823', hours: 'Senin – Sabtu: 07.00 – 20.00', color: '#F59E0B' },
];

const WHY_ITEMS = [
  { IconComp: Layers, title: 'Kurikulum Terkini', desc: 'Mengikuti kurikulum nasional terbaru (Merdeka Belajar)', color: '#7C3AED', bg: 'rgba(124,58,237,0.2)' },
  { IconComp: ShieldCheck, title: 'Lingkungan Aman', desc: 'Fasilitas aman, nyaman, dan ramah anak dengan pengawasan penuh', color: '#10B981', bg: 'rgba(16,185,129,0.2)' },
  { IconComp: BarChart3, title: 'Sesi Intensif', desc: 'Program intensif menjelang ujian nasional & masuk PTN', color: '#F59E0B', bg: 'rgba(245,158,11,0.2)' },
  { IconComp: Laptop, title: 'Pantau Online', desc: 'Orang tua dapat memantau progres belajar kapan saja via ERP', color: '#EC4899', bg: 'rgba(236,72,153,0.2)' },
];

const ABOUT_POINTS = [
  { IconComp: CheckCircle2, text: 'Metode belajar berbasis penelitian modern', color: '#7C3AED' },
  { IconComp: Users, text: 'Guru berpengalaman & bersertifikat', color: '#10B981' },
  { IconComp: BarChart3, text: 'Pantau perkembangan anak secara real-time', color: '#F59E0B' },
  { IconComp: Home, text: 'Lingkungan belajar nyaman & kondusif', color: '#EC4899' },
];

export default function BsmartLandingPage() {
  const { branches } = useERP();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: '#F8F7FF', color: '#1E1B4B', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", overflowX: 'hidden' }}>

      {/* ===== STICKY NAVBAR ===== */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1.5px solid #E0D9F7' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(91,33,182,0.1)' : 'none',
        transition: 'all 0.35s ease',
        padding: '0 32px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Bsmart" style={{ height: '44px', width: 'auto' }} />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: scrolled ? '#1E1B4B' : '#fff', lineHeight: 1, letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
                Bsmart <span style={{ color: '#7C3AED' }}>Education</span>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#A78BFA', letterSpacing: '0.12em', marginTop: '2px' }}>PONTIANAK</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-only" style={{ gap: '6px', alignItems: 'center' }}>
            {[['#hero', 'Beranda'], ['#programs', 'Program'], ['#about', 'Tentang'], ['#branches', 'Cabang'], ['#contact', 'Kontak']].map(([href, label]) => (
              <a key={href} href={href} style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 500,
                color: scrolled ? '#3730A3' : '#fff', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; e.currentTarget.style.color = '#5B21B6'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? '#3730A3' : '#fff'; }}
              >{label}</a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="desktop-only" style={{ gap: '12px', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-yellow" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Login <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? '#5B21B6' : '#fff', padding: '8px' }}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(45,27,105,0.97)',
          display: 'flex', flexDirection: 'column', padding: '90px 28px 32px', gap: '8px',
        }}>
          {[['#hero', 'Beranda'], ['#programs', 'Program Belajar'], ['#about', 'Tentang Kami'], ['#branches', 'Cabang Kami'], ['#contact', 'Kontak']].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '16px', borderRadius: '16px', color: '#fff', fontSize: '1.1rem', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {label}
            </a>
          ))}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/ppdb" onClick={() => setMobileMenuOpen(false)} className="btn btn-yellow" style={{ justifyContent: 'center' }}>
              Daftar Sekarang
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Login
            </Link>
          </div>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section id="hero" style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #2D1B69 0%, #4C1D95 40%, #5B21B6 70%, #6D28D9 100%)',
        position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '80px',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '8%', right: '8%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(124,58,237,0.25)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        {/* Decorative rings */}
        {[
          { top: '18%', left: '10%', size: 10, delay: '0s', color: '#FBBF24', opacity: 0.7 },
          { top: '70%', left: '7%', size: 7, delay: '0.8s', color: '#F472B6', opacity: 0.6 },
          { top: '28%', right: '16%', size: 8, delay: '0.3s', color: '#34D399', opacity: 0.7 },
          { top: '78%', right: '10%', size: 12, delay: '1.2s', color: '#FBBF24', opacity: 0.5 },
        ].map((d, i) => (
          <div key={i} className="star-deco" style={{
            top: d.top, left: (d as any).left, right: (d as any).right, animationDelay: d.delay,
            width: `${d.size}px`, height: `${d.size}px`, borderRadius: '50%',
            background: d.color, opacity: d.opacity,
          }} />
        ))}

        {/* Content grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2 }}>

          {/* Left: Text */}
          <div className="animate-slide-left" style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>

            <h1 style={{ fontSize: '3.4rem', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              <strong style={{ fontWeight: 900, color: '#fff' }}>12+ Tahun</strong> Pengalaman<br />
              Raih Prestasi<br />
              <span style={{ color: '#FBBF24', textShadow: '0 4px 20px rgba(251,191,36,0.4)' }}>Terbaik Bersama</span><br />
              Kami
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, fontWeight: 400 }}>
              Bsmart Education hadir untuk mendampingi perjalanan belajar anak-anak Pontianak dengan metode inovatif, tenaga pengajar berpengalaman, dan suasana belajar yang menyenangkan.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/ppdb" className="btn btn-yellow" style={{ fontSize: '1rem', padding: '14px 28px', boxShadow: '0 8px 32px rgba(245,158,11,0.5)' }}>
                Daftar Sekarang <ArrowRight size={20} />
              </Link>
            </div>

            {/* Trust points */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '4px' }}>
              {[
                { icon: <CheckCircle2 size={15} color="#34D399" />, text: 'Tenaga Ahli Bersertifikat' },
                { icon: <Laptop size={15} color="#60A5FA" />, text: 'Pantau Progress Online' },
                { icon: <Award size={15} color="#FBBF24" />, text: 'Terbukti Meningkatkan Nilai' },
              ].map((t, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 400 }}>
                  {t.icon} {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Illustration — no background, blends with hero gradient */}
          <div className="animate-slide-right" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero_custom.png"
              alt="Bsmart Education"
              className="animate-float-slow"
              style={{
                width: '100%',
                maxWidth: '540px',
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                objectFit: 'contain',
              }}
            />

            {/* Floating stat badges — positioned cleanly without overlapping left text */}
            <div className="floating-badge animate-float" style={{ top: '4%', right: '4%', animationDelay: '0s' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={18} color="#7C3AED" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#5B21B6' }}>2000+</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>Siswa Aktif</div>
              </div>
            </div>

            <div className="floating-badge animate-float" style={{ bottom: '14%', right: '2%', animationDelay: '1.5s' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#F59E0B' }}>4.9/5.0</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>Rating Orang Tua</div>
              </div>
            </div>

            <div className="floating-badge animate-float" style={{ bottom: '8%', left: '4%', animationDelay: '0.8s' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} color="#10B981" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10B981' }}>12+ Tahun</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>Berpengalaman</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" fill="#F8F7FF" />
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ background: '#F8F7FF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {STATS.map((s, i) => {
              const IC = s.IconComp;
              return (
                <div key={i} className="stat-card hover-lift">
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <IC size={24} color={s.color} />
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 400, color: '#64748B', marginTop: '8px' }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" style={{ background: '#fff', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(124,58,237,0.06)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left image side */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '32px', overflow: 'hidden', background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '380px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/program_icons.png" alt="Bsmart Programs" style={{ width: '100%', maxWidth: '380px', borderRadius: '16px' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#fff', borderRadius: '20px', padding: '18px 24px', boxShadow: '0 12px 40px rgba(91,33,182,0.18)', border: '1.5px solid #EDE9FE', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: '#1E1B4B' }}>Lulusan Terbaik</div>
                <div style={{ fontWeight: 400, fontSize: '0.8rem', color: '#7C3AED' }}>Sejak 2012</div>
              </div>
            </div>
          </div>

          {/* Right text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EDE9FE', borderRadius: '999px', padding: '8px 18px', width: 'fit-content' }}>
              <Heart size={16} color="#7C3AED" />
              <span style={{ color: '#5B21B6', fontWeight: 600, fontSize: '0.85rem' }}>Tentang Kami</span>
            </div>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1B4B', lineHeight: 1.2 }}>
              Setiap Anak{' '}
              <span style={{ color: '#7C3AED' }}>Istimewa</span>{' '}
              & Berhak Sukses
            </h2>

            <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.8, fontWeight: 400 }}>
              Bsmart Education Pontianak berdiri sejak 2012 dengan misi mulia: memberikan pendidikan berkualitas tinggi yang terjangkau bagi seluruh anak Pontianak. Kami percaya bahwa setiap anak memiliki potensi luar biasa yang menunggu untuk dikembangkan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ABOUT_POINTS.map((item, i) => {
                const IC = item.IconComp;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IC size={18} color={item.color} />
                    </div>
                    <span style={{ fontWeight: 500, color: '#3730A3', fontSize: '0.95rem' }}>{item.text}</span>
                  </div>
                );
              })}
            </div>

            <Link href="/ppdb" className="btn btn-primary" style={{ width: 'fit-content', padding: '14px 28px', fontSize: '1rem' }}>
              Daftar Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS SECTION ===== */}
      <section id="programs" style={{ background: '#F8F7FF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EDE9FE', borderRadius: '999px', padding: '8px 18px', marginBottom: '16px' }}>
              <BookOpen size={16} color="#7C3AED" />
              <span style={{ color: '#5B21B6', fontWeight: 600, fontSize: '0.85rem' }}>Program Unggulan</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1B4B' }}>
              Belajar dengan <span style={{ color: '#7C3AED' }}>Cara yang Efektif</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '560px', margin: '16px auto 0', fontWeight: 400, lineHeight: 1.7 }}>
              Kami menyediakan berbagai program belajar yang dirancang khusus untuk memaksimalkan potensi setiap anak.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {PROGRAMS.map((p, i) => {
              const IC = p.IconComp;
              return (
                <div key={i} className="program-card hover-lift">
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: `0 4px 16px ${p.color}22` }}>
                    <IC size={26} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '10px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65, fontWeight: 400, marginBottom: '16px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: p.color, background: p.bg, padding: '5px 14px', borderRadius: '999px' }}>{p.age}</span>
                    <ChevronRight size={18} color={p.color} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/ppdb" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Lihat Semua Program <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ background: 'linear-gradient(135deg, #2D1B69 0%, #4C1D95 40%, #5B21B6 100%)', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(251,191,36,0.1)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" style={{ display: 'block' }}>
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,0 L0,0 Z" fill="#F8F7FF" />
          </svg>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>
              Mengapa Memilih <span style={{ color: '#FBBF24' }}>Bsmart Education?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '520px', margin: '16px auto 0', fontWeight: 400, fontSize: '1rem', lineHeight: 1.7 }}>
              Kami bukan sekadar tempat bimbingan belajar. Kami adalah mitra pertumbuhan anak Anda.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {WHY_ITEMS.map((item, i) => {
              const IC = item.IconComp;
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '24px', padding: '28px', border: '1.5px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', transition: 'all 0.28s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <IC size={24} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, fontWeight: 400 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" style={{ display: 'block' }}>
            <path d="M0,30 C360,0 720,60 1080,30 C1260,15 1380,45 1440,30 L1440,60 L0,60 Z" fill="#fff" />
          </svg>
        </div>
      </section>

      {/* ===== BRANCHES SECTION ===== */}
      <section id="branches" style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EDE9FE', borderRadius: '999px', padding: '8px 18px', marginBottom: '16px' }}>
              <Building2 size={16} color="#7C3AED" />
              <span style={{ color: '#5B21B6', fontWeight: 600, fontSize: '0.85rem' }}>3 Lokasi Strategis</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1B4B' }}>
              Cabang Kami di <span style={{ color: '#7C3AED' }}>Pontianak</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {BRANCHES.map((b, i) => (
              <div key={i} className="glass-card hover-lift" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: b.color, borderRadius: '16px 16px 0 0' }} />
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Building2 size={26} color={b.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '16px' }}>{b.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <MapPin size={16} color={b.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 400, lineHeight: 1.55 }}>{b.address}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Phone size={16} color={b.color} />
                    <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 400 }}>{b.phone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Clock size={16} color={b.color} />
                    <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 400 }}>{b.hours}</span>
                  </div>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1.5px solid #F3F0FF' }}>
                  <a href={`https://wa.me/628${b.phone.replace(/\D/g, '').slice(1)}`} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', background: `${b.color}15`, color: b.color, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', border: `1.5px solid ${b.color}30`, transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = b.color; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${b.color}15`; (e.currentTarget as HTMLElement).style.color = b.color; }}
                  >
                    <Phone size={15} /> Hubungi Kami
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ background: '#F8F7FF', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', borderRadius: '999px', padding: '8px 18px', marginBottom: '16px' }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span style={{ color: '#92400E', fontWeight: 600, fontSize: '0.85rem' }}>Kata Orang Tua</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1E1B4B' }}>
              Apa Yang Mereka <span style={{ color: '#F59E0B' }}>Katakan</span> Tentang Kami?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ opacity: i === activeTestimonial ? 1 : 0.75, transform: i === activeTestimonial ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.4s ease' }}>
                <Quote size={28} color="#EDE9FE" style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '0.95rem', color: '#3730A3', lineHeight: 1.75, fontWeight: 400, marginBottom: '24px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '20px', borderTop: '1.5px solid #F3F0FF' }}>
                  {/* Initials avatar — no emoji */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E1B4B' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: 400 }}>{t.role}</div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                      {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '36px' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? '28px' : '10px', height: '10px', borderRadius: '999px', background: i === activeTestimonial ? '#7C3AED' : '#DDD6FE', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section id="contact" style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #7C3AED 100%)', borderRadius: '40px', padding: '60px 80px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '5%', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FBBF24', marginBottom: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Penerimaan Siswa Baru 2025/2026
              </div>
              <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '16px' }}>
                Bantu Anak Anda Meraih<br />
                <span style={{ color: '#FBBF24' }}>Mimpi Tertingginya</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 400, lineHeight: 1.65, maxWidth: '460px' }}>
                Daftarkan putra-putri Anda sekarang dan dapatkan konsultasi belajar gratis bersama tim pengajar kami yang berpengalaman.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 2, flexShrink: 0 }}>
              <Link href="/ppdb" className="btn btn-yellow" style={{ padding: '16px 36px', fontSize: '1.1rem', boxShadow: '0 10px 40px rgba(245,158,11,0.5)', whiteSpace: 'nowrap' }}>
                Daftar Sekarang <ArrowRight size={20} />
              </Link>
              <a href="https://wa.me/6282153789821" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1rem', justifyContent: 'center' }}>
                <Phone size={18} /> Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#1E1B4B', color: '#fff', padding: '60px 32px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '48px', marginBottom: '48px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="Bsmart" style={{ height: '44px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fff' }}>Bsmart Education</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, color: '#A78BFA', letterSpacing: '0.1em' }}>PONTIANAK</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.75, fontWeight: 400, marginBottom: '24px', maxWidth: '300px' }}>
                Mendampingi perjalanan belajar anak-anak Pontianak dengan metode inovatif dan penuh semangat sejak 2012.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { icon: <Share2 size={18} />, color: '#EC4899', href: '#', label: 'Instagram' },
                  { icon: <ThumbsUp size={18} />, color: '#3B82F6', href: '#', label: 'Facebook' },
                  { icon: <PlayCircle size={18} />, color: '#EF4444', href: '#', label: 'YouTube' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.color; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = s.color; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '20px' }}>Tautan Cepat</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[['#about', 'Tentang Kami'], ['#programs', 'Program Belajar'], ['#branches', 'Lokasi Cabang'], ['/ppdb', 'Daftar Siswa Baru'], ['/login', 'Login ERP']].map(([href, label]) => (
                  <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 400, textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A78BFA'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                  >{label}</a>
                ))}
              </div>
            </div>

            {/* Programs */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '20px' }}>Program Kami</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PROGRAMS.slice(0, 5).map(p => (
                  <span key={p.title} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 400 }}>{p.title}</span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '20px' }}>Kontak Kami</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {BRANCHES.map(b => (
                  <div key={b.name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${b.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={15} color={b.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{b.name.replace('Cabang ', '')}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>{b.phone}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={15} color="#A78BFA" />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>admin@bsmart.sch.id</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1.5px solid rgba(255,255,255,0.1)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
              &copy; 2025 Bsmart Education Pontianak. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[['/privacy', 'Kebijakan Privasi'], ['/terms', 'Syarat & Ketentuan']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#A78BFA'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
