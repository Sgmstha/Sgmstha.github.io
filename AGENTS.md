# Project guide

## Scope
- Personal portfolio migration. Work locally on the current feature branch.
- No push, deployment, or edits to the old repository without authorization.
- Preserve existing user changes and baseline/pre-3d.
- The current design has a persistent, procedural Three.js sculpture and HTML sections.
- Mobile and reduced-motion visitors get static CSS art and the same readable content.
- Approved sourced content is in src/data/content.ts; open questions in REVIEW_FLAGS.md.

## Stack
- React / React DOM 19.2.7, TypeScript 6.0.3, Vite 8.1.5.
- Three.js 0.186.1, React Three Fiber 9.8.1, drei 10.7.9.
- Framer Motion 12.42.2; no Lenis or scroll hijacking.
- Tailwind 3.4.19, PostCSS 8.5.28, Autoprefixer 10.5.4.
- Oxlint 1.74.0. npm and package-lock.json are the package manager/lockfile.
- Legacy dependencies (GSAP, HLS, Lucide) removed.
- npm run dev, npm run lint, npm run build, npm run preview, npm test.
- Tests use Node's built-in runner and TypeScript stripping (Node 22.19+).

## Folder map
- src/main.tsx: StrictMode root and index.css import.
- src/App.tsx: scene status/pause state, persistent scene, hero and semantic main.
- src/data/content.ts: typed sourced facts. null means unverified; candidates are evidence.
- src/data/sections.ts: shared IDs, labels, cameraPosition and lookAt waypoints.
- src/components/scene/SceneLayer.tsx: device/motion/data policy, lazy import, error boundary.
- SculptureCanvas.tsx: single Canvas, procedural mesh, local environment lighting,
  camera interpolation, pointer rotation, quality adaptation and visibility handling.
- scrollPath.ts: pure scroll-segment math and scene eligibility policy.
- tests/scene-policy.test.mjs: uneven/collapsed offsets, overscroll and fallback policy.
- src/components/sections/HeroSection.tsx: nav, scroll indicator, headline entrance,
  static fallback art, scene loading label and pause/resume control.
- AboutSection.tsx: approved summary in a light editorial section.
- ProjectsSection.tsx: project index, large screenshot stages, pointer tilt, native overviews.
- ExperienceSection.tsx: confirmed roles and accessible native certificate disclosure.
- SkillsSection.tsx: user-confirmed primary tools plus all LinkedIn skills; no percentages.
- ContactSection.tsx: mail/phone/social links, copy email action and footer.
- src/components/ui/FadeIn.tsx: reduced-motion-aware once-on-entry reveal.
- src/index.css: shared base styles and modal layouts.
- src/design.css: monochrome/blue art direction, editorial layouts and responsive overrides.
- index.html: Manrope/Space Mono fonts, title, description, canonical, OG text tags.
- public/favicon.svg: monogram; public/CNAME copies the custom domain into Vite output.
- Root CNAME: preserved sugam-shrestha.com.np.
- dist/: generated output, never edit manually.

## Scroll/camera system
- Ordinary document scrolling and anchors; no custom scroll container.
- The registry order matches the HTML section order and also drives navigation.
- ResizeObserver measures actual section document offsets after layout changes.
- Passive scroll/pointer listeners store values in refs, not continuous React state.
- getScrollSegment finds the adjacent measured waypoints and clamps progress to [0,1].
- Progress = (scrollY - segmentStart) / max(1, segmentEnd - segmentStart).
- Camera position/lookAt interpolate between registry vectors, then damp by frame delta.
- Object rotation combines gentle elapsed-time motion with a small pointer response.
- Geometry and environment are procedural: no model, texture or HDR downloads.
- One Canvas remains mounted across desktop section navigation.
- Scene loading never blocks HTML. A first-frame signal switches loading art to live art.
- Pause switches the frame loop to demand and freezes scene motion; hidden tabs also idle.
- Rendering/context failure replaces the scene with static CSS artwork.
- The fallback prop itself has no side effects: Fiber mounts canvas fallback children
  even when canvas rendering is supported. Errors are handled by SceneBoundary.

## Conventions
- PascalCase TSX; named exports for UI/sections. The lazy scene uses a default export.
- Keep facts in typed content; only display value fields, never pick candidates silently.
- Keep source/evidence metadata; do not invent achievements, dates, screenshots or URLs.
- Art direction studies must be labeled; they are not screenshots of the actual projects.
- Keep certificate organizer, issuer and training partner distinct.
- Top-level hooks only; explicit props and no any; stable IDs/names as list keys.
- Refs/vectors for animation, React state for discrete controls and loading/error status.
- Reuse vectors; never allocate objects or update React state continuously in useFrame.
- Every effect cleans up its own observers, listeners, timers and animations.
- CSS variables/semantic classes in index.css; responsive boundaries 767px and 1100px.
- Keep hero/home and section IDs stable; navigation uses real href anchors.
- Buttons perform actions; native details/summary supports certificate disclosure.
- Decorative graphics are aria-hidden. Preserve headings, focus states and skip link.
- Reduced motion disables title/reveal transforms, smooth scroll, tilt and WebGL loading.
- Use real mailto/tel links; absent resume, repo and demo links remain hidden.

## Add a section checklist
1. Add sourced typed content; leave unknowns null and record them in REVIEW_FLAGS.md.
2. Add an ID/label/cameraPosition/lookAt entry to src/data/sections.ts.
3. Create a semantic section with h2 and mount it in App in registry order.
4. Follow shared spacing/tokens; choose light/dark treatment deliberately.
5. Check actual section heights, anchor offsets, resize and direct deep links.
6. Add meaningful actions and accessible states; do not create fake demo buttons.
7. Respect reduced motion and pointer capabilities; keep content readable without WebGL.
8. Verify transitions between both adjacent camera waypoints and collapsed content.
9. Run lint, test, build and git diff --check; inspect desktop and narrow mobile.

## Performance budget
- Initial JS <=200 KiB gzip; separate lazy scene JS <=350 KiB gzip; CSS <=30 KiB gzip.
- Current approximate output: initial JS 114 KB, scene 263 KB, CSS 10 KB gzip.
- Initial non-scene transfer <=1 MiB; compressed fonts <=150 KiB.
- Images AVIF/WebP <=200 KiB each; static poster <=300 KiB.
- Future GLB <=2 MiB each, <=5 MiB total deferred assets.
- Future textures KTX2/Basis <=512 KiB each, <=2048px desktop / 1024px mobile.
- <=100 draw calls and 200k visible triangles desktop; <=50 / 75k if mobile 3D is added.
- Default kinetic sculpture measured at 24 draw calls and 30,720 triangles locally.
- DPR capped at 1.25; sustained slow frames first reduce it to 1, then use static art.
- Target 60 FPS desktop and >=30 FPS mid-range mobile; real-device testing still needed.
- Width <=767px, reduced motion or save-data skips the lazy 3D import entirely.
- WebGL errors/context loss or sustained <28 FPS after quality reduction use static art.
- No autoplay video. No models, textures, postprocessing or remote environment maps.

## Deferred/known limitations
- Real screenshots, verified GitHub URL, resume and OG image remain deferred.
- Contact uses email/phone apps; no server-side contact form.
- Three/Fiber emits a Clock deprecation warning; some drivers report harmless shader
  precision warnings. Local browser testing found no application runtime errors.
- Build warns on the large uncompressed lazy scene; its compressed size is within budget.
