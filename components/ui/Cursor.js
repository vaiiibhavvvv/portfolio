'use client';

import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

// ─────────────────────────────────────────────────────────
// Cursor — custom dot + lagging ring cursor
// Hides on mobile, expands on hoverable elements
// ─────────────────────────────────────────────────────────
export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const HOVERABLES = 'a, button, .skill-card, .project-card, .social-link, .timeline-card';
    const addHover = () => document.body.classList.add('hovering');
    const rmHover  = () => document.body.classList.remove('hovering');

    const attach = () => {
      document.querySelectorAll(HOVERABLES).forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', rmHover);
      });
    };
    attach();

    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
