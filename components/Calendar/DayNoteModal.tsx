"use client";

import { useEffect, useRef } from "react";
import { fmtKey } from "../types/calendar";

interface Props {
  dateKey: string | null;
  note: string;
  accent: string;
  darkMode: boolean;
  onSave: (key: string, note: string) => void;
  onClose: () => void;
}

export default function DayNoteModal({ dateKey, note, accent, darkMode, onSave, onClose }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const valRef = useRef(note);

  useEffect(() => {
    valRef.current = note;
    if (dateKey && ref.current) { ref.current.value = note; ref.current.focus(); }
  }, [dateKey, note]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && dateKey) onSave(dateKey, valRef.current);
    };
    if (dateKey) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  });

  if (!dateKey) return null;

  const dm = darkMode;
  const cardBg = dm ? "#1a1a2e" : "#fff";
  const inputBg = dm ? "#12122a" : "#f8f8fc";
  const border = dm ? "#2a2a4a" : "#e8e8f0";
  const textPri = dm ? "#e0e0f5" : "#1a1a2e";
  const textMut = dm ? "#6060a0" : "#9ca3af";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: cardBg, border: `0.5px solid ${border}`, animation: "popIn .18s ease-out" }}
      >
        <style>{`@keyframes popIn{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: textMut }}>Day Note</p>
            <h3 className="font-display font-semibold text-base mt-0.5" style={{ color: textPri }}>{fmtKey(dateKey)}</h3>
          </div>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: textMut }}>×</button>
        </div>

        <textarea
          ref={ref}
          defaultValue={note}
          onChange={(e) => (valRef.current = e.target.value)}
          placeholder="What's happening on this day?"
          rows={4}
          className="w-full rounded-xl p-3 text-sm resize-none outline-none leading-relaxed"
          style={{ background: inputBg, border: `0.5px solid ${border}`, color: textPri, fontFamily: "inherit" }}
          onFocus={(e) => (e.target.style.borderColor = accent)}
          onBlur={(e) => (e.target.style.borderColor = border)}
        />

        <p className="text-[10px]" style={{ color: textMut }}>⌘ + Enter to save quickly</p>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-xl" style={{ border: `0.5px solid ${border}`, color: textMut, background: "transparent" }}>
            Cancel
          </button>
          <button
            onClick={() => dateKey && onSave(dateKey, valRef.current)}
            className="text-sm px-4 py-2 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: accent }}
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}
