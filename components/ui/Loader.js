'use client';

import { useEffect, useRef } from 'react';
import styles from './Loader.module.css';

export default function Loader() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.6s ease';
      setTimeout(() => { el.style.display = 'none'; }, 620);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className={styles.loader}>
      <div className={styles.ring} />
      <span className={styles.text}>Initializing</span>
    </div>
  );
}
