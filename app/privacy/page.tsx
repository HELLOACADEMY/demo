'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Kebijakan Privasi</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Terakhir diperbarui: 6 Agustus 2026 • Hello Academy Pontianak</p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: '#475569', fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>1. Perlindungan Data Pribadi</h2>
            <p>
              Hello Academy Pontianak menghargai dan berkomitmen penuh untuk melindungi privasi data pribadi peserta didik, pengajar, dan orang tua/wali murid. Dokumen ini menjelaskan bagaimana data Anda dikumpulkan, disimpan, dan dilindungi oleh sistem ERP kami.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>2. Data yang Kami Kumpulkan</h2>
            <ul>
              <li>Informasi Identitas: Nama lengkap, NIK/NISN, tanggal lahir, foto profil, dan pasfoto siswa.</li>
              <li>Informasi Kontak: Nomor telepon/WhatsApp, alamat email, dan alamat domisili orang tua/wali.</li>
              <li>Data Akademik & Presensi: Riwayat kehadiran (QR Code scan), nilai Try Out, rapor perkembangan belajar, dan catatan guru.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>3. Penggunaan Informasi</h2>
            <p>
              Data yang dikumpulkan digunakan semata-mata untuk kepentingan operasional pendidikan, manajemen kelas, pengiriman laporan presensi ke WhatsApp wali murid, evaluasi akademik, serta layanan administrasi keuangan internal Hello Academy Pontianak.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>4. Keamanan Sistem ERP</h2>
            <p>
              Kami menerapkan protokol enkripsi standar enterprise untuk melindungi basis data ERP dari akses yang tidak sah. Data Anda tidak akan pernah dijual atau disebarluaskan kepada pihak ketiga di luar kepentingan pendidikan.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>5. Kontak Layanan Privasi</h2>
            <p>
              Jika Anda ingin melakukan pembaruan data atau memiliki pertanyaan terkait perlindungan privasi, silakan hubungi tim IT & Layanan Pelanggan kami di WhatsApp: <strong>+62 821-5378-9821</strong>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
