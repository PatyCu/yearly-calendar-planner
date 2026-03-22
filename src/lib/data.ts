import type { YearConfig, CalendarData, PersonConfig, DayEntry, Stats } from "./types";

export async function fetchHolidays(year: number): Promise<string[]> {
  const res = await fetch(`/data/holidays-${year}.json`);
  return res.json();
}

export async function fetchYearConfig(year: number): Promise<YearConfig> {
  const res = await fetch(`/data/config-${year}.json`);
  return res.json();
}

export async function fetchCalendar(year: number, personId: string): Promise<CalendarData> {
  const res = await fetch(`/data/calendar-${year}-${personId}.json`);
  return res.json();
}

export function computeStats(personConfig: PersonConfig, days: Record<string, DayEntry>): Stats {
  let ptoUsed = 0;
  let remoteUsed = 0;

  for (const entry of Object.values(days)) {
    if (entry.type === "vacation-possible" || entry.type === "vacation-confirmed") {
      ptoUsed += entry.half ? 0.5 : 1;
    } else if (entry.type === "remote") {
      remoteUsed += 1;
    }
  }

  const ptoAvailable = personConfig.ptoQuota - ptoUsed;
  const showRemote = personConfig.remote.kind === "days";

  return {
    ptoUsed,
    ptoAvailable,
    remoteUsed: showRemote ? remoteUsed : null,
  };
}

export function getRemoteDates(personConfig: PersonConfig): Set<string> {
  const dates = new Set<string>();
  if (personConfig.remote.kind !== "weeks") return dates;

  for (const weekStart of personConfig.remote.weekStarts) {
    const monday = new Date(weekStart);
    for (let d = 0; d < 5; d++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + d);
      dates.add(day.toISOString().slice(0, 10));
    }
  }
  return dates;
}

const STORAGE_KEY = (year: number, personId: string) => `calendar-${year}-${personId}`;

export function loadFromStorage(year: number, personId: string): Record<string, DayEntry> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(year, personId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveToStorage(year: number, personId: string, days: Record<string, DayEntry>): void {
  localStorage.setItem(STORAGE_KEY(year, personId), JSON.stringify(days));
}
