import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

type TerminalCommand = 'stack' | 'projects' | 'philosophy' | 'sys';

interface CommandOutput {
  prompt: string;
  lines: { prefix: string; text: string }[];
}

const terminalData: Record<TerminalCommand, CommandOutput> = {
  stack: {
    prompt: 'stack.status --verified',
    lines: [
      { prefix: '✓', text: 'TypeScript 5.8+ (Strict type contracts)' },
      { prefix: '✓', text: 'React 19 / Next.js SSR & client patterns' },
      { prefix: '✓', text: 'Flutter / Dart (Cross-platform iOS & Android)' },
      { prefix: '✓', text: 'Three.js & WebGL procedural graphics' },
      { prefix: '✓', text: 'Python / YOLO Computer Vision' },
    ],
  },
  projects: {
    prompt: 'projects.list --active',
    lines: [
      { prefix: '01', text: 'AI Coder Chatbot (Gemini API + TS + Python)' },
      { prefix: '02', text: 'Smart Inventory Management (Predictive Restock)' },
      { prefix: '03', text: 'Subway Surfer Bot (Real-time YOLO + OpenCV)' },
      { prefix: '04', text: 'Feline Feeding Calculator (PMR Raw Nutrition)' },
    ],
  },
  philosophy: {
    prompt: 'dev.philosophy --principles',
    lines: [
      { prefix: '•', text: 'Type-safe contracts before implementation' },
      { prefix: '•', text: 'Strict 60 FPS motion & low-overhead performance' },
      { prefix: '•', text: 'Accessible semantic HTML by default' },
      { prefix: '•', text: 'Zero unnecessary dependencies or boilerplate' },
    ],
  },
  sys: {
    prompt: 'sys.info --telemetry',
    lines: [
      { prefix: '⚡', text: 'Location: Nepal (NPT UTC+5:45)' },
      { prefix: '⚡', text: 'Availability: Open for collaborations' },
      { prefix: '⚡', text: 'Tech Stack: TypeScript · React 19 · Flutter · Python' },
      { prefix: '⚡', text: 'Status: 0 linter errors · 100% verified claims' },
    ],
  },
};

type SkillCategory = 'all' | 'frontend' | 'languages' | 'engineering';

const categoryMap: Record<SkillCategory, string[]> = {
  all: [],
  frontend: [
    'HTML5',
    'HTML',
    'Cascading Style Sheets (CSS)',
    'Responsive Web Design',
    'Front-End Development',
    'Front-End Design',
    'Web Pages',
    'Bootstrap (Framework)',
  ],
  languages: ['JavaScript', 'Python (Programming Language)', 'Java'],
  engineering: [
    'Full-Stack Development',
    'Flutter',
    'Web Development',
    'E-Commerce',
    'Figma (Software)',
  ],
};

export const SkillsSection = () => {
  const [activeCmd, setActiveCmd] = useState<TerminalCommand>('stack');
  const [category, setCategory] = useState<SkillCategory>('all');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const reduced = useReducedMotion();

  const currentOutput = terminalData[activeCmd];

  const filteredSkills = content.skills.linkedin.filter(skill => {
    if (category === 'all') return true;
    return categoryMap[category].includes(skill.name);
  });

  const handleCopyCommand = async () => {
    try {
      const text = `$ ${currentOutput.prompt}\n` + currentOutput.lines.map(l => `${l.prefix} ${l.text}`).join('\n');
      await navigator.clipboard.writeText(text);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section id="skills" className="skills-section section-shell">
      <div className="section-kicker">
        <span className="eyebrow">04 / In my toolkit</span>
        <span className="eyebrow">Always evolving</span>
      </div>
      <div className="skills-layout">
        <div>
          <h2>
            Many tools.
            <br />
            <span className="serif-word">One mindset.</span>
          </h2>
          <p className="section-description">
            Choose the right tool.
            <br />
            Understand the problem.
            <br />
            Build something that works.
          </p>

          {/* Interactive Terminal Widget */}
          <div className="toolkit-terminal" role="region" aria-label="Interactive developer toolkit terminal">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="term-dot red" />
                <span className="term-dot yellow" />
                <span className="term-dot green" />
              </div>
              <span className="term-title">toolkit.sh — zsh</span>
              <button
                type="button"
                className="terminal-copy-btn"
                onClick={handleCopyCommand}
                title="Copy terminal output"
              >
                {copiedCmd ? 'Copied ✓' : 'Copy'}
              </button>
            </div>

            {/* Terminal Command Quick Switcher */}
            <div className="terminal-cmd-bar" role="tablist" aria-label="Terminal commands">
              {(['stack', 'projects', 'philosophy', 'sys'] as const).map(cmd => (
                <button
                  key={cmd}
                  type="button"
                  role="tab"
                  aria-selected={activeCmd === cmd}
                  className={`term-cmd-tab ${activeCmd === cmd ? 'active' : ''}`}
                  onClick={() => setActiveCmd(cmd)}
                >
                  ${cmd}
                </button>
              ))}
            </div>

            <div className="terminal-body">
              <p>
                <span className="term-prompt">$</span> {currentOutput.prompt}
              </p>
              {currentOutput.lines.map((line, idx) => (
                <p key={idx} className="term-output">
                  <span>{line.prefix}</span> {line.text}
                </p>
              ))}
              <div className="term-cursor-line">
                <span className="term-prompt">$</span> <span className="term-blinking-cursor">▋</span>
              </div>
            </div>
          </div>
        </div>

        <FadeIn>
          {/* Featured Core Tools */}
          <div className="featured-tools">
            <motion.div
              className="tool-card"
              whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tool-top">
                <span>TS</span>
                <span className="tool-badge">Primary</span>
              </div>
              <strong>TypeScript</strong>
              <small>Typed thinking &amp; scalable architecture</small>
            </motion.div>
            <motion.div
              className="tool-card"
              whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tool-top">
                <span>⚛</span>
                <span className="tool-badge">Core</span>
              </div>
              <strong>React &amp; Next.js</strong>
              <small>Reactive systems &amp; modern interfaces</small>
            </motion.div>
            <motion.div
              className="tool-card"
              whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="tool-top">
                <span>📱</span>
                <span className="tool-badge">Mobile</span>
              </div>
              <strong>Flutter</strong>
              <small>Cross-platform mobile applications</small>
            </motion.div>
          </div>

          {/* Skill Filter Tabs with Framer Motion layoutId */}
          <div className="skill-category-tabs" role="tablist" aria-label="Skills filter">
            {[
              { id: 'all', label: `All (${content.skills.linkedin.length})` },
              { id: 'frontend', label: 'Frontend & UI' },
              { id: 'languages', label: 'Core Languages' },
              { id: 'engineering', label: 'Architecture & Mobile' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={category === tab.id}
                className={`skill-cat-btn ${category === tab.id ? 'active' : ''}`}
                onClick={() => setCategory(tab.id as SkillCategory)}
              >
                {tab.label}
                {category === tab.id && (
                  <motion.div
                    className="skill-cat-indicator"
                    layoutId="skillActiveIndicator"
                    transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Verified LinkedIn Skill Badges */}
          <motion.ul className="skill-list" layout>
            {filteredSkills.map(skill => (
              <motion.li
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={reduced ? undefined : { y: -3, scale: 1.03 }}
                transition={{ duration: 0.15 }}
              >
                {skill.name}
              </motion.li>
            ))}
          </motion.ul>
        </FadeIn>
      </div>
    </section>
  );
};
