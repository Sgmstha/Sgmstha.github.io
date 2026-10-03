import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { shouldRenderScene } from './scrollPath';

import type { SculptureMode } from './SculptureCanvas';

const SculptureCanvas = lazy(() => import('./SculptureCanvas'));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export type SceneStatus = 'loading' | 'live' | 'static';

export function SceneLayer({
  mode = 'knot',
  paused,
  onStatus,
}: {
  mode?: SculptureMode;
  paused: boolean;
  onStatus: (status: SceneStatus) => void;
}) {
  const [allowed, setAllowed] = useState(false);
  const [failed, setFailed] = useState(false);
  const eligibility = useRef<boolean | null>(null);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    const update = () => {
      const next = shouldRenderScene({ mobile: mobile.matches, reducedMotion: reduced.matches, saveData: Boolean(connection?.saveData) });
      if (eligibility.current !== next) {
        eligibility.current = next;
        setAllowed(next);
        onStatus(next && !failed ? 'loading' : 'static');
      }
    };
    update();
    reduced.addEventListener('change', update);
    mobile.addEventListener('change', update);
    connection?.addEventListener('change', update);
    return () => {
      reduced.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
    };
  }, [failed, onStatus]);

  const fail = () => { setFailed(true); onStatus('static'); };
  if (!allowed || failed) return null;
  return <div className="scene-layer" aria-hidden="true">
    <SceneBoundary onFailure={fail}>
      <Suspense fallback={null}>
        <SculptureCanvas mode={mode} paused={paused} onReady={() => onStatus('live')} onFailure={fail} />
      </Suspense>
    </SceneBoundary>
  </div>;
}
