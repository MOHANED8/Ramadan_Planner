# Forensic Analysis: "Earthquake" Layout Tremors

## 🕵️ Symptoms
Users report "strong tremors" or "earthquake-like" shaking on both desktop and mobile. This indicates a **Layout Thrashing Loop** where rendering logic and CSS rules are fighting each other.

---

## 🔍 Root Cause Analysis

### 1. Lazy Loading Height Mismatch (CRITICAL)
**Location:** `js/app.js` (Lines 264, 335-364)
**Mechanism:**
- `daily-card-placeholder` is set to `min-height: 200px`.
- Actual `daily-card` content is ~600-800px tall.
- When the `IntersectionObserver` triggers, a 200px block is replaced by an 800px block.
- This shifts all subsequent placeholders down by 600px.
- This massive shift triggers *more* intersections for subsequent days.
- **Feedback Loop:** The browser enters a state of rapid, continuous layout recalculation as days "pop" into existence, pushing others into view and causing the page height to vibrate as it tries to calculate the scrollbar position and viewport.

### 2. "Containment" Conflict
**Location:** `style.css` (Line 769, 809, 814)
**Mechanism:**
- `contain: content;` is applied to `.container` and `.daily-card`.
- Containment tells the browser "this element's size is independent of its content" or "don't look outside".
- However, the JavaScript is actively changing the size of the children *inside* these contained boundaries during scroll.
- This creates a conflict where the browser's optimization (containment) is violated by the dynamic injection, causing rendering artifacts that look like "jitter" or "tearing".

### 3. Infinite Pulse Animation
**Location:** `style.css` (Line 722)
**Mechanism:**
- The `.gold-separator` pulses infinitely.
- Even if it uses `transform`, it forces a continuous repainting of the layer.
- On mobile, if the layer isn't hardware-accelerated correctly (or if there are too many), this causes "tremors" as the main thread competes with the GPU thread.

### 4. App Shell Insecurity
**Location:** `style.css` (Lines 36-58)
**Mechanism:**
- The body is `position: relative;`.
- Without `position: fixed;` on the body, mobile browser UI bars (URL bar/Chrome controls) resize when the user scrolls.
- These resize events trigger the `height: 100vh` rules to recalculate.
- This causes a "jumping" effect as the viewport shifts up and down.

---

## 🛠️ Proposed Stabilization Strategy

1. **Fix Placeholder Height:** Set placeholder height to be much closer to the final content height or use a static height for all daily cards.
2. **Lock Body (True App Shell):** Set `body { position: fixed; overflow: hidden; }` and move scrolling to the container to prevent browser UI resize jitter.
3. **Optimized Containment:** Remove `contain: content;` from elements where size changes are expected. Use `content-visibility: auto;` instead (modern alternative).
4. **Kill Dynamic Height Shifts:** Use `aspect-ratio` or fixed heights where possible to reserve space.
5. **Animation Lockdown:** Move infinite animations to `@media (hover: hover)` or only trigger on interaction.
