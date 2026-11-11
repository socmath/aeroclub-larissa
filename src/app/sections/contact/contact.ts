import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Reveal } from '../../shared/reveal';

type CopyKind = 'phone' | 'email';

const COPIED_MESSAGES: Record<CopyKind, string> = {
  phone: 'Ο αριθμός τηλεφώνου αντιγράφηκε στο πρόχειρο.',
  email: 'Η διεύθυνση email αντιγράφηκε στο πρόχειρο.',
};

@Component({
  selector: 'app-contact',
  imports: [MatIconModule, MatIconButton, Reveal],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactSection {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly phone = '+30 698 3513 385';
  protected readonly email = 'airclublarissas@gmail.com';
  protected readonly mapUrl: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://maps.google.com/maps?q=39.6552,22.3408&z=15&output=embed',
  );

  /** Which value was just copied, to flash a check mark on its button */
  protected readonly copied = signal<CopyKind | null>(null);
  private resetTimer?: ReturnType<typeof setTimeout>;

  protected copy(kind: CopyKind, value: string): void {
    if (!this.clipboard.copy(value)) {
      this.snackBar.open('Δεν ήταν δυνατή η αντιγραφή. Αντιγράψτε χειροκίνητα.', 'OK', { duration: 5000 });
      return;
    }

    this.snackBar.open(COPIED_MESSAGES[kind], 'OK', { duration: 5000 });
    this.copied.set(kind);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(null), 2000);
  }
}
