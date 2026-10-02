# Content review flags

Flags remain unresolved except for the LinkedIn-backed fields and user decisions listed below.
No candidate is approved by its presence here.
`src/data/content.ts` is the single content source. Each item/field records
`source: old-live | local | linkedin | user-approved | unverified`;
disputed values are `null` with candidates.
Consumers must never select a candidate automatically. Unresolved copy, links,
images, dates and percentages are omitted from the current reference sections.

## Evidence
- Old source: https://github.com/Sgmstha/Sgmstha.github.io/blob/5f93b662d1dc3071506051783195a7ebdd87de3f/index.html
- Phase 1 verified that live HTML, CSS and JavaScript match that commit.
- Local reference: former `src/portfolioData.json`, retained in baseline `3602741`.
- `old-live` records provenance, not independent verification of personal claims.
- No template scaffold was copied. Alex Smith metadata, example contacts and
  TechCorp/WebSolutions/Digital Creations employment are excluded.

## SOCIAL-URLS
- GitHub: old `https://github.com/Sgmstha`; local `https://github.com/Sugam-Shrestha`.
- LinkedIn: old `https://www.linkedin.com/in/sugam-shrestha-67682a29b/`;
  local `https://www.linkedin.com/in/sugam-shrestha-0579b8214/`.
- LinkedIn resolved: user approved the original supplied profile URL. The site
  uses that URL; no shorter LinkedIn alias was invented or profile settings changed.
- GitHub remains unresolved: spoken username was transcribed as `sugamshst`.
  Added it as an unverified candidate; exact profile URL still needs confirmation.

## CONTENT DECISIONS 1–5
- Keep the established portfolio display name Sugam Shrestha; voice transcription
  variants were not treated as a requested name change.
- Keep Full-Stack Developer, explicitly confirmed by the user.
- User authorized rewriting the original About paragraph professionally; the
  active rewrite uses only existing claims and records user approval.
- Follow-up: user confirmed working with TypeScript, React, Next.js, and Flutter;
  About now emphasizes those tools instead of foundational language. No seniority,
  years of experience or unsupported achievements were added.
- Keep the four projects: E-commerce Website, Music App, Blog Page, Portfolio Website.
- Project selection does not resolve descriptions, tags, images or links.
- Follow-up decisions 6–14 are recorded below. No commit, push or scene work.

## CONTENT DECISIONS 6–14
- Project descriptions: user authorized professional rewrites from existing copy;
  all four active descriptions are user-approved. Earlier candidates are preserved.
- Tags: user subsequently approved local Music App and Blog Page tags; all four
  projects now have approved technology tags. Earlier conflicting sets are retained.
- No live demos available; no project repository URLs selected. Keep actions absent.
- Real screenshots and resume deferred by user; no placeholder substitution.
- User approved all 16 LinkedIn skills with percentages disabled.
- User requested LinkedIn internship descriptions. Rechecked the Experience detail
  page: no description text is present. Descriptions remain null/unverified.
- User requested LinkedIn certificates. The certifications detail page says nothing
  is listed. User clarified that certificates were posted in activity instead;
  completion evidence from those posts is now imported, as documented below.
- User approved existing deployed email, phone and Nepal location. Functional
  contact-page improvements are deferred to the later section implementation step.
- User authorized the footer during voice review; its implementation is deferred
  to the Contact/footer step. No footer component changed during content extraction.

## LINKEDIN CERTIFICATE POSTS
- Imported Software Development (Python), Web Development for Beginners, and GIT.
- Every imported item has `source: linkedin`, `evidenceKind: linkedin-post`,
  its post URL, and a separate postedOn field. Post dates are not issue dates.
- Python post: https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/
  Posted Aug 22, 2024; describes one-month training under the Kathmandu - Pride
  Project, organized by Kathmandu Metropolitan City, thanking Xavier International
  College. Organizer and training partner are recorded separately from issuer.
- Web Development for Beginners: https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/
- GIT: https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/
  Both posted Aug 21, 2024; Simplilearn SkillUp completion is stated in the posts.
- No verified credential URL, credential ID or issue date was extracted. These
  records establish posted completion claims, not independent credential validation.
- No certificate media downloaded. Links open the original completion posts.
- Existing Webniza full-stack certificate stays sourced to the old live site;
  it was not observed in these LinkedIn posts. Previous Python wording is retained.

## SKILL-SCORES
- Python: old 85%, local 90%. SQL: old 65%, local 70%.
- Both scores are null/unverified. Neither version was selected.

## SKILL-PERCENTAGES
- Old source names these skills without scores; local assigns: Git 85,
  RESTful APIs 80, Responsive Design 95, UI/UX Basics 75, Problem Solving 90,
  Team Collaboration 90, Agile Methodology 80, Testing 70.
- Scores are null/unverified. Skill names retain old-source provenance.

## ANNAPURNABYTE (partially resolved from LinkedIn)
- Local claims Technology Intern, AnnapurnaByte Innovations, May 2026 – Present,
  Nepal · On-site, Python/Flutter, and a technology internship description.
- LinkedIn now confirms Technology Intern, AnnapurnaByte Innovations, Internship,
  May 2026 - Present, Nepal · On-site. Linked skills: Flutter, Front-End Design,
  Python (Programming Language), Full-Stack Development.
- These fields now use `source: linkedin` with evidence URLs. Local descriptions
  and the combined local details record remain unverified; no description was visible.

## WEBNIZA-DETAILS (partially resolved from LinkedIn)
- Old: "Internship at Webniza", with no dates, specific role title or skills list.
- Local: "Full Stack Web Developer", "webninza.com", Jun 2024 – Dec 2024 · 7 mos,
  Responsive Web Design/Java and a rewritten description.
- LinkedIn confirms exact spelling/case "Full stack Web Developer", "webninza.com",
  Internship, Jun 2024 - Dec 2024. Linked skills: Responsive Web Design, Java,
  Front-End Development, HTML5. These fields use `source: linkedin`.
- Earlier candidates remain preserved. Descriptions and location are unresolved.

## LINKEDIN-IMPORT (2026-10-02)
- Read the signed-in Experience and Skills detail pages of the user-specified
  https://www.linkedin.com/in/sugam-shrestha-67682a29b/ profile.
- `skills.linkedin` preserves all 16 observed skill names, including HTML and HTML5
  separately. The UI uses this list without guessed categorization or percentages.
- Earlier old/local skill records and all disputed scores remain in the content
  file for review; LinkedIn provides no proficiency percentages to resolve them.
- Added `linkedin` to the provenance union rather than mislabeling it old-live/local.
- Experience is rendered newest first with observed dates, type and linked skills.
- LinkedIn displayed "6 mos" and "7 mos"; portfolio stores date ranges only,
  avoiding a duration that becomes stale. No employment descriptions were invented.
- Profile observation corroborates profile claims; it is not employer verification.

## ABOUT-COPY / PROJECT-COPY
- About resolved through user-authorized rewrite. Both earlier verbatim
  versions are retained as candidates; active copy is marked user-approved.
- All four project descriptions were rewritten with user authorization. Earlier
  versions remain candidates; active descriptions are marked user-approved.
- Local "Personal Project" client labels and feature lists lack explicit old
  fields; they remain unverified. Hero uses the distinct verbatim old tagline.

## PROJECT-TAGS
- Music App: old tags Python/Pandas/Matplotlib, category python, alt text
  "Data Analysis Tool"; description names Next.js/JavaScript/ytdl-core.
  Local tags instead use Next.js/JavaScript/ytdl-core.
- Blog Page: old tags React/Node.js/MongoDB, category fullstack, alt text
  "Task Management App"; description names HTML/CSS. Local tags use HTML/CSS.
- Tag conflict resolved by explicit user approval: Music App uses Next.js,
  JavaScript, ytdl-core; Blog Page uses HTML, CSS. Prior tags remain candidates.
- Old project categories and placeholder alt text remain unresolved; no category
  correction or replacement screenshot was inferred from the tag approval.

## PROJECT-LINKS / PROJECT-IMAGES
- Every old Source Code href points to the GitHub profile, not a project repo.
- Django2 and Music_app URLs occur in class attributes. They are unverified
  candidates, not repaired hrefs. Other project URLs and live demos are missing.
- Old `/placeholder.svg?height=300&width=500` is a broken placeholder path.
- Local Picsum images are placeholders, not screenshots. Image values are null;
  old paths/alt text and all local image URLs are preserved as candidates.
- Profile image is the observed old live URL; it has not been copied locally.

## RESUME / CERTIFICATE-ISSUER / FOOTER-YEAR
- Resume href is `#`; no file was found. Resume remains null/unverified.
- Old Python certificate says "certified by the government" without naming
  the issuer. Local "Government of Nepal" remains an unverified candidate.
- Old footer says 2023. Preserved verbatim and marked unverified; not updated.
- Contact form delivery was simulated on the old site; no delivery integration
  or new personal claim was extracted from it.

## Scope and validation
- Work remains on the user-selected `3d_portfolio` branch, preserving commit
  `9dafcb9` (Added CNAME). No old repo edits, pushes or deployments.
- No 3D packages installed; no scene, fallback or SEO work in this step.
- Existing animation Hooks lint failure and loader warning are outside this step.

## AI-COMPANION (user-approved replacement, 2026-10-02)
- AI Companion replaces Blog Page in the four active projects. The complete Blog
  Page record, including conflicting historical candidates, is retained in
  content.archivedProjects and is not rendered.
- User describes a standalone app using local or online models according to the
  task and selected mode, with a workspace for code changes, project analysis and
  feedback, plus voice input. These are user-approved claims, not independently
  tested functionality; no underlying AI Companion repository was inspected.
- Active copy emphasizes workspace integration without claiming that other local
  LLM applications cannot support workspaces. No competitor comparison was verified.
- In development; a personal side project worked on in the user's spare time.
- The supplied original screenshot is public/projects/ai-companion.png (52,655 bytes),
  copied without alteration. It is shown as an actual development-build screenshot.
- Frameworks/languages, supported model providers, repository URL and download/demo
  links were not supplied. Technology and link fields remain null/unverified.
- Older Blog Page tag approvals and blanket no-screenshot notes above are historical;
  the screenshot exception here applies only to AI Companion.

## FOUR-PROJECTS-MIGRATION (user-approved, 2026-10-02)
- Replaced the active project roster with 4 user projects:
  1. AI Coder Chatbot (replaces AI Companion as companion feature is not yet implemented)
  2. Smart Inventory Management (predicts item restock needs and reorder amounts based on usage trends)
  3. Subway Surfer Bot (vision bot trained with YOLO detecting lanes, coins, obstacles to play autonomously)
  4. Feline Feeding Calculator (PMR raw meat feeding calculator & recipe builder by weight, age, activity)
- All previous projects (E-commerce Website, Music App, AI Companion, and Portfolio Website, alongside Blog Page) are preserved in `content.archivedProjects`.
- Screenshots supplied by user were converted from PNG to WebP (`ai-coder-chatbot.webp`, `smart-inventory.webp`, `subway-surfer-bot.webp`, `feline-feeding-calculator.webp`), reducing total payload from >693 KB to ~189 KB while preserving visual fidelity.
- Source and live URLs remain omitted (null / unverified) per project conventions until explicit links are provided.

