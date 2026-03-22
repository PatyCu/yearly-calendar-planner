"use client";

import type { DayEntry, DayType } from "@/lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["M", "TU", "W", "TH", "F", "S", "S"];

interface Props {
  month: number; // 0-11
  year: number;
  days: Record<string, DayEntry>;
  holidays: Set<string>;
  remoteDates: Set<string>;
  personId: string;
  onDayClick: (date: string, shiftKey: boolean) => void;
  readonly?: boolean;
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function cellClasses(
  entry: DayEntry | undefined,
  isHoliday: boolean,
  isRemote: boolean,
  isWeekend: boolean,
): string {
  if (isHoliday) return "bg-green-500 text-white";
  if (isWeekend) return "bg-gray-100 text-gray-400";
  if (entry?.type === "vacation-confirmed") return entry.half ? "bg-red-400/50 text-red-900" : "bg-red-400 text-white";
  if (entry?.type === "vacation-possible") return entry.half ? "bg-orange-400/50 text-orange-900" : "bg-orange-400 text-white";
  if (entry?.type === "remote" || isRemote) return "bg-cyan-400 text-white";
  return "hover:bg-gray-100 cursor-pointer";
}

export default function MonthGrid({ month, year, days, holidays, remoteDates, personId, onDayClick, readonly }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  return (
    <div className="min-w-[168px]">
      <div className="text-sm font-bold mb-0.5">{MONTH_NAMES[month]}</div>

      <div className="grid grid-cols-7 bg-black text-white text-[10px] font-semibold">
        {DAY_HEADERS.map((h, i) => (
          <div key={i} className="text-center py-0.5">{h}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-[11px]">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const col = i % 7;
          const isWeekend = col >= 5;
          const iso = toIso(year, month, day);
          const isHoliday = holidays.has(iso);
          const isRemote = remoteDates.has(iso);
          const entry = days[iso];
          const isToday = iso === today;
          const interactive = !readonly && !isWeekend && !isHoliday && !(isRemote && !entry);

          return (
            <div
              key={i}
              onClick={interactive ? (e) => onDayClick(iso, e.shiftKey) : undefined}
              className={[
                "text-center py-0.5 leading-4 select-none",
                cellClasses(entry, isHoliday, isRemote, isWeekend),
                interactive ? "cursor-pointer" : "",
                isToday ? "font-bold underline" : "",
              ].join(" ")}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
