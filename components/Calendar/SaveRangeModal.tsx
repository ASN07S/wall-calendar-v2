"use client";

import { useEffect, useRef, useState } from "react";
import { fmtKey, normalizeRange, RANGE_COLORS } from "../types/calendar";

interface Props {
  rStart: string | null;
  rEnd: string | null;
  accent: string;
  darkMode: boolean;
  onSave: (label: string, note: string, color: string) => void;
  onClose: () => void;
}

export default function SaveRangeModal({ rStart, rEnd, accent, darkMode, onSave, onClose }: Props) {
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(RANGE_COLORS[0]);
  const labelRef = useRef<HTMLInputElement>(null);

  const { rStart: s, rEnd: e } = normalizeRange(rStart, rEnd);

  useEffect(() => {
    if (rStart) {
      setLabel(""); setNote(""); setColor(accent);
      setTimeout(() => labelRef.current?.focus(), 60);
    }
  }, [rStart, accent]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!rStart) return null;

  const dm = darkMode;
  const cardBg = dm ? "#1a1a2e" : "#ffffff";
  const inputBg = dm ? "#12122a" : "#f8f8fc";
  const border = dm ? "#2a2a4a" : "#e8e8f0";
  const textPri = dm ? "#e0e0f5" : "#1a1a2e";
  const textMut = dm ? "#6060a0" : "#9ca3af";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(ev) => ev.target === ev.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: cardBg, border: `0.5px solid ${border}`, animation: "popIn .18s ease-out" }}
      >
        <style>{`@keyframes popIn{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: textMut }}>Save Event</p>
            <p className="text-sm font-display font-semibold mt-0.5" style={{ color: textPri }}>
              {s && e && s !== e ? `${fmtKey(s)} → ${fmtKey(e)}` : s ? fmtKey(s) : ""}
            </p>
          </div>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: textMut }}>×</button>
        </div>

        {/* Label */}
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase block mb-1.5" style={{ color: textMut }}>Event title</label>
          <input
            ref={labelRef}
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Birthday, Vacation, Sprint…"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: inputBg, border: `0.5px solid ${border}`, color: textPri }}
            onFocus={e => e.target.style.borderColor = accent}
            onBlur={e => e.target.style.borderColor = border}
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase block mb-1.5" style={{ color: textMut }}>Note (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Any details…"
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
            style={{ background: inputBg, border: `0.5px solid ${border}`, color: textPri, fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = accent}
            onBlur={e => e.target.style.borderColor = border}
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase block mb-2" style={{ color: textMut }}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {RANGE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full transition-transform"
                style={{
                  background: c,
                  border: c === color ? `2px solid ${dm?"#fff":"#333"}` : "2px solid transparent",
                  transform: c === color ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-lg"
            style={{ border: `0.5px solid ${border}`, color: textMut, background: "transparent" }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(label || "Event", note, color); }}
            className="text-sm px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: color }}
            disabled={!rStart}
          >
            Save event
          </button>
        </div>
      </div>
    </div>
  );
}
