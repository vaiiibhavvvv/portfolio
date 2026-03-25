# Portfolio — Next.js + Three.js (Jupiter Edition)

A futuristic, immersive developer portfolio with a procedurally generated
interactive Jupiter scene, glassmorphism UI, and smooth scroll animations.

---

## Tech Stack

| Layer       | Library / Tool            |
|-------------|---------------------------|
| Framework   | Next.js 14 (App Router)   |
| Language    | JavaScript (no TypeScript) |
| 3D          | Three.js r163              |
| Animations  | CSS keyframes + IntersectionObserver |
| Styling     | CSS Modules + global CSS  |
| Fonts       | Google Fonts (Syne, DM Sans) |

---

## Project Structure

```
portfolio/
├── app/
│   ├── layout.js          ← Root layout: fonts, metadata, <html>
│   ├── page.js            ← Assembles all sections in order
│   └── globals.css        ← CSS variables, resets, shared utilities
│
├── components/
│   ├── three/
│   │   └── JupiterCanvas.js   ← Full Three.js scene (Jupiter, rings, moons, stars)
│   │
│   ├── sections/
│   │   ├── Hero.js / Hero.module.css
│   │   ├── Skills.js / Skills.module.css
│   │   ├── Projects.js / Projects.module.css
│   │   ├── Experience.js / Experience.module.css
│   │   └── Contact.js / Contact.module.css
│   │
│   └── ui/
│       ├── Cursor.js / Cursor.module.css   ← Custom cursor + ring
│       ├── Loader.js / Loader.module.css   ← Startup animation
│       ├── Header.js / Header.module.css   ← Fixed glassmorphism nav
│       ├── Noise.js                        ← Film-grain overlay
│       ├── AmbientOrbs.js                  ← Background glow blobs
│       └── Footer.js
│
├── lib/
│   ├── data.js            ← All portfolio content (skills, projects, experience)
│   └── jupiterTexture.js  ← Procedural canvas texture generators
│
├── next.config.js
├── package.json
└── README.md
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## Customisation Guide

### Change personal info
Edit **`lib/data.js`** — every array (SKILLS, PROJECTS, EXPERIENCE, SOCIAL_LINKS)
drives the UI. No other files need touching for content changes.

### Change colours / fonts
Edit the `:root` block at the top of **`app/globals.css`**.
All components consume CSS variables, so one change propagates everywhere.

### Swap Jupiter for a different planet
Edit **`lib/jupiterTexture.js`**:
- `makeJupiterTexture()` — change band colours and storm data
- `makeRingTexture()` — adjust ring opacity / colour strings

For a different planet entirely you can also adjust the lighting in
`JupiterCanvas.js` (sunLight colour/intensity) and MOON_DATA / RING_LAYERS
constants at the top of the same file.

### Add a real contact form
In **`components/sections/Contact.js`**, replace the `setTimeout` inside
`handleSubmit` with a real HTTP call (Resend, EmailJS, Formspree, etc.).

---

## Performance Notes

- Three.js canvas is `pointer-events: auto` so drag-to-rotate works even
  over the fixed canvas.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` caps retina
  overdraw.
- Star field uses `PointsMaterial` (GPU instancing) — no per-star draw calls.
- All textures are generated once in `useEffect` and reused.
- The `useEffect` cleanup in `JupiterCanvas.js` cancels the RAF loop and
  disposes the renderer on component unmount.
