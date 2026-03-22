"use client";

import { useEffect, useState } from "react";
import type { YearConfig, DayEntry } from "@/lib/types";
import {
  fetchHolidays,
  fetchYearConfig,
  fetchCalendar,
  loadFromStorage,
  saveToStorage,
} from "@/lib/data";
import PersonCalendar from "@/components/PersonCalendar";

const YEAR = 2026;

export default function Home() {
  const [holidays, setHolidays] = useState<string[]>([]);
  const [config, setConfig] = useState<YearConfig | null>(null);
  const [calendarDays, setCalendarDays] = useState<Record<string, Record<string, DayEntry>>>({});

  useEffect(() => {
    async function load() {
      const [h, cfg, patyData, oriolData] = await Promise.all([
        fetchHolidays(YEAR),
        fetchYearConfig(YEAR),
        fetchCalendar(YEAR, "paty"),
        fetchCalendar(YEAR, "oriol"),
      ]);

      setHolidays(h);
      setConfig(cfg);
      setCalendarDays({
        paty: loadFromStorage(YEAR, "paty") ?? patyData.days,
        oriol: loadFromStorage(YEAR, "oriol") ?? oriolData.days,
      });
    }
    load();
  }, []);

  function handleUpdate(personId: string, days: Record<string, DayEntry>) {
    saveToStorage(YEAR, personId, days);
    setCalendarDays((prev) => ({ ...prev, [personId]: days }));
  }

  if (!config) {
    return <div className="p-8 text-gray-400">Loading…</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-center text-2xl font-bold mb-6">{YEAR}</h1>
      <div className="flex gap-10 overflow-x-auto">
        {config.people.map((person) => (
          <PersonCalendar
            key={person.id}
            config={person}
            year={YEAR}
            holidays={holidays}
            days={calendarDays[person.id] ?? {}}
            onUpdate={(days) => handleUpdate(person.id, days)}
          />
        ))}
      </div>
    </div>
  );
}
