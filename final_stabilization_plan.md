# Final Stabilization: Zero-Vibration Plan

The goal is to move from "mostly stable" to "rock solid" by removing all high-frequency GPU and layout triggers.

---

## 1. CSS Optimization (`style.css` & `certificate.css`)
- [ ] **Disable Mobile Blur:** Remove `backdrop-filter` for all elements on screens < 768px.
- [ ] **Static Luxury:** Remove `infinite` keyframe loops (float, pulse, etc.).
- [ ] **Input Fix:** Remove `transition: all` from `input#user-name`. Specifically restrict transitions to non-layout-triggering properties.
- [ ] **Box Model Sizing:** Ensure `box-sizing: border-box` is respected to prevent the "100% + border" overflow.

## 2. Layout Containment
- [ ] Set `max-width: 100vw; overflow-x: hidden;` on the `.container` to prevent horizontal seismic shifts.
- [ ] Remove `will-change: scroll-position` (it's often counter-productive on modern mobile browsers).

## 3. Rendering Polish (`js/app.js`)
- [ ] Ensure the confetti canvas is **actually removed** from the DOM or set to `display: none` immediately after the 5s timer.

## 4. Verification
- [ ] Test on a mobile device and observe **Idle Jitter**.
- [ ] Rapidly scroll and check for **Scrollbar Flicker**.
- [ ] Check for **Horizontal Slide** (the "Seismic Shift").
