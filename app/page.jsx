'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: '📝', title: 'Class Test Marks', desc: 'Record and track multiple test scores per subject easily.' },
    { icon: '📊', title: 'Exam Results', desc: 'Manage term and final exam marks across all subjects.' },
    { icon: '🗓️', title: 'Attendance', desc: 'Mark daily attendance with present, absent or late status.' },
    { icon: '📋', title: 'Student Notes', desc: 'Add personal notes and remarks for individual students.' },
    { icon: '🏫', title: 'Class Reports', desc: 'Admin can view full class performance at a glance.' },
    { icon: '👤', title: 'Student Reports', desc: 'Generate detailed reports for any student across subjects.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Poppins', sans-serif;
          color: #2b2b2b;
          overflow-x: hidden;
        }

        /* ── NAVBAR ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 2.5rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(135,206,250,0.2);
        }
        .nav-logo { display: flex; align-items: center; text-decoration: none; }
        .nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .nav-link {
          font-size: 0.85rem; color: #555; text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .nav-link:hover { color: #2b2b2b; }
        .nav-ext {
          font-size: 0.85rem; color: #555; font-weight: 500;
          display: flex; align-items: center; gap: 4px;
          text-decoration: none; transition: color 0.2s;
        }
        .nav-ext:hover { color: #2b2b2b; }
        .nav-btn {
          background: #87cefa; color: #2b2b2b; border: none;
          border-radius: 30px; padding: 0.55rem 1.5rem;
          font-family: 'Poppins', sans-serif; font-weight: 600;
          font-size: 0.88rem; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(135,206,250,0.4);
        }
        .nav-btn:hover { background: #5bb8f5; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg,
            #c8e8f8 0%,
            #ddf0fa 20%,
            #e8f5fd 35%,
            #f5f0e8 55%,
            #f9ecd8 70%,
            #fce8d0 85%,
            #fde8cc 100%
          );
          display: flex;
          align-items: center;
          padding: 6rem 2.5rem 3rem;
          position: relative;
          overflow: hidden;
        }

        /* subtle radial glow */
        .hero::before {
          content: '';
          position: absolute;
          top: -10%; left: -5%;
          width: 60%; height: 80%;
          background: radial-gradient(ellipse, rgba(135,206,250,0.3) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -10%; right: -5%;
          width: 55%; height: 70%;
          background: radial-gradient(ellipse, rgba(253,200,160,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: center;
        }

        .hero-left { }
        .hero-eyebrow {
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em;
          color: #5aa8d0; text-transform: uppercase; margin-bottom: 1rem;
        }
        .hero-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.15;
          color: #1a1a1a;
          margin-bottom: 1.2rem;
        }
        .hero-title em {
          font-style: italic; font-weight: 800;
        }
        .hero-title strong {
          font-style: italic; font-weight: 800;
          display: block;
        }
        .hero-sub {
          font-size: 1rem; color: #555; line-height: 1.7;
          max-width: 440px; margin-bottom: 2.5rem; font-weight: 400;
        }
        .hero-signin-btn {
          background: #87cefa; color: #1a1a1a;
          border: none; border-radius: 40px;
          padding: 1rem 2.8rem;
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 1rem; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(135,206,250,0.45);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .hero-signin-btn:hover {
          background: #5bb8f5; transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(135,206,250,0.5);
        }

        /* mock card on right */
        .hero-right {
          position: relative;
          display: flex; justify-content: flex-end;
        }
        .mock-wrap {
          position: relative; width: 100%; max-width: 440px;
        }
        .mock-card {
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(135,206,250,0.3);
          box-shadow: 0 12px 48px rgba(100,160,200,0.2);
          overflow: hidden;
        }
        .mock-bar {
          background: linear-gradient(90deg, #87cefa 0%, #b8e4fd 100%);
          padding: 0.7rem 1.2rem;
          display: flex; align-items: center; gap: 6px;
        }
        .mock-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.55); }
        .mock-bar-title {
          margin-left: 6px; font-size: 0.78rem; font-weight: 600; color: #1a4a6b;
        }
        .mock-body { padding: 0.8rem 1rem; }
        .mock-row {
          display: grid;
          grid-template-columns: 52px 1fr 60px 60px 60px;
          gap: 4px; padding: 0.38rem 0;
          border-bottom: 1px solid #f0f8ff;
          font-size: 0.75rem; align-items: center;
        }
        .mock-row.hd {
          font-weight: 600; font-size: 0.68rem;
          text-transform: uppercase; letter-spacing: 0.04em; color: #888;
        }
        .chip {
          border-radius: 6px; padding: 3px 8px;
          font-weight: 600; font-size: 0.72rem; text-align: center;
        }
        .chip-g { background: #e6f9ee; color: #1a8a3c; }
        .chip-y { background: #fff8e1; color: #b87c00; }

        /* floating chips */
        .float-chip {
          position: absolute;
          background: white; border-radius: 12px;
          border: 1px solid rgba(135,206,250,0.35);
          box-shadow: 0 4px 20px rgba(135,206,250,0.18);
          padding: 0.65rem 0.9rem;
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; white-space: nowrap;
          animation: floatY 3s ease-in-out infinite;
        }
        .float-chip.fc-left { left: -50px; top: 28%; animation-delay: 0s; }
        .float-chip.fc-right { right: -30px; bottom: 18%; animation-delay: 1.2s; }
        .fc-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: #d0ecfd;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .fc-label { font-weight: 700; font-size: 0.8rem; color: #2b2b2b; }
        .fc-sub { font-size: 0.68rem; color: #888; }

        /* ── FEATURES ── */
        .features-section {
          background: #f4faff;
          padding: 5rem 2.5rem;
        }
        .section-wrap { max-width: 1000px; margin: 0 auto; }
        .section-eyebrow {
          text-align: center; font-size: 0.75rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #5aa8d0; margin-bottom: 0.7rem;
        }
        .section-title {
          text-align: center;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700; color: #1a1a1a; margin-bottom: 0.7rem;
        }
        .section-sub {
          text-align: center; font-size: 0.88rem; color: #666;
          max-width: 440px; margin: 0 auto 3rem; line-height: 1.7;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.2rem;
        }
        .feat-card {
          background: white; border-radius: 16px;
          border: 1px solid rgba(135,206,250,0.25);
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(135,206,250,0.08);
          transition: all 0.2s;
        }
        .feat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(135,206,250,0.18);
          border-color: rgba(135,206,250,0.5);
        }
        .feat-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: linear-gradient(135deg, #d0ecfd, #e8f7ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 0.9rem;
        }
        .feat-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 0.35rem; }
        .feat-desc { font-size: 0.8rem; color: #666; line-height: 1.6; }

        /* ── PORTALS ── */
        .portals-section {
          background: white;
          padding: 5rem 2.5rem;
        }
        .portals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.2rem; margin-top: 2.5rem;
        }
        .portal-card {
          border-radius: 18px; padding: 2rem 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .portal-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.1); }
        .pc-teacher {
          background: linear-gradient(135deg, #e8f6fe, #d0ecfd);
          border: 1.5px solid rgba(135,206,250,0.4);
        }
        .pc-admin {
          background: linear-gradient(135deg, #2b2b2b, #3a4a5a);
          border: 1.5px solid #2b2b2b;
        }
        .pc-student {
          background: white;
          border: 1.5px dashed rgba(135,206,250,0.5);
        }
        .portal-emoji { font-size: 30px; display: block; margin-bottom: 0.9rem; }
        .portal-name { font-weight: 700; font-size: 1.05rem; margin-bottom: 0.45rem; }
        .portal-desc { font-size: 0.8rem; line-height: 1.65; }
        .portal-badge {
          display: inline-block; margin-top: 1rem;
          border-radius: 20px; padding: 3px 12px;
          font-size: 0.7rem; font-weight: 600;
        }
        .pb-avail {
          background: rgba(135,206,250,0.2);
          border: 1px solid rgba(135,206,250,0.4);
          color: #2a7ab0;
        }
        .pb-admin-avail {
          background: rgba(135,206,250,0.15);
          border: 1px solid rgba(135,206,250,0.3);
          color: #87cefa;
        }
        .pb-coming {
          background: #f4faff;
          border: 1px solid #d0ecfd;
          color: #aaa;
        }

        /* ── FOOTER ── */
        .footer {
          background: #2b2b2b;
          padding: 3rem 2.5rem 1.5rem;
        }
        .footer-top {
          display: flex; align-items: center; gap: 1rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.5rem;
        }
        .footer-school-name {
          font-size: 1.1rem; font-weight: 700;
          color: white; letter-spacing: 0.02em;
        }
        .footer-school-sub {
          font-size: 0.75rem; color: rgba(255,255,255,0.45);
          margin-top: 2px;
        }
        .footer-copy {
          text-align: center; font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }

        /* ── ANIMATIONS ── */
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .nav { padding: 0.75rem 1.2rem; }
          .nav-link, .nav-ext { display: none; }
          .hero { padding: 5rem 1.5rem 3rem; }
          .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .hero-right { justify-content: center; }
          .float-chip { display: none; }
          .features-section, .portals-section { padding: 3.5rem 1.5rem; }
          .footer { padding: 2rem 1.5rem 1.2rem; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="nav">
        <div className="nav-logo">
          <Image
            src="/kds-logo-tb-black-wm.png"
            alt="Kids Den School"
            width={160}
            height={40}
            style={{ objectFit: 'contain', height: 38, width: 'auto' }}
            priority
          />
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => window.location.href = '/login'}>
            Sign In
          </button>
          <a href="#" className="nav-link">Support</a>
          <a href="https://www.kidsdenschool.in" target="_blank"
            rel="noopener noreferrer" className="nav-ext">
            www.kidsdenschool.in →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">

          {/* Left */}
          <div className="hero-left">
            <p className="hero-eyebrow">Staff & Student Portal</p>
            <h1 className="hero-title">
              <em>Welcome to</em>
              <strong><em>my.</em>kidsdenschool</strong>
            </h1>
            <p className="hero-sub">
              A simple and secure portal for Kids Den School students and teachers
              to access their learning and teaching resources.
            </p>
            <button className="hero-signin-btn"
              onClick={() => window.location.href = '/login'}>
              Sign In
            </button>
          </div>

          {/* Right — mock UI */}
          <div className="hero-right">
            <div className="mock-wrap">

              {/* Left float */}
              <div className="float-chip fc-left">
                <div className="fc-icon">✅</div>
                <div>
                  <div className="fc-label">32 Present</div>
                  <div className="fc-sub">Today's attendance</div>
                </div>
              </div>

              <div className="mock-card">
                <div className="mock-bar">
                  <div className="mock-dot" /><div className="mock-dot" /><div className="mock-dot" />
                  <span className="mock-bar-title">📖 Class VIII A — English · Test Marks</span>
                </div>
                <div className="mock-body">
                  <div className="mock-row hd">
                    <span>Roll</span>
                    <span>Student Name</span>
                    <span style={{textAlign:'center'}}>Test 1</span>
                    <span style={{textAlign:'center'}}>Test 2</span>
                    <span style={{textAlign:'center'}}>Test 3</span>
                  </div>
                  {[
                    { r:'8101', n:'Aarav Mehta',  s:['g','g','y'], v:[92,88,74] },
                    { r:'8102', n:'Diya Sharma',  s:['g','y','g'], v:[95,79,91] },
                    { r:'8103', n:'Rohan Nair',   s:['y','g','g'], v:[76,85,88] },
                    { r:'8104', n:'Priya Iyer',   s:['g','g','g'], v:[89,93,96] },
                  ].map(row => (
                    <div className="mock-row" key={row.r}>
                      <span style={{fontWeight:600}}>{row.r}</span>
                      <span>{row.n}</span>
                      {row.v.map((val,i) => (
                        <span key={i} className={`chip chip-${row.s[i]}`}>{val}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right float */}
              <div className="float-chip fc-right">
                <div className="fc-icon">📊</div>
                <div>
                  <div className="fc-label">87% Avg</div>
                  <div className="fc-sub">Class performance</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-wrap">
          <p className="section-eyebrow">What's inside</p>
          <h2 className="section-title">Everything teachers need</h2>
          <p className="section-sub">
            A focused set of tools that cover the full academic workflow without the clutter.
          </p>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALS ── */}
      <section className="portals-section">
        <div className="section-wrap">
          <p className="section-eyebrow">Access Levels</p>
          <h2 className="section-title">Three portals, one school</h2>
          <p className="section-sub">Purpose-built access for every role in your school.</p>
          <div className="portals-grid">
            <div className="portal-card pc-teacher">
              <span className="portal-emoji">🧑‍🏫</span>
              <div className="portal-name">Teacher Portal</div>
              <div className="portal-desc">
                Access your assigned classes, record test and exam marks,
                mark attendance, and add student notes.
              </div>
              <span className="portal-badge pb-avail">✓ Available now</span>
            </div>
            <div className="portal-card pc-admin">
              <span className="portal-emoji">🔑</span>
              <div className="portal-name" style={{color:'white'}}>Admin Portal</div>
              <div className="portal-desc" style={{color:'rgba(255,255,255,0.65)'}}>
                Manage users, students, and classes. View reports for any
                class or individual student.
              </div>
              <span className="portal-badge pb-admin-avail">✓ Available now</span>
            </div>
            <div className="portal-card pc-student">
              <span className="portal-emoji">🎒</span>
              <div className="portal-name" style={{color:'#888'}}>Student Portal</div>
              <div className="portal-desc" style={{color:'#aaa'}}>
                Students will be able to view their own marks,
                attendance records and teacher notes.
              </div>
              <span className="portal-badge pb-coming">🚧 Coming in Stage 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <div className="footer-top">
            <Image
              src="/kds-logo-tb-white-wm.png"
              alt="Kids Den School"
              width={180}
              height={45}
              style={{ objectFit: 'contain', height: 42, width: 'auto' }}
            />
          </div>
          <p className="footer-copy">Copyright {new Date().getFullYear()} – Kids Den School</p>
        </div>
      </footer>
    </>
  );
}