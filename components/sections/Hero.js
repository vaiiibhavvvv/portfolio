'use client';

import styles from './Hero.module.css';

export default function Hero() {
  const scrollTo = href => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      <p className={styles.eyebrow}>Creative Developer &amp; 3D Designer</p>

      <h1 className={styles.title}>
        <span className={styles.line}>Crafting Digital</span>
        <span className={`${styles.line} ${styles.gradient}`}>Experiences</span>
        <span className={styles.line}>Beyond Reality</span>
      </h1>

      <p className={styles.sub}>
        I build immersive web experiences that blur the line between design and
        technology — pixel-perfect, performance-first.
      </p>

      <div className={styles.actions}>
        <button className="btn-primary" onClick={() => scrollTo('#projects')}>
          View My Work
        </button>
        <button className="btn-secondary" onClick={() => scrollTo('#contact')}>
          Let&apos;s Talk
        </button>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>

      {/* Drag hint */}
      <div className={styles.dragHint}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          stroke="rgba(200,215,255,0.3)" strokeWidth="1.2">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3l2 1" />
        </svg>
        <span>Drag to rotate</span>
      </div>
    </section>
  );
}
