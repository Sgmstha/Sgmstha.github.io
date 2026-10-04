import { useState } from 'react';
import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

type Category = 'all' | 'frontend' | 'languages' | 'engineering';
const categories: { id: Category; label: string; skills: string[] }[] = [
  { id: 'all', label: 'All skills', skills: [] },
  { id: 'frontend', label: 'Interface', skills: ['HTML5', 'HTML', 'Cascading Style Sheets (CSS)', 'Responsive Web Design', 'Front-End Development', 'Front-End Design', 'Web Pages', 'Bootstrap (Framework)'] },
  { id: 'languages', label: 'Languages', skills: ['JavaScript', 'Python (Programming Language)', 'Java'] },
  { id: 'engineering', label: 'Applications', skills: ['Full-Stack Development', 'Flutter', 'Web Development', 'E-Commerce', 'Figma (Software)'] },
];
export const SkillsSection = () => {
  const [category, setCategory] = useState<Category>('all');
  const selected = categories.find(item => item.id === category)!;
  const skills = content.skills.linkedin.filter(skill => category === 'all' || selected.skills.includes(skill.name));
  return <section id="skills" className="skills-section section-shell">
    <div className="section-kicker"><span className="eyebrow">04 / Working vocabulary</span><span className="eyebrow">The tools behind the work</span></div>
    <div className="skills-layout"><div><h2>Built with<br /><span className="serif-word">intention.</span></h2><p className="section-description">From the interface to the API.<br />These are the tools I work with.</p><a className="text-link" href="#projects">See them in practice ↗</a></div>
    <FadeIn><div className="tool-ledger">{[
      { number: '01', name: 'TypeScript', detail: 'Typed web applications', mark: 'TS' },
      { number: '02', name: 'React & Next.js', detail: 'Interfaces & full-stack web', mark: 'R / N' },
      { number: '03', name: 'Flutter', detail: 'Cross-platform mobile', mark: 'F' },
    ].map(tool => <div className="tool-ledger-row" key={tool.name}><span>{tool.number}</span><div><strong>{tool.name}</strong><small>{tool.detail}</small></div><b aria-hidden="true">{tool.mark}</b></div>)}</div>
    <div className="skill-category-tabs" role="group" aria-label="Skills filter">{categories.map(item => <button key={item.id} className={`skill-cat-btn ${category === item.id ? 'active' : ''}`} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
    <ul className="skill-list">{skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul><p className="skill-count" role="status">{skills.length} skills / {selected.label}</p></FadeIn></div>
  </section>;
};
