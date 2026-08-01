# Steven Santos — Personal Website

A single-page CV site: hero → short personal story → about → experience →
skills → projects → contact. Plain HTML/CSS/JS, no build step required.

## Run it locally

Just open `index.html` in a browser, or serve it so relative links behave
exactly like they would on a host:

```bash
python3 -m http.server 8420 --directory .
```

Then visit `http://localhost:8420`.

## Swap in your own content

### Photos
- **Hero background**: live — `assets/images/hero.jpg` (Lake Coatepeque, El
  Salvador). To swap it for a different photo, just replace that file (keep
  the filename, or update the `src` on `<img class="hero-bg" ...>` in
  `index.html`). `assets/images/mountain-hero.svg` is the original generated
  placeholder, kept in the folder as a fallback if you ever want it back.
- **Profile photo**: still a placeholder — in `index.html`, find
  `.photo-frame` inside the About section and replace the
  `<span class="photo-initials">SS</span>` with an
  `<img src="assets/images/profile.jpg" alt="Steven Santos">` (drop your file
  in `assets/images/` first). You can keep or remove the rounded-rectangle
  frame styling in `css/styles.css` (`.photo-frame`).

### Links
The Contact section links to LinkedIn and Handshake — update the `href`
values in `index.html` (`.social-links`) any time either URL changes.

### Brand mark
`assets/images/torogoz-mark.svg` is a simplified line-art take on the
Torogoz — El Salvador's national bird — used as your logomark (nav, favicon,
footer). Recolor it anywhere via CSS since it uses `stroke="currentColor"`.

### Colors & type
All design tokens live at the top of `css/styles.css` under `:root`
(`--color-primary`, `--font-display`, spacing scale, etc.) — change them
once and they cascade everywhere.

## Deploying
Since it's plain static files, any static host works: GitHub Pages,
Netlify, Vercel, or Cloudflare Pages — just point them at this folder.
