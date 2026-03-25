// AmbientOrbs — large blurred colour blobs that give
// depth to the dark background without using images.
const orbs = [
  { w: 600, h: 600, bg: '#3a1a05', top: '-200px', right: '-100px', left: 'auto', bottom: 'auto', opacity: 0.18 },
  { w: 500, h: 500, bg: '#1a0a00', bottom: '10%',  left: '-150px', top: 'auto',  right: 'auto',  opacity: 0.18 },
  { w: 300, h: 300, bg: '#2a1500', bottom: '30%',  right: '15%',   top: 'auto',  left: 'auto',   opacity: 0.12 },
];

export default function AmbientOrbs() {
  return (
    <>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0,
            width: o.w,
            height: o.h,
            background: o.bg,
            top: o.top,
            right: o.right,
            bottom: o.bottom,
            left: o.left,
            opacity: o.opacity,
          }}
        />
      ))}
    </>
  );
}
