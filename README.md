# Rounding on a Number Line

A small Svelte + Vite app that helps third graders practice rounding by finding the
**starting point**, **end point**, and **midpoint (halfway)** on a number line.

For each number the student works through four steps:

1. Starting point — the nearest ten/hundred below the number (e.g. 325 → 320)
2. End point — the nearest ten/hundred above (330)
3. Midpoint — halfway between them (325)
4. Round up or round down? Numbers at or past the midpoint round up.

The number line reveals each label as it's found, then draws an arrow showing which
way the number rounds. Wrong answers get a hint; after two misses a "Show me" button
appears.

Settings: round to the nearest **10** or **100**, use numbers up to **100** (matching
classroom number lines) or **1,000**, or type in your own number.

## Run it

```sh
npm install
npm run dev
```

Build for deployment with `npm run build` (output in `dist/`).
