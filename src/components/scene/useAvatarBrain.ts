import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AVATAR_MESSAGES,
  PROJECT_MESSAGES,
  type AvatarMessage,
  type MessageGroup,
} from '../../data/avatarMessages';
import {
  getAvatarState,
  setAvatarLookOverride,
  setTemporaryAvatarState,
  subscribeExploreClick,
  subscribeIdle,
  subscribeLabSwitch,
  subscribeProjectHover,
  subscribeSectionChange,
  subscribeWakeUp,
} from './avatarState';

const MUTE_STORAGE_KEY = 'portfolio_mascot_muted';
const VISITED_STORAGE_KEY = 'portfolio_mascot_visited';
const SCROLL_FAST_SESSION_KEY = 'portfolio_mascot_scrolled_fast';
const SHOWN_STORAGE_KEY = 'portfolio_mascot_shown_ids';
const MAX_SESSION_MESSAGES = 8;
const GLOBAL_COOLDOWN_MS = 8000;

function getStoredShownIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SHOWN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {
    // fallback
  }
  return new Set();
}

function saveStoredShownIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SHOWN_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // fallback
  }
}

function getKathmanduHour(): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      hour: 'numeric',
      hour12: false,
    }).formatToParts(new Date());
    const hourPart = parts.find((p) => p.type === 'hour');
    return hourPart ? parseInt(hourPart.value, 10) : new Date().getHours();
  } catch {
    return new Date().getHours();
  }
}

export interface UseAvatarBrainReturn {
  currentMessage: AvatarMessage | null;
  isMuted: boolean;
  dismissMessage: () => void;
  toggleMute: () => void;
  triggerMessage: (message: AvatarMessage, options?: { bypassCooldown?: boolean }) => boolean;
  triggerGroup: (group: MessageGroup, options?: { bypassCooldown?: boolean }) => boolean;
}

export function useAvatarBrain(): UseAvatarBrainReturn {
  const [currentMessage, setCurrentMessage] = useState<AvatarMessage | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  });

  // Track session and speech stats in mutable refs (avoid React re-renders)
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const currentMessageRef = useRef<AvatarMessage | null>(null);
  useEffect(() => {
    currentMessageRef.current = currentMessage;
  }, [currentMessage]);

  const lastSpokeTimeRef = useRef<number>(0);
  const sessionCountRef = useRef<number>(0);
  const usedMessageIdsRef = useRef<Set<string>>(getStoredShownIds());
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fast scroll tracking
  const recentSectionTransitionsRef = useRef<number[]>([]);
  const scrollFastUsedRef = useRef<boolean>(
    typeof window !== 'undefined'
      ? sessionStorage.getItem(SCROLL_FAST_SESSION_KEY) === 'true'
      : false
  );

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const dismissMessage = useCallback(() => {
    clearDismissTimer();
    setCurrentMessage(null);
    currentMessageRef.current = null;
    setAvatarLookOverride(null);
  }, [clearDismissTimer]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_STORAGE_KEY, String(next));
      if (next) {
        dismissMessage();
      }
      return next;
    });
  }, [dismissMessage]);

  /**
   * Core speaking decision engine.
   * Returns true if message was shown, false if blocked by policy.
   */
  const speak = useCallback(
    (message: AvatarMessage, options?: { bypassCooldown?: boolean }): boolean => {
      if (typeof window === 'undefined') return false;
      if (isMutedRef.current) return false;
      if (document.hidden) return false;
      if (currentMessageRef.current !== null) return false;

      const bypass = Boolean(options?.bypassCooldown);
      if (!bypass) {
        if (sessionCountRef.current >= MAX_SESSION_MESSAGES) return false;
        const now = Date.now();
        if (now - lastSpokeTimeRef.current < GLOBAL_COOLDOWN_MS) return false;
      }

      // Track shown ID in memory and localStorage for returning visitors
      usedMessageIdsRef.current.add(message.id);
      saveStoredShownIds(usedMessageIdsRef.current);

      sessionCountRef.current += 1;
      lastSpokeTimeRef.current = Date.now();

      // Duration proportional to text length (min 3.0s)
      const durationMs = Math.max(3000, 2000 + message.text.length * 40);

      // Play avatar emotional state while speaking
      setTemporaryAvatarState(message.state, durationMs);

      // Nudge eyes toward contact form if in contact section
      if (message.tags?.includes('contact') || message.id.startsWith('cnt-')) {
        setAvatarLookOverride({ x: -0.8, y: 0.7 });
      }

      setCurrentMessage(message);
      currentMessageRef.current = message;

      clearDismissTimer();
      dismissTimerRef.current = setTimeout(() => {
        dismissMessage();
      }, durationMs);

      return true;
    },
    [clearDismissTimer, dismissMessage]
  );

  /**
   * Pick an unconsumed message from a specific group.
   * Stays silent if all lines in the group are exhausted, recycling on full rotation.
   */
  const pickAndSpeak = useCallback(
    (group: MessageGroup, options?: { bypassCooldown?: boolean }): boolean => {
      const candidates = AVATAR_MESSAGES[group] || [];
      if (candidates.length === 0) return false;

      let available = candidates.filter((msg) => !usedMessageIdsRef.current.has(msg.id));
      if (available.length === 0) {
        // Recycle this group's IDs once exhausted so visitor gets fresh rotation
        candidates.forEach((msg) => usedMessageIdsRef.current.delete(msg.id));
        saveStoredShownIds(usedMessageIdsRef.current);
        available = candidates;
      }

      const randomIndex = Math.floor(Math.random() * available.length);
      const chosen = available[randomIndex];
      return speak(chosen, options);
    },
    [speak]
  );

  /**
   * 1. INITIAL WELCOME & TIME OF DAY TRIGGER
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const welcomeTimer = setTimeout(() => {
      const hasVisited = Boolean(localStorage.getItem(VISITED_STORAGE_KEY));
      if (!hasVisited) {
        localStorage.setItem(VISITED_STORAGE_KEY, Date.now().toString());
      }

      const kathmanduHour = getKathmanduHour();
      const isLateNight = kathmanduHour >= 22 || kathmanduHour < 5;
      const isMorning = kathmanduHour >= 5 && kathmanduHour < 10;

      if (isLateNight && Math.random() < 0.6) {
        if (pickAndSpeak('lateNight')) return;
      } else if (isMorning && Math.random() < 0.5) {
        if (pickAndSpeak('morning')) return;
      }

      if (!hasVisited) {
        pickAndSpeak('welcome');
      } else {
        pickAndSpeak('welcomeBack');
      }
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, [pickAndSpeak]);

  /**
   * 2. SECTION ENTER TRIGGER (Stay for ~2s, ignore fast scroll-throughs)
   */
  useEffect(() => {
    const handleSectionChange = (sectionId: string) => {
      if (sectionTimerRef.current) {
        clearTimeout(sectionTimerRef.current);
        sectionTimerRef.current = null;
      }

      // Track section transition speed for scrollFast trigger
      const now = performance.now();
      const transitions = recentSectionTransitionsRef.current;
      transitions.push(now);
      while (transitions.length > 0 && now - transitions[0] > 1400) {
        transitions.shift();
      }

      if (
        transitions.length >= 3 &&
        !scrollFastUsedRef.current &&
        sessionCountRef.current < MAX_SESSION_MESSAGES
      ) {
        scrollFastUsedRef.current = true;
        sessionStorage.setItem(SCROLL_FAST_SESSION_KEY, 'true');
        pickAndSpeak('scrollFast');
        return;
      }

      // Debounce section message by 2000ms
      sectionTimerRef.current = setTimeout(() => {
        sectionTimerRef.current = null;

        // Map section ID to message group
        const groupKey =
          sectionId === 'home'
            ? 'hero'
            : (sectionId as MessageGroup);

        if (groupKey in AVATAR_MESSAGES) {
          // If in hero section, consider time-of-day lines
          if (groupKey === 'hero') {
            const hour = getKathmanduHour();
            if ((hour >= 22 || hour < 5) && Math.random() < 0.5) {
              if (pickAndSpeak('lateNight')) return;
            } else if (hour >= 5 && hour < 10 && Math.random() < 0.5) {
              if (pickAndSpeak('morning')) return;
            }
          }
          pickAndSpeak(groupKey);
        }
      }, 2000);
    };

    const unsubscribe = subscribeSectionChange(handleSectionChange);
    return () => {
      unsubscribe();
      if (sectionTimerRef.current) clearTimeout(sectionTimerRef.current);
    };
  }, [pickAndSpeak]);

  /**
   * 3. PROJECT CARD HOVER (> 1 second)
   */
  useEffect(() => {
    const handleProjectHover = (projectId: string | null) => {
      if (projectHoverTimerRef.current) {
        clearTimeout(projectHoverTimerRef.current);
        projectHoverTimerRef.current = null;
      }

      if (!projectId) return;

      projectHoverTimerRef.current = setTimeout(() => {
        projectHoverTimerRef.current = null;
        const projectList = PROJECT_MESSAGES[projectId];
        if (projectList && projectList.length > 0) {
          const available = projectList.filter((m) => !usedMessageIdsRef.current.has(m.id));
          if (available.length > 0) {
            const picked = available[Math.floor(Math.random() * available.length)];
            speak(picked);
          }
        }
      }, 1000);
    };

    const unsubscribe = subscribeProjectHover(handleProjectHover);
    return () => {
      unsubscribe();
      if (projectHoverTimerRef.current) clearTimeout(projectHoverTimerRef.current);
    };
  }, [speak]);

  /**
   * 4. IDLE FOR 15s TRIGGER
   */
  useEffect(() => {
    const handleIdle = () => {
      if (getAvatarState() !== 'sleeping') {
        pickAndSpeak('idle');
      }
    };

    const unsubscribe = subscribeIdle(handleIdle);
    return () => unsubscribe();
  }, [pickAndSpeak]);

  /**
   * 5. WAKE UP TRIGGER
   */
  useEffect(() => {
    const handleWakeUp = () => {
      pickAndSpeak('wakeUp');
    };

    const unsubscribe = subscribeWakeUp(handleWakeUp);
    return () => unsubscribe();
  }, [pickAndSpeak]);

  /**
   * 6. GOODBYE TRIGGER (Mouse leaves toward top of window)
   */
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 8 && !document.hidden) {
        pickAndSpeak('goodbye', { bypassCooldown: true });
      }
    };

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pickAndSpeak]);

  /**
   * 7. PAGE AWARENESS: "Explore selected work" click reaction
   */
  useEffect(() => {
    const handleExplore = () => {
      setTemporaryAvatarState('excited', 2500);
      pickAndSpeak('exploreClick', { bypassCooldown: true });
    };

    const unsubscribe = subscribeExploreClick(handleExplore);
    return () => unsubscribe();
  }, [pickAndSpeak]);

  /**
   * 8. PAGE AWARENESS: Switching geometry lab tabs reaction
   */
  useEffect(() => {
    const handleLab = () => {
      setTemporaryAvatarState('thinking', 2000);
      pickAndSpeak('labSwitch', { bypassCooldown: true });
    };

    const unsubscribe = subscribeLabSwitch(handleLab);
    return () => unsubscribe();
  }, [pickAndSpeak]);

  const triggerGroup = useCallback(
    (group: MessageGroup, options?: { bypassCooldown?: boolean }) => {
      return pickAndSpeak(group, options);
    },
    [pickAndSpeak]
  );

  return {
    currentMessage,
    isMuted,
    dismissMessage,
    toggleMute,
    triggerMessage: speak,
    triggerGroup,
  };
}
