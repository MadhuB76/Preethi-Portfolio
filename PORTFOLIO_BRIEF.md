# PREETHI PORTFOLIO — MASTER CODEX BUILD PROMPT
## Rebuild the entire portfolio from scratch using the supplied visual reference

**This prompt replaces all previous portfolio plans, mockups, section structures, colour directions, and implementation briefs.** Treat the newly supplied inspiration image as the primary visual authority. Do not preserve the previous beige/pastel portfolio layout, generic card grid, alternating project rows, or earlier art direction unless a detail is explicitly required below.

## Mission

Build a distinctive, single-page portfolio for **Preethi, a developer**, with a visual style based on the supplied collage:

- warm off-white / paper-like canvas;
- bold black editorial typography;
- tiny hand-drawn purple/indigo doodles, annotations, flowers, stars, and symbols;
- strong modular grid lines and framed image tiles;
- black-and-white or muted editorial imagery;
- playful handwritten accents contrasted with clean typography;
- an unusual left-side navigation panel that opens from an `Open` control;
- dense, curated portfolio imagery balanced by generous negative space;
- a coherent style from the hero through interests, projects, contact, and footer.

The goal is **not** to recreate the collage as a static image or copy all its panels literally. Extract its design language and build a real responsive website that has the same visual character. The hero composition must closely follow the top-left reference panel, while the left navigation should closely follow the far-left panel. The interests and project sections should draw from the grid collage and monochrome portfolio layouts shown in the supplied image.

Every section must be built from scratch as a real component. Do not use the previous portfolio implementation as the visual foundation. Inspect the repository first to understand its framework, assets, and dependencies, then replace the old section structure and styling deliberately.

---

# 1. Reference image: what to follow

The supplied reference is a collage with several distinct cues. Map them intentionally:

### A. Hero — the “Portfolio” / profile composition

Follow the upper-left hero panel as closely as practical:
- warm off-white paper background;
- large, bold black “Portfolio” title toward the upper centre;
- small indigo/purple hand-drawn flowers, stars, crosses, and doodles around the title;
- a circular, black-and-white profile portrait toward the lower-left/centre;
- a small round purple `Open` button to the left of the portrait;
- compact personal introduction to the right of the portrait;
- a few loose handwritten annotations, small icons, check marks, and doodles around the intro;
- generous empty space and editorial placement, not a conventional centered hero card;
- no large gradient, no coloured project cards, no floating browser mockup, no oversized code window.

The original reference is playful and personal. Keep the composition deliberate and imperfect in a designed way: a few hand-drawn accents, slight differences in placement, but strong alignment and typographic control. Do not make it messy or overcrowded.

### B. Navigation — the far-left numbered side panel

Recreate the left-side navigation behaviour and visual language:
- a fixed side panel on desktop, initially collapsed or visually quiet;
- small brand/name at the top, with a simple close icon when open;
- vertical curved path or fine line with numbered section markers;
- numbers such as `01`, `02`, `03`, `04`, `05` in a large typographic style;
- the active section has a darker, stronger number and a small title/description beside it;
- inactive numbers appear quieter and lighter;
- small copyright/credit text near the bottom;
- clean, unobtrusive styling on the same paper background.

The navigation should be a genuine interactive element, not a static drawing.

### C. Interests — editorial grid and collage

Use the dense tile/grid collage in the supplied reference as the visual model:
- visible fine grid lines;
- framed images of different sizes;
- some image tiles may span multiple grid cells;
- text blocks can occupy grid cells alongside images;
- imagery can be monochrome or restrained in colour;
- use asymmetry and intentional density, but retain a clear visual hierarchy;
- small hand-drawn marks can overlap selected tile edges or headings.

Do not use six identical rounded cards. The interests area should feel like a curated visual wall / editorial archive, built from images and text within a deliberate grid.

### D. Projects — black-and-white portfolio editorial layout

Use the top-right portfolio reference for project structure:
- numbered project items;
- large images interspersed with titles and compact descriptions;
- black-and-white photography/screenshots or muted project artwork;
- clear numbering such as `01`, `02`, `03`;
- strong whitespace and grid alignment;
- a layout that feels like a designed portfolio publication, not three coloured promo cards.

The projects must be real content modules with individual composition. Do not invent fake client names, performance numbers, awards, or claims.

### E. Brand identity panel — handwritten labels

Use the bottom-right “Brand identity” reference for small annotation style:
- bold black headings;
- small handwritten indigo notes like “stationery”, “video”, “logo”, or “packaging”;
- doodles that feel hand-marked;
- annotations are supporting details only, not a substitute for readable content.

---

# 2. Global art direction

## Colour system

The page must use one coherent theme from hero to footer. Do not assign a different pastel colour to each section.

Use the uploaded image as the source of truth. Start from these approximate tokens and tune them against the reference:

```css
:root {
  --paper: #F5F3EF;
  --paper-deep: #ECE9E3;
  --ink: #171717;
  --ink-soft: #55524F;
  --rule: rgba(23, 23, 23, 0.20);
  --indigo: #716AA8;
  --indigo-light: #A5A0CB;
  --image-mono: grayscale(100%);
}
```

Colour rules:
- The warm off-white is the main background for every section.
- Black/near-black is the primary text and line colour.
- Indigo/purple is the signature accent, reserved for doodles, small controls, highlights, active navigation details, and a few handwritten marks.
- Photography should be monochrome or muted editorial colour. A real project's authentic colours can remain inside its screenshot, but should not change the overall page theme.
- Do not use dusty pink/rose as the primary accent.
- Do not use arbitrary sage, lavender, pink, or beige background rectangles for individual projects.
- Avoid gradients, glassmorphism, neon colours, heavy shadows, oversized rounded cards, and decorative blobs.
- Keep colour usage consistent across buttons, active states, illustration strokes, focus states, and annotations.

## Typography

Use a controlled pairing:
- **Display / primary sans:** a strong contemporary grotesk such as `Inter`, `Manrope`, or an already-installed similar font.
- **Body:** a clean, readable sans-serif.
- **Handwritten accent:** a restrained handwritten font for tiny notes and doodle labels only. If an appropriate font is already installed, use it; otherwise use a suitable licensed/importable option or original SVG paths. Do not render main paragraphs in handwriting.
- The word `Portfolio` should be oversized, bold, and black, closely matching the reference's scale and weight.
- Use clear contrast between the display typography and the small handwritten annotations.
- Section titles, numbers, captions, and labels should share a consistent scale and baseline system.
- Do not make all copy tiny to imitate a screenshot. Keep actual text readable on the live site.

## Texture, frames, and doodles

- Paper grain may be added as a very subtle texture, never strong enough to hurt legibility.
- Use fine borders and grid lines; avoid thick card outlines.
- Use custom SVG doodles for flowers, stars, crosses, circles, ticks, small leaves, and hand-drawn annotation marks. Keep them simple, light, and consistent.
- Use doodles sparingly around meaningful focal points, not everywhere.
- Use a consistent stroke style for all doodles. Do not mix emoji, generic icon libraries, and hand-drawn illustrations as if they were one visual language.
- Use a real icon set only for functional controls if needed; prefer simple line icons.

---

# 3. Navigation behaviour — the Open button

This interaction is a key part of the hero and must be implemented, not simulated.

## Initial state

On desktop, the page opens with the hero composition visible and the left navigation panel collapsed/quiet. The circular `Open` button is visible near the profile portrait, matching the reference. It should be a real button with a clear accessible label.

## When `Open` is clicked

1. A fixed navigation panel reveals from the left edge, moving horizontally into view.
2. The main portfolio canvas responds to the panel opening: either it shifts right slightly or the panel overlays the canvas with a clean, deliberate transition. Choose the option that best matches the reference and implement it consistently.
3. The panel reveals its brand at the top, a close `X`, the vertical curved/linear path, numbered navigation entries, current section title and small supporting description, and copyright at the bottom.
4. The reveal should feel like a single designed movement, not multiple unrelated elements popping in.
5. The active number is dark and prominent; inactive entries are low-contrast but still readable.
6. Clicking a navigation item smoothly scrolls to the corresponding section and updates the active state.
7. The panel closes after selection on mobile; on desktop it may remain open if this better supports navigation, but behaviour must be consistent.
8. Clicking the close icon closes the panel. Escape should also close it.
9. Focus must move sensibly into the opened panel and return to the `Open` button when closed. Prevent background interaction only if the panel is implemented as a true modal overlay.
10. When the user scrolls through sections, the active navigation item updates from the actual visible section, not from a hard-coded timer.

## Navigation entries

Use five chapters:
- `01` — Home
- `02` — Interests
- `03` — Projects
- `04` — About / Skills (combine only if content needs it; otherwise make this chapter a concise developer profile)
- `05` — Contact

If the supplied content makes a separate About/Skills section redundant, keep it as a smaller part of the Projects/Contact flow rather than inventing empty content. Keep the visual navigation numbering coherent with the actual page.

On small screens, make the panel full-height and usable with touch, with enough room for labels and active descriptions. Do not shrink desktop navigation to an unreadable miniature.

---

# 4. Section 01 — Hero

Build this section from scratch.

## Composition

At a typical desktop viewport:
- the `Portfolio` title occupies the upper central region and is the primary visual anchor;
- indigo doodles decorate a few edges of the title;
- the profile portrait and `Open` control sit in the lower-left/centre region;
- the introduction sits to the right of the portrait;
- a few small handwritten notes and marks are scattered around the introduction;
- the overall layout uses a generous paper background with asymmetry and empty space.

Do not add a conventional navbar across the top. The left navigation panel is the main navigation concept. A tiny wordmark can sit at the top-left if needed.

## Content

Use only verified information:
- Name: Preethi.
- Role: Developer.
- Positioning: turning ideas into real, scalable, meaningful digital experiences.
- Focus: clean code, thoughtful design, good UX.
- Technologies: React, Next.js, TypeScript, Tailwind CSS, Node.js, MongoDB.

Use concise copy in the hero. Do not make up work history, years of experience, clients, awards, or personal details. Keep the introduction similar in density to the reference, but do not copy the reference person's biography.

## Portrait

Use the owner's supplied portrait if one exists in the repository. Inspect assets before adding any new image. If no portrait exists, create a clearly replaceable local placeholder and ask for the real image; do not use an unrelated real person and imply it is Preethi. A temporary abstract/monochrome silhouette is preferable to misrepresenting identity.

Crop it to a circle with a fine indigo outline, a subtle offset ring if needed, and monochrome or muted treatment. Keep it responsive.

## Hero motion

- On first load, reveal the title and supporting composition with a short, restrained entrance.
- Doodles can draw/reveal with SVG stroke animation or appear with a small offset.
- The portrait ring can resolve subtly; avoid spinning or bouncing the portrait.
- The `Open` button should have a small hover/focus response.
- Once the initial movement finishes, the hero remains calm.
- As the visitor scrolls, the hero should transition naturally into the interests grid. Avoid a hard cut, huge blank gap, or unrelated fade-up of the next section.

---

# 5. Section 02 — Interests: build the visual archive from scratch

This section must be fully implemented as a new component and must use the same paper/black/indigo system.

## Layout

Use an editorial grid that feels like the reference collage:
- varied tile sizes and aspect ratios;
- fine visible grid rules;
- a few text-only tiles with short headings or captions;
- images spanning different numbers of cells;
- small indigo doodles/annotations in selected corners;
- a mixture of monochrome imagery and restrained muted tones;
- enough negative space to keep the wall readable.

The exact tile arrangement should be deliberately composed, not randomly scattered. The visitor should recognise it as a visual archive of a creative developer's interests.

## Interest topics

Use these as proposed topics, editable in a single data file and not as verified biographical claims:
- Illustration / art
- Music
- Photography
- Reading / books
- Nature
- Creative coding

Keep labels and image paths in a single data module. Do not reuse the same image six times or use generic gradient placeholders.

## Pinterest imagery requirement

The user wants Pinterest-inspired imagery. Use Pinterest as a visual discovery/reference source for appropriate editorial photographs and artwork, but do not assume a Pinterest page URL is a stable image asset or hotlink Pinterest thumbnails directly.

Preferred process:
1. Search Pinterest for visual references matching each topic and the intended monochrome/editorial mood.
2. Source the final assets from their original creators or a reliable source with clear usage rights (or use images provided by the owner).
3. Save/download approved images into the project's local asset directory with meaningful filenames.
4. Keep all image paths in the interests data module.
5. Use appropriate object-fit and object-position values so the composition matches the grid.
6. Record source/credit and licensing details in an asset manifest if required.

Do not scrape Pinterest, bypass access controls, hotlink expiring image URLs, or use copyrighted images without permission. If source assets cannot be obtained, build the layout with clearly marked replaceable assets and provide a list of the specific images needed. Do not claim Pinterest images have been downloaded if they have not.

## Interaction

Each interest tile should have a restrained hover/focus interaction:
- a subtle image scale or shift;
- caption/annotation reveal;
- indigo line or doodle emphasis;
- no heavy overlay that hides the image.

Where practical, clicking a tile may open a larger editorial view or update a featured interest image. Do not add an interaction without a clear purpose. Ensure the same action is possible with keyboard and touch.

The grid should respond to scrolling through a small number of meaningful transitions, not many independent `fade-up` effects. Keep the movement understated so the images and composition remain the focus.

---

# 6. Section 03 — Projects: editorial, numbered, monochrome

Build this section from scratch. Use the supplied top-right project reference.

## Structure

Exactly three project entries, numbered `01`, `02`, and `03`.

Use an asymmetric editorial grid:
- large image tiles;
- adjacent or opposing project title/description blocks;
- carefully aligned labels and rules;
- alternating image and text placement only when it serves the composition;
- varied but consistent image sizes;
- monochrome or restrained imagery;
- strong whitespace.

Do not make the three projects identical rows. Each can have its own arrangement within the same design system, but all three must feel like one curated portfolio publication.

## Real project information

Use only real project titles, summaries, screenshots, roles, technologies, and links that are already available in the repository or provided by the owner. Do not fabricate client names, metrics, outcomes, awards, or URLs.

If project content is not available:
- create data placeholders such as `Project title to be added`;
- clearly mark the asset path as replaceable;
- do not show invented project claims to the public;
- report what the owner needs to provide.

## Motion

Use subtle scroll-linked image movement and carefully timed composition changes:
- image layers may move a little differently from the text;
- numbers can reveal or move into alignment;
- borders/grid lines can draw or reveal;
- the next project's visual can begin entering as the previous one exits;
- movement must not make the text difficult to read.

Avoid excessive parallax, scroll-jacking, rotating cards, floating 3D objects, or making the visitor scroll horizontally without a clear cue. If a contained horizontal sequence is implemented, it must be reversible and have a natural mobile fallback.

---

# 7. Section 04 — About / Skills

Keep this section concise and grounded. It should support the developer portfolio, not become a generic biography template.

Possible content:
- a short statement about the way Preethi approaches building digital experiences;
- a neat list of the verified technologies;
- small technical annotations or code-like marks in the same indigo doodle style;
- perhaps a compact typographic layout rather than a card grid.

Do not invent a detailed personal story or skill ratings. Do not use progress bars for technologies. Keep it visually connected to the editorial grid and restrained typography.

If the final page content does not need a standalone section, this material can be incorporated into the hero/projects flow, but update the navigation numbering accordingly.

---

# 8. Section 05 — Contact and footer

The contact scene must continue the same visual system:
- warm paper background;
- black display type;
- fine rules;
- indigo hand-drawn accents;
- a clean, readable contact action;
- a small custom SVG illustration or doodle;
- minimal footer metadata and social links only when the real destinations are known.

Use a clear closing line such as “Have an idea? Let’s make it real.” only if it fits the portfolio owner's voice. Keep the contact CTA prominent without putting it in a generic rounded card.

The footer illustration should use the same stroke weight and indigo accent as the hero doodles. It should feel like part of the same sketchbook language.

Do not invent email addresses, social profiles, or links. Do not use a different palette or design style in the footer.

---

# 9. Motion system — smooth, coherent, restrained

The portfolio should feel alive, but motion must support composition and navigation.

## Principles

- Use one coherent motion system throughout the page.
- Inspect the existing repository and installed libraries before choosing or adding dependencies.
- Use scroll-linked animation for meaningful composition changes.
- Use CSS transitions for small hover/focus feedback.
- Do not use an `IntersectionObserver` fade-up on every element as the primary animation system.
- Avoid conflicting animation libraries and multiple animations controlling the same property.
- Use transforms and opacity where possible.
- Avoid layout shift; reserve image dimensions.
- Keep scrolling natural and reversible.
- Never hide content until an animation completes.
- Respect `prefers-reduced-motion`.

## Timing guidance

For time-based UI transitions, use a restrained ease such as `cubic-bezier(0.22, 1, 0.36, 1)`.
- Small hover/focus response: approximately 160–240ms.
- Navigation panel reveal: approximately 350–550ms.
- Hero entrance: approximately 450–750ms.
- Interest image change: approximately 250–450ms.
- Scroll-linked scenes: driven directly by scroll progress, not fixed duration.

These are starting points; tune to the real composition. Do not slow the entire website down for the sake of looking cinematic.

## Reduced motion

When reduced motion is requested:
- remove unnecessary parallax and long sequences;
- avoid pinned scenes;
- make navigation panel changes immediate or short;
- show all content in a stable layout;
- preserve active/selected states and usability.

---

# 10. Responsive behaviour

## Desktop

- Keep the editorial hero composition and fixed/overlay navigation panel.
- Use a varied grid for interests.
- Use spacious project compositions and fine grid lines.
- Ensure the navigation panel doesn't permanently obscure essential content.

## Tablet

- Reduce overlap and doodle density.
- Adjust the gallery to fewer columns where needed.
- Preserve the hierarchy and the same colours.
- Reduce scroll-linked movement.

## Mobile

- Keep the same visual identity; do not redesign into an unrelated generic mobile template.
- The hero should stack portrait, intro, and actions naturally while preserving the `Portfolio` title and a few doodles.
- The navigation panel should become a full-height drawer or accessible overlay.
- Interests should become a clear masonry-like or editorial vertical grid.
- Projects should stack with readable titles and images.
- Do not require hover.
- Avoid pinned/horizontal experiences that trap scrolling.
- Use smaller or no parallax.
- Prevent horizontal overflow.

---

# 11. Code and asset architecture

Inspect the existing repository before editing. Keep the current framework/build configuration if it is working. Do not create an unnecessary new app or replace package versions without reason.

Suggested architecture, adapt to current conventions:

```text
src/
  sections/
    HeroSection.jsx
    InterestsSection.jsx
    ProjectsSection.jsx
    AboutSection.jsx
    ContactSection.jsx
  components/
    SideNavigation.jsx
    Doodle.jsx
    EditorialImageTile.jsx
    ProjectEntry.jsx
    FooterIllustration.jsx
  data/
    interests.js
    projects.js
    siteContent.js
  styles/
    tokens.css
    global.css
    navigation.css
    sections.css
    motion.css
public/
  images/
    interests/
    projects/
  illustrations/
    doodles/
    footer/
docs/
  asset-sources.md
```

Do not split every trivial element into its own file. Reuse the repository's existing conventions if they are cleaner.

### Asset rules

- Inspect existing assets before sourcing replacements.
- Do not use an unrelated portrait to represent Preethi.
- Do not invent project screenshots.
- Use SVG for original doodles, fine lines, and the footer illustration.
- Keep image filenames meaningful and all assets local where practical.
- Include source/licensing notes for externally sourced images.
- Use lazy loading for below-the-fold imagery without delaying the hero.
- Set explicit width/height or aspect ratios to avoid layout shifts.
- Ensure images have appropriate alt text.

---

# 12. Implementation process

Do the work in this order:

1. Inspect the repository, current sections, CSS, assets, and installed dependencies.
2. Identify what can be retained technically and what must be replaced visually.
3. Create the global colour, typography, grid, frame, and doodle system from the reference.
4. Implement the side navigation and working `Open`/close interaction.
5. Build the hero from scratch, matching the reference composition as closely as possible.
6. Build the interests editorial grid from scratch and map each tile to its actual image.
7. Build the three numbered project entries from scratch using verified content/assets.
8. Build the concise About/Skills content if needed.
9. Build the contact scene and original SVG footer illustration.
10. Add coherent, reversible motion after the static layouts and interactions work.
11. Test all breakpoints, navigation, keyboard interaction, reduced motion, and backward scrolling.
12. Run the repository's available lint, type-check, tests, and production build.
13. Report which parts are complete and list any assets/content that need the owner's input.

Do not stop after producing a screenshot or a static layout. The deliverable is a functioning React/web implementation in the repository.

---


---

# IMPORTANT ADDITION — FULL-VIEWPORT SECTIONS

**Every main portfolio section must be designed as a full-screen scene. This is a core layout requirement, not an optional styling preference.** The page should feel like moving through a sequence of carefully composed, full-viewport experiences—not a long template made of small stacked blocks.

## Viewport sizing rules

Apply this requirement to:
- `01 — Home / Hero`
- `02 — Interests`
- `03 — Projects`
- `04 — About / Skills` (if retained as its own section)
- `05 — Contact`

Each of these sections should occupy at least one full viewport in height, using a robust viewport unit such as `min-height: 100svh` with appropriate fallbacks. The composition should be planned for the actual viewport dimensions, including browser UI on mobile.

```css
.portfolio-section {
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  box-sizing: border-box;
}
```

This is a sizing baseline, not a command to clip content. Use section-specific internal layout, responsive spacing, and grid sizing so each section feels composed within the available screen. If content genuinely needs more room on a small screen or at high zoom, let that section grow naturally rather than hiding, overlapping, or clipping content.

## What “full-screen” means visually

- Each section should read as a complete scene when it enters the viewport.
- The main title, primary imagery, essential copy, and main interaction should fit together within that scene on typical desktop dimensions.
- Do not place the next section's heading immediately halfway up the previous section, unless a deliberate overlap is part of a reference-matched transition.
- Do not create huge empty spacer sections to fake a scroll animation.
- Keep section padding and composition responsive to viewport width and height.
- Use scroll progress to transition the scene's internal elements naturally; the full-screen requirement does not mean each section should be a static poster.
- Make section boundaries feel intentional through the changing composition, grid, imagery, and motion—not through arbitrary background-colour changes.
- The visitor must be able to scroll both forwards and backwards naturally. Do not hijack the mouse wheel or trap the user in a pinned scene.

## Explicit exceptions

- **The footer is exempt.** It should use natural content height and remain compact; do not force it to fill a viewport.
- **The `Open` control is not a section.** It is a small interactive button belonging to the hero. Its size and placement should match the reference, not expand to fill the screen.
- The navigation drawer/panel revealed by `Open` is also not a page section. Size it according to the reference and usability needs, not the full-screen section rule—although it may extend to full height on mobile for accessibility.

## Desktop, tablet, and mobile

- **Desktop:** Compose each main scene for a full viewport with clear focal hierarchy and carefully controlled overlap.
- **Tablet:** Keep the full-screen scene where practical, but allow a section to exceed one viewport if the content needs it.
- **Mobile:** Aim for a full-screen first impression for each section, but prioritize readable content and natural scrolling. A section may become taller than the viewport; never compress text, crop essential imagery, or disable scrolling just to force exactly `100svh`.
- **Short screens / zoom / accessibility:** Allow content to expand. Avoid fixed heights for content-heavy sections.

## Motion must respect the section rhythm

Treat the portfolio as a sequence of viewport-sized scenes:
1. The hero settles into view.
2. Scrolling begins a continuous transition from hero into interests.
3. The interests gallery composes itself within its full-screen scene, with the interactive image changes working independently of scroll.
4. The projects scene uses its full-screen composition and restrained parallax to introduce the three projects. If all three cannot fit legibly in one viewport, use a deliberate project sequence within the Projects section rather than shrinking everything into unreadable thumbnails.
5. About/Skills, if present, forms its own complete scene.
6. Contact forms the final full-screen scene.
7. The footer follows in its natural compact height.

Do not interpret “full-screen sections” as permission to add a forced slide deck or mandatory horizontal scrolling. Keep normal vertical scrolling as the dependable navigation path. Any horizontal movement should be a visual effect within the section, with a usable touch/mobile fallback.

Add these checks to the definition of done:
- [ ] Hero, Interests, Projects, About/Skills (if separate), and Contact each read as full-viewport scenes on typical desktop screens.
- [ ] Footer remains naturally sized and is not forced to `100svh`.
- [ ] The `Open` button remains a small control, and the navigation drawer is not treated as a content section.
- [ ] No section clips important content at short heights, mobile sizes, or increased zoom.
- [ ] Scene transitions feel continuous while normal forward and backward scrolling remain available.


# 13. Definition of done

- [ ] The old portfolio template layout has been replaced, not just recoloured.
- [ ] The supplied collage is visibly the source of the visual direction.
- [ ] The hero closely follows the `Portfolio` title, indigo doodles, circular portrait, `Open` button, and side-by-side introduction.
- [ ] Clicking `Open` reveals the numbered left-side navigation panel.
- [ ] Navigation links scroll to the right sections and update the active state.
- [ ] The entire page uses one warm-paper, black, and indigo theme.
- [ ] The interests section is a curated asymmetric editorial grid, not six identical cards.
- [ ] Interest imagery is real, mapped correctly, and replaceable through data.
- [ ] Pinterest is used as a discovery/reference source without unsafe hotlinking or unlicensed scraping.
- [ ] The projects section has exactly three numbered editorial entries with verified content.
- [ ] No fake client names, project outcomes, metrics, or links are presented as real.
- [ ] About/Skills, contact, and footer maintain the same visual language.
- [ ] Doodles and illustration strokes share a consistent style.
- [ ] Animations are purposeful, reversible, and not just generic fade-up reveals.
- [ ] The site works on desktop, tablet, and mobile.
- [ ] Keyboard navigation and reduced-motion settings work.
- [ ] No horizontal overflow, layout shifts, broken assets, dead buttons, or console errors.
- [ ] Available build/lint/test checks are run and their results reported.

---

# FINAL INSTRUCTION TO CODEX

The supplied image is the primary art-direction reference. Rebuild the portfolio from scratch section by section, following its warm paper background, black editorial typography, indigo hand-drawn doodles, numbered left navigation, asymmetric image grid, and monochrome portfolio imagery. The hero must closely follow the reference composition: oversized `Portfolio` title, doodles, circular portrait, round `Open` control, and personal introduction.

The `Open` button must reveal a functional left-side numbered navigation panel with a smooth, unified slide-in transition. Build the interests section as a new editorial image grid inspired by the collage, sourcing suitable Pinterest-inspired imagery responsibly and storing real assets locally. Build three numbered projects in the same monochrome/editorial style. Continue the same theme through About/Skills, Contact, and footer.

Do not reuse the old template's card grid, pastel project blocks, alternating project rows, or unrelated footer design. Do not invent a new palette. Do not use placeholder gradients instead of imagery. Do not fake the navigation interaction. Do not declare completion after rendering a static mockup.

Inspect the repository first, then implement the actual components, interactions, responsive layouts, and motion. Use verified owner content only; flag missing portrait/project assets instead of fabricating them. Run the available checks and report what was implemented and what still requires real assets or information.
