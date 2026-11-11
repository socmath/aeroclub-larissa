import { Weather } from './weather.service';
import { assessVfr, describeCondition } from './weather-conditions';

const weather = (overrides: Partial<Weather> = {}): Weather => ({
  updatedAt: new Date('2026-06-01T12:00:00Z'),
  temperature: 25,
  todayMin: 15,
  todayMax: 30,
  windDirection: 270,
  windMs: 3,
  windKnots: 6,
  precipitationMm: 0,
  visibilityKm: 10,
  sunrise: new Date('2026-06-01T03:00:00Z'),
  sunset: new Date('2026-06-01T17:00:00Z'),
  weatherCode: 0,
  ...overrides,
});

const fmt = (d: Date) => d.toISOString();

describe('assessVfr', () => {
  it('reports night outside daylight hours', () => {
    const result = assessVfr(weather(), new Date('2026-06-01T20:00:00Z'), fmt);
    expect(result.status).toBe('night');
    expect(result.isDaylight).toBe(false);
  });

  it('flags strong wind as marginal during the day', () => {
    const result = assessVfr(weather({ windKnots: 26 }), new Date('2026-06-01T10:00:00Z'), fmt);
    expect(result.status).toBe('marginal');
  });

  it('asks for an official METAR/TAF check otherwise', () => {
    const result = assessVfr(weather(), new Date('2026-06-01T10:00:00Z'), fmt);
    expect(result.status).toBe('check-required');
  });
});

describe('describeCondition', () => {
  it('falls back to a generic condition for unknown codes', () => {
    expect(describeCondition(1234).label).toBe('Μεταβλητές συνθήκες');
  });
});
