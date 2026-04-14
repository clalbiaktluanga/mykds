'use client';
import { useState, useEffect } from 'react';

const ROLES = ['teacher','classTeacher', 'admin'];
const EMPTY_USER = { name: '', username: '', password: '', role: 'teacher', assignedClasses: [] };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [tab, setTab] = useState('teacher');
  const [ctViewEnabled, setCtViewEnabled] = useState(false);
  const [settingLoading, setSettingLoading] = useState(false);

 const fetchAll = async () => {
  const [u, c, s] = await Promise.all([
    fetch('/api/admin/users').then(r => r.json()),
    fetch('/api/admin/classes').then(r => r.json()),
    fetch('/api/admin/settings').then(r => r.json()),
  ]);
  setUsers(u);
  setAllClasses(c);
  setCtViewEnabled(s.classTeacherViewEnabled || false);
};

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_USER);
    setError('');
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role,
      assignedClasses: user.assignedClasses?.map(c => c._id || c) || [],
    });
    setError('');
    setShowModal(true);
  };

  const toggleClass = (classId) => {
    setForm(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(classId)
        ? prev.assignedClasses.filter(id => id !== classId)
        : [...prev.assignedClasses, classId],
    }));
  };

  const toggleCtView = async () => {
  setSettingLoading(true);
  const newVal = !ctViewEnabled;
  await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'classTeacherViewEnabled', value: newVal }),
  });
  setCtViewEnabled(newVal);
  setSettingLoading(false);
};

{/* Class Teacher View Setting */}
<div style={{
  background: ctViewEnabled ? '#e6f9ee' : 'white',
  border: `1.5px solid ${ctViewEnabled ? '#a8e6c0' : 'var(--sky-light)'}`,
  borderRadius: 14, padding: '1rem 1.2rem',
  marginBottom: '1.5rem',
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem',
  transition: 'all 0.3s',
}}>
  <div>
    <div style={{ fontWeight: 600, fontSize: '0.88rem',
      color: ctViewEnabled ? '#1a8a3c' : 'var(--charcoal)' }}>
      {ctViewEnabled ? '✅' : '👁'} Allow Class Teachers to View Student Marks
    </div>
    <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
      {ctViewEnabled
        ? 'Class teachers can currently view their assigned class marks (read-only)'
        : 'Class teachers cannot view any marks right now'}
    </div>
  </div>
  <button
    onClick={toggleCtView}
    disabled={settingLoading}
    style={{
      padding: '0.5rem 1.2rem', borderRadius: 20,
      background: ctViewEnabled ? '#1a8a3c' : 'var(--charcoal)',
      color: 'white', border: 'none',
      fontFamily: 'Poppins', fontWeight: 600,
      fontSize: '0.82rem', cursor: settingLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s', minWidth: 80,
    }}
  >
    {settingLoading ? '...' : ctViewEnabled ? 'Turn Off' : 'Turn On'}
  </button>
</div>

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const url = editing ? `/api/admin/users/${editing._id}` : '/api/admin/users';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
    await fetchAll();
    setShowModal(false);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    await fetchAll();
    setDeleteConfirm(null);
  };

  const filtered = users.filter(u => u.role === tab);

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.88rem', outline: 'none', marginTop: 4,
  };

  const classLabel = (cls) =>
    `${cls.name} ${cls.section} — ${cls.subject}`;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 750, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>
            👥 User Management
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
            Add, edit or remove staff accounts
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: 'var(--sky)', border: 'none', borderRadius: 10,
          padding: '0.6rem 1.2rem', fontFamily: 'Poppins', fontWeight: 600,
          fontSize: '0.85rem', cursor: 'pointer', color: 'var(--charcoal)',
        }}>+ Add User</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
        {['teacher', 'classTeacher', 'admin'].map(r => (
          <button key={r} onClick={() => setTab(r)} style={{
            padding: '0.45rem 1.1rem', borderRadius: 20,
            background: tab === r ? 'var(--sky)' : 'white',
            fontFamily: 'Poppins', fontWeight: tab === r ? 600 : 400,
            fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize',
            border: `1.5px solid ${tab === r ? 'var(--sky)' : 'var(--sky-light)'}`,
          }}>
            {r === 'teacher' ? '🧑‍🏫' : r === 'classTeacher' ? '📚' : '🔑'} {r}s ({users.filter(u => u.role === r).length})
          </button>
        ))}
      </div>

      {/* User Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem',
            color: 'var(--charcoal-light)', fontSize: '0.88rem' }}>
            No {tab}s found. Click "+ Add User" to create one.
          </div>
        )}
        {filtered.map(user => (
          <div key={user._id} style={{
            background: 'white', borderRadius: 14,
            border: '1.5px solid var(--sky-light)',
            padding: '1rem 1.2rem',
            boxShadow: '0 2px 10px rgba(135,206,250,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'var(--sky-light)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, flexShrink: 0,
                }}>
                  {user.role === 'admin' ? '🔑' : '🧑‍🏫'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--charcoal)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 1 }}>
                    @{user.username}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(user)} style={{
                  padding: '0.4rem 0.9rem', borderRadius: 8,
                  border: '1.5px solid var(--sky-light)',
                  background: 'white', fontFamily: 'Poppins',
                  fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500,
                }}>✏️ Edit</button>
                <button onClick={() => setDeleteConfirm(user)} style={{
                  padding: '0.4rem 0.9rem', borderRadius: 8,
                  border: '1.5px solid #fde2e2',
                  background: '#fff5f5', fontFamily: 'Poppins',
                  fontSize: '0.78rem', cursor: 'pointer', color: '#c0392b',
                }}>🗑️</button>
              </div>
            </div>

            {/* Assigned Classes chips */}
            {user.role === 'teacher' && user.assignedClasses?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.8rem' }}>
                {user.assignedClasses.map(cls => (
                  <span key={cls._id} style={{
                    background: 'var(--sky-light)', color: 'var(--charcoal)',
                    fontSize: '0.72rem', fontWeight: 500,
                    padding: '3px 10px', borderRadius: 20,
                  }}>
                    {cls.name} {cls.section} — {cls.subject}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem',
        }}>
          <div style={{
            background: 'white', borderRadius: 18, padding: '2rem',
            width: '100%', maxWidth: 480,
            boxShadow: '0 8px 40px rgba(135,206,250,0.25)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem',
              marginBottom: '1.5rem', color: 'var(--charcoal)' }}>
              {editing ? '✏️ Edit User' : '➕ Add New User'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Full Name</label>
                <input style={inputStyle} placeholder="e.g. Mrs. Sharma"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Username</label>
                <input style={inputStyle} placeholder="e.g. teacher1"
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                  Password {editing && <span style={{ fontWeight: 400, color: 'var(--charcoal-light)' }}>(leave blank to keep current)</span>}
                </label>
                <input style={inputStyle} type="password"
                  placeholder={editing ? '••••••••' : 'Set password'}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Role</label>
                <select style={{ ...inputStyle, background: 'white' }}
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              {/* Assign Classes — only for teachers */}
              {form.role === 'teacher' && (
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                    Assigned Classes
                  </label>
                  {allClasses.length === 0 ? (
                    <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)',
                      marginTop: 8, padding: '0.6rem', background: '#fafeff',
                      borderRadius: 8, border: '1.5px solid var(--sky-light)' }}>
                      No classes created yet. Go to{' '}
                      <a href="/admin/classes" style={{ color: 'var(--sky-dark)' }}>
                        Manage Classes
                      </a>{' '}first.
                    </p>
                  ) : (
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column',
                      gap: '0.4rem', maxHeight: 180, overflowY: 'auto',
                      border: '1.5px solid var(--sky-light)', borderRadius: 10, padding: '0.6rem' }}>
                      {allClasses.map(cls => {
                        const selected = form.assignedClasses.includes(cls._id);
                        return (
                          <label key={cls._id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            cursor: 'pointer', padding: '0.4rem 0.5rem',
                            borderRadius: 8,
                            background: selected ? 'var(--sky-light)' : 'transparent',
                          }}>
                            <input type="checkbox" checked={selected}
                              onChange={() => toggleClass(cls._id)}
                              style={{ accentColor: 'var(--sky-dark)', width: 15, height: 15 }} />
                            <span style={{ fontSize: '0.82rem', fontWeight: selected ? 600 : 400 }}>
                              {classLabel(cls)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p style={{ color: '#c0392b', fontSize: '0.78rem',
                background: '#fff5f5', padding: '8px 12px',
                borderRadius: 8, marginTop: '1rem' }}>{error}</p>
            )}

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
                {loading ? 'Saving...' : editing ? 'Save Changes' : 'Create User'}
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
            width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: '0.8rem' }}>⚠️</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Delete {deleteConfirm.name}?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>
              This will permanently remove @{deleteConfirm.username}.
            </p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                border: '1.5px solid var(--sky-light)', background: 'white',
                fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{
                flex: 1, padding: '0.7rem', borderRadius: 10,
                background: '#c0392b', border: 'none', color: 'white',
                fontFamily: 'Poppins', fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer',
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}