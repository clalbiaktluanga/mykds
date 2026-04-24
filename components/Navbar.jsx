'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

function ProfileDrawer({ onClose, role, name, username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const drawerRef = useRef(null);

  useEffect(() => {
    fetch('/api/auth/login-history')
      .then(r => r.json())
      .then(d => { setHistory(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const fmt = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  return (
    <div ref={drawerRef} style={{
      position: 'fixed', top: 66, right: 12, width: 320,
      background: 'white', borderRadius: 16, zIndex: 200,
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      border: '1.5px solid var(--sky-light)',
      maxHeight: '75vh', display: 'flex', flexDirection: 'column',
      animation: 'kds-fade-up 0.2s ease both',
    }}>
      <div style={{ padding: '1rem 1.2rem 0.8rem', borderBottom: '1.5px solid var(--sky-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{name || 'User'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal-light)' }}>@{username}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal)', textTransform: 'capitalize', background: 'var(--sky-light)', padding: '2px 8px', borderRadius: 12, display: 'inline-block' }}>{role}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--charcoal-light)', padding: 0, alignSelf: 'flex-start' }}>✕</button>
        </div>

        <a href="https://link.kidsdenschool.in/u1T4boZT" style={{ display: 'block', width: '100%', padding: '0.6rem', borderRadius: 8, background: '#f0fbff', border: '1.5px solid var(--sky)', color: 'var(--sky)', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
          Contact Support
        </a>
      </div>

      <div style={{ padding: '1rem 1.2rem 0.2rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--charcoal-light)' }}>
        Login History
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '0.4rem 0 0.6rem' }}>
        {loading && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--charcoal-light)', fontSize: '0.82rem' }}>Loading...</div>}
        {!loading && history.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--charcoal-light)', fontSize: '0.82rem' }}>No login history yet.</div>}
        {!loading && history.map((entry, i) => (
          <div key={entry._id || i} style={{ padding: '0.7rem 1.2rem', borderBottom: '1px solid #f0f4ff', display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: i === 0 ? '#1a8a3c' : 'var(--sky-light)', marginTop: 5 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--charcoal)' }}>{fmt(entry.loginAt)}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)', marginTop: 2, display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {i === 0 && <span style={{ background: '#e6f9ee', color: '#1a8a3c', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>Current</span>}
                <span style={{ background: entry.changesCount > 0 ? '#fff8e1' : '#f5f5f5', color: entry.changesCount > 0 ? '#c67c00' : '#999', padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>
                  {entry.changesCount > 0 ? `${entry.changesCount} edit${entry.changesCount !== 1 ? 's' : ''}` : 'No edits'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.8rem 1.2rem', borderTop: '1.5px solid var(--sky-light)' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', padding: '0.6rem', borderRadius: 10, background: '#fff5f5', border: '1.5px solid #fde2e2', color: '#c0392b', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Navbar({ role, name, username }) {
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const salutations = ['sir', 'miss', 'ma\'am', 'maam', 'mr', 'mrs', 'ms', 'dr', 'prof'];
    const words = fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';

    const isSalutation = salutations.includes(words[0].toLowerCase().replace(/\.$/, ''));
    let targetWords = words;

    if (isSalutation && words.length > 2) {
      targetWords = words.slice(1);
    }

    return targetWords.map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(name);

  return (
    <>
      <style>{`
        @keyframes kds-nav-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kds-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-nav { animation: kds-nav-in 0.3s ease both; }
        .kds-signout-btn:hover { background: var(--sky-light) !important; }
        .kds-avatar:hover { opacity: 0.85; }
        @media (max-width: 480px) {
          .kds-role-badge { display: none !important; }
          .kds-user-name  { display: none !important; }
          .kds-nav-logo img { height: 24px !important; }
        }
      `}</style>

      <nav className="kds-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '60px', background: 'white', zIndex: 100,
        borderBottom: '1.5px solid var(--sky-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem',
        boxShadow: '0 2px 12px rgba(66,133,244,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="kds-nav-logo" onClick={() => router.push(role === 'admin' ? '/admin' : '/teacher')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Image src="/kds-logo-tb-black-wm.png" alt="Kids Den School" width={150} height={36} style={{ objectFit: 'contain', height: 28, width: 'auto' }} priority />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="kds-role-badge" style={{ background: 'var(--sky-light)', color: 'var(--charcoal)', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize' }}>{role}</span>
          {name && <span className="kds-user-name" style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--charcoal-light)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>}

          {/* Profile avatar */}
          <button className="kds-avatar" onClick={() => setShowDrawer(p => !p)} title="View profile and login history" style={{ width: 36, height: 36, borderRadius: '50%', background: showDrawer ? '#e6c700' : '#FFDD00', border: `2px solid ${showDrawer ? '#e6c700' : '#FFDD00'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--charcoal)', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
            {initials}
          </button>

          <button className="kds-signout-btn" onClick={() => signOut({ callbackUrl: '/login' })} style={{ background: 'transparent', border: '1.5px solid var(--sky-light)', borderRadius: 8, padding: '5px 12px', fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 500, color: 'var(--charcoal)', cursor: 'pointer', transition: 'background 0.15s' }}>
            Sign out
          </button>
        </div>
      </nav>

      {showDrawer && <ProfileDrawer onClose={() => setShowDrawer(false)} role={role} name={name} username={username} />}
    </>
  );
}