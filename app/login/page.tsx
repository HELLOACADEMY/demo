'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Target, Mail, Lock, Eye, EyeOff, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useERP } from '@/context/ERPContext';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole, setCurrentTeacherId, setIsAuthenticated, addAuditLog } = useERP();

  const [email, setEmail] = useState('admin@bsmart.sch.id');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState('br-1');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  // Generate 5-character Captcha & Auto-fill userCaptcha for zero-friction login
  const generateCaptcha = useCallback(() => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setUserCaptcha(result);
    setCaptchaError('');
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const detectRoleFromEmail = (targetEmail: string): any => {
    const e = targetEmail.toLowerCase();
    if (e.includes('karyabaru') || e.includes('cabang')) return 'admin_cabang';
    if (e.includes('bambang') || e.includes('endang') || e.includes('kevin') || e.includes('guru') || e.includes('tutor')) return 'guru';
    if (e.includes('keuangan') || e.includes('staff')) return 'staff_keuangan';
    if (e.includes('susanti') || e.includes('wali') || e.includes('parent')) return 'wali_murid';
    if (e.includes('rizky') || e.includes('siswa') || e.includes('student')) return 'siswa';
    return 'super_admin';
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const loginEmail = email.trim() || 'admin@bsmart.sch.id';
    const role = detectRoleFromEmail(loginEmail);

    if (loginEmail.includes('endang')) setCurrentTeacherId('tch-2');
    else if (loginEmail.includes('kevin')) setCurrentTeacherId('tch-3');
    else if (loginEmail.includes('bambang') || role === 'guru') setCurrentTeacherId('tch-1');

    setIsAuthenticated(true);
    setCurrentRole(role);
    addAuditLog('User Login Success', 'Authentication', `User ${loginEmail} berhasil login sebagai ${role.toUpperCase()}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    } else {
      router.push('/dashboard');
    }
  };

  const handleQuickDemoLogin = (role: any, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    setIsAuthenticated(true);
    setCurrentRole(role);
    addAuditLog('User Quick Demo Login', 'Authentication', `Quick Demo Login sebagai ${role.toUpperCase()} (${demoEmail})`);
    
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    } else {
      router.push('/dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('User Register', 'Authentication', `Pendaftaran akun baru: ${regName} (${regEmail}) di Cabang ${regBranch}`);
    setEmail(regEmail);
    setPassword(regPassword);
    setRegSuccessMessage(`Akun untuk ${regName} berhasil dibuat! Email ${regEmail} telah diisikan ke form login.`);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegSuccessMessage('');
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
    }, 2000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('Password Reset', 'Authentication', `Reset kata sandi berhasil untuk ${forgotEmail}`);
    setEmail(forgotEmail);
    if (forgotNewPassword) setPassword(forgotNewPassword);
    setForgotSuccessMessage(`Kata sandi untuk ${forgotEmail} berhasil diperbarui! Silakan klik LOGIN.`);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccessMessage('');
      setForgotEmail('');
      setForgotNewPassword('');
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#eef4f9',
      padding: '20px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    }}>
      {/* Container Card 50/50 Split */}
      <div style={{
        width: '100%',
        maxWidth: '920px',
        minHeight: '520px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        border: '1px solid #dbe5ee',
      }}>
        {/* Left Side: Blue Overlay with Student Photo */}
        <div style={{
          position: 'relative',
          padding: '48px 36px',
          backgroundImage: `linear-gradient(135deg, rgba(29, 107, 168, 0.88), rgba(20, 80, 130, 0.92)), url('/student_login_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Bsmart Main Logo (Transparent Background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Bsmart Education Logo"
              style={{
                height: '76px',
                width: 'auto',
                margin: '0 auto 20px',
                display: 'block',
                filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))',
              }}
            />

            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: 500,
              textAlign: 'center',
              margin: '0 0 16px',
              letterSpacing: '0.01em',
            }}>
              Bsmart Education Pontianak
            </h1>

            <p style={{
              fontSize: '0.9rem',
              textAlign: 'center',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '320px',
              margin: '0 auto',
              fontWeight: 300,
            }}>
              Sistem informasi terpadu pengelolaan cabang sekolah, presensi QR, pembayaran SPP, dan ujian CBT secara otomatis.
            </p>
          </div>

          {/* Bottom Bullet Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.95)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                style={{ background: 'none', border: 'none', color: '#ffffff', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.875rem' }}
              >
                Lupa kata sandi?
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div style={{
          padding: '48px 40px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username / Email Field */}
            <div>
              <label style={{
                fontSize: '0.925rem',
                color: '#2575b9',
                marginBottom: '8px',
                display: 'block',
                fontWeight: 500,
              }}>
                Username / Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Masukkan Username / Email"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    background: '#ffffff',
                    border: '1px solid #c5d5e4',
                    borderRadius: '4px',
                    color: '#2c3e50',
                    fontSize: '0.925rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2575b9'}
                  onBlur={e => e.target.style.borderColor = '#c5d5e4'}
                />
                <Mail size={18} style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7b96b2',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                fontSize: '0.925rem',
                color: '#2575b9',
                marginBottom: '8px',
                display: 'block',
                fontWeight: 500,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    background: '#ffffff',
                    border: '1px solid #c5d5e4',
                    borderRadius: '4px',
                    color: '#2c3e50',
                    fontSize: '0.925rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2575b9'}
                  onBlur={e => e.target.style.borderColor = '#c5d5e4'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#7b96b2',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CAPTCHA Field */}
            <div>
              <label style={{
                fontSize: '0.925rem',
                color: '#2575b9',
                marginBottom: '8px',
                display: 'block',
                fontWeight: 500,
              }}>
                Kode Keamanan CAPTCHA
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                <div style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #2575b9, #1d5f9a)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '0.15em',
                  borderRadius: '4px',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                  fontStyle: 'italic',
                  flexShrink: 0,
                }}>
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  title="Acak Ulang Kode CAPTCHA"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#f1f5f9',
                    border: '1px solid #c5d5e4',
                    borderRadius: '4px',
                    color: '#2575b9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={18} />
                </button>
                <input
                  type="text"
                  value={userCaptcha}
                  onChange={e => setUserCaptcha(e.target.value)}
                  placeholder="Isi CAPTCHA"
                  maxLength={5}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    width: '100%',
                    padding: '10px 10px',
                    background: '#ffffff',
                    border: '1px solid #c5d5e4',
                    borderRadius: '4px',
                    color: '#2c3e50',
                    fontSize: '0.85rem',
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                  }}
                  onFocus={e => e.target.style.borderColor = '#2575b9'}
                  onBlur={e => e.target.style.borderColor = '#c5d5e4'}
                />
              </div>
              {captchaError && (
                <span style={{ fontSize: '0.8rem', color: '#e11d48', marginTop: '6px', display: 'block' }}>
                  {captchaError}
                </span>
              )}
            </div>

            {/* Remember Password Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#2575b9',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#2575b9',
                    cursor: 'pointer',
                  }}
                />
                Ingat kata sandi
              </label>
            </div>

            {/* Full Width Login Button */}
            <button
              type="button"
              onClick={() => handleLoginSubmit()}
              style={{
                width: '100%',
                padding: '13px',
                background: '#2575b9',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'background-color 0.2s ease',
                marginTop: '6px',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d5f9a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2575b9'}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>



      {/* Modal Lupa Kata Sandi */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(5px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <form
            onSubmit={handleForgotSubmit}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '32px',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #dbe5ee',
              boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#2575b9', margin: '0 0 6px' }}>
              Reset Kata Sandi
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0 0 20px' }}>
              Masukkan email terdaftar Anda untuk menetapkan kata sandi baru.
            </p>

            {forgotSuccessMessage ? (
              <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', color: '#166534', fontSize: '0.875rem', textAlign: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 8px', color: '#22c55e' }} />
                {forgotSuccessMessage}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                    Email Pengguna Terdaftar
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@bsmart.sch.id"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #c5d5e4', borderRadius: '4px', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#2575b9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan kata sandi baru"
                    value={forgotNewPassword}
                    onChange={e => setForgotNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #c5d5e4', borderRadius: '4px', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#475569', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1.5, padding: '10px', background: '#2575b9', border: 'none', borderRadius: '4px', color: '#ffffff', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    Simpan Kata Sandi
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
