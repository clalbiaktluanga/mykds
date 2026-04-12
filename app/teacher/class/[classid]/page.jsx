'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MarksTable from '@/components/MarksTable';
import AttendanceTable from '@/components/AttendanceTable';
import PageLoader from '@/components/PageLoader';

const TABS = ['Class Tests', 'Exams', 'Attendance', 'Notes'];

export default function ClassPage() {
  const params = useParams();
  const classId = params.classId || params.classid;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/classes/${classId}`).then(r => r.json()),
      fetch(`/api/classes/${classId}/students`).then(r => r.json()),
    ]).then(([cls, studs]) => {
      setClassInfo(cls);
      setStudents(Array.isArray(studs) ? studs : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [classId]);

  const ICONS = {
    'English': '📖','Mizo': '📝', 'Hindi': '📝', 'Mathematics': '🔢', 'Science': '🔬','Social Science': '🌍','EVS': '🌍', 'IT': '💻',
    'Moral Values': '🙏', 'Art': '🎨', 'Music': '🎵',
  };

  if (loading) return <PageLoader message="Loading class" />;

  return (
    <>
      <style>{`
        @keyframes kds-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-class-content { animation: kds-fade-up 0.3s ease both; }
      `}</style>

      <div className="kds-class-content"
        style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>

        {/* Back + Header */}
        <div style={{ marginBottom: '1.2rem' }}>
          <button onClick={() => router.back()} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', color: 'var(--charcoal-light)',
            fontFamily: 'Poppins', padding: 0, marginBottom: '0.6rem',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>← Back</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'var(--sky-light)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, flexShrink: 0,
            }}>
              {ICONS[classInfo?.subject] ?? '📚'}
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--charcoal)', margin: 0 }}>
                {classInfo?.name} {classInfo?.section} — {classInfo?.subject}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', margin: 0 }}>
                {students.length} student{students.length !== 1 ? 's' : ''} · {classInfo?.academicYear}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding: '0.5rem 1.1rem', borderRadius: 20,
              background: activeTab === i ? 'var(--sky)' : 'white',
              color: 'var(--charcoal)',
              fontFamily: 'Poppins', fontWeight: activeTab === i ? 600 : 400,
              fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
              border: `1.5px solid ${activeTab === i ? 'var(--sky)' : 'var(--sky-light)'}`,
              transition: 'all 0.15s',
            }}>{tab}</button>
          ))}
        </div>

        {/* No students warning */}
        {students.length === 0 && (
          <div style={{
            background: '#fffbe6', border: '1.5px solid #ffe58f',
            borderRadius: 12, padding: '1rem 1.2rem',
            fontSize: '0.82rem', color: '#7c5e00', marginBottom: '1.2rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            ⚠️ No students found for <strong>{classInfo?.name} Section {classInfo?.section}</strong>.
            Enroll students via Admin → Student Management.
          </div>
        )}

        {/* Tab content */}
        {activeTab === 0 && (
          <MarksTable students={students} classId={classId} type="classtest" />
        )}
        {activeTab === 1 && (
          <MarksTable students={students} classId={classId} type="exam" />
        )}
        {activeTab === 2 && (
          <AttendanceTable students={students} classId={classId} />
        )}
        {activeTab === 3 && (
          <NotesPanel students={students} classId={classId} />
        )}
      </div>
    </>
  );
}

function NotesPanel({ students, classId }) {
  const [notes, setNotes] = useState({});
  const [saved, setSaved] = useState({});

  const handleSave = async (studentId) => {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, classId, note: notes[studentId] }),
    });
    setSaved(prev => ({ ...prev, [studentId]: true }));
    setTimeout(() => setSaved(prev => ({ ...prev, [studentId]: false })), 2000);
  };

  if (students.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {students.map(s => (
        <div key={s._id} style={{
          background: 'white', borderRadius: 12,
          border: '1.5px solid var(--sky-light)', padding: '1rem',
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem',
            marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
            {s.rollNo} — {s.name}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <textarea rows={2} placeholder="Add a note for this student..."
              value={notes[s._id] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [s._id]: e.target.value }))}
              style={{
                flex: 1, padding: '0.6rem 0.8rem', borderRadius: 8,
                border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
                fontSize: '0.82rem', resize: 'vertical', outline: 'none',
              }}
            />
            <button onClick={() => handleSave(s._id)} style={{
              padding: '0.5rem 1rem', borderRadius: 8,
              background: saved[s._id] ? '#e6f9ee' : 'var(--sky)',
              border: 'none', fontFamily: 'Poppins', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end',
              color: saved[s._id] ? '#1a8a3c' : 'var(--charcoal)',
              transition: 'all 0.2s',
            }}>
              {saved[s._id] ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}