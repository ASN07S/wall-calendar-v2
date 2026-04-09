"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  CalendarState, CalendarTheme, DateRange,
  THEMES, cmpKey, nanoid, normalizeRange, toKey,
} from "../types/calendar";

type Action =
  | { type: "CHANGE_MONTH"; dir: 1 | -1 }
  | { type: "CLICK_DATE"; key: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "SAVE_RANGE"; label: string; note: string; color: string }
  | { type: "DELETE_RANGE"; id: string }
  | { type: "SET_DATE_NOTE"; key: string; note: string }
  | { type: "SET_MONTH_NOTE"; monthKey: string; note: string }
  | { type: "SET_THEME"; theme: CalendarTheme }
  | { type: "TOGGLE_DARK" }
  | { type: "HYDRATE"; payload: Partial<CalendarState> };

const today = new Date();

const INIT: CalendarState = {
  year: today.getFullYear(),
  month: today.getMonth(),
  rangeStart: null,
  rangeEnd: null,
  selecting: false,
  ranges: [],
  monthNotes: {},
  dateNotes: {},
  theme: THEMES[0],
  darkMode: false,
};

function reducer(s: CalendarState, a: Action): CalendarState {
  switch (a.type) {
    case "CHANGE_MONTH": {
      let m = s.month + a.dir, y = s.year;
      if (m > 11) { m = 0; y++; }
      if (m < 0) { m = 11; y--; }
      return { ...s, month: m, year: y };
    }
    case "CLICK_DATE": {
      if (!s.selecting || s.rangeStart === null) {
        return { ...s, rangeStart: a.key, rangeEnd: null, selecting: true };
      }
      return { ...s, rangeEnd: a.key, selecting: false };
    }
    case "CLEAR_SELECTION":
      return { ...s, rangeStart: null, rangeEnd: null, selecting: false };
    case "SAVE_RANGE": {
      const { rStart, rEnd } = normalizeRange(s.rangeStart, s.rangeEnd);
      if (!rStart) return s;
      const range: DateRange = {
        id: nanoid(),
        start: rStart,
        end: rEnd ?? rStart,
        label: a.label || "Event",
        note: a.note,
        color: a.color,
      };
      return { ...s, ranges: [...s.ranges, range], rangeStart: null, rangeEnd: null, selecting: false };
    }
    case "DELETE_RANGE":
      return { ...s, ranges: s.ranges.filter(r => r.id !== a.id) };
    case "SET_DATE_NOTE": {
      const dn = { ...s.dateNotes };
      if (a.note.trim()) dn[a.key] = a.note.trim(); else delete dn[a.key];
      return { ...s, dateNotes: dn };
    }
    case "SET_MONTH_NOTE": {
      const mn = { ...s.monthNotes };
      if (a.note.trim()) mn[a.monthKey] = a.note.trim(); else delete mn[a.monthKey];
      return { ...s, monthNotes: mn };
    }
    case "SET_THEME": return { ...s, theme: a.theme };
    case "TOGGLE_DARK": return { ...s, darkMode: !s.darkMode };
    case "HYDRATE": return { ...s, ...a.payload };
    default: return s;
  }
}

const STORAGE_KEY = "wcal-v2";

export function useCalendarState() {
  const [state, dispatch] = useReducer(reducer, INIT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const { year, month, ranges, monthNotes, dateNotes, theme, darkMode } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, month, ranges, monthNotes, dateNotes, theme, darkMode }));
    } catch {}
  }, [state]);

  const { rStart, rEnd } = normalizeRange(state.rangeStart, state.rangeEnd);

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const changeMonth   = useCallback((dir: 1 | -1) => dispatch({ type: "CHANGE_MONTH", dir }), []);
  const clickDate     = useCallback((key: string) => dispatch({ type: "CLICK_DATE", key }), []);
  const clearSel      = useCallback(() => dispatch({ type: "CLEAR_SELECTION" }), []);
  const saveRange     = useCallback((label: string, note: string, color: string) => dispatch({ type: "SAVE_RANGE", label, note, color }), []);
  const deleteRange   = useCallback((id: string) => dispatch({ type: "DELETE_RANGE", id }), []);
  const setDateNote   = useCallback((key: string, note: string) => dispatch({ type: "SET_DATE_NOTE", key, note }), []);
  const setMonthNote  = useCallback((mk: string, note: string) => dispatch({ type: "SET_MONTH_NOTE", monthKey: mk, note }), []);
  const setTheme      = useCallback((theme: CalendarTheme) => dispatch({ type: "SET_THEME", theme }), []);
  const toggleDark    = useCallback(() => dispatch({ type: "TOGGLE_DARK" }), []);

  return { ...state, rStart, rEnd, todayKey, changeMonth, clickDate, clearSel, saveRange, deleteRange, setDateNote, setMonthNote, setTheme, toggleDark };
}
