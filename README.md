# Linkin Park - From Zero World Tour Retrospective

An interactive retrospective of Linkin Park's From Zero World Tour (2024-2026) - every setlist, every city, mapped. Browse the whole run, see how the set shifted leg by leg, dive into any song's history, compare any two nights, and pull up the recap for the show you were at.

🔗 **Live:** [lpsetlists.com](https://lpsetlists.com)

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-cyan)

## Features

- **Tour at a glance** - editorial hero with count-up stats (shows, legs, countries, songs)
- **Song × leg heatmap** - a visualization of how the setlist changed across the tour; click any song for its full history
- **Song deep-dives** - per-song stats: total plays, typical set position, per-leg breakdown, last played
- **Find your show** - pick the night you attended and download a shareable recap card
- **Side-by-side comparison** - compare any two shows, shared vs unique songs highlighted, export as an image
- **The Data** - the full song × leg matrix plus superlatives (most played, one-offs)
- **The Songbook** - every Linkin Park song with its abbreviation and tour-play count

## Tech

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS v4**
- **React Router 7**
- **html-to-image** (shareable recap / comparison export)

The entire app runs on **bundled local data** - no backend, no API key. Setlist data (originally sourced from setlist.fm) lives in `src/data/tours/` as one JSON file per tour leg.

## Getting started

```bash
npm install
npm run dev
```

Requires **Node 20+**. That's it - no environment variables or API keys.

Build for production:

```bash
npm run build
```

## Design

A 2000s-grunge editorial direction (Hybrid Theory / Meteora era): warm near-black with film grain, a single burnt-orange accent, oversized condensed poster type, and mono microcopy.

## Credits

- **Data**: [setlist.fm](https://www.setlist.fm/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Type**: Anton + Archivo (Google Fonts)
- Built by a fan and LPU member who caught the tour in Denver and Seattle.

## License

Personal / fan project. Setlist data is provided by setlist.fm and subject to their terms of service.

---

Made with ❤️ for Linkin Park fans - by [Elina](https://elinashelest.com)
