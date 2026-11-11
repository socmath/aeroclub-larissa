import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Weather, WeatherService } from './weather.service';

describe('WeatherService', () => {
  let http: HttpTestingController;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  it('requests m/s wind and unix timestamps, and maps the response', () => {
    const hour = 1_780_000_000 - (1_780_000_000 % 3600);
    let result: Weather | undefined;
    service.load().subscribe((w) => (result = w));

    const req = http.expectOne((r) => r.url === 'https://api.open-meteo.com/v1/forecast');
    expect(req.request.params.get('wind_speed_unit')).toBe('ms');
    expect(req.request.params.get('timeformat')).toBe('unixtime');

    req.flush({
      current_weather: { time: hour + 600, temperature: 20.4, windspeed: 10, winddirection: 270.2, weathercode: 3 },
      hourly: { time: [hour - 3600, hour, hour + 3600], visibility: [1000, 24140, 5000] },
      daily: {
        temperature_2m_max: [28.6],
        temperature_2m_min: [14.2],
        sunrise: [hour - 36000],
        sunset: [hour + 36000],
        precipitation_sum: [0.4],
      },
    });

    expect(result).toMatchObject({
      temperature: 20,
      todayMax: 29,
      todayMin: 14,
      windDirection: 270,
      windMs: 10,
      windKnots: 19,
      visibilityKm: 24.14,
      precipitationMm: 0.4,
      weatherCode: 3,
    });
    http.verify();
  });
});
