<!-- Hallmark · pre-emit critique: P5 H5 E4 S5 R5 V5 -->
<!-- Hallmark · genre: editorial · system: custom · concept: The MTK Cut · scope: public multi-page -->

# Design — MTK Media

Locked design system for the public MTK Media website. Future public-page work reads this file first and defers to it. Amend it deliberately; do not create a separate theme per route. This system does not apply to `/admin`.

## System

### Homepage refinement · 2026-09-03

This is a scoped refinement of the approved THE MTK CUT, not a theme rotation. These homepage decisions supersede the earlier Home/media/footer prescriptions below; Work, case studies, Services, Contact, blog, admin and data integrations remain unchanged.

- Sequence: portrait showreel stage → navy manifesto with inverted payoff → native editorial work reel → typographic discipline accordion → production film / dark text split → project invitation → editorial colophon.
- Desktop hero: measured 720×1280 source, full sharp 9:16 stage to the right, restrained blurred poster environment behind it. Four-line display stays in independent left negative space. Below 960px or in portrait orientation, retain the immersive cover treatment with intentional 60% focal position.
- Brand logo: original transparent `public/mtk-logo-dark.png`; preserve ink proportions, crop transparent canvas only, render white through a monochrome filter on navy. `favicon.svg` embeds raster artwork and is not a vector master. Do not substitute font text.
- Home work: `WorkItem[]` adapter over the existing published/ready data. Featured items when supplied, otherwise the available catalogue; no fixed three-item cap. Native horizontal snap, next-frame implication, project index and keyboard navigation. A single item has no progression controls. Poster-led, one user-requested preview at a time. Full `/work` library stays separate.
- Disciplines: one open typographic row, native button semantics, tap/keyboard parity, short clipped description reveal. No decorative letters, icon cards or invented proof.
- Production film: measured 720×1280 source, contained portrait in the existing split. Defer its source until near the viewport; play only in view, initially muted. Hero and secondary film pause offscreen/hidden; reduced motion and Save-Data use a poster until explicit playback.
- Footer: real logo and four-line brand construct, primary project action, three compact groups (navigation / approved social / location and languages), then copyright and existing `Designed by ING. JMDR` credit. No invented legal URLs.
- Additional display tokens: `--text-hero-mobile`, `--text-hero-desktop`, `--text-manifesto`, `--text-discipline` in `tokens.css`. No new palette or family. Native mask/transform timing only; no heavy media player.
- Hallmark exceptions required by this brief: preserve the approved macrostructure family rather than rotate; navy is a brand surface, not a five-percent accent; official white/black/gray primitives remain exact; a linked project title may wrap as editorial content, while navigation and CTA labels remain single-line.

- Genre · **Editorial**, with cinematic pacing rather than magazine ornament.
- Creative direction · **The MTK Cut**.
- Core idea · The site behaves like an edit: a decisive opening frame, hard cuts between paper and navy, work shown at meaningful scale, and concise credits instead of decorative interface.
- Tone · Contemporary creative studio; confident, human, premium, slightly unconventional.
- Axes · light paper / display-condensed-bold / cool navy.
- Primary action · See the work.
- Conversion action · Start a conversation.
- Brand line · “We are not like the other agencies; we are a cool agency.” Use once, as a point of view—not as a repeated slogan.
- Brand construct · `MARKETING / TECHNOLOGY / KREATIVITY / EVOLVED` may act as an opening sequence or running index. Do not turn it into four generic feature cards.

## Brand principles

1. **The work is the interface.** Photography and video receive more space than navigation, filters, copy, or decoration.
2. **Edit, do not decorate.** A page gains rhythm through scale changes, sequencing, crop and whitespace—not gradients, glass panels, shadows or ornamental blobs.
3. **Confidence uses fewer words.** Headlines are short; descriptions explain the work without marketing filler.
4. **MTK remains recognizable.** Navy, condensed typography, the existing mark and the K in Kreativity remain deliberate brand signatures.
5. **Every project may feel different; the system may not.** Media composition varies from metadata while typography, color, navigation and interaction stay consistent.
6. **No invented proof.** Never add clients, awards, metrics, testimonials or claims that are not supplied by MTK.

## Macrostructure family

- Home · **Marquee Hero → Photographic Reel**. A typographic opening frame gives way immediately to featured work. No CTA is required above the fold.
- Work · **Portfolio Grid**, interpreted as an irregular editorial index rather than equal cards.
- Project · **Photographic Long-form**. The media sequence is the narrative; project facts behave like credits.
- Services · **Long Document / Split Studio**. A flowing service narrative with selected work evidence; no icon-card grid.
- Contact · **Letter Close**. One direct proposition, a compact form and real contact channels.
- Navigation · **N9 Edge-aligned minimal**. Wordmark left; Work, Services and Contact right; language control secondary.
- Footer · **Ft1 Masthead**. Large MTK signature, one closing statement and a restrained legal/contact line.

## Color strategy

The official palette remains the primitive source. Functional surfaces use slightly navy-tinted near-white and near-black so the site has depth without introducing a new accent.

### Official primitives

```css
:root {
  --brand-white: oklch(100% 0 0);              /* #FFFFFF */
  --brand-black: oklch(0% 0 0);                /* #000000 */
  --brand-gray:  oklch(63.01% 0 0);            /* #898989 */
  --brand-navy:  oklch(25.17% 0.0956 267.3);   /* #0E1C4F */
}
```

### Semantic color tokens

```css
:root {
  --color-paper:        oklch(98.4% 0.004 267.3);
  --color-paper-2:      oklch(95.5% 0.008 267.3);
  --color-paper-3:      oklch(91% 0.012 267.3);
  --color-ink:          oklch(10.8% 0.016 267.3);
  --color-ink-2:        oklch(23% 0.025 267.3);
  --color-rule:         oklch(82% 0.010 267.3);
  --color-rule-strong:  oklch(63.01% 0.008 267.3);
  --color-muted:        oklch(48% 0.012 267.3);
  --color-accent:       var(--brand-navy);
  --color-accent-ink:   var(--color-paper);
  --color-focus:        oklch(58% 0.18 260);
  --color-error:        oklch(50% 0.19 27);
  --color-success:      oklch(45% 0.12 153);
}
```

Rules:

- Paper is the default canvas; navy is used for structural cuts, navigation, selected CTAs and occasional full-bleed chapters.
- Black supplies typography and image framing. Gray is metadata, captions and rules.
- Navy remains the only brand accent. Functional focus/error/success colors are utility signals, not decorative colors.
- A navy background always sets foreground to `--color-accent-ink` explicitly.
- Avoid gradients. When two surfaces meet, use a hard cut or a hairline.
- Do not cover more than roughly one third of most pages in navy. A project with dark media may use more paper to preserve contrast.

## Typography

- Display · **Bebas Neue Cyrillic**, roman, weight 400. Use for H1, major H2 and the four-word brand construct.
- Body · **Antonio**, roman, weights 400–500. Use for paragraphs, navigation, labels and UI.
- Emphasis · Antonio 600. Do not introduce italics into headings.
- Additional support font · **None**. Antonio must be tested at body sizes before adding another family; preserving the brand pairing is preferred.
- Repository note · the current CSS loads Google “Bebas Neue”, not an identified “Bebas Neue Cyrillic” webfont. Before page implementation, confirm the official webfont asset/license or approve the Google face as the production substitute.

```css
:root {
  --font-display: "Bebas Neue Cyrillic", "Bebas Neue", sans-serif;
  --font-body: "Antonio", sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --text-lede: clamp(1.25rem, 1.08rem + 0.85vw, 1.75rem);
  --text-h3: clamp(1.75rem, 1.35rem + 1.6vw, 3rem);
  --text-h2: clamp(2.75rem, 1.85rem + 4vw, 6rem);
  --text-display: clamp(3.5rem, 2rem + 8vw, 10rem);
  --text-display-long: clamp(2.75rem, 1.8rem + 5vw, 7rem);

  --leading-display: 1.02;
  --leading-heading: 0.96;
  --leading-body: 1.55;
  --tracking-display: 0.01em;
  --tracking-label: 0.09em;
}
```

Typography rules:

- One H1 per page.
- Display headlines use `overflow-wrap: anywhere` and `min-width: 0`.
- Use `--text-display-long` when a heading exceeds 50 characters.
- Body measure is 45–68 characters; 72 is the hard maximum.
- Labels may use uppercase Antonio with tracking. Body copy does not use all caps.
- Avoid centered paragraphs longer than two short lines.

## Grid and width

- Base desktop grid · 12 columns with 24px gutters.
- Tablet grid · 8 columns with 20px gutters.
- Mobile grid · 4 columns with 16px gutters.
- Page gutter · `clamp(1rem, 4vw, 4rem)`.
- Text container · maximum 72rem; prose column maximum 42rem.
- Standard media container · maximum 96rem.
- Full-bleed media · viewport width, bounded by its own aspect ratio and safe crop.
- Large desktop · content remains composed beyond 1440px; media may expand to 1920px, text may not.
- Image-bearing tracks use `minmax(0, 1fr)`.

Editorial asymmetry rules:

- Asymmetry must come from media ratio or narrative priority, not random offsets.
- Valid desktop spans are 4/8, 5/7, 7/5, 8/4 and 12/12.
- Do not repeat the same split more than twice consecutively.
- A full-bleed frame resets the rhythm after two or three contained frames.
- Mobile collapses to one content column. No horizontal media overflow is required to understand the page.

## Spacing

Use the named 4-point scale. Raw spacing values are prohibited in future public-page CSS unless added here first.

```css
:root {
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  --space-4xl: 8rem;
  --space-5xl: 12rem;
}
```

- Section rhythm alternates intentionally: `--space-3xl`, `--space-5xl`, `--space-4xl`; do not apply the same vertical padding everywhere.
- Mobile major sections use `--space-2xl` to `--space-3xl`.
- A project media sequence may use tight cuts (`--space-xs`) followed by a major pause (`--space-4xl`).

## Borders, radius and depth

```css
:root {
  --rule-hair: 1px;
  --rule-strong: 2px;
  --radius-media: 0;
  --radius-control: 0.125rem;
  --radius-pill: 999px;
  --shadow-lift: 0 1rem 3rem oklch(10.8% 0.016 267.3 / 0.12);
}
```

- Media, sections and project entries have square corners.
- Standard CTAs and form fields use `--radius-control`, not pills.
- `--radius-pill` is reserved for compact status/filter tokens only when the shape communicates selection.
- Project media does not use shadows. Use `--shadow-lift` only for an overlay that must separate from moving media.
- Hairlines divide information. Avoid boxed cards and card-within-card compositions.

## Imagery

- Preserve original color unless a project explicitly supplies an art-directed treatment.
- Cover media uses a decisive crop; case-study galleries prioritize uncropped or minimally cropped presentation.
- Listing crops derive from intrinsic media ratio, not a universal 16:9 box.
- `object-fit: cover` is allowed for covers and reels; gallery images use `contain` when cropping would remove meaningful work.
- Full bleed is earned by hero, cover or featured media. Ordinary gallery frames stay within the media container.
- Hover treatment is one signal only: a restrained media scale to 1.015 **or** a metadata reveal, never both plus shadow/rotation.
- Never place a generic dark gradient over every image. If text overlays media, use a localized solid/transparent scrim only when contrast requires it.
- Empty image slots never use invented stock photography.

## Video

- Home showreel · use the supplied MTK Cloudinary film as a full-bleed background, never inside a card. Begin muted; expose explicit play/pause and sound controls. The opening frame uses a derived Cloudinary poster and a stable `100svh`-class container.
- Home showreel source · `https://res.cloudinary.com/vloh9uw1/video/upload/v1788976814/AHORA_SI_ES_VERDAD_QUE_SubioLaLibra_en_Puerto_Plata_Se_juntaron_sojuleg_rd_mtkmediainc_pa_d.mp4`.
- Work index · poster-first. On pointer-capable devices, an optional muted preview may begin after intent is clear; it stops when out of view. Mobile remains poster-first.
- Project hero · autoplay is permitted only for a designated ready hero video, muted, inline, looped and without audio expectation. Respect reduced motion and data-saving preferences by showing the poster instead.
- Editorial video · user-initiated playback with native or accessible custom controls; never autoplay multiple videos.
- Vertical reels · render at 9:16 using two or three columns on large screens and one column on mobile. Do not force horizontal swiping.
- Horizontal video · preserve 16:9 or recorded ratio and allow full media width.
- Poster · use `thumbnail_url`; fall back to a Cloudinary-generated poster, never an empty black frame.
- Always expose play/pause, mute/unmute when audio exists, duration and a text alternative or caption where supplied.

## Motion

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-base: 320ms;
  --dur-long: 480ms;
}
```

- Page transition · short opacity crossfade; never delay navigation for choreography.
- First viewport · one orchestrated entrance, completed within roughly 500ms.
- Media reveal · opacity plus a maximum 16px translate. After the opening sequence, the page settles.
- Hover · animate only `transform`, `opacity`, `color`, `background-color` or `border-color`; never use `transition-all`.
- Scrolling · native. No scroll hijacking, cursor follower or parallax.
- Reduced motion · remove spatial movement and autoplay previews; use opacity-only transitions no longer than 150ms.

## Navigation

- Desktop uses a compact edge-aligned header: mark/wordmark left; Work, Services, Contact right.
- Home is not repeated as a text link when the wordmark already performs that action.
- Blog is not part of the primary navigation until rebuilt on the new architecture.
- The language control is visually quieter than route navigation and must never split onto two lines.
- Header may switch between paper and navy modes according to the current frame, but geometry remains stable.
- Mobile uses a full-width menu sheet with three primary destinations and language control. Minimum target size is 44×44px.
- Current-route state uses a rule or weight change, not color alone.
- Focus rings appear instantly and remain visible on both paper and navy surfaces.

## CTA voice

- Primary · navy rectangular fill, paper text, compact arrow, `--radius-control`.
- Secondary · text link with a directional rule or arrow; no outlined pill.
- Preferred copy · `View work`, `See the project`, `Start a project`, `Send inquiry`.
- Avoid · `Learn more`, `Get started`, multiple competing CTAs and promotional exclamation marks.
- Primary and adjacent form controls share a minimum 44px height.
- Every CTA supports default, hover, focus, active, disabled, loading, error and success where applicable.

## Section headings

- Section headings are left-biased and attached to the content they introduce.
- Use one display heading plus an optional short Antonio lede.
- Section numbering is off by default. It is allowed only for an actual project sequence or ordered process.
- No hanging label-left / headline-right template pattern.
- Navy rules may punctuate a heading, but animated underlines are not a site-wide motif.

## Project entries

- A project entry is a media frame plus credits, not a rounded card.
- Title, client and project type appear in a compact caption band adjacent to or below media.
- Work entries vary by intrinsic ratio and editorial priority:
  - cover/featured landscape · 7–8 columns;
  - standard landscape · 6 columns;
  - portrait/reel · 4 columns;
  - a lone project · 12-column feature;
  - mobile · full width.
- Do not use identical heights, identical overlays or service pills on every entry.
- `is_featured` may promote a project to a larger span on Home; it does not add a “Featured” badge.
- Keyboard focus reveals the same title/action information as hover.

## Project case studies

### Opening

1. Project title is the H1.
2. Client, date, project type and services form a restrained credit line.
3. Hero selection follows the deterministic media rules below.
4. Short description acts as the lede; full description appears only when it adds narrative.

### Deterministic composition

- Sort all ready media by `sort_order`.
- Hero priority · `media_role = hero` → `is_cover` → first ready medium.
- Listing cover priority · `is_cover` → hero → first ready medium.
- `media_role = behind_the_scenes` forms a clearly labelled closing chapter when present.
- `media_role = reel` uses the vertical-reel treatment.
- `is_featured` gives a medium one larger span or a full-bleed break; it never changes source order.
- Intrinsic ratio determines layout class:
  - portrait `< 0.8` · 4/12 or paired portrait;
  - near-square `0.8–1.2` · 5/12 or 6/12;
  - landscape `1.2–1.9` · 7/12 or 8/12;
  - ultra-wide `> 1.9` · 12/12.
- If metadata is missing, default to contained 6/12; never guess a dramatic crop.
- Adjacent compatible media may form a pair. Order remains DOM/source order for accessibility.

### Content variants

- Images only · alternate contained pairs and selected wide frames.
- Video only · poster-led sequence; one hero may autoplay muted, all remaining videos require play.
- Mixed · alternate still sequences with deliberate video pauses; do not cluster all formats automatically.
- One asset · one strong hero, credits, narrative and contact close. Do not repeat the asset to manufacture length.
- Large gallery · lazy-load below the opening; group by role and ratio while preserving `sort_order`.

## Footer

- A large MTK wordmark or mark closes the edit.
- The brand line may appear here only if it was not used prominently on Home.
- Include direct contact and approved social channels, followed by a restrained legal line.
- Avoid a generic four-column sitemap.
- The footer is either paper with a navy rule or a full navy closing frame; do not add a gradient.

## Empty and partial content

- No projects · show an honest typographic statement and contact route. No fake projects or stock placeholders.
- One project · use it as a full-width editorial feature.
- Two to four projects · alternate proportions with generous pauses; do not leave an obviously incomplete grid row.
- Project without media · it remains excluded from public Work even if accidentally published; surface a non-public data warning during implementation.
- Missing cover · use hero, then first ready media. If none exists, omit the project from visual listings.
- Missing description · credits and media may carry the page; never generate filler copy.
- Broken media · preserve layout with a neutral error surface and omit autoplay/retry loops from the public experience.

## Responsive system

### 320px

- 16px gutter, one media column, compact wordmark and 44px controls.
- Display type uses the long-heading token when needed and may wrap aggressively.
- Project credits stack; no two-line clickable labels.

### 375px and 414px

- Maintain the four-column grid; increase breathing room rather than font scale first.
- Portrait and landscape media both occupy full content width.
- Filters, if needed, use an accessible disclosure rather than a horizontally scrolling chip rail.

### 768px

- Eight-column grid.
- Portrait pairs and 3/5 editorial splits become available.
- Navigation may switch to desktop only when every label remains on one line.

### Desktop

- Twelve-column composition; asymmetric media spans and sticky project credits are allowed.
- Hover enhancements apply only within `@media (hover: hover)`.

### Large desktop

- Text widths stop growing.
- Full-bleed media may grow to 1920px; contained media stops at 1536px.
- Additional width creates margin and scale contrast, not more columns of tiny projects.

Global responsive rules:

- `html` and `body` use `overflow-x: clip`, never `hidden` as an overflow patch.
- No required interaction is hover-only.
- Touch targets are at least 44×44px.
- Display headings use `min-width: 0` and `overflow-wrap: anywhere`.

## Accessibility and semantic structure

- Exactly one H1 per route. H2s introduce real narrative sections; H3s subdivide them.
- Project title is the case-study H1; client name is supporting text, not a competing heading.
- `alt_text` is used for meaningful images. Decorative logo treatments use empty alt text only when an adjacent accessible brand name exists.
- Captions come from `caption`; alt text and captions are not interchangeable.
- Videos require a meaningful poster and accessible title. Captions/transcripts should be added when spoken content matters.
- Filters use native controls or fully keyboard-accessible disclosure patterns.
- Focus style is visible at 2px minimum with 2px offset and never animated.
- Form errors state what failed and how to correct it; color is never the only signal.

## Data → design mapping

| Supabase field | Design responsibility |
|---|---|
| `projects.client_id → clients.name` | Project credit and work-index caption |
| `projects.title` | Project H1 and primary work label |
| `short_description` | Work lede and concise index context |
| `description` | Optional case-study narrative |
| `project_type` | Chooses image-led, video-led or mixed composition; not a decorative badge requirement |
| `project_date` | Project credit; format by locale |
| `services` | Compact credit list and optional Work filtering |
| `instagram_url` | Contextual external link near project close |
| `external_url` | `Visit project` action when genuinely relevant |
| `is_featured` | Home inclusion and larger editorial priority |
| `status` | Only `published` projects appear publicly |
| `project.sort_order` | Featured/Home and Work ordering |
| `media_type` | Image element or accessible video player |
| `is_cover` | Primary listing image/poster |
| `media_role = hero` | Case-study opening medium |
| `gallery` | Main ordered media sequence |
| `reel` | Vertical 9:16 treatment |
| `behind_the_scenes` | Optional closing chapter |
| `media.is_featured` | One larger span/full-bleed break without reordering |
| `media.sort_order` | Canonical DOM and visual sequence |
| `caption` | Visible editorial caption |
| `alt_text` | Image alternative text; never fabricated |
| `thumbnail_url` | Video poster and lightweight preview |
| `width / height` | Deterministic ratio class and grid span |
| `processing_status` | Only ready media is public |

## Public page strategy

### Home `/`

- Opening frame: MTK position or the four-word brand construct in controlled display type.
- Work appears immediately after the first frame.
- Featured projects form a changing reel driven by Supabase, not a fixed three-card module.
- One concise studio-position section may use the “cool agency” line.
- Services appear as a short index linking to `/services`, not a complete grid.
- Close with direct contact and the masthead footer.

### Work `/work`

- Server-rendered published-project index.
- Featured/cover media dominates; filters stay secondary and appear only when the catalogue justifies them.
- Layout handles one, few or many projects without fake placeholders.
- Each entry links to a real semantic route `/work/[slug]`.

### Project `/work/[slug]`

- Art-directed but deterministic from project and media metadata.
- Hero, credits, lede, ordered media narrative, optional BTS chapter and contact close.
- No modal/panel dependency and no database-record appearance.

### Services `/services`

- Editorial narrative using MTK’s real service entities and approved descriptive copy.
- Alternate concise prose with relevant published work when available.
- Do not add generic icons merely to fill space.

### Contact `/contact`

- One proposition, one compact form, approved social/contact channels.
- Existing Formspree behavior may remain until a separate functional decision changes it.
- Provide visible loading, success and failure states without celebratory effects.

## Site architecture decision

```text
/
/work
/work/[slug]
/services
/contact
```

Blog decision · **REBUILD LATER**. Remove it from the future primary navigation while it depends on Airtable. Do not delete the existing routes until a separate approved retirement task. If editorial publishing returns, define a Supabase-backed content model before redesigning `/blog`.

## Legacy component disposition

### REUSE

- Existing MTK logos and favicon assets, after confirming the correct master logo.
- The factual brand lines and useful bilingual copy.
- Header/Footer responsibilities and locale affordance, not their current styling.
- Formspree submission behavior, provisionally.
- Framer Motion dependency, with a substantially reduced motion vocabulary.
- Supabase project/media model and Cloudinary delivery metadata.

### REDESIGN

- `Header` · edge-aligned navigation, stable geometry, accessible mobile sheet.
- `Footer` · masthead close instead of a three-column utility footer.
- `HeroSection` · opening frame with fewer CTAs and no background ornament competing with work.
- `FeaturedWorkSection` · Supabase-driven photographic reel.
- `ServicesSection` and Services page · editorial narrative instead of equal service/icon blocks.
- `ContactSection` · dedicated `/contact` route and stronger form states.
- Portfolio index · irregular Work composition and semantic project routes.

### RETIRE LATER

- `/portfolio?project=slug` panel behavior after `/work/[slug]` is validated.
- Airtable public project/blog APIs and mock-project fallbacks after the new public data layer is complete.
- Decorative background components whose only role is gradients/path ornament.
- Repeated animated underlines, glass cards, uniform rounded cards and universal fade-up observers.
- Blog links from primary navigation while the blog remains Airtable-backed.

Do not delete any legacy file during design-system or first-page implementation.

## Exports

These exports are documentation only in this phase. The current repository uses Tailwind v3; do not paste the Tailwind v4 block into production without a separate implementation decision.

### `tokens.css` source

```css
/* Hallmark · genre: editorial showreel · tone: cinematic, youthful, intentionally imperfect · anchor: MTK navy · fingerprint: marquee-showreel + photographic reel */
/* Hallmark · pre-emit critique: P5 H5 E4 S5 R5 V5 · design-system: design.md · designed-as-app */
:root {
  --brand-white: oklch(100% 0 0);
  --brand-black: oklch(0% 0 0);
  --brand-gray: oklch(63.01% 0.008 267.3);
  --brand-navy: oklch(25.17% 0.0956 267.3);

  --color-paper: oklch(98.4% 0.004 267.3);
  --color-paper-2: oklch(95.5% 0.008 267.3);
  --color-paper-3: oklch(91% 0.012 267.3);
  --color-ink: oklch(10.8% 0.016 267.3);
  --color-ink-2: oklch(23% 0.025 267.3);
  --color-rule: oklch(82% 0.01 267.3);
  --color-rule-strong: oklch(63.01% 0.008 267.3);
  --color-muted: oklch(48% 0.012 267.3);
  --color-accent: var(--brand-navy);
  --color-accent-ink: var(--color-paper);
  --color-focus: oklch(58% 0.18 260);
  --color-error: oklch(58% 0.19 27);
  --color-success: oklch(58% 0.12 153);
  --color-scrim: oklch(9% 0.02 267.3 / 0.68);
  --color-scrim-soft: oklch(9% 0.02 267.3 / 0.34);
  --color-hero-scrim: oklch(9% 0.02 267.3 / 0.52);

  --font-display: "Bebas Neue Cyrillic", "Bebas Neue", sans-serif;
  --font-body: "Antonio", sans-serif;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  --space-4xl: 8rem;
  --space-5xl: 12rem;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --text-lede: clamp(1.25rem, 1.08rem + 0.85vw, 1.75rem);
  --text-h3: clamp(1.75rem, 1.35rem + 1.6vw, 3rem);
  --text-h2: clamp(2.75rem, 1.85rem + 4vw, 6rem);
  --text-display: clamp(4rem, 2rem + 8vw, 10rem);
  --text-display-long: clamp(2.75rem, 1.8rem + 5vw, 7rem);
  --text-showreel: clamp(3.4rem, 8.2vw, 7.5rem);
  --text-hero-mobile: clamp(3.2rem, 17vw, 6rem);
  --text-hero-desktop: clamp(4.5rem, 8vw, 9rem);
  --text-manifesto: clamp(3.25rem, 7.8vw, 8.5rem);
  --text-discipline: clamp(2.25rem, 6vw, 6rem);
  --text-studio-es: clamp(2.5rem, 4.7vw, 6rem);
  --leading-display: 1.02;
  --leading-heading: 0.96;
  --leading-body: 1.55;
  --tracking-display: 0.01em;
  --tracking-label: 0.09em;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-base: 320ms;
  --dur-long: 480ms;

  --rule-hair: 1px;
  --rule-strong: 2px;
  --radius-media: 0;
  --radius-control: 0.125rem;
  --radius-pill: 999px;
  --page-gutter: clamp(var(--space-sm), 4vw, var(--space-2xl));
  --header-height: 4.75rem;
  --z-base: 1;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 400;
}
```

### Tailwind v4 `@theme` portability export

```css
@theme {
  --text-hero-mobile: clamp(3.2rem, 17vw, 6rem);
  --text-hero-desktop: clamp(4.5rem, 8vw, 9rem);
  --text-manifesto: clamp(3.25rem, 7.8vw, 8.5rem);
  --text-discipline: clamp(2.25rem, 6vw, 6rem);
  --text-studio-es: clamp(2.5rem, 4.7vw, 6rem);
  --color-paper: oklch(98.4% 0.004 267.3);
  --color-paper-2: oklch(95.5% 0.008 267.3);
  --color-paper-3: oklch(91% 0.012 267.3);
  --color-ink: oklch(10.8% 0.016 267.3);
  --color-ink-2: oklch(23% 0.025 267.3);
  --color-rule: oklch(82% 0.010 267.3);
  --color-muted: oklch(48% 0.012 267.3);
  --color-accent: oklch(25.17% 0.0956 267.3);
  --color-focus: oklch(58% 0.18 260);
  --font-display: "Bebas Neue Cyrillic", "Bebas Neue", sans-serif;
  --font-body: "Antonio", sans-serif;
  --spacing-3xs: 0.25rem; --spacing-2xs: 0.5rem; --spacing-xs: 0.75rem;
  --spacing-sm: 1rem; --spacing-md: 1.5rem; --spacing-lg: 2rem;
  --spacing-xl: 3rem; --spacing-2xl: 4rem; --spacing-3xl: 6rem;
  --spacing-4xl: 8rem; --spacing-5xl: 12rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --radius-control: 0.125rem;
}
```

### DTCG `tokens.json` portability export

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(98.4% 0.004 267.3)", "$type": "color" },
    "paper-2": { "$value": "oklch(95.5% 0.008 267.3)", "$type": "color" },
    "ink": { "$value": "oklch(10.8% 0.016 267.3)", "$type": "color" },
    "muted": { "$value": "oklch(48% 0.012 267.3)", "$type": "color" },
    "accent": { "$value": "oklch(25.17% 0.0956 267.3)", "$type": "color" },
    "focus": { "$value": "oklch(58% 0.18 260)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Bebas Neue Cyrillic, Bebas Neue, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "Antonio, sans-serif", "$type": "fontFamily" }
  },
  "size": {
    "hero-mobile-max": { "$value": "6rem", "$type": "dimension", "$description": "Fixed portability ceiling; use CSS clamp from tokens.css for responsive type." },
    "hero-desktop-max": { "$value": "9rem", "$type": "dimension" },
    "manifesto-max": { "$value": "8.5rem", "$type": "dimension" },
    "discipline-max": { "$value": "6rem", "$type": "dimension" },
    "studio-es-max": { "$value": "6rem", "$type": "dimension" },
    "body": { "$value": "1.125rem", "$type": "dimension" }
  },
  "space": {
    "sm": { "$value": "1rem", "$type": "dimension" },
    "md": { "$value": "1.5rem", "$type": "dimension" },
    "lg": { "$value": "2rem", "$type": "dimension" },
    "xl": { "$value": "3rem", "$type": "dimension" },
    "2xl": { "$value": "4rem", "$type": "dimension" },
    "3xl": { "$value": "6rem", "$type": "dimension" }
  },
  "duration": {
    "micro": { "$value": "120ms", "$type": "duration" },
    "short": { "$value": "220ms", "$type": "duration" },
    "long": { "$value": "480ms", "$type": "duration" }
  }
}
```

### shadcn/ui adapter

This adapter is included for portability only. Do not apply it to the existing admin theme as part of the public redesign.

```css
:root {
  --background: 98.4% 0.004 267.3;
  --foreground: 10.8% 0.016 267.3;
  --card: 95.5% 0.008 267.3;
  --card-foreground: 10.8% 0.016 267.3;
  --popover: 98.4% 0.004 267.3;
  --popover-foreground: 10.8% 0.016 267.3;
  --primary: 25.17% 0.0956 267.3;
  --primary-foreground: 98.4% 0.004 267.3;
  --secondary: 91% 0.012 267.3;
  --secondary-foreground: 23% 0.025 267.3;
  --muted: 82% 0.010 267.3;
  --muted-foreground: 48% 0.012 267.3;
  --accent: 25.17% 0.0956 267.3;
  --accent-foreground: 98.4% 0.004 267.3;
  --destructive: 50% 0.19 27;
  --destructive-foreground: 98.4% 0.004 267.3;
  --border: 82% 0.010 267.3;
  --input: 82% 0.010 267.3;
  --ring: 58% 0.18 260;
  --radius: 0.125rem;
}
```

## Implementation guardrails

- Read this file before every public-page implementation.
- Keep `/admin` visually and technically outside this system unless separately authorized.
- Public pages read only published Supabase projects and ready Cloudinary media.
- Do not reintroduce Airtable compatibility, mock project data or Airtable media URLs.
- Do not implement a page-specific palette or font override without amending this document first.
- Do not delete legacy public code until its replacement route passes manual review.
- Manual visual QA is required at 320, 375, 414, 768, desktop and large desktop after each page implementation.
