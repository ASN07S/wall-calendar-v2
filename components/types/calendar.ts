// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarTheme {
  id: string;
  name: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  heroGradient: [string, string];
}

export interface DateRange {
  id: string;
  start: string;
  end: string;
  label: string;
  note: string;
  color: string;
}

export interface CalendarState {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  selecting: boolean;
  ranges: DateRange[];
  monthNotes: Record<string, string>; // "YYYY-MM" -> note
  dateNotes: Record<string, string>;  // "YYYY-MM-DD" -> note
  theme: CalendarTheme;
  darkMode: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const THEMES: CalendarTheme[] = [
  { id: "ocean",  name: "Ocean",  accent: "#0077b6", accentLight: "#caf0f8", accentDark: "#023e8a", heroGradient: ["#90e0ef", "#0077b6"] },
  { id: "forest", name: "Forest", accent: "#2d6a4f", accentLight: "#d8f3dc", accentDark: "#1b4332", heroGradient: ["#95d5b2", "#2d6a4f"] },
  { id: "rose",   name: "Rose",   accent: "#c9184a", accentLight: "#ffccd5", accentDark: "#800f2f", heroGradient: ["#ffb3c1", "#c9184a"] },
  { id: "amber",  name: "Amber",  accent: "#e76f51", accentLight: "#ffddd2", accentDark: "#9c2f00", heroGradient: ["#fec89a", "#e76f51"] },
  { id: "slate",  name: "Slate",  accent: "#4a4e69", accentLight: "#e2e2e9", accentDark: "#22223b", heroGradient: ["#9a8c98", "#4a4e69"] },
];

export const RANGE_COLORS = [
  "#0077b6","#2d6a4f","#c9184a","#e76f51","#7b2d8b","#1d6a96",
];

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DOW = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

// Indian public holidays 2025 & 2026
export const HOLIDAYS: Record<string, string> = {
  "2025-01-26": "Republic Day",
  "2025-03-14": "Holi",
  "2025-04-14": "Dr. Ambedkar Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-12": "Buddha Purnima",
  "2025-08-15": "Independence Day",
  "2025-08-27": "Janmashtami",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-02": "Dussehra",
  "2025-10-20": "Diwali",
  "2025-11-05": "Guru Nanak Jayanti",
  "2025-12-25": "Christmas",
  "2026-01-26": "Republic Day",
  "2026-03-03": "Holi",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-05-31": "Buddha Purnima",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-19": "Dussehra",
  "2026-11-08": "Diwali",
  "2026-12-25": "Christmas",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function toKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function toMonthKey(y: number, m: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

export function parseKey(k: string) {
  const [y, m, d] = k.split("-");
  return { y: +y, m: +m - 1, d: +d };
}

export function cmpKey(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function fmtKey(k: string): string {
  const { y, m, d } = parseKey(k);
  return `${MONTHS[m].slice(0, 3)} ${d}, ${y}`;
}

export function fmtShort(k: string): string {
  const { m, d } = parseKey(k);
  return `${MONTHS[m].slice(0, 3)} ${d}`;
}

export function daysBetween(start: string, end: string): number {
  const s = parseKey(start);
  const e = parseKey(end);
  const sd = new Date(s.y, s.m, s.d);
  const ed = new Date(e.y, e.m, e.d);
  return Math.round(Math.abs(ed.getTime() - sd.getTime()) / 86400000) + 1;
}

export function nanoid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function normalizeRange(start: string | null, end: string | null) {
  if (!start) return { rStart: null, rEnd: null };
  if (!end || start === end) return { rStart: start, rEnd: start };
  return cmpKey(start, end) <= 0
    ? { rStart: start, rEnd: end }
    : { rStart: end, rEnd: start };
}
