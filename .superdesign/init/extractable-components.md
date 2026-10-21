# Reusable components for Superdesign

## AppShell
- Source: `src/components/layout/app-shell.tsx`
- Category: layout
- Description: Authenticated app frame with persistent desktop and mobile navigation plus main content.
- Extractable props: none
- Hardcoded: layout geometry and responsive behavior

## Sidebar
- Source: `src/components/layout/sidebar.tsx`
- Category: layout
- Description: Role-aware navigation, LogiTrack truck mark, sections, and active route styling.
- Extractable props: activeItem (string, default: dashboard)
- Hardcoded: menu labels, Lucide icons, truck icon and LogiTrack wordmark, styling

## Header
- Source: `src/components/layout/header.tsx`
- Category: layout
- Description: Global search, notifications, and account menu.
- Extractable props: notificationCount (number, default: 0)
- Hardcoded: labels, icons, styling

## Breadcrumbs
- Source: `src/components/layout/breadcrumbs.tsx`
- Category: basic
- Description: Route-derived breadcrumb navigation.
- Extractable props: activeItem (string, default: dashboard)
- Hardcoded: home and chevron icons, route labels, styling

## Button
- Source: `src/components/ui/button.tsx`
- Category: basic
- Description: Shared button variants and sizes.
- Extractable props: none
- Hardcoded: variant styles

## Card
- Source: `src/components/ui/card.tsx`
- Category: basic
- Description: Shared content card primitive.
- Extractable props: none
- Hardcoded: card styles

## Badge
- Source: `src/components/ui/badge.tsx`
- Category: basic
- Description: Semantic status badge.
- Extractable props: none
- Hardcoded: variant colors
