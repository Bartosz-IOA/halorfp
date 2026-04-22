// src/pages/LandingPage.tsx
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Check, X } from 'lucide-react';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

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
  return (
    <div className="relative min-h-screen bg-navy-primary text-white font-sans overflow-x-hidden">
      <ParticleField />

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between max-w-[1200px] mx-auto px-6 py-5 md:px-10">
        <img src="/halo-wordmark.svg" alt="HALO" className="h-5 md:h-6 w-auto" />
        <NavLink
          to="/login"
          className="text-white/55 text-[10px] md:text-[11px] font-bold tracking-widest uppercase hover:text-yellow transition-colors"
        >
          Log In
        </NavLink>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-20">
        <div className="flex flex-col-reverse md:grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-center">
          {/* LEFT: Copy */}
          <div>
            <p className="text-white/45 text-[10px] md:text-[11px] tracking-wide mb-4">
              Pre-Contract Intelligence for Enterprise Bidding
            </p>

            {/* Pill badges */}
            <div className="flex flex-wrap gap-2 mb-6 md:mb-7">
              {['PRE-CONTRACT INTELLIGENCE', 'ENTERPRISE BIDDING'].map(t => (
                <span key={t} className="border border-yellow text-yellow text-[8px] md:text-[9px] font-bold tracking-widest px-3 py-1 md:px-3.5 md:py-1 rounded-full uppercase">
                  {t}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-[3rem] leading-[1.1] md:text-[clamp(52px,6vw,84px)] font-extrabold italic text-white mb-6 tracking-tight">
              Win more.<br />Bid smarter.
            </h1>

            {/* Sub-copy */}
            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-[460px] mb-8">
              AI agents governing your entire pre-contract process —
              from first opportunity to contract signature. Structured,
              auditable, defensible at every stage.
            </p>

            {/* Tool tags */}
            <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
              {TOOL_TAGS.map(t => (
                <span key={t} className="border border-white/20 text-white/45 text-[8px] md:text-[9px] font-bold tracking-widest px-3 py-1.5 md:px-3.5 md:py-1.5 rounded uppercase">
                  {t}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button className="bg-yellow text-[#0f1c2e] font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase px-8 py-3.5 md:px-10 md:py-4 rounded-full w-full md:w-auto shadow-[0_0_24px_rgba(240,255,64,0.25)] hover:scale-105 transition-transform">
              Request a 2-month proof of value
            </button>
          </div>

          {/* RIGHT: Particle image */}
          <div className="flex justify-center md:justify-end items-center w-full">
            <img
              src="/hero-particles.png"
              alt="AI intelligence visualization"
              className="w-[80%] md:w-full max-w-[600px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {[
            { value: '2 days → 15 min', label: 'Decision time,\nper opportunity' },
            { value: '±2,500 hrs', label: 'Saved per year\nper client' },
            { value: '2–3×', label: 'ROI on annual\nplatform cost' },
          ].map(s => (
            <div key={s.value} className="bg-navy-mid border border-white/10 rounded-2xl p-6 md:p-8 shrink-0">
              <p className="font-bold text-xl md:text-2xl text-white mb-2 md:mb-3 leading-tight">{s.value}</p>
              <p className="text-white/35 text-[9px] md:text-[10px] uppercase tracking-widest leading-relaxed whitespace-pre-line">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pb-20 md:pb-24">
        <div className="w-full rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/10">
          <video controls preload="metadata" className="w-full block aspect-video">
            <source src="https://files.catbox.moe/ukmsln.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ── TODAY vs HALO ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pb-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* TODAY side */}
          <div className="opacity-70 md:opacity-50 hover:opacity-100 transition-opacity">
            <span className="inline-block border border-white/30 text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] px-4 md:px-4.5 py-1.5 rounded-full mb-6">
              Today
            </span>
            <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
              <ul className="list-none p-0 m-0 space-y-4">
                {TODAY_ITEMS.map((item, i) => (
                  <li key={i} className="flex gap-3.5 items-start text-white/70 text-xs md:text-[13px] leading-relaxed">
                    <X size={16} className="shrink-0 mt-0.5 text-white/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HALO side */}
          <div>
            <div className="mb-6 pl-2.5 flex items-center h-[28px]">
              <img src="/halo-wordmark.svg" alt="HALO" className="h-5 md:h-7 w-auto" />
            </div>
            <div className="bg-navy-mid/60 rounded-3xl p-6 md:p-8 border border-yellow/40 backdrop-blur-md shadow-[0_0_40px_rgba(240,255,64,0.06)]">
              <ul className="list-none p-0 m-0 space-y-4 md:space-y-5">
                {HALO_ITEMS.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start text-white text-sm leading-relaxed font-medium">
                    <Check size={18} className="shrink-0 mt-0.5 text-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE PILL ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pb-16 md:pb-20 text-center">
        <div className="inline-flex items-center border border-yellow/30 rounded-full px-6 py-2">
          <span className="text-yellow text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-center w-full">
            + Every pre-contract decision becomes: Structured · Reviewable · Defensible
          </span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-10 py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/halo-wordmark.svg" alt="HALO" className="h-4 md:h-5 w-auto" />

          <button className="border-2 border-yellow text-yellow bg-transparent font-bold text-[9px] tracking-widest uppercase px-8 py-2.5 rounded-full hover:bg-yellow/10 transition-colors">
            Request a Demo
          </button>

          <p className="text-white/20 text-[9px] md:text-[10px] text-center md:text-left">
            © 2026 HALO · Pre-Contract Intelligence for Enterprise Bidding
          </p>

          <p className="text-white/20 text-[9px] md:text-[10px] text-center md:text-right">
            Albert House, 256-260 Old Street · London EC1V 9DD
          </p>
        </div>
      </footer>
    </div>
  );
};
