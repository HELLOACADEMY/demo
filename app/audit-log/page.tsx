'use client';

import React from 'react';
import { ShieldAlert, Clock, User, Activity } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function AuditLogPage() {
  const { auditLogs } = useERP();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert style={{ color: '#2575b9' }} /> Audit Log & Security Trail
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Rekam jejak seluruh aktivitas pengguna, perubahan data sensitif, dan log transaksi sistem ERP.
        </p>
      </div>

      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Waktu (Timestamp)</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Pengguna</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Peran</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tindakan / Action</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Modul ERP</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Rincian Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#2575b9' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{log.userName}</td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-primary">{log.userRole.toUpperCase()}</span></td>
                  <td style={{ padding: '12px 14px', color: '#0284c7', fontWeight: 600 }}>{log.action}</td>
                  <td style={{ padding: '12px 14px' }}><span className="badge badge-warning">{log.module}</span></td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
