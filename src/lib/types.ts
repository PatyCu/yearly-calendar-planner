export type DayType = "vacation-possible" | "vacation-confirmed" | "remote";

export interface DayEntry {
  type: DayType;
  half?: true;
}

export interface PersonConfig {
  id: string;
  name: string;
  ptoQuota: number;
  remote:
    | { kind: "days"; quota: number }
    | { kind: "weeks"; weekStarts: string[] };
}

export interface YearConfig {
  year: number;
  people: PersonConfig[];
}

export interface CalendarData {
  year: number;
  personId: string;
  days: Record<string, DayEntry>;
}

export interface Stats {
  ptoUsed: number;
  ptoAvailable: number;
  remoteUsed: number | null;
}
