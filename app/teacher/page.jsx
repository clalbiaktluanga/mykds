'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function TileSkeleton() {
  return (
    <>
      <style>{`
        @keyframes kds-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .kds-tile-skeleton {
          border-radius: 16px; height: 86px;
          background: linear-gradient(90deg,#e8f4fd 25%,#d0ecfd 50%,#e8f4fd 75%);
          background-size: 600px 100%;
          animation: kds-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="kds-tile-skeleton" />
    </>
  );
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ctView, setCtView] = useState({ enabled: false, classes: [] });

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(r => r.json())
      .then(data => { setClasses(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user?.role === 'classTeacher') {
      fetch('/api/teacher/classteacher-view')
        .then(r => r.json())
        .then(setCtView)
        .catch(() => {});
    }
  }, [session]);

  const ICONS = {
    'English':'📖', 'Mizo':'📝', 'Hindi':'📝','Mathematics':'🔢','Science':'🔬',
    'Social Science':'🌍', 'EVS':'🌍', 'IT':'💻','Moral Values':'🙏','Art':'🎨','Music':'🎵'
  };

  return (
    <>
      <style>{`
        @keyframes kds-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-tile {
          animation: kds-fade-up 0.35s ease both;
        }
        .kds-tile:nth-child(1) { animation-delay: 0.05s; }
        .kds-tile:nth-child(2) { animation-delay: 0.10s; }
        .kds-tile:nth-child(3) { animation-delay: 0.15s; }
        .kds-tile:nth-child(4) { animation-delay: 0.20s; }
        .kds-tile:nth-child(5) { animation-delay: 0.25s; }
        .kds-tile:nth-child(6) { animation-delay: 0.30s; }
      `}</style>

      <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)' }}>
            {loading
              ? 'Welcome 👋'
              : `Welcome, ${session?.user?.name ?? 'Teacher'} 👋`}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
            Your assigned classes this year
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {[1, 2, 3].map(i => <TileSkeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && classes.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '3rem 2rem',
            background: 'white', borderRadius: 16,
            border: '1.5px solid var(--sky-light)',
            animation: 'kds-fade-up 0.35s ease both',
          }}>
            <div style={{ fontSize: 40, marginBottom: '0.8rem' }}>📭</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)' }}>
              No classes assigned yet
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
              Contact your admin to get classes assigned.
            </div>
          </div>
        )}

        {/* Tiles */}
        {!loading && classes.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {classes.map(cls => (
              <div key={cls._id} className="kds-tile"
                onClick={() => router.push(`/teacher/class/${cls._id}`)}
                style={{
                  background: 'white', borderRadius: '16px', padding: '1.4rem',
                  boxShadow: '0 2px 16px rgba(135,206,250,0.18)',
                  border: '1.5px solid var(--sky-light)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  display: 'flex', alignItems: 'center', gap: '0.9rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(135,206,250,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(135,206,250,0.18)';
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: 'var(--sky-light)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24, flexShrink: 0,
                }}>
                  {ICONS[cls.subject] ?? '📚'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)' }}>
                    {cls.name} {cls.section}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
                    {cls.subject}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)', marginTop: 1 }}>
                    {cls.academicYear}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}