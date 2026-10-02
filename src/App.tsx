import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ContactSection } from './components/sections/ContactSection';
import { SceneLayer } from './components/scene/SceneLayer';
import type { SceneStatus } from './components/scene/SceneLayer';

function App() {
  const [paused, setPaused] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('loading');
  return <MotionConfig reducedMotion="user">
    <div className={'main-wrapper scene-' + sceneStatus}>
      <SceneLayer paused={paused} onStatus={setSceneStatus} />
      <HeroSection paused={paused} onToggleMotion={() => setPaused(value => !value)} sceneStatus={sceneStatus} />
      <main id="main-content" tabIndex={-1}>
        <AboutSection /><ProjectsSection /><ExperienceSection /><SkillsSection /><ContactSection />
      </main>
    </div>
  </MotionConfig>;
}
export default App;
