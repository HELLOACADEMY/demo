'use client';

import React from 'react';
import { Library, Book, Clock, AlertCircle } from 'lucide-react';

export default function LibraryPage() {
  const books = [
    { id: 'bk-1', title: 'Fisika Kuantum Modern', author: 'Dr. Stephen P.', isbn: '978-602-001', stock: 15, borrowed: 4 },
    { id: 'bk-2', title: 'Kalkulus Terapan Lanjutan', author: 'Prof. Anton B.', isbn: '978-602-002', stock: 20, borrowed: 8 },
    { id: 'bk-3', title: 'Ensiklopedia Biologi Molekuler', author: 'Jane Doe, Ph.D.', isbn: '978-602-003', stock: 10, borrowed: 2 },
  ];

  const borrowLogs = [
    { id: 'log-b1', borrower: 'Rizky Pratama', bookTitle: 'Fisika Kuantum Modern', borrowDate: '2026-08-01', dueDate: '2026-08-08', status: 'Dipinjam', fine: 0 },
    { id: 'log-b2', borrower: 'Anisa Rahmawati', bookTitle: 'Kalkulus Terapan Lanjutan', borrowDate: '2026-07-20', dueDate: '2026-07-27', status: 'Terlambat', fine: 15000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Library style={{ color: '#2575b9' }} /> Perpustakaan & Denda Peminjaman
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Katalog buku digital, transaksi peminjaman & pengembalian, serta denda keterlambatan otomatis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {books.map(b => (
          <div key={b.id} style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-primary">ISBN: {b.isbn}</span>
              <span className="badge badge-success">Stok: {b.stock - b.borrowed} Tersedia</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, margin: '8px 0 4px' }}>{b.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Penulis: {b.author}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Log Transaksi Peminjaman Buku</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Peminjam</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Judul Buku</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tanggal Pinjam</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Batas Kembali</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Denda Terlambat</th>
              </tr>
            </thead>
            <tbody>
              {borrowLogs.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{l.borrower}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{l.bookTitle}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{l.borrowDate}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{l.dueDate}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${l.status === 'Dipinjam' ? 'badge-primary' : 'badge-danger'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: l.fine > 0 ? '#dc2626' : '#64748b' }}>
                    Rp {l.fine.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
