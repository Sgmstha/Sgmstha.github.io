import { motion, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { FadeIn } from '../ui/FadeIn';

export const ExperienceSection = () => {
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="experience-section">
      <div className="section-shell">
        <div className="section-kicker">
          <span className="eyebrow">03 / The journey so far</span>
          <span className="eyebrow">Experience &amp; learning</span>
        </div>
        <div className="experience-header">
          <h2>
            Built through
            <br />
            <span className="serif-word">experience.</span>
          </h2>
          <p className="section-description">
            Every project adds a new perspective.
            <br />
            Every team brings something to learn.
          </p>
        </div>
        <div className="experience-list">
          {content.experience
            .filter(item => item.role.value !== null)
            .map((item, index) => {
              const isPresent = item.period.value?.toLowerCase().includes('present');
              return (
                <FadeIn key={item.id}>
                  <article className="experience-row">
                    <div className="experience-date">
                      <span className="eyebrow">0{index + 1}</span>
                      <p>
                        {item.period.value}
                        {isPresent && <span className="timeline-active-pulse" title="Ongoing role" />}
                      </p>
                    </div>
                    <div>
                      <h3>{item.role.value}</h3>
                      <p className="experience-company">{item.company.value}</p>
                      <p className="muted">
                        {[item.employmentType?.value, item.location?.value].filter(Boolean).join(' · ')}
                      </p>
                      {item.description.value && <p>{item.description.value}</p>}
                      <div className="tag-list">
                        {item.skills?.value?.map(skill => (
                          <motion.span
                            key={skill}
                            whileHover={reduced ? undefined : { y: -2, scale: 1.05 }}
                            transition={{ duration: 0.15 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <span className="experience-symbol" aria-hidden="true">
                      ↗
                    </span>
                  </article>
                </FadeIn>
              );
            })}
        </div>
        <details className="certificates">
          <summary>
            <div>
              <h3>Always a student.</h3>
              <p className="muted">Explore training &amp; certificates</p>
            </div>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="certificate-grid">
            {content.certifications
              .filter(cert => cert.name.value)
              .map(cert => (
                <motion.article
                  key={cert.id}
                  className="certificate-card"
                  whileHover={reduced ? undefined : { y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="eyebrow">Learning / completion</span>
                  <h4>{cert.name.value}</h4>
                  <p>{cert.issuer.value}</p>
                  {cert.organizer?.value && <p>Organizer: {cert.organizer.value}</p>}
                  {cert.trainingPartner?.value && <p>Training partner: {cert.trainingPartner.value}</p>}
                  {cert.evidenceUrl && (
                    <a className="text-link" href={cert.evidenceUrl} target="_blank" rel="noopener noreferrer">
                      View completion post ↗
                    </a>
                  )}
                </motion.article>
              ))}
          </div>
        </details>
      </div>
    </section>
  );
};
