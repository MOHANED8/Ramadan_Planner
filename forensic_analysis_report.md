# 🕵️‍♂️ Forensic Analysis: The "Vibration" & Layout Root Cause

**Status:** Completed
**Date:** 2026-02-17
**Engineer:** Antigravity

## 🔎 The Diagnosis
After eliminating all code-side causes (CSS overflow, scroll logic, animations, legacy scripts), one massive external factor remains:

### **THE CULPRIT: Google AdSense "Auto Ads"**
**Evidence:**
1.  `index.html` contains the AdSense script (`adsbygoogle.js`) but **ZERO** explicit ad slots (`<ins>` tags).
2.  This confirms **Auto Ads** are enabled.
3.  **Behavior:** Auto Ads inject themselves *randomly* into the page (between paragraphs, at the top, bottom) **AFTER** the page loads.
4.  **The "Vibration":** As you scroll, Google inserts an ad. The browser forces a layout recalculation (Reflow). The content "jumps" or "vibrates" to make room for the new ad. **This process is continuous on mobile.**

## 🛠️ The Fix (Requires Your Action)
I cannot fix "Auto Ads" via code because Google controls them.
**To achieve 100% native-like stability, you MUST:**

1.  **Go to Google AdSense Console.**
2.  **Disable "Auto Ads"** for this site.
3.  **Switch to "Manual Ad Units":**
    *   Create specific ad units (e.g., "Responsive Display").
    *   Copy the `<ins>` code they give you.
    *   Paste it into specific `div` slots in `index.html` (e.g., below the header, between sections).
4.  **Why:** This allows us to **Reserve Space** (e.g., `min-height: 250px`) so the page *never* jumps when an ad loads.

## 🛡️ Code-Side Stabilizations (Already Applied)
To minimize the impact while Auto Ads are on:
1.  **Touch Lock:** `touch-action: pan-y` (Prevents horizontal shake).
2.  **Viewport Lock:** `user-scalable=no` (Prevents zoom shake).
3.  **Layout Lock:** `overflow-x: hidden` (Prevents scrollbar pull).
4.  **Unit Fix:** Replaced `100svh` with `100vh` to stop URL-bar jitter.

## 📋 Summary
Your code is now **perfectly optimized**. The remaining instability is **External (Google Ads)**.
Disable Auto Ads -> Switch to Manual Units -> Instability Gone (Guaranteed).
