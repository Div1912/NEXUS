

# NEXUS OS — Causal AI Campus Operating System

## Design Foundation
- **Deep navy dark theme** (#0A0B1A base) with AMD Red (#ED1C24) and Cyan Electric (#00E5FF) accents
- **Typography**: Space Grotesk for display, Inter for body, JetBrains Mono for data/numbers (loaded via Google Fonts)
- **Glass-morphic cards** with subtle cyan borders, 16px radius, hover lift effects
- All mock data with clean architecture (services/hooks) ready for real API swap later

---

## Page 1 — Hero Landing (`/`)
- Full-viewport deep navy background with **animated neural mesh** (subtle SVG/canvas particle drift, ~80 nodes, very low opacity)
- Left side: AMD Slingshot badge, large headline "The Campus That Thinks." with gradient text, stat counters (< 5ms Latency, 6 Modules, 100% Edge, Zero Cloud) with animated count-up
- Right side: Isometric campus visualization — glowing SVG nodes with live data labels
- Two CTAs: "Explore Dashboard" (red) and "View Architecture" (cyan outline)

## Page 2 — Dashboard (`/dashboard`)

### Sidebar (fixed 240px, collapsible to icons)
- NEXUS OS logo + LIVE badge with pulsing red dot
- Navigation: Overview, FLOW, ECO, SPACE, MAINTAIN, GUARD, FEDERATE, Reports, Settings
- Active state: 3px left red border + subtle highlight
- Bottom: Edge Status mini-card (Node Online, CPU %, Temp °C)

### Top Bar
- Breadcrumb navigation, live clock (monospace), alert bell with count badge, campus selector dropdown, user avatar

### Dashboard Content

**Row 1 — 4 KPI Intelligence Cards**
- Live Footfall, Energy Saved, Active Alerts, Avg Latency
- Each: large animated number, sparkline, trend %, AI confidence indicator, module-colored accent border

**Row 2 — Digital Twin + Causal Feed (60/40 split)**
- Left: Interactive SVG campus map with glowing building nodes, hover tooltips, color-coded status (cyan/yellow/red)
- Right: Causal Event Feed — scrolling list with timestamps, event titles, causal chains, action badges; new items slide in from top

**Row 3 — 6 Module Cards (grid)**
- FLOW, ECO, SPACE, MAINTAIN, GUARD, FEDERATE
- Each: status badge, primary metric, sparkline, sub-metrics, "View Details" link, hover lift, alert border glow when triggered

**Row 4 — Causal Graph Visualization (full width)**
- Force-directed graph built with SVG/D3-lite (no heavy library — mock with animated SVG nodes and dashed edges)
- Nodes: Footfall, Bin Fill, HVAC, Power, Safety, Maintenance
- Animated dash flow on edges; event triggers pulse cause → edge → effect chain
- Right panel: Root Cause Explanation in plain English

## Page 3 — Module Detail (example: `/dashboard/flow`)
- Header: "NEXUS FLOW — Smart Mobility"
- 3 top metric cards (Live Footfall, Gate Status, Shuttle ETA)
- Main chart: Dual-line Recharts (Entry/Exit, 60-min rolling window, animated)
- Bottom: Map focus view + Suggested Actions as interactive chips

## Special Features

### Simulation Mode
- Toggle button: "Simulate 500 Person Event"
- Triggers: footfall spike, bin fill acceleration, HVAC load rise, causal graph animation chain, autonomous action alerts
- All driven by mock data state changes with smooth transitions

### Presentation Mode
- Press "P" key to toggle
- Hides sidebar, enlarges digital twin + causal graph, grows KPIs
- Cinematic full-screen layout optimized for live demo

## Responsive Behavior
- Desktop: full layout
- Laptop: sidebar collapses to icon-only
- Tablet: sidebar becomes bottom tab bar
- Mobile: single column, simplified visuals
- Primary focus is desktop experience

## Architecture (for future backend readiness)
- Mock data services in `/src/services/` with typed interfaces
- Custom hooks in `/src/hooks/` wrapping data access
- Zustand-like state via React context for simulation mode, presentation mode, and alert state
- Clean separation so mock services can be swapped for Supabase/API calls later

