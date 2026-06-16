# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / portfolio for Matteo Tomasini (https://matteotomasini.com), built with **Hugo (extended)**. The theme is a Git submodule at `themes/mattetom` (a fork of portio-hugo). Content is mostly Italian, mixed with English.

## Commands

```bash
# Initial clone — required to fetch the theme submodule
git submodule update --init --recursive

# Local dev server with live reload (includes drafts)
hugo server -D

# Production build (CI uses --minify)
hugo --minify
```

There is no test suite, linter, or package.json — pure Hugo + SCSS + a small amount of vanilla JS in `assets/js/`.

## Deployment

Two deploy paths are wired up; both fire off `main`:

- **Netlify** (primary — serves matteotomasini.com; site name `matteotomasinicom`, repo linked via `netlify` CLI, `.netlify/` gitignored) — auto-builds on push. Forms use `useNetlifyForm = true` in `config.toml`. Netlify CMS lives at `/admin/` (`static/admin/config.yml`, git-gateway backend pointing to `main`). Serverless functions live in `netlify/functions/` (auto-detected, no `netlify.toml`); redirects in `static/_redirects`, response headers in `static/_headers`.
- **GitHub Pages** via `.github/workflows/gh-pages.yml` — builds with `hugo --minify` and pushes `./public` to the `gh-pages` branch. Secondary deploy: `_redirects` and functions don't work there, only on Netlify.

`/public/` and `/resources/_gen/` are gitignored — never commit build output. **`.DS_Store` is tracked in this repo** — when committing, stage specific files instead of `git add -A`/`.` to avoid pulling in macOS metadata.

## Architecture

### Theme override pattern (important)
Hugo resolves files from the project root first, falling back to `themes/mattetom/`. Almost every layout in `layouts/` shadows a same-named file in the theme. **When changing a layout, edit the project copy in `layouts/`, not the theme submodule.** If a needed file only exists in the theme, copy it into `layouts/` before editing. The theme submodule should generally be left clean so it can be updated from upstream.

The same override applies to `assets/scss/` and `assets/js/` (project) shadowing `themes/mattetom/assets/`.

Icons use **Font Awesome 4** syntax (`<i class="fa fa-android"></i>`), not FA5/6 (`fa-solid`, `fab`).

### Content model
Section pages on the homepage are driven by **data files**, not Markdown:

- `data/*.yml` (e.g. `aboutSection.yml`, `portfolioSection.yml`, `serviceSection.yml`, `skillSection.yml`, `resumeSection.yml`, `blogSection.yml`, `testimonialSection.yml`, `hero.yml`) — each has an `enable` flag and content for the corresponding partial.
- `layouts/index.html` just composes partials (`hero.html`, `aboutSection.html`, …) which read from `.Site.Data.*`.

So to change copy on the landing page, edit YAML in `data/`, not HTML.

The Markdown content under `content/` populates these section types:

- `content/blog/` — articles (rendered via `layouts/blog/`).
- `content/portfolio/` — case studies; the homepage portfolio grid lists `Site.RegularPages` filtered by `Type "portfolio"` in reverse order. Each entry uses front matter fields `thumbnail`, `service`, `client`, `screenshots`, `shortDescription`, `challenge`, `solution`. Portfolio entries also support **`*URL` front-matter fields** (`projectURL`, `playStoreURL`, `appStoreURL`) which `layouts/portfolio/single.html` renders as buttons only when populated. To add a new external link type, follow the same `{{ with .Params.fooURL }}` pattern.
- `content/privacy/` — privacy policies for shipped apps (`layouts/privacy/single.html`).
- `content/ccard/` — account deletion / app support pages (`layouts/ccard/single.html`).
- `content/contact/`, `content/posts/` — minor.

### Static assets and app landing pages
`static/` is copied verbatim. It contains both site assets (`images/`, `plugins/`) and **standalone app landing/support sites** served as subpaths (`gestionale-corsi-associazioni/`, `auto-meet-screen-share/`, `wheel_of_fortune/`, `teswe/`, `yaspaint/`). These are independent HTML/CSS bundles — not Hugo-rendered — so editing them does not require rebuilding layouts. `static/_headers` configures Netlify response headers (e.g. Tesla `.well-known` MIME type).

### Regestio landing + Stripe checkout
`static/gestionale-corsi-associazioni/` is the **Regestio** landing (the Unitre gestionale productized; related portfolio entry `content/portfolio/unitre-gestionale.md`). Also reachable at **`/regestio`** via 301 in `static/_redirects`. The pricing section (`#prezzi`) offers monthly subscription plans: Small 99€ (≤300 soci), Medium 299€ (≤1.000), Large 499€ (≤2.000), Ultra on request (mailto). FAQ and JSON-LD carry the same prices — keep all three in sync when changing them.

Checkout flow: the "Abbonati" buttons POST `{plan}` to `/api/checkout` → `netlify/functions/checkout.mjs` (zero npm deps, calls the Stripe REST API via `fetch`) creates a Checkout Session in `subscription` mode with **inline `price_data`** — prices are defined server-side in the function's `PLANS` map, deliberately no product catalog in Stripe (Stripe still auto-creates ad-hoc Product objects per session; that's expected). Return URLs land on the landing with `?checkout=success|cancel`, handled by a banner script in the page. Requires the **`STRIPE_SECRET_KEY`** env var on Netlify — **as of 2026-06-16 a live `sk_live_…` key: real charges are active** (never commit keys; the publishable key is unused — flow is server-side only). Changing the key = `netlify env:set STRIPE_SECRET_KEY … --context production` + redeploy (`netlify deploy --build --prod`). No webhooks/auto-provisioning: a paid subscription just notifies via Stripe email, instance setup is manual.

Site-wide Netlify forms gotcha: the AJAX submit handler `assets/js/form-handler.js` binds only to `#contact-form`. The main contact form (`layouts/contact/list.html`, Netlify variant) must therefore carry `id="contact-form"` AND an explicit `name="contact"` + hidden `<input name="form-name" value="contact">` + honeypot — otherwise the handler never attaches, there's no on-page confirmation, and submissions silently fail to register (this bit the contact form until 2026-06-16). Submissions email the owner via the site-wide `submission_created` hook.

Demo request form (`#contatti`): a **Netlify form** named `regestio-demo` (`data-netlify="true"`, honeypot `bot-field`), submitted via AJAX (`fetch` POST form-encoded to the page path) with a success/error banner; a mailto is kept as fallback. Submissions email the owner via a pre-existing **site-wide** Netlify notification (`submission_created` hook, `form_id: null` → covers every form) — do NOT add a per-form email hook (the API rejects it as a duplicate). The field literally named `name` becomes the dashboard submission title.

Brand assets: `static/gestionale-corsi-associazioni/brand/` — `icon.svg` + `icon-*.png` (R mark, green tile) and `logo[.svg|.png]` / `logo-white.*` (icon + "Regestio" wordmark, light/dark bg). SVG masters have glyphs converted to paths (DM Serif Display, font-independent). Brand color `#2e8b57`, accent `#0e1f16`. Used for the favicon/apple-touch-icon/og:image and for Stripe branding (icon = `icon-512.png`, logo = `logo.png`).

### Config touchpoints
`config.toml` holds site metadata, the homepage anchor menu, social links, Google Analytics ID, and Netlify form toggle. The `[params]` block is read throughout partials.
