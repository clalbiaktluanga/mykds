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
  const [ctData, setCtData] = useState(null);
  const [ctLoading, setCtLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(r => r.json())
      .then(data => { setClasses(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/teacher/classteacher-view')
      .then(r => r.json())
      .then(data => { setCtData(data); setCtLoading(false); })
      .catch(() => setCtLoading(false));
  }, []);

  const ICONS = {
    'English': '📖', 'Mizo': '📝', 'Hindi': '📝', 'Mathematics': '🔢', 'Science': '🔬',
    'Social Science': '🌍', 'EVS': '🌍', 'IT': '💻', 'Moral Values': '🙏', 'Art': '🎨', 'Music': '🎵'
  };

  const ctEnabled = ctData?.enabled && ctData?.assigned;

  const ClassTile = ({ cls, onClick }) => (
    <div
      onClick={onClick}
      className="kds-tile"
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
  );

  return (
    <>
      <style>{`
        @keyframes kds-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-tile { animation: kds-fade-up 0.35s ease both; }
        .kds-tile:nth-child(1) { animation-delay: 0.05s; }
        .kds-tile:nth-child(2) { animation-delay: 0.10s; }
        .kds-tile:nth-child(3) { animation-delay: 0.15s; }
        .kds-tile:nth-child(4) { animation-delay: 0.20s; }
        .kds-tile:nth-child(5) { animation-delay: 0.25s; }
        .kds-tile:nth-child(6) { animation-delay: 0.30s; }
      `}</style>

      <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)' }}>
            {loading ? 'Welcome ' : `Welcome, ${session?.user?.name ?? 'Teacher'}`}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
            Your assigned classes this year
          </p>
        </div>

        {/* ── SECTION 1: Class Teacher Permission ── */}
        {!ctLoading && ctEnabled && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
              <div style={{
                background: '#e6f9ee', borderRadius: 10,
                padding: '0.5rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a8a3c' }}>
                    Class Teacher - {ctData.classTeacherClass}, Section {ctData.classTeacherSection}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#2ecc71', marginTop: 1 }}>
                    View all subjects · Read-only
                  </div>
                </div>
              </div>
            </div>

            {ctData.classes?.length === 0 ? (
              <div style={{
                padding: '1.5rem', textAlign: 'center',
                background: 'white', borderRadius: 16,
                border: '1.5px solid var(--sky-light)',
                color: 'var(--charcoal-light)', fontSize: '0.88rem',
              }}>
                No subject classes set up yet for {ctData.classTeacherClass} – {ctData.classTeacherSection}.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.9rem' }}>
                <div
                  onClick={() => router.push(`/teacher/class-overview?class=${encodeURIComponent(ctData.classTeacherClass)}&section=${encodeURIComponent(ctData.classTeacherSection)}`)}
                  className="kds-tile"
                  style={{
                    background: 'linear-gradient(135deg, #e8f9f0, #c8eedb)', borderRadius: '16px', padding: '1.4rem',
                    boxShadow: '0 2px 16px rgba(46, 204, 113, 0.18)',
                    border: '1.5px solid #a3e4c4',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    display: 'flex', alignItems: 'center', gap: '0.9rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(46, 204, 113, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(46, 204, 113, 0.18)';
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: '#ffffff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 24, flexShrink: 0,
                  }}>
                    🏫
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a8a3c' }}>
                      View Class Overview
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#27ae60', marginTop: 2 }}>
                      {ctData.classTeacherClass} — Section {ctData.classTeacherSection}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 2: My Subject Classes ── */}
        <div>
          {ctEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--charcoal)' }}>
                My Subject Classes
              </div>
            </div>
          )}

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3].map(i => <TileSkeleton key={i} />)}
            </div>
          )}

          {!loading && classes.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem 2rem',
              background: 'white', borderRadius: 16,
              border: '1.5px solid var(--sky-light)',
              animation: 'kds-fade-up 0.35s ease both',
            }}>
              <div style={{ fontSize: 40, marginBottom: '0.8rem' }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--charcoal)' }}>No classes assigned yet</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)', marginTop: 4 }}>Contact your admin to get classes assigned.</div>
            </div>
          )}

          {!loading && classes.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {classes.map(cls => (
                <ClassTile
                  key={cls._id}
                  cls={cls}
                  onClick={() => router.push(`/teacher/class/${cls._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}