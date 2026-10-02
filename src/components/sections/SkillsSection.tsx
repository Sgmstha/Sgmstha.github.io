import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';
export const SkillsSection = () => <section id="skills" className="skills-section section-shell">
  <div className="section-kicker"><span className="eyebrow">04 / In my toolkit</span><span className="eyebrow">Always evolving</span></div>
  <div className="skills-layout"><div><h2>Many tools.<br /><span className="serif-word">One mindset.</span></h2><p className="section-description">Choose the right tool.<br />Understand the problem.<br />Build something that works.</p><span className="toolkit-symbol" aria-hidden="true">✳</span></div>
  <FadeIn><div className="featured-tools"><div><span>TS</span><strong>TypeScript</strong><small>Typed thinking</small></div><div><span>↗</span><strong>React &amp; Next.js</strong><small>Web experiences</small></div><div><span>F</span><strong>Flutter</strong><small>Mobile interfaces</small></div></div><ul className="skill-list">{content.skills.linkedin.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul></FadeIn></div>
</section>;
