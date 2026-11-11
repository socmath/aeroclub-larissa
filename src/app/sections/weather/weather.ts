import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, debounceTime, fromEvent, map, of, switchMap, timer } from 'rxjs';
import { LinkItem, LinkList } from '../../shared/link-list';
import { assessVfr, describeCondition } from './weather-conditions';
import { Weather, WeatherService } from './weather.service';

const REFRESH_MS = 30 * 60 * 1000;
const METAR_LIVE_COOLDOWN_MS = 60 * 60 * 1000;
const METAR_LIVE_WINDOW = 'metar_live_window';

const TIME_FORMAT = new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens' });
const TIMESTAMP_FORMAT = new Intl.DateTimeFormat('el-GR', { dateStyle: 'short', timeStyle: 'medium' });

type State = { status: 'loading' } | { status: 'error' } | { status: 'ok'; weather: Weather };

@Component({
  selector: 'app-weather',
  imports: [MatIconModule, MatProgressSpinnerModule, LinkList],
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
})
export class WeatherSection {
  private readonly weatherService = inject(WeatherService);

  protected readonly state = signal<State>({ status: 'loading' });
  private readonly now = signal(new Date());

  protected readonly weather = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? s.weather : null;
  });
  protected readonly condition = computed(() => {
    const w = this.weather();
    return w ? describeCondition(w.weatherCode) : null;
  });
  protected readonly vfr = computed(() => {
    const w = this.weather();
    return w ? assessVfr(w, this.now(), this.time) : null;
  });

  private readonly viewportWidth = signal(window.innerWidth);
  protected readonly metarLiveUrl = computed(
    () => `https://metar-taf.com/live/LGLR?zoom=${metarZoomLevel(this.viewportWidth())}`,
  );

  protected readonly meteoLinks: readonly LinkItem[] = [
    { name: 'ΕΜΥ', url: 'https://www.emy.gr/', description: 'Εθνική Μετεωρολογική Υπηρεσία' },
    {
      name: 'Windy',
      url: 'https://www.windy.com/?39.656,22.340,15,m:eLgagMp',
      description: 'Διαδραστικός Χάρτης Καιρού',
    },
    { name: 'Αναφορές METAR/TAF', url: 'https://metar-taf.com/', windowName: 'metar_general_window' },
  ];

  private liveWindow: Window | null = null;
  private lastLiveOpen = 0;

  protected readonly time = (d: Date) => TIME_FORMAT.format(d);
  protected readonly timestamp = (d: Date) => TIMESTAMP_FORMAT.format(d);

  constructor() {
    const destroyRef = inject(DestroyRef);

    timer(0, REFRESH_MS)
      .pipe(
        switchMap(() => this.weatherService.load().pipe(catchError(() => of(null)))),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe((weather) => {
        this.now.set(new Date());
        if (weather) {
          this.state.set({ status: 'ok', weather });
        } else if (this.state().status !== 'ok') {
          this.state.set({ status: 'error' });
        }
      });

    fromEvent(window, 'resize')
      .pipe(debounceTime(250), map(() => window.innerWidth), takeUntilDestroyed(destroyRef))
      .subscribe((w) => this.viewportWidth.set(w));
  }

  /** Re-opening the live METAR page within an hour only refocuses the existing window. */
  protected onMetarLiveClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const now = Date.now();
    if (this.liveWindow && !this.liveWindow.closed && now - this.lastLiveOpen < METAR_LIVE_COOLDOWN_MS) {
      this.liveWindow.focus();
      return;
    }

    this.liveWindow = window.open(this.metarLiveUrl(), METAR_LIVE_WINDOW);
    this.lastLiveOpen = now;
    if (this.liveWindow) {
      try {
        this.liveWindow.opener = null;
      } catch {
        // ignore: window may already be cross-origin
      }
    }
  }
}

function metarZoomLevel(width: number): number {
  if (width < 480) return 50;
  if (width < 768) return 60;
  if (width < 1024) return 70;
  return 79;
}
