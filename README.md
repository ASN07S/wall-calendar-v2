<<<<<<< HEAD
# wall-calendar
Interactive wall calendar built with Next.js 14, TypeScript &amp; Tailwind CSS. Features day range selection with live hover preview, named events with color labels, per-date &amp; monthly notes, dark mode, 5 color themes, 12 SVG hero illustrations, Indian holiday markers, touch swipe navigation &amp; localStorage persistence.
=======
# Wall Calendar — Interactive Next.js Component

> A polished, production-grade interactive calendar built for the Frontend Engineering Challenge.

**[Live Demo →](https://your-vercel-url.vercel.app)** &nbsp;|&nbsp; **[Video Demo →](https://loom.com/your-video)**

---

## Features

### Core Requirements ✅
| Requirement | Implementation |
|---|---|
| Wall calendar aesthetic | Wire binding, hero illustration, chevron badge layout matching reference image |
| Day range selector | Click start → click end; visual states for start, end, in-range days |
| Notes section | Month-level notes + per-date notes (double-click) + range event notes |
| Fully responsive | Side-by-side on desktop; stacked on mobile with touch swipe navigation |

### Extras 🚀
- **Month flip animation** — hero slides in from the correct direction on month change
- **Holiday markers** — Indian public holidays (2025–2026) shown with amber dots + tooltips
- **Save events** — name a date range with a label, note, and color; shows inline on calendar
- **Dark mode** — full dark/light toggle, persisted to localStorage
- **5 color themes** — Ocean, Forest, Rose, Amber, Slate; switches accent color globally
- **12 unique hero illustrations** — one hand-crafted SVG scene per calendar month
- **Touch swipe** — swipe left/right on mobile to change months
- **Print styles** — Ctrl/Cmd + P renders a clean calendar printout
- **Keyboard accessible** — full keyboard navigation, ARIA labels, focus rings
- **Persistent state** — all notes, events, theme, dark mode saved to localStorage

---

## Getting Started

```bash
# 1. Clone / unzip
cd wall-calendar

# 2. Install
npm install

# 3. Dev server
npm run dev
# → http://localhost:3000

# 4. Production build
npm run build && npm start
```

**Node.js 18+ required.**

---

## Project Structure

```
app/
  layout.tsx        Server Component — fonts, metadata
  page.tsx          Page entry (just renders <Calendar />)
  globals.css       Tailwind base, print styles, scrollbar

components/
  Calendar/
    index.tsx       "use client" root — state wiring, modals, animation
    HeroImage.tsx   12 SVG month scenes + animated badge
    CalendarGrid.tsx Day grid — range logic, holidays, touch, keyboard
    NotesPanel.tsx  Month notes, saved events list, theme + dark toggle
    DayNoteModal.tsx Per-date note modal
    SaveRangeModal.tsx Save a named, colored event for a range
  hooks/
    useCalendarState.ts  useReducer + localStorage persistence
  types/
    calendar.ts     Types, constants (themes, holidays, months), helpers
```

---

## Architecture Decisions

### State: `useReducer` in a custom hook
All calendar state lives in `useCalendarState`. A reducer handles every transition predictably — no prop drilling, no external libraries. Easy to unit test. Persisted to `localStorage` via a `useEffect`.

### Framework: Next.js 14 App Router
The page shell is a Server Component; only the Calendar tree is `"use client"`. This is the cleanest split — ready to extend with RSC data fetching (e.g. pulling events from an API) without refactoring.

### Styling: Tailwind + inline styles for dynamic values
Tailwind handles layout and static styles. Dynamic values (accent colors, dark mode backgrounds) use inline `style` props with CSS variables — avoids JIT class generation issues with runtime values.

### No external state library
`useReducer` + a custom hook is the right scope for this problem. Zustand/Redux would add complexity without benefit here.

### Animations: CSS keyframes + React key trick
Month transitions use a `key` prop change on the hero to re-trigger a CSS `@keyframes` animation. No Framer Motion dependency needed for this effect — keeps the bundle lean.

---

## Deploy

```bash
# Vercel (recommended — one command)
npx vercel

# Netlify
npm run build
# Upload the .next folder
```

---

## What I'd Add With More Time
- **Drag to select** date range instead of two-click
- **iCal export** of saved events
- **Recurring events** support
- **Multi-month view** toggle
- **Unit tests** with Vitest + Testing Library for the reducer and grid logic
>>>>>>> e59c36e (feat: interactive wall calendar component)
