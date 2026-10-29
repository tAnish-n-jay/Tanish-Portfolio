# Tanish N Jay — Portfolio

A cinematic, single-page developer portfolio built with React + Vite. Designed around the supplied text-free portrait, bold scroll-driven typography, subtle cursor feedback, detailed project cards, GitHub activity, LeetCode stats, achievements, resume preview/download, and contact links.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

To test a production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import that repository into Vercel.
3. Vercel should detect Vite automatically. Build command: `npm run build`; output directory: `dist`.
4. Deploy. The `/api/leetcode` serverless function is included for Vercel.

## Live data notes

- GitHub profile and public repositories use the official public GitHub REST API.
- The GitHub contribution heatmap uses `github-contributions-api.jogruber.de`. This is a third-party public data source, so the heatmap may be unavailable temporarily.
- LeetCode statistics are requested through the unofficial Alfa LeetCode community API from the Vercel serverless function at `api/leetcode.js`. It may be slow, rate-limited, or unavailable. The UI shows a fallback instead of treating unavailable fields as live data.
- The LeetCode total uses the user's confirmed baseline of 366 until a usable live total is returned. The 1489 contest rating is a baseline from the supplied resume until the live source returns a value.
- The LeetCode submission heatmap is rendered only when the API response includes a usable submission calendar. If the provider does not expose it, the UI explains that the calendar is unavailable.
- GitHub repository cards are live. The four featured project cards are curated initial selections based on the resume; verify each repository URL and replace profile-level placeholders with exact repository URLs as needed.

## Personalization

Edit `src/main.jsx`:
- `featured`: project descriptions, repository URLs, technologies, and featured project selection.
- `skillGroups`: skills.
- `email`, profile handles, introduction, and achievements.

The supplied resume PDF and portrait are in `public/assets/`.

## Accessibility and performance

- Responsive layout, mobile navigation, keyboard-accessible links and buttons.
- Respects `prefers-reduced-motion`.
- The custom cursor is only enabled for fine-pointer devices.
- Scroll effects use CSS custom properties and requestAnimationFrame.
