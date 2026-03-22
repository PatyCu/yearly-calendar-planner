"use client";

import type { PersonConfig, DayEntry } from "@/lib/types";
import { computeStats, getRemoteDates } from "@/lib/data";
import MonthGrid from "./MonthGrid";

interface Props {
  config: PersonConfig;
  year: number;
  holidays: string[];
  days: Record<string, DayEntry>;
  onUpdate: (days: Record<string, DayEntry>) => void;
}

export default function PersonCalendar({ config, year, holidays, days, onUpdate }: Props) {
  const holidaySet = new Set(holidays);
  const remoteDates = getRemoteDates(config);
  const stats = computeStats(config, days);

  function handleDayClick(date: string, { shiftKey, ctrlKey, metaKey }: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) {
    const entry = days[date];
    const next = { ...days };

    if (shiftKey) {
      // ½ day: cycle vacation-possible(half) → vacation-confirmed(half) → empty
      if (entry?.half && entry.type === "vacation-possible") {
        next[date] = { type: "vacation-confirmed", half: true };
      } else if (entry?.half && entry.type === "vacation-confirmed") {
        delete next[date];
      } else {
        next[date] = { type: "vacation-possible", half: true };
      }
    } else if (ctrlKey) {
      // 1 day confirmed PTO — toggle off if already set
      if (entry?.type === "vacation-confirmed" && !entry.half) {
        delete next[date];
      } else {
        next[date] = { type: "vacation-confirmed" };
      }
    } else if (metaKey) {
      // Remote — toggle off if already set
      if (entry?.type === "remote") {
        delete next[date];
      } else {
        next[date] = { type: "remote" };
      }
    } else {
      // Regular click: cycle vacation-possible → vacation-confirmed → empty
      if (!entry || (entry.type !== "vacation-possible" && entry.type !== "vacation-confirmed")) {
        next[date] = { type: "vacation-possible" };
      } else if (entry.type === "vacation-possible") {
        next[date] = { type: "vacation-confirmed" };
      } else {
        delete next[date];
      }
    }

    onUpdate(next);
  }

  return (
    <div className="flex flex-col gap-3 shrink-0">
      <div className="flex items-baseline gap-4 flex-wrap">
        <h2 className="text-xl font-bold">{config.name}</h2>
        <StatsBar stats={stats} quota={config.ptoQuota} />
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        {Array.from({ length: 12 }, (_, m) => (
          <MonthGrid
            key={m}
            month={m}
            year={year}
            days={days}
            holidays={holidaySet}
            remoteDates={remoteDates}
            personId={config.id}
            onDayClick={handleDayClick}
          />
        ))}
      </div>
    </div>
  );
}

function StatsBar({ stats, quota }: { stats: ReturnType<typeof computeStats>; quota: number }) {
  const availableColor = stats.ptoAvailable <= 0 ? "text-red-600 font-bold" : "text-green-700 font-semibold";

  return (
    <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
      <span>
        PTO: <strong>{stats.ptoUsed}</strong>/{quota} used &nbsp;
        <span className={availableColor}>({stats.ptoAvailable} available)</span>
      </span>
      {stats.remoteUsed !== null && (
        <span>Remote: <strong>{stats.remoteUsed}</strong></span>
      )}
    </div>
  );
}
