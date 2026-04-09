'use client';
import { useState, useEffect } from 'react';

const CLASS_NAMES = ['Class I','Class II','Class III','Class IV','Class V',
  'Class VI','Class VII','Class VIII','Class IX','Class X'];
const SECTIONS = ['A', 'B', 'C'];
const SUBJECTS = ['English','Hindi','Math','Science','Social Science',
  'Computer Science','Physical Education','Art','Music'];
const EMPTY = { name: 'Class I', section: 'A', subject: 'English', academicYear: '2024-25' };

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchClasses = () =>
    fetch('/api/admin/classes').then(r => r.json()).then(setClasses);

  useEffect(() => { fetchClasses(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, section: c.section, subject: c.subject, academicYear: c.academicYear });
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

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.88rem', outline: 'none', marginTop: 4, background: 'white',
  };

  const subjectIcons = { 'English':'📖','Hindi':'📝','Math':'🔢','Science':'🔬',
    'Social Science':'🌍','Computer Science':'💻','Physical Education':'⚽','Art':'🎨','Music':'🎵' };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 750, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>
            🏫 Class Management
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
            {classes.length} classes configured
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: 'var(--sky)', border: 'none', borderRadius: 10,
          padding: '0.6rem 1.2rem', fontFamily: 'Poppins', fontWeight: 600,
          fontSize: '0.85rem', cursor: 'pointer',
        }}>+ Add Class</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {classes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem',
            color: 'var(--charcoal-light)', fontSize: '0.88rem',
            background: 'white', borderRadius: 14,
            border: '1.5px solid var(--sky-light)' }}>
            No classes yet. Click "+ Add Class" to create one.
          </div>
        )}
        {classes.map((cls, i) => (
          <div key={cls._id} style={{
            background: 'white', borderRadius: 12,
            border: '1.5px solid var(--sky-light)',
            padding: '0.9rem 1.2rem',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '1rem',
            boxShadow: '0 2px 8px rgba(135,206,250,0.08)',
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
              <button onClick={() => openEdit(cls)} style={{
                padding: '4px 12px', borderRadius: 7,
                border: '1.5px solid var(--sky-light)',
                background: 'white', fontFamily: 'Poppins',
                fontSize: '0.78rem', cursor: 'pointer',
              }}>✏️ Edit</button>
              <button onClick={() => setDeleteConfirm(cls)} style={{
                padding: '4px 12px', borderRadius: 7,
                border: '1.5px solid #fde2e2', background: '#fff5f5',
                fontFamily: 'Poppins', fontSize: '0.78rem',
                cursor: 'pointer', color: '#c0392b',
              }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 400,
            boxShadow: '0 8px 40px rgba(135,206,250,0.25)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem',
              marginBottom: '1.4rem', color: 'var(--charcoal)' }}>
              {editing ? '✏️ Edit Class' : '➕ Add Class'}
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
            </div>
            {error && <p style={{ color: '#c0392b', fontSize: '0.78rem',
              background: '#fff5f5', padding: '8px 12px',
              borderRadius: 8, marginTop: '1rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                border: '1.5px solid var(--sky-light)', background: 'white',
                fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, padding: '0.7rem', borderRadius: 10,
                background: 'var(--sky)', border: 'none', fontFamily: 'Poppins',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
              }}>
                {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 340, textAlign: 'center' }}>
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
    </div>
  );
}