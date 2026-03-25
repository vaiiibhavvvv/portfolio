'use client';

import { useEffect, useRef } from 'react';
import { EXPERIENCE } from '@/lib/data';
import styles from './Experience.module.css';

function TimelineItem({ item, index }) {
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(
            () => entry.target.classList.add(styles.visible),
            index * 120
          );
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={itemRef} className={styles.item}>
      <div className={styles.dot} />
      <div className={styles.card}>
        <div className={styles.period}>{item.period}</div>
        <h3 className={styles.role}>{item.role}</h3>
        <div className={styles.company}>{item.company}</div>
        <p className={styles.desc}>{item.desc}</p>
        <div className={styles.skillTags}>
          {item.skills.map(s => (
            <span key={s} className={styles.skillTag}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>
      <div className={`${styles.header} reveal`}>
        <span className="section-label">Journey</span>
        <h2 className="section-title">Experience</h2>
        <p className="section-desc">
          A decade of building products that matter — from early-stage startups
          to global enterprises.
        </p>
      </div>

      <div className={styles.timeline}>
        {EXPERIENCE.map((item, i) => (
          <TimelineItem key={item.role} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
