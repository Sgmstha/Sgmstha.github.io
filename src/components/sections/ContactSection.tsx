import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolioContent as content } from '../../data/content';
import { Magnetic } from '../ui/Magnetic';

const inquiryTopics = [
  { id: 'collab', label: 'Project collaboration', subject: 'Project Collaboration Inquiry' },
  { id: 'webapp', label: 'Web / mobile app', subject: 'Web & Mobile App Development' },
  { id: 'consult', label: 'Consultation', subject: 'Technical Consultation Inquiry' },
  { id: 'hello', label: 'Just saying hello', subject: 'Hello Sugam!' },
];

export const ContactSection = () => {
  const { email, phone, location, social } = content.contact;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('Project Collaboration Inquiry');
  const reduced = useReducedMotion();

  const copyEmail = async () => {
    if (!email.value) return;
    try {
      await navigator.clipboard.writeText(email.value);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyError(true);
    }
  };

  const mailtoHref = email.value
    ? `mailto:${email.value}?subject=${encodeURIComponent(selectedTopic)}`
    : '#';

  return (
    <section id="contact" className="contact-section light-section">
      <div className="section-shell">
        <div className="section-kicker">
          <span className="eyebrow">05 / Your idea starts here</span>
          <span className="eyebrow">Say hello</span>
        </div>
        <div className="contact-heading">
          <h2>
            Let’s make
            <br />
            <span className="serif-word">something.</span>
          </h2>
          {email.value && (
            <Magnetic strength={0.4}>
              <a
                className="contact-orb"
                href={mailtoHref}
                aria-label="Send Sugam an email with selected topic"
              >
                ↗
              </a>
            </Magnetic>
          )}
        </div>

        {/* Quick Inquiry Topic Selector */}
        <div className="inquiry-topics-wrap">
          <span className="inquiry-label">Select topic or purpose:</span>
          <div className="inquiry-chips" role="group" aria-label="Inquiry topic selection">
            {inquiryTopics.map(topic => (
              <motion.button
                key={topic.id}
                type="button"
                className={`inquiry-chip ${selectedTopic === topic.subject ? 'active' : ''}`}
                aria-pressed={selectedTopic === topic.subject}
                onClick={() => setSelectedTopic(topic.subject)}
                whileHover={reduced ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {topic.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="contact-bottom">
          <div>
            <p>Let’s turn it into something worth making.</p>
            {email.value && (
              <div className="email-row">
                <a className="contact-email" href={mailtoHref}>
                  {email.value}
                </a>
                <Magnetic strength={0.2}>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    aria-label="Copy email address"
                  >
                    {copied ? 'Copied ✓' : 'Copy ↗'}
                  </button>
                </Magnetic>
              </div>
            )}
            <span className="copy-status" role="status">
              {copyError
                ? 'Copy unavailable. You can select the address or use the email link.'
                : copied
                ? 'Email address copied to clipboard.'
                : ''}
            </span>
          </div>
          <div className="contact-details">
            <span>Based in {location.value}</span>
            {phone.value && <a href={'tel:' + phone.value.replace(/[^+\d]/g, '')}>{phone.value}</a>}
            {social.linkedin.value && (
              <a href={social.linkedin.value} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            )}
            {social.github.value && (
              <a href={social.github.value} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            )}
          </div>
        </div>
        <footer>
          <a className="brand-mark" href="#home" aria-label="Back to home">
            s<span>↗</span>
          </a>
          <span>
            © {new Date().getFullYear()} {content.name.value}
            <small>Built with curiosity. From Nepal.</small>
          </span>
          <a href="#home">Back to the beginning ↑</a>
        </footer>
      </div>
    </section>
  );
};
