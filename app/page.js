'use client';

import Cursor from '../components/ui/Cursor';
import Loader from '@/components/ui/Loader';
import Noise from '@/components/ui/Noise';
import AmbientOrbs from '@/components/ui/AmbientOrbs';
import Header from '@/components/ui/Header';
import JupiterCanvas from '@/components/three/JupiterCanvas';
import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <>
      {/* Overlays & chrome */}
      <Cursor />
      <Loader />
      <Noise />
      <AmbientOrbs />

      {/* Fixed 3D background — renders behind everything */}
      <JupiterCanvas />

      {/* Fixed navigation */}
      <Header />

      {/* Page content */}
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
