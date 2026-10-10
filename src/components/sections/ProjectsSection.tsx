import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import type { Project } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';
import { LightboxModal } from '../ui/LightboxModal';
import type { LightboxData } from '../ui/LightboxModal';
import { reportProjectHover, useAvatarState } from '../scene/avatarState';

const directions = [
  { title: 'From conversation to code.', label: 'AI / Developer Tool', word: 'AI CODER', subtitle: 'Codebase analysis & patches.' },
  { title: 'Restock before you run out.', label: 'Full-Stack / Analytics', word: 'SMART RESTOCK', subtitle: 'Predictive inventory & consumption.' },
  { title: 'Vision that plays in real time.', label: 'Computer Vision / YOLO', word: 'AUTONOMOUS BOT', subtitle: 'Real-time detection & navigation.' },
  { title: 'Calculated care for every meal.', label: 'Web App / Nutrition', word: 'RAW PMR CALCULATOR', subtitle: 'Precise portions & recipe builder.' },
];

function ProjectShowcase({
  project,
  index,
  onOpenLightbox,
}: {
  project: Project;
  index: number;
  onOpenLightbox: (data: LightboxData) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const art = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const direction = directions[index];
  const screenshot = project.images.value && 'url' in project.images.value ? project.images.value : null;
  const { setTemporaryState } = useAvatarState();

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty('--card-x', `${x}px`);
    event.currentTarget.style.setProperty('--card-y', `${y}px`);
    if (art.current) {
      art.current.style.setProperty('--tilt-x', ((event.clientY - rect.top) / rect.height - 0.5) * -5 + 'deg');
      art.current.style.setProperty('--tilt-y', ((event.clientX - rect.left) / rect.width - 0.5) * 6 + 'deg');
    }
  };

  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty('--card-x');
    event.currentTarget.style.removeProperty('--card-y');
    art.current?.style.setProperty('--tilt-x', '0deg');
    art.current?.style.setProperty('--tilt-y', '0deg');
  };

  const handleOpenPreview = (e: React.MouseEvent) => {
    if (!screenshot) return;
    e.preventDefault();
    onOpenLightbox({
      url: screenshot.url,
      alt: screenshot.alt,
      title: project.name.value || 'Project Showcase',
      subtitle: direction.subtitle,
      tech: project.techStack.value || [],
    });
  };

  return (
    <FadeIn>
      <article className={'project-showcase project-' + index}>
        <div
          className="project-visual spotlight-card"
          onPointerEnter={() => {
            setTemporaryState('happy', 2000);
            reportProjectHover(project.id);
          }}
          onPointerDown={() => {
            setTemporaryState('happy', 2000);
            reportProjectHover(project.id);
          }}
          onPointerMove={move}
          onPointerLeave={(e) => {
            reset(e);
            reportProjectHover(null);
          }}
        >
          {screenshot ? (
            <div className="project-screenshot">
              <div className="screenshot-spotlight" aria-hidden="true" />
              <div className="screenshot-topline">
                <span>
                  <i /> {project.name.value}
                </span>
                <span>{direction.word}</span>
              </div>
              <a
                href={screenshot.url}
                onClick={handleOpenPreview}
                aria-label={'Open preview for ' + project.name.value}
              >
                <img src={screenshot.url} alt={screenshot.alt} loading="lazy" decoding="async" />
              </a>
              <div className="screenshot-bottomline">
                <span>{direction.subtitle}</span>
                <button
                  type="button"
                  className="preview-trigger-btn"
                  onClick={handleOpenPreview}
                  title="Expand high-res preview"
                >
                  View preview ↗
                </button>
              </div>
            </div>
          ) : (
            <div className="project-art" ref={art} aria-hidden="true">
              <div className="art-topline">
                <span>{direction.word}</span>
                <span>↗</span>
              </div>
              <div className="art-scene">
                {index === 0 && (
                  <>
                    <div className="product-plinth" />
                    <div className="sculpted-vase">
                      <i /><i /><i /><i /><i /><i /><i />
                    </div>
                    <span className="art-big-word">
                      form<br />&amp; function.
                    </span>
                    <div className="art-specimen">
                      OBJECT NO. 001<br />EVERYDAY / EXTRAORDINARY
                    </div>
                  </>
                )}
                {index === 1 && (
                  <>
                    <div className="record-sleeve">
                      <span>PLAY<br /><em>IT LOUD.</em></span>
                    </div>
                    <div className="vinyl"><i /><b>ss</b></div>
                    <div className="sound-bars">
                      {Array.from({ length: 18 }, (_, n) => (
                        <i key={n} style={{ height: 8 + ((n * 13) % 41) }} />
                      ))}
                    </div>
                  </>
                )}
                {index === 3 && (
                  <>
                    <div className="portfolio-window">
                      <div><i /><i /><i /></div>
                      <strong>Always<br /><em>in progress.</em></strong>
                      <span>DESIGN. DEVELOP. REPEAT.</span>
                      <b>↗</b>
                    </div>
                    <span className="portfolio-star">✳</span>
                  </>
                )}
              </div>
              <div className="art-bottomline">
                <span>{direction.subtitle}</span>
                <span>0{index + 1} / 04</span>
              </div>
            </div>
          )}
          <span className="visual-caption">
            {screenshot
              ? 'Actual application screenshot · development build'
              : 'Art direction study · not a project screenshot'}
          </span>
        </div>
        <div className="project-information">
          <div className="project-number">
            <span>0{index + 1}</span>
            <span className="eyebrow">{direction.label}</span>
          </div>
          <h3>{project.name.value}</h3>
          <p className="project-hook">{direction.title}</p>
          {project.status?.value && (
            <span className="project-status">
              <i />
              {project.status.value}
            </span>
          )}
          {project.summary?.value && <p className="project-summary">{project.summary.value}</p>}
          <div className="tag-list">
            {project.techStack.value?.map(tag => (
              <motion.span
                key={tag}
                whileHover={reduced ? undefined : { y: -2, scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          {project.features.value && (
            <ul className="project-capabilities" aria-label="Project capabilities">
              {project.features.value.map(feature => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}
          <button
            className="project-toggle"
            type="button"
            onClick={() => setExpanded(value => !value)}
            aria-expanded={expanded}
            aria-controls={'details-' + project.id}
          >
            <span>{expanded ? 'Close overview' : 'Project overview'}</span>
            <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id={'details-' + project.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="project-details"
              >
                <p>{project.description.value}</p>
                {project.sourceUrl.value && (
                  <a href={project.sourceUrl.value} target="_blank" rel="noopener noreferrer">
                    Source code ↗
                  </a>
                )}
                {project.liveUrl.value && (
                  <a href={project.liveUrl.value} target="_blank" rel="noopener noreferrer">
                    Live project ↗
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>
    </FadeIn>
  );
}

export const ProjectsSection = () => {
  const [activeLightbox, setActiveLightbox] = useState<LightboxData | null>(null);

  return (
    <>
      <section id="projects" className="projects-section section-shell">
        <div className="section-kicker">
          <span className="eyebrow">02 / Some things I’ve built</span>
          <span className="eyebrow">Selected work / 04</span>
        </div>
        <div className="projects-heading">
          <h2>
            Built to work.
            <br />
            <span className="serif-word">Made to feel.</span>
          </h2>
          <p>
            Different projects. The same curiosity.
            <br />
            From computer vision to predictive tools.
          </p>
        </div>
        <div className="project-list">
          {content.projects.map((project, index) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={index}
              onOpenLightbox={setActiveLightbox}
            />
          ))}
        </div>
      </section>
      <LightboxModal item={activeLightbox} onClose={() => setActiveLightbox(null)} />
    </>
  );
};
