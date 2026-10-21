## Compact token summary

- Framework styling: Tailwind CSS 4, global CSS entry `src/app/globals.css`; no `tailwind.config` detected.
- Typeface: Inter (loaded from `src/app/layout.tsx`), sans-serif.
- Current palette: light operational UI; slate neutrals (`slate-50/100/200/400/500/600/700/900`), primary blue (`blue-50/100/500/600/700`), semantic red/green/amber.
- Common radii: `rounded-md`, `rounded-lg`, `rounded-xl`; cards and dialogs use modest rounding.
- Shadows: Tailwind `shadow-sm`, `shadow-lg` in dialogs/menus.
- Breakpoints: Tailwind defaults; responsive shell switches at `md`, account details at `sm`.

## Raw source

```css
@import "tailwindcss";

:root {
  --background: #f8fafc;
  --foreground: #0f172a;

  --primary: #2563eb;
  --primary-dark: #1d4ed8;

  --muted: #64748b;
  --border: #e2e8f0;

  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --info: #0284c7;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

::selection {
  background: var(--primary);
  color: white;
}

:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### `postcss.config.mjs`
```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```
