# Steven Santos — Personal Website

Personal CV/portfolio site for Steven Santos (CS student at UMass Boston).
Plain HTML/CSS/JS, no build step, no framework, no dependencies.

## Live site & deployment

- **Live URL:** https://stevensantos5610-hub.github.io/personal-website/
- **Repo:** github.com/stevensantos5610-hub/personal-website (SSH remote, key at `~/.ssh/id_ed25519_github`)
- **Hosting:** GitHub Pages, deployed from `main` branch root — pushing to `main` is the entire deploy process (no CI build step). Takes 30–90s to propagate after push.
- **Workflow:** after any edit, commit and push automatically (git add -A equivalent for changed files, commit, push) — the user has explicitly asked for auto-push rather than confirming each time. Only pause before pushing if the user hasn't yet approved this session, or the change is unusually risky.

## Local dev

```bash
python3 -m http.server 8420 --directory .
```
Then preview at `http://localhost:8420`. **Known gotcha:** this server sends no cache headers, so the browser aggressively caches `js/main.js` and `css/styles.css` across reloads even when the files change on disk — a plain reload can silently serve stale JS/CSS. Cache-bust with a query string (`?v=timestamp`) or hard-reload; when testing via automated tooling, fetch with `cache: 'no-store'` and `eval()` the result if a reload alone doesn't pick up changes. This is purely a local-server artifact — real visitors and GitHub Pages' CDN don't have this problem.

## File structure

- `index.html` — single page, all sections
- `css/styles.css` — single stylesheet, organized in commented sections matching page sections (search for `/* ---------- SectionName ---------- */`)
- `js/main.js` — single IIFE, one concern per named block (nav toggle, scroll-reveal, gallery arrows, modals, etc.)
- `assets/images/` — photos + custom SVGs (brand mark, hero background, decorative patterns)
- `assets/video/` — two muted, controls-enabled `<video>` clips
- `assets/resume/Steven_Santos_Resume.pdf` — served via the résumé preview modal (not a direct download link)

## Design system

- **Palette:** Salvadoran flag blue (`--color-primary: #1749B0`) + white/off-white + a nature-green accent (`--color-accent-green: #2F6E4F`) — deliberate nod to the user's Salvadoran heritage, not generic tech-portfolio blue.
- **Typography:** Fraunces (display/serif, used italic for the hero name) + Inter (body/UI).
- **Layout language:** editorial/magazine style inspired by iasoglobal.com — asymmetric grids, hairline rules, uppercase tracked-out kickers, arrow-links (`.link-arrow`) instead of heavy buttons for secondary actions, tall serif statement headlines. Not the original cinematic-scroll-story direction (logartis.info) — that was superseded early on.
- **Brand mark:** `torogoz-mark.svg`, a simplified line-art take on the Torogoz (El Salvador's national bird) — used as the logomark/favicon.
- **Reusable patterns:** `.link-arrow` (text link + arrow SVG, color-transition hover), `.tag`/`.tag-list` (pill chips), `.exp-item`/`.exp-summary` (experience entries with an italic intro line + bullet list), `.media-item`/`.fullscreen-btn` (photo grid items with lightbox trigger), modal pattern (`hidden` attribute + `[data-close]` delegated close handlers + Escape key — see `resumeModal` and `photoLightbox` in main.js for the template if adding another modal).

## Content facts (avoid re-asking the user for these)

- Contact: Steven.Santos5610@gmail.com · +1 (857) 272-7314 · Boston, MA
- LinkedIn: linkedin.com/in/steven-santos-8b6182276
- Handshake: app.joinhandshake.com/profiles/558u2bbw
- Current role: Administrative Operations Intern, ABCD (Action for Boston Community Development), IT Services — Jun 2026–Present. **Update this when the internship ends** — the user said they'll report the change; shift copy from present tense to past tense and set an end date in `.exp-date`.
- Other experience: Santos Hardwood Floors and Construction (family business, 20+ years, Everett MA) · Digital Ready tech apprenticeship (Roxbury, MA, Jun–Aug 2023)
- Credential: ADAGE Grant Certificate (verified badge linked in About section)

## Voice/tone conventions (established through heavy iteration — don't regress)

The user explicitly asked to "humanize" the copy at one point — the site had drifted toward AI-polished marketing phrasing (rule-of-three constructions, "built to last," "let's build something together," X-raised-Y-rooted parallelism) and was rewritten to sound like the user actually talking: plain, first-person, concrete, contractions okay. **Keep new copy in that register** — avoid corporate-smooth phrasing, clichéd portfolio-site lines, and overly poetic headline constructions. Resume-derived bullet lists (STAR format) are the one exception — those intentionally stay in formal resume register since that's what recruiters expect from an accomplishments list.

## Mobile/cross-browser notes

- Photo "fullscreen" uses a custom lightbox modal, **not** the Fullscreen API — iOS Safari doesn't support `requestFullscreen()` on `<img>` elements (only `<video>`), so the raw API silently fails on iPhones. Don't revert this to `element.requestFullscreen()`.
- Touch targets should stay ≥44×44px (Apple/Google minimum) — this was previously too small (32px) on the photo expand buttons and was corrected.
