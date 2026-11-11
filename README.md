# Αερολέσχη Λάρισας

Single-page website for Aeroclub Larissa, built with Angular 22 and Angular Material, and deployed to [Fly.io](https://fly.io) as a static site served by nginx.

## Stack

- Angular 22 (standalone components, signals, zoneless) + Angular Material 22
- Fonts and icons are self-hosted (`@fontsource/*`), no third-party CDNs
- Weather data from the [Open-Meteo](https://open-meteo.com) API
- nginx (Docker) with an SPA fallback in production

## Requirements

Angular 22 needs **Node `^22.22.3 || ^24.15.0 || >=26`**. With nvm: `nvm use` (see `.nvmrc`).

## Development

```bash
npm install
npm start          # dev server on http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build -> dist/aeroclub-larissa/browser
```

## Project structure

```
src/app/
├── core/          scroll service (active section, scrolled header)
├── layout/        header, footer
├── pages/home/    the single page, composed of sections
├── sections/      hero (+ banner), about (+ photo lightbox), weather, links, contact
└── shared/        link list, external-link directive, scroll reveal directive
public/assets/     logos, images, hero video
```

Content lives next to the components that render it: gallery photos in `sections/about/gallery.data.ts`, link categories in `sections/links/links.ts`, contact details in `sections/contact/contact.ts`.

## Deploying to Fly.io

The app is configured in `fly.toml` (`aeroclub-larissa`); the `Dockerfile` builds the Angular app and serves it with nginx on port 8080 (`nginx.conf` handles SPA routing and caching).

```bash
fly auth login
fly deploy
```

Test the production image locally:

```bash
docker build -t aeroclub-larissa .
docker run --rm -p 8080:8080 aeroclub-larissa   # http://localhost:8080
```
