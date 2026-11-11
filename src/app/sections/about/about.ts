import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Reveal } from '../../shared/reveal';
import { GALLERY_PHOTOS, fullImageUrl, thumbImageUrl } from './gallery.data';
import { LightboxDialog } from './lightbox-dialog';

@Component({
  selector: 'app-about',
  imports: [MatIconModule, Reveal],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly dialog = inject(MatDialog);

  protected readonly photos = GALLERY_PHOTOS;
  protected readonly fullUrl = fullImageUrl;
  protected readonly thumbUrl = thumbImageUrl;

  protected openPhoto(event: Event, index: number): void {
    event.preventDefault();
    this.dialog.open(LightboxDialog, {
      data: { index },
      panelClass: 'lightbox-panel',
      backdropClass: 'lightbox-backdrop',
      maxWidth: '100vw',
      width: '100vw',
      height: '100dvh',
      autoFocus: 'dialog',
      ariaLabel: 'Συλλογή φωτογραφιών',
    });
  }
}
