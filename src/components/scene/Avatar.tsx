import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import {
  getAvatarLookOverride,
  initAvatarInteractionWatcher,
  useAvatarState,
} from './avatarState';
import type { AvatarState } from './avatarState';
import { useAvatarBrain } from './useAvatarBrain';
import { AvatarBubble } from './AvatarBubble';

// ============================================================================
// MASCOT CUSTOMIZATION CONSTANTS
// Preserves original color palette and friendly character
// ============================================================================
export const AVATAR_COLOR = '#4ecdc4'; // Soft mint/teal
export const AVATAR_EYE_COLOR = '#17252a'; // Deep contrast dark teal/charcoal
const HIDE_STORAGE_KEY = 'portfolio_mascot_hidden';

export type { AvatarState };

export interface AvatarProps {
  className?: string;
}

interface EyeOffsets {
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  arcWeight: number; // 0 = neutral oval, 1 = upward happy arc
}

interface MascotExpressionConfig {
  left: EyeOffsets;
  right: EyeOffsets;
  bodyOffsetX: number;
  bodyOffsetY: number;
  bodyScaleX: number;
  bodyScaleY: number;
  bodyRotate: number;
}

export function Avatar({ className = '' }: AvatarProps) {
  const { state: activeState, setTemporaryState } = useAvatarState();
  const brain = useAvatarBrain();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Hide/Show persistent toggle
  const [isHidden, setIsHidden] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(HIDE_STORAGE_KEY) === 'true';
  });

  const toggleHide = () => {
    setIsHidden((prev) => {
      const next = !prev;
      localStorage.setItem(HIDE_STORAGE_KEY, String(next));
      return next;
    });
  };

  // Performance and click state tracking
  const isTabHiddenRef = useRef<boolean>(
    typeof document !== 'undefined' ? document.hidden : false
  );
  const isOffScreenRef = useRef<boolean>(false);
  const isLoopRunningRef = useRef<boolean>(false);
  const clickHistoryRef = useRef<number[]>([]);

  // Motion values bound directly to SVG elements (Zero React re-renders on animation frames)
  const bodyMotionX = useMotionValue(0);
  const bodyMotionY = useMotionValue(0);
  const bodyMotionScaleX = useMotionValue(1);
  const bodyMotionScaleY = useMotionValue(1);
  const bodyMotionRotate = useMotionValue(0);

  const leftEyeMotionX = useMotionValue(0);
  const leftEyeMotionY = useMotionValue(0);
  const leftEyeMotionScaleX = useMotionValue(1);
  const leftEyeMotionScaleY = useMotionValue(1);
  const leftEyeMotionRotate = useMotionValue(0);
  const leftOvalOpacity = useMotionValue(1);
  const leftArcOpacity = useMotionValue(0);
  const leftCatchlightOpacity = useMotionValue(0.95);

  const rightEyeMotionX = useMotionValue(0);
  const rightEyeMotionY = useMotionValue(0);
  const rightEyeMotionScaleX = useMotionValue(1);
  const rightEyeMotionScaleY = useMotionValue(1);
  const rightEyeMotionRotate = useMotionValue(0);
  const rightOvalOpacity = useMotionValue(1);
  const rightArcOpacity = useMotionValue(0);
  const rightCatchlightOpacity = useMotionValue(0.95);

  // Scratch mutable state for 60fps physics & spring interpolation
  const animRef = useRef({
    // Interpolated current positions
    bodyX: 0,
    bodyY: 0,
    bodyScaleX: 1,
    bodyScaleY: 1,
    bodyRotate: 0,
    squishImpulse: 0,

    leftEyeX: 0,
    leftEyeY: 0,
    leftEyeScaleX: 1,
    leftEyeScaleY: 1,
    leftEyeRotate: 0,
    leftArc: 0,

    rightEyeX: 0,
    rightEyeY: 0,
    rightEyeScaleX: 1,
    rightEyeScaleY: 1,
    rightEyeRotate: 0,
    rightArc: 0,

    // Look coordinates
    lookX: 0,
    lookY: 0,

    // Saccadic idle drift (micro-saccades)
    saccadeTimer: 1.8,
    saccadeX: 0,
    saccadeY: 0,

    // Independent blinking loop
    blinkTimer: 3.2,
    blinkPhase: 'idle' as 'idle' | 'closing' | 'opening' | 'pause' | 'closing_2' | 'opening_2',
    blinkPhaseTimer: 0,
    blinkScale: 1.0,
    isDoubleBlink: false,

    elapsed: 0,
    lastTime: 0,
    isTouch: false,
    reducedMotion: false,
  });

  // Track user activeState in ref for RAF loop
  const activeStateRef = useRef<AvatarState>(activeState);
  useEffect(() => {
    activeStateRef.current = activeState;
  }, [activeState]);

  // Initialize interaction watcher & capabilities
  useEffect(() => {
    const anim = animRef.current;
    anim.isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    anim.reducedMotion = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      anim.reducedMotion = e.matches;
    };
    mq.addEventListener('change', onMqChange);

    const cleanupWatcher = initAvatarInteractionWatcher();

    // Passive pointer tracking with "Let's talk" CTA awareness
    const handlePointerMove = (e: PointerEvent) => {
      if (anim.isTouch || anim.reducedMotion) return;
      if (!svgRef.current) return;

      // Page awareness: eyes look toward "Let's talk" button when cursor is within 150px
      const letsTalkBtn =
        document.getElementById('hero-lets-talk-btn') ||
        document.querySelector('.header-contact');
      if (letsTalkBtn) {
        const btnRect = letsTalkBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        const distToBtn = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (distToBtn <= 150) {
          const avRect = svgRef.current.getBoundingClientRect();
          const avCenterX = avRect.left + avRect.width / 2;
          const avCenterY = avRect.top + avRect.height / 2;
          const dx = btnCenterX - avCenterX;
          const dy = btnCenterY - avCenterY;
          anim.lookX = Math.max(-1, Math.min(1, dx / 200));
          anim.lookY = Math.max(-1, Math.min(1, dy / 150));
          return;
        }
      }

      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Soft clamp normalized vector [-1, 1]
      anim.lookX = Math.max(-1, Math.min(1, dx / 340));
      anim.lookY = Math.max(-1, Math.min(1, dy / 260));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('pointermove', handlePointerMove);
      cleanupWatcher();
    };
  }, []);

  // RAF loop for spring physics, micro-saccades, blinks, and gestures
  useEffect(() => {
    if (isHidden) return;

    let animationFrameId: number;
    const anim = animRef.current;
    anim.lastTime = performance.now();

    const startLoop = () => {
      if (isLoopRunningRef.current) return;
      if (isTabHiddenRef.current || isOffScreenRef.current) return;
      isLoopRunningRef.current = true;
      anim.lastTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (!isLoopRunningRef.current) return;
      isLoopRunningRef.current = false;
      cancelAnimationFrame(animationFrameId);
    };

    const loop = (time: number) => {
      if (!isLoopRunningRef.current) return;
      if (document.hidden || isOffScreenRef.current) {
        stopLoop();
        return;
      }

      const dt = Math.min((time - anim.lastTime) / 1000, 0.05);
      anim.lastTime = time;
      anim.elapsed += dt;

      // Damp squish impulse towards 0
      const dampImpulse = (curr: number, target: number, lambda: number) =>
        curr + (target - curr) * (1 - Math.exp(-lambda * dt));
      anim.squishImpulse = dampImpulse(anim.squishImpulse, 0, 11);

      const reduced = anim.reducedMotion;
      const state = reduced ? 'idle' : activeStateRef.current;

      // ------------------------------------------------------------------------
      // 1. BLINKING STATE MACHINE (Independent loop, separate from emotional state)
      // ------------------------------------------------------------------------
      if (state === 'sleeping') {
        // Blinks pause while sleeping; eyes stay closed
        anim.blinkScale = 1.0;
        anim.blinkPhase = 'idle';
      } else {
        switch (anim.blinkPhase) {
          case 'idle':
            anim.blinkTimer -= dt;
            if (anim.blinkTimer <= 0) {
              anim.isDoubleBlink = !reduced && Math.random() < 0.22;
              anim.blinkPhase = 'closing';
              anim.blinkPhaseTimer = reduced ? 0.18 : 0.08; // Fast 80ms close
            }
            break;

          case 'closing':
            anim.blinkPhaseTimer -= dt;
            {
              const duration = reduced ? 0.18 : 0.08;
              const p = Math.max(0, anim.blinkPhaseTimer / duration);
              anim.blinkScale = 0.05 + 0.95 * p;
            }
            if (anim.blinkPhaseTimer <= 0) {
              anim.blinkPhase = 'opening';
              anim.blinkPhaseTimer = reduced ? 0.26 : 0.15; // Slightly slower 150ms open
            }
            break;

          case 'opening':
            anim.blinkPhaseTimer -= dt;
            {
              const duration = reduced ? 0.26 : 0.15;
              const p = 1 - Math.max(0, anim.blinkPhaseTimer / duration);
              anim.blinkScale = 0.05 + 0.95 * p;
            }
            if (anim.blinkPhaseTimer <= 0) {
              anim.blinkScale = 1.0;
              if (anim.isDoubleBlink) {
                anim.blinkPhase = 'pause';
                anim.blinkPhaseTimer = 0.08; // 80ms pause before second blink
              } else {
                anim.blinkPhase = 'idle';
                anim.blinkTimer = 2.0 + Math.random() * 4.0; // Random 2-6s interval
              }
            }
            break;

          case 'pause':
            anim.blinkPhaseTimer -= dt;
            if (anim.blinkPhaseTimer <= 0) {
              anim.blinkPhase = 'closing_2';
              anim.blinkPhaseTimer = 0.07;
            }
            break;

          case 'closing_2':
            anim.blinkPhaseTimer -= dt;
            anim.blinkScale = 0.05 + 0.95 * Math.max(0, anim.blinkPhaseTimer / 0.07);
            if (anim.blinkPhaseTimer <= 0) {
              anim.blinkPhase = 'opening_2';
              anim.blinkPhaseTimer = 0.13;
            }
            break;

          case 'opening_2':
            anim.blinkPhaseTimer -= dt;
            anim.blinkScale = 0.05 + 0.95 * (1 - Math.max(0, anim.blinkPhaseTimer / 0.13));
            if (anim.blinkPhaseTimer <= 0) {
              anim.blinkScale = 1.0;
              anim.blinkPhase = 'idle';
              anim.blinkTimer = 2.0 + Math.random() * 4.0;
            }
            break;
        }
      }

      // ------------------------------------------------------------------------
      // 2. CURSOR TRACKING, TOUCH AUTO LOOK-AROUND, & MICRO-SACCADES
      // ------------------------------------------------------------------------
      let currentLookX = 0;
      let currentLookY = 0;

      if (!reduced) {
        const lookOverride = getAvatarLookOverride();
        if (lookOverride) {
          currentLookX = lookOverride.x;
          currentLookY = lookOverride.y;
        } else if (anim.isTouch) {
          // Touch device: gentle, organic wandering look-around
          currentLookX = Math.sin(anim.elapsed * 0.65) * 0.55 + Math.sin(anim.elapsed * 1.25) * 0.2;
          currentLookY = Math.cos(anim.elapsed * 0.45) * 0.35;
        } else {
          currentLookX = anim.lookX;
          currentLookY = anim.lookY;
        }

        // Micro-saccades: tiny random eye drifts every 1-3s in idle
        if (state === 'idle') {
          anim.saccadeTimer -= dt;
          if (anim.saccadeTimer <= 0) {
            anim.saccadeX = (Math.random() - 0.5) * 2.4;
            anim.saccadeY = (Math.random() - 0.5) * 1.6;
            anim.saccadeTimer = 1.2 + Math.random() * 1.8;
          }
        } else {
          anim.saccadeX = 0;
          anim.saccadeY = 0;
        }
      }

      // Range clamping: eyes lead within [-7.2, 7.2] X and [-5.2, 5.2] Y
      const eyeTrackX = Math.max(-7.2, Math.min(7.2, currentLookX * 6.5 + anim.saccadeX));
      const eyeTrackY = Math.max(-5.2, Math.min(5.2, currentLookY * 4.5 + anim.saccadeY));

      // Body follows with a smaller range and lags behind eyes
      const bodyTrackX = Math.max(-3.5, Math.min(3.5, currentLookX * 3.0));
      const bodyTrackY = Math.max(-2.5, Math.min(2.5, currentLookY * 2.0));
      const bodyTrackRotate = Math.max(-5, Math.min(5, currentLookX * 4.0));

      // ------------------------------------------------------------------------
      // 3. EXPRESSION CONFIGURATIONS & OFFSETS
      // ------------------------------------------------------------------------
      const config: MascotExpressionConfig = {
        left: { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, rotation: 0, arcWeight: 0 },
        right: { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, rotation: 0, arcWeight: 0 },
        bodyOffsetX: 0,
        bodyOffsetY: 0,
        bodyScaleX: 1,
        bodyScaleY: 1,
        bodyRotate: 0,
      };

      switch (state) {
        case 'idle':
          // Soft rhythmic breathing
          config.bodyScaleY = 1.0 + Math.sin(anim.elapsed * 2.2) * (reduced ? 0.015 : 0.035);
          config.bodyScaleX = 1.0 / Math.sqrt(Math.max(0.5, config.bodyScaleY));
          break;

        case 'excited':
          // Eyes grow taller and bounce slightly
          {
            const bounce = Math.abs(Math.sin(anim.elapsed * 7.5)) * 6.5;
            config.left = { scaleX: 1.15, scaleY: 1.38, offsetX: 0, offsetY: -2, rotation: 0, arcWeight: 0 };
            config.right = { scaleX: 1.15, scaleY: 1.38, offsetX: 0, offsetY: -2, rotation: 0, arcWeight: 0 };
            config.bodyOffsetY = -bounce;
            config.bodyScaleX = bounce < 1 ? 1.08 : 0.94;
            config.bodyScaleY = bounce < 1 ? 0.9 : 1.1;
            config.bodyRotate = Math.sin(anim.elapsed * 3.8) * 2;
          }
          break;

        case 'happy':
          // Eyes squash into upward arcs, joyful sway
          {
            const hop = Math.abs(Math.sin(anim.elapsed * 5.2)) * 3;
            config.left = { scaleX: 1.06, scaleY: 0.18, offsetX: 0, offsetY: -1, rotation: -2.5, arcWeight: 1.0 };
            config.right = { scaleX: 1.06, scaleY: 0.18, offsetX: 0, offsetY: -1, rotation: 2.5, arcWeight: 1.0 };
            config.bodyOffsetY = -hop;
            config.bodyRotate = Math.sin(anim.elapsed * 5.2) * 2.8;
          }
          break;

        case 'thinking':
          // Eyes look up-left, one eye slightly smaller, quizzical tilt
          config.left = { scaleX: 0.82, scaleY: 0.82, offsetX: -5.5, offsetY: -5.0, rotation: -7, arcWeight: 0 };
          config.right = { scaleX: 1.06, scaleY: 1.08, offsetX: -5.5, offsetY: -5.0, rotation: -4, arcWeight: 0 };
          config.bodyOffsetX = -2.2;
          config.bodyOffsetY = -1.2;
          config.bodyRotate = -4.5;
          break;

        case 'curious':
          // Eyes slightly larger and tilted toward the cursor
          {
            const cursorTilt = currentLookX * 7.5;
            config.left = { scaleX: 1.16, scaleY: 1.16, offsetX: 0, offsetY: 0, rotation: 6 + cursorTilt, arcWeight: 0 };
            config.right = { scaleX: 1.16, scaleY: 1.16, offsetX: 0, offsetY: 0, rotation: -6 + cursorTilt, arcWeight: 0 };
            config.bodyOffsetX = currentLookX * 3.0;
            config.bodyOffsetY = currentLookY * 2.0;
            config.bodyRotate = currentLookX * 5.5;
          }
          break;

        case 'dizzy':
          // Spinning spiral eyes, orbital offsets, and wobbly rocking body
          {
            const spinAngle = (anim.elapsed * 540) % 360;
            const wobble = Math.sin(anim.elapsed * 16) * 7.5;
            const squishWobble = Math.sin(anim.elapsed * 20) * 0.12;
            config.left = {
              scaleX: 0.9 + squishWobble,
              scaleY: 1.2 - squishWobble,
              offsetX: Math.cos(anim.elapsed * 14) * 4.2,
              offsetY: Math.sin(anim.elapsed * 14) * 4.2,
              rotation: spinAngle,
              arcWeight: 0,
            };
            config.right = {
              scaleX: 1.2 - squishWobble,
              scaleY: 0.9 + squishWobble,
              offsetX: Math.sin(anim.elapsed * 14) * 4.2,
              offsetY: -Math.cos(anim.elapsed * 14) * 4.2,
              rotation: -spinAngle,
              arcWeight: 0,
            };
            config.bodyOffsetX = Math.sin(anim.elapsed * 12) * 5;
            config.bodyOffsetY = Math.cos(anim.elapsed * 14) * 3;
            config.bodyScaleX = 1 + squishWobble;
            config.bodyScaleY = 1 - squishWobble;
            config.bodyRotate = wobble;
          }
          break;

        case 'sleeping':
          // Eyes close slowly into thin lines, gentle sunken breathing
          config.left = { scaleX: 0.92, scaleY: 0.08, offsetX: 0, offsetY: 2.6, rotation: 0, arcWeight: 0 };
          config.right = { scaleX: 0.92, scaleY: 0.08, offsetX: 0, offsetY: 2.6, rotation: 0, arcWeight: 0 };
          config.bodyOffsetY = 3.6;
          config.bodyScaleY = 0.96 + Math.sin(anim.elapsed * 1.2) * 0.035;
          config.bodyScaleX = 1.04;
          config.bodyRotate = 1.2;
          break;
      }

      // ------------------------------------------------------------------------
      // 4. SPRING-BASED EXPONENTIAL DAMPING (Eyes lead, body lags)
      // ------------------------------------------------------------------------
      const eyeMorphLambda = state === 'sleeping' ? 3.2 : 9.5;
      const eyeTrackLambda = 13.5;
      const bodyLambda = 5.2;

      const damp = (curr: number, target: number, lambda: number) =>
        curr + (target - curr) * (1 - Math.exp(-lambda * dt));

      // Target eye composites
      const targetLeftX = config.left.offsetX + eyeTrackX;
      const targetLeftY = config.left.offsetY + eyeTrackY;
      const targetRightX = config.right.offsetX + eyeTrackX;
      const targetRightY = config.right.offsetY + eyeTrackY;

      // Eyes lead
      anim.leftEyeX = damp(anim.leftEyeX, targetLeftX, eyeTrackLambda);
      anim.leftEyeY = damp(anim.leftEyeY, targetLeftY, eyeTrackLambda);
      anim.leftEyeScaleX = damp(anim.leftEyeScaleX, config.left.scaleX, eyeMorphLambda);
      anim.leftEyeScaleY = damp(anim.leftEyeScaleY, config.left.scaleY, eyeMorphLambda);
      anim.leftEyeRotate = damp(anim.leftEyeRotate, config.left.rotation, eyeTrackLambda);
      anim.leftArc = damp(anim.leftArc, config.left.arcWeight, eyeMorphLambda);

      anim.rightEyeX = damp(anim.rightEyeX, targetRightX, eyeTrackLambda);
      anim.rightEyeY = damp(anim.rightEyeY, targetRightY, eyeTrackLambda);
      anim.rightEyeScaleX = damp(anim.rightEyeScaleX, config.right.scaleX, eyeMorphLambda);
      anim.rightEyeScaleY = damp(anim.rightEyeScaleY, config.right.scaleY, eyeMorphLambda);
      anim.rightEyeRotate = damp(anim.rightEyeRotate, config.right.rotation, eyeTrackLambda);
      anim.rightArc = damp(anim.rightArc, config.right.arcWeight, eyeMorphLambda);

      // Body lags
      const targetBodyX = config.bodyOffsetX + bodyTrackX;
      const targetBodyY = config.bodyOffsetY + bodyTrackY;
      const targetBodyRotate = config.bodyRotate + bodyTrackRotate;

      anim.bodyX = damp(anim.bodyX, targetBodyX, bodyLambda);
      anim.bodyY = damp(anim.bodyY, targetBodyY, bodyLambda);
      anim.bodyScaleX = damp(anim.bodyScaleX, config.bodyScaleX, bodyLambda);
      anim.bodyScaleY = damp(anim.bodyScaleY, config.bodyScaleY, bodyLambda);
      anim.bodyRotate = damp(anim.bodyRotate, targetBodyRotate, bodyLambda);

      // Compute final eye height with blinking multiplier
      const currentBlink = state === 'sleeping' ? 1.0 : anim.blinkScale;
      const finalLeftScaleY = anim.leftEyeScaleY * currentBlink;
      const finalRightScaleY = anim.rightEyeScaleY * currentBlink;

      // Catchlight & oval cross-fading
      const showCatchlights =
        finalLeftScaleY > 0.22 && anim.leftArc < 0.45 && state !== 'sleeping';
      const catchlightAlpha = showCatchlights
        ? Math.min(0.95, (finalLeftScaleY - 0.22) * 3)
        : 0;

      // ------------------------------------------------------------------------
      // 5. UPDATE FRAMER MOTION VALUES WITH SQUISH
      // ------------------------------------------------------------------------
      const finalBodyScaleX = anim.bodyScaleX * (1 + anim.squishImpulse * 0.35);
      const finalBodyScaleY = anim.bodyScaleY * (1 - anim.squishImpulse * 0.3);

      bodyMotionX.set(anim.bodyX);
      bodyMotionY.set(anim.bodyY);
      bodyMotionScaleX.set(finalBodyScaleX);
      bodyMotionScaleY.set(finalBodyScaleY);
      bodyMotionRotate.set(anim.bodyRotate);

      leftEyeMotionX.set(anim.leftEyeX);
      leftEyeMotionY.set(anim.leftEyeY);
      leftEyeMotionScaleX.set(anim.leftEyeScaleX);
      leftEyeMotionScaleY.set(finalLeftScaleY);
      leftEyeMotionRotate.set(anim.leftEyeRotate);
      leftOvalOpacity.set(Math.max(0, 1 - anim.leftArc * 1.5));
      leftArcOpacity.set(anim.leftArc);
      leftCatchlightOpacity.set(catchlightAlpha);

      rightEyeMotionX.set(anim.rightEyeX);
      rightEyeMotionY.set(anim.rightEyeY);
      rightEyeMotionScaleX.set(anim.rightEyeScaleX);
      rightEyeMotionScaleY.set(finalRightScaleY);
      rightEyeMotionRotate.set(anim.rightEyeRotate);
      rightOvalOpacity.set(Math.max(0, 1 - anim.rightArc * 1.5));
      rightArcOpacity.set(anim.rightArc);
      rightCatchlightOpacity.set(catchlightAlpha);

      animationFrameId = requestAnimationFrame(loop);
    };

    startLoop();

    // Pause loop when tab is hidden, resume when tab is active
    const onVisibilityChange = () => {
      isTabHiddenRef.current = document.hidden;
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Pause loop when avatar is off-screen, resume when visible in viewport
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          isOffScreenRef.current = !entry.isIntersecting;
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [
    isHidden,
    bodyMotionX,
    bodyMotionY,
    bodyMotionScaleX,
    bodyMotionScaleY,
    bodyMotionRotate,
    leftEyeMotionX,
    leftEyeMotionY,
    leftEyeMotionScaleX,
    leftEyeMotionScaleY,
    leftEyeMotionRotate,
    leftOvalOpacity,
    leftArcOpacity,
    leftCatchlightOpacity,
    rightEyeMotionX,
    rightEyeMotionY,
    rightEyeMotionScaleX,
    rightEyeMotionScaleY,
    rightEyeMotionRotate,
    rightOvalOpacity,
    rightArcOpacity,
    rightCatchlightOpacity,
  ]);

  // Click / tap handler: squish impulse, short line, and 5-click dizzy reaction
  const handleClick = () => {
    const now = Date.now();
    clickHistoryRef.current = clickHistoryRef.current.filter((t) => now - t < 3000);
    clickHistoryRef.current.push(now);

    // Trigger squish impulse
    animRef.current.squishImpulse = 1.0;

    if (clickHistoryRef.current.length >= 5) {
      clickHistoryRef.current = [];
      setTemporaryState('dizzy', 2000);
      brain.triggerGroup('dizzy', { bypassCooldown: true });
    } else {
      if (activeState === 'sleeping') {
        setTemporaryState('curious', 2200);
      } else {
        setTemporaryState('excited', 1800);
      }
      brain.triggerGroup('click');
    }
  };

  if (isHidden) {
    return (
      <div className={`mascot-container mascot-hidden ${className}`}>
        <button
          type="button"
          className="mascot-restore-pill"
          onClick={toggleHide}
          title="Show companion mascot"
          aria-label="Show companion mascot"
        >
          <span className="mascot-pill-dot" aria-hidden="true" />
          <span>✦ Mascot</span>
        </button>
      </div>
    );
  }

  return (
    <motion.aside
      ref={containerRef}
      className={`mascot-container ${className}`}
      initial={{ y: -80, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 260,
        delay: 0.15,
      }}
      aria-label="Interactive Mascot Companion"
    >
      <AvatarBubble
        message={brain.currentMessage}
        isMuted={brain.isMuted}
        onDismiss={brain.dismissMessage}
        onToggleMute={brain.toggleMute}
        onToggleHide={toggleHide}
      />
      <div className="mascot-float">
        <svg
          ref={svgRef}
          viewBox="0 0 120 120"
          className="mascot-avatar"
          onClick={handleClick}
          role="img"
          aria-label={`Interactive blob mascot (${activeState} mood)`}
        >
          <defs>
            {/* Organic mint/teal gradient preserving original color tone */}
            <radialGradient id="mascotBodyGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#76f3ea" />
              <stop offset="55%" stopColor={AVATAR_COLOR} />
              <stop offset="100%" stopColor="#35b2a9" />
            </radialGradient>

            {/* Tactile soft specular highlight for organic surface depth */}
            <radialGradient id="mascotHighlight" cx="45%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            {/* Warm subtle cheek glow */}
            <linearGradient id="mascotCheek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff7a45" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Body Group with lagging spring motion and squash/stretch */}
          <motion.g
            id="mascot-body"
            style={{
              x: bodyMotionX,
              y: bodyMotionY,
              scaleX: bodyMotionScaleX,
              scaleY: bodyMotionScaleY,
              rotate: bodyMotionRotate,
              transformOrigin: '60px 60px',
            }}
          >
            {/* Ground contact shadow */}
            <ellipse cx="60" cy="108" rx="30" ry="4.5" fill="#000000" opacity="0.2" />

            {/* Friendly organic blob shape path */}
            <path
              d="M 60 16 C 88 16 106 35 106 61 C 106 87 87 105 60 105 C 33 105 14 87 14 61 C 14 35 32 16 60 16 Z"
              fill="url(#mascotBodyGrad)"
            />

            {/* Tactile top reflection */}
            <ellipse
              cx="46"
              cy="34"
              rx="16"
              ry="9"
              transform="rotate(-20 46 34)"
              fill="url(#mascotHighlight)"
            />

            {/* Subtle expressive cheeks */}
            <ellipse cx="33" cy="63" rx="4.5" ry="2.6" fill="url(#mascotCheek)" />
            <ellipse cx="87" cy="63" rx="4.5" ry="2.6" fill="url(#mascotCheek)" />

            {/* ================================================================ */}
            {/* LEFT EYE: Neutral Center (46, 54), rx: 5.2, ry: 8.2 */}
            {/* ================================================================ */}
            <motion.g
              id="mascot-left-eye"
              style={{
                x: leftEyeMotionX,
                y: leftEyeMotionY,
                scaleX: leftEyeMotionScaleX,
                scaleY: leftEyeMotionScaleY,
                rotate: leftEyeMotionRotate,
                transformOrigin: '46px 54px',
              }}
            >
              {/* Neutral oval */}
              <motion.ellipse
                cx="46"
                cy="54"
                rx="5.2"
                ry="8.2"
                fill={AVATAR_EYE_COLOR}
                style={{ opacity: leftOvalOpacity }}
              />

              {/* Catchlight reflections */}
              <motion.circle
                cx="47.8"
                cy="51.2"
                r="1.9"
                fill="#ffffff"
                style={{ opacity: leftCatchlightOpacity }}
              />
              <motion.circle
                cx="44.6"
                cy="56.2"
                r="0.9"
                fill="#ffffff"
                style={{ opacity: leftCatchlightOpacity }}
              />

              {/* Upward curved arc for happy mood */}
              <motion.path
                d="M 40.5 56.5 Q 46 47.5 51.5 56.5"
                fill="none"
                stroke={AVATAR_EYE_COLOR}
                strokeWidth="3.2"
                strokeLinecap="round"
                style={{ opacity: leftArcOpacity }}
              />
            </motion.g>

            {/* ================================================================ */}
            {/* RIGHT EYE: Neutral Center (74, 54), rx: 5.2, ry: 8.2 */}
            {/* ================================================================ */}
            <motion.g
              id="mascot-right-eye"
              style={{
                x: rightEyeMotionX,
                y: rightEyeMotionY,
                scaleX: rightEyeMotionScaleX,
                scaleY: rightEyeMotionScaleY,
                rotate: rightEyeMotionRotate,
                transformOrigin: '74px 54px',
              }}
            >
              {/* Neutral oval */}
              <motion.ellipse
                cx="74"
                cy="54"
                rx="5.2"
                ry="8.2"
                fill={AVATAR_EYE_COLOR}
                style={{ opacity: rightOvalOpacity }}
              />

              {/* Catchlight reflections */}
              <motion.circle
                cx="75.8"
                cy="51.2"
                r="1.9"
                fill="#ffffff"
                style={{ opacity: rightCatchlightOpacity }}
              />
              <motion.circle
                cx="72.6"
                cy="56.2"
                r="0.9"
                fill="#ffffff"
                style={{ opacity: rightCatchlightOpacity }}
              />

              {/* Upward curved arc for happy mood */}
              <motion.path
                d="M 68.5 56.5 Q 74 47.5 79.5 56.5"
                fill="none"
                stroke={AVATAR_EYE_COLOR}
                strokeWidth="3.2"
                strokeLinecap="round"
                style={{ opacity: rightArcOpacity }}
              />
            </motion.g>
          </motion.g>
        </svg>
      </div>
    </motion.aside>
  );
}

export default Avatar;
