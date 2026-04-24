import Spinner from './Spinner';

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <>
      <style>{`
        @keyframes kds-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kds-page-loader {
          min-height: 60vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem;
          animation: kds-fade-in 0.3s ease both;
        }
        .kds-loader-msg {
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 500;
          color: var(--charcoal-light, #6b6b6b);
        }
        .kds-loader-dots span {
          display: inline-block;
          animation: kds-dot 1.2s ease-in-out infinite;
          font-size: 1.1rem; line-height: 1;
        }
        .kds-loader-dots span:nth-child(2) { animation-delay: 0.2s; }
        .kds-loader-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes kds-dot {
          0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
          40%            { opacity: 1;   transform: translateY(-4px); }
        }
      `}</style>
      <div className="kds-page-loader">
        <Spinner size={32} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="kds-loader-msg">{message}</span>
          <span className="kds-loader-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    </>
  );
}