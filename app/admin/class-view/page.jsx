'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const TEST_TABS = [
  { label: 'Test 1', type: 'classtest', index: 1 },
  { label: 'Test 2', type: 'classtest', index: 2 },
  { label: 'Test 3', type: 'classtest', index: 3 },
  { label: 'Test 4', type: 'classtest', index: 4 },
  { label: 'Test 5', type: 'classtest', index: 5 },
  { label: 'Term 1', type: 'exam', index: 1 },
  { label: 'Term 2', type: 'exam', index: 2 },
  { label: 'Term 3', type: 'exam', index: 3 },
];

function ClassViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const className = searchParams.get('class');
  const section = searchParams.get('section');

  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentTab = TEST_TABS[activeTab];

  useEffect(() => {
    if (!className || !section) return;
    setLoading(true);
    fetch(`/api/admin/class-report?class=${encodeURIComponent(className)}&section=${section}&type=${currentTab.type}&index=${currentTab.index}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [className, section, activeTab]);

  const thStyle = {
    padding: '0.6rem 0.8rem',
    fontWeight: 600, fontSize: '0.75rem',
    background: 'var(--sky-light)',
    color: 'var(--charcoal)',
    textAlign: 'left', whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '0.55rem 0.8rem',
    fontSize: '0.82rem',
    borderBottom: '1px solid #f0f8ff',
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return { bg: 'transparent', color: '#aaa' };
    if (score >= 40) return { bg: '#e6f9ee', color: '#1a8a3c' };
    return { bg: '#fdecea', color: '#c0392b' };
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 1100, margin: '0 auto' }}>

      {/* Back + Header */}
      <div style={{ marginBottom: '1.2rem' }}>
        <button onClick={() => router.back()} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.82rem', color: 'var(--charcoal-light)',
          fontFamily: 'Poppins', padding: 0, marginBottom: '0.6rem',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>← Back</button>

        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>
              🏫 {className} — Section {section}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
              {data?.students?.length ?? 0} students · {data?.subjects?.length ?? 0} subjects
            </p>
          </div>
        </div>
      </div>

      {/* Tabs — Tests */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600,
          color: 'var(--charcoal-light)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
          Class Tests
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          {TEST_TABS.filter(t => t.type === 'classtest').map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding: '0.4rem 1rem', borderRadius: 20,
              background: activeTab === i ? 'var(--sky)' : 'white',
              fontFamily: 'Poppins', fontWeight: activeTab === i ? 600 : 400,
              fontSize: '0.78rem', cursor: 'pointer',
              border: `1.5px solid ${activeTab === i ? 'var(--sky)' : 'var(--sky-light)'}`,
              transition: 'all 0.15s',
            }}>{tab.label}</button>
          ))}
        </div>

        <div style={{ fontSize: '0.72rem', fontWeight: 600,
          color: 'var(--charcoal-light)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
          Exam / Term Marks
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {TEST_TABS.filter(t => t.type === 'exam').map((tab, i) => {
            const realIndex = i + 5; // offset by 5 class tests
            return (
              <button key={realIndex} onClick={() => setActiveTab(realIndex)} style={{
                padding: '0.4rem 1rem', borderRadius: 20,
                background: activeTab === realIndex ? '#434343' : 'white',
                color: activeTab === realIndex ? 'white' : 'var(--charcoal)',
                fontFamily: 'Poppins', fontWeight: activeTab === realIndex ? 600 : 400,
                fontSize: '0.78rem', cursor: 'pointer',
                border: `1.5px solid ${activeTab === realIndex ? '#434343' : 'var(--sky-light)'}`,
                transition: 'all 0.15s',
              }}>{tab.label}</button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center',
          color: 'var(--charcoal-light)', fontSize: '0.88rem' }}>
          Loading marks...
        </div>
      ) : !data?.students?.length ? (
        <div style={{ padding: '3rem', textAlign: 'center',
          background: 'white', borderRadius: 16,
          border: '1.5px solid var(--sky-light)',
          color: 'var(--charcoal-light)', fontSize: '0.88rem' }}>
          <div style={{ fontSize: 32, marginBottom: '0.6rem' }}>📭</div>
          No students found for {className} Section {section}.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 16,
          border: '1.5px solid var(--sky-light)', background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse',
            minWidth: 400 + (data.subjects.length * 100) }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 80 }}>Roll No</th>
                <th style={{ ...thStyle, minWidth: 160 }}>Student Name</th>
                {data.subjects.map(subject => (
                  <th key={subject} style={{ ...thStyle, textAlign: 'center', minWidth: 110 }}>
                    {subject}
                  </th>
                ))}
                <th style={{ ...thStyle, textAlign: 'center', minWidth: 90,
                  background: '#d0ecfd' }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((student, idx) => {
                const scores = data.subjects.map(s => student.marks[s]);
                const filled = scores.filter(s => s !== null && s !== undefined);
                const total = filled.reduce((a, b) => a + b, 0);

                return (
                  <tr key={student._id}
                    style={{ background: idx % 2 === 0 ? 'white' : '#fafeff' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{student.rollNo}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{student.name}</td>
                    {data.subjects.map(subject => {
                      const score = student.marks[subject];
                      const sc = getScoreColor(score);
                      return (
                        <td key={subject} style={{ ...tdStyle, textAlign: 'center' }}>
                          {score !== null && score !== undefined ? (
                            <span style={{
                              display: 'inline-block',
                              background: sc.bg, color: sc.color,
                              borderRadius: 8, padding: '3px 12px',
                              fontWeight: 600, fontSize: '0.82rem',
                              minWidth: 42,
                            }}>{score}</span>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ ...tdStyle, textAlign: 'center',
                      background: idx % 2 === 0 ? '#f5fbff' : '#eef7ff' }}>
                      <span style={{
                        fontWeight: 700, fontSize: '0.85rem',
                        color: filled.length > 0 ? 'var(--charcoal)' : '#ccc',
                      }}>
                        {filled.length > 0 ? total : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      {data?.students?.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem',
          flexWrap: 'wrap', fontSize: '0.75rem' }}>
          {[
            { label: '≥ 40 — P', bg: '#e6f9ee', color: '#2ecc71' },
            { label: '< 40 — F', bg: '#fdecea', color: '#e74c3c' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: l.bg, color: l.color,
                borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                {l.label.split(' — ')[0]}
              </span>
              <span style={{ color: 'var(--charcoal-light)' }}>{l.label.split(' — ')[1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClassViewPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '2rem', textAlign: 'center',
        color: 'var(--charcoal-light)' }}>Loading...</div>
    }>
      <ClassViewContent />
    </Suspense>
  );
}