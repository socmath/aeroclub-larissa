import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsentService } from '../../core/consent/consent.service';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, MatIconButton],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly consent = inject(ConsentService);
  protected readonly year = new Date().getFullYear();

  constructor() {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    for (const name of ['facebook', 'instagram']) {
      registry.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`));
    }
  }
}
