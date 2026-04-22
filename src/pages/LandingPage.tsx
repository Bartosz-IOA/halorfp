// src/pages/LandingPage.tsx
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Check, X } from 'lucide-react';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const BG      = '#152238';
const YELLOW  = '#F0FF40';
const NAVY_MID = '#1A2E45';

const TOOL_TAGS = ['GO / NO-GO', 'CONTRACT RISK', 'FEE ESTIMATION', 'RFI GENERATION', 'SUPPLIER SELECTION', 'BID LEARNING'];
const TODAY_ITEMS = [
  'Email threads and ad-hoc meetings',
  'Decisions taken off-system by different people at different times',
  'No audit trail for go/no-go, contracts or fee submissions',
  'Commercial and legal risk missed under time pressure',
  'Lost knowledge when staff leave',
];
const HALO_ITEMS = [
  'Structured agents covering every pre-contract stage',
  'Policy-encoded logic applied consistently every time',
  'Defensible, explainable output at each decision point',
  'Risk surfaced automatically — contracts, fees, suppliers',
  'Institutionalised decision memory that grows over time',
];

// ─── ANIMATED PARTICLE FIELD ────────────────────────────────────────────────
// Diamond/square shapes in mixed colors — matches the reference animation
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Particle = { x: number; y: number; size: number; color: string; speedX: number; speedY: number; opacity: number; fadeSpeed: number; fadingIn: boolean; angle: number };
    const COLORS = [
      'rgba(100,160,220,1)',  // steel blue
      'rgba(240,255,64,1)',   // lime yellow
      'rgba(80,200,200,1)',   // teal
      'rgba(180,200,240,1)',  // pale blue
      'rgba(255,255,255,1)',  // white
      'rgba(200,140,60,1)',   // amber
    ];
    let particles: Particle[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      init();
    };

    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speedX: (Math.random() - 0.5) * 0.1, // Slow horizontal movement
          speedY: (Math.random() - 0.5) * 0.1, // Slow vertical movement
          opacity: Math.random(),
          fadeSpeed: Math.random() * 0.005 + 0.002,
          fadingIn: Math.random() > 0.5,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        // Handle fading
        if (p.fadingIn) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 1) p.fadingIn = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0) {
            p.fadingIn = true;
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        const rgba = p.color.replace('1)', `${p.opacity * 0.5})`);
        ctx.fillStyle = rgba;
        ctx.beginPath();
        ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.fill();
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += 0.002;

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const maxW = '1200px';
  const px = '40px';

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', color: '#fff', position: 'relative', fontFamily: "'Inter', Arial, sans-serif", overflowX: 'hidden' }}>
      <ParticleField />

      {/* ── NAV ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: maxW, margin: '0 auto', padding: `20px ${px}`,
      }}>
        <img src="/halo-wordmark.svg" alt="HALO" style={{ height: '26px', width: 'auto' }} />
        <NavLink
          to="/login"
          style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          Log In
        </NavLink>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: maxW, margin: '0 auto', padding: `40px ${px} 80px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '60px', alignItems: 'center' }}>

          {/* LEFT: Copy */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Pre-Contract Intelligence for Enterprise Bidding
            </p>

            {/* Pill badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {['PRE-CONTRACT INTELLIGENCE', 'ENTERPRISE BIDDING'].map(t => (
                <span key={t} style={{
                  border: `1px solid ${YELLOW}`, color: YELLOW,
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                  padding: '4px 14px', borderRadius: '999px', textTransform: 'uppercase',
                }}>{t}</span>
              ))}
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(52px, 6vw, 84px)',
              fontWeight: 800, fontStyle: 'italic',
              lineHeight: 1.0, color: '#ffffff',
              margin: '0 0 24px', letterSpacing: '-0.02em',
            }}>
              Win more.<br />Bid smarter.
            </h1>

            {/* Sub-copy */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, maxWidth: '460px', marginBottom: '28px' }}>
              AI agents governing your entire pre-contract process —
              from first opportunity to contract signature. Structured,
              auditable, defensible at every stage.
            </p>

            {/* Tool tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
              {TOOL_TAGS.map(t => (
                <span key={t} style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                  padding: '5px 14px', borderRadius: '3px', textTransform: 'uppercase',
                }}>{t}</span>
              ))}
            </div>

            {/* CTA */}
            <button style={{
              background: YELLOW, color: '#0f1c2e',
              fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '16px 40px',
              borderRadius: '999px', border: 'none', cursor: 'pointer',
              boxShadow: `0 0 24px ${YELLOW}40`,
            }}>
              Request a 2-month proof of value
            </button>
          </div>

          {/* RIGHT: Particle image */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <img
              src="/hero-particles.png"
              alt="AI intelligence visualization"
              style={{ width: '100%', maxWidth: '600px', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: maxW, margin: '0 auto', padding: `0 ${px} 80px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { value: '2 days → 15 min', label: 'Decision time,\nper opportunity' },
            { value: '±2,500 hrs', label: 'Saved per year\nper client' },
            { value: '2–3×', label: 'ROI on annual\nplatform cost' },
          ].map(s => (
            <div key={s.value} style={{
              background: NAVY_MID, border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '32px',
            }}>
              <p style={{ fontWeight: 700, fontSize: '24px', color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: maxW, margin: '0 auto', padding: `0 ${px} 100px` }}>
        <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', background: '#000', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <video controls preload="metadata" style={{ width: '100%', display: 'block', aspectRatio: '16/9' }}>
            <source src="https://files.catbox.moe/ukmsln.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ── TODAY vs HALO ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: maxW, margin: '0 auto', padding: `0 ${px} 100px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

          {/* TODAY side */}
          <div style={{ opacity: 0.5 }}>
            <span style={{
              display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              padding: '6px 18px', borderRadius: '999px', marginBottom: '24px',
            }}>Today</span>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '24px', padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {TODAY_ITEMS.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: 1.7, marginBottom: '18px' }}>
                    <X size={16} style={{ flexShrink: 0, marginTop: '3px', color: 'rgba(255,255,255,0.3)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HALO side */}
          <div>
            <div style={{ marginBottom: '24px', paddingLeft: '10px' }}>
              <img src="/halo-wordmark.svg" alt="HALO" style={{ height: '28px', width: 'auto' }} />
            </div>
            <div style={{
              background: 'rgba(26, 46, 69, 0.6)', 
              borderRadius: '24px', padding: '32px',
              border: `1px solid ${YELLOW}40`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 40px ${YELLOW}10`,
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {HALO_ITEMS.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#fff', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px', fontWeight: 500 }}>
                    <Check size={18} style={{ flexShrink: 0, marginTop: '3px', color: YELLOW }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE PILL ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: maxW, margin: '0 auto', padding: `0 ${px} 80px` }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          border: `1px solid ${YELLOW}44`,
          borderRadius: '999px', padding: '8px 24px',
        }}>
          <span style={{ color: YELLOW, fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            + Every pre-contract decision becomes: Structured · Reviewable · Defensible
          </span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: `40px ${px}`,
      }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <img src="/halo-wordmark.svg" alt="HALO" style={{ height: '20px', width: 'auto' }} />

          <button style={{
            border: `2px solid ${YELLOW}`, color: YELLOW,
            background: 'transparent', fontWeight: 700, fontSize: '9px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '10px 32px', borderRadius: '999px', cursor: 'pointer',
          }}>
            Request a Demo
          </button>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>
            © 2026 HALO · Pre-Contract Intelligence for Enterprise Bidding
          </p>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', textAlign: 'right' }}>
            Albert House, 256-260 Old Street · London EC1V 9DD
          </p>
        </div>
      </footer>
    </div>
  );
};
