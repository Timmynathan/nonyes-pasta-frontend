import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_DURATION = 6.433;

export default function VideoScrollHero() {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const video   = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Mobile / touch devices can't reliably scrub video.currentTime (iOS Safari
    // renders a blank frame). On those, just autoplay + loop as a background.
    const isTouch = window.matchMedia('(hover: none)').matches
      || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isTouch) {
      video.loop = true;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 2) tryPlay();
      else video.addEventListener('canplay', tryPlay, { once: true });

      // iOS often only allows playback after a real user gesture — retry on first touch
      const onFirstTouch = () => { tryPlay(); window.removeEventListener('touchstart', onFirstTouch); };
      window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });

      // Still fade the logo out as the user scrolls past the hero
      const ctx = gsap.context(() => {
        gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
        gsap.to(titleRef.current, {
          autoAlpha: 0, y: -20, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 },
        });
      });
      return () => ctx.revert();
    }

    const init = () => {
      video.pause();
      video.currentTime = 0;

      const ctx = gsap.context(() => {

        // ── Video scrub ──────────────────────────────────────────────
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            const t = self.progress * VIDEO_DURATION;
            video.currentTime = Math.min(Math.max(t, 0), VIDEO_DURATION - 0.01);
          },
        });

        // ── Text animations — single timeline, keyed by scroll progress ──
        // Using duration values that represent fractions of total scroll (0–1)
        // A placeholder at position 1 ensures the timeline spans the full scroll.

        // Logo visible from the start, only fades out near the end
        gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        // placeholder so timeline total = 1
        tl.set({}, {}, 1);

        // Logo: fade OUT at 82–100%
        tl.to(titleRef.current, { autoAlpha: 0, y: -20, duration: 0.18, ease: 'none' }, 0.82);


      });

      return ctx;
    };

    let ctx;
    if (video.readyState >= 1) {
      ctx = init();
    } else {
      video.addEventListener('loadedmetadata', () => { ctx = init(); }, { once: true });
    }

    return () => ctx?.revert();
  }, []);

  return (
    <>
      {/* Video fixed behind the entire page — last frame stays as background */}
      <video
        ref={videoRef}
        src="/hero-video.mp4"
        poster="/hero-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* Hero scroll section */}
      <section ref={sectionRef} style={{ height: '180vh' }} className="relative">
        <div className="sticky top-0 h-screen w-full">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div ref={titleRef}>
              <img
                src="/logo.png"
                alt="Nonye's Pasta"
                className="w-48 md:w-64 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
