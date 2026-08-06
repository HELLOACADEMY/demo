'use client';

import React from 'react';
import { Users2, Phone, Mail, Briefcase, GraduationCap } from 'lucide-react';

export default function ParentsPage() {
  const parentsData = [
    { id: 'p-1', name: 'Ibu Susanti', phone: '08129876543', email: 'susanti@gmail.com', occupation: 'Wiraswasta', childName: 'Rizky Pratama', childGrade: 'XII SMA Kedokteran' },
    { id: 'p-2', name: 'Bapak Hartono', phone: '081311223344', email: 'hartono@yahoo.com', occupation: 'PNS', childName: 'Anisa Rahmawati', childGrade: 'XII SMA Kedokteran' },
    { id: 'p-3', name: 'Dr. Hendri S.', phone: '085677889900', email: 'hendri@klinik.com', occupation: 'Dokter Sp.A', childName: 'Bagas Aditya', childGrade: 'XI SMA' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users2 style={{ color: '#2575b9' }} /> Parent Management & Portal Wali Murid
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Data relasi orang tua / wali murid dengan siswa, kontak cepat WhatsApp, dan akses portal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {parentsData.map(p => (
          <div key={p.id} style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, margin: 0 }}>{p.name}</h3>
              <span className="badge badge-primary">Wali Murid</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} style={{ color: '#16a34a' }} /> {p.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} style={{ color: '#2575b9' }} /> {p.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={14} style={{ color: '#d97706' }} /> {p.occupation}
              </div>
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
              <GraduationCap size={16} style={{ color: '#2575b9' }} />
              <span>Anak Terhubung: <strong style={{ color: '#0f172a' }}>{p.childName}</strong> ({p.childGrade})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
