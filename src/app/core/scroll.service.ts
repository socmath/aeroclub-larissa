import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, throttleTime } from 'rxjs';

export const SECTIONS = [
  { id: 'home', label: 'Αρχική' },
  { id: 'about', label: 'Σχετικά' },
  { id: 'weather', label: 'Καιρός' },
  { id: 'links', label: 'Σύνδεσμοι' },
  { id: 'contact', label: 'Επικοινωνία' },
] as const;

/** Tracks scroll position (scrolled header + active section) and scrolls to sections. */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);

  readonly scrolled = signal(false);
  readonly activeSection = signal<string>('home');

  constructor() {
    const win = this.document.defaultView;
    if (!win) return;

    fromEvent(win, 'scroll', { passive: true })
      .pipe(throttleTime(50, undefined, { leading: true, trailing: true }), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.update(win));
  }

  scrollTo(id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.document.defaultView?.history.replaceState(null, '', `#${id}`);
  }

  private update(win: Window): void {
    const y = win.scrollY;
    this.scrolled.set(y > 100);

    let current: string = SECTIONS[0].id;
    for (const { id } of SECTIONS) {
      const el = this.document.getElementById(id);
      if (el && y >= el.offsetTop - 200) current = id;
    }
    this.activeSection.set(current);
  }
}
