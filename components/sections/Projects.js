'use client';

import { useEffect, useRef } from 'react';
import { PROJECTS } from '@/lib/data';
import styles from './Projects.module.css';

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const onMouseMove = e => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform  = `translateY(-8px) scale(1.01) rotateX(${-cy * 6}deg) rotateY(${cx * 6}deg)`;
    card.style.boxShadow  = `${-cx * 24}px ${-cy * 24}px 64px rgba(0,0,0,0.55), 0 0 40px rgba(79,142,247,0.08)`;
    card.style.borderColor = 'rgba(79,142,247,0.25)';
  };
  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform   = '';
    card.style.boxShadow   = '';
    card.style.borderColor = '';
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} reveal`}
      style={{ '--delay': `${index * 0.06}s` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Top shine line */}
      <div className={styles.shine} />

      {/* Preview area */}
      <div className={styles.preview}>
        <div className={styles.previewGradient} style={{ background: project.gradient }} />
        <div className={styles.previewEmoji}>{project.emoji}</div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.tags}>
          {project.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.desc}</p>
        <div className={styles.links}>
          <a href={project.demo}   className={styles.link}>Live Demo <ArrowIcon /></a>
          <a href={project.github} className={styles.link}>GitHub    <ArrowIcon /></a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className={styles.section}>
      <div className={`${styles.header} reveal`}>
        <span className="section-label">Portfolio</span>
        <h2 className="section-title">Selected Projects</h2>
        <p className="section-desc">
          A selection of my most impactful work — built with precision, shipped with purpose.
        </p>
      </div>

      <div className={styles.grid}>
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
