import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface LightboxData {
  url: string;
  alt: string;
  title: string;
  subtitle: string;
  tech?: string[];
}

export function LightboxModal({
  item,
  onClose,
}: {
  item: LightboxData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title + ' preview'}
        >
          <motion.div
            className="lightbox-container"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="lightbox-header">
              <div className="lightbox-titles">
                <span className="eyebrow"><i /> Project capture preview</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <div className="lightbox-actions">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lightbox-btn"
                  title="Open original raw image in new tab"
                >
                  Raw file ↗
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="lightbox-close-btn"
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="lightbox-media-wrapper">
              <img src={item.url} alt={item.alt} />
            </div>

            {item.tech && item.tech.length > 0 && (
              <div className="lightbox-footer">
                <span className="lightbox-tech-label">Technologies:</span>
                <div className="tag-list">
                  {item.tech.map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
