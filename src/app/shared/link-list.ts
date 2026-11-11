import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExternalLink } from './external-link';

export interface LinkItem {
  name: string;
  url: string;
  description?: string;
  windowName?: string;
}

@Component({
  selector: 'app-link-list',
  imports: [MatIconModule, ExternalLink],
  template: `
    <ul class="link-list">
      @for (link of links(); track link.url) {
        <li>
          <a class="link-item" [href]="link.url" [appExternalLink]="link.windowName ?? ''">
            <div class="link-text">
              <div class="link-name">{{ link.name }}</div>
              @if (link.description) {
                <div class="link-desc">{{ link.description }}</div>
              }
            </div>
            <mat-icon class="external-icon">open_in_new</mat-icon>
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './link-list.scss',
})
export class LinkList {
  readonly links = input.required<readonly LinkItem[]>();
}
