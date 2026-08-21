'use client';

import React, { useState } from 'react';
import { Wallet, QrCode, CreditCard, Building, CheckCircle, ShieldCheck, Copy, Check, ArrowRight, Printer, FileText, Download, Share2, X } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function PaymentGatewayPage() {
  const { invoices, payInvoice, currentRole, branches, addAuditLog } = useERP();

  // Filter invoices: Wali Murid and Siswa ONLY see their own child's invoices!
  const targetInvoices = (currentRole === 'wali_murid' || currentRole === 'siswa')
    ? invoices.filter(i => i.studentName === 'Rizky Pratama')
    : invoices;

  const unpaidInvoices = targetInvoices.filter(i => i.status !== 'Lunas');
  const paidInvoices = targetInvoices.filter(i => i.status === 'Lunas');

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(unpaidInvoices[0]?.id || targetInvoices[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('QRIS Instant');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  const selectedInv = targetInvoices.find(i => i.id === selectedInvoiceId) || unpaidInvoices[0] || targetInvoices[0];
  const vaNumber = `8839005${selectedInv ? selectedInv.id.substring(selectedInv.id.length - 6) : '103049'}`;

  const handlePayNow = () => {
    if (!selectedInv) return;
    payInvoice(selectedInv.id, paymentMethod);

    const receiptObj = {
      receiptNo: `KWT/2026/08/${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: selectedInv.invoiceNumber,
      studentName: selectedInv.studentName,
      parentName: 'Ibu Susanti',
      branchName: branches.find(b => b.id === selectedInv.branchId)?.name || 'Cabang Sungai Raya Dalam (Pusat)',
      feeType: selectedInv.feeType,
      amount: selectedInv.amount,
      dueDate: selectedInv.dueDate,
      paymentMethod,
      paidAt: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setActiveReceipt(receiptObj);
    setPaymentSuccess(true);
    setShowReceiptModal(true);

    addAuditLog('Payment Invoice Completed', 'Finance', `Pembayaran invoice ${selectedInv.invoiceNumber} (Rp ${selectedInv.amount.toLocaleString('id-ID')}) lunas via ${paymentMethod}`);
  };

  const handleOpenReceiptForInvoice = (inv: any) => {
    setActiveReceipt({
      receiptNo: `KWT/2026/08/${inv.id.replace(/\D/g, '').slice(-4) || '1088'}`,
      invoiceNo: inv.invoiceNumber,
      studentName: inv.studentName,
      parentName: 'Ibu Susanti',
      branchName: branches.find(b => b.id === inv.branchId)?.name || 'Cabang Sungai Raya Dalam (Pusat)',
      feeType: inv.feeType,
      amount: inv.amount,
      dueDate: inv.dueDate,
      paymentMethod: inv.paymentMethod || 'QRIS Instant',
      paidAt: inv.paidAt || '20 Agustus 2026, 22:15 WIB'
    });
    setShowReceiptModal(true);
  };

  const copyVANumber = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Printable Area CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-modal, #printable-invoice-modal * {
            visibility: visible;
          }
          #printable-invoice-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Page */}
      <div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet style={{ color: '#2575b9' }} /> Payment
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Kanal pembayaran SPP & tagihan sekolah ananda.
        </p>
      </div>

      {paymentSuccess && (
        <div style={{ padding: '24px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
          <CheckCircle size={48} style={{ color: '#166534', margin: '0 auto 8px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#166534', fontWeight: 800 }}>Pembayaran Berhasil Diverifikasi System Real-Time!</h3>
          <p style={{ fontSize: '0.85rem', color: '#15803d', margin: '4px 0 12px' }}>
            Status Invoice otomatis diperbarui menjadi <strong>LUNAS</strong> dan Kuitansi Bukti Pembayaran Digital SPP telah terbit resmi.
          </p>
          <button
            onClick={() => setShowReceiptModal(true)}
            style={{ padding: '10px 20px', background: '#166534', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} /> Lihat & Cetak Kuitansi Invoice Digital
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Payment Form & Selector */}
        <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px' }}>Pilih Tagihan & Kanal Pembayaran</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.825rem', color: '#2575b9', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Pilih Invoice Tagihan Ananda:</label>
            <select value={selectedInvoiceId} onChange={e => setSelectedInvoiceId(e.target.value)} className="select-field">
              {unpaidInvoices.length === 0 ? (
                <option value="">Semua tagihan ananda saat ini sudah LUNAS ✅</option>
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
            <label style={{ fontSize: '0.825rem', color: '#2575b9', marginBottom: '10px', display: 'block', fontWeight: 700 }}>Metode Pembayaran Instant:</label>
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
                    fontWeight: 700,
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
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>SCAN QRIS RESMI BSMART EDUCATION</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/qris-dummy.png" alt="QRIS Code" style={{ width: '180px', height: '180px', margin: '0 auto 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>Dukung GoPay, OVO, ShopeePay, BCA, Mandiri, BRI, & BSI</div>
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>NOMOR VIRTUAL ACCOUNT {paymentMethod.toUpperCase()}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2575b9', fontFamily: 'monospace' }}>{vaNumber}</span>
                <button onClick={copyVANumber} style={{ padding: '6px 12px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '6px', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Salin VA'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handlePayNow}
            disabled={!selectedInv || selectedInv.status === 'Lunas'}
            style={{
              width: '100%',
              padding: '14px',
              background: (!selectedInv || selectedInv.status === 'Lunas') ? '#cbd5e1' : '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: (!selectedInv || selectedInv.status === 'Lunas') ? 'not-allowed' : 'pointer',
              boxShadow: (!selectedInv || selectedInv.status === 'Lunas') ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {selectedInv?.status === 'Lunas' ? 'Tagihan Ini Sudah Lunas ✅' : 'Bayar'}
          </button>
        </div>

        {/* Invoice Detail Summary Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck style={{ color: '#10b981' }} /> Rincian Tagihan Resmi
            </h3>

            {selectedInv ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Nomor Invoice:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedInv.invoiceNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Nama Siswa / Murid:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedInv.studentName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Jenis Biaya:</span>
                  <span style={{ fontWeight: 700, color: '#2575b9' }}>{selectedInv.feeType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Tanggal Jatuh Tempo:</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{selectedInv.dueDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status Tagihan:</span>
                  <span className={`badge ${selectedInv.status === 'Lunas' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedInv.status === 'Lunas' ? 'LUNAS ✅' : 'BELUM BAYAR ⏳'}
                  </span>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Tagihan:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>Rp {selectedInv.amount.toLocaleString('id-ID')}</span>
                </div>

                {selectedInv.status === 'Lunas' && (
                  <button
                    onClick={() => handleOpenReceiptForInvoice(selectedInv)}
                    style={{ padding: '10px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#166534', borderRadius: '8px', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}
                  >
                    <Printer size={16} /> Lihat Kuitansi Invoice Lunas PDF
                  </button>
                )}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Tidak ada tagihan yang dipilih.</div>
            )}
          </div>

          {/* Paid Invoices Receipt History List */}
          {paidInvoices.length > 0 && (
            <div style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} style={{ color: '#16a34a' }} /> Riwayat Kuitansi Lunas ({paidInvoices.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paidInvoices.map(inv => (
                  <div key={inv.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a' }}>{inv.invoiceNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inv.feeType} • Rp {inv.amount.toLocaleString('id-ID')}</div>
                    </div>
                    <button
                      onClick={() => handleOpenReceiptForInvoice(inv)}
                      style={{ padding: '6px 12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Printer size={12} /> Kuitansi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OFFICIAL DIGITAL INVOICE RECEIPT MODAL */}
      {showReceiptModal && activeReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div id="printable-invoice-modal" style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            {/* Modal Header Actions (Hide on Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer style={{ color: '#10b981' }} /> Kuitansi Resmi Bukti Pembayaran Digital
              </div>
              <button onClick={() => setShowReceiptModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            {/* Official Receipt Content */}
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
              {/* Institution Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.png" alt="Bsmart Education Logo" style={{ height: '38px', width: 'auto', marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>BSMART EDUCATION PONTIANAK</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{activeReceipt.branchName}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block', padding: '6px 14px', background: '#dcfce7', border: '1.5px solid #86efac', borderRadius: '8px', color: '#166534', fontWeight: 900, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                    PAID / LUNAS ✅
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>No. Kuitansi: <strong>{activeReceipt.receiptNo}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No. Invoice: <strong>{activeReceipt.invoiceNo}</strong></div>
                </div>
              </div>

              {/* Transaction Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Telah Diterima Dari:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{activeReceipt.parentName} (Wali {activeReceipt.studentName})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Nama Siswa / Murid:</span>
                  <span style={{ fontWeight: 800, color: '#2575b9' }}>{activeReceipt.studentName}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Rincian Pembayaran:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{activeReceipt.feeType}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Kanal Pembayaran:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>{activeReceipt.paymentMethod}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Waktu Verifikasi Sistem:</span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{activeReceipt.paidAt}</span>
                </div>

                {/* Total Paid Box */}
                <div style={{ padding: '16px', background: '#10b981', borderRadius: '12px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>JUMLAH PEMBAYARAN LUNAS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>Rp {activeReceipt.amount.toLocaleString('id-ID')}</div>
                  </div>
                  <CheckCircle size={32} />
                </div>
              </div>

              {/* Watermark Verification Stamp */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', textAlign: 'center', fontSize: '0.725rem', color: '#64748b' }}>
                🟢 Kuitansi ini diterbitkan secara resmi oleh Sistem ERP Bsmart Education dan sah sebagai bukti pembayaran sah tanpa tanda tangan basah.
              </div>
            </div>

            {/* Bottom Modal Actions (Hide on Print) */}
            <div className="no-print" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => window.print()}
                style={{ flex: 1, padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Printer size={16} /> Cetak Kuitansi / Download PDF
              </button>

              <button
                onClick={() => setShowReceiptModal(false)}
                style={{ padding: '12px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
