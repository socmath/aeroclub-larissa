import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { GTM_CONTAINER_ID } from './analytics.config';
import { ConsentService } from './consent.service';

const ID = 'GTM-TEST123';
const gaScripts = () => document.head.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
const consentCommands = () =>
  (window.dataLayer ?? [])
    .map((e) => Array.from(e as ArrayLike<unknown>))
    .filter((a) => a[0] === 'consent')
    .map((a) => [a[1], (a[2] as Record<string, string>)['analytics_storage']]);

function setup(measurementId = ID) {
  TestBed.configureTestingModule({ providers: [{ provide: GTM_CONTAINER_ID, useValue: measurementId }] });
  const consent = TestBed.inject(ConsentService);
  TestBed.inject(AnalyticsService);
  return consent;
}

describe('consent + analytics', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    gaScripts().forEach((s) => s.remove());
    delete window.dataLayer;
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  it('shows the banner and loads nothing until the visitor decides', () => {
    const consent = setup();
    TestBed.tick();

    expect(consent.bannerVisible()).toBe(true);
    expect(gaScripts().length).toBe(0);
  });

  it('loads Tag Manager once after consent, with consent updated before it loads', () => {
    const consent = setup();
    consent.grant();
    TestBed.tick();

    expect(gaScripts().length).toBe(1);
    expect(consentCommands()).toEqual([
      ['default', 'denied'],
      ['update', 'granted'],
    ]);
    expect(consent.bannerVisible()).toBe(false);
    expect(JSON.parse(localStorage.getItem('cookieConsent')!).choice).toBe('granted');
  });

  it('does not load Tag Manager when declined', () => {
    const consent = setup();
    consent.deny();
    TestBed.tick();

    expect(gaScripts().length).toBe(0);
    expect(consent.bannerVisible()).toBe(false);
  });

  it('withdrawing consent updates consent to denied and removes _ga cookies', () => {
    const consent = setup();
    consent.grant();
    TestBed.tick();
    document.cookie = '_ga=GA1.1.123; path=/';

    consent.reopen();
    expect(consent.bannerVisible()).toBe(true);
    consent.deny();
    TestBed.tick();

    expect(consentCommands().at(-1)).toEqual(['update', 'denied']);
    expect(document.cookie).not.toContain('_ga=');
  });

  it('ignores an expired stored choice', () => {
    const yearAndADayAgo = Date.now() - 366 * 24 * 60 * 60 * 1000;
    localStorage.setItem('cookieConsent', JSON.stringify({ choice: 'granted', at: yearAndADayAgo }));

    expect(setup().choice()).toBeNull();
  });

  it('stays completely inactive without a container ID', () => {
    const consent = setup('');
    TestBed.tick();

    expect(consent.bannerVisible()).toBe(false);
    expect(consent.analyticsConfigured).toBe(false);
  });
});
