import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { AvatarAction, AvatarMessage } from '../../data/avatarMessages';

export interface AvatarBubbleProps {
  message: AvatarMessage | null;
  isMuted: boolean;
  onDismiss: () => void;
  onToggleMute: () => void;
  onToggleHide?: () => void;
}

export function AvatarBubble({
  message,
  isMuted,
  onDismiss,
  onToggleMute,
  onToggleHide,
}: AvatarBubbleProps) {
  const reducedMotion = useReducedMotion();
  const [typedCount, setTypedCount] = useState<number>(0);

  // Typewriter effect (~25ms per character)
  useEffect(() => {
    if (!message) {
      setTypedCount(0);
      return;
    }

    if (reducedMotion) {
      setTypedCount(message.text.length);
      return;
    }

    setTypedCount(1);
    const interval = setInterval(() => {
      setTypedCount((current) => {
        if (current >= message.text.length) {
          clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [message, reducedMotion]);

  const handleActionClick = (e: React.MouseEvent, action: AvatarAction) => {
    e.stopPropagation();
    const targetEl = document.getElementById(action.targetSection);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    onDismiss();
  };

  const isTypingDone = message ? typedCount >= message.text.length : false;
  const displayedText = message ? message.text.slice(0, typedCount) : '';

  return (
    <div className="avatar-bubble-anchor">
      {/* Small persistent Control Buttons */}
      <div className="mascot-controls-cluster">
        <button
          type="button"
          className={`mascot-mute-toggle ${isMuted ? 'is-muted' : ''}`}
          onClick={onToggleMute}
          title={isMuted ? 'Unmute companion speech' : 'Mute companion speech'}
          aria-label={isMuted ? 'Unmute companion speech' : 'Mute companion speech'}
          aria-pressed={isMuted}
        >
          {isMuted ? (
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 5.343a1 1 0 011.414 0A7.978 7.978 0 0118 10a7.978 7.978 0 01-1.929 4.657 1 1 0 11-1.414-1.414A5.982 5.982 0 0016 10c0-1.246-.38-2.404-1.343-3.243a1 1 0 010-1.414zM12.536 7.464a1 1 0 011.414 0A3.987 3.987 0 0115 10a3.987 3.987 0 01-1.05 2.536 1 1 0 11-1.414-1.414c.32-.32.464-.707.464-1.122 0-.415-.144-.802-.464-1.122a1 1 0 010-1.414z" />
            </svg>
          )}
        </button>

        {onToggleHide && (
          <button
            type="button"
            className="mascot-hide-toggle"
            onClick={onToggleHide}
            title="Hide companion mascot"
            aria-label="Hide companion mascot"
          >
            <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          </button>
        )}
      </div>

      {/* Speech Bubble Container */}
      <AnimatePresence>
        {message && !isMuted && (
          <motion.div
            key={message.id}
            className="avatar-speech-bubble"
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 340,
            }}
            onClick={onDismiss}
            role="status"
            aria-live="polite"
            title="Click to dismiss"
          >
            {/* Visual Tail pointing to avatar */}
            <div className="avatar-speech-tail" aria-hidden="true" />

            <div className="avatar-speech-header">
              <span className="avatar-speech-name">Companion</span>
              <button
                type="button"
                className="avatar-speech-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                aria-label="Dismiss speech bubble"
                title="Dismiss"
              >
                ×
              </button>
            </div>

            <p className="avatar-speech-text">
              {displayedText}
              {!isTypingDone && !reducedMotion && (
                <span className="avatar-typing-cursor" aria-hidden="true">▍</span>
              )}
            </p>

            {/* Quick Action Chips */}
            {message.actions && message.actions.length > 0 && isTypingDone && (
              <div className="avatar-speech-actions">
                {message.actions.map((action) => (
                  <button
                    key={action.targetSection + action.label}
                    type="button"
                    className="avatar-chip-btn"
                    onClick={(e) => handleActionClick(e, action)}
                  >
                    <span>{action.label}</span>
                    <span aria-hidden="true" className="chip-arrow">→</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
