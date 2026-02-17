# Ultimate App-Shell Stabilization Plan

## Goal
Eliminate 100% of screen "vibration" (layout thrashing) on mobile devices by decoupling the application layout from the browser's dynamic viewport (URL bar resizing).

## 1. The "App Shell" Architecture
Standard mobile web pages resize when you scroll down (URL bar hides). This resizing causes:
*   `100vh` elements to jump.
*   Fixed elements to jitter.
*   Reflows that look like "vibration".

**The Fix:**
We will lock the `<body>` to the screen size and make a direct child element scrollable. This mimics a native app.

## 2. Changes Required

### CSS (`style.css`)
```css
html, body {
    height: 100%;
    width: 100%;
    overflow: hidden; /* STOP body from scrolling */
    position: fixed; /* Lock it in place */
    margin: 0;
    padding: 0;
}

.main-scroll-wrapper {
    height: 100%;
    width: 100%;
    overflow-y: auto; /* The actual scrollbar is here */
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch; /* Momentum scroll */
    position: absolute;
    top: 0;
    left: 0;
    padding-bottom: 50px; /* Space for footer */
}
```

### HTML (`index.html`)
Wrap the entire content of `body` (except scripts/modals) in `<div class="main-scroll-wrapper">`.

## 3. AdSense Considerations
AdSense Auto Ads usually inject into `body`. If `body` is hidden, they might overlay weirdly.
**Adjustment:** We might need to ensure the wrapper has specific z-indices.

## 4. Verification
1.  Scroll down -> URL bar should NOT resize (or if it does, content shouldn't jump).
2.  "Shake" test -> Should be rock solid.
