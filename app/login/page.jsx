'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Spinner from '@/components/Spinner';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid username or password');
      setLoading(false);
      return;
    }

    setSuccess(true);
    const session = await fetch('/api/auth/session').then(r => r.json());
    const role = session?.user?.role;

    setTimeout(() => {
      if (role === 'admin') router.push('/admin');
      else if (role === 'teacher') router.push('/teacher');
      else { setError('Unknown role. Contact admin.'); setLoading(false); setSuccess(false); }
    }, 600);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <>
      <style>{`
        @keyframes kds-login-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes kds-success-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .login-card {
          animation: kds-login-in 0.45s cubic-bezier(.22,1,.36,1) both;
        }
        .kds-input:focus {
          border-color: var(--sky, #87cefa) !important;
          box-shadow: 0 0 0 3px rgba(135,206,250,0.15);
        }
        .kds-success-icon {
          animation: kds-success-pop 0.4s cubic-bezier(.22,1,.36,1) both;
        }
        .kds-support-link {
          color: var(--sky-dark, #5bb8f5);
          text-decoration: none;
          font-weight: 600;
        }
        .kds-support-link:hover { text-decoration: underline; }
        @keyframes kds-progress {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div className="no-navbar-padding" style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg, #f7fbff)',
        padding: '1rem',
      }}>
        <div className="login-card" style={{
          background: 'white', borderRadius: 20,
          padding: '2.5rem', width: '100%', maxWidth: 380,
          boxShadow: '0 4px 40px rgba(135,206,250,0.2)',
          border: '1.5px solid var(--sky-light)',
        }}>

          {/* Logo / success state */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {success ? (
              <>
                <div className="kds-success-icon" style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: '#e6f9ee', margin: '0 auto 1rem',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 30,
                }}>✅</div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                  Welcome back!
                </h1>
                <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
                  Redirecting to your portal…
                </p>
              </>
            ) : (
              <>
                {/* School logo image */}
                <div style={{
                  margin: '0 auto 1rem',
                  width: 180, height: 60,
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image
                    src="/mykds-logo-tb.png"
                    alt="myKDS"
                    width={180}
                    height={60}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    priority
                  />
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
                  Teachers Academic Portal
                </p>
              </>
            )}
          </div>

          {/* Redirect loading bar */}
          {success && (
            <div style={{
              height: 4, borderRadius: 2,
              background: 'var(--sky-light)',
              overflow: 'hidden', marginBottom: '1.5rem',
            }}>
              <div style={{
                height: '100%', width: '100%',
                background: 'var(--sky)',
                animation: 'kds-progress 0.6s ease forwards',
              }} />
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--charcoal)', display: 'block', marginBottom: 6,
                }}>Username</label>
                <input
                  className="kds-input"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{
                  fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--charcoal)', display: 'block', marginBottom: 6,
                }}>Password</label>
                <input
                  className="kds-input"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)' }}>
                  {'Need help? '}
                  <a href="https://link.kidsdenschool.in/u1T4boZT" target="_blank" rel="noopener noreferrer" className="kds-support-link">Contact support</a>
                </span>
              </div>

              {error && (
                <div style={{
                  color: '#c0392b', fontSize: '0.8rem',
                  background: '#fff5f5', padding: '8px 12px',
                  borderRadius: 8, marginBottom: '1rem',
                  border: '1px solid #fde2e2',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '0.85rem',
                background: loading ? 'var(--sky-light)' : 'var(--sky)',
                color: 'var(--charcoal)', border: 'none', borderRadius: 12,
                fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}>
                {loading ? (
                  <>
                    <Spinner size={18} color="#5bb8f5" />
                    Signing in…
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          )}

        </div>
      </div>
    </>
  );
}