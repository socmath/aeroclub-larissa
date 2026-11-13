import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { GTM_CONTAINER_ID } from './analytics.config';
import { ConsentService } from './consent.service';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Loads Google Tag Manager only after consent, using Consent Mode v2.
 * Consent defaults to "denied"; it is switched to "granted" before the container loads, so tags
 * configured in GTM (e.g. GA4) respect the visitor's choice. Withdrawing consent flips it back.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly consent = inject(ConsentService);
  private readonly containerId = inject(GTM_CONTAINER_ID);
  private loaded = false;

  constructor() {
    if (!this.containerId) return;

    this.pushConsent('default', 'denied');

    effect(() => {
      const choice = this.consent.choice();
      if (choice === 'granted') {
        this.pushConsent('update', 'granted');
        this.load();
      } else if (choice === 'denied') {
        this.pushConsent('update', 'denied');
        this.deleteAnalyticsCookies();
      }
    });
  }

  private pushConsent(command: 'default' | 'update', state: 'granted' | 'denied'): void {
    const win = this.document.defaultView;
    if (!win) return;

    win.dataLayer ??= [];
    // GTM only recognises gtag-style commands pushed as the raw `arguments` object
    (function (..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer!.push(arguments);
    })('consent', command, {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: state,
    });
  }

  private load(): void {
    const win = this.document.defaultView;
    if (!win || this.loaded) return;
    this.loaded = true;

    win.dataLayer ??= [];
    win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(this.containerId)}`;
    this.document.head.appendChild(script);
  }

  private deleteAnalyticsCookies(): void {
    const host = this.document.location.hostname;
    const parts = host.split('.');
    const domains = new Set<string | undefined>([undefined, host, `.${host}`]);
    for (let i = 1; i < parts.length - 1; i++) domains.add(`.${parts.slice(i).join('.')}`);

    const names = this.document.cookie
      .split(';')
      .map((c) => c.split('=')[0].trim())
      .filter((name) => name === '_gid' || name.startsWith('_ga'));

    for (const name of names) {
      for (const domain of domains) {
        const domainPart = domain ? `; domain=${domain}` : '';
        this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
      }
    }
  }
}
