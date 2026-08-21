'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { Target, AlertTriangle, CheckCircle2, DollarSign, Plus } from 'lucide-react';

export default function BudgetPage() {
  const { currentBranchId, branches } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const budgets = [
    { category: 'Marketing & Iklan WA', budget: 10000000, actual: 4500000, remaining: 5500000, alert: false },
    { category: 'Beban Gaji & Honor Guru', budget: 35000000, actual: 28500000, remaining: 6500000, alert: false },
    { category: 'Peralatan & Cetak Modul', budget: 10000000, actual: 9250000, remaining: 750000, alert: true }, // Alert: 92.5% used
    { category: 'Listrik & Internet WiFi', budget: 4000000, actual: 3400000, remaining: 600000, alert: true }, // Alert: 85% used
    { category: 'Maintenance & AC', budget: 3000000, actual: 1200000, remaining: 1800000, alert: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target style={{ color: '#2575b9' }} /> Manajemen Anggaran (Budget & Expense Control)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pengendalian anggaran pengeluaran bulanan/tahunan per kategori dan peringatan dini overbudget.
          </p>
        </div>
      </div>

      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Analisis Budget vs Actual — Periode Agustus 2026
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {budgets.map((b, idx) => {
            const percent = Math.round((b.actual / b.budget) * 100);
            return (
              <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {b.category}
                    {b.alert && (
                      <span style={{ fontSize: '0.725rem', padding: '2px 8px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} /> Peringatan: Pengeluaran {percent}% Dari Budget
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                    Budget: Rp {b.budget.toLocaleString('id-ID')} | Actual: <strong style={{ color: b.alert ? '#dc2626' : '#16a34a' }}>Rp {b.actual.toLocaleString('id-ID')}</strong> | Sisa: Rp {b.remaining.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: b.alert ? '#ef4444' : '#10b981', borderRadius: '10px', transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
