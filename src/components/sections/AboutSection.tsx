import { motion, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

const disciplines = [
  'Frontend Engineering',
  'Backend Architecture',
  'Mobile Apps',
  'Creative Development',
  'WebGL & 3D Experiences',
  'Computer Vision',
];

const highlights = [
  { value: '04', label: 'Selected Case Studies', detail: 'From AI to Computer Vision' },
  { value: '16+', label: 'Verified Toolset', detail: 'TypeScript, React, Flutter, Python' },
  { value: '100%', label: 'Responsive Architecture', detail: 'Strict 60 FPS performance' },
  { value: 'NPT', label: 'Nepal (UTC +5:45)', detail: 'Available for collaborations' },
];

export const AboutSection = () => {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="about-section light-section">
      <div className="section-shell">
        <div className="section-kicker">
          <span className="eyebrow">01 / Behind the code</span>
          <span className="section-cross" aria-hidden="true">✳</span>
        </div>
        <FadeIn>
          <h2>
            I connect the dots
            <br />
            between <span className="serif-word">idea</span>
            <br />
            &amp; <span className="underlined-word">interface.</span>
          </h2>
        </FadeIn>

        {/* Key Highlights Metrics Bar */}
        <div className="about-metrics-grid">
          {highlights.map(item => (
            <motion.div
              key={item.label}
              className="about-metric-card"
              whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <strong>{item.value}</strong>
              <span className="metric-title">{item.label}</span>
              <small className="metric-detail">{item.detail}</small>
            </motion.div>
          ))}
        </div>

        <div className="about-bottom">
          <div className="about-signature">
            <span>Sugam Shrestha</span>
            <small>Full-Stack Developer / Nepal</small>
            <div className="about-focus-pills">
              <span>High Performance</span>
              <span>Micro-Interactions</span>
              <span>Production Clean</span>
            </div>
          </div>
          <FadeIn className="about-copy">
            <p>{content.summary.value}</p>
            <a className="text-link" href="#experience">
              A little more of my story <span>↗</span>
            </a>
          </FadeIn>
        </div>
      </div>

      {/* Infinite Marquee Ribbon */}
      <div className="discipline-marquee-wrap" aria-label="Development disciplines">
        <div className="discipline-marquee-track" aria-hidden="true">
          <div className="discipline-marquee-items">
            {disciplines.map(item => (
              <span key={item}>
                {item} <i>✳</i>
              </span>
            ))}
          </div>
          <div className="discipline-marquee-items">
            {disciplines.map(item => (
              <span key={`clone-${item}`}>
                {item} <i>✳</i>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
