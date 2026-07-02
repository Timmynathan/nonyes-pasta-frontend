import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── SVG Pasta Strand ───────────────────────────────────── */
function PastaStrand({ className }) {
  return (
    <svg viewBox="0 0 40 200" className={className} aria-hidden="true">
      <path
        d="M20 0 Q35 50 20 100 Q5 150 20 200"
        stroke="#e67e22"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M12 0 Q27 50 12 100 Q-3 150 12 200"
        stroke="#c0392b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M28 0 Q43 50 28 100 Q13 150 28 200"
        stroke="#e8956d"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

/* ─── SVG Steam Puff ─────────────────────────────────────── */
function Steam({ className }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden="true">
      <path
        d="M30 110 Q20 90 30 70 Q40 50 30 30 Q20 10 30 0"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M42 110 Q32 90 42 70 Q52 50 42 30 Q32 10 42 0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M18 110 Q8 90 18 70 Q28 50 18 30 Q8 10 18 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

/* ─── SVG Sauce Splash ───────────────────────────────────── */
function SauceSplash({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="20" fill="#c0392b" opacity="0.8" />
      <ellipse cx="60" cy="60" rx="40" ry="8" fill="#e67e22" opacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 60 + Math.cos(rad) * 50;
        const y2 = 60 + Math.sin(rad) * 30;
        return (
          <line
            key={angle}
            x1="60" y1="60"
            x2={x2} y2={y2}
            stroke="#c0392b"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        );
      })}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 60 + Math.cos(rad) * 48;
        const cy = 60 + Math.sin(rad) * 28;
        return <circle key={angle} cx={cx} cy={cy} r="4" fill="#e67e22" opacity="0.7" />;
      })}
    </svg>
  );
}

/* ─── SVG Pasta Bowl ─────────────────────────────────────── */
function PastaBowl({ className }) {
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      {/* bowl */}
      <ellipse cx="80" cy="95" rx="70" ry="30" fill="#fff3e0" stroke="#e67e22" strokeWidth="3" />
      <path d="M10 95 Q10 145 80 155 Q150 145 150 95" fill="#fff8f0" stroke="#e67e22" strokeWidth="3" />
      {/* pasta swirls */}
      <path d="M55 85 Q65 65 80 75 Q95 85 85 100 Q75 115 60 105 Q45 95 55 80" fill="none" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 80 Q85 60 100 70 Q115 80 105 95 Q95 110 80 100" fill="none" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M45 100 Q55 80 70 90" fill="none" stroke="#e8956d" strokeWidth="2" strokeLinecap="round" />
      {/* steam */}
      <path d="M60 75 Q55 65 60 55" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M80 70 Q75 60 80 50" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M100 75 Q95 65 100 55" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
export default function ScrollAnimations() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pasta strands fly in from left + right
      gsap.utils.toArray('.pasta-strand-left').forEach((el, i) => {
        gsap.fromTo(el,
          { x: -200, opacity: 0, rotation: -30 },
          {
            x: 0, opacity: 1, rotation: 0,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1.5,
            },
            delay: i * 0.1,
          }
        );
      });

      gsap.utils.toArray('.pasta-strand-right').forEach((el, i) => {
        gsap.fromTo(el,
          { x: 200, opacity: 0, rotation: 30 },
          {
            x: 0, opacity: 1, rotation: 0,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1.5,
            },
            delay: i * 0.1,
          }
        );
      });

      // Steam rises up on scroll
      gsap.utils.toArray('.steam-puff').forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0, scaleX: 0.5 },
          {
            y: 0, opacity: 1, scaleX: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 50%',
              scrub: 2,
            },
          }
        );
      });

      // Sauce splashes burst in
      gsap.utils.toArray('.sauce-splash').forEach((el) => {
        gsap.fromTo(el,
          { scale: 0, opacity: 0, rotation: -45 },
          {
            scale: 1, opacity: 1, rotation: 0,
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 1.2,
            },
          }
        );
      });

      // Bowl rises from bottom
      gsap.utils.toArray('.pasta-bowl').forEach((el) => {
        gsap.fromTo(el,
          { y: 100, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1.8,
            },
          }
        );
      });

      // Section headings slide up
      gsap.utils.toArray('.scroll-fade-up').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      // Cards stagger in
      gsap.utils.toArray('.scroll-card').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 55%',
              scrub: 1,
            },
            delay: i * 0.05,
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none select-none" aria-hidden="true">

      {/* ── Hero section floating strands ── */}
      <div className="fixed top-1/4 left-0 w-16 opacity-0 pasta-strand-left z-0 pointer-events-none hidden lg:block" style={{ transform: 'translateY(-50%)' }}>
        <PastaStrand className="w-full h-48 drop-shadow" />
      </div>
      <div className="fixed top-1/3 right-0 w-16 opacity-0 pasta-strand-right z-0 pointer-events-none hidden lg:block">
        <PastaStrand className="w-full h-48 drop-shadow" />
      </div>

    </div>
  );
}

/* ─── Named exports for use inline in pages ──────────────── */
export { PastaStrand, Steam, SauceSplash, PastaBowl };
