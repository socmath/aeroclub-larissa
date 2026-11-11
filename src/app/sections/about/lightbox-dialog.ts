import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GALLERY_PHOTOS, fullImageUrl } from './gallery.data';

export interface LightboxData {
  index: number;
}

const SWIPE_THRESHOLD_PX = 50;

@Component({
  selector: 'app-lightbox-dialog',
  imports: [MatDialogModule, MatIconButton, MatIconModule],
  template: `
    <div class="lightbox" (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
      <div class="toolbar">
        <span class="counter">{{ index() + 1 }} / {{ photos.length }}</span>
        <button mat-icon-button type="button" mat-dialog-close aria-label="Κλείσιμο">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="stage">
        <button mat-icon-button type="button" class="nav prev" aria-label="Προηγούμενη φωτογραφία" (click)="step(-1)">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <img [src]="current().url" [alt]="current().caption" />
        <button mat-icon-button type="button" class="nav next" aria-label="Επόμενη φωτογραφία" (click)="step(1)">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <div class="caption">{{ current().caption }}</div>

      <!-- Preload neighbours for instant navigation -->
      <img class="preload" [src]="prevUrl()" alt="" aria-hidden="true" />
      <img class="preload" [src]="nextUrl()" alt="" aria-hidden="true" />
    </div>
  `,
  styleUrl: './lightbox-dialog.scss',
})
export class LightboxDialog {
  protected readonly photos = GALLERY_PHOTOS;
  protected readonly index = signal(inject<LightboxData>(MAT_DIALOG_DATA).index);

  protected readonly current = computed(() => {
    const photo = this.photos[this.index()];
    return { url: fullImageUrl(photo), caption: photo.caption };
  });
  protected readonly prevUrl = computed(() => fullImageUrl(this.photos[this.wrap(this.index() - 1)]));
  protected readonly nextUrl = computed(() => fullImageUrl(this.photos[this.wrap(this.index() + 1)]));

  private touchStartX: number | null = null;

  protected step(delta: number): void {
    this.index.update((i) => this.wrap(i + delta));
  }

  @HostListener('document:keydown.arrowleft')
  protected onLeft(): void {
    this.step(-1);
  }

  @HostListener('document:keydown.arrowright')
  protected onRight(): void {
    this.step(1);
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const dx = (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) this.step(dx > 0 ? -1 : 1);
  }

  private wrap(i: number): number {
    const n = this.photos.length;
    return (i + n) % n;
  }
}
