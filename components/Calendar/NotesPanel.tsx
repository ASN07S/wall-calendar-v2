"use client";

import { CalendarTheme, DateRange, fmtShort, MONTHS, THEMES, toMonthKey } from "../types/calendar";

interface Props {
  rStart: string | null;
  rEnd: string | null;
  selecting: boolean;
  monthNotes: Record<string, string>;
  ranges: DateRange[];
  theme: CalendarTheme;
  darkMode: boolean;
  month: number;
  year: number;
  onSetMonthNote: (mk: string, note: string) => void;
  onClearSel: () => void;
  onSetTheme: (t: CalendarTheme) => void;
  onToggleDark: () => void;
  onDeleteRange: (id: string) => void;
  onSaveRange: () => void;
}

export default function NotesPanel(p: Props) {
  const mk = toMonthKey(p.year, p.month);
  const note = p.monthNotes[mk] ?? "";

  const dm = p.darkMode;
  const bg = dm ? "#12122a" : "#ffffff";
  const border = dm ? "#2a2a4a" : "#f0f0f0";
  const textPrimary = dm ? "#e0e0f5" : "#1a1a2e";
  const textMuted = dm ? "#6060a0" : "#9ca3af";

  const normalizedStart = p.rStart && p.rEnd
    ? (p.rStart <= p.rEnd ? p.rStart : p.rEnd)
    : p.rStart;
  const normalizedEnd = p.rStart && p.rEnd
    ? (p.rStart <= p.rEnd ? p.rEnd : p.rStart)
    : null;

  // Ranges visible in this month
  const visibleRanges = p.ranges.filter(r => {
    const monthStart = toMonthKey(p.year, p.month) + "-01";
    const monthEnd = toMonthKey(p.year, p.month) + "-31";
    return r.start <= monthEnd && r.end >= monthStart;
  });

  return (
    <div
      className="flex flex-col gap-4 p-4 md:p-5"
      style={{
        background: bg,
        borderRight: `0.5px solid ${border}`,
        borderBottom: `0.5px solid ${border}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: textMuted }}>
          {MONTHS[p.month]}
        </span>
        <button
          onClick={p.onToggleDark}
          className="text-lg w-7 h-7 flex items-center justify-center rounded-full transition-colors"
          style={{ background: dm ? "#2a2a4a" : "#f5f5f5", color: dm ? "#e0e0f5" : "#888" }}
          title={dm ? "Light mode" : "Dark mode"}
          aria-label="Toggle dark mode"
        >
          {dm ? "☀" : "☾"}
        </button>
      </div>

      {/* Month notes textarea */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: textMuted }}>Notes</p>
        <textarea
          value={note}
          onChange={(e) => p.onSetMonthNote(mk, e.target.value)}
          placeholder={`Notes for ${MONTHS[p.month]}…`}
          rows={4}
          className="w-full resize-none text-[13px] leading-relaxed outline-none bg-transparent placeholder:opacity-40"
          style={{
            color: textPrimary,
            borderBottom: `0.5px solid ${border}`,
            padding: "4px 0",
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        />
        {[0,1,2].map(i=>(
          <div key={i} style={{ height: "24px", borderBottom: `0.5px solid ${dm?"#1e1e3a":"#f5f5f5"}` }}/>
        ))}
      </div>

      {/* Range info / CTA */}
      <div
        className="rounded-xl p-3 text-xs leading-relaxed"
        style={{ background: p.rStart ? p.theme.accentLight + (dm?"40":"") : (dm?"#1a1a3a":"#f9fafb") }}
      >
        {p.rStart ? (
          <>
            <p className="font-semibold text-[11px]" style={{ color: p.theme.accentDark }}>
              {normalizedStart && fmtShort(normalizedStart)}
              {normalizedEnd && normalizedEnd !== normalizedStart ? ` → ${fmtShort(normalizedEnd)}` : ""}
            </p>
            <p className="mt-0.5" style={{ color: textMuted }}>
              {p.selecting ? "Now click an end date" : "Range selected · click Save or double-click a date for a note"}
            </p>
            {!p.selecting && p.rEnd && (
              <button
                onClick={p.onSaveRange}
                className="mt-2 text-[11px] px-3 py-1 rounded-lg text-white font-semibold"
                style={{ background: p.theme.accent }}
              >
                Save range ↗
              </button>
            )}
          </>
        ) : (
          <p style={{ color: textMuted }}>Click a date to start selecting a range</p>
        )}
      </div>

      {p.rStart && (
        <button
          onClick={p.onClearSel}
          className="text-[11px] self-start px-3 py-1.5 rounded-lg transition-colors"
          style={{ border: `0.5px solid ${border}`, color: textMuted, background: "transparent" }}
        >
          Clear selection
        </button>
      )}

      {/* Saved ranges for this month */}
      {visibleRanges.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: textMuted }}>Events</p>
          <div className="flex flex-col gap-1.5">
            {visibleRanges.map(r => (
              <div key={r.id} className="flex items-start gap-2 group">
                <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: r.color }}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: textPrimary }}>{r.label}</p>
                  <p className="text-[10px]" style={{ color: textMuted }}>
                    {fmtShort(r.start)}{r.end !== r.start ? ` – ${fmtShort(r.end)}` : ""}
                  </p>
                  {r.note && <p className="text-[10px] mt-0.5 italic truncate" style={{ color: textMuted }}>{r.note}</p>}
                </div>
                <button
                  onClick={() => p.onDeleteRange(r.id)}
                  className="opacity-0 group-hover:opacity-100 text-[11px] transition-opacity flex-shrink-0"
                  style={{ color: "#ef5350" }}
                  title="Delete event"
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theme picker */}
      <div className="mt-auto">
        <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: textMuted }}>Theme</p>
        <div className="flex gap-2 flex-wrap">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => p.onSetTheme(t)}
              title={t.name}
              className="w-4 h-4 rounded-full transition-transform"
              style={{
                background: t.accent,
                border: t.id === p.theme.id ? `2px solid ${t.accentDark}` : "2px solid transparent",
                transform: t.id === p.theme.id ? "scale(1.35)" : "scale(1)",
              }}
              aria-label={`${t.name} theme`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
