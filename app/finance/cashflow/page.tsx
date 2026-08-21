'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, DollarSign } from 'lucide-react';

export default function CashFlowPage() {
  const { currentBranchId, branches } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [timeframe, setTimeframe] = useState('Monthly');

  const cashIn = 184500000;
  const cashOut = 48200000;
  const netCashFlow = cashIn - cashOut;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp style={{ color: '#10b981' }} /> Analisis Pergerakan Uang (Cash Flow Stream)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pemantauan Cash In, Cash Out, dan Net Cash Flow harian, mingguan, bulanan, dan tahunan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(t => (
            <button key={t} onClick={() => setTimeframe(t)} style={{ padding: '8px 16px', background: timeframe === t ? '#2575b9' : '#ffffff', color: timeframe === t ? '#ffffff' : '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Total Cash In (Uang Masuk)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16a34a', marginTop: '6px' }}>
            + Rp {cashIn.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>Akumulasi Seluruh Penerimaan</div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Total Cash Out (Uang Keluar)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#dc2626', marginTop: '6px' }}>
            - Rp {cashOut.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700 }}>Akumulasi Beban & Pengeluaran</div>
        </div>

        <div style={{ padding: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Net Cash Flow (Bersih)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0284c7', marginTop: '6px' }}>
            Rp {netCashFlow.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, marginTop: '4px' }}>Cash In − Cash Out</div>
        </div>
      </div>
    </div>
  );
}
