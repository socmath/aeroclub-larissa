import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { CookieBanner } from './core/consent/cookie-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CookieBanner],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-cookie-banner />
  `,
})
export class App {}
