import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoScrollHero() {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const video   = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Autoplay + loop the video as a background on all devices.
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    const tryPlay = () => video.play().catch(() => {});
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });

    // iOS often only allows playback after a real user gesture — retry on first interaction
    const onFirstInteract = () => tryPlay();
    window.addEventListener('touchstart', onFirstInteract, { once: true, passive: true });
    window.addEventListener('click', onFirstInteract, { once: true });

    // Browsers pause background video when the tab/app is left; resume on return
    const onVisible = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', tryPlay);
    window.addEventListener('pageshow', tryPlay);

    // Fade the logo out as the user scrolls past the hero
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
      gsap.to(titleRef.current, {
        autoAlpha: 0, y: -20, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener('touchstart', onFirstInteract);
      window.removeEventListener('click', onFirstInteract);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', tryPlay);
      window.removeEventListener('pageshow', tryPlay);
    };
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
      <section ref={sectionRef} style={{ height: '120vh' }} className="relative">
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
