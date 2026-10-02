import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export const AboutSection = () => <section id="about" className="about-section light-section">
  <div className="section-shell">
    <div className="section-kicker"><span className="eyebrow">01 / Behind the code</span><span className="section-cross" aria-hidden="true">✳</span></div>
    <FadeIn><h2>I connect the dots<br />between <span className="serif-word">idea</span><br />&amp; <span className="underlined-word">interface.</span></h2></FadeIn>
    <div className="about-bottom"><div className="about-signature"><span>Sugam Shrestha</span><small>Full-Stack Developer / Nepal</small></div><FadeIn className="about-copy"><p>{content.summary.value}</p><a className="text-link" href="#experience">A little more of my story <span>↗</span></a></FadeIn></div>
  </div>
  <div className="discipline-strip" aria-label="Development disciplines"><span>Frontend</span><i>✳</i><span>Backend</span><i>✳</i><span>Mobile</span><i>✳</i><span>Creative development</span><i>✳</i></div>
</section>;
