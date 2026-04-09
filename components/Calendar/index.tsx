"use client";

import { useState, useCallback } from "react";
import { useCalendarState } from "../hooks/useCalendarState";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import DayNoteModal from "./DayNoteModal";
import SaveRangeModal from "./SaveRangeModal";
import { toMonthKey } from "../types/calendar";

export default function Calendar() {
  const s = useCalendarState();
  const [dayModalKey, setDayModalKey] = useState<string | null>(null);
  const [showSaveRange, setShowSaveRange] = useState(false);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animKey, setAnimKey] = useState(0);

  const handleChangeMonth = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setAnimKey(k => k + 1);
    s.changeMonth(dir);
  }, [s]);

  const handleSaveRange = useCallback((label: string, note: string, color: string) => {
    s.saveRange(label, note, color);
    setShowSaveRange(false);
  }, [s]);

  const dm = s.darkMode;
  const outerBg = dm ? "#0d0d1f" : "#eef0f5";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-6 md:py-10 px-3 md:px-6 print:p-0 print:bg-white transition-colors duration-300"
      style={{ background: outerBg }}
    >
      {/* Wire binding */}
      <div className="w-full max-w-3xl flex justify-center mb-0 relative z-10 print:hidden">
        <div className="w-3/4 relative h-5">
          <div
            className="w-full h-4 rounded"
            style={{
              background: "repeating-linear-gradient(90deg,transparent,transparent 9px,#b0b8c0 9px,#b0b8c0 13px,transparent 13px,transparent 19px)",
              opacity: dm ? 0.5 : 0.75,
            }}
          />
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
            style={{ background: dm ? "#3a3a5c" : "#c8cdd4", border: `2px solid ${dm?"#2a2a4a":"#a0a8b0"}` }}
          />
        </div>
      </div>

      {/* Calendar card */}
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300 print:shadow-none print:rounded-none"
        style={{
          background: dm ? "#12122a" : "#ffffff",
          border: `0.5px solid ${dm ? "#2a2a4a" : "#e0e0e8"}`,
        }}
      >
        {/* Hero — animated on month change */}
        <div
          key={animKey}
          style={{
            animation: `slideIn${direction > 0 ? "Right" : "Left"} 0.35s cubic-bezier(0.4,0,0.2,1)`,
          }}
        >
          <style>{`
            @keyframes slideInRight { from { opacity:0; transform:translateX(32px) } to { opacity:1; transform:translateX(0) } }
            @keyframes slideInLeft  { from { opacity:0; transform:translateX(-32px) } to { opacity:1; transform:translateX(0) } }
          `}</style>
          <HeroImage month={s.month} year={s.year} theme={s.theme} />
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row">
          {/* Notes panel */}
          <div className="md:w-52 lg:w-60 shrink-0">
            <NotesPanel
              rStart={s.rStart}
              rEnd={s.rEnd}
              selecting={s.selecting}
              monthNotes={s.monthNotes}
              ranges={s.ranges}
              theme={s.theme}
              darkMode={dm}
              month={s.month}
              year={s.year}
              onSetMonthNote={s.setMonthNote}
              onClearSel={s.clearSel}
              onSetTheme={s.setTheme}
              onToggleDark={s.toggleDark}
              onDeleteRange={s.deleteRange}
              onSaveRange={() => setShowSaveRange(true)}
            />
          </div>

          {/* Grid */}
          <div
            className="flex-1 min-w-0"
            style={{ borderTop: `0.5px solid ${dm ? "#2a2a4a" : "#f0f0f0"}` }}
          >
            <CalendarGrid
              year={s.year}
              month={s.month}
              rStart={s.rStart}
              rEnd={s.rEnd}
              hoverKey={hoverKey}
              selecting={s.selecting}
              todayKey={s.todayKey}
              dateNotes={s.dateNotes}
              ranges={s.ranges}
              accent={s.theme.accent}
              accentLight={s.theme.accentLight}
              accentDark={s.theme.accentDark}
              darkMode={dm}
              onChangeMonth={handleChangeMonth}
              onClickDate={s.clickDate}
              onDblClick={(k) => setDayModalKey(k)}
              onHover={setHoverKey}
            />
          </div>
        </div>

        {/* Print footer */}
        <div className="hidden print:block px-6 pb-4 text-xs text-gray-400">
          Printed from Wall Calendar · {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-xs text-center print:hidden" style={{ color: dm ? "#3a3a5c" : "#c0c0d0" }}>
        Click to select range · Double-click for day note · Swipe left/right on mobile
      </p>

      {/* Modals */}
      <DayNoteModal
        dateKey={dayModalKey}
        note={dayModalKey ? (s.dateNotes[dayModalKey] ?? "") : ""}
        accent={s.theme.accent}
        darkMode={dm}
        onSave={(k, n) => { s.setDateNote(k, n); setDayModalKey(null); }}
        onClose={() => setDayModalKey(null)}
      />

      <SaveRangeModal
        rStart={showSaveRange ? s.rStart : null}
        rEnd={s.rEnd}
        accent={s.theme.accent}
        darkMode={dm}
        onSave={handleSaveRange}
        onClose={() => setShowSaveRange(false)}
      />
    </div>
  );
}
