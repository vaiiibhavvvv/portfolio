'use client';

import { useEffect, useRef } from 'react';
import { SKILLS } from '@/lib/data';
import styles from './Skills.module.css';



function SkillCard({ skill, index }) {
  const cardRef = useRef(null);

  // 3-D tilt on mouse move
  const onMouseMove = e => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) scale(1.02) rotateX(${-cy * 8}deg) rotateY(${cx * 8}deg)`;
    card.style.boxShadow = `${-cx * 20}px ${-cy * 20}px 60px rgba(0,0,0,0.5), 0 0 30px rgba(79,142,247,0.1)`;
  };
  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} reveal`}
      style={{ '--delay': `${index * 0.05}s`, animationDelay: `${index * 0.05}s` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.icon}>{skill.icon}</div>
      <div className={styles.name}>{skill.name}</div>
      <div className={styles.level}>{skill.level}</div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${skill.pct}%` }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);

  // Intersection observer — triggers .reveal + bar fills
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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal') ?? [];
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      <div className={`${styles.header} reveal`}>
        <span className="section-label">Expertise</span>
        <h2 className="section-title">Skills &amp; Technologies</h2>
        <p className="section-desc">
          A curated set of tools I use to build exceptional digital products —
          from interactive 3D experiences to scalable cloud architectures.
        </p>
      </div>

      <div className={styles.grid}>
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </section>
  );
}
