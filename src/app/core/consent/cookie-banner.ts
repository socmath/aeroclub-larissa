import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ConsentService } from './consent.service';

@Component({
  selector: 'app-cookie-banner',
  imports: [MatButtonModule],
  template: `
    @if (consent.bannerVisible()) {
      <section class="cookie-banner" role="dialog" aria-live="polite" aria-labelledby="cookie-title">
        <h2 id="cookie-title">Cookies</h2>
        <p>
          Χρησιμοποιούμε cookies του Google Analytics για να μετράμε την επισκεψιμότητα και να βελτιώνουμε τον
          ιστότοπο. Θα ενεργοποιηθούν μόνο αν συμφωνήσετε. Μπορείτε να αλλάξετε την επιλογή σας οποιαδήποτε στιγμή
          από το «Ρυθμίσεις cookies» στο κάτω μέρος της σελίδας.
        </p>
        <div class="actions">
          <button mat-stroked-button type="button" (click)="consent.deny()">Απόρριψη</button>
          <button mat-flat-button type="button" (click)="consent.grant()">Αποδοχή</button>
        </div>
      </section>
    }
  `,
  styleUrl: './cookie-banner.scss',
})
export class CookieBanner {
  protected readonly consent = inject(ConsentService);
}
