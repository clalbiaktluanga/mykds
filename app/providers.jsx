'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

function NavbarWrapper() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Don't show on landing or login
  if (pathname === '/' || pathname === '/login') return null;

  // Wait for session to load before deciding
  if (status === 'loading') return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: '60px', background: 'white', zIndex: 100,
      borderBottom: '1.5px solid var(--sky-light)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.25rem',
      boxShadow: '0 2px 12px rgba(135,206,250,0.12)',
    }}>
      {/* Skeleton logo placeholder */}
      <div style={{
        width: 160, height: 32, borderRadius: 8,
        background: 'linear-gradient(90deg,#e8f4fd 25%,#d0ecfd 50%,#e8f4fd 75%)',
        backgroundSize: '600px 100%',
        animation: 'kds-shimmer 1.4s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes kds-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
      `}</style>
    </div>
  );

  // Not logged in
  if (!session) return null;

  return <Navbar role={session.user?.role} name={session.user?.name} />;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <NavbarWrapper />
      <main>
        {children}
      </main>
    </SessionProvider>
  );
}