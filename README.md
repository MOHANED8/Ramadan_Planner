# Ramadan Planner (PWA)

## 1. Project Overview

**Ramadan Planner** is a premium, feature-rich Progressive Web App (PWA) designed to help users maximize their Ramadan experience. It combines spiritual tracking, physical fitness, and daily scheduling into a unified, aesthetically pleasing interface.

Built with modern web technologies, this application works seamlessly offline and can be installed on mobile and desktop devices. The interface supports both **Arabic (default)** and **English**, featuring a sophisticated Gold & Cream theme with glassmorphism effects.

## 2. Features

### 📅 Smart Daily Schedule
- **30-Day Timeline**: A complete month-long schedule that adapts to the user's location.
- **Dynamic Prayer Times**: Automatically fetches precise prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) based on geolocation using the Aladhan API.
- **Suhoor Calculation**: Automatically calculates optimal Suhoor time (45 minutes before Fajr).
- **Task Tracking**: 12 daily checkpoints covering spirituality, fitness, and rest.

### 📖 Quran Completion Tracker
- **Juz Tracking**: A dedicated table to log reading progress (From/To pages) for all 30 days.
- **Hatmah Celebration**: A special modal with a completion prayer (Dua) appears when the user finishes the Quran.

### 🏋️ 30-Day Fitness Program
- **Structured Workouts**: A professionally designed 30-day plan focusing on strength, flexibility, and recovery.
- **Daily Focus**: Each day targets specific muscle groups (e.g., Chest & Triceps, Legs & Glutes, Active Recovery).
- **Detailed Instructions**: Includes warm-up, main exercises, and cool-down routines.

### 🏆 Certificate System
- **Progress Algorithm**: The app tracks completion of daily tasks.
- **Eligibility**: users must complete at least **75%** of daily tasks (9/12 items) to unlock a certificate.
- **Prevention Logic**: Ensures certificates are awarded only once per day to prevent duplicates.
- **Download & Print**: Users can download a personalized PNG certificate or print it directly.

### ⚙️ advanced Technical Features
- **Bilingual Support**: Full RTL (Arabic) and LTR (English) layout support with instant language switching.
- **Offline Mode**: Fully functional offline via Service Worker caching.
- **Data Persistence**: Uses `localStorage` to save all progress, settings, and inputs.
- **Visual Effects**:
    - **Glassmorphism**: Modern UI transparency and blur effects.
    - **3D Animations**: Smooth 3D transforms on scroll and interaction.
    - **Confetti**: Celebratory animation upon unlocking a certificate.

## 3. Technical Architecture

The project follows a modular ES6+ architecture for maintainability and performance.

### Folder Structure
```
/
├── index.html          # Main application entry point
├── style.css           # Core styling and layout
├── style-3d.css        # 3D animations and transforms
├── certificate.css     # Certificate modal styling
├── manifest.json       # PWA configuration
├── sw.js               # Service Worker for offline support
└── js/                 # Application Logic Modules
    ├── app.js          # Core logic (State, Events, UI Rendering)
    ├── translations.js # Localization strings (AR/EN)
    └── workouts.js     # Fitness program data
```

### Core Components
- **`index.html`**: Semantic HTML5 structure. Loads the module-based script.
- **`js/app.js`**: The central controller. It initializes the app, handles the `SAFE_STORAGE` wrapper for persistence, manages the event loop, and coordinates the rendering of the schedule, Quran tracker, and workouts.
- **`sw.js`**: A robust Service Worker that caches the "App Shell" (HTML, CSS, JS, Fonts) to ensure instant loading and offline availability. It uses a **Cache-First** strategy for assets and a **Stale-While-Revalidate** strategy for API data (with fallbacks).
- **`localStorage`**: Used for persisting:
    - User styling preferences (Theme/Language).
    - Task completion status (`day-X-task-Y`).
    - Quran reading progress (`quran_tracker_data`).
    - Certificate history (`certificates_awarded`).

## 4. Dependencies & Drivers

- **Prayer Times API**: [Aladhan.com](https://aladhan.com/prayer-times-api) (Calendar Method 3).
- **html2canvas**: Used to render the DOM element of the certificate into a downloadable image.
- **Google Fonts**: Uses 'Amiri', 'Cairo', and 'Lateef' for premium typography.
- **Canvas API**: Custom implementation in `app.js` for the confetti celebration effect (no external heavy library).
- **Browser APIs**:
    - `Navigator.geolocation`: For accurate prayer times.
    - `ServiceWorker`: For PWA functionality.
    - `localStorage`: For data persistence.

## 5. Certificate Logic

The certificate system uses a deterministic eligibility check:

1.  **Tracking**: Every checkbox toggle updates a localized data structure in `localStorage`.
2.  **Calculation**: `calculateDayProgress(day)` scans the 12 tasks for the specific day.
3.  **Threshold**: If `(completed / 12) >= 0.75`, the `checkCertificateEligibility` function is triggered.
4.  **Awarding**:
    - The system checks `hasCertificateBeenAwarded(day)` to avoid spamming.
    - If eligible and new, it triggers the `showCertificate` modal and the confetti animation.
    - The event is permanently logged in `certificates_awarded`.

## 6. PWA Configuration

To install the app:
1.  **Desktop**: Click the "Install" icon in the browser address bar (Chrome/Edge).
2.  **Mobile (iOS/Android)**: Select "Add to Home Screen" from the browser menu.

**Service Worker Behavior**:
- **Install**: Caches all critical static assets.
- **Activate**: Cleans up old cache versions (current: `ramadan-planner-v9`).
- **Fetch**: Intercepts network requests to serve cached assets when offline.

## 7. Deployment

### Run Locally
You must serve the files via a local server (due to ES Modules and PWA security requirements).
using Python:
```bash
python -m http.server 8080
# Open http://localhost:8080
```
Using Node/NPM:
```bash
npx http-server .
```

### Deploy to Production
This is a static site and can be deployed to any static host.
**Requirements**:
- **HTTPS is mandatory** for Service Worker and Geolocation.
- **GitHub Pages**: Pushed to `gh-pages` branch.
- **Netlify/Vercel**: Drag and drop the folder or connect the repository.

## 8. Performance & Layout Stability

- **True App Shell Architecture**: The background is locked to the viewport (`position: fixed`) while content scrolls independently. This eliminates mobile browser UI jitter.
- **Lazy Loading Stabilization**: Placeholders are calibrated to 600px to prevent layout shifting. All DOM injections are synchronized using `requestAnimationFrame` for 60fps performance.
- **GPU Acceleration**: Critical UI layers are promoted to the GPU via 3D transforms to ensure stutter-free rendering.
- **Zero CLS (Cumulative Layout Shift)**: Space is reserved for all dynamic elements (prayer times, affirmations) to ensure a solid, "vibration-free" reading experience.
- **Responsive Typography**: Font sizes automatically scale (1.8rem on mobile to 3rem on desktop) for perfect readability.

## 9. Accessibility & Compliance

- **WCAG 2.1 AA**: High-contrast focus indicators and semantic structure.
- **Touch Target Enforced**: All interactive elements (buttons, links, inputs) meet the 44x44px standard for precision touch.
- **Reduced Motion Support**: All animations respect OS-level motion preferences.
- **Zero Inline Styles**: 100% separation of concerns for faster parsing and CSP compliance.

## 10. Project Documentation & stability Reports

For deep forensic analysis of the layout and stabilization efforts, see:
- `forensic_tremor_report.md`: Detailed root-cause analysis of the "earthquake" issue.
- `final_stabilization_plan.md`: The roadmap used to achieve zero-vibration performance.
- `comprehensive_tremor_analysis.md`: Analysis of runtime vs. idle vibrations.

## 11. Future Improvements

- **Login/Sync**: Optional cloud sync for cross-device progress.
- **Push Notifications**: Reminders for prayer times and Suhoor.
- **Dark Mode**: A dedicated "Night Mode" for reading Quran in low light.
