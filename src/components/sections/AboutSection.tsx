import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export const AboutSection = () => <section id="about" className="about-section light-section">
  <div className="section-shell">
    <div className="section-kicker"><span className="eyebrow">01 / A little context</span><span className="eyebrow">The person behind the projects</span></div>
    <div className="about-editorial">
      <FadeIn><h2>Curiosity is<br />the starting<br /><span className="serif-word">point.</span></h2></FadeIn>
      <div className="about-copy"><span className="about-coordinate">NEPAL ↗ EVERYWHERE</span><p>{content.summary.value}</p><p>My projects span coding assistants, inventory tools, computer vision, and everyday utilities. Different problems. Plenty to figure out.</p><a className="text-link" href="#experience">My experience <span>↗</span></a>
      <div className="about-note"><span>Currently exploring</span><strong>AI with a workspace.<br />Tools that can do more.</strong><a href="#project-ai-coder-chatbot">See the project ↓</a></div></div>
    </div>
    <div className="discipline-index"><span>01 / Web development</span><span>02 / Mobile applications</span><span>03 / Creative experiments</span></div>
  </div>
</section>;
