'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 700, textDecoration: 'none', marginBottom: '28px', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Syarat & Ketentuan</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Terakhir diperbarui: 6 Agustus 2026 • Bsmart Education Pontianak</p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, color: '#475569', fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>1. Ketentuan Umum pendaftaran</h2>
            <p>
              Selamat datang di portal resmi Bsmart Education Pontianak. Dengan melakukan pendaftaran program bimbingan belajar atau mengakses sistem ERP kami, peserta didik dan orang tua/wali dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>2. Hak & Kewajiban Peserta Didik</h2>
            <ul>
              <li>Peserta didik berhak mendapatkan materi pengajaran, konsultasi belajar, Try Out IRT berkala, dan fasilitas akademik sesuai paket yang diambil.</li>
              <li>Peserta didik wajib mematuhi tata tertib bimbingan belajar, hadir tepat waktu, dan melakukan pemindaian QR Code Kehadiran saat kedatangan.</li>
              <li>Dilarang keras melakukan penyebaran materi eksklusif atau pengrusakan sarana prasana di seluruh 3 cabang Bsmart Education Pontianak.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>3. Kebijakan Pembayaran & Biaya Pendidikan</h2>
            <p>
              Pembayaran biaya bimbingan belajar dilakukan melalui kanal pembayaran resmi ERP (Transfer Bank / e-Wallet). Biaya yang telah disetorkan tidak dapat ditarik kembali (non-refundable), kecuali terdapat ketentuan khusus dalam program jaminan kelulusan yang disepakati tertulis.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>4. Hak Cipta & Kekayaan Intelektual</h2>
            <p>
              Seluruh modul, bank soal, modul CBT, dan konten digital pada platform ERP Bsmart Education Pontianak merupakan hak cipta yang dilindungi undang-undang.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>5. Hubungi Kami</h2>
            <p>
              Apabila Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami di WhatsApp Resmi: <strong>+62 821-5378-9821</strong> atau melalui sekretariat cabang utama.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
