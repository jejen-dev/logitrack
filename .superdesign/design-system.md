# LogiTrack glassmorphism design system

## Brand and product feel
LogiTrack is an operational logistics dashboard. Preserve the truck icon plus LogiTrack wordmark, information hierarchy, dense data tables, status cues, and direct navigation. Use a calm, trustworthy glassmorphism treatment rather than decorative blur everywhere.

## Visual foundation
- App canvas: calm, near-solid pale blue (`#eef3fa`) with two faint corner glows; avoid busy multi-color gradients.
- Glass surfaces: driven by `--glass-*` tokens in `globals.css` — translucent white (`.56`, `.86` for menus/dialogs), diagonal white sheen, white edge highlight, `blur(22px) saturate(170%)`, layered blue-tinted shadow. Keep text high contrast; reduced-transparency and no-backdrop-filter fallbacks go near-opaque.
- Primary: professional cobalt blue (`blue-600` = `#2a5fcf`, overridden via `@theme` in `globals.css`); single-hue `blue-600→blue-700` depth on primary actions, brand mark, and avatar; no indigo/cyan gradients.
- Semantic colors: preserve status colors; badges use lightly tinted surfaces and readable text.
- Typography: Plus Jakarta Sans and the existing compact dashboard hierarchy.
- Radius: 12–18px for panels/cards, 10–12px for controls; avoid excessive pills.
- Tables and forms: maintain legibility with subtle row separators, readable surface opacity, visible labels, and clear input focus states. Standard inputs and single-select controls share a 40px height. Keep selects native for keyboard, screen-reader, and form behavior while styling them with the glass surface, custom chevron, and clear focus state.

## Components
- Sidebar: translucent fixed panel with current role-filtered navigation, active item blue glass highlight, exact existing labels/icons.
- Top bar: translucent header with search, notifications, and account controls.
- Cards: shared glass surface; keep metrics/data/actions prominent.
- Dialogs: readable modal surface with backdrop dimming and existing accessibility affordances.
- Responsive: preserve desktop sidebar and mobile drawer behavior.

## Guardrails
Do not change workflows, routes, data fields, permission rules, status semantics, or copy. Preserve the existing truck icon and wordmark treatment. Avoid low contrast, excessive gradients, and blur on every nested element.
