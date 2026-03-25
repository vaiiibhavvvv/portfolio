'use client';

import { useEffect, useRef } from 'react';
import { NAV_LINKS } from '@/lib/data';
import styles from './Header.module.css';

export default function Header() {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () =>
      header.classList.toggle(styles.scrolled, window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = href => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.logo}>
        Vaibhav Singh<span>.</span>
      </div>
      <nav className={styles.nav}>
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            className={styles.navLink}
            onClick={() => scrollTo(link.href)}
          >
            {link.label}
          </a>
        ))}
        <a
          className={`${styles.navLink} ${styles.navCta}`}
          onClick={() => scrollTo('#contact')}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
