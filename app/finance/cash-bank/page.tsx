'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Wallet, CreditCard, Building2, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2, AlertTriangle, Check, X, ShieldCheck } from 'lucide-react';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  initialBalance: number;
  currentBalance: number;
  totalIn: number;
  totalOut: number;
  status: 'Active' | 'Inactive';
}

export interface MutationRecord {
  id: string;
  date: string;
  bankName: string;
  description: string;
  type: 'CR' | 'DB';
  amount: number;
  systemMatched: boolean;
  status: 'Matched' | 'Unmatched' | 'Pending';
}

export default function CashBankPage() {
  const { currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: 'acc-1', bankName: 'Bank BCA Utama', accountNumber: '8830192831', accountHolder: 'Bsmart Education Yayasan', initialBalance: 50000000, currentBalance: 98500000, totalIn: 62500000, totalOut: 14000000, status: 'Active' },
    { id: 'acc-2', bankName: 'Bank Mandiri Operasional', accountNumber: '1460019283', accountHolder: 'Bsmart Education Cabang', initialBalance: 25000000, currentBalance: 28400000, totalIn: 18000000, totalOut: 14600000, status: 'Active' },
    { id: 'acc-3', bankName: 'Bank BRI Penerimaan', accountNumber: '00192837192', accountHolder: 'Bsmart Education PPDB', initialBalance: 15000000, currentBalance: 24500000, totalIn: 12500000, totalOut: 3000000, status: 'Active' },
    { id: 'acc-4', bankName: 'Kasir Tunai Utama Cabang', accountNumber: 'KAS-CAB-01', accountHolder: 'Petugas Kasir Cabang', initialBalance: 5000000, currentBalance: 8200000, totalIn: 6500000, totalOut: 3300000, status: 'Active' },
  ]);

  const [mutations, setMutations] = useState<MutationRecord[]>([
    { id: 'mut-1', date: '20 Agt 2026', bankName: 'Bank BCA', description: 'TRSF SPP RIZKY PRATAMA', type: 'CR', amount: 1250000, systemMatched: true, status: 'Matched' },
    { id: 'mut-2', date: '20 Agt 2026', bankName: 'Bank Mandiri', description: 'DB PEMBELIAN MODUL UTBK', type: 'DB', amount: 9250000, systemMatched: true, status: 'Matched' },
    { id: 'mut-3', date: '19 Agt 2026', bankName: 'Bank BCA', description: 'QRIS SETTLEMENT SPP ANISA', type: 'CR', amount: 1250000, systemMatched: true, status: 'Matched' },
    { id: 'mut-4', date: '18 Agt 2026', bankName: 'Bank BRI', description: 'TRSF DEDI KURNIAWAN (UNMATCHED)', type: 'CR', amount: 850000, systemMatched: false, status: 'Unmatched' },
  ]);

  const [notice, setNotice] = useState<string | null>(null);

  const handleMatchMutation = (id: string, desc: string) => {
    setMutations(prev => prev.map(m => m.id === id ? { ...m, systemMatched: true, status: 'Matched' } : m));
    addAuditLog('Reconcile Bank Mutation', 'Finance', `Mencocokkan mutasi bank ${desc}`);
    setNotice(`Mutasi ${desc} berhasil diverifikasi & rekonsiliasi.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet style={{ color: '#0284c7' }} /> Manajemen Kas, Rekening Bank & Rekonsiliasi Mutasi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengelolaan seluruh sumber dana kas, rekening bank, mutasi terintegrasi, dan rekonsiliasi finansial.
          </p>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Grid Accounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>{acc.bankName}</span>
              <span className="badge badge-success">Aktif</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
              Rp {acc.currentBalance.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
              {acc.accountNumber} • {acc.accountHolder}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>+ Masuk: Rp {acc.totalIn.toLocaleString('id-ID')}</span>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>- Keluar: Rp {acc.totalOut.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Reconciliation Table */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} style={{ color: '#2575b9' }} /> Rekonsiliasi Mutasi Bank vs Transaksi Sistem
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
              Verifikasi dan pencocokan otomatis transaksi di sistem dengan mutasi rekening koran bank.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>Tanggal Mutasi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Bank Rekening</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Deskripsi / Keterangan Mutasi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Jenis (CR/DB)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal Mutasi</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Status Rekonsiliasi</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {mutations.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', color: '#475569' }}>{m.date}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#2575b9' }}>{m.bankName}</td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>{m.description}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: m.type === 'CR' ? '#16a34a' : '#dc2626' }}>
                    {m.type === 'CR' ? 'KREDIT (+)' : 'DEBIT (-)'}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: m.type === 'CR' ? '#16a34a' : '#dc2626' }}>
                    Rp {m.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 12px', background: m.status === 'Matched' ? '#dcfce7' : '#fee2e2', color: m.status === 'Matched' ? '#166534' : '#991b1b', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {m.status === 'Matched' ? 'MATCHED / COCOK ✅' : 'UNMATCHED ⚠️'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {m.status !== 'Matched' ? (
                      <button onClick={() => handleMatchMutation(m.id, m.description)} style={{ padding: '6px 12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
                        Verifikasi Matches
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Verified ✅</span>
                    )}
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
