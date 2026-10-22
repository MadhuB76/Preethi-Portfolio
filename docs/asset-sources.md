# Asset sources and replacement checklist

## Portrait

The owner explicitly chose a silhouette placeholder. The circular portrait in `HeroSection.jsx` is original SVG artwork and is labelled as a placeholder. The unrelated/unverified portrait in the legacy `src/assets/profile.svg` is not imported. Replace the silhouette only with an owner-approved image of Preethi.

## Visual discovery

The supplied collage is the primary art-direction reference. Pinterest was used for discovery only:

- https://www.pinterest.com/andrisdze/black-and-white-editorial/
- https://www.pinterest.com/photojordan/monochrome-portfolio/
- https://mx.pinterest.com/aranzadmar/editorial-collage/

No Pinterest images were scraped, downloaded, or hotlinked.

## Current coordinated interest gallery

The current gallery uses seven large rectangular color photographs in a connected wall arrangement, guided by the owner's latest collage reference. Labels remain outside the photos; there is no visible description column. Images fill the frames with individually selected focal positions. The earlier clipped and sidebar layouts are no longer mounted.

Confirmed topics: Dancing, K-dramas, Foodie, Photography (the poser), Nature Exploration, Doodling, and Music. Each theme has seven local photographic frames. New free Unsplash photos and source pages are recorded in `public/images/gallery/credits.json`. Nature and Music also reuse local photos recorded in `public/images/interests/credits.json`. The stock models illustrate the interests and are not identified as Preethi. The doodling theme now uses drawing and sketchbook photographs; the original ink studies are retained but are not shown on the photo wall.

Character cutouts continue to decorate About and Contact. The previously used selfie is retained locally but removed with the gallery sidebar. Tool mode, asset paths, and exact extraction prompts are in `docs/character-assets.md`. All images are served locally.

Additional Pinterest discovery references for editorial food collage composition: https://in.pinterest.com/pin/1133429431309933170/ and https://uk.pinterest.com/pin/shuffles-moodboard-collage-food-yummy--638385315946264513/ . The supplied portfolio collage remains the primary visual reference. No Pinterest images or portfolio layouts were copied or hotlinked.

## Retained earlier editorial photography

The archive reuses six stock photographs already downloaded from Unsplash. The original source URLs are recorded in `public/images/interests/credits.json`; the selected files were copied into `public/images/archive/` with descriptive names.

| Archive file | Original local file |
| --- | --- |
| illustration-study.webp | art-1.webp |
| music-studio.webp | music-1.webp |
| camera-study.webp | photography-1.webp |
| library-shelves.webp | reading-1.webp |
| forest-light.webp | nature-3.webp |
| creative-code.webp | code-1.webp |

License reference verified on 19 October 2026: https://unsplash.com/license. The Unsplash license permits free commercial and non-commercial use; it does not permit selling unmodified images or compiling a competing image service. These are illustrative interest images, not photographs claimed to depict Preethi or her work. The photos are served locally; no Pinterest or external image hotlinks are used at runtime.

## Original vector artwork

`Doodle.jsx`, the silhouette, the project image studies, and the contact sketch are original code-native SVG artwork. All use the same restrained stroke style. The neutral project image studies are explicitly labelled placeholders and do not depict fabricated products.

## Hero brush artwork and lettering

The hero and drawer reading font is locally hosted DM Sans (Google Fonts), licensed under the SIL Open Font License: https://github.com/google/fonts/tree/main/ofl/dmsans . Its license is in `public/fonts/DMSans-OFL.txt`. The green watercolor wash in `public/images/hero-watercolor.svg` is original vector artwork with layered pigment shapes and SVG grain, inspired by the owner-supplied paint reference.

Typography uses a distinct lead, supporting paragraphs, grouped actions, and always-visible navigation labels. Reference: https://www.nngroup.com/articles/principles-visual-design/ (scale, hierarchy, contrast, proximity).

The hero uses original SVG brush marks in `BrushDoodle.jsx` and an original uneven portrait outline. Pinterest discovery references: https://ph.pinterest.com/pin/499547783680187969/ and https://uk.pinterest.com/rbrown2897/handwritten-doodles/ . The supplied portfolio image is the composition reference; no Pinterest artwork is copied or served.

Handwritten hero annotations use locally hosted Caveat Brush by Impallari Type, from https://github.com/google/fonts/tree/main/ofl/caveatbrush . The SIL Open Font License is included beside the font in `public/fonts/CaveatBrush-OFL.txt`.

## Owner content still required

- Actual portrait of Preethi.
- Four real project titles, summaries, screenshots, roles, technologies, and URLs.
- Contact email and social URLs.

Content is centralized in `src/data/editorial.js`. Empty contact and project URLs do not render fake links.


## Centered collection — 19 October 2026

The latest owner-supplied collage references guide the asymmetric grid and surrounding space. Pinterest discovery for the headphones drawing style: https://in.pinterest.com/pin/headphones-girl--850969292125900128/ . The site uses the existing original transparent headphones character documented in character-assets.md, saved locally; the Pinterest drawing is not copied or hotlinked. Four original architectural SVG studies remain marked project placeholders.
The latest approved update renders the existing locally stored photographic sets in black and white with a CSS grayscale/contrast treatment. No new external imagery or hotlinks are introduced. The asymmetric seven-photo layout follows the owner-supplied architectural collage; small black square accents and original handwritten notes complete the editorial treatment.
The latest owner-supplied dark collage reference now guides a diagonal seven-photo composition with extended horizontal and vertical rules. The approved warm paper background and monochrome image treatment remain; rules replace the earlier square accents. Mobile retains its two-column readable fallback.
Projects contains three full-screen editorial compositions based on the latest owner-supplied Archive reference: a small detail image, concise left-side text, two large portrait images, and an oversized cropped serif Projects title. The previous ruled grid is replaced. Original vector placeholders remain explicitly labeled; no fashion photographs or unrelated work are presented as Preethi's projects. Real screenshot pairs can be supplied in each `project.images` array in `src/data/editorial.js`, with `project.image` as a fallback. The existing horizontal reading intervals and navigation remain.

## Stationary project title and editorial photos — 20 October 2026

The title now sits outside the horizontal track and crops flush at the viewport bottom. Upper images and project copy move across three reading intervals; mobile and reduced motion retain readable vertical compositions.

Pinterest discovery reference: https://www.pinterest.com/salimhilles/architecture_light-shadow/ . Six free Unsplash photographs by Raimo Lantelankallio, Johnny Ho, Amal K Raju, Dark Narrative, Z, and Paul Povoroznuk are saved in public/images/projects. Individual source URLs, authors, download sizes, and the Unsplash License URL are recorded in public/images/projects/credits.json. The script scripts/fetch-project-assets.mjs can reproduce the downloads. No remote image hotlinks are used at runtime. Each photo is labeled temporary editorial imagery, not presented as Preethi's project work. Replace images and set temporaryImages to false when real work is supplied.

Skills rings, core, glow, and the particle field are original code-native SVG/CSS/canvas visuals based on the supplied circular composition reference. No reference photos or blue gradient are copied. Skill categories come from the supplied list and confirmed MERN / Power BI additions in src/data/editorial.js. The reader cutout remains stored and is not mounted in the new Skills section.

The latest Skills reference is translated into original restrained SVG ring clusters, five direct core connections, and an aligned interactive skill rail across the full canvas. The right text panel is removed. The entire mounted site uses a monochrome palette, including individually filtered images and SVGs. Original CSS color mappings are retained in docs/editorial-palette-history.json for future palette decisions. No reference artwork is copied.

The Skills composition now uses five irregular layered nodes in gray washes, with all full skill names visible beside their categories. Flowing connections follow the actual node positions on resize. The central node and bottom skill rail have been removed; background particles draw dots only. All artwork remains original SVG/canvas code.

## Editorial contact / footer

The supplied Studio reference informs the small upper signature, compact navigation, generous whitespace, and oversized lower-right Preethi wordmark. Pinterest minimalist line-art reference: https://www.pinterest.com/terriblehun/minimalist-doodle/ . The flower, smile, star, arrow, and coffee drawings are local code-native SVGs; the existing locally stored headphones character is reused. No Pinterest image is hotlinked. Social links and email render from site.socials and site.email in src/data/editorial.js; until real account URLs are supplied, the footer displays a clearly labeled coming-soon message instead of fabricated links.
