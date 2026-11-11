import { Weather } from './weather.service';

export interface Condition {
  icon: string;
  color: string;
  label: string;
}

const CONDITIONS: Record<number, Condition> = {
  0: { icon: 'wb_sunny', color: '#FFD700', label: 'Καθαρός ουρανός' },
  1: { icon: 'wb_sunny', color: '#FFA500', label: 'Κυρίως καθαρός' },
  2: { icon: 'cloud_queue', color: '#87CEEB', label: 'Μερικώς συννεφιασμένος' },
  3: { icon: 'cloud', color: '#B0C4DE', label: 'Συννεφιασμένος' },
  45: { icon: 'foggy', color: '#A9A9A9', label: 'Ομίχλη' },
  48: { icon: 'foggy', color: '#778899', label: 'Παγωμένη ομίχλη' },
  51: { icon: 'grain', color: '#4682B4', label: 'Ελαφριά ψιλή βροχή' },
  53: { icon: 'grain', color: '#4169E1', label: 'Μέτρια ψιλή βροχή' },
  55: { icon: 'grain', color: '#0000FF', label: 'Έντονη ψιλή βροχή' },
  61: { icon: 'water_drop', color: '#4682B4', label: 'Ελαφριά βροχή' },
  63: { icon: 'water_drop', color: '#4169E1', label: 'Μέτρια βροχή' },
  65: { icon: 'water_drop', color: '#0000FF', label: 'Έντονη βροχή' },
  80: { icon: 'umbrella', color: '#6495ED', label: 'Ελαφριοί όμβροι' },
  81: { icon: 'umbrella', color: '#4169E1', label: 'Μέτριοι όμβροι' },
  82: { icon: 'umbrella', color: '#800080', label: 'Έντονοι όμβροι' },
  95: { icon: 'thunderstorm', color: '#FFD700', label: 'Καταιγίδα' },
  96: { icon: 'thunderstorm', color: '#FF4500', label: 'Καταιγίδα με χαλάζι' },
  99: { icon: 'thunderstorm', color: '#DC143C', label: 'Έντονη καταιγίδα με χαλάζι' },
};

const UNKNOWN: Condition = { icon: 'cloud_queue', color: '#87CEEB', label: 'Μεταβλητές συνθήκες' };

export function describeCondition(code: number): Condition {
  return CONDITIONS[code] ?? UNKNOWN;
}

export type VfrStatus = 'check-required' | 'marginal' | 'night';

export interface VfrAssessment {
  status: VfrStatus;
  title: string;
  details: string;
  isDaylight: boolean;
}

const STRONG_WIND_KNOTS = 25;

/** Very basic daylight/wind based VFR hint; official METAR/TAF remains the source of truth. */
export function assessVfr(weather: Weather, now: Date, formatTime: (d: Date) => string): VfrAssessment {
  const isDaylight = now >= weather.sunrise && now <= weather.sunset;

  if (!isDaylight) {
    return {
      status: 'night',
      isDaylight,
      title: 'Μη Εφικτές (Νύχτα)',
      details: `Νυχτερινές συνθήκες - VFR δεν επιτρέπονται μετά τη δύση (${formatTime(weather.sunset)})`,
    };
  }
  if (weather.windKnots > STRONG_WIND_KNOTS) {
    return {
      status: 'marginal',
      isDaylight,
      title: 'Οριακές',
      details: 'Ισχυροί άνεμοι - Προσοχή για VFR πτήσεις',
    };
  }
  return {
    status: 'check-required',
    isDaylight,
    title: 'Απαιτείται Έλεγχος',
    details: 'Ελέγξτε επίσημα METAR/TAF για ορατότητα και νεφοκάλυψη',
  };
}
