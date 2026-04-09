'use client';
import { useState, useEffect } from 'react';

const CLASSES = ['Class I','Class II','Class III','Class IV','Class V',
  'Class VI','Class VII','Class VIII','Class IX','Class X'];
const SECTIONS = ['A', 'B', 'C'];
const EMPTY = { rollNo: '', name: '', class: 'Class I', section: 'A', academicYear: '2024-25' };

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [search, setSearch] = useState('');

  const fetchStudents = () =>
    fetch('/api/admin/students').then(r => r.json()).then(setStudents);

  useEffect(() => { fetchStudents(); }, []);

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setError(''); setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ rollNo: s.rollNo, name: s.name, class: s.class,
      section: s.section || 'A', academicYear: s.academicYear });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const url = editing ? `/api/admin/students/${editing._id}` : '/api/admin/students';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }
    await fetchStudents();
    setShowModal(false); setLoading(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    await fetchStudents();
    setDeleteConfirm(null);
  };

  const filtered = students
    .filter(s => filterClass === 'All' || s.class === filterClass)
    .filter(s => filterSection === 'All' || s.section === filterSection)
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search)
    );

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.88rem', outline: 'none', marginTop: 4,
  };

  const sectionColors = { A: '#e6f9ee', B: '#e8f0ff', C: '#fff8e1' };
  const sectionText = { A: '#1a8a3c', B: '#2c5fe6', C: '#e67e22' };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 820, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>
            🎒 Student Management
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
            {students.length} students enrolled
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: 'var(--sky)', border: 'none', borderRadius: 10,
          padding: '0.6rem 1.2rem', fontFamily: 'Poppins', fontWeight: 600,
          fontSize: '0.85rem', cursor: 'pointer',
        }}>+ Add Student</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem',
        flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍 Search name or roll no..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, marginTop: 0, flex: 1, minWidth: 180 }} />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          style={{ ...inputStyle, marginTop: 0, width: 'auto', background: 'white' }}>
          <option value="All">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
          style={{ ...inputStyle, marginTop: 0, width: 'auto', background: 'white' }}>
          <option value="All">All Sections</option>
          {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: 14,
        border: '1.5px solid var(--sky-light)', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              {['Roll No', 'Name', 'Class', 'Section', 'Year', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '0.7rem 0.9rem', textAlign: 'left',
                  background: 'var(--sky-light)', fontSize: '0.78rem',
                  fontWeight: 600, color: 'var(--charcoal)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center',
                color: 'var(--charcoal-light)', fontSize: '0.85rem' }}>
                No students found.
              </td></tr>
            )}
            {filtered.map((s, i) => (
              <tr key={s._id} style={{ background: i % 2 === 0 ? 'white' : '#fafeff' }}>
                <td style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>{s.rollNo}</td>
                <td style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '0.6rem 0.9rem', fontSize: '0.82rem' }}>{s.class}</td>
                <td style={{ padding: '0.6rem 0.9rem' }}>
                  <span style={{
                    background: sectionColors[s.section] || '#f0f0f0',
                    color: sectionText[s.section] || '#333',
                    fontSize: '0.75rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    Section {s.section || 'A'}
                  </span>
                </td>
                <td style={{ padding: '0.6rem 0.9rem', fontSize: '0.78rem',
                  color: 'var(--charcoal-light)' }}>{s.academicYear}</td>
                <td style={{ padding: '0.6rem 0.9rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => openEdit(s)} style={{
                      padding: '4px 12px', borderRadius: 7,
                      border: '1.5px solid var(--sky-light)',
                      background: 'white', fontFamily: 'Poppins',
                      fontSize: '0.75rem', cursor: 'pointer',
                    }}>✏️</button>
                    <button onClick={() => setDeleteConfirm(s)} style={{
                      padding: '4px 12px', borderRadius: 7,
                      border: '1.5px solid #fde2e2',
                      background: '#fff5f5', fontFamily: 'Poppins',
                      fontSize: '0.75rem', cursor: 'pointer', color: '#c0392b',
                    }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 400,
            boxShadow: '0 8px 40px rgba(135,206,250,0.25)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem',
              marginBottom: '1.4rem', color: 'var(--charcoal)' }}>
              {editing ? '✏️ Edit Student' : '➕ Add Student'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Roll Number</label>
                <input style={inputStyle} placeholder="e.g. 01"
                  value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Full Name</label>
                <input style={inputStyle} placeholder="e.g. Aarav Mehta"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              {/* Class + Section side by side */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Class</label>
                  <select style={{ ...inputStyle, background: 'white' }}
                    value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Section</label>
                  <select style={{ ...inputStyle, background: 'white' }}
                    value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Academic Year</label>
                <input style={inputStyle} placeholder="e.g. 2024-25"
                  value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
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
                background: 'var(--sky)', border: 'none',
                fontFamily: 'Poppins', fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer',
              }}>
                {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 340, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: '0.7rem' }}>⚠️</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
              Remove {deleteConfirm.name}?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>
              Roll No {deleteConfirm.rollNo} · {deleteConfirm.class} Section {deleteConfirm.section}
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
                fontFamily: 'Poppins', fontWeight: 600,
                fontSize: '0.85rem', cursor: 'pointer',
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}