import { lazy, Suspense, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';
import { SceneLayer } from './components/scene/SceneLayer';
import type { SceneStatus } from './components/scene/SceneLayer';
import type { SculptureMode } from './components/scene/SculptureCanvas';
import { BackToTop } from './components/ui/BackToTop';

const Avatar = lazy(() => import('./components/scene/Avatar'));

function App() {
  const [paused, setPaused] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('loading');
  const [sculptureMode, setSculptureMode] = useState<SculptureMode>('knot');
  const [mountAvatar, setMountAvatar] = useState(false);

  useEffect(() => {
    // Lazy-load avatar after hero entrance animation completes (~1300ms)
    const timer = setTimeout(() => {
      setMountAvatar(true);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={'main-wrapper scene-' + sceneStatus}>
        <SceneLayer mode={sculptureMode} paused={paused} onStatus={setSceneStatus} />
        <HeroSection
          sculptureMode={sculptureMode}
          onModeChange={setSculptureMode}
          paused={paused}
          onToggleMotion={() => setPaused(value => !value)}
          sceneStatus={sceneStatus}
        />
        <main id="main-content" tabIndex={-1}>
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
        </main>
        {mountAvatar ? (
          <Suspense fallback={<div className="mascot-container mascot-placeholder" aria-hidden="true" />}>
            <Avatar />
          </Suspense>
        ) : (
          <div className="mascot-container mascot-placeholder" aria-hidden="true" />
        )}
        <BackToTop />
      </div>
    </MotionConfig>
  );
}
export default App;

