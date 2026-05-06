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

- **Netlify** (primary, per README badge) — auto-builds on push. Forms use `useNetlifyForm = true` in `config.toml`. Netlify CMS lives at `/admin/` (`static/admin/config.yml`, git-gateway backend pointing to `main`).
- **GitHub Pages** via `.github/workflows/gh-pages.yml` — builds with `hugo --minify` and pushes `./public` to the `gh-pages` branch.

`/public/` and `/resources/_gen/` are gitignored — never commit build output.

## Architecture

### Theme override pattern (important)
Hugo resolves files from the project root first, falling back to `themes/mattetom/`. Almost every layout in `layouts/` shadows a same-named file in the theme. **When changing a layout, edit the project copy in `layouts/`, not the theme submodule.** If a needed file only exists in the theme, copy it into `layouts/` before editing. The theme submodule should generally be left clean so it can be updated from upstream.

The same override applies to `assets/scss/` and `assets/js/` (project) shadowing `themes/mattetom/assets/`.

### Content model
Section pages on the homepage are driven by **data files**, not Markdown:

- `data/*.yml` (e.g. `aboutSection.yml`, `portfolioSection.yml`, `serviceSection.yml`, `skillSection.yml`, `resumeSection.yml`, `blogSection.yml`, `testimonialSection.yml`, `hero.yml`) — each has an `enable` flag and content for the corresponding partial.
- `layouts/index.html` just composes partials (`hero.html`, `aboutSection.html`, …) which read from `.Site.Data.*`.

So to change copy on the landing page, edit YAML in `data/`, not HTML.

The Markdown content under `content/` populates these section types:

- `content/blog/` — articles (rendered via `layouts/blog/`).
- `content/portfolio/` — case studies; the homepage portfolio grid lists `Site.RegularPages` filtered by `Type "portfolio"` in reverse order. Each entry uses front matter fields `thumbnail`, `service`, `client`, `screenshots`, `shortDescription`, `challenge`, `solution`.
- `content/privacy/` — privacy policies for shipped apps (`layouts/privacy/single.html`).
- `content/ccard/` — account deletion / app support pages (`layouts/ccard/single.html`).
- `content/contact/`, `content/posts/` — minor.

### Static assets and app landing pages
`static/` is copied verbatim. It contains both site assets (`images/`, `plugins/`) and **standalone app landing/support sites** served as subpaths (`gestionale-corsi-associazioni/`, `auto-meet-screen-share/`, `wheel_of_fortune/`, `teswe/`, `yaspaint/`). These are independent HTML/CSS bundles — not Hugo-rendered — so editing them does not require rebuilding layouts. `static/_headers` configures Netlify response headers (e.g. Tesla `.well-known` MIME type).

### Config touchpoints
`config.toml` holds site metadata, the homepage anchor menu, social links, Google Analytics ID, and Netlify form toggle. The `[params]` block is read throughout partials.
