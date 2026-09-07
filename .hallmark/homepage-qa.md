# THE MTK CUT — homepage refinement

Validated locally, September 3–4, 2026. This is a refinement of the approved visual language, not a new site redesign. No CMS, database schema, admin, upload, authentication, deployment configuration or integration code was changed.

## Audit and component ownership

Before edits, inspected the complete homepage, public styles and tokens, responsive rules, animations, project/media adapter and queries, routing, existing public components, public/assets/branding candidates, SVG/PNG files and metadata. Ran the existing site and inspected all seven requested viewport sizes before implementation.

| Responsibility | Implementation |
| --- | --- |
| Header / navigation | `components/public/PublicHeader.tsx`, `PublicChrome.module.css` |
| Official mark | `components/public/BrandLogo.tsx`, `lib/site-config.ts` |
| Hero typography / stage | `components/public/ShowreelHero.tsx`, `app/home.module.css` |
| Media lifecycle / controls | `ViewportVideo.tsx`, `hooks/use-viewport-video.ts`, `lib/video-policy.ts` |
| Manifesto | `app/page.tsx`, `app/home.module.css` |
| Selected Work | `SelectedWorkReel.tsx`, `lib/work-items.ts` |
| Three Disciplines | `DisciplineIndex.tsx` |
| Built Around the Making / contact ending | `app/page.tsx`, shared viewport video |
| Footer | `PublicFooter.tsx`, `PublicChrome.module.css`, `site-config.ts` |

Preserved: the brand palette and condensed fonts, bilingual routing, the four-line hero, real published project data, existing studio split, final contact proposition, route bodies and integrations. Replaced: font-rendered logo, desktop cover crop, permanent text media controls, old manifesto composition, three-item home limit, static discipline rows and unstructured footer.

## Logo evidence

- `public/mtk-logo-dark.png`: original transparent 500×500 raster master. Actual ink bounds x130/y157, 241×203. Used in header and footer; CSS crops the transparent canvas only, preserves proportional scale and makes the black mark white on navy.
- `public/mtk-media-logo.png`: same artwork with an opaque white canvas. Less suitable for the navy header.
- `favicon.svg` embeds raster artwork; no genuine primary vector logo master was found. App icons are not used as the primary wordmark.
- Existing site attribution was found in `components/footer.tsx`: **Designed by ING. JMDR** with its existing LinkedIn URL. Reused exactly; no invented developer name or expanded role.

## Media inspection and art direction

Both supplied films were opened and their actual media metadata and frames inspected in the browser:

| Film | Intrinsic size | Duration | Treatment |
| --- | --- | --- | --- |
| Hero showreel | 720×1280, 9:16 | 54.262 seconds | Desktop full sharp portrait at right; softly blurred/darkened derived still fills the environment. Independent left typography. |
| Las Terrenas production | 720×1280, 9:16 | 82.614 seconds | Contained portrait footage within the preserved media/dark-copy split. |

The hero shows crew, boats and production activity; important people occupy central/upper regions. The desktop stage preserves the entire source frame instead of cropping it to widescreen. At portrait/mobile/tablet sizes the immersive cover treatment remains, with intentional 60% horizontal positioning. Full-height stage geometry prevents layout shift. Desktop environment is a poster, not a second decoding video.

Hero poster is eager/high priority; native video preload is metadata and source assignment waits for client policy. Production source is absent initially, attached only near the viewport, and pauses offscreen. All media starts muted. Only the hero exposes sound, with exclusive-audio coordination with user-activated project previews. Browser autoplay rejection leaves manual play available. A failed film retains its poster and displays an accessible status. No source files were overwritten.

Work previews mount only after a visitor requests them; moving to another project unmounts the previous preview. Leaving the viewport or hiding the document pauses media. No twenty-video autoplay/decode scenario.

## Scalability and interactions

- `WorkItem[]` presentation adapter preserves identifiers, slugs, media URLs, clients, services, dates, feature flags and order from the existing public data.
- Featured filtering is separate from the full library. If nothing is featured, existing available work remains visible. No arbitrary three-item cap. An optional limit can be supplied by a future curator.
- Native horizontal scroll/snap; next-project edge, count, previous/next buttons, direct index, Arrow keys and Home/End. Normal page scrolling is not hijacked.
- One item has no meaningless progression buttons or index. Empty data has an honest text state.
- Tested real single-item content and temporary 2/5/20-item fixtures in the browser. End reached 20/20, Home returned to 01/20, disabled edge states and zero initial preview videos confirmed. Temporary fixture route was removed; its URL returns 404. No fake content was published.
- Accordion uses native buttons, one expanded panel, aria-expanded/controls, tap/click/keyboard parity and a short mask reveal. Hover shifts the title only; it is not required for access.
- Mobile menu closes with Escape and returns focus to its trigger. Header and footer EN/ES controls preserve the current route. Tested Work → real case study → Services → Contact. No contact form was submitted.

## Visual QA

Inspected rendered views, not just CSS breakpoints. Requested hero viewports: 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900 and 1920×1080. Inspected manifesto, work, disciplines, production, CTA and footer across mobile, tablet, intermediate desktop and large desktop, with EN and ES copy. Additional Hallmark checks at 320, 375, 414 and 1280×800.

- No document-level horizontal overflow in checked sizes; horizontal movement stays inside the reel.
- No header/media-control collision at rest, no clipped four-line hero. Desktop media and headline use separate regions.
- Found and fixed a Spanish `Construido` orphan character; added its own responsive display measure/token.
- Confirmed the original logo and footer regrouping, 44px minimum controls, visible keyboard focus, readable CTA hierarchy and successful project preview playback.
- Fixed a preview startup race exposed during browser tests, and made play/pause intent follow the rendered control when decoding is temporarily suspended.
- Clean fresh browser log after homepage and navigation through Work, project, Services and Contact: no warnings/errors. No missing loaded images or media errors in inspected states. No hydration/duplicate-key warnings.

## Hallmark audit

Pre-emit critique: P5 H5 E4 S5 R5 V5. Passed applicable slop checks for this scoped refinement: no card grid, pills, glass, arbitrary gradients, icon-feature tiles, decorative letters, fabricated metrics, fake browser chrome or blanket fade-up motion. No transition-all or new motion/player dependency. Existing visual direction is deliberately retained by explicit request; a theme rotation would violate the brief.

Color roles remain tokenized. Computed WCAG ratios: paper/navy 15.45:1; paper/ink 19.57:1; muted/paper 6.25:1; focus/paper 4.19:1; focus/paper-2 3.85:1. Focus passes the 3:1 non-text requirement. Text over variable footage has explicit contrast scrims, independent of image color. Reduced-motion CSS disables mask/spatial transitions.

Brief-driven exceptions: navy is a brand surface, not a five-percent accent; official neutral primitives remain valid; the existing macrostructure family is preserved; project titles may wrap as editorial content while control/navigation/CTA labels remain single-line. The hero uses a separate eager poster image instead of a video poster attribute so secondary video sources/posters are not all eagerly requested.

## Validation

- TypeScript: `npx next typegen` followed by `npx tsc --noEmit`. Required because the existing Next config skips build-time type validation. Regenerated route types after removing the fixture route.
- Lint: `npm run lint` — no errors; five existing unused-variable warnings in legacy portfolio/featured-work/chart/toast files, outside this scope.
- Production: `npm run build` — successful. Existing advisory about stale `baseline-browser-mapping`; no dependency churn introduced.
- Automated tests: **19 passing**, covering 0/1/2/5/20/30 projects, curation/order/posters and video policy for visibility, explicit pause/play, reduced motion, Save-Data and hidden tabs.
- Reduced-motion/Save-Data policy was unit tested and CSS reviewed. OS-level preference emulation was not available in the browser tool; no claim of a separate physical-device/OS test.
- This was local Chromium viewport QA, not a cross-browser Safari/Firefox certification. Actual network transfer size/LCP under production CDN/mobile conditions was not benchmarked.

Reproduce the existing-dependency TypeScript tests on Node 20:

```powershell
node -e "const fs=require('fs');const ts=require('typescript');require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);require('./tests/work-items.test.ts');require('./tests/video-policy.test.ts')"
```

## Content still worth supplying

- Exact licensed Bebas Neue Cyrillic webfont files if that precise cut is required; the repository currently falls back to its existing Bebas Neue webfont, with Antonio preserved.
- Genuine vector master if one exists outside the repository; the original PNG is currently used, not a recreated wordmark.
- Approved captions/transcripts if spoken content should be made accessible with sound. None were invented.

No designer name is pending: the existing site credit was found and preserved.

## File inventory for this refinement

Modified existing files:

- `app/page.tsx`
- `app/home.module.css`
- `components/public/ShowreelHero.tsx`
- `components/public/PublicHeader.tsx`
- `components/public/PublicFooter.tsx`
- `tokens.css`
- `design.md`
- `.hallmark/preflight.json`
- `.hallmark/log.json`

Added:

- `components/public/BrandLogo.tsx`
- `components/public/PublicChrome.module.css`
- `components/public/ViewportVideo.tsx`
- `components/public/SelectedWorkReel.tsx`
- `components/public/DisciplineIndex.tsx`
- `hooks/use-viewport-video.ts`
- `lib/site-config.ts`
- `lib/work-items.ts`
- `lib/video-policy.ts`
- `tests/work-items.test.ts`
- `tests/video-policy.test.ts`
- `.hallmark/homepage-qa.md`

Temporary QA route added and removed during testing; not part of the deliverable. Existing untracked repository content was preserved; no commits, branch operations or public deployment were performed.
