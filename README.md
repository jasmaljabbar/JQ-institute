# JG Institute of AI & HI — Website

Static multi-page website. Pure **HTML5 + CSS3 + vanilla JavaScript**. No build step, no backend, no frameworks. Hosts free on GitHub Pages.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `junior-programs.html` | Junior Discovery Programs (7 programs, ages 4–14) |
| `ai-programs.html` | AI Integrated Programs (4 programs) |
| `gallery.html` | Gallery with filters + lightbox |
| `projects.html` | Project Showcase with filters |
| `careers.html` | Certifications & Careers |
| `admissions.html` | How to join, eligibility, fees, FAQ, enquiry form |
| `contact.html` | Contact details, map, WhatsApp, contact form |

## Structure

```
jg-institute/
├── *.html                  9 pages
├── favicon.svg / favicon.png
├── .nojekyll               tells GitHub Pages to serve files as-is
├── assets/
│   ├── css/style.css       design system (colours, type, components)
│   ├── css/responsive.css  breakpoints: 1200 / 1100 / 1024 / 900 / 680 / 380
│   ├── js/components.js    SITE config + shared header, footer, WhatsApp button
│   ├── js/main.js          menu, scroll reveal, filters, lightbox, tabs, forms
│   ├── js/motion.js        GSAP/Swiper enhancements (hero entrances, parallax, testimonial slider)
│   ├── js/hero-aria.js     home hero: background-video autoplay, typewriter, A.R.I.A quick actions
│   ├── js/icons.js         SVG icon set (<i data-icon="name"></i>)
│   └── images/             illustrations, logo mark, og-image
├── README.md
└── CONTENT-REQUIRED.md     everything still needed from JG Institute
```

## Design (2026 redesign)

Dark theme inspired by modern academy sites: near-black background, orange `#FF6B00` → amber `#FFBB00` accents, **Outfit** font. A matching light theme uses white surfaces and deeper accents (`#D14600` orange) so coloured text stays readable. Home page sections: hero with tool marquee → recognition strip → filterable program cards → why-JG stats → **Meet the Experts** (hover cards + profile modal) → founder's note → life at JG → testimonials carousel → CTA → contact form → FAQ.

Site-wide extras (added by `components.js`, so every page gets them):

- **Book Free Demo modal** — any element with `data-modal="enquiry"` opens it. Add `data-program="Exact program name"` to pre-select a program.
- **Sticky next-batch bar** — text comes from `SITE.nextBatch`. Visitors can close it; it stays closed for that browser session.
- **WhatsApp guidance prompt** — appears after 9 seconds next to the WhatsApp button and can be closed.
- **Programs dropdown** in the header.

**Home page content is partly DEMO data** — see `CONTENT-REQUIRED.md` §6.

### Motion & animation

Animations are an enhancement layer — every page works and shows all content without them.

- **Libraries (CDN, no build step):** GSAP 3.13 + ScrollTrigger on every page, Swiper 11 on the home page only. They load from cdnjs with `defer` and Subresource Integrity hashes. AOS is deliberately not used: the built-in `.reveal` system in `main.js` does the same job with no extra download.
- **`assets/js/motion.js`:** home hero entrance (headline lines rise, the intelligence cube assembles), cube tilt that follows the mouse, inner-page hero entrance (copy staggers in, illustration unmasks), gentle scroll parallax on hero visuals (desktop only), the testimonials Swiper (autoplay pauses on hover/focus and stops once the visitor uses the controls), and the **Meet the Experts** slider — an endless right-to-left loop that moves one card every 3 seconds (change `delay: 2400` + `speed: 600` in `motion.js` to adjust) and pauses while a card is hovered, focused or its profile is open.
- **`assets/js/hero-aria.js` (home only, no libraries):** the hero's background video — a looping, glowing AI-brain animation (`assets/video/hero-brain.webm` + `hero-brain.mp4` fallback, poster `assets/images/hero-brain-poster.jpg`) — autoplays muted as soon as the hero scrolls into view, and pauses when it's off-screen or the tab is backgrounded (`IntersectionObserver` + `visibilitychange`). Visitors with "reduce motion" switched on never get playback, just the poster frame. The video sits `position: absolute` inside `.hero__media` and scrolls with the page like any normal background. While the video is on the page, the character takes the place of the intelligence cube (`.hero__media ~ .hero__grid .cube-wrap` in `style.css`; delete that rule to bring the cube back). The shade behind the copy is `.hero__media::after`. The clip was built from a 190-frame PNG/JPEG sequence with `ffmpeg`, crossfaded at the loop point (`xfade`, ~0.75s overlap) so it plays seamlessly with the native `loop` attribute — no custom frame-stepping JS needed. To swap the clip, re-run the same crossfade-loop `ffmpeg` encode (H.264 MP4 + VP9 WebM) and replace both files plus the poster. The **A.R.I.A band** below the hero types its line once it scrolls into view (any element with `data-typewriter` does this; optional `data-speed` / `data-delay` in ms), fades in its quick-action pills, and the e-mail pill copies `SITE.email` (opening the mail app instead if copying is blocked).
- **`main.js` / CSS:** scroll reveals (add `class="reveal"` to any element; items that enter together are staggered automatically, or set your own delay with `style="--d:.1s"`), section headings that reveal line by line, card spotlight on hover, filter transitions, lightbox transitions, smooth FAQ answers, menu/dropdown cascades and a reading-progress line under the header.
- **Fallbacks:** if a CDN script fails, the hero is shown after 2 seconds and the testimonials fall back to the native swipe carousel and the experts to the normal grid. Visitors with "reduce motion" switched on get a static page (no entrances, parallax or autoplay).

### Meet the Experts

Each mentor is one `<article class="expert">` in `index.html`. Copy a block and edit it. Clicking a card opens a profile modal built from that card:

- `style="--c:var(--orange)"` sets the accent colour; `data-program` sets which program "Book a demo with …" pre-selects.
- `.expert__exp` is the experience badge, `.expert__role` / `.expert__name` / `.expert__cred` / `.expert__skills` are the visible footer, and `.expert__hover` holds the hover pitch (`.expert__tag`, `.expert__hook`, `.expert__proof`).
- `.expert__bio` is hidden on the card and shown only in the modal.
- The cards scroll as a slider automatically (see *Motion & animation*); just add or remove `<article class="expert">` blocks.
- Update the button's `aria-label` to match the name.

## Editing common things

**Contact details (phone, WhatsApp, e-mail, address, social links, next batch date)** — edit the `window.SITE` object at the top of `assets/js/components.js`. Header, footer, WhatsApp button and both forms update everywhere. Social icons appear automatically once a URL is filled in.

**Navigation / footer links** — `NAV` array (items with a 4th element become a dropdown) and footer markup in `assets/js/components.js`.

**Program list in forms** — the `PROGRAMS` object in `assets/js/components.js` fills the modal's program list and any `<select data-programs>`.

**Colours & fonts** — CSS variables in `:root` at the top of `assets/css/style.css` (dark theme), with the light-theme values right below in `:root[data-theme="light"]`. Use the variables (`var(--ink)`, `var(--surface)`, …) rather than fixed colours so both themes keep working.

**Light / dark mode** — the sun/moon button in the header switches theme and the choice is remembered in the browser. First-time visitors get the theme their phone or computer is set to. The starting theme is chosen by the small script in each page's `<head>`; to always start in dark mode, change `matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"` there to `"dark"`.

**Logo** — replace `assets/images/logo-mark.svg` (and `favicon.svg`, `favicon.png`) with the approved logo. The "JG / Institute of AI & HI" wordmark next to it is text in `components.js` (`brand`).

**Images** — every image is a branded placeholder illustration (`.svg`). To replace one, drop a real photo into `assets/images/` (prefer `.webp` or `.jpg`, ~1600px wide, under 300 KB) and change the `src` in the HTML. Keep `width`/`height` and write a real `alt` text.

**Gallery photos** — in `gallery.html`, copy a `<figure class="g-item">` block. `data-cat` must be one of `rubiks puzzle logic memory creativity ai`. Add class `wide` for landscape highlights. Remove the "Photos coming soon" notice once real photos are in.

**Student projects** — `projects.html` contains a commented template. Copy it, set `data-cat` (`websites ai marketing hr python`) and a real link.

**Fees / FAQ** — edit the tables and `<details>` blocks in `admissions.html`.

**Placeholders** — anything wrapped in class `todo` shows a red dashed outline so it's easy to spot. Remove the class once the content is confirmed.

## Forms

GitHub Pages cannot run a server, so forms do **not** store data. On submit, the form validates fields, then:

- **Send on WhatsApp** opens WhatsApp with the enquiry pre-written, addressed to `SITE.whatsapp`.
- **Send by e-mail** opens the visitor's mail app addressed to `SITE.email`.

The visitor presses Send in their app. Want submissions in an inbox without that step? Add a free form service (e.g. Formspree, Web3Forms, Google Forms) later — only the `<form>` tag changes.

Program links such as `admissions.html?program=Kids%20AI%20Discovery%20Program` pre-select the program in the form.

## Run locally

Double-click `index.html`, or for a closer match to GitHub Pages:

```bash
cd jg-institute
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages (free)

1. Create a GitHub account and a new **public** repository, e.g. `jg-institute`.
2. Upload the **contents** of this folder (so `index.html` is at the repository root): *Add file → Upload files*, drag everything in, *Commit changes*.
   Or with git:
   ```bash
   cd jg-institute
   git init && git add . && git commit -m "JG Institute website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/jg-institute.git
   git push -u origin main
   ```
3. Repository → **Settings → Pages** → *Source*: **Deploy from a branch** → Branch **main**, folder **/ (root)** → **Save**.
4. After 1–2 minutes the site is live at `https://<your-username>.github.io/jg-institute/`.

### Custom domain (optional)

1. Settings → Pages → *Custom domain* → enter e.g. `www.jginstitute.in` → Save (GitHub adds a `CNAME` file).
2. At your domain provider add a `CNAME` record: `www` → `<your-username>.github.io`.
3. Tick **Enforce HTTPS** once available.

### After going live

- Change `og:image` in each page `<head>` to the full URL (e.g. `https://www.jginstitute.in/assets/images/og-image.png`) so WhatsApp/Facebook previews show the image.
- Add `<link rel="canonical" href="...">` per page with the final URL.
- Submit the site in Google Search Console and create a Google Business Profile for Ambalavayal.

## Browser support

Latest Chrome, Edge, Firefox, Safari (macOS/iOS) and Android Chrome. Uses CSS `color-mix()` and `<dialog>` (all current browsers). Respects "reduce motion" settings. The reading-progress line and smooth FAQ height use newer CSS (scroll-driven animations, `::details-content`); browsers without it simply skip those effects.
