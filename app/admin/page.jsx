'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const classes = [
    { id: 'classI', name: 'Class I', students: 32 },
    { id: 'classII', name: 'Class II', students: 28 },
    { id: 'classIII', name: 'Class III', students: 35 },
    { id: 'classIV', name: 'Class IV', students: 30 },
    { id: 'classV', name: 'Class V', students: 33 },
    { id: 'classVI', name: 'Class VI', students: 29 },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)' }}>
          Welcome, {session?.user?.name ?? 'Admin'} 👋
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginTop: 4 }}>
          Manage your school from here
        </p>
      </div>

      {/* Management Shortcuts */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>

        <div onClick={() => router.push('/admin/users')} style={{
          background: 'white', borderRadius: 12, padding: '0.9rem 1.2rem',
          border: '1.5px solid var(--sky-light)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 2px 10px rgba(135,206,250,0.1)',
          flex: 1, minWidth: 150,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(135,206,250,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(135,206,250,0.1)';
          }}
        >
          <span style={{ fontSize: 22 }}>👥</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--charcoal)' }}>
              Manage Users
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)' }}>
              Teachers & Admins
            </div>
          </div>
        </div>

        <div onClick={() => router.push('/admin/students')} style={{
          background: 'white', borderRadius: 12, padding: '0.9rem 1.2rem',
          border: '1.5px solid var(--sky-light)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 2px 10px rgba(135,206,250,0.1)',
          flex: 1, minWidth: 150,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(135,206,250,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(135,206,250,0.1)';
          }}
        >
          <span style={{ fontSize: 22 }}>🎒</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--charcoal)' }}>
              Manage Students
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)' }}>
              Enroll & edit students
            </div>
          </div>
        </div>

        <div onClick={() => router.push('/admin/classes')} style={{
          background: 'white', borderRadius: 12, padding: '0.9rem 1.2rem',
          border: '1.5px solid var(--sky-light)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 2px 10px rgba(135,206,250,0.1)',
          flex: 1, minWidth: 150,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(135,206,250,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(135,206,250,0.1)';
          }}
        >
          <span style={{ fontSize: 22 }}>🏫</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--charcoal)' }}>
              Manage Classes
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)' }}>
              Subjects & sections
            </div>
          </div>
        </div>

      </div>

      {/* Section Title */}
      <h3 style={{
        fontSize: '0.78rem', fontWeight: 600,
        color: 'var(--charcoal-light)', marginBottom: '1rem',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        Classes Overview
      </h3>

      {/* Class Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {classes.map(cls => (
          <div
            key={cls.id}
            onClick={() => router.push(`/admin/class/${cls.id}`)}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.4rem',
              boxShadow: '0 2px 16px rgba(135,206,250,0.18)',
              border: '1.5px solid var(--sky-light)',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
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
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--sky-light)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22,
              marginBottom: '0.8rem',
            }}>🏫</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--charcoal)' }}>
              {cls.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 3 }}>
              {cls.students} students
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}