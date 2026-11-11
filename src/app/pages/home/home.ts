import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { About } from '../../sections/about/about';
import { WeatherSection } from '../../sections/weather/weather';
import { LinksSection } from '../../sections/links/links';
import { ContactSection } from '../../sections/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, WeatherSection, LinksSection, ContactSection],
  template: `
    <app-hero />
    <app-about />
    <app-weather />
    <app-links />
    <app-contact />
  `,
})
export class HomePage {}
