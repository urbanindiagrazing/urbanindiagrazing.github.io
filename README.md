# The Urban India Grazing Company — Website

This repository contains the static HTML/CSS/JS website for The Urban India Grazing Company. It's a simple, fast, responsive public website built with plain HTML, CSS and a small amount of JavaScript. The site is suitable to be served from GitHub Pages or any static hosting provider.

## Quick overview

- Live site (GitHub Pages): https://urbanindiagrazing.com
- Primary entry: `index.html`
- Static assets: `assets/` (CSS, JS, images, webfonts)

## Repository structure

- `index.html` — homepage
- `assets/css/` — compiled site CSS
- `assets/js/` — JavaScript utilities and plugins used by the site
- `assets/images/` and top-level `images/` — image assets
- `assets/webfonts/` — Font Awesome font files included for icons
- `urbanindiagrazing.github.io/LICENSE` — project license (see repo for details)

## Local preview

Because this is a static site there is no build system required to preview it. Two simple ways to preview locally:
- Double-click `index.html` to open it in your browser. This works for most layouts, but some features requiring a web server (CORS or fetch) may not work when opened as a `file://` URL.
- Run a lightweight local web server (recommended). From the project root you can use Python or Node tooling:

## Editing the site

- HTML: edit `index.html` and any included partials directly.
- CSS: the site ships with compiled CSS at `assets/css/main.css`.
- JavaScript: edit the scripts in `assets/js/`.
- Images & fonts: update files in `assets/images/`, `images/`, or `assets/webfonts/` and adjust paths in the HTML/CSS where needed.

## Deployment

This repository is already named for GitHub Pages user/organization hosting (`urbanindiagrazing.github.io`). To publish updates:
1. Commit and push changes to the `main` branch.
2. GitHub will automatically serve the site at https://urbanindiagrazing.github.io and at https://urbanindiagrazing.com.

## Troubleshooting

- If styles don't update in the browser, clear cache or perform a hard reload.
- If icons are missing, check `assets/webfonts/` and `assets/css/fontawesome-all.min.css` paths.
- If Sass compilation fails, ensure your Sass binary version is up-to-date and you're running commands from the project root.
