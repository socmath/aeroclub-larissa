import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SECTIONS, ScrollService } from '../../core/scroll.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly scroll = inject(ScrollService);
  protected readonly sections = SECTIONS;

  protected go(event: Event, id: string): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }
}
