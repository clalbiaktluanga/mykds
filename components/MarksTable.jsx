'use client';
import { useState, useEffect, useRef } from 'react';

export default function MarksTable({ students, classId, type }) {
  const [marks, setMarks] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [draftMarks, setDraftMarks] = useState({});
  const [numTests, setNumTests] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(null);
  const label = type === 'classtest' ? 'Test' : 'Term';

  // Load marks
  const loadMarks = () => {
    fetch(`/api/marks?classId=${classId}&type=${type}`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(m => { map[`${m.student}_${m.index}`] = m.marksObtained; });
        setMarks(map);
      })
      .catch(() => {});
  };

  // Load logs
  const loadLogs = () => {
    fetch(`/api/marks/logs?classId=${classId}&type=${type}`)
      .then(r => r.json())
      .then(setLogs)
      .catch(() => {});
  };

  useEffect(() => {
    if (classId) { loadMarks(); loadLogs(); }
  }, [classId, type]);

  // Enter edit mode — clone current marks into draft
  const handleEdit = () => {
    setDraftMarks({ ...marks });
    setEditMode(true);
    setSaveMsg('');
  };

  // Cancel edit
  const handleCancel = () => {
    setDraftMarks({});
    setEditMode(false);
    setSaveMsg('');
  };

  // Save all changes
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');

    const entries = [];
    for (let i = 1; i <= numTests; i++) {
      for (const s of students) {
        const key = `${s._id}_${i}`;
        const oldValue = marks[key] ?? null;
        const newValue = draftMarks[key] !== undefined
          ? (draftMarks[key] === '' ? null : Number(draftMarks[key]))
          : oldValue;

        entries.push({
          studentId: s._id,
          studentName: s.name,
          rollNo: s.rollNo,
          oldValue,
          newValue,
          index: i,
        });
      }
    }

    // Group by index and save
    for (let i = 1; i <= numTests; i++) {
      const indexEntries = entries.filter(e => e.index === i);
      await fetch('/api/marks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, type, index: i, entries: indexEntries }),
      });
    }

    // Refresh marks and logs
    loadMarks();
    loadLogs();
    setEditMode(false);
    setDraftMarks({});
    setSaving(false);
    setSaveMsg(`✓ Saved at ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setSaveMsg(''), 4000);
  };

  const thStyle = {
    padding: '0.6rem 0.8rem', fontWeight: 600, fontSize: '0.78rem',
    background: 'var(--sky-light)', color: 'var(--charcoal)',
    textAlign: 'left', whiteSpace: 'nowrap',
  };
  const tdStyle = {
    padding: '0.5rem 0.8rem', fontSize: '0.82rem',
    borderBottom: '1px solid #f0f8ff',
  };

  const formatLogDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      {/* ── TABLE CARD ── */}
      <div style={{
        borderRadius: '16px', border: '1.5px solid var(--sky-light)',
        background: 'white', overflow: 'hidden',
      }}>

        {/* Header bar */}
        <div style={{
          padding: '0.8rem 1rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem',
          borderBottom: '1.5px solid var(--sky-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
              {label} Marks
            </span>
            {/* Edit mode indicator */}
            {editMode && (
              <span style={{
                background: '#fff8e1', color: '#c67c00',
                fontSize: '0.72rem', fontWeight: 600,
                padding: '3px 10px', borderRadius: 20,
                border: '1px solid #ffe58f',
              }}>
                ✏️ Editing
              </span>
            )}
            {saveMsg && (
              <span style={{
                background: '#e6f9ee', color: '#1a8a3c',
                fontSize: '0.72rem', fontWeight: 600,
                padding: '3px 10px', borderRadius: 20,
              }}>
                {saveMsg}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Column count — only when not editing */}
            {!editMode && (
              <>
                <span style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)' }}>
                  Columns:
                </span>
                {[3, 5, 8].map(n => (
                  <button key={n} onClick={() => setNumTests(n)} style={{
                    padding: '2px 10px', borderRadius: 20,
                    border: '1.5px solid var(--sky)',
                    background: numTests === n ? 'var(--sky)' : 'white',
                    fontFamily: 'Poppins', fontSize: '0.75rem', cursor: 'pointer',
                  }}>{n}</button>
                ))}
              </>
            )}

            {/* Action buttons */}
            {!editMode ? (
              <button onClick={handleEdit} style={{
                padding: '0.4rem 1.1rem', borderRadius: 8,
                background: 'var(--charcoal)', color: 'white',
                border: 'none', fontFamily: 'Poppins',
                fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                ✏️ Edit
              </button>
            ) : (
              <>
                <button onClick={handleCancel} style={{
                  padding: '0.4rem 1rem', borderRadius: 8,
                  background: 'white', color: 'var(--charcoal)',
                  border: '1.5px solid var(--sky-light)',
                  fontFamily: 'Poppins', fontWeight: 500,
                  fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '0.4rem 1.1rem', borderRadius: 8,
                  background: saving ? 'var(--sky-light)' : '#1a8a3c',
                  color: 'white', border: 'none',
                  fontFamily: 'Poppins', fontWeight: 600,
                  fontSize: '0.8rem', cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            minWidth: 300 + numTests * 90,
          }}>
            <thead>
              <tr>
                <th style={thStyle}>Roll No</th>
                <th style={thStyle}>Student Name</th>
                {Array.from({ length: numTests }, (_, i) => (
                  <th key={i} style={{ ...thStyle, textAlign: 'center' }}>
                    {label} {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={2 + numTests} style={{
                    ...tdStyle, textAlign: 'center',
                    padding: '2rem', color: 'var(--charcoal-light)',
                  }}>
                    No students found
                  </td>
                </tr>
              )}
              {students.map((s, idx) => (
                <tr key={s._id}
                  style={{ background: idx % 2 === 0 ? 'white' : '#fafeff' }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{s.rollNo}</td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{s.name}</td>
                  {Array.from({ length: numTests }, (_, i) => {
                    const key = `${s._id}_${i + 1}`;
                    const displayVal = editMode
                      ? (draftMarks[key] !== undefined ? draftMarks[key] : (marks[key] ?? ''))
                      : (marks[key] ?? '');

                    // Colour code the score chip
                    const scoreNum = Number(displayVal);
                    let chipStyle = {};
                    if (!editMode && displayVal !== '' && displayVal !== null) {
                      if (scoreNum >= 80) chipStyle = { background: '#e6f9ee', color: '#1a8a3c' };
                      else if (scoreNum >= 60) chipStyle = { background: '#fff8e1', color: '#c67c00' };
                      else chipStyle = { background: '#fdecea', color: '#c0392b' };
                    }

                    return (
                      <td key={i} style={{ ...tdStyle, textAlign: 'center' }}>
                        {editMode ? (
                          <input
                            type="number" min="0" max="100"
                            value={draftMarks[key] !== undefined ? draftMarks[key] : (marks[key] ?? '')}
                            onChange={e => setDraftMarks(prev => ({
                              ...prev, [key]: e.target.value,
                            }))}
                            style={{
                              width: 64, padding: '5px 8px',
                              border: '2px solid var(--sky)',
                              borderRadius: 8, fontFamily: 'Poppins',
                              fontSize: '0.82rem', textAlign: 'center',
                              outline: 'none', background: '#f0fbff',
                            }}
                          />
                        ) : (
                          <span style={{
                            display: 'inline-block', minWidth: 42,
                            padding: '3px 10px', borderRadius: 8,
                            fontWeight: displayVal !== '' ? 600 : 400,
                            fontSize: '0.82rem',
                            color: displayVal === '' ? '#ccc' : undefined,
                            ...chipStyle,
                          }}>
                            {displayVal !== '' ? displayVal : '—'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT HISTORY ── */}
      {logs.length > 0 && (
        <div style={{ marginTop: '1.2rem' }}>
          <button
            onClick={() => setShowLogs(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none',
              fontFamily: 'Poppins', fontSize: '0.82rem',
              fontWeight: 600, color: 'var(--charcoal-light)',
              cursor: 'pointer', padding: 0, marginBottom: '0.6rem',
            }}
          >
            <span style={{
              display: 'inline-block',
              transform: showLogs ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}>▶</span>
            Edit History ({logs.length})
          </button>

          {showLogs && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {logs.map((log, i) => (
                <div key={log._id || i} style={{
                  background: 'white', borderRadius: 12,
                  border: '1.5px solid var(--sky-light)',
                  overflow: 'hidden',
                }}>
                  {/* Log header */}
                  <div
                    onClick={() => setActiveLogIndex(activeLogIndex === i ? null : i)}
                    style={{
                      padding: '0.7rem 1rem',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', cursor: 'pointer',
                      background: activeLogIndex === i ? '#f5fbff' : 'white',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <span style={{
                        background: 'var(--sky-light)',
                        width: 30, height: 30, borderRadius: 8,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 14,
                        flexShrink: 0,
                      }}>📝</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--charcoal)' }}>
                            {log.changes?.length ?? 0} change{log.changes?.length !== 1 ? 's' : ''} in {label} {log.index}
                            </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)', marginTop: 1 }}>
                          by {log.editedByName} · {formatLogDate(log.editedAt)}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.72rem', color: 'var(--charcoal-light)',
                      transform: activeLogIndex === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s', display: 'inline-block',
                    }}>▼</span>
                  </div>

                  {/* Log detail */}
                  {activeLogIndex === i && log.changes?.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--sky-light)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Roll No', 'Student', 'Old Value', 'New Value', 'Change'].map(h => (
                              <th key={h} style={{
                                padding: '0.5rem 0.9rem',
                                background: '#f5fbff',
                                fontSize: '0.72rem', fontWeight: 600,
                                color: 'var(--charcoal-light)',
                                textAlign: 'left',
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {log.changes.map((ch, j) => {
                            const diff = (ch.newValue ?? 0) - (ch.oldValue ?? 0);
                            const isUp = diff > 0;
                            const isDown = diff < 0;
                            return (
                              <tr key={j} style={{
                                background: j % 2 === 0 ? 'white' : '#fafeff',
                              }}>
                                <td style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', fontWeight: 600 }}>
                                  {ch.rollNo}
                                </td>
                                <td style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                                  {ch.studentName}
                                </td>
                                <td style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                                  <span style={{
                                    background: '#fdecea', color: '#c0392b',
                                    borderRadius: 6, padding: '2px 8px',
                                    fontWeight: 600, fontSize: '0.75rem',
                                  }}>
                                    {ch.oldValue ?? '—'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                                  <span style={{
                                    background: '#e6f9ee', color: '#1a8a3c',
                                    borderRadius: 6, padding: '2px 8px',
                                    fontWeight: 600, fontSize: '0.75rem',
                                  }}>
                                    {ch.newValue ?? '—'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                                  {diff !== 0 && (
                                    <span style={{
                                      fontWeight: 700, fontSize: '0.78rem',
                                      color: isUp ? '#1a8a3c' : '#c0392b',
                                    }}>
                                      {isUp ? `▲ +${diff}` : `▼ ${diff}`}
                                    </span>
                                  )}
                                  {diff === 0 && (
                                    <span style={{ color: '#aaa', fontSize: '0.75rem' }}>no change</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}