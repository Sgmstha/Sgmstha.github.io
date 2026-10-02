import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Hls from 'hls.js';
import portfolioData from '../../portfolioData.json';

// ponytail: nav links map to actual section IDs; "Home" scrolls to top
const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
] as const;

const SECTION_IDS = ['projects', 'experience', 'skills', 'contact'];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // GSAP Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, delay: 0.3 }
      );

      tl.fromTo(".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.1
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // HLS Video setup
    if (videoRef.current) {
      const videoSrc = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
      }
    }
  }, []);

  // ponytail: IntersectionObserver for active section, no library needed
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // ponytail: show on scroll-up, hide on scroll-down, always show near top
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 100) {
        setNavVisible(true);
        setActiveSection('');
      } else {
        setNavVisible(y < lastScrollY.current);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = useCallback((href: string) => {
    if (href === '#') return activeSection === '';
    return `#${activeSection}` === href;
  }, [activeSection]);

  return (
    <>
      {/* Navbar Pill — outside hero so it's never clipped */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 transition-transform duration-300"
        style={{ transform: navVisible ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-[#141414]/80 px-2 py-2 shadow-lg shadow-black/20">
          <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-[#89AACC] to-[#4E85BF] p-[1px] hover:scale-110 transition-transform">
            <div className="w-full h-full bg-[#0C0C0C] rounded-full flex items-center justify-center">
              <span className="font-serif italic text-[13px] text-white">SS</span>
            </div>
          </a>
          
          <div className="hidden md:block w-px h-5 bg-[#1F1F1F] mx-1" />
          
          <div className="flex items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-[#1F1F1F]/50'
                    : 'text-[#878787] hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="w-px h-5 bg-[#1F1F1F] mx-1" />

          <a href="#contact" className="relative group rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-white">
            <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#141414] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md flex items-center gap-1">
              Say hi ↗
            </div>
          </a>
        </div>
      </nav>

      <section ref={containerRef} className="h-screen w-full relative overflow-hidden bg-[#0C0C0C] flex flex-col items-center justify-center">
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0"
        />
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0C0C0C] to-transparent z-0" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <p className="blur-in text-xs text-[#878787] uppercase tracking-[0.3em] mb-8">
            COLLECTION '26
          </p>
          
          <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-serif italic leading-[0.9] tracking-tight text-white mb-6">
            {portfolioData.name}
          </h1>

          <p className="blur-in text-xl md:text-3xl text-white mb-6">
            A <span className="font-serif italic inline-block animate-[fadeIn_0.4s_ease-out_forwards]">{portfolioData.headline}</span> lives in {portfolioData.contact.location}.
          </p>

          <p className="blur-in text-sm md:text-base text-[#878787] max-w-md mb-12">
            {portfolioData.summary}
          </p>

          <div className="blur-in flex gap-4">
            <a href="#projects" className="rounded-full text-sm px-7 py-3.5 bg-white text-[#0C0C0C] hover:bg-[#0C0C0C] hover:text-white relative group transition-colors hover:scale-105 no-underline">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 group-hover:opacity-100 -z-10" />
              <span className="absolute inset-[2px] rounded-full bg-[#0C0C0C] opacity-0 group-hover:opacity-100 -z-10" />
              See Works
            </a>
            <a href="#contact" className="rounded-full text-sm px-7 py-3.5 border-2 border-[#1F1F1F] bg-[#0C0C0C] text-white hover:border-transparent relative group transition-colors hover:scale-105 no-underline">
              <span className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 group-hover:opacity-100 -z-10" />
              <span className="absolute inset-[0px] rounded-full bg-[#0C0C0C] -z-10" />
              Reach out...
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 blur-in">
          <span className="text-xs text-[#878787] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-10 bg-[#1F1F1F] relative overflow-hidden">
            <div className="w-full h-full bg-[#89AACC] absolute top-0 left-0 animate-[scroll-down_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>
    </>
  );
};
