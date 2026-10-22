# Preethi — editorial portfolio

Rebuilt from the latest `PORTFOLIO_BRIEF.md` and the owner's supplied collage. The previous architectural room and its animation system are not mounted. React/Vite, existing dependencies, and locally stored stock imagery are retained.

## Run

- `npm run dev`: local preview
- `npm run build`: production output in `dist/`
- `npm run lint`: ESLint

## Page and interactions

Five real full-viewport chapters use `min-height: 100svh`, and grow naturally when content needs more space. Home and Interests share a pinned, scroll-controlled camera transition. Projects rises over the gallery once, then scrolls through three editorial compositions horizontally. About and Contact scroll normally; the closing composition and its credits share one viewport.

- **Home:** oversized Portfolio title, original monochrome brush doodles, owner-requested silhouette placeholder, round Open button, and the owner-supplied developer introduction.
- **Navigation:** fixed numbered left drawer with a curved path, actual scroll-based active state, modal background handling, focus trap, Escape/close, focus return, and working section links. A small Open control remains available after leaving the hero.
- **Interests:** seven monochrome editorial photographs form a centered asymmetric photo collection with surrounding whitespace with aligned edges, varied sizes, narrow gaps, and small external labels. Music joins the existing six topics. There is no description column; descriptions remain available to assistive technology. Whole frames assemble during the opening zoom. Hover or keyboard focus previews a coordinated photographic theme; click/tap pins it, and Show all interests or Escape resets it. Images decode before a distance-based radial ripple: the selected frame changes first and the others follow outward. A six-second automatic cycle adds handwritten notes, pauses during interaction or when hidden, and has a pause/play control. Reduced motion disables automatic cycling. Mobile uses a two-column wall with a final wide Music frame.
- **Projects:** three full-screen editorial compositions: a small detail image and concise text on the left, two large portrait images on the right, and an oversized serif Projects title intentionally cropped at the bottom. On desktop the title remains stationary and cropped flush with the viewport bottom; only the upper project content travels horizontally. Each project has a reading interval; previous/next buttons and a 01 / 03 indicator follow the scroll position. Mobile, short screens, and reduced motion use vertically stacked, readable projects. Missing project content is clearly labelled. Six locally stored architectural photographs provide temporary editorial imagery, with source and license records in public/images/projects/credits.json. Add screenshot pairs to each entry's `images` array; `image` remains the single-image fallback. Set `temporaryImages` to false when adding actual project screenshots.
- **Skills / The way I build:** five organic grayscale ring nodes linked by flowing SVG paths. All supplied skills remain visible beside their category, without a central hub or bottom rail. Hover, focus, and tap emphasize a category; skill selection exposes its full name in the inline status. Responsive connections follow measured node positions. Cursor-responsive background particles are dots only and pause off screen, in a hidden tab, or in reduced motion. Mobile keeps every category and skill readable in a single column. No proficiency scores or invented experience are shown.
- **Contact:** reference-inspired closing composition with an oversized Preethi wordmark, compact navigation and a local monochrome doodle vignette, with credits integrated into the same screen. GitHub and LinkedIn labels remain visible while their URLs are pending; configured social and email links become active automatically.

`src/hooks/useEditorialMotion.js` uses GSAP/ScrollTrigger for a reversible opening zoom. The title exits upward, portrait down-left, copy down-right, and paint outward, while Interests grows from the center to full size over 1.8 viewport heights of scroll. On narrow screens the full introduction can be read before pinning begins. Reduced-motion mode restores the natural document flow. Section links use the transition endpoint, so drawer navigation and direct Interests links land correctly. Projects links land at the first project reading interval. A sticky gallery backing supports the desktop paper overlap.

## Files

- `src/App.jsx`: page structure, drawer state, actual-section tracking.
- `src/data/editorial.js`: all verified/proposed content, image paths, three project placeholders, contact settings.
- `src/components/SideNavigation.jsx` and `Doodle.jsx`: accessible navigation and shared original marks.
- `src/sections/*Section.jsx`: newly built chapters.
- `src/index.css`: complete replacement editorial monochrome system and responsive layouts.
- `docs/asset-sources.md`: Pinterest discovery links, local photo sources/license notes, original art, and replacement checklist.

Legacy files/assets are retained unmounted to preserve prior work. The displayed portfolio uses only the new components/styles.

## Content still needed

The owner selected a silhouette until a real portrait is supplied and has confirmed the seven current interests. Three actual projects, screenshots, roles, tags, URLs, and contact/social details remain to be provided. No public publication or deployment has been performed.

## Verification

`scripts/verify-experience.mjs` runs headless Edge with an available Playwright runtime (`PLAYWRIGHT_MODULE` can point to its ESM module). It starts and closes its own Vite server. Checks cover five viewport-sized scenes, three projects, drawer open/close/Escape/focus trapping/return/active-state tracking, coordinated gallery hover and touch interactions, local image loading, nine phone/tablet/laptop/desktop/short-screen sizes, overflow, natural footer height, reduced motion, and page errors. Screenshots are saved under ignored `artifacts/` for visual inspection. There is no TypeScript configuration or separate type-check script.

`scripts/verify-opening-motion.mjs` also checks intermediate zoom directions and scales, pause/reverse behavior, flush arrival, hidden-control focus handling, resize/orientation changes, live reduced-motion teardown/re-enable, and direct Interests links. It uses its own server on port 5181 and writes transition frames into `artifacts/`.

The camera has a short 0.45-second scroll-following ease. Seven complete frames assemble on the same scroll timeline and restore normally in reduced-motion mode. `scripts/verify-interests-gallery.mjs` checks rectangular frames, unobstructed photos, external labels, frame spacing, all seven coordinated photographic sets, stable geometry, hover/pinned selection/reset, keyboard/Escape, mobile taps, and image loading (port 5182).

Small owner-supplied character illustrations decorate Interests and Contact; the earlier reader and selfie assets remain saved. Their transparent cutouts, tool mode, and extraction prompts are documented in `docs/character-assets.md`.


`scripts/verify-project-blueprint.mjs` checks three horizontal screens, the fixed grid, previous/next controls, reverse scroll, one Interests overlap, inert hidden panels, reduced motion, and responsive vertical layouts (port 5183).


`scripts/verify-gallery-ripple.mjs` checks the six-second cycle, quirky notes, pause/resume, radial wave origins, hover hold, offscreen pause, and reduced-motion behavior (port 5185).



`scripts/verify-skills-orbits.mjs` verifies all five categories, supplied skill names, orbit label spacing, keyboard/Escape, selection synchronization, cursor response, static reduced-motion particles, mobile taps, and responsive layouts (port 5186).

The current whole-site palette is black, white, and gray. Visual assets are filtered individually so fixed and pinned ancestors retain their original positioning. The earlier stylesheet color mappings are recorded in `docs/editorial-palette-history.json`; `src/styles/monochrome.css` supplies final editorial accents.

The contact/footer uses an oversized Preethi wordmark, a local monochrome doodle vignette, and compact internal navigation. Add verified profiles to `site.socials` (`{ label, url }`) and the contact address to `site.email` in `src/data/editorial.js`; the footer picks them up automatically. `scripts/verify-footer-archive.mjs` checks its responsive layout and navigation.

Desktop mouse input uses a small difference-blended cursor dot that grows over enabled controls and compresses on press. It follows the pointer directly, passes clicks through, and restores the system cursor for text entry, keyboard navigation, touch, window exit, and forced-colors mode. Reduced motion disables size transitions. `scripts/verify-interaction-cursor.mjs` checks interaction states and actual black/white pixel inversion.

Final theme: soft pink `#F6D6D6` surfaces and blue `#A2D2DF` accents with dark readable ink. Editorial photographs stay monochrome; watercolor and SVG marks use the theme. Projects stay pinned and horizontal at widths above 900px regardless of browser height (except reduced motion). Footer doodles use separate grid cells to prevent overlap on laptop and mobile screens.
