'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar({ role, name }) {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes kds-nav-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-nav {
          animation: kds-nav-in 0.3s ease both;
        }
        .kds-signout-btn:hover {
          background: var(--sky-light) !important;
        }
        @media (max-width: 480px) {
          .kds-role-badge { display: none !important; }
          .kds-user-name  { display: none !important; }
        }
      `}</style>

      <nav className="kds-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '60px', background: 'white', zIndex: 100,
        borderBottom: '1.5px solid var(--sky-light)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        boxShadow: '0 2px 12px rgba(135,206,250,0.12)',
      }}>

        {/* Logo */}
        <div
          onClick={() => router.push(role === 'admin' ? '/admin' : '/teacher')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Image
            src="/kds-logo-tb-black-wm.png"
            alt="Kids Den School"
            width={150}
            height={36}
            style={{ objectFit: 'contain', height: 32, width: 'auto' }}
            priority
          />
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Role badge */}
          <span className="kds-role-badge" style={{
            background: 'var(--sky-light)', color: 'var(--charcoal)',
            fontSize: '0.72rem', fontWeight: 600,
            padding: '3px 10px', borderRadius: 20,
            textTransform: 'capitalize',
          }}>
            {role}
          </span>

          {/* Name */}
          {name && (
            <span className="kds-user-name" style={{
              fontSize: '0.8rem', fontWeight: 500,
              color: 'var(--charcoal-light)',
              maxWidth: 140, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </span>
          )}

          {/* Sign out */}
          <button
            className="kds-signout-btn"
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'transparent',
              border: '1.5px solid var(--sky-light)',
              borderRadius: 8, padding: '5px 12px',
              fontFamily: 'Poppins', fontSize: '0.78rem',
              fontWeight: 500, color: 'var(--charcoal)',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            Sign out
          </button>
        </div>
      </nav>
    </>
  );
}