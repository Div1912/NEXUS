

# Final Functional Polish & UX Enhancement Plan

## 1. Landing Page Module Cards — Remove Internal Data
**File: `src/components/landing/HeroLanding.tsx`**
- Remove the `metric` field from the six module cards in the architecture section (lines 122-127). These currently show live internal metrics like "1,247/hr" which shouldn't be visible on a public landing page for an OS product.
- Replace with capability descriptors (e.g., "Real-time" for FLOW, "Autonomous" for ECO, "30 Zones" for SPACE, "Predictive" for MAINTAIN, "48 Cameras" for GUARD, "6 Nodes" for FEDERATE) — framed as hardware specs, not live data.

## 2. "OS Boot" Transition on Dashboard Entry
**New file: `src/components/landing/BootSequence.tsx`**
- Create a full-screen overlay component that triggers when "Explore Dashboard" is clicked.
- Shows a terminal-style boot sequence (400ms): "NEXUS OS v2.1 INITIALIZING... EDGE NODES: 6/6 ONLINE... CAUSAL ENGINE: LOADED... ACCESS GRANTED" with a fast typewriter effect.
- After sequence completes, programmatically navigates to `/dashboard`.

**File: `src/components/landing/HeroLanding.tsx`**
- Replace direct `navigate('/dashboard')` with state toggle to show boot overlay.

## 3. NEXUS ECO — Add Waste & Water Resources
**File: `src/components/dashboard/ModuleDetailPage.tsx`**
- Expand the `eco` config's `visualization` component to include:
  - Existing energy bar chart (keep).
  - New "Smart Bin Topology" section: 4 vertical progress bars (Cafeteria 78%, Science Block 45%, Library 32%, Sports Complex 61%) with ultrasonic sensor labels.
  - New "Water Consumption / Leak Status" metric block: daily consumption value, leak status indicator, and a simple flow bar.
- Add eco-specific cards for water (e.g., "Water Flow: 2.4 kL/hr") and update the card array.

## 4. NEXUS FLOW — Event Context & Mobility Nudge
**File: `src/components/dashboard/ModuleDetailPage.tsx`**
- Add a prominent "ACTIVE EVENT CONTEXT" badge at the top of the FLOW module page, styled as a high-tech alert strip: "Science Symposium (High Traffic)".
- In the `flow` suggestions array, add a prominent nudge action: "BROADCAST SAFE-MOBILITY NUDGE: Reroute pedestrian flow to Gate C" — styled distinctly (cyan border, pulsing dot) to stand out from other chips.

## 5. NEXUS MAINTAIN — IoT Sensor Rows
**File: `src/components/dashboard/ModuleDetailPage.tsx`**
- Add two rows to the `MaintainRack` equipment array:
  - `{ name: 'Ultrasonic Sensor Array (Gate B)', status: 'online', temp: 28, mtbf: 1200 }`
  - `{ name: 'DHT22 Climate Nodes (Lab 3)', status: 'online', temp: 31, mtbf: 980 }`

## 6. Dashboard Ambient Particles & Micro-interactions
**New file: `src/components/dashboard/AmbientParticles.tsx`**
- Lightweight canvas-based particle layer (~30 particles, very low opacity) rendered behind dashboard content.

**File: `src/components/dashboard/DashboardLayout.tsx`**
- Add AmbientParticles behind the main content area.

**File: `src/index.css`**
- Add global micro-interaction classes: `.interactive-glow` for hover glow effect on all clickable elements, smooth number transition CSS for KPI counters.

**File: `src/components/dashboard/KPICard.tsx`**
- Add CSS transition for number changes (use framer-motion `animate` on value).

**File: `src/components/dashboard/ModuleCard.tsx`**
- Add subtle hover glow border effect.

## 7. Notification Slide-out Panel
**New file: `src/components/dashboard/NotificationPanel.tsx`**
- Sheet/slide-out panel from the right containing recent alerts.
- Each alert: timestamp (mono), title, severity badge (color-coded), module source, dismiss button.
- Uses mock data from `getCausalEvents()`.
- Dismissed alerts removed from local state.

**File: `src/components/dashboard/TopBar.tsx`**
- Wire bell icon to toggle the notification panel open/closed using Sheet component.

## Files Changed Summary
| File | Action |
|------|--------|
| `src/components/landing/HeroLanding.tsx` | Edit: remove internal metrics, add boot trigger |
| `src/components/landing/BootSequence.tsx` | Create: terminal boot overlay |
| `src/components/dashboard/ModuleDetailPage.tsx` | Edit: ECO waste/water, FLOW event badge, MAINTAIN sensors |
| `src/components/dashboard/AmbientParticles.tsx` | Create: canvas particles |
| `src/components/dashboard/DashboardLayout.tsx` | Edit: add particles |
| `src/components/dashboard/NotificationPanel.tsx` | Create: alert slide-out |
| `src/components/dashboard/TopBar.tsx` | Edit: wire bell to panel |
| `src/components/dashboard/KPICard.tsx` | Edit: smooth number transitions |
| `src/components/dashboard/ModuleCard.tsx` | Edit: hover glow |
| `src/index.css` | Edit: micro-interaction utilities |

