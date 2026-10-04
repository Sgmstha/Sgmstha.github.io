import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { sections } from '../../data/sections';
import type { SceneStatus } from '../scene/SceneLayer';
import type { SculptureMode } from '../scene/SculptureCanvas';

const SpatialStudioModal = lazy(() => import('../scene/SpatialStudioModal').then(m => ({ default: m.SpatialStudioModal })));
const forms = [{ id: 'knot', label: '01 / Signal' }, { id: 'gyro', label: '02 / Orbit' }, { id: 'prism', label: '03 / Prism' }] as const;

export const HeroSection = ({ paused, onToggleMotion, sceneStatus, sculptureMode = 'knot', onModeChange }: {
  paused: boolean; onToggleMotion: () => void; sceneStatus: SceneStatus;
  sculptureMode?: SculptureMode; onModeChange?: (mode: SculptureMode) => void;
}) => {
  const [active, setActive] = useState('home');
  const [studioOpen, setStudioOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -60% 0px' });
    sections.forEach(({ id }) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#home" aria-label={content.name.value + ', home'}>
        <span className="brand-mark">s<span>↗</span></span>
        <span className="brand-name">Sugam Shrestha<small>Independent developer / Nepal</small></span>
      </a>
      <nav aria-label="Main navigation">{sections.filter(item => item.id !== 'home').map(item =>
        <a key={item.id} href={'#' + item.id} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>
      )}</nav>
      <a className="header-contact" href="#contact">Get in touch <span>↗</span></a>
      <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />
    </header>
    <section id="home" className="hero">
      <div className="hero-topline">
        <span className="eyebrow">Portfolio / Selected experiments</span>
        <span className="eyebrow">{content.headline.value} · {content.contact.location.value}</span>
      </div>
      <div className="hero-copy">
        <h1 aria-label="Sugam Shrestha — Full-Stack Developer in Nepal">
          {['Sugam', 'Shrestha'].map((word, index) => <span className="title-line" key={word}>
            <motion.span initial={reduced ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: index * .13, ease: [.22, 1, .36, 1] }}>{word}</motion.span>
          </span>)}
        </h1>
        <div className="hero-intro"><span className="intro-index">↳</span><p>I build for the web.<br />And whatever comes next.</p></div>
        <a className="hero-work-link" href="#projects">Explore my work <span>↘</span></a>
      </div>
      <div className="specimen-frame" aria-hidden="true"><span>FORM / 001</span><span>AN EXERCISE IN CURIOSITY</span><i /><i /><i /><i /></div>
      <div className="sculpture-fallback" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ top: `${index * 4}%`, transform: `rotate(${index * 7 - 55}deg)` }} />)}
      </div>
      <div className="scene-annotation">
        <div className="annotation-content">
          <div className="annotation-header"><span>Interactive object</span><strong>Order, with a little chaos.</strong></div>
          {sceneStatus === 'live' && onModeChange && <div className="sculpture-mode-bar" role="group" aria-label="Sculpture geometry mode">
            {forms.map(form => <button key={form.id} type="button" aria-pressed={sculptureMode === form.id} className={`mode-tab ${sculptureMode === form.id ? 'active' : ''}`} onClick={() => onModeChange(form.id)}>{form.label}</button>)}
            <button type="button" className="mode-tab mode-tab-xr" onClick={() => setStudioOpen(true)}>Open studio ↗</button>
          </div>}
        </div>
      </div>
      <div className="scene-controls">
        {sceneStatus === 'live' ? <button type="button" onClick={onToggleMotion} aria-pressed={paused}>{paused ? '▶ Resume' : 'Ⅱ Pause'} motion</button> : <span>{sceneStatus === 'loading' ? 'Assembling the object…' : 'Static edition / same curiosity'}</span>}
        {sceneStatus === 'live' && <span className="pointer-hint">Move your pointer to explore</span>}
      </div>
      <div className="hero-bottom"><span>WEB / MOBILE / EXPERIMENTS</span><span>Built in Nepal. Open to the world.</span><a href="#about" className="scroll-cue">Scroll to discover <span>↓</span></a></div>
    </section>
    {studioOpen && <Suspense fallback={<div className="studio-loading" role="status">Opening studio… <button onClick={() => setStudioOpen(false)}>Cancel</button></div>}><SpatialStudioModal isOpen={studioOpen} onClose={() => setStudioOpen(false)} currentMode={sculptureMode} onModeChange={onModeChange || (() => {})} /></Suspense>}
  </>;
};
