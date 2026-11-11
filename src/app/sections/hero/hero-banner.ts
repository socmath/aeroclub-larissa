import { Component, HostListener, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

const STORAGE_KEY = 'bannerCollapsed';

@Component({
  selector: 'app-hero-banner',
  imports: [MatIconModule, MatIconButton],
  template: `
    <div class="banner-wrapper">
      <div
        class="banner"
        role="region"
        aria-label="Banner"
        [class.collapsed]="collapsed()"
        [attr.aria-expanded]="!collapsed()"
        (click)="onBannerClick()"
      >
        <div
          class="banner-handle"
          role="button"
          tabindex="0"
          aria-label="Εμφάνιση banner"
          title="Εμφάνιση banner"
          (click)="expand($event)"
          (keydown.enter)="expand($event)"
          (keydown.space)="expand($event)"
        >
          <mat-icon>chevron_left</mat-icon>
        </div>

        <div class="banner-content" [attr.inert]="collapsed() ? '' : null">
          <button
            mat-icon-button
            type="button"
            class="btn-close"
            aria-label="Απόκρυψη banner"
            title="Απόκρυψη banner"
            (click)="collapse($event)"
          >
            <mat-icon>close</mat-icon>
          </button>
          <div class="hero-title">ΠΕΤΑΞΤΕ ΜΑΖΙ ΜΑΣ</div>
          <img src="assets/savannah.svg" alt="Savannah Aircraft" class="hero-aircraft-icon" height="96">
          <div class="hero-subtitle">Κάντε το όνειρό σας πραγματικότητα με την Αερολέσχη Λάρισας</div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './hero-banner.scss',
})
export class HeroBanner {
  protected readonly collapsed = signal(readStoredState());

  protected collapse(event: Event): void {
    event.stopPropagation();
    this.setCollapsed(true);
  }

  protected expand(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.setCollapsed(false);
  }

  protected onBannerClick(): void {
    if (this.collapsed()) this.setCollapsed(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.collapsed()) this.setCollapsed(false);
  }

  private setCollapsed(value: boolean): void {
    this.collapsed.set(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // storage may be unavailable (private mode); state simply won't persist
    }
  }
}

function readStoredState(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}
