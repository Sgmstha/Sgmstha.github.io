import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import type { Project } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';
import { LightboxModal } from '../ui/LightboxModal';
import type { LightboxData } from '../ui/LightboxModal';

const disciplines = ['AI / Developer tools', 'Full-stack / Analytics', 'Computer vision / Automation', 'Web application / Nutrition'];
function ProjectShowcase({ project, index, onPreview }: { project: Project; index: number; onPreview: (item: LightboxData) => void }) {
  const art = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const screenshot = project.images.value && 'url' in project.images.value ? project.images.value : null;
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !art.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    art.current.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - .5) * -3}deg`);
    art.current.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 3}deg`);
  };
  const reset = () => { art.current?.style.setProperty('--tilt-x', '0deg'); art.current?.style.setProperty('--tilt-y', '0deg'); };
  return <FadeIn><article className={`project-showcase project-${index}`} id={'project-' + project.id}>
    <div className="project-heading-row"><span className="project-index">0{index + 1}</span><h3>{project.name.value}</h3><span className="project-discipline">{disciplines[index]}</span></div>
    <div className="project-visual" onPointerMove={move} onPointerLeave={reset}>
      <div className="project-stage" ref={art}>
        <span className="stage-word" aria-hidden="true">{['CONVERSE', 'ANTICIPATE', 'OBSERVE', 'CALCULATE'][index]}</span>
        {screenshot ? <button className="project-capture" type="button" aria-label={'Open preview for ' + project.name.value} onClick={() => onPreview({ url: screenshot.url, alt: screenshot.alt, title: project.name.value || 'Project', subtitle: disciplines[index], tech: project.techStack.value || [] })}><img src={screenshot.url} alt={screenshot.alt} loading="lazy" decoding="async" /><span className="capture-action">Inspect screenshot ↗</span></button> : <div className="project-placeholder">Project imagery coming soon</div>}
        <span className="stage-foot">{screenshot ? 'Actual application / Development build' : 'In progress'}</span>
        <span className="stage-index" aria-hidden="true">S / 0{index + 1}</span>
      </div>
    </div>
    <div className="project-information">
      <div><span className="project-status">{project.status?.value}</span><p className="project-summary">{project.summary?.value}</p><div className="tag-list">{project.techStack.value?.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <div>{project.features.value && <ul className="project-capabilities">{project.features.value.map(feature => <li key={feature}>{feature}</li>)}</ul>}
      <details className="project-overview"><summary>Inside the project <span aria-hidden="true">+</span></summary><div className="project-details"><p>{project.description.value}</p>{project.sourceUrl.value && <a href={project.sourceUrl.value} target="_blank" rel="noopener noreferrer">Source code ↗</a>}{project.liveUrl.value && <a href={project.liveUrl.value} target="_blank" rel="noopener noreferrer">Live project ↗</a>}</div></details></div>
    </div>
  </article></FadeIn>;
}
export const ProjectsSection = () => {
  const [preview, setPreview] = useState<LightboxData | null>(null);
  return <><section id="projects" className="projects-section section-shell">
    <div className="section-kicker"><span className="eyebrow">02 / Selected work</span><span className="eyebrow">A few things I've put into the world</span></div>
    <div className="projects-heading"><h2>Proof of<br /><span className="serif-word">curiosity.</span></h2><div className="work-counter">({String(content.projects.length).padStart(2, '0')})<span>Projects & experiments<br />Scroll to explore ↓</span></div></div>
    <nav className="project-directory" aria-label="Project index">{content.projects.map((project, index) => <a key={project.id} href={'#project-' + project.id}><span>0{index + 1}</span>{project.name.value}<span>↘</span></a>)}</nav>
    <div className="project-list">{content.projects.map((project, index) => <ProjectShowcase key={project.id} project={project} index={index} onPreview={setPreview} />)}</div>
  </section><LightboxModal item={preview} onClose={() => setPreview(null)} /></>;
};
