import { lazy, Suspense, useEffect, useState } from 'react';
import type { PointerEvent } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { sections } from '../../data/sections';
import type { SceneStatus } from '../scene/SceneLayer';
import type { SculptureMode } from '../scene/SculptureCanvas';
import { Magnetic } from '../ui/Magnetic';
import { reportExploreClick, reportLabSwitch } from '../scene/avatarState';

const SpatialStudioModal = lazy(() =>
  import('../scene/SpatialStudioModal').then(m => ({ default: m.SpatialStudioModal }))
);

export const HeroSection = ({
  paused,
  onToggleMotion,
  sceneStatus,
  sculptureMode = 'knot',
  onModeChange,
}: {
  paused: boolean;
  onToggleMotion: () => void;
  sceneStatus: SceneStatus;
  sculptureMode?: SculptureMode;
  onModeChange?: (mode: SculptureMode) => void;
}) => {
  const [active, setActive] = useState('home');
  const [nepalTime, setNepalTime] = useState('');
  const [studioOpen, setStudioOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -60% 0px' }
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // UTC + 5:45 for Nepal Standard Time
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const npt = new Date(utc + 5.75 * 3600000);
      const hours = String(npt.getHours()).padStart(2, '0');
      const minutes = String(npt.getMinutes()).padStart(2, '0');
      const seconds = String(npt.getSeconds()).padStart(2, '0');
      setNepalTime(`${hours}:${minutes}:${seconds} NPT`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#home" aria-label={content.name.value + ', home'}>
          <span className="brand-mark">
            s<span>↗</span>
          </span>
          <span className="brand-name">
            {content.name.value}
            <small>Developer &amp; curious human</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {sections
            .filter(item => item.id !== 'home')
            .map(item => (
              <a
                key={item.id}
                href={'#' + item.id}
                aria-current={active === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
        </nav>
        <Magnetic strength={0.25}>
          <a className="header-contact" id="hero-lets-talk-btn" href="#contact">
            Let’s talk <span>↗</span>
          </a>
        </Magnetic>
        <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />
      </header>

      <section id="home" className="hero" onPointerMove={handlePointerMove}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="hero-atmosphere-glow" aria-hidden="true" />

        <div className="hero-topline">
          <div className="hero-badge-group">
            <span className="eyebrow">
              <i /> {content.headline.value}
            </span>
            <span className="live-status-pill">
              <span className="pulse-dot" />
              <span>Available for collaborations</span>
            </span>
          </div>
          <div className="hero-location">
            <div className="location-main">
              <span>Based in {content.contact.location.value}</span>
              {nepalTime && <span className="nepal-clock">{nepalTime}</span>}
            </div>
            <span>WEB &amp; MOBILE / CREATIVE DEV</span>
          </div>
        </div>

        <div className="hero-copy">
          <h1>
            {['Code.', 'Craft.', 'Character.'].map((word, index) => (
              <span className={`title-line ${index === 2 ? 'accent-word' : ''}`} key={word}>
                <motion.span
                  initial={reduced ? false : { y: '105%', rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduced ? undefined : { x: 8, transition: { duration: 0.2 } }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="hero-intro">
            <span className="intro-cross" aria-hidden="true">
              ✳
            </span>
            <p>
              I’m {content.name.value?.split(' ')[0]}. I turn ideas into
              <br />
              web &amp; mobile experiences that feel right.
            </p>
          </div>
          <Magnetic strength={0.35}>
            <a
              className="button button-primary shimmer-button"
              href="#projects"
              onClick={() => reportExploreClick()}
            >
              <span className="shimmer-highlight" aria-hidden="true" />
              <span>Explore selected work</span>
              <span className="button-arrow">↗</span>
            </a>
          </Magnetic>
        </div>

        <div className="sculpture-fallback" aria-hidden="true">
          <div className="fallback-orbit orbit-a" />
          <div className="fallback-orbit orbit-b" />
          <div className="fallback-orbit orbit-c" />
          <div className="fallback-satellite" />
        </div>

        <div className="scene-annotation">
          <span className="annotation-line" />
          <div className="annotation-content">
            <div className="annotation-header">
              <span>Experiment 001</span>
              <strong>Procedural Geometry Lab</strong>
            </div>
            {sceneStatus === 'live' && onModeChange && (
              <div className="sculpture-mode-bar" role="group" aria-label="Sculpture geometry mode">
                {(['knot', 'gyro', 'prism'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    className={`mode-tab ${sculptureMode === mode ? 'active' : ''}`}
                    onClick={() => {
                      onModeChange(mode);
                      reportLabSwitch(mode);
                    }}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
                <button
                  type="button"
                  className="mode-tab mode-tab-xr"
                  onClick={() => {
                    setStudioOpen(true);
                    reportLabSwitch('xr');
                  }}
                  title="Open WebXR & 3D Spatial Studio"
                >
                  ✦ XR LAB
                </button>
              </div>
            )}
          </div>
        </div>

        {studioOpen && (
          <Suspense fallback={null}>
            <SpatialStudioModal
              isOpen={studioOpen}
              onClose={() => setStudioOpen(false)}
              currentMode={sculptureMode}
              onModeChange={onModeChange || (() => {})}
            />
          </Suspense>
        )}

        <div className="scene-controls">
          {sceneStatus === 'live' ? (
            <button type="button" onClick={onToggleMotion} aria-pressed={paused}>
              <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
              {paused ? 'Resume motion' : 'Pause motion'}
            </button>
          ) : (
            <span>{sceneStatus === 'loading' ? 'Preparing the experiment…' : 'A study in form & balance'}</span>
          )}
          {sceneStatus === 'live' && <span className="pointer-hint">Drag to rotate · Click for impulse</span>}
        </div>

        <div className="hero-bottom">
          <span>
            Creative thinking.
            <br />
            <strong>Full-stack execution.</strong>
          </span>
          <div className="hero-stack">
            <span>TypeScript</span>
            <span>React / Next.js</span>
            <span>Flutter</span>
          </div>
          <a href="#about" className="scroll-cue">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-circle">↓</span>
          </a>
        </div>
        <span className="hero-side-label" aria-hidden="true">
          PORTFOLIO — VOL. 01
        </span>
      </section>
    </>
  );
};

