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

## Cookie consent & Google Tag Manager

Google Tag Manager is **opt-in**: nothing is loaded and no cookies are set until the visitor clicks "Αποδοχή" in the cookie banner. The app uses Consent Mode v2 (all storage `denied` by default, `analytics_storage` set to `granted` on accept), so tags such as GA4 should be configured in GTM to require analytics consent. The choice is stored in `localStorage` for 12 months and can be changed from the "Ρυθμίσεις cookies" link in the footer; withdrawing consent updates Consent Mode to `denied` and deletes the `_ga*` cookies.

Do not paste the GTM snippet into `src/index.html`; the app injects it after consent. The container ID is set in `src/app/core/consent/analytics.config.ts`:

```ts
export const GTM_CONTAINER_ID_VALUE = 'GTM-XXXXXXX';
```

While the ID is empty, the banner and footer link are hidden and no Google script is ever requested.

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
