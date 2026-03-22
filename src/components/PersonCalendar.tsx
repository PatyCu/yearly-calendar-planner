"use client";

import type { PersonConfig, DayEntry, DayType } from "@/lib/types";
import { computeStats, getRemoteDates } from "@/lib/data";
import MonthGrid from "./MonthGrid";

interface Props {
  config: PersonConfig;
  year: number;
  holidays: string[];
  days: Record<string, DayEntry>;
  onUpdate: (days: Record<string, DayEntry>) => void;
}

const CYCLE_WITH_REMOTE: (DayType | null)[] = ["vacation-possible", "vacation-confirmed", "remote", null];
const CYCLE_DEFAULT: (DayType | null)[] = ["vacation-possible", "vacation-confirmed", null];

export default function PersonCalendar({ config, year, holidays, days, onUpdate }: Props) {
  const holidaySet = new Set(holidays);
  const remoteDates = getRemoteDates(config);
  const stats = computeStats(config, days);

  const cycle = config.remote.kind === "days" ? CYCLE_WITH_REMOTE : CYCLE_DEFAULT;

  function handleDayClick(date: string, shiftKey: boolean) {
    const entry = days[date];

    if (shiftKey && entry && entry.type !== "remote") {
      const next = { ...days };
      if (entry.half) {
        const { half, ...rest } = entry;
        next[date] = rest as DayEntry;
      } else {
        next[date] = { ...entry, half: true };
      }
      onUpdate(next);
      return;
    }

    const currentType = entry?.type ?? null;
    const currentIdx = cycle.indexOf(currentType);
    const nextType = cycle[(currentIdx + 1) % cycle.length];
    const next = { ...days };
    if (nextType === null) {
      delete next[date];
    } else {
      next[date] = { type: nextType };
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
