'use client';

import React, { useState } from 'react';
import { Wallet, QrCode, CreditCard, Building, CheckCircle, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function PaymentGatewayPage() {
  const { invoices, payInvoice } = useERP();
  const unpaidInvoices = invoices.filter(i => i.status !== 'Lunas');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(unpaidInvoices[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instant');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedInv = invoices.find(i => i.id === selectedInvoiceId) || unpaidInvoices[0];
  const vaNumber = `8839005${selectedInv ? selectedInv.id.substring(selectedInv.id.length - 6) : '103049'}`;

  const handlePayNow = () => {
    if (!selectedInv) return;
    payInvoice(selectedInv.id, paymentMethod);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 4500);
  };

  const copyVANumber = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Page */}
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet style={{ color: '#2575b9' }} /> Payment Gateway Simulator (Midtrans / Xendit / QRIS)
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Simulasi pembayaran SPP & tagihan sekolah via QRIS Digital Instant, Virtual Account (BCA, Mandiri, BRI), & E-Wallet.
        </p>
      </div>

      {paymentSuccess && (
        <div style={{ padding: '24px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
          <CheckCircle size={48} style={{ color: '#166534', margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#166534', fontWeight: 600 }}>Pembayaran Berhasil Diverifikasi System Real-Time!</h3>
          <p style={{ fontSize: '0.85rem', color: '#15803d', margin: '4px 0 12px' }}>
            Status Invoice otomatis diperbarui menjadi <strong>LUNAS</strong> dan kuitansi pembayaran digital telah dikirimkan ke WhatsApp Wali Murid.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Payment Form & Selector */}
        <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Pilih Tagihan & Kanal Pembayaran</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 500 }}>Pilih Invoice Tagihan Siswa:</label>
            <select value={selectedInvoiceId} onChange={e => setSelectedInvoiceId(e.target.value)} className="select-field">
              {unpaidInvoices.length === 0 ? (
                <option value="">Semua tagihan saat ini sudah LUNAS</option>
              ) : (
                unpaidInvoices.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.invoiceNumber} - {i.studentName} (Rp {i.amount.toLocaleString('id-ID')})
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.8rem', color: '#2575b9', marginBottom: '10px', display: 'block', fontWeight: 500 }}>Metode Pembayaran Instant:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['QRIS Instant', 'BCA Virtual Account', 'Mandiri VA', 'Credit Card'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: paymentMethod === m ? '2px solid #2575b9' : '1px solid #cbd5e1',
                    background: paymentMethod === m ? '#eef2ff' : '#ffffff',
                    color: paymentMethod === m ? '#2575b9' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* QRIS / VA Interactive Display Container */}
          {paymentMethod === 'QRIS Instant' ? (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2575b9', marginBottom: '8px', textTransform: 'uppercase' }}>SCAN QRIS UNTUK MEMBAYAR</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`QRIS-HELLO-ACADEMY-${selectedInv?.invoiceNumber || 'INV001'}`)}`}
                alt="QRIS Code"
                style={{ width: '150px', height: '150px', borderRadius: '8px', margin: '0 auto' }}
              />
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>Bisa di-scan via BCA Mobile, Livin, GoPay, OVO, ShopeePay</div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: '#eef2ff', borderRadius: '12px', border: '1px solid #c7d2fe', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#2575b9', fontWeight: 600 }}>Nomor Virtual Account ({paymentMethod}):</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>{vaNumber}</span>
                <button
                  type="button"
                  onClick={copyVANumber}
                  style={{ padding: '6px 12px', background: '#2575b9', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Salin VA'}
                </button>
              </div>
            </div>
          )}

          <button
            style={{ width: '100%', padding: '14px', background: '#2575b9', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer' }}
            disabled={!selectedInv || unpaidInvoices.length === 0}
            onClick={handlePayNow}
          >
            Simulasi Selesaikan Pembayaran Now →
          </button>
        </div>

        {/* Selected Invoice Details & Receipt */}
        <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 600, marginBottom: '16px' }}>Rincian Invoice & Settlement</h3>
          {selectedInv ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Nomor Invoice</span>
                <strong style={{ color: '#2575b9' }}>{selectedInv.invoiceNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Nama Siswa</span>
                <strong style={{ color: '#0f172a' }}>{selectedInv.studentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Jenis Biaya</span>
                <strong style={{ color: '#0f172a' }}>{selectedInv.feeType}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Batas Jatuh Tempo</span>
                <strong style={{ color: '#d97706' }}>{selectedInv.dueDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '1.1rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Total Pembayaran:</span>
                <strong style={{ color: '#16a34a', fontSize: '1.4rem' }}>
                  Rp {selectedInv.amount.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Semua tagihan saat ini sudah lunas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
