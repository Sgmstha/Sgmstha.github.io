import { useState } from 'react';
import { portfolioContent as content } from '../../data/content';
export const ContactSection = () => {
  const { email, phone, location, social } = content.contact;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyEmail = async () => {
    if (!email.value) return;
    try { await navigator.clipboard.writeText(email.value); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  };
  return <section id="contact" className="contact-section light-section">
    <div className="section-shell">
      <div className="section-kicker"><span className="eyebrow">05 / Your idea starts here</span><span className="eyebrow">Say hello</span></div>
      <div className="contact-heading"><h2>Have a good<br /><span className="serif-word">challenge?</span></h2>{email.value && <a className="contact-orb" href={'mailto:' + email.value} aria-label="Send Sugam an email">↗</a>}</div>
      <div className="contact-bottom"><div><p>Let’s turn it into something worth making.</p>{email.value && <div className="email-row"><a className="contact-email" href={'mailto:' + email.value}>{email.value}</a><button type="button" onClick={copyEmail} aria-label="Copy email address">{copied ? 'Copied ✓' : 'Copy ↗'}</button></div>}<span className="copy-status" role="status">{copyError ? 'Copy unavailable. You can select the address or use the email link.' : copied ? 'Email address copied.' : ''}</span></div><div className="contact-details"><span>Based in {location.value}</span>{phone.value && <a href={'tel:' + phone.value.replace(/[^+\d]/g, '')}>{phone.value}</a>}{social.linkedin.value && <a href={social.linkedin.value} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}{social.github.value && <a href={social.github.value} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}</div></div>
      <footer><a className="brand-mark" href="#home" aria-label="Back to home">s<span>↗</span></a><span>© {new Date().getFullYear()} {content.name.value}<small>Built with curiosity. From Nepal.</small></span><a href="#home">Back to the beginning ↑</a></footer>
    </div>
  </section>;
};
