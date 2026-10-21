# LogiTrack glassmorphism design system

## Brand and product feel
LogiTrack is an operational logistics dashboard. Preserve the truck icon plus LogiTrack wordmark, information hierarchy, dense data tables, status cues, and direct navigation. Use a calm, trustworthy glassmorphism treatment rather than decorative blur everywhere.

## Visual foundation
- App canvas: pale blue-gray background with subtle blue/sky illumination.
- Glass surfaces: translucent white (`rgba(255,255,255,.68–.84)`), thin white/blue borders, restrained backdrop blur (12–20px), soft layered shadow. Keep text high contrast.
- Primary: deep logistics blue for active navigation, primary actions, links, and focus states.
- Semantic colors: preserve status colors; badges use lightly tinted surfaces and readable text.
- Typography: Inter and the existing compact dashboard hierarchy.
- Radius: 12–18px for panels/cards, 10–12px for controls; avoid excessive pills.
- Tables and forms: maintain legibility with subtle row separators, readable surface opacity, visible labels, and clear input focus states.

## Components
- Sidebar: translucent fixed panel with current role-filtered navigation, active item blue glass highlight, exact existing labels/icons.
- Top bar: translucent header with search, notifications, and account controls.
- Cards: shared glass surface; keep metrics/data/actions prominent.
- Dialogs: readable modal surface with backdrop dimming and existing accessibility affordances.
- Responsive: preserve desktop sidebar and mobile drawer behavior.

## Guardrails
Do not change workflows, routes, data fields, permission rules, status semantics, or copy. Preserve the existing truck icon and wordmark treatment. Avoid low contrast, excessive gradients, and blur on every nested element.
