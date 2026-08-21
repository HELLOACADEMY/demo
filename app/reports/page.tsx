'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Award, Download, ShieldCheck, QrCode, Star, Sparkles, Ribbon } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function ReportsPage() {
  const { students, branches } = useERP();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-101');

  const activeStd = students.find(s => s.id === selectedStudentId) || students[0];
  const activeBranch = branches.find(b => b.id === activeStd?.branchId) || branches[0];

  const gradesData = [
    { subject: 'Matematika Terapan (UTBK Kedokteran)', score: 94.5, grade: 'A+', predicate: 'Summa Cum Laude' },
    { subject: 'Fisika Kuantum & TPS Penalaran', score: 91.0, grade: 'A+', predicate: 'Magna Cum Laude' },
    { subject: 'Kimia & Biologi Terpadu', score: 88.5, grade: 'A', predicate: 'Cum Laude' },
    { subject: 'Bahasa Inggris & English Literacy', score: 96.0, grade: 'A+', predicate: 'Summa Cum Laude' },
    { subject: 'Penalaran Matematika & Logika', score: 92.0, grade: 'A+', predicate: 'Magna Cum Laude' },
  ];

  const averageScore = (gradesData.reduce((acc, curr) => acc + curr.score, 0) / gradesData.length).toFixed(1);

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Manrope', sans-serif" }}>
      {/* CSS Rules Enforcing A4 LANDSCAPE Print Dimensions */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm !important;
            height: 209mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 8mm 12mm !important;
            border: 6px double #d97706 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Selector & Action Bar (No Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award style={{ color: '#d97706' }} /> E-Sertifikat Rapor Landscape A4
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Sertifikat hasil belajar resmi posisi Landscape (Mendatar) 1 lembar A4 dengan legalisasi stempel digital dan verifikasi QR Code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="select-field"
            style={{ width: '260px', padding: '10px 14px', borderRadius: '10px', fontWeight: 600 }}
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
            ))}
          </select>

          <button
            onClick={handlePrintPDF}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(217, 119, 6, 0.35)'
            }}
          >
            <Printer size={18} /> Cetak Landscape 1 Lembar PDF
          </button>
        </div>
      </div>

      {/* Modern A4 Landscape Certificate Container */}
      <div
        id="printable-certificate"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fffdfa 100%)',
          padding: '24px 36px',
          borderRadius: '20px',
          border: '8px double #d97706',
          boxShadow: '0 16px 40px rgba(217, 119, 6, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Decorative Gold Certificate Corner Ornaments */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderTop: '3px solid #b45309', borderLeft: '3px solid #b45309' }}></div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderTop: '3px solid #b45309', borderRight: '3px solid #b45309' }}></div>
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '28px', height: '28px', borderBottom: '3px solid #b45309', borderLeft: '3px solid #b45309' }}></div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '28px', height: '28px', borderBottom: '3px solid #b45309', borderRight: '3px solid #b45309' }}></div>

        {/* Top Header Branding Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #fde68a', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Bsmart Education Logo" style={{ height: '42px', width: 'auto' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                BSMART EDUCATION PONTIANAK
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e1b4b', margin: '1px 0' }}>
                SERTIFIKAT HASIL BELAJAR & PRESTASI AKADEMIK
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
              No. Registrasi: CERT/BSMART/2026/08/{activeStd?.nisn}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
              • Verified Official Document
            </div>
          </div>
        </div>

        {/* Certificate Recipient Section (Horizontal Landscape Banner) */}
        <div style={{ textAlign: 'center', marginBottom: '16px', padding: '12px 20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.725rem', color: '#78350f', fontWeight: 700, textTransform: 'uppercase' }}>
              DIBERIKAN SECARA RESMI KEPADA:
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e1b4b', lineHeight: 1.1 }}>
              {activeStd?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2575b9', fontWeight: 700, marginTop: '2px' }}>
              NISN: {activeStd?.nisn} • {activeStd?.grade} • {activeBranch?.name}
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: '#ffffff', borderRadius: '24px', border: '1.5px solid #f59e0b', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)' }}>
            <Star size={18} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#b45309' }}>
              Rata-Rata Nilai: {averageScore} / 100 (PREDIKAT A+ SUMMA CUM LAUDE)
            </span>
          </div>
        </div>

        {/* Grade Matrix Table (Horizontal Landscape) */}
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', fontWeight: 700, width: '40px' }}>No</th>
                <th style={{ padding: '8px 12px', fontWeight: 700 }}>Mata Pelajaran & Program Studi</th>
                <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'center', width: '110px' }}>Nilai Akhir</th>
                <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'center', width: '90px' }}>Grade</th>
                <th style={{ padding: '8px 12px', fontWeight: 700, width: '180px' }}>Predikat Kelulusan</th>
              </tr>
            </thead>
            <tbody>
              {gradesData.map((g, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '7px 12px', fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '7px 12px', fontWeight: 700, color: '#0f172a' }}>{g.subject}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'center', fontWeight: 800, color: '#2575b9', fontSize: '0.9rem' }}>{g.score}</td>
                  <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.725rem', padding: '2px 8px' }}>{g.grade}</span>
                  </td>
                  <td style={{ padding: '7px 12px', fontWeight: 700, color: '#15803d' }}>{g.predicate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verification Seals & Signatures (Landscape Footer Row) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: '16px', alignItems: 'center', textAlign: 'center', fontSize: '0.75rem', color: '#334155', paddingTop: '12px', borderTop: '1.5px dashed #fde68a' }}>
          <div>
            <div>Orang Tua / Wali Murid,</div>
            <div style={{ height: '32px' }}></div>
            <div style={{ fontWeight: 800, color: '#0f172a', borderBottom: '1.5px solid #0f172a', display: 'inline-block', paddingBottom: '1px' }}>
              ( Ibu Susanti )
            </div>
          </div>

          {/* QR Verification Emblem Center */}
          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VERIFIED-CERTIFICATE-${activeStd?.nisn}`}
              alt="QR Legalisasi"
              style={{ width: '48px', height: '48px', borderRadius: '4px' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                ✓ STEMPEL DIGITAL VERIFIED
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a' }}>
                Bsmart Education Pontianak
              </div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>
                Tercatat Resmi di Database ERP
              </div>
            </div>
          </div>

          <div>
            <div>Pontianak, 20 Agustus 2026</div>
            <div>Kepala Bsmart Education,</div>
            <div style={{ height: '24px' }}></div>
            <div style={{ fontWeight: 800, color: '#0f172a', borderBottom: '1.5px solid #0f172a', display: 'inline-block', paddingBottom: '1px' }}>
              ( {activeBranch?.pic || 'Admin Cabang'} )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
