'use client';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const CLASS_NAMES = ['KG I', 'KG II', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
  'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
const SECTIONS = ['A', 'B', 'C'];
const SUBJECTS = ['English', 'Mizo', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'EVS',
  'Information Technology', 'Moral Values', 'General Knowledge', 'Spelling & Dictations'];
const EMPTY = { name: 'Class VIII', section: 'A', subject: 'English', academicYear: '2026', terms: 3, tests: 5, enableAttendance: true };

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');
  const [showLocksModal, setShowLocksModal] = useState(false);
  const [lockingClass, setLockingClass] = useState(null);
  const [locksForm, setLocksForm] = useState({ lockedTests: [], lockedTerms: [] });

  const fetchClasses = () =>
    fetch('/api/admin/classes').then(r => r.json()).then(data => {
      setClasses(data);
      setInitialLoading(false);
    });

  useEffect(() => { fetchClasses(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section, subject: c.subject, academicYear: c.academicYear, terms: c.terms || 3, tests: c.tests || 5, enableAttendance: c.enableAttendance !== undefined ? c.enableAttendance : true });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const url = editing ? `/api/admin/classes/${editing._id}` : '/api/admin/classes';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }
    await fetchClasses(); setShowModal(false); setLoading(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/classes/${id}`, { method: 'DELETE' });
    await fetchClasses(); setDeleteConfirm(null);
  };

  const openLocks = (c) => {
    setLockingClass(c);
    setLocksForm({
      lockedTests: c.lockedTests || [],
      lockedTerms: c.lockedTerms || []
    });
    setShowLocksModal(true);
  };

  const handleSaveLocks = async () => {
    setLoading(true); setError('');
    const res = await fetch(`/api/admin/classes/${lockingClass._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lockedTests: locksForm.lockedTests, lockedTerms: locksForm.lockedTerms }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }
    await fetchClasses(); setShowLocksModal(false); setLoading(false);
  };

  const toggleLock = (type, index) => {
    setLocksForm(prev => {
      const arr = prev[type] || [];
      const newArr = arr.includes(index) ? arr.filter(i => i !== index) : [...arr, index];
      return { ...prev, [type]: newArr };
    });
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.88rem', outline: 'none', marginTop: 4, background: 'white',
  };

  const subjectIcons = {
    'English': '📖', 'Mizo': '📝', 'Hindi': '📝', 'Mathematics': '🔢', 'Science': '🔬',
    'Social Science': '🌍', 'EVS': '🌍', 'IT': '💻', 'Moral Values': '🙏', 'GK': '🧠', 'S & D': '🗣️'
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(search.toLowerCase()) ||
    cls.subject.toLowerCase().includes(search.toLowerCase()) ||
    cls.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: 750, margin: '0 auto' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem'
      }}>
        <div>
          <BackButton />
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>
            Class Management
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
            {classes.length} classes configured
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: 'var(--sky)', border: 'none', borderRadius: 10,
          padding: '0.6rem 1.2rem', fontFamily: 'Poppins', fontWeight: 600,
          fontSize: '0.85rem', cursor: 'pointer', color: 'white'
        }}>+ Add Class</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.2rem' }}>
        <input placeholder="Search class name, section, or subject..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, marginTop: 0, width: '100%', maxWidth: 350 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {initialLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={`skel-${i}`} style={{
            background: 'white', borderRadius: 12, border: '1.5px solid var(--sky-light)',
            padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="skeleton" style={{ height: 18, width: 140, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div className="skeleton" style={{ height: 30, width: 60, borderRadius: 7 }} />
              <div className="skeleton" style={{ height: 30, width: 34, borderRadius: 7 }} />
            </div>
          </div>
        ))}
        {!initialLoading && classes.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: 'var(--charcoal-light)', fontSize: '0.88rem',
            background: 'white', borderRadius: 14,
            border: '1.5px solid var(--sky-light)'
          }}>
            No classes yet. Click "+ Add Class" to create one.
          </div>
        )}
        {!initialLoading && classes.length > 0 && filteredClasses.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: 'var(--charcoal-light)', fontSize: '0.88rem',
            background: 'white', borderRadius: 14,
            border: '1.5px solid var(--sky-light)'
          }}>
            No classes found matching "{search}".
          </div>
        )}
        {!initialLoading && filteredClasses.map((cls, i) => (
          <div key={cls._id} style={{
            background: 'white', borderRadius: 12,
            border: '1.5px solid var(--sky-light)',
            padding: '0.9rem 1.2rem',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '1rem',
            boxShadow: '0 2px 8px rgba(66,133,244,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--sky-light)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>
                {subjectIcons[cls.subject] || '📚'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {cls.name} — Section {cls.section}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 1 }}>
                  {cls.subject} · {cls.academicYear}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => openLocks(cls)} style={{
                padding: '4px 12px', borderRadius: 7,
                border: '1.5px solid var(--sky-light)',
                background: 'white', fontFamily: 'Poppins',
                fontSize: '0.78rem', cursor: 'pointer',
              }}>Edit Lock</button>
              <button onClick={() => openEdit(cls)} style={{
                padding: '4px 12px', borderRadius: 7,
                border: '1.5px solid var(--sky-light)',
                background: 'white', fontFamily: 'Poppins',
                fontSize: '0.78rem', cursor: 'pointer',
              }}>Edit</button>
              <button onClick={() => setDeleteConfirm(cls)} style={{
                padding: '4px 12px', borderRadius: 7,
                border: '1.5px solid #fde2e2', background: '#fff5f5',
                fontFamily: 'Poppins', fontSize: '0.78rem',
                cursor: 'pointer', color: '#c0392b',
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 400,
            boxShadow: '0 8px 40px rgba(66,133,244,0.15)'
          }}>
            <h3 style={{
              fontWeight: 700, fontSize: '1.05rem',
              marginBottom: '1.4rem', color: 'var(--charcoal)'
            }}>
              {editing ? 'Edit Class' : 'Add Class'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Class</label>
                  <select style={inputStyle} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}>
                    {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Section</label>
                  <select style={inputStyle} value={form.section}
                    onChange={e => setForm({ ...form, section: e.target.value })}>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Subject</label>
                <select style={inputStyle} value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Academic Year</label>
                <input style={inputStyle} placeholder="e.g. 2024-25"
                  value={form.academicYear}
                  onChange={e => setForm({ ...form, academicYear: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Number of Tests</label>
                  <input style={inputStyle} type="number" min="1" max="20"
                    value={form.tests !== undefined ? form.tests : 5}
                    onChange={e => setForm({ ...form, tests: Number(e.target.value) })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Number of Terms</label>
                  <input style={inputStyle} type="number" min="1" max="10"
                    value={form.terms !== undefined ? form.terms : 3}
                    onChange={e => setForm({ ...form, terms: Number(e.target.value) })} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <input type="checkbox" id="enableAttendance"
                  checked={form.enableAttendance}
                  onChange={e => setForm({ ...form, enableAttendance: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }} />
                <label htmlFor="enableAttendance" style={{ fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                  Enable Attendance Management
                </label>
              </div>
            </div>
            {error && <p style={{
              color: '#c0392b', fontSize: '0.78rem',
              background: '#fff5f5', padding: '8px 12px',
              borderRadius: 8, marginTop: '1rem'
            }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                border: '1.5px solid var(--sky-light)', background: 'white',
                fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, padding: '0.7rem', borderRadius: 10,
                background: 'var(--sky)', border: 'none', fontFamily: 'Poppins',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', color: 'white'
              }}>
                {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 340, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, marginBottom: '0.7rem' }}>⚠️</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
              Delete this class?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>
              {deleteConfirm.name} Section {deleteConfirm.section} — {deleteConfirm.subject}
            </p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                border: '1.5px solid var(--sky-light)', background: 'white',
                fontFamily: 'Poppins', fontSize: '0.85rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                background: '#c0392b', border: 'none', color: 'white',
                fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Locks Modal */}
      {showLocksModal && lockingClass && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 450,
            boxShadow: '0 8px 40px rgba(66,133,244,0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{
              fontWeight: 700, fontSize: '1.05rem',
              marginBottom: '0.5rem', color: 'var(--charcoal)'
            }}>
              Manage Edit Locks
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>
              {lockingClass.name} Section {lockingClass.section} — {lockingClass.subject}
              <br />Lock columns to prevent teachers from editing them.
            </p>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--charcoal)' }}>Class Tests</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {Array.from({ length: lockingClass.tests || 5 }, (_, i) => i + 1).map(testIdx => (
                    <label key={`test-${testIdx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox"
                        checked={locksForm.lockedTests.includes(testIdx)}
                        onChange={() => toggleLock('lockedTests', testIdx)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }} />
                      Test {testIdx}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--charcoal)' }}>Terms</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {Array.from({ length: lockingClass.terms || 3 }, (_, i) => i + 1).map(termIdx => (
                    <label key={`term-${termIdx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox"
                        checked={locksForm.lockedTerms.includes(termIdx)}
                        onChange={() => toggleLock('lockedTerms', termIdx)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }} />
                      Term {termIdx}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {error && <p style={{
              color: '#c0392b', fontSize: '0.78rem',
              background: '#fff5f5', padding: '8px 12px',
              borderRadius: 8, marginTop: '1rem'
            }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '2rem' }}>
              <button onClick={() => setShowLocksModal(false)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                border: '1.5px solid var(--sky-light)', background: 'white',
                fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSaveLocks} disabled={loading} style={{
                flex: 2, padding: '0.7rem', borderRadius: 10,
                background: 'var(--sky)', border: 'none', fontFamily: 'Poppins',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', color: 'white'
              }}>
                {loading ? 'Saving...' : 'Save Locks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}