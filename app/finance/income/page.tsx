'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/ERPContext';
import { TrendingUp, Plus, Filter, Download, FileText, CheckCircle2, Edit, Trash2, X, Eye, Upload, DollarSign } from 'lucide-react';

export interface IncomeRecord {
  id: string;
  txNumber: string;
  date: string;
  source: string;
  category: 'Pembayaran Bimbel' | 'Pendaftaran' | 'Paket Belajar' | 'Cicilan' | 'Pendapatan Lainnya';
  amount: number;
  paymentMethod: string;
  notes: string;
  receiptUrl?: string;
  status: 'Verifikasi' | 'Pending';
}

export default function IncomePage() {
  const { currentBranchId, branches, addAuditLog } = useERP();
  const activeBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const [incomes, setIncomes] = useState<IncomeRecord[]>([
    { id: 'inc-1', txNumber: 'INC-2026-08-001', date: '20 Agt 2026', source: 'Ibu Susanti (Wali Rizky)', category: 'Pembayaran Bimbel', amount: 1250000, paymentMethod: 'Transfer Bank BCA', notes: 'SPP Bulan Agustus 2026', receiptUrl: '/images/receipt-dummy.png', status: 'Verifikasi' },
    { id: 'inc-2', txNumber: 'INC-2026-08-002', date: '20 Agt 2026', source: 'Bapak Hendra (Wali Nadia)', category: 'Pendaftaran', amount: 2500000, paymentMethod: 'Transfer Bank BRI', notes: 'Uang Pangkal PPDB Calon Siswa', receiptUrl: '/images/receipt-dummy.png', status: 'Verifikasi' },
    { id: 'inc-3', txNumber: 'INC-2026-08-003', date: '19 Agt 2026', source: 'Bapak Hartono (Wali Anisa)', category: 'Paket Belajar', amount: 3500000, paymentMethod: 'QRIS Instant', notes: 'Paket Garansi Kedokteran SNBT', receiptUrl: '/images/receipt-dummy.png', status: 'Verifikasi' },
    { id: 'inc-4', txNumber: 'INC-2026-08-004', date: '18 Agt 2026', source: 'Siswa Privat UTBK', category: 'Cicilan', amount: 1500000, paymentMethod: 'Kasir Tunai Cabang', notes: 'Cicilan ke-2 Biaya Bimbingan', receiptUrl: '/images/receipt-dummy.png', status: 'Verifikasi' },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingInc, setEditingInc] = useState<IncomeRecord | null>(null);

  // Form State
  const [txNumber, setTxNumber] = useState('');
  const [date, setDate] = useState('20 Agt 2026');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState<'Pembayaran Bimbel' | 'Pendaftaran' | 'Paket Belajar' | 'Cicilan' | 'Pendapatan Lainnya'>('Pembayaran Bimbel');
  const [amount, setAmount] = useState(1250000);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [notes, setNotes] = useState('');

  const [notice, setNotice] = useState<string | null>(null);

  const filteredIncomes = incomes.filter(inc => {
    if (filterCategory !== 'ALL' && inc.category !== filterCategory) return false;
    return true;
  });

  const totalIncomeAmount = filteredIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  const handleOpenAddModal = () => {
    setEditingInc(null);
    setTxNumber(`INC-2026-08-${Math.floor(100 + Math.random() * 900)}`);
    setDate('20 Agt 2026');
    setSource('');
    setCategory('Pembayaran Bimbel');
    setAmount(1250000);
    setPaymentMethod('Transfer Bank BCA');
    setNotes('');
    setShowModal(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount) return;

    if (editingInc) {
      setIncomes(prev => prev.map(i => i.id === editingInc.id ? {
        ...i,
        txNumber,
        date,
        source,
        category,
        amount: Number(amount),
        paymentMethod,
        notes
      } : i));
      addAuditLog('Update Income Record', 'Finance', `Memperbarui transaksi pemasukan ${txNumber} (${source})`);
      setNotice(`Pemasukan ${txNumber} berhasil diperbarui.`);
    } else {
      const newInc: IncomeRecord = {
        id: `inc-${Date.now()}`,
        txNumber,
        date,
        source,
        category,
        amount: Number(amount),
        paymentMethod,
        notes,
        status: 'Verifikasi'
      };
      setIncomes(prev => [newInc, ...prev]);
      addAuditLog('Create Income Record', 'Finance', `Menambah pemasukan baru ${txNumber} - Rp ${Number(amount).toLocaleString('id-ID')} (${source})`);
      setNotice(`Pemasukan baru ${txNumber} berhasil dicatat.`);
    }

    setShowModal(false);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDelete = (id: string, tx: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus catatan pemasukan ${tx}?`)) {
      setIncomes(prev => prev.filter(i => i.id !== id));
      addAuditLog('Delete Income Record', 'Finance', `Menghapus catatan pemasukan ${tx}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp style={{ color: '#10b981' }} /> Manajemen Pemasukan (Income Stream)
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
            Pencatatan dan pengelolaan seluruh transaksi uang masuk bimbel, pendaftaran, dan paket belajar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={handleOpenAddModal} style={{ padding: '10px 18px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
            <Plus size={16} /> Catat Pemasukan Baru
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} /> {notice}
        </div>
      )}

      {/* Filter & Summary Banner */}
      <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={18} style={{ color: '#2575b9' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Filter Kategori Pemasukan:</span>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="select-field" style={{ width: '220px' }}>
            <option value="ALL">Semua Kategori (All)</option>
            <option value="Pembayaran Bimbel">Pembayaran Bimbel SPP</option>
            <option value="Pendaftaran">Pendaftaran PPDB</option>
            <option value="Paket Belajar">Paket Belajar Intensif</option>
            <option value="Cicilan">Cicilan Bimbingan</option>
            <option value="Pendapatan Lainnya">Pendapatan Lainnya</option>
          </select>
        </div>

        <div style={{ background: '#ecfdf5', padding: '10px 18px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
          <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>Total Pemasukan Tercatat:</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534' }}>
            Rp {totalIncomeAmount.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Main Income Table */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>No. Transaksi & Tanggal</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Sumber Dana / Dari</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Kategori Pemasukan</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Nominal (Rp)</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Metode Pembayaran</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Keterangan</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 800, color: '#10b981' }}>{inc.txNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inc.date}</div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>
                    {inc.source}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 800, fontSize: '0.775rem' }}>
                      {inc.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#16a34a', fontSize: '1rem' }}>
                    + Rp {inc.amount.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px', color: '#2575b9', fontWeight: 700 }}>
                    {inc.paymentMethod}
                  </td>
                  <td style={{ padding: '14px', color: '#475569' }}>
                    {inc.notes}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => { setEditingInc(inc); setShowModal(true); setTxNumber(inc.txNumber); setSource(inc.source); setAmount(inc.amount); setNotes(inc.notes); }} style={{ padding: '6px 10px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(inc.id, inc.txNumber)} style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Income */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleSaveIncome} style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingInc ? 'Edit Transaksi Pemasukan' : 'Catat Pemasukan Baru'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Sumber Dana / Nama Pembayar *</label>
                <input type="text" placeholder="Contoh: Ibu Susanti (Wali Rizky)" value={source} onChange={e => setSource(e.target.value)} required className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Kategori Pemasukan *</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="select-field">
                    <option value="Pembayaran Bimbel">Pembayaran Bimbel SPP</option>
                    <option value="Pendaftaran">Pendaftaran PPDB</option>
                    <option value="Paket Belajar">Paket Belajar Intensif</option>
                    <option value="Cicilan">Cicilan Bimbingan</option>
                    <option value="Pendapatan Lainnya">Pendapatan Lainnya</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Nominal Pemasukan (Rp) *</label>
                  <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Metode Pembayaran *</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="select-field">
                    <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                    <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="QRIS Instant">QRIS Instant</option>
                    <option value="Kasir Tunai Cabang">Kasir Tunai Cabang</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tanggal Transaksi</label>
                  <input type="text" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Keterangan / Catatan</label>
                <input type="text" placeholder="Keterangan transaksi" value={notes} onChange={e => setNotes(e.target.value)} className="input-field" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Batal</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                Simpan Transaksi Pemasukan
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
