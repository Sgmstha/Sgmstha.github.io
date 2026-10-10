import { useSyncExternalStore } from 'react';

export type AvatarState = 'idle' | 'curious' | 'thinking' | 'excited' | 'happy' | 'sleeping' | 'dizzy';

export const SECTION_STATE_MAP: Record<string, AvatarState> = {
  home: 'idle',
  about: 'curious',
  projects: 'excited',
  experience: 'curious',
  skills: 'thinking',
  contact: 'happy',
};

// Internal store
let currentState: AvatarState = 'idle';
let currentSectionState: AvatarState = 'idle';
let currentActiveSection: string = 'home';
let tempTimeout: ReturnType<typeof setTimeout> | null = null;
let idleTimeout: ReturnType<typeof setTimeout> | null = null;
let sleepTimeout: ReturnType<typeof setTimeout> | null = null;

// Look override vector [-1, 1] for nudging mascot gaze (e.g. towards contact form or bubble)
let lookOverride: { x: number; y: number } | null = null;

// Hovered project tracker
let currentHoveredProject: string | null = null;

const listeners = new Set<() => void>();
const sectionListeners = new Set<(sectionId: string) => void>();
const wakeUpListeners = new Set<() => void>();
const idleListeners = new Set<() => void>();
const projectHoverListeners = new Set<(projectId: string | null) => void>();
const exploreClickListeners = new Set<() => void>();
const labSwitchListeners = new Set<(mode: string) => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getAvatarState(): AvatarState {
  return currentState;
}

export function getActiveSection(): string {
  return currentActiveSection;
}

export function getAvatarLookOverride(): { x: number; y: number } | null {
  return lookOverride;
}

export function setAvatarLookOverride(look: { x: number; y: number } | null) {
  lookOverride = look;
}

export function setAvatarState(state: AvatarState) {
  if (tempTimeout) {
    clearTimeout(tempTimeout);
    tempTimeout = null;
  }
  if (currentState !== state) {
    currentState = state;
    notify();
  }
}

/** Set temporary state (e.g. hover on project card), then auto-revert to section state. */
export function setTemporaryAvatarState(state: AvatarState, durationMs = 1800) {
  if (tempTimeout) clearTimeout(tempTimeout);
  currentState = state;
  notify();

  tempTimeout = setTimeout(() => {
    tempTimeout = null;
    currentState = currentSectionState;
    notify();
  }, durationMs);
}

export function setSectionAvatarState(sectionId: string) {
  const previousSection = currentActiveSection;
  currentActiveSection = sectionId;
  const targetState = SECTION_STATE_MAP[sectionId] || 'idle';
  currentSectionState = targetState;

  if (previousSection !== sectionId) {
    sectionListeners.forEach((fn) => fn(sectionId));
  }

  // If not currently in a temporary override or sleeping, update state
  if (!tempTimeout && currentState !== 'sleeping') {
    currentState = targetState;
    notify();
  }
}

export function subscribeAvatarState(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeSectionChange(listener: (sectionId: string) => void) {
  sectionListeners.add(listener);
  return () => {
    sectionListeners.delete(listener);
  };
}

export function subscribeWakeUp(listener: () => void) {
  wakeUpListeners.add(listener);
  return () => {
    wakeUpListeners.delete(listener);
  };
}

export function subscribeIdle(listener: () => void) {
  idleListeners.add(listener);
  return () => {
    idleListeners.delete(listener);
  };
}

export function reportProjectHover(projectId: string | null) {
  if (currentHoveredProject !== projectId) {
    currentHoveredProject = projectId;
    projectHoverListeners.forEach((listener) => listener(projectId));
  }
}

export function subscribeProjectHover(listener: (projectId: string | null) => void) {
  projectHoverListeners.add(listener);
  return () => {
    projectHoverListeners.delete(listener);
  };
}

export function reportExploreClick() {
  exploreClickListeners.forEach((fn) => fn());
}

export function subscribeExploreClick(listener: () => void) {
  exploreClickListeners.add(listener);
  return () => {
    exploreClickListeners.delete(listener);
  };
}

export function reportLabSwitch(mode: string) {
  labSwitchListeners.forEach((fn) => fn(mode));
}

export function subscribeLabSwitch(listener: (mode: string) => void) {
  labSwitchListeners.add(listener);
  return () => {
    labSwitchListeners.delete(listener);
  };
}

// 15-second idle, 20-second sleep and interaction watcher singleton
let initialized = false;
let cleanupFn: (() => void) | null = null;

export function initAvatarInteractionWatcher(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (initialized && cleanupFn) return cleanupFn;
  initialized = true;

  const resetInactivity = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    if (sleepTimeout) clearTimeout(sleepTimeout);

    // Wake up if sleeping
    if (currentState === 'sleeping') {
      currentState = currentSectionState;
      notify();
      wakeUpListeners.forEach((fn) => fn());
    }

    // Trigger idle line after 15s of no interaction
    idleTimeout = setTimeout(() => {
      idleListeners.forEach((fn) => fn());
    }, 15000);

    // Go to sleep after 20s of no interaction
    sleepTimeout = setTimeout(() => {
      if (!tempTimeout) {
        currentState = 'sleeping';
        notify();
      }
    }, 20000);
  };

  // Observe sections
  const sectionIds = Object.keys(SECTION_STATE_MAP);
  const observer = new IntersectionObserver(
    (entries) => {
      let bestEntry: IntersectionObserverEntry | null = null;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }
      }
      if (bestEntry?.target.id) {
        setSectionAvatarState(bestEntry.target.id);
      }
    },
    { threshold: [0.15, 0.4, 0.7] }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Track user activity
  const events = ['scroll', 'pointermove', 'pointerdown', 'keydown', 'touchstart'] as const;
  events.forEach((ev) => window.addEventListener(ev, resetInactivity, { passive: true }));
  resetInactivity();

  cleanupFn = () => {
    initialized = false;
    observer.disconnect();
    events.forEach((ev) => window.removeEventListener(ev, resetInactivity));
    if (idleTimeout) clearTimeout(idleTimeout);
    if (sleepTimeout) clearTimeout(sleepTimeout);
    if (tempTimeout) clearTimeout(tempTimeout);
  };

  return cleanupFn;
}

export interface AvatarStateHookResult {
  state: AvatarState;
  setState: (state: AvatarState) => void;
  setTemporaryState: (state: AvatarState, durationMs?: number) => void;
  resetToSectionState: () => void;
  0: AvatarState;
  1: (state: AvatarState) => void;
  [Symbol.iterator](): Iterator<AvatarState | ((state: AvatarState) => void)>;
}

export function useAvatarState(): AvatarStateHookResult {
  const state = useSyncExternalStore(subscribeAvatarState, getAvatarState, () => 'idle');

  const setState = setAvatarState;
  const setTemp = setTemporaryAvatarState;
  const resetToSection = () => {
    if (tempTimeout) {
      clearTimeout(tempTimeout);
      tempTimeout = null;
    }
    currentState = currentSectionState;
    notify();
  };

  const tuple = [state, setState] as const;

  const result = {
    state,
    setState,
    setTemporaryState: setTemp,
    resetToSectionState: resetToSection,
    0: state,
    1: setState,
    [Symbol.iterator]: () => tuple[Symbol.iterator](),
  };

  return result as AvatarStateHookResult;
}
