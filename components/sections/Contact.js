'use client';

import { useEffect, useRef, useState } from 'react';
import { SOCIAL_LINKS } from '@/lib/data';
import styles from './Contact.module.css';

export default function Contact() {
  const sectionRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  // Reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el    = entry.target;
          const delay = parseFloat(el.style.getPropertyValue('--delay') || '0') * 1000;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    setStatus('sending');
    // Simulate async send — swap for a real API call (e.g. Resend, EmailJS)
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      {/* ── Left column ── */}
      <div className={`${styles.left} reveal`}>
        <span className="section-label">Get In Touch</span>
        <h2 className="section-title">
          Let&apos;s Build Something Extraordinary
        </h2>
        <p className={styles.blurb}>
          Whether you have a groundbreaking idea, an ambitious project, or just
          want to say hello — I&apos;m always open to a conversation.
        </p>

        <div className={styles.socialList}>
          {SOCIAL_LINKS.map(link => (
            <a key={link.label} href={link.href} className={styles.socialLink}>
              <span className={styles.socialIcon}>{link.icon}</span>
              <div>
                <div className={styles.socialLabel}>{link.label}</div>
                <div className={styles.socialSub}>{link.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Right column — form ── */}
      <div className={`${styles.right} reveal`} style={{ '--delay': '0.15s' }}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="jane@company.com"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project Type</label>
            <input
              type="text"
              placeholder="Web App, 3D Experience, Consulting…"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Message</label>
            <textarea
              placeholder="Tell me about your project…"
              className={styles.textarea}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={status !== 'idle'}
            style={
              status === 'sent'
                ? { background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 4px 24px rgba(16,185,129,0.4)' }
                : {}
            }
          >
            {status === 'idle'    && 'Send Message'}
            {status === 'sending' && 'Sending…'}
            {status === 'sent'    && '✓ Message Sent!'}
          </button>
        </form>
      </div>
    </section>
  );
}
