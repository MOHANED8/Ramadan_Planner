# Comprehensive Analysis: Earthquake Tremors & Idle Vibrations

## 🕵️ Executive Summary
While Phase 15 fixed the "Large Seismic Shifting" (Lazy Loading jumps), users still report a persistent "abnormal tremor" or "vibration". My analysis reveals these are **Idle Vibrations** caused by GPU layer fighting and high-frequency layout recalculated in the background.

---

## 🔍 The "Earthquake" Sources (From All Angles)

### 1. Idle GPU Jitter (The "Not in Use" Tremor)
**Cause:** Infinite CSS Animations & Backdrop Filters.
- **Backdrop-filter Overload:** We are using `backdrop-filter: blur(10px)` on the main container, language switcher, and certificate modal. On mobile, this forces the GPU to re-composite the entire viewport on every frame, even when idle.
- **Infinite Loops:** The Certificate modal has two infinite animations (`float` and `sealPulse`). Even if the modal is hidden or in the background, if it's in the DOM, certain browsers keep the animation cycle active.
- **Symptom:** The screen appears to "shimmer" or "vibrate" even when the user isn't touching it.

### 2. Horizontal "Snapping" Feedback Loop
**Cause:** Width Conflicts + `transition: all`.
- **Name Input Conflict:** The `input#user-name` has `width: 90%` and `transition: all 0.3s`. 
- **The Loop:** If the container width shifts by even 0.5px (due to scrollbar appearing/disappearing), the input tries to transition to the new 90% width over 0.3s. This change shifts the line height or flex context, which might trigger the scrollbar again.
- **Result:** A high-speed "earthquake" vibration as the input field perpetually resizes itself.

### 3. Sub-pixel "Scrollbar Fighter"
**Cause:** `height: 100%` on fixed body + `height: 100%` on container.
- If the container has a `1px` border or `10px` margin, the actual height is `100% + 1px`.
- This causes the container to be *just* enough to trigger a vertical scrollbar.
- Because `overflow-x` is hidden and `overflow-y` is auto, the scrollbar appearing changes the available width, which triggers Step 2 above.

### 4. GPU "Z-Fighting"
**Cause:** Overuse of `translate3d(0,0,0)`.
- While GPU promotion stops jitter, promoting *everything* (container, header, inputs) can cause "Z-fighting" artifacts where layers appear to vibrate against each other if they are at the same sub-pixel depth.

---

## 🛠️ Final Elimination Strategy (Zero Tolerance)

### A. Disable Backdrop Filters on Mobile (Critical)
Backdrop filters are for high-end desktop GPUs. On mobile, they are the #1 cause of "shimmer tremors".
- **Fix:** Move `backdrop-filter` to `@media (hover: hover)` or desktop-only queries. Use solid semi-transparent background fallbacks for mobile.

### B. Kill Infinite Animations
Static luxury is better than vibrating luxury. 
- **Fix:** Replace `infinite float` and `infinite pulse` with one-time entrance animations or subtle hover-only transitions.

### C. Anchor the Name Input
Remove the `all` transition on the input field to prevent it from "fighting" width changes.
- **Fix:** Change to `transition: transform 0.3s, background 0.3s;`.

### D. Absolute Height Lockdown
Use `box-sizing: border-box` and ensure the container is exactly the viewport size minus any offsets.
- **Fix:** Set `box-sizing: border-box` globally and remove margins that cause overflows.
