'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(r => r.json())
      .then(data => {
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const ICONS = {
    'English': '📖',
    'Mizo': '📝',
    'Hindi': '📝',
    'Mathematics': '🔢',
    'Science': '🔬',
    'Physics': '🔬',
    'Chemistry': '🔬',
    'Biology': '🔬',
    'Social Science': '🌍',
    'EVS': '🌍',
    'Information Technology': '💻',
    'Moral Education': '⚽',
    'Art': '🎨',
    'Music': '🎵',
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)' }}>
          Hello, {session?.user?.name ?? 'Teacher'} 👋
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
          Your assigned classes this year
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 76, borderRadius: 16, background: 'var(--sky-light)',
              opacity: 0.5, animation: 'pulse 1.5s infinite',
            }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && classes.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '3rem 2rem',
          background: 'white', borderRadius: 16,
          border: '1.5px solid var(--sky-light)',
        }}>
          <div style={{ fontSize: 40, marginBottom: '0.8rem' }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)' }}>
            No classes assigned yet
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
            Contact your admin to get classes assigned to your account.
          </div>
        </div>
      )}

      {/* Class Tiles */}
      {!loading && classes.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}>
          {classes.map(cls => (
            <div
              key={cls._id}
              onClick={() => router.push(`/teacher/class/${cls._id}`)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.4rem',
                boxShadow: '0 2px 16px rgba(135,206,250,0.18)',
                border: '1.5px solid var(--sky-light)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
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
                justifyContent: 'center', fontSize: 24,
                flexShrink: 0,
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
  );
}