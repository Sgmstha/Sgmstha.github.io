# Project guide

## Scope and current state
- Personal portfolio; audit baseline: 2026-10-02.
- This checkout has a video hero and mounted About, Projects, Experience, Skills,
  and Contact sections. It does not contain a persistent 3D scene or camera path.
- Do not describe the HLS video or decorative PNGs as interactive 3D.
- Keep unrelated files unchanged; do not overwrite existing user work.

## Stack
- React / React DOM 19.2.7, TypeScript 6.0.3; ESM, TSX, client rendering.
- Vite 8.1.5 with @vitejs/plugin-react 6.0.3.
- Tailwind CSS 3.4.19, PostCSS 8.5.21, Autoprefixer 10.5.4.
- Framer Motion 12.42.2, GSAP 3.15.0, hls.js 1.6.16.
- lucide-react 1.25.0 is declared but has no source imports.
- Oxlint 1.74.0; React Hooks rules enabled.
- npm / package-lock.json; versions above are lockfile resolutions, not ranges.
- No Three.js, React Three Fiber, drei, or Lenis dependency is present.
- Scripts: npm run dev, npm run build, npm run lint, npm run preview.
- Build runs tsc -b before Vite; preview serves an existing dist build.

## Folder map
- index.html: root element, Google Kanit font request, title and favicon link.
- src/main.tsx: imports index.css and mounts App inside React StrictMode.
- src/App.tsx: loader state and section order; all sections mount immediately.
- src/portfolioData.json: identity, contact, projects, skills, experience, certificates.
- src/components/sections/HeroSection.tsx: GSAP entrance, HLS video, fixed nav,
  active-section observer and scroll-direction visibility.
- src/components/sections/LoadingScreen.tsx: timed counter/word animation overlay.
- src/components/sections/AboutSection.tsx: summary and four remote PNG decorations.
- src/components/sections/ProjectsSection.tsx: sticky cards with scroll-linked scale.
- src/components/sections/ExperienceSection.tsx: roles and certificates.
- src/components/sections/SkillsSection.tsx: three skill-category grids.
- src/components/sections/ContactSection.tsx: email, phone, location, social links.
- src/components/ui/FadeIn.tsx: reusable once-on-entry Motion wrapper.
- src/components/ui/AnimatedText.tsx: character opacity driven by local scroll.
- src/components/ui/ContactButton.tsx, LiveProjectButton.tsx: currently inert buttons.
- src/components/ui/Magnet.tsx: pointer-follow transform; currently unmounted.
- Navbar, ServicesSection, MarqueeSection, VisualPlaygroundSection: unmounted.
- src/index.css: Tailwind layers, base colors/font, gradient heading, keyframes.
- src/App.css and src/assets/: unused template CSS, hero PNG and template SVGs.
- public/: favicon.svg and icons.svg; index.html instead references missing /vite.svg.
- vite.config.ts, tsconfig*.json: bundler and TypeScript configuration.
- tailwind.config.js, postcss.config.js, .oxlintrc.json: styles and lint configuration.
- dist/: existing output, not proof that current source builds; do not edit manually.
- node_modules/: installed dependencies; .claude/: local tooling metadata.
- README.md: mostly template documentation.

## Scroll and camera system
- There is no camera, canvas, renderer, global scroll progress or camera interpolation.
- Hero reads window.scrollY through a passive listener. Below 100px the nav shows
  Home; otherwise scrolling up shows the nav and scrolling down hides it.
- Hero observes projects, experience, skills and contact with IntersectionObserver;
  rootMargin is '-40% 0px -55% 0px'. About is not observed; exit does not clear state.
- AnimatedText uses useScroll(target paragraph, ['start 0.8', 'end 0.2']).
  Character i of N maps progress [i/N, (i+1)/N] to opacity [0.2, 1].
- ProjectCard uses useScroll(target sticky wrapper, ['start start', 'end start']).
  Progress [0,1] maps scale [1, 1-(totalCards-1-index)*0.03].
- Unmounted Marquee reads scrollY into React state and translates rows at 0.3x.
- Unmounted VisualPlayground uses ScrollTrigger pinning and +/-50% column motion.
  Its cleanup kills every ScrollTrigger globally; scope cleanup before reuse.
- Future proposal: keep one scene mounted in App, separate from semantic sections.
  Maintain an ordered registry of section IDs, camera positions and look-at targets.
- Measure section boundaries after layout and on resize/content changes. For each
  segment use t=clamp((scrollY-start)/(end-start),0,1), guarding zero-length spans.
- Interpolate adjacent position/target values in one frame loop using refs or motion
  values. Never put per-frame camera updates in React state.
- Keep HTML readable when scene loading, rendering or motion fails.

## Coding conventions
- Use PascalCase TSX filenames and named exports for section/UI components.
- Keep section layout in sections/ and reusable presentation in ui/.
- Keep portfolio content in portfolioData.json; use stable IDs as list keys.
- Type component props explicitly; infer data types from JSON or shared interfaces.
  Avoid any, and call hooks only at component/custom-hook top level.
- Use Tailwind utilities with existing sm/md/lg breakpoints; put shared tokens in
  Tailwind configuration and reusable CSS/keyframes in index.css.
- Prefer transform/opacity animation. Scope GSAP selectors with gsap.context.
- Every effect must clean up its own observers, listeners, animation frames,
  timers, GSAP animations and HLS instance; verify StrictMode remount behavior.
- Use state for discrete UI changes; refs/motion values for continuous animation.
- Navigation actions use anchors, with real hrefs; actions use functional buttons.
- Provide headings, useful image alt text, keyboard focus and reduced-motion behavior.
- Share section IDs/order between layout, navigation and any future camera registry.

## How to add a new section
1. Add typed content and a stable section ID; confirm existing content is not duplicated.
2. Create a named Section component with semantic section/h2 and responsive layout.
3. Mount it in App at the intended position; use the existing background/spacing style.
4. Add navigation and active-section observation where appropriate. Centralize their
   registry before adding many sections; the current nav lives inside HeroSection.
5. Reuse FadeIn or a scoped animation, respecting reduced motion and effect cleanup.
6. Add working links and optimized images with dimensions, responsive sources and
   below-fold lazy loading. Check narrow screens and short landscape viewports.
7. If the future scene exists, add one position/target waypoint to its registry,
   remeasure boundaries and check transitions, direct anchors and resize handling.
8. Run lint/type checks/build when writes are authorized; inspect mobile behavior,
   keyboard navigation, asset failures and reduced-motion mode.

## Performance budget (proposed ceilings, not measured compliance)
- Initial compressed JS <=200 KiB; CSS <=30 KiB; initial non-video transfer <=1 MiB.
- Images: AVIF/WebP preferred, <=200 KiB each; hero/poster <=300 KiB.
- Load below-fold images lazily; avoid animated GIF galleries and oversized sources.
- Fonts: only used weights/styles; target <=150 KiB total compressed font transfer.
- Video: stream adaptively, cap mobile at 720p, target <=1.5 Mbps mobile / 3 Mbps desktop;
  use <=1 MiB segments and a <=300 KiB poster. Pause when offscreen or tab is hidden.
- Future 3D: compressed GLB <=2 MiB each, <=5 MiB total deferred scene assets.
- Textures: KTX2/Basis where supported, <=512 KiB each; <=2048px desktop / 1024px mobile.
- Future scene: <=100 draw calls desktop / 50 mobile; <=200k / 75k visible triangles.
- Cap device pixel ratio at 1.5 desktop / 1 mobile; target 60 / at least 30 FPS.
- Mobile fallback: widths <=767px, reduced motion, save-data, WebGL/context failure,
  or sustained <30 FPS use a static poster and normal readable HTML sections.
  Skip autoplay video and scene downloads in fallback mode; keep every link usable.

## Known blockers and pitfalls
- SkillsSection has four implicit-any errors; current source fails TypeScript checking.
- AnimatedText calls useTransform inside map; lint reports a Hooks rule violation.
- LoadingScreen cleans only its interval, leaving RAF/timer work alive; StrictMode
  can start duplicate loops. Its percentage is elapsed time, not asset readiness.
- Hero entrance runs underneath the loader; HLS instance lacks destroy/error handling.
- Project imagery is Picsum placeholder content; live URLs are absent from data.
- Experience hides available period/description fields; Contact has no footer/form.
- No explicit reduced-motion/mobile media fallback or scene implementation exists.
