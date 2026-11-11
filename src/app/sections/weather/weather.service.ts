import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

// Larissa airport (LGLR)
const LATITUDE = 39.65;
const LONGITUDE = 22.465;
const MS_TO_KNOTS = 1.94384;

interface OpenMeteoResponse {
  current_weather: {
    time: number;
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
  };
  hourly: { time: number[]; visibility: (number | null)[] };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: number[];
    sunset: number[];
    precipitation_sum: number[];
  };
}

export interface Weather {
  updatedAt: Date;
  temperature: number;
  todayMin: number;
  todayMax: number;
  windDirection: number;
  windMs: number;
  windKnots: number;
  precipitationMm: number;
  visibilityKm: number | null;
  sunrise: Date;
  sunset: Date;
  weatherCode: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  load(): Observable<Weather> {
    const params = new HttpParams({
      fromObject: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        current_weather: true,
        hourly: 'visibility',
        daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum',
        timezone: 'Europe/Athens',
        timeformat: 'unixtime',
        wind_speed_unit: 'ms',
      },
    });

    return this.http
      .get<OpenMeteoResponse>('https://api.open-meteo.com/v1/forecast', { params })
      .pipe(map((r) => toWeather(r)));
  }
}

function toWeather({ current_weather: c, daily: d, hourly: h }: OpenMeteoResponse): Weather {
  // All timestamps are unix seconds, so they are correct for visitors in any timezone
  const hourIndex = h.time.indexOf(Math.floor(c.time / 3600) * 3600);
  const visibilityMeters = hourIndex >= 0 ? h.visibility[hourIndex] : null;

  return {
    updatedAt: new Date(),
    temperature: Math.round(c.temperature),
    todayMin: Math.round(d.temperature_2m_min[0]),
    todayMax: Math.round(d.temperature_2m_max[0]),
    windDirection: Math.round(c.winddirection),
    windMs: Math.round(c.windspeed),
    windKnots: Math.round(c.windspeed * MS_TO_KNOTS),
    precipitationMm: d.precipitation_sum[0],
    visibilityKm: visibilityMeters == null ? null : visibilityMeters / 1000,
    sunrise: new Date(d.sunrise[0] * 1000),
    sunset: new Date(d.sunset[0] * 1000),
    weatherCode: c.weathercode,
  };
}
