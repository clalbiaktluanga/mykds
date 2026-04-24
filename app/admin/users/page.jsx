'use client';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const ROLES = ['teacher', 'admin'];
const SECTIONS = ['A', 'B', 'C'];
const EMPTY_USER = {
  name: '', username: '', password: '', role: 'teacher',
  assignedClasses: [],
  classTeacherClass: '',
  classTeacherSection: '',
};

function LoginHistoryPanel() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(u => setUsers(Array.isArray(u) ? u : []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = filterUser ? `/api/admin/login-history?userId=${filterUser}` : '/api/admin/login-history';
    fetch(url)
      .then(r => r.json())
      .then(d => { setHistory(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filterUser]);

  const fmt = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const roleColor = { admin: { bg: '#fdecea', color: '#c0392b' }, teacher: { bg: 'var(--sky-light)', color: 'var(--charcoal)' } };

  return (
    <div>
      {/* Filter */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal-light)' }}>Filter by user:</span>
        <select
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          style={{ padding: '0.4rem 0.8rem', borderRadius: 8, border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins', fontSize: '0.82rem', outline: 'none', background: 'white' }}
        >
          <option value="">All users</option>
          {users.filter(u => u.role !== 'admin' || true).map(u => (
            <option key={u._id} value={u._id}>{u.name} (@{u.username})</option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Role', 'Login Time', 'Edits This Session'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1rem', fontWeight: 600, fontSize: '0.75rem', background: 'var(--sky-light)', color: 'var(--charcoal)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skel-h-${i}`} style={{ background: i % 2 === 0 ? 'white' : '#fafeff' }}>
                  <td style={{ padding: '0.6rem 1rem' }}><div className="skeleton" style={{ height: 16, width: 120, borderRadius: 4, marginBottom: 4 }} /><div className="skeleton" style={{ height: 12, width: 80, borderRadius: 4 }} /></td>
                  <td style={{ padding: '0.6rem 1rem' }}><div className="skeleton" style={{ height: 18, width: 50, borderRadius: 10 }} /></td>
                  <td style={{ padding: '0.6rem 1rem' }}><div className="skeleton" style={{ height: 14, width: 150, borderRadius: 4 }} /></td>
                  <td style={{ padding: '0.6rem 1rem' }}><div className="skeleton" style={{ height: 18, width: 70, borderRadius: 10 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && history.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: 16, border: '1.5px solid var(--sky-light)', color: 'var(--charcoal-light)', fontSize: '0.88rem' }}>
          No login history found.
        </div>
      )}

      {!loading && history.length > 0 && (
        <div style={{ background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Role', 'Login Time', 'Edits This Session'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1rem', fontWeight: 600, fontSize: '0.75rem', background: 'var(--sky-light)', color: 'var(--charcoal)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => {
                const rc = roleColor[entry.role] || roleColor.teacher;
                return (
                  <tr key={entry._id || i} style={{ background: i % 2 === 0 ? 'white' : '#fafeff' }}>
                    <td style={{ padding: '0.6rem 1rem', fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{entry.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-light)' }}>@{entry.username}</div>
                    </td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      <span style={{ background: rc.bg, color: rc.color, fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'capitalize' }}>{entry.role}</span>
                    </td>
                    <td style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', color: 'var(--charcoal)', whiteSpace: 'nowrap' }}>
                      {fmt(entry.loginAt)}
                    </td>
                    <td style={{ padding: '0.6rem 1rem' }}>
                      <span style={{
                        background: entry.changesCount > 0 ? '#fff8e1' : '#f5f5f5',
                        color: entry.changesCount > 0 ? '#c67c00' : '#999',
                        fontSize: '0.75rem', fontWeight: 700,
                        padding: '2px 10px', borderRadius: 20,
                      }}>
                        {entry.changesCount > 0 ? `${entry.changesCount} edit${entry.changesCount !== 1 ? 's' : ''}` : 'No edits'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [tab, setTab] = useState('teacher');
  const [ctViewEnabled, setCtViewEnabled] = useState(false);
  const [settingLoading, setSettingLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
    const [u, c, s] = await Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/classes').then(r => r.json()),
      fetch('/api/admin/settings').then(r => r.json()),
    ]);
    setUsers(u);
    setAllClasses(c);
    const names = [...new Set(c.map(cls => cls.name))].sort();
    setClassOptions(names);
    setCtViewEnabled(s.classTeacherViewEnabled || false);
    setInitialLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_USER); setError(''); setShowModal(true); };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name, username: user.username, password: '', role: user.role,
      assignedClasses: user.assignedClasses?.map(c => c._id || c) || [],
      classTeacherClass: user.classTeacherClass || '',
      classTeacherSection: user.classTeacherSection || '',
    });
    setError(''); setShowModal(true);
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'classTeacherViewEnabled', value: newVal }),
    });
    setCtViewEnabled(newVal);
    setSettingLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const url = editing ? `/api/admin/users/${editing._id}` : '/api/admin/users';
    const method = editing ? 'PUT' : 'POST';
    const payload = { ...form };
    if (!payload.classTeacherClass) { payload.classTeacherClass = null; payload.classTeacherSection = null; }
    if (!payload.classTeacherSection) payload.classTeacherSection = null;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return; }
    await fetchAll(); setShowModal(false); setLoading(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    await fetchAll(); setDeleteConfirm(null);
  };

  const filtered = users.filter(u => tab === 'admin' ? u.role === 'admin' : tab === 'history' ? false : u.role === 'teacher')
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  const hasCtAssignment = (user) => user.classTeacherClass && user.classTeacherSection;

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.9rem', borderRadius: 10,
    border: '1.5px solid var(--sky-light)', fontFamily: 'Poppins',
    fontSize: '0.88rem', outline: 'none', marginTop: 4, boxSizing: 'border-box',
  };
  const classLabel = (cls) => `${cls.name} ${cls.section} — ${cls.subject}`;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <BackButton />
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--charcoal)' }}>User Management</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 2 }}>Add, edit or remove staff accounts</p>
        </div>
        {tab !== 'history' && (
          <button onClick={openAdd} style={{ background: 'var(--sky)', border: 'none', borderRadius: 10, padding: '0.6rem 1.2rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: 'white' }}>+ Add User</button>
        )}
      </div>

      {/* CT View Toggle — teacher tab only */}
      {tab === 'teacher' && (
        <div style={{
          background: ctViewEnabled ? '#e6f9ee' : 'white',
          border: `1.5px solid ${ctViewEnabled ? '#a8e6c0' : 'var(--sky-light)'}`,
          borderRadius: 14, padding: '1rem 1.2rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', transition: 'all 0.3s',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: ctViewEnabled ? '#1a8a3c' : 'var(--charcoal)' }}>
              {ctViewEnabled} Allow Class Teachers to View Student Marks
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 2 }}>
              {ctViewEnabled ? '✔ Class teachers can currently view their assigned class marks (read-only)' : '✖ Class teachers cannot view any marks right now'}
            </div>
          </div>
          <button onClick={toggleCtView} disabled={settingLoading} style={{
            padding: '0.5rem 1.2rem', borderRadius: 20,
            background: ctViewEnabled ? '#1a8a3c' : 'var(--charcoal)',
            color: 'white', border: 'none', fontFamily: 'Poppins', fontWeight: 600,
            fontSize: '0.82rem', cursor: settingLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', minWidth: 80,
          }}>{settingLoading ? '...' : ctViewEnabled ? 'Turn Off' : 'Turn On'}</button>
        </div>
      )}

      {/* Search and Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'teacher', label: 'Teachers' },
            { key: 'admin', label: 'Admins' },
            { key: 'history', label: 'Session History' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '0.45rem 1.1rem', borderRadius: 20,
              background: tab === key ? 'var(--sky)' : 'white',
              color: tab === key ? 'white' : 'var(--charcoal-light)',
              fontFamily: 'Poppins', fontWeight: tab === key ? 600 : 400, fontSize: '0.82rem',
              cursor: 'pointer',
              border: `1.5px solid ${tab === key ? 'var(--sky)' : 'var(--sky-light)'}`,
            }}>
              {label}{key !== 'history' && ` (${users.filter(u => u.role === key).length})`}
            </button>
          ))}
        </div>

        {tab !== 'history' && (
          <input placeholder="Search name or username..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, marginTop: 0, flex: 1, minWidth: 200, maxWidth: 300 }} />
        )}
      </div>

      {/* History tab */}
      {tab === 'history' && <LoginHistoryPanel />}

      {/* User Cards */}
      {tab !== 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {initialLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={`skel-${i}`} style={{ background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)', padding: '1rem 1.2rem', boxShadow: '0 2px 10px rgba(66,133,244,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 10 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton" style={{ height: 18, width: 140, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 8 }} />
                  <div className="skeleton" style={{ height: 28, width: 34, borderRadius: 8 }} />
                </div>
              </div>
            </div>
          ))}
          {!initialLoading && users.filter(u => tab === 'admin' ? u.role === 'admin' : u.role === 'teacher').length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--charcoal-light)', fontSize: '0.88rem', background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)' }}>
              No {tab}s found. Click "+ Add User" to create one.
            </div>
          )}
          {!initialLoading && users.filter(u => tab === 'admin' ? u.role === 'admin' : u.role === 'teacher').length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--charcoal-light)', fontSize: '0.88rem', background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)' }}>
              No {tab}s found matching "{search}".
            </div>
          )}
          {!initialLoading && filtered.map(user => (
            <div key={user._id} style={{ background: 'white', borderRadius: 14, border: '1.5px solid var(--sky-light)', padding: '1rem 1.2rem', boxShadow: '0 2px 10px rgba(66,133,244,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: hasCtAssignment(user) ? '#e6f9ee' : 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {user.role === 'admin' ? '🔑' : '🧑‍🏫'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--charcoal)' }}>{user.name}</span>
                      {hasCtAssignment(user) && (
                        <span style={{ background: '#e6f9ee', color: '#1a8a3c', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #a8e6c0' }}>
                          CT: {user.classTeacherClass} – {user.classTeacherSection}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', marginTop: 1 }}>@{user.username}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(user)} style={{ padding: '0.4rem 0.9rem', borderRadius: 8, border: '1.5px solid var(--sky-light)', background: 'white', fontFamily: 'Poppins', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                  <button onClick={() => setDeleteConfirm(user)} style={{ padding: '0.4rem 0.9rem', borderRadius: 8, border: '1.5px solid #fde2e2', background: '#fff5f5', fontFamily: 'Poppins', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500, color: '#c0392b' }}>Delete</button>
                </div>
              </div>
              {user.role === 'teacher' && user.assignedClasses?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.8rem' }}>
                  {user.assignedClasses.map(cls => (
                    <span key={cls._id} style={{ background: 'var(--sky-light)', color: 'var(--charcoal)', fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
                      {cls.name} {cls.section} — {cls.subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(66,133,244,0.15)', maxHeight: '92vh', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--charcoal)' }}>
              {editing ? 'Edit User' : 'Add New User'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Full Name</label>
                <input style={inputStyle} placeholder="e.g. Mrs. Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Username</label>
                <input style={inputStyle} placeholder="e.g. teacher1" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>
                  Password {editing && <span style={{ fontWeight: 400, color: 'var(--charcoal-light)' }}>(leave blank to keep current)</span>}
                </label>
                <input style={inputStyle} type="password" placeholder={editing ? '••••••••' : 'Set password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Role</label>
                <select style={{ ...inputStyle, background: 'white' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              {form.role === 'teacher' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--charcoal)' }}>Assigned Subject Classes</label>
                    {allClasses.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-light)', marginTop: 8, padding: '0.6rem', background: '#fafeff', borderRadius: 8, border: '1.5px solid var(--sky-light)' }}>
                        No classes created yet. Go to <a href="/admin/classes" style={{ color: 'var(--sky-dark)' }}>Manage Classes</a> first.
                      </p>
                    ) : (
                      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 180, overflowY: 'auto', border: '1.5px solid var(--sky-light)', borderRadius: 10, padding: '0.6rem' }}>
                        {allClasses.map(cls => {
                          const selected = form.assignedClasses.includes(cls._id);
                          return (
                            <label key={cls._id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.4rem 0.5rem', borderRadius: 8, background: selected ? 'var(--sky-light)' : 'transparent' }}>
                              <input type="checkbox" checked={selected} onChange={() => toggleClass(cls._id)} style={{ accentColor: 'var(--sky-dark)', width: 15, height: 15 }} />
                              <span style={{ fontSize: '0.82rem', fontWeight: selected ? 600 : 400 }}>{classLabel(cls)}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div style={{ borderRadius: 12, border: '1.5px solid var(--sky-light)', padding: '1rem', background: '#fafeff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--charcoal)' }}>Class Teacher Assignment</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--charcoal-light)', background: '#f0f0f0', padding: '2px 8px', borderRadius: 20 }}>Optional</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--charcoal-light)', margin: '0 0 0.8rem 0' }}>
                      Assign this teacher as class teacher for a class &amp; section. When enabled by admin, they can view all subjects&apos; marks for that class (read-only).
                    </p>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal-light)', display: 'block', marginBottom: 3 }}>Class</label>
                        <select style={{ ...inputStyle, marginTop: 0, background: 'white' }} value={form.classTeacherClass} onChange={e => setForm({ ...form, classTeacherClass: e.target.value, classTeacherSection: '' })}>
                          <option value="">— No assignment —</option>
                          {classOptions.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--charcoal-light)', display: 'block', marginBottom: 3 }}>Section</label>
                        <select style={{ ...inputStyle, marginTop: 0, background: form.classTeacherClass ? 'white' : '#f5f5f5' }} value={form.classTeacherSection} onChange={e => setForm({ ...form, classTeacherSection: e.target.value })} disabled={!form.classTeacherClass}>
                          <option value="">—</option>
                          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    {form.classTeacherClass && form.classTeacherSection && (
                      <div style={{ marginTop: '0.7rem', background: '#e6f9ee', borderRadius: 8, padding: '0.5rem 0.8rem', fontSize: '0.78rem', color: '#1a8a3c', fontWeight: 600 }}>
                        Will be assigned as Class Teacher for {form.classTeacherClass} – Section {form.classTeacherSection}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {error && <p style={{ color: '#c0392b', fontSize: '0.78rem', background: '#fff5f5', padding: '8px 12px', borderRadius: 8, marginTop: '1rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.5rem' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1.5px solid var(--sky-light)', background: 'white', fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '0.7rem', borderRadius: 10, background: 'var(--sky)', border: 'none', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', color: 'white' }}>
                {loading ? 'Saving...' : editing ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: '0.8rem' }}>⚠️</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Delete {deleteConfirm.name}?</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>This will permanently remove @{deleteConfirm.username}.</p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1.5px solid var(--sky-light)', background: 'white', fontFamily: 'Poppins', fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, background: '#c0392b', border: 'none', color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}