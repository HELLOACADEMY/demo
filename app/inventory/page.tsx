'use client';

import React from 'react';
import { Boxes, Plus, Monitor, BookOpen, CheckCircle2 } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function InventoryPage() {
  const { branches } = useERP();

  const items = [
    { id: 'inv-1', name: 'Laptop Unit i7 (Lab Komputer 1)', category: 'Elektronik', qty: 35, condition: 'Baik', branchId: 'br-1' },
    { id: 'inv-2', name: 'Proyektor Epson HD 4K', category: 'Elektronik', qty: 12, condition: 'Baik', branchId: 'br-1' },
    { id: 'inv-3', name: 'Meja & Kursi Ergonomis', category: 'Mebel', qty: 450, condition: 'Baik', branchId: 'br-2' },
    { id: 'inv-4', name: 'Buku Paket Kurikulum Merdeka X', category: 'Buku Ajar', qty: 500, condition: 'Baru', branchId: 'br-3' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Boxes style={{ color: '#2575b9' }} /> Inventaris Sarana & Prasarana Cabang Pontianak
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Inventarisir asset sekolah (Komputer, Proyektor, Mebel, Buku Ajar) di 3 lokasi cabang Utama Pontianak.
          </p>
        </div>
        <button style={{ padding: '10px 18px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
          + Tambah Asset Baru
        </button>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Nama Barang / Asset</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Jumlah Unit</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Kondisi Asset</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Lokasi Cabang</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const brName = branches.find(b => b.id === item.branchId)?.name || 'Serdam Pusat';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{item.category}</span></td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{item.qty} Unit</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-success">{item.condition}</span></td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{brName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
