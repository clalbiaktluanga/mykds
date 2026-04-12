export default function Spinner({ size = 20, color = 'var(--sky-dark, #5bb8f5)' }) {
  return (
    <>
      <style>{`
        @keyframes kds-spin {
          to { transform: rotate(360deg); }
        }
        .kds-spinner {
          border-radius: 50%;
          animation: kds-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>
      <div className="kds-spinner" style={{
        width: size, height: size,
        border: `${Math.max(2, size / 8)}px solid rgba(135,206,250,0.25)`,
        borderTopColor: color,
      }} />
    </>
  );
}