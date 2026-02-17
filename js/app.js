
import { translations } from './translations.js';
import { workouts, workouts_en } from './workouts.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Multilingual Support ---
    const STORAGE_KEY_LANG = 'ramadan_planner_lang';

    // --- 0.5. Enterprise Sync Manager (Core Data Layer) ---
    const SyncManager = {
        async save(key, value) {
            try {
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, stringValue);

                // Cloud sync hook (Placeholder for Netlify DB / Connect)
                if (navigator.onLine) {
                    // console.log(`[SyncManager] Syncing ${key} to cloud...`);
                    // Future integration: await fetch('/api/sync', { method: 'POST', body: ... })
                }
                return true;
            } catch (e) {
                console.error(`[SyncManager] Save fail for ${key}:`, e);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return defaultValue;
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            } catch (e) {
                console.error(`[SyncManager] Get fail for ${key}:`, e);
                return defaultValue;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error(`[SyncManager] Remove fail:`, e);
                return false;
            }
        }
    };

    let currentLang = SyncManager.get(STORAGE_KEY_LANG) || 'ar'; // Default Arabic

    function updateLanguage(lang) {
        currentLang = lang;
        SyncManager.save(STORAGE_KEY_LANG, lang);

        // Update Direction
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update Static Text
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                    if (key === 'title') { // Re-add dynamic year span
                        element.innerHTML = `${translations[lang][key]} <span class="hijri-year"></span>`;
                        updateHijriYear();
                    }
                }
            }
        });

        // Re-render Dynamic Components
        renderQuranTable();
        renderWorkoutTable();
        renderSchedule();
        updateHijriYear();
    }


    // --- 1. Personalization (Editable Name) ---
    const nameInput = document.getElementById('user-name');
    const STORAGE_KEY_NAME = 'ramadan_planner_name';

    // Load saved name
    const savedName = SyncManager.get(STORAGE_KEY_NAME);
    if (savedName) {
        nameInput.value = savedName;
    }

    // Save name on input change
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            SyncManager.save(STORAGE_KEY_NAME, e.target.value);
        });
    }

    // --- 1.5 Dynamic Hijri Year ---
    function updateHijriYear() {
        try {
            const hijriYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                year: 'numeric'
            }).format(Date.now());

            document.querySelectorAll('.hijri-year').forEach(el => {
                el.textContent = hijriYear;
            });
        } catch (e) {
            console.error("Hijri date error:", e);
            // Fallback if Intl not supported
            document.querySelectorAll('.hijri-year').forEach(el => {
                el.textContent = "١٤٤٧ هـ";
            });
        }
    }
    updateHijriYear();

    // --- 2. Daily Affirmations ---
    const affirmations = [
        "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ",
        "اللَّهُمَّ بَارِكْ لَنَا فِي شَهْرِ رَمَضَانَ",
        "الصَّوْمُ جُنَّةٌ",
        "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
        "اغتنم وقتك في طاعة الله",
        "رمضان فرصة للتغيير للأفضل"
    ];

    // Pick a random affirmation daily (or simply random on load for now)
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    const verseContainer = document.getElementById('daily-verse');
    if (verseContainer) {
        verseContainer.innerHTML = `✨ ${randomAffirmation} ✨`;
    }

    // --- 3. Quran Tracker Table ---
    const quranBody = document.getElementById('quran-table-body');
    const hatmahModal = document.getElementById('hatmah-modal');
    const closeHatmahBtn = document.getElementById('close-hatmah-btn');
    const closeHatmahIcon = document.querySelector('.close-modal');

    function showHatmahModal() {
        if (hatmahModal) {
            hatmahModal.classList.remove('hidden');
        }
    }

    function hideHatmahModal() {
        if (hatmahModal) {
            hatmahModal.classList.add('hidden');
        }
    }

    if (closeHatmahBtn) closeHatmahBtn.addEventListener('click', hideHatmahModal);
    if (closeHatmahIcon) closeHatmahIcon.addEventListener('click', hideHatmahModal);

    window.addEventListener('click', (e) => {
        if (e.target === hatmahModal) {
            hideHatmahModal();
        }
    });

    // Consolidated Quran Tracker Storage
    const QURAN_STORAGE_KEY = 'ramadan_planner_quran';

    function getQuranData() {
        return SyncManager.get(QURAN_STORAGE_KEY, {});
    }

    function saveQuranData(data) {
        SyncManager.save(QURAN_STORAGE_KEY, data);
    }

    function renderQuranTable() {
        if (!quranBody) return;

        let rows = '';
        const MAX_PAGE = 604;
        const t = translations[currentLang];
        const quranData = getQuranData();

        for (let i = 1; i <= 30; i++) {
            const dayData = quranData[`day${i}`] || { from: '', to: '' };

            rows += `<tr>
                <td style="width: 20%;" data-label="${t.quranDay}">${t.quranDay} ${i}</td>
                <td data-label="${t.quranFrom}">
                    <input type="number" class="quran-input" id="quran-day-${i}-from" name="quran-day-${i}-from" data-day="${i}" data-type="from" 
                           placeholder="${t.quranFrom}" min="1" max="${MAX_PAGE}" value="${dayData.from}">
                </td>
                <td data-label="${t.quranTo}">
                    <input type="number" class="quran-input" id="quran-day-${i}-to" name="quran-day-${i}-to" data-day="${i}" data-type="to" 
                           placeholder="${t.quranTo}" min="1" max="${MAX_PAGE}" value="${dayData.to}">
                </td>
            </tr>`;
        }
        quranBody.innerHTML = rows;
        attachQuranListeners();
    }

    function attachQuranListeners() {
        document.querySelectorAll('.quran-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const day = e.target.dataset.day;
                const type = e.target.dataset.type;
                let value = parseInt(e.target.value);
                const MAX_PAGE = 604;

                if (value > MAX_PAGE) {
                    value = MAX_PAGE;
                    e.target.value = MAX_PAGE;
                } else if (value < 1 && e.target.value !== '') {
                    value = 1;
                    e.target.value = 1;
                }

                // Save to consolidated storage
                const quranData = getQuranData();
                const dayKey = `day${day}`;
                if (!quranData[dayKey]) {
                    quranData[dayKey] = { from: '', to: '' };
                }
                quranData[dayKey][type] = e.target.value;
                saveQuranData(quranData);

                if (type === 'to' && value === MAX_PAGE) {
                    showHatmahModal();
                }
            });
        });
    }

    // Initial Render
    renderQuranTable();
    renderWorkoutTable();

    // --- 4. Workout Program ---
    const sportsBody = document.getElementById('sports-table-body');

    // Render function
    function renderWorkoutTable() {
        if (!sportsBody) return;

        const t = translations[currentLang];
        // Select the correct workout array based on language
        const workoutData = currentLang === 'en' ? workouts_en : workouts;

        let rows = '';
        workoutData.forEach(item => {
            rows += `<tr>
                <td data-label="${t.workoutDay}">${t.workoutDay} ${item.day}</td>
                <td data-label="${t.workoutFocus}">${item.focus}</td>
                <td data-label="${t.workoutDetails}">${item.details}</td>
            </tr>`;
        });
        sportsBody.innerHTML = rows;
    }

    // --- 5. Dynamic Daily Schedule & Prayer Times ---
    const daysContainer = document.getElementById('days-container');
    const locationBtn = document.getElementById('btn-location');
    const locationStatus = document.getElementById('location-status');

    // Default Schedule Pattern (Fallback)
    const defaultTimings = {
        Fajr: "05:30",
        Sunrise: "06:45",
        Dhuhr: "13:15",
        Asr: "16:45",
        Maghrib: "19:00",
        Isha: "20:30"
    };

    function renderSchedule(apiTimings = []) {
        if (!daysContainer) return;

        let allDaysHTML = '';
        const isDynamic = apiTimings.length > 0;
        const t = translations[currentLang];

        // Efficient rendering using DocumentFragment
        const fragment = document.createDocumentFragment();

        // Lazy Loading / Virtualization Lite
        // We will render placeholders first, then content when visible
        const createPlaceholder = (day) => {
            const div = document.createElement('div');
            div.className = 'daily-card-placeholder';
            div.dataset.day = day;
            div.style.minHeight = '600px'; /* Match typical card height to prevent jumps */
            div.innerHTML = `<div class="loading-spinner">⏳ Loading Day ${day}...</div>`;
            return div;
        };

        // Render logic for a single day (extracted)
        const generateDayHTML = (day) => {
            // Get timings for this day (or fallback to default)
            const times = isDynamic ? apiTimings[(day - 1) % apiTimings.length].timings : defaultTimings;

            // Calculate Suhoor (Fajr - 45 mins)
            let suhoorTime = "04:30"; // Default
            if (isDynamic) {
                // Ensure reliable parsing of time strings
                const today = new Date().toISOString().split('T')[0];
                const fajrDate = new Date(`${today}T${times.Fajr.split(' ')[0]}`);
                // If date parsing fails, fallback
                if (!isNaN(fajrDate.getTime())) {
                    fajrDate.setMinutes(fajrDate.getMinutes() - 45);
                    suhoorTime = fajrDate.toTimeString().slice(0, 5);
                }
            }

            const scheduleRows = [
                { time: suhoorTime, task: t.suhoor },
                { time: times.Fajr.split(' ')[0], task: t.fajr },
                { time: times.Sunrise.split(' ')[0], task: t.sunrise },
                { time: "10:30", task: t.wakeUp },
                { time: times.Dhuhr.split(' ')[0], task: t.dhuhr },
                { time: "13:30", task: t.rest },
                { time: times.Asr.split(' ')[0], task: t.asr },
                { time: "17:00", task: t.quranTime },
                { time: "17:45", task: t.walk },
                { time: times.Maghrib.split(' ')[0], task: t.maghrib },
                { time: times.Isha.split(' ')[0], task: t.isha },
                { time: "21:30", task: t.workout },
                { time: "22:30", task: t.postWorkout },
                { time: "23:30", task: t.sleep }
            ];

            let dayHTML = `<div class="daily-card" data-day="${day}">`;
            dayHTML += `<div class="daily-title">📅 ${t.scheduleTitle.replace('🗓️ ', '')} ${day}</div>`;
            dayHTML += `<div class="table-wrapper"><table class="table-gold">`;
            dayHTML += `<thead><tr><th>${t.scheduleTime}</th><th>${t.scheduleTask}</th></tr></thead>`;
            dayHTML += `<tbody>`;
            scheduleRows.forEach((item, index) => {
                const taskId = `day-${day}-task-${index}`;
                // Use SafeStorage logic here implicitly or via helper if redefined
                // For simplicity in rendering loop, using localStorage directly but with check
                const isChecked = SyncManager.get(taskId) === true ? 'checked' : '';

                dayHTML += `
                <tr>
                    <td style="font-weight: 600; color: #2e241f; direction: ltr; width: 30%;" data-label="${t.scheduleTime}">${item.time}</td>
                    <td style="text-align: ${currentLang === 'ar' ? 'right' : 'left'}; display: flex; align-items: center; justify-content: space-between;" data-label="${t.scheduleTask}">
                        <span>${item.task}</span>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="${taskId}" name="${taskId}" ${isChecked} class="task-checkbox" data-day="${day}" data-task-index="${index}">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>`;
            });
            dayHTML += `</tbody></table></div></div>`;
            return dayHTML;
        };

        // Clear container
        daysContainer.innerHTML = '';

        // Observer for lazy loading
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const placeholder = entry.target;
                    const day = placeholder.dataset.day;

                    // Sync with screen refresh rate to prevent tremors
                    requestAnimationFrame(() => {
                        const html = generateDayHTML(day);
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        const newContent = tempDiv.firstElementChild;

                        if (placeholder.parentNode) {
                            placeholder.replaceWith(newContent);
                            attachCheckboxListeners();
                        }
                    });

                    obs.unobserve(placeholder);
                }
            });
        }, { rootMargin: "400px" }); // Pre-load 400px before viewport for smoother transition

        // Append placeholders
        for (let day = 1; day <= 30; day++) {
            const placeholder = createPlaceholder(day);
            fragment.appendChild(placeholder);
            observer.observe(placeholder);
        }

        daysContainer.appendChild(fragment);
    }

    function attachCheckboxListeners() {
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const day = e.target.dataset.day;
                const taskIndex = e.target.dataset.taskIndex;
                const taskId = `day-${day}-task-${taskIndex}`;
                const isChecked = e.target.checked;

                // Update storage for persistence
                SyncManager.save(taskId, isChecked);

                // Update progress logic
                trackTaskCompletion(day, taskIndex, isChecked);
            });
        });
    }

    // Initial Render (Static)
    renderSchedule();
    renderWorkoutTable(); // Doubling down to ensure total sync
    renderQuranTable();

    // Event Listener for Location
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                locationStatus.textContent = "الموقع الجغرافي غير مدعوم في متصفحك.";
                return;
            }

            locationStatus.textContent = "جاري تحديد الموقع...";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    locationStatus.textContent = "تم تحديد الموقع! جاري جلب أوقات الصلاة...";
                    fetchPrayerTimes(latitude, longitude);
                },
                () => {
                    locationStatus.textContent = "تعذر الوصول للموقع. تأكد من تفعيل الـ GPS.";
                }
            );
        });
    }

    // Helper to update UI with prayer times
    function updatePrayerTimesUI(data) {
        locationStatus.textContent = "✅ تم تحديث الجدول بأوقات الصلاة لمدينتك!";
        // Handle both full month data (array) and single timings object
        if (Array.isArray(data)) {
            renderSchedule(data);
        } else {
            // If it's a single timings object, create array for all days
            const fullMonthData = Array.from({ length: 30 }, (_, i) => ({
                timings: data,
                date: { gregorian: { day: (i + 1).toString() } }
            }));
            renderSchedule(fullMonthData);
        }
    }

    function fetchPrayerTimes(lat, lon) {
        const CACHE_KEY = 'prayer_times_cache';
        const CACHE_TIME_KEY = 'prayer_times_cache_time';
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

        // Check cache first
        const cachedData = SyncManager.get(CACHE_KEY);
        const cacheTime = SyncManager.get(CACHE_TIME_KEY);

        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION) {
            // Use cached data
            try {
                const parsedData = JSON.parse(cachedData);
                updatePrayerTimesUI(parsedData);
                return;
            } catch (e) {
                console.warn('Cache parse error, fetching fresh data');
            }
        }

        // Fetch fresh data
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const apiUrl = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=3`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API returned ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.data && data.data.length > 0) {
                    SyncManager.save(CACHE_KEY, data.data); // Cache full month data
                    SyncManager.save(CACHE_TIME_KEY, Date.now().toString());
                    updatePrayerTimesUI(data.data); // Pass full month data to update UI
                } else {
                    throw new Error('Invalid API response format');
                }
            })
            .catch(err => {
                console.error('Prayer times API error:', err);
                // Show fallback times (Cairo, Egypt as default)
                const fallbackTimes = {
                    Fajr: '04:30',
                    Sunrise: '05:45',
                    Dhuhr: '12:00',
                    Asr: '15:30',
                    Maghrib: '18:00',
                    Isha: '19:30'
                };
                // Create a full month's data using fallback times for renderSchedule
                const fallbackMonthData = Array.from({ length: 30 }, (_, i) => ({
                    timings: fallbackTimes,
                    date: { gregorian: { day: (i + 1).toString() } }
                }));
                updatePrayerTimesUI(fallbackMonthData);
                locationStatus.textContent = "خطأ في الاتصال بالشبكة. استخدام أوقات افتراضية.";
                console.warn('Using fallback prayer times. Please check your internet connection.');
            });
    }

    // --- Language Switcher Setup (MUST BE LAST) ---
    // Initialize after all data and functions are loaded
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.value = currentLang;
        langSwitch.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
        // Apply initial language (re-renders everything with correct language)
        updateLanguage(currentLang);
    }

    // ========================================
    // CERTIFICATE SYSTEM
    // ========================================
    const STORAGE_KEY_PROGRESS = 'ramadan_daily_progress';
    const CERT_STORAGE_KEY = 'certificates_awarded';

    // --- Streak System ---
    function updateStreak() {
        // Calculate current streak based on daily progress
        let streak = 0;
        const progress = getProgressData();
        const today = new Date(); // In a real app we'd need robust date handling matching the planner's "Day 1" logic

        // Simple logic: Scan days 1 to 30, find consecutive days with >0 tasks
        // For this planner (which is 30 fixed days), we'll Just count total active days for now as "Consistency Score"
        // making it robust for a static 30-day planner is tricky without real dates.
        // Let's stick to "Total Active Days" as a proxy for engagement.
        let activeDays = 0;
        for (let i = 1; i <= 30; i++) {
            const dayKey = `day-${i}`;
            if (progress[dayKey] && progress[dayKey].tasks && progress[dayKey].tasks.some(t => t)) {
                activeDays++;
            }
        }

        const streakEl = document.getElementById('streak-counter');
        if (streakEl) {
            streakEl.innerHTML = `🔥 ${activeDays} <span style="font-size:0.8em; opacity:0.8">يوم نشط</span>`;
        }
    }

    // Call updateStreak whenever progress changes


    // Certificate tracking functions
    function getCertificatesAwarded() {
        return SyncManager.get(CERT_STORAGE_KEY, {});
    }

    function markCertificateAwarded(day, percentage) {
        const certs = getCertificatesAwarded();
        certs[`day_${day}`] = {
            awarded: true,
            timestamp: Date.now(),
            percentage: percentage
        };
        SyncManager.save(CERT_STORAGE_KEY, certs);
    }

    function hasCertificateBeenAwarded(day) {
        const certs = getCertificatesAwarded();
        return certs[`day_${day}`]?.awarded === true;
    }

    // Get or initialize progress data
    function getProgressData() {
        return SyncManager.get(STORAGE_KEY_PROGRESS, {});
    }

    // Save progress data
    function saveProgressData(data) {
        SyncManager.save(STORAGE_KEY_PROGRESS, data);
    }

    // Track task completion
    function trackTaskCompletion(day, taskIndex, isChecked) {
        const progress = getProgressData();
        const dayKey = 'day-' + day;

        if (!progress[dayKey]) {
            progress[dayKey] = {
                tasks: [],
                certificateAwarded: false
            };
        }

        // Ensure tasks array is big enough
        if (!progress[dayKey].tasks) progress[dayKey].tasks = [];

        progress[dayKey].tasks[taskIndex] = isChecked;
        saveProgressData(progress);

        checkCertificateEligibility(day);
        updateGlobalProgress();
        updateStreak();
    }

    // Calculate day progress
    function calculateDayProgress(day) {
        const progress = getProgressData();
        const dayKey = 'day-' + day;
        const dayData = progress[dayKey];

        if (!dayData || !dayData.tasks) {
            return { percentage: 0, completed: 0, total: 12 };
        }

        const total = 12; // Fixed number of tasks per day
        const completed = dayData.tasks.filter(t => t).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { percentage, completed, total };
    }

    // Check if eligible for certificate
    function checkCertificateEligibility(day) {
        // Check if certificate already awarded for this day
        if (hasCertificateBeenAwarded(day)) {
            return; // Already awarded, don't show again
        }

        const { percentage } = calculateDayProgress(day);

        // Requirement: 75% or more
        if (percentage >= 75) {
            showCertificate(day, percentage);

            // Mark as awarded locally + update progress object
            markCertificateAwarded(day, percentage);

            const progress = getProgressData();
            const dayKey = 'day-' + day;
            if (progress[dayKey]) {
                progress[dayKey].certificateAwarded = true;
                progress[dayKey].awardedAt = new Date().toISOString();
                saveProgressData(progress);
            }
        }
    }

    // Update global progress bar
    function updateGlobalProgress() {
        const progressBar = document.getElementById('global-progress-bar');
        const progressText = document.getElementById('global-progress-text');
        const completedCount = document.getElementById('completed-tasks-count');
        const totalCount = document.getElementById('total-tasks-count');

        if (!progressBar || !progressText || !completedCount || !totalCount) return;

        const totalTasks = 30 * 12; // 30 days × 12 tasks
        let completed = 0;

        // Count all completed tasks from storage directly for accuracy
        for (let day = 1; day <= 30; day++) {
            for (let taskIndex = 0; taskIndex < 12; taskIndex++) {
                const taskId = `day-${day}-task-${taskIndex}`;
                if (SyncManager.get(taskId) === true) {
                    completed++;
                }
            }
        }

        const percentage = Math.round((completed / totalTasks) * 100);

        // Update UI
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
        completedCount.textContent = completed;
        totalCount.textContent = totalTasks;

        // Change color based on progress
        if (percentage >= 75) {
            progressBar.style.background = 'linear-gradient(90deg, #f39c12 0%, #e67e22 100%)'; // Gold
        } else if (percentage >= 50) {
            progressBar.style.background = 'linear-gradient(90deg, #3498db 0%, #2980b9 100%)'; // Blue
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)'; // Green
        }
    }

    // Show certificate modal
    function showCertificate(day, percentage) {
        const modal = document.getElementById('certificate-modal');
        if (!modal) return;

        const userNameInput = document.getElementById('user-name');
        const userName = userNameInput ? userNameInput.value : '';
        const defaultName = currentLang === 'ar' ? 'المستخدم' : 'User';

        const certUserName = document.getElementById('cert-user-name');
        const certPercentage = document.getElementById('cert-percentage');
        const certDayNumber = document.getElementById('cert-day-number');
        const certHijriDate = document.getElementById('cert-hijri-date');
        const certGregorianDate = document.getElementById('cert-gregorian-date');

        if (certUserName) certUserName.textContent = userName || defaultName;
        if (certPercentage) certPercentage.textContent = percentage + '%';
        if (certDayNumber) certDayNumber.textContent = day;

        const now = new Date();
        if (certHijriDate) {
            const hijriLocale = currentLang === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic';
            try {
                certHijriDate.textContent = now.toLocaleDateString(hijriLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                // Fallback
                certHijriDate.textContent = now.toLocaleDateString();
            }
        }
        if (certGregorianDate) {
            const locale = currentLang === 'ar' ? 'ar-SA' : 'en-US';
            certGregorianDate.textContent = now.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        modal.style.display = 'flex';
        playConfetti();
    }

    // Confetti animation
    function playConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 60 : 150; // Reduce load on mobile
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 2,
                d: Math.random() * 150,
                color: ['#d4af37', '#b38b2d', '#f3e5b5', '#FFD700'][Math.floor(Math.random() * 4)],
                tilt: Math.random() * 10 - 10,
                tiltAngleIncremental: Math.random() * 0.07 + 0.05,
                tiltAngle: 0
            });
        }

        let angle = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            angle += 0.01;

            particles.forEach((p, i) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(angle + p.d) + 3 + p.r / 2) / 2;
                p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

                ctx.beginPath();
                ctx.lineWidth = p.r / 2;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
                ctx.stroke();

                if (p.y > canvas.height) p.y = -10;
            });

            if (canvas.style.display !== 'none') {
                requestAnimationFrame(draw);
            }
        }

        draw();

        // Phase 16: Hard cleanup of rendering canvas to prevent idle GPU usage
        setTimeout(() => {
            canvas.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the buffer
        }, 5000);
    }

    // Download certificate
    const downloadBtn = document.getElementById('download-cert');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const cert = document.getElementById('certificate');
            if (!cert || typeof html2canvas === 'undefined') return;

            html2canvas(cert, { scale: 2, backgroundColor: '#fefcf2' }).then(canvas => {
                const link = document.createElement('a');
                const dayNum = document.getElementById('cert-day-number');
                const day = dayNum ? dayNum.textContent : '1';
                link.download = 'Ramadan-Certificate-Day-' + day + '.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        });
    }

    // Print certificate
    const printBtn = document.getElementById('print-cert');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    const closeBtn = document.getElementById('close-cert');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('certificate-modal');
            if (modal) modal.style.display = 'none';
            // Stop confetti immediately
            const canvas = document.getElementById('confetti-canvas');
            if (canvas) canvas.style.display = 'none';
        });
    }

    // Initial global progress check
    updateGlobalProgress();

    // --- PWA Install Logic ---
    let deferredPrompt;
    const installBtn = document.getElementById('btn-install');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    window.addEventListener('appinstalled', () => {
        // Hide the app-provided install promotion
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt = null;
    });
});
