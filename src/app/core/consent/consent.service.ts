import { Injectable, computed, inject, signal } from '@angular/core';
import { GTM_CONTAINER_ID } from './analytics.config';

export type ConsentChoice = 'granted' | 'denied';

const STORAGE_KEY = 'cookieConsent';
// Ask again after a year, as recommended by data-protection authorities
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Stores the visitor's analytics-cookie choice and controls the visibility of the consent banner. */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  /** Analytics is only offered when a measurement ID is configured */
  readonly analyticsConfigured = inject(GTM_CONTAINER_ID) !== '';

  readonly choice = signal<ConsentChoice | null>(readStoredChoice());
  private readonly reopened = signal(false);

  readonly bannerVisible = computed(
    () => this.analyticsConfigured && (this.choice() === null || this.reopened()),
  );

  grant(): void {
    this.save('granted');
  }

  deny(): void {
    this.save('denied');
  }

  /** Lets the visitor change a previous choice (footer link). */
  reopen(): void {
    this.reopened.set(true);
  }

  private save(choice: ConsentChoice): void {
    this.choice.set(choice);
    this.reopened.set(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
    } catch {
      // storage unavailable: the choice only lasts for this visit
    }
  }
}

function readStoredChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { choice, at } = JSON.parse(raw) as { choice?: unknown; at?: unknown };
    const valid = (choice === 'granted' || choice === 'denied') && typeof at === 'number';
    return valid && Date.now() - at < MAX_AGE_MS ? choice : null;
  } catch {
    return null;
  }
}
