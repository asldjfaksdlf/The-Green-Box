# The Green Box

A working UI prototype for a small video-sharing platform — think a scaled-down YouTube, organized around three content types: **podcasts**, **short films**, and **verticals** (short, vertical-format episodic content).

This was built as a clickable, front-end-only example: a homepage feed, category browsing pages, a video watch page with comments and an "up next" rail, and a full upload flow modal. There's no real backend — video playback, accounts, and uploads are simulated with mock data and in-memory state so the entire experience can be demoed and explored.

## What's in here

- **Home feed** — hero spot for the latest episode, plus horizontal rails for each content type
- **Category pages** — full grids for Podcasts, Short Films, and Verticals
- **Watch page** — adapts layout for horizontal (podcast/film) vs. vertical content, with like/subscribe/comment UI and an up-next sidebar
- **Upload flow** — file picker → details form (title, description, category, visibility) → publish confirmation
- **Responsive nav** — collapses to a mobile menu, with search and upload always reachable

## Design direction

The visual identity is built around broadcast/production language rather than a generic streaming-app look: a near-black base, a signal green accent (nodding to a broadcast tally light / "on air" indicator — the namesake "Green Box"), a condensed display face for headlines, and a monospace face for metadata like durations and timestamps.

## Why no real video or accounts

This is meant as a **blueprint and demo**, not a production app. Real video hosting needs transcoding, storage, and CDN delivery — that's the part worth handing off to a dedicated service (e.g. Cloudflare Stream, Mux, or Bunny Stream) rather than building from scratch. Swap the mock data and the `<VideoPlayerShell>` component for real API calls and a video element backed by one of those, and the rest of the UI (routing, layout, upload form, comments) carries over directly.

## Running it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
the-green-box/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       # React entry point
    └── GreenBox.jsx   # The entire app — pages, components, mock data
```

Everything lives in `GreenBox.jsx` on purpose, so the whole prototype is easy to read top to bottom in one file. Splitting it into smaller files/components is a natural next step for anyone extending this.

## Next steps toward a real product

1. Swap mock arrays for a real API / database (categories: podcast, film, vertical)
2. Wire the upload modal to a video hosting service's upload + transcoding API
3. Add real authentication for accounts and creator uploads
4. Add a moderation queue once uploads are open to the public
