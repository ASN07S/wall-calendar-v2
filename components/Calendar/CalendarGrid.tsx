"use client";

import { useEffect, useRef } from "react";
import { cmpKey, DateRange, DOW, HOLIDAYS, MONTHS, normalizeRange, toKey } from "../types/calendar";

interface Props {
  year: number;
  month: number;
  rStart: string | null;
  rEnd: string | null;
  hoverKey: string | null;
  selecting: boolean;
  todayKey: string;
  dateNotes: Record<string, string>;
  ranges: DateRange[];
  accent: string;
  accentLight: string;
  accentDark: string;
  darkMode: boolean;
  onChangeMonth: (d: 1 | -1) => void;
  onClickDate: (k: string) => void;
  onDblClick: (k: string) => void;
  onHover: (k: string | null) => void;
}

function getRangeForKey(key: string, ranges: DateRange[]): DateRange | null {
  for (const r of ranges) {
    if (cmpKey(key, r.start) >= 0 && cmpKey(key, r.end) <= 0) return r;
  }
  return null;
}

export default function CalendarGrid(p: Props) {
  const touchStartX = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Build cells
  const first = new Date(p.year, p.month, 1).getDay();
  const offset = first === 0 ? 6 : first - 1;
  const daysInMonth = new Date(p.year, p.month + 1, 0).getDate();
  const prevDays = new Date(p.year, p.month, 0).getDate();

  type Cell = { key: string; day: number; curr: boolean; colIdx: number };
  const cells: Cell[] = [];

  for (let i = 0; i < offset; i++) {
    const d = prevDays - offset + 1 + i;
    const pm = p.month - 1 < 0 ? 11 : p.month - 1;
    const py = p.month - 1 < 0 ? p.year - 1 : p.year;
    cells.push({ key: toKey(py, pm, d), day: d, curr: false, colIdx: i % 7 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: toKey(p.year, p.month, d), day: d, curr: true, colIdx: (offset + d - 1) % 7 });
  }
  const rem = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= rem; i++) {
    const nm = p.month + 1 > 11 ? 0 : p.month + 1;
    const ny = p.month + 1 > 11 ? p.year + 1 : p.year;
    cells.push({ key: toKey(ny, nm, i), day: i, curr: false, colIdx: (offset + daysInMonth + i - 1) % 7 });
  }

  // Hover range preview
  const previewEnd = p.selecting && p.hoverKey ? p.hoverKey : null;
  const { rStart: pvStart, rEnd: pvEnd } = normalizeRange(p.rStart, previewEnd ?? p.rEnd);

  function inPreview(key: string) {
    if (!pvStart || !pvEnd) return false;
    return cmpKey(key, pvStart) >= 0 && cmpKey(key, pvEnd) <= 0;
  }

  // Touch swipe
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 50) p.onChangeMonth(dx < 0 ? 1 : -1);
      touchStartX.current = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { el.removeEventListener("touchstart", onTouchStart); el.removeEventListener("touchend", onTouchEnd); };
  }, [p]);

  return (
    <div ref={gridRef} className="flex flex-col p-4 md:p-5 flex-1 min-w-0 select-none">
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => p.onChangeMonth(-1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-base"
          style={{ border: "0.5px solid", borderColor: p.darkMode ? "#3a3a5c" : "#e0e0e0", color: p.darkMode ? "#9090b0" : "#888" }}
          aria-label="Previous month"
        >‹</button>

        <h2
          className="font-display tracking-wide text-base md:text-lg"
          style={{ color: p.darkMode ? "#e8e8f5" : "#1a1a2e", fontWeight: 600 }}
        >
          {MONTHS[p.month]} {p.year}
        </h2>

        <button
          onClick={() => p.onChangeMonth(1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-base"
          style={{ border: "0.5px solid", borderColor: p.darkMode ? "#3a3a5c" : "#e0e0e0", color: p.darkMode ? "#9090b0" : "#888" }}
          aria-label="Next month"
        >›</button>
      </div>

      {/* DOW headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d, i) => (
          <div key={d} className="text-center py-1 text-[10px] font-semibold tracking-widest"
            style={{ color: i >= 5 ? "#ef5350" : p.darkMode ? "#6060a0" : "#bbb" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          const isToday = cell.key === p.todayKey;
          const isHoliday = !!HOLIDAYS[cell.key];
          const holiday = HOLIDAYS[cell.key];
          const hasNote = !!p.dateNotes[cell.key];
          const isSatSun = cell.colIdx >= 5;
          const savedRange = getRangeForKey(cell.key, p.ranges);

          // Selection state
          const isRangeStart = cell.curr && pvStart === cell.key;
          const isRangeEnd = cell.curr && pvEnd === cell.key && pvEnd !== pvStart;
          const isInRange = cell.curr && inPreview(cell.key) && !isRangeStart && !isRangeEnd;
          const isSingleSel = cell.curr && pvStart === cell.key && (!pvEnd || pvEnd === pvStart);

          let bg = "transparent";
          let color = p.darkMode ? "#c8c8e8" : "#1a1a2e";
          let borderRadius = "6px";

          if (!cell.curr) color = p.darkMode ? "#3a3a5c" : "#ccc";
          else if (isSatSun) color = "#ef5350";

          if (isRangeStart || isSingleSel) {
            bg = p.accent; color = "white";
            borderRadius = pvEnd && pvEnd !== pvStart ? "6px 0 0 6px" : "6px";
          } else if (isRangeEnd) {
            bg = p.accent; color = "white"; borderRadius = "0 6px 6px 0";
          } else if (isInRange) {
            bg = p.accentLight; color = p.accentDark; borderRadius = "0";
          } else if (savedRange && !isRangeStart && !isRangeEnd && !isInRange) {
            bg = savedRange.color + "22"; color = savedRange.color;
          }

          return (
            <div
              key={`${cell.key}-${idx}`}
              className="relative flex flex-col items-center justify-center transition-all duration-75 group"
              style={{
                minHeight: "clamp(30px, 5vw, 40px)",
                fontSize: "clamp(11px, 1.6vw, 13px)",
                background: bg,
                color,
                borderRadius,
                cursor: cell.curr ? "pointer" : "default",
                opacity: cell.curr ? 1 : 0.3,
                fontWeight: isToday ? 700 : 400,
              }}
              onClick={() => cell.curr && p.onClickDate(cell.key)}
              onDoubleClick={() => cell.curr && p.onDblClick(cell.key)}
              onMouseEnter={() => cell.curr && p.onHover(cell.key)}
              onMouseLeave={() => p.onHover(null)}
              role={cell.curr ? "button" : undefined}
              tabIndex={cell.curr ? 0 : undefined}
              onKeyDown={(e) => { if (cell.curr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); p.onClickDate(cell.key); }}}
              aria-label={cell.curr ? `${MONTHS[p.month]} ${cell.day}, ${p.year}${isHoliday ? ", " + holiday : ""}` : undefined}
            >
              <span>{cell.day}</span>

              {/* Today dot */}
              {isToday && bg === "transparent" && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: p.accent }}/>
              )}

              {/* Holiday marker */}
              {isHoliday && cell.curr && (
                <span
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: isRangeStart || isRangeEnd ? "white" : "#ffa000" }}
                  title={holiday}
                />
              )}

              {/* Note dot */}
              {hasNote && cell.curr && !isHoliday && (
                <span
                  className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
                  style={{ background: isRangeStart || isRangeEnd ? "white" : p.accent }}
                />
              )}

              {/* Saved range label — show on first day of range */}
              {savedRange && savedRange.start === cell.key && (
                <span
                  className="absolute -top-3 left-0 text-[9px] font-semibold whitespace-nowrap truncate max-w-[80px] px-1 rounded leading-tight z-10"
                  style={{ background: savedRange.color, color: "white" }}
                >
                  {savedRange.label}
                </span>
              )}

              {/* Hover tooltip for holiday */}
              {isHoliday && cell.curr && (
                <span
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                  style={{ background: "#ffa000", color: "white" }}
                >
                  {holiday}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-3 flex-wrap">
        {[
          { color: "#ffa000", label: "Holiday" },
          { color: p.accent, label: "Selected" },
          { color: "#ef5350", label: "Weekend" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }}/>
            <span className="text-[10px]" style={{ color: p.darkMode ? "#6060a0" : "#aaa" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
