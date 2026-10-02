import { useEffect, useState } from 'react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { sections } from '../../data/sections';
import type { SceneStatus } from '../scene/SceneLayer';

export const HeroSection = ({ paused, onToggleMotion, sceneStatus }: { paused: boolean; onToggleMotion: () => void; sceneStatus: SceneStatus }) => {
  const [active, setActive] = useState('home');
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-15% 0px -60% 0px' });
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#home" aria-label={content.name.value + ', home'}><span className="brand-mark">s<span>↗</span></span><span className="brand-name">{content.name.value}<small>Developer &amp; curious human</small></span></a>
      <nav aria-label="Main navigation">{sections.filter(item => item.id !== 'home').map(item => <a key={item.id} href={'#' + item.id} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}</nav>
      <a className="header-contact" href="#contact">Let’s talk <span>↗</span></a>
      <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />
    </header>
    <section id="home" className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline"><span className="eyebrow"><i /> {content.headline.value}</span><span className="hero-location">Based in {content.contact.location.value}<span>WEB &amp; MOBILE / PORTFOLIO</span></span></div>
      <div className="hero-copy">
        <h1>{['Code.', 'Craft.', 'Character.'].map((word, index) => <span className="title-line" key={word}><motion.span initial={reduced ? false : { y: '105%', rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: .9, delay: .15 + index * .12, ease: [.22, 1, .36, 1] }}>{word}</motion.span></span>)}</h1>
        <div className="hero-intro"><span className="intro-cross" aria-hidden="true">✳</span><p>I’m {content.name.value?.split(' ')[0]}. I turn ideas into<br />web &amp; mobile experiences that feel right.</p></div>
        <a className="button button-primary" href="#projects"><span>Explore selected work</span><span className="button-arrow">↗</span></a>
      </div>
      <div className="sculpture-fallback" aria-hidden="true"><div className="fallback-orbit orbit-a" /><div className="fallback-orbit orbit-b" /><div className="fallback-orbit orbit-c" /><div className="fallback-satellite" /></div>
      <div className="scene-annotation"><span className="annotation-line" /><span>Experiment 001<br /><strong>Order in the unexpected.</strong></span></div>
      <div className="scene-controls">
        {sceneStatus === 'live' ? <button type="button" onClick={onToggleMotion} aria-pressed={paused}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? 'Resume motion' : 'Pause motion'}</button> : <span>{sceneStatus === 'loading' ? 'Preparing the experiment…' : 'A study in form & balance'}</span>}
        {sceneStatus === 'live' && <span className="pointer-hint">Move your cursor. Make it yours.</span>}
      </div>
      <div className="hero-bottom"><span>Creative thinking.<br /><strong>Full-stack execution.</strong></span><div className="hero-stack"><span>TypeScript</span><span>React / Next.js</span><span>Flutter</span></div><a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><span className="scroll-circle">↓</span></a></div>
      <span className="hero-side-label" aria-hidden="true">PORTFOLIO — VOL. 01</span>
    </section>
  </>;
};
