'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { makeJupiterTexture, makeRingTexture } from '@/lib/jupiterTexture';

// ─────────────────────────────────────────────────────────
// JupiterCanvas
// Renders a fixed-position Three.js canvas that sits behind
// all page content.  The scene contains:
//   • Jupiter with procedural banded texture
//   • Four ring layers with radial UV textures
//   • Ring shadow on the planet
//   • Galilean moons (Io, Europa, Ganymede, Callisto)
//   • 2 000-point star field
//   • Mouse drag + momentum rotation
//   • Scroll-driven camera pull-back
// ─────────────────────────────────────────────────────────

const MOON_DATA = [
  { name: 'Io',       r: 0.10, dist: 3.4, speed: 0.9,  color: 0xd4b040, phase: 0 },
  { name: 'Europa',   r: 0.08, dist: 4.4, speed: 0.5,  color: 0xc8c8d0, phase: 1.2 },
  { name: 'Ganymede', r: 0.13, dist: 5.8, speed: 0.28, color: 0xa0907a, phase: 2.4 },
  { name: 'Callisto', r: 0.12, dist: 7.4, speed: 0.14, color: 0x706050, phase: 4.0 },
];

const RING_LAYERS = [
  { inner: 1.72, outer: 1.92, ia: 0.55, oa: 0.35, bc: '210,170,110', dc: '180,140,90',  op: 0.72 },
  { inner: 1.92, outer: 2.20, ia: 0.40, oa: 0.22, bc: '230,190,130', dc: '160,120,70',  op: 0.58 },
  { inner: 2.20, outer: 2.55, ia: 0.20, oa: 0.08, bc: '200,160,100', dc: '140,110,60',  op: 0.42 },
  { inner: 2.55, outer: 2.90, ia: 0.10, oa: 0.03, bc: '180,140,90',  dc: '120,90,50',   op: 0.28 },
];

export default function JupiterCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Scene & Camera ─────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.set(0, 1.2, 6.5);

    // ── Jupiter group ──────────────────────────────────────
    const jupiterGroup = new THREE.Group();
    scene.add(jupiterGroup);

    // Planet body
    const jupiterGeo = new THREE.SphereGeometry(1.5, 80, 60);
    const jupiterTex = makeJupiterTexture();
    jupiterTex.wrapS = jupiterTex.wrapT = THREE.RepeatWrapping;
    const jupiterMat = new THREE.MeshPhongMaterial({
      map: jupiterTex,
      specular: new THREE.Color(0x221100),
      shininess: 8,
      bumpMap: jupiterTex,
      bumpScale: 0.018,
    });
    const jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
    jupiter.rotation.z = THREE.MathUtils.degToRad(3.1);
    jupiterGroup.add(jupiter);

    // Atmosphere shell
    const atmosMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.54, 48, 36),
      new THREE.MeshPhongMaterial({
        color: 0xd49050,
        emissive: 0x3a1a00,
        transparent: true,
        opacity: 0.08,
        side: THREE.FrontSide,
      })
    );
    jupiterGroup.add(atmosMesh);

    // ── Ring system ────────────────────────────────────────
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = Math.PI / 2;
    ringGroup.rotation.z = THREE.MathUtils.degToRad(-3.1);
    jupiterGroup.add(ringGroup);

    RING_LAYERS.forEach(rl => {
      const geo = new THREE.RingGeometry(rl.inner, rl.outer, 200, 4);
      // Remap UVs for radial texture mapping
      const pos = geo.attributes.position;
      const uv  = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        uv.setXY(i, (r - rl.inner) / (rl.outer - rl.inner), 0.5);
      }
      const mat = new THREE.MeshBasicMaterial({
        map: makeRingTexture(rl.ia, rl.oa, rl.bc, rl.dc),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: rl.op,
        depthWrite: false,
      });
      ringGroup.add(new THREE.Mesh(geo, mat));
    });

    // Ring shadow on planet surface
    const shadowCurve  = new THREE.EllipseCurve(0, 0, 1.48, 0.28, 0, Math.PI * 2);
    const shadowShape  = new THREE.Shape(shadowCurve.getPoints(80));
    const holeCurve    = new THREE.EllipseCurve(0, 0, 0.6,  0.14, 0, Math.PI * 2);
    shadowShape.holes.push(new THREE.Path(holeCurve.getPoints(60)));
    const shadowMesh = new THREE.Mesh(
      new THREE.ShapeGeometry(shadowShape),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2.2;
    shadowMesh.position.y = -0.05;
    jupiterGroup.add(shadowMesh);

    // ── Moons ──────────────────────────────────────────────
    const moons = MOON_DATA.map(d => {
      const mesh  = new THREE.Mesh(
        new THREE.SphereGeometry(d.r, 24, 18),
        new THREE.MeshPhongMaterial({ color: d.color, specular: 0x111111, shininess: 12 })
      );
      const pivot = new THREE.Group();
      mesh.position.x  = d.dist;
      pivot.rotation.y = d.phase;
      pivot.rotation.z = (Math.random() - 0.5) * 0.18;
      pivot.add(mesh);
      scene.add(pivot);

      // Faint orbit ring
      const orbitMesh = new THREE.Mesh(
        new THREE.RingGeometry(d.dist - 0.005, d.dist + 0.005, 120),
        new THREE.MeshBasicMaterial({
          color: 0x4466aa,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
        })
      );
      orbitMesh.rotation.x = Math.PI / 2;
      scene.add(orbitMesh);

      return { mesh, pivot, ...d };
    });

    // ── Stars ──────────────────────────────────────────────
    const starCount = 2000;
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r     = 18 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xddeeff, size: 0.06, transparent: true, opacity: 0.7 })
      )
    );

    // ── Lights ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x221108, 1.2));
    const sunLight = new THREE.DirectionalLight(0xfff0d0, 2.8);
    sunLight.position.set(8, 4, 6);
    scene.add(sunLight);
    const fillLight = new THREE.DirectionalLight(0x0a0820, 0.4);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xc08050, 0.6, 20);
    rimLight.position.set(-5, 6, -3);
    scene.add(rimLight);

    // ── Interaction state ──────────────────────────────────
    let mouseX = 0, mouseY = 0, currentScrollY = 0;
    let isDragging = false, lastDragX = 0, lastDragY = 0;
    let dragVelX = 0, dragVelY = 0;
    let manualRotX = 0, manualRotY = 0;

    const onMouseMove = e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (isDragging) {
        dragVelX = (e.clientX - lastDragX) * 0.008;
        dragVelY = (e.clientY - lastDragY) * 0.008;
        manualRotY += dragVelX;
        manualRotX = Math.max(-1.2, Math.min(1.2, manualRotX + dragVelY));
        lastDragX = e.clientX;
        lastDragY = e.clientY;
      }
    };
    const onMouseDown = e => {
      isDragging = true;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragVelX = dragVelY = 0;
    };
    const onMouseUp = () => { isDragging = false; };
    const onScroll  = () => { currentScrollY = window.scrollY; };

    // Touch
    let lastTouchX = 0, lastTouchY = 0;
    const onTouchStart = e => {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };
    const onTouchMove = e => {
      manualRotY += (e.touches[0].clientX - lastTouchX) * 0.006;
      manualRotX  = Math.max(-1.2, Math.min(1.2,
        manualRotX + (e.touches[0].clientY - lastTouchY) * 0.006
      ));
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };

    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);

    // ── Animation loop ─────────────────────────────────────
    let t = 0;
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.004;

      // Momentum decay
      if (!isDragging) {
        dragVelX *= 0.92;
        dragVelY *= 0.92;
        manualRotY += dragVelX;
        manualRotX += dragVelY;
      }

      // Jupiter self-rotation (~10 h day)
      jupiter.rotation.y += 0.0025;

      // Group tilt driven by mouse + drag
      const targetRotX = manualRotX + mouseY * 0.12;
      const targetRotY = manualRotY + mouseX * 0.18;
      jupiterGroup.rotation.x += (targetRotX - jupiterGroup.rotation.x) * 0.06;
      jupiterGroup.rotation.y += (targetRotY - jupiterGroup.rotation.y) * 0.06;

      // Moon orbits
      moons.forEach(m => { m.pivot.rotation.y += m.speed * 0.002; });

      // Camera parallax + scroll pull-back
      const scrollFactor = currentScrollY * 0.0008;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.35 - camera.position.y) * 0.03;
      camera.position.z  = 6.5 - scrollFactor * 2.5;
      camera.lookAt(scene.position);

      // Sunlight shimmer
      sunLight.position.x = 8 + Math.sin(t * 0.3) * 0.5;
      sunLight.position.y = 4 + Math.cos(t * 0.2) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      document.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    />
  );
}
