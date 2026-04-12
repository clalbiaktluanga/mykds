'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      ...form, redirect: false,
    });
    if (res?.error) return setError('Invalid credentials');
    // Redirect based on role (stored in session)
    const session = await fetch('/api/auth/session').then(r => r.json());
    router.push(session?.user?.role === 'admin' ? '/admin' : '/teacher');
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ background:'white', borderRadius:'var(--radius)',
        padding:'2.5rem', width:'100%', maxWidth:'380px',
        boxShadow:'var(--shadow)', border:'1.5px solid var(--sky-light)' }}>
        
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:52, height:52, borderRadius:14,
            background:'var(--sky)', margin:'0 auto 1rem',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24 }}>🎒</div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:700, color:'var(--charcoal)' }}>
            myKDS
          </h1>
          <p style={{ fontSize:'0.82rem', color:'var(--charcoal-light)', marginTop:4 }}>
            Login to continue. <br />Need help? <a href="https://link.kidsdenschool.in/u1T4boZT" target="_blank" style={{ color:'var(--sky)' }}>Contact support</a>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ fontSize:'0.8rem', fontWeight:600,
              color:'var(--charcoal)', display:'block', marginBottom:6 }}>
              Username
            </label>
            <input
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              style={{ width:'100%', padding:'0.7rem 1rem', borderRadius:10,
                border:'1.5px solid var(--sky-light)', fontFamily:'Poppins',
                fontSize:'0.9rem', outline:'none' }}
              placeholder="Enter username"
            />
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ fontSize:'0.8rem', fontWeight:600,
              color:'var(--charcoal)', display:'block', marginBottom:6 }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{ width:'100%', padding:'0.7rem 1rem', borderRadius:10,
                border:'1.5px solid var(--sky-light)', fontFamily:'Poppins',
                fontSize:'0.9rem', outline:'none' }}
              placeholder="••••••••"
            />
          </div>
          {error && <p style={{ color:'#e05', fontSize:'0.8rem',
            marginBottom:'1rem' }}>{error}</p>}
          <button type="submit" style={{ width:'100%', padding:'0.8rem',
            background:'var(--sky)', color:'var(--charcoal)', border:'none',
            borderRadius:10, fontFamily:'Poppins', fontWeight:600,
            fontSize:'0.95rem', cursor:'pointer' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}