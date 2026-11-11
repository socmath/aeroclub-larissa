import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LinkItem, LinkList } from '../../shared/link-list';

interface LinkCategory {
  title: string;
  icon: string;
  links: readonly LinkItem[];
}

@Component({
  selector: 'app-links',
  imports: [MatIconModule, LinkList],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class LinksSection {
  protected readonly categories: readonly LinkCategory[] = [
    {
      title: 'Επίσημοι Οργανισμοί',
      icon: 'account_balance',
      links: [
        {
          name: 'EASA',
          url: 'https://www.easa.europa.eu/',
          description: 'Ευρωπαϊκός Οργανισμός Ασφάλειας Πολιτικής Αεροπορίας',
        },
        { name: 'ΥΠΑ', url: 'https://www.ypa.gr/', description: 'Υπηρεσία Πολιτικής Αεροπορίας' },
        { name: 'ΑΠΑ', url: 'https://www.hcaa.gov.gr/', description: 'Αρχή Πολιτικής Αεροπορίας' },
        { name: 'ΕΛΑΟ', url: 'https://www.elao.website/', description: 'Ελληνική Αεραθλητική Ομοσπονδία' },
        {
          name: 'AOPA Ελλάδας',
          url: 'https://www.aopa.gr/el/',
          description: 'Σύλλογος Ιδιοκτητών Αεροσκαφών - ελληνικό παράρτημα',
        },
      ],
    },
    {
      title: 'Εκπαιδευτικό Υλικό',
      icon: 'school',
      links: [
        { name: 'SKYbrary', url: 'https://www.skybrary.aero/', description: 'Διαδικτυακή Αεροπορική Βιβλιοθήκη' },
        {
          name: 'FAA Training Resources',
          url: 'https://www.faa.gov/training_testing/',
          description: 'Εκπαιδευτικό Υλικό της αμερικανικής Υπηρεσίας Πολιτικής Αεροπορίας',
        },
      ],
    },
    {
      title: 'Αεροπλοΐα & Χάρτες',
      icon: 'map',
      links: [
        {
          name: 'Aero Web GIS',
          url: 'https://geo-gishpc1.aegean.gr:446/AWG/?VER=4.10.1&BL=1&LAT=39.486&LON=22.385&ZL=10',
          description: 'Aeronautical Information Services',
        },
        {
          name: 'FlightRadar24',
          url: 'https://www.flightradar24.com/39.44,22.18/9',
          description: 'Διαδικτυακή Πλατφόρμα Παρακολούθησης Πτήσεων',
        },
      ],
    },
  ];
}
