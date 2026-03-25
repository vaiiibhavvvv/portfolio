export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '32px 48px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-dim)',
        fontSize: '13px',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}>
        Alex<span style={{ color: 'var(--blue)' }}>.</span>
      </div>
      <div>Designed &amp; built with ♥ — 2024</div>
      <div>All rights reserved</div>
    </footer>
  );
}
