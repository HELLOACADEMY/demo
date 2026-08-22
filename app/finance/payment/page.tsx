'use client';

import React, { useState } from 'react';
import { Wallet, QrCode, CreditCard, Building, CheckCircle, ShieldCheck, Copy, Check, Printer, X, Upload, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { useERP } from '@/context/ERPContext';

export default function PaymentGatewayPage() {
  const { invoices, payInvoice, submitPaymentProof, currentRole, branches, addAuditLog } = useERP();

  // Filter invoices: Wali Murid and Siswa ONLY see their own child's invoices!
  const targetInvoices = (currentRole === 'wali_murid' || currentRole === 'siswa')
    ? invoices.filter(i => i.studentName === 'Rizky Pratama')
    : invoices;

  const unpaidInvoices = targetInvoices.filter(i => i.status !== 'Lunas');
  const paidInvoices = targetInvoices.filter(i => i.status === 'Lunas');

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(unpaidInvoices[0]?.id || targetInvoices[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Manual BCA');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);

  // Upload Proof Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [senderName, setSenderName] = useState('Ibu Susanti');
  const [senderBank, setSenderBank] = useState('Bank BCA');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [transferNotes, setTransferNotes] = useState('');
  const [proofPreviewUrl, setProofPreviewUrl] = useState('/images/receipt-dummy.png');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const selectedInv = targetInvoices.find(i => i.id === selectedInvoiceId) || unpaidInvoices[0] || targetInvoices[0];
  const vaNumber = `8839005${selectedInv ? selectedInv.id.substring(selectedInv.id.length - 6) : '103049'}`;

  // Bank Accounts Data
  const bankAccounts = [
    { id: 'bca', bank: 'Bank BCA', accountNo: '888-019-2831', holder: 'PT Bsmart Education Pontianak', logo: '🏦' },
    { id: 'mandiri', bank: 'Bank Mandiri', accountNo: '146-00-988273-1', holder: 'PT Bsmart Education Pontianak', logo: '🏛️' },
    { id: 'bri', bank: 'Bank BRI', accountNo: '0089-01-002819-53-0', holder: 'PT Bsmart Education Pontianak', logo: '💳' },
  ];

  const activeBank = bankAccounts.find(b => paymentMethod.includes(b.bank.replace('Bank ', ''))) || bankAccounts[0];

  const handlePayInstant = () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setProofPreviewUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInv) return;

    submitPaymentProof(selectedInv.id, {
      proofUrl: proofPreviewUrl,
      senderBank,
      senderName,
      transferDate,
      notes: transferNotes
    });

    setUploadSuccessMessage(`Bukti transfer pembayaran invoice ${selectedInv.invoiceNumber} sebesar Rp ${selectedInv.amount.toLocaleString('id-ID')} berhasil diunggah dan sedang MENUNGGU ACC ADMIN!`);
    setShowUploadModal(false);
    setTimeout(() => setUploadSuccessMessage(null), 6000);
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

  const copyAccountNo = (accNo: string) => {
    navigator.clipboard.writeText(accNo.replace(/-/g, ''));
    setCopiedAccount(accNo);
    setTimeout(() => setCopiedAccount(null), 2500);
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
          <Wallet style={{ color: '#2563eb' }} /> Panel Pembayaran SPP & Transfer Manual
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
          Kanal resmi pembayaran SPP wali siswa, transfer manual bank, dan unggah bukti pembayaran untuk verifikasi/ACC admin.
        </p>
      </div>

      {uploadSuccessMessage && (
        <div style={{ padding: '20px', background: '#fef3c7', border: '1.5px solid #f59e0b', borderRadius: '14px', color: '#92400e', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.15)' }}>
          <Clock size={28} style={{ color: '#d97706', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>Bukti Pembayaran Berhasil Diunggah (Menunggu ACC Admin)</div>
            <div style={{ fontSize: '0.825rem', marginTop: '2px', opacity: 0.9 }}>{uploadSuccessMessage}</div>
          </div>
        </div>
      )}

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
            <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '6px', display: 'block', fontWeight: 700 }}>Pilih Invoice Tagihan Ananda:</label>
            <select value={selectedInvoiceId} onChange={e => setSelectedInvoiceId(e.target.value)} className="select-field">
              {unpaidInvoices.length === 0 ? (
                <option value="">Semua tagihan ananda saat ini sudah LUNAS ✅</option>
              ) : (
                unpaidInvoices.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.invoiceNumber} - {i.studentName} ({i.feeType} - Rp {i.amount.toLocaleString('id-ID')}) [{i.status}]
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.825rem', color: '#2563eb', marginBottom: '10px', display: 'block', fontWeight: 700 }}>Pilih Metode Pembayaran Wali Siswa:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                'Transfer Manual BCA',
                'Transfer Manual Mandiri',
                'Transfer Manual BRI',
                'QRIS Instant',
                'BCA Virtual Account',
                'Credit Card'
              ].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: paymentMethod === m ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: paymentMethod === m ? '#eff6ff' : '#ffffff',
                    color: paymentMethod === m ? '#1d4ed8' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{m.includes('Transfer') ? '🏦' : m.includes('QRIS') ? '📱' : '💳'}</span>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Payment Method Box */}
          {paymentMethod.startsWith('Transfer Manual') ? (
            /* TRANSFER MANUAL BANK DETAILS & UPLOAD FORM BUTTON */
            <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '14px', border: '1.5px solid #bfdbfe', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} /> REKENING RESMI TRANSFER MANUAL ({activeBank.bank.toUpperCase()})
              </div>

              <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{activeBank.bank}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', fontFamily: 'monospace' }}>{activeBank.accountNo}</span>
                  <button
                    onClick={() => copyAccountNo(activeBank.accountNo)}
                    style={{ padding: '6px 12px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '6px', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedAccount === activeBank.accountNo ? <Check size={14} /> : <Copy size={14} />}
                    {copiedAccount === activeBank.accountNo ? 'Tersalin' : 'Salin Rekening'}
                  </button>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>a.n. {activeBank.holder}</div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#1e3a8a', lineHeight: 1.5, marginBottom: '14px' }}>
                💡 <strong>Instruksi Transfer:</strong> Silakan melakukan transfer dari m-Banking / ATM Anda sejumlah <strong>Rp {selectedInv?.amount.toLocaleString('id-ID')}</strong>, kemudian klik tombol di bawah untuk mengunggah bukti transfer.
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                disabled={!selectedInv || selectedInv.status === 'Lunas' || selectedInv.status === 'Menunggu ACC Admin'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: (selectedInv?.status === 'Menunggu ACC Admin' || selectedInv?.status === 'Lunas') ? '#cbd5e1' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: (selectedInv?.status === 'Menunggu ACC Admin' || selectedInv?.status === 'Lunas') ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Upload size={18} />
                {selectedInv?.status === 'Menunggu ACC Admin'
                  ? 'Bukti Sudah Diunggah (Menunggu ACC Admin)'
                  : selectedInv?.status === 'Lunas'
                    ? 'Tagihan Sudah Lunas'
                    : '📤 Unggah Bukti Pembayaran (Minta ACC Admin)'}
              </button>
            </div>
          ) : paymentMethod === 'QRIS Instant' ? (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>SCAN QRIS RESMI BSMART EDUCATION</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/qris-dummy.png" alt="QRIS Code" style={{ width: '180px', height: '180px', margin: '0 auto 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>Dukung GoPay, OVO, ShopeePay, BCA, Mandiri, BRI, & BSI</div>
              <button
                onClick={handlePayInstant}
                disabled={!selectedInv || selectedInv.status === 'Lunas'}
                style={{ marginTop: '14px', width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
              >
                Simulasi Bayar Instant QRIS
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>NOMOR VIRTUAL ACCOUNT {paymentMethod.toUpperCase()}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>{vaNumber}</span>
                <button onClick={() => copyAccountNo(vaNumber)} style={{ padding: '6px 12px', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '6px', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {copiedAccount === vaNumber ? <Check size={14} /> : <Copy size={14} />} {copiedAccount === vaNumber ? 'Tersalin' : 'Salin VA'}
                </button>
              </div>
              <button
                onClick={handlePayInstant}
                disabled={!selectedInv || selectedInv.status === 'Lunas'}
                style={{ marginTop: '14px', width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
              >
                Simulasi Bayar Instant VA
              </button>
            </div>
          )}
        </div>

        {/* Invoice Detail Summary Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '28px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
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
                  <span style={{ fontWeight: 700, color: '#2563eb' }}>{selectedInv.feeType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Tanggal Jatuh Tempo:</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{selectedInv.dueDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Status Tagihan:</span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: selectedInv.status === 'Lunas' ? '#dcfce7' : selectedInv.status === 'Menunggu ACC Admin' ? '#fef3c7' : '#fee2e2',
                    color: selectedInv.status === 'Lunas' ? '#166534' : selectedInv.status === 'Menunggu ACC Admin' ? '#92400e' : '#991b1b'
                  }}>
                    {selectedInv.status === 'Lunas' ? 'LUNAS ✅' : selectedInv.status === 'Menunggu ACC Admin' ? '⏳ MENUNGGU ACC ADMIN' : 'BELUM BAYAR ⏳'}
                  </span>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Tagihan:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>Rp {selectedInv.amount.toLocaleString('id-ID')}</span>
                </div>

                {selectedInv.status === 'Menunggu ACC Admin' && (
                  <div style={{ padding: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', marginTop: '6px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400e', marginBottom: '6px' }}>📌 Informasi Bukti Transfer Terkirim:</div>
                    <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Pengirim: <strong>{selectedInv.senderName || 'Ibu Susanti'} ({selectedInv.senderBank || 'BCA'})</strong></div>
                    <div style={{ fontSize: '0.75rem', color: '#78350f' }}>Tgl Transfer: <strong>{selectedInv.transferDate || 'Hari ini'}</strong></div>
                    {selectedInv.paymentProofUrl && (
                      <div style={{ marginTop: '8px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedInv.paymentProofUrl} alt="Bukti Transfer" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      </div>
                    )}
                  </div>
                )}

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

      {/* MODAL UPLOAD BUKTI PEMBAYARAN TRANSFER MANUAL */}
      {showUploadModal && selectedInv && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '480px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload style={{ color: '#2563eb' }} size={20} /> Unggah Bukti Transfer Manual
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.825rem' }}>
                <div>Tagihan: <strong>{selectedInv.invoiceNumber}</strong> ({selectedInv.feeType})</div>
                <div>Total Nominal: <strong style={{ color: '#16a34a' }}>Rp {selectedInv.amount.toLocaleString('id-ID')}</strong></div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Nama Pengirim / Pemilik Rekening</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="Contoh: Ibu Susanti / Bapak Hartono"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Bank Asal Pengirim</label>
                  <select
                    value={senderBank}
                    onChange={e => setSenderBank(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="Bank Lainnya">Bank Lainnya</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Tanggal Transfer</label>
                  <input
                    type="date"
                    required
                    value={transferDate}
                    onChange={e => setTransferDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Upload Foto / File Bukti Transfer</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px dashed #2563eb', fontSize: '0.8rem', background: '#f0f7ff' }}
                />
                {proofPreviewUrl && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Preview Bukti Gambar:</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proofPreviewUrl} alt="Preview Bukti" style={{ maxHeight: '140px', maxWidth: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  placeholder="Misal: Transfer via m-BCA jam 10 pagi"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: '10px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
                >
                  🚀 Kirim Ke Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <span style={{ fontWeight: 800, color: '#2563eb' }}>{activeReceipt.studentName}</span>
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
