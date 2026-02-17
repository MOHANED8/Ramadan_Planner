// Ramadan Planner - Script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Multilingual Support ---
    const STORAGE_KEY_LANG = 'ramadan_planner_lang';
    let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'ar'; // Default Arabic

    const translations = {
        ar: {
            title: "مخطط رمضان الذهبي الفاخر",
            namePlaceholder: "اكتب اسمك هنا",
            locationBtn: "📍 تحديد موقعي (أوقات الصلاة)",
            locationWait: "جاري تحديد الموقع...",
            locationSuccess: "✅ تم تحديث الجدول بأوقات الصلاة لمدينتك!",
            locationError: "تعذر الوصول للموقع. تأكد من تفعيل الـ GPS.",
            locationUnsupported: "الموقع الجغرافي غير مدعوم في متصفحك.",
            quranTitle: "📖 جدول تتبع ختم القرآن الكريم",
            quranDay: "اليوم",
            quranFrom: "من",
            quranTo: "إلى",
            workoutTitle: "🏋️ برنامج القوة والمرونة – تعريف العضلات",
            workoutDay: "اليوم",
            workoutFocus: "التركيز",
            workoutDetails: "تفاصيل التمرين",
            workoutNote: "✏️ دوّن الأوزان المستخدمة وملاحظاتك عن الشد العضلي.",
            scheduleTitle: "🗓️ الجدول اليومي الفاخر",
            scheduleTime: "الوقت",
            scheduleTask: "المهمة",
            footerTitle: "Premium Ramadan Edition",
            footerDua: "🌙 اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبَ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ",
            hatmahTitle: "✨ دعاء ختم القرآن الكريم ✨",
            closeBtn: "آمين",
            // Dynamic Schedule Tasks
            suhoor: "السحور",
            fajr: "صلاة الفجر",
            sunrise: "الشروق (قرآن/نوم)",
            wakeUp: "الاستيقاظ & عمل/دراسة",
            dhuhr: "صلاة الظهر",
            rest: "راحة / قيلولة",
            asr: "صلاة العصر",
            quranTime: "قراءة قرآن / أذكار المساء",
            walk: "المشي قبل الإفطار (اختياري)",
            maghrib: "🌙 صلاة المغرب & إفطار",
            isha: "صلاة العشاء & التراويح",
            workout: "تمرين (القوة والمرونة)",
            postWorkout: "وجبة بعد التمرين / مذاكرة",
            sleep: "نوم",
            // Certificate
            certTitle: "شهادة تقدير",
            certSubtitle: "مخطط رمضان الذهبي الفاخر",
            certText: "تُمنح هذه الشهادة تقديراً للإنجاز المتميز",
            certTo: "إلى:",
            certAchievement: "لإتمام",
            certOf: "من المهام اليومية",
            certDay: "اليوم",
            certFromRamadan: "من رمضان المبارك",
            certMessage: "بارك الله في جهودك وتقبل منك صالح الأعمال",
            certDownload: "📥 تحميل الشهادة",
            certPrint: "🖨️ طباعة",
            certClose: "✖ إغلاق",
            // Certificate Banner
            certificateBannerTitle: "نظام شهادة الإنجاز",
            certificateBannerDesc: "أكمل 75% من المهام اليومية (9 من 12) لتحصل على شهادة إنجاز رمضانية فاخرة!",
            tasksCompleted: "مهمة مكتملة"
        },
        en: {
            title: "Premium Ramadan Planner",
            namePlaceholder: "Enter your name here",
            locationBtn: "📍 Detect Location (Prayer Times)",
            locationWait: "Detecting location...",
            locationSuccess: "✅ Schedule updated with your city's prayer times!",
            locationError: "Location access denied. Please enable GPS.",
            locationUnsupported: "Geolocation not supported in your browser.",
            quranTitle: "📖 Quran Completion Tracker",
            quranDay: "Day",
            quranFrom: "From",
            quranTo: "To",
            workoutTitle: "🏋️ Strength & Flexibility Program",
            workoutDay: "Day",
            workoutFocus: "Focus",
            workoutDetails: "Workout Details",
            workoutNote: "✏️ Note down weights used and muscle soreness.",
            scheduleTitle: "🗓️ Daily Premium Schedule",
            scheduleTime: "Time",
            scheduleTask: "Task",
            footerTitle: "Premium Ramadan Edition",
            footerDua: "🌙 O Allah, bless us in Rajab and Sha'ban and let us reach Ramadan.",
            hatmahTitle: "✨ Quran Completion Prayer ✨",
            closeBtn: "Ameen",
            // Dynamic Schedule Tasks
            suhoor: "Suhoor",
            fajr: "Fajr Prayer",
            sunrise: "Sunrise (Quran/Sleep)",
            wakeUp: "Wake Up & Work/Study",
            dhuhr: "Dhuhr Prayer",
            rest: "Rest / Nap",
            asr: "Asr Prayer",
            quranTime: "Quran Reading / Evening Adhkar",
            walk: "Pre-Iftar Walk (Optional)",
            maghrib: "🌙 Maghrib Prayer & Iftar",
            isha: "Isha Prayer & Taraweeh",
            workout: "Workout (Strength & Flexibility)",
            postWorkout: "Post-Workout Meal / Study",
            sleep: "Sleep",
            // Certificate
            certTitle: "Certificate of Appreciation",
            certSubtitle: "Premium Ramadan Planner",
            certText: "This certificate is awarded in recognition of outstanding achievement",
            certTo: "To:",
            certAchievement: "For completing",
            certOf: "of daily tasks",
            certDay: "Day",
            certFromRamadan: "of Blessed Ramadan",
            certMessage: "May Allah bless your efforts and accept your good deeds",
            certDownload: "📥 Download Certificate",
            certPrint: "🖨️ Print",
            certClose: "✖ Close",
            // Certificate Banner
            certificateBannerTitle: "Achievement Certificate System",
            certificateBannerDesc: "Complete 75% of daily tasks (9 out of 12) to earn a premium Ramadan achievement certificate!",
            tasksCompleted: "tasks completed"
        }
    };

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY_LANG, lang);

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
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    if (savedName) {
        nameInput.value = savedName;
    }

    // Save name on input change
    nameInput.addEventListener('input', (e) => {
        localStorage.setItem(STORAGE_KEY_NAME, e.target.value);
    });

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
    // --- 3. Quran Tracker Table (Enhanced) ---
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

        // Initialize checkboxes immediately after rendering
        setTimeout(() => addCheckboxesToSchedule(), 100); // Small delay to ensure DOM is updated
    });

    // Consolidated Quran Tracker Storage
    const QURAN_STORAGE_KEY = 'quran_tracker_data';

    function getQuranData() {
        const data = localStorage.getItem(QURAN_STORAGE_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Quran data parse error:', e);
                return {};
            }
        }
        return {};
    }

    function saveQuranData(data) {
        try {
            localStorage.setItem(QURAN_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Quran data save error:', e);
        }
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
                <td style="width: 20%;">${t.quranDay} ${i}</td>
                <td>
                    <input type="number" class="quran-input" data-day="${i}" data-type="from" 
                           placeholder="${t.quranFrom}" min="1" max="${MAX_PAGE}" value="${dayData.from}">
                </td>
                <td>
                    <input type="number" class="quran-input" data-day="${i}" data-type="to" 
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

    // --- 4. Workout Program ---
    const sportsBody = document.getElementById('sports-table-body');

    // Data (Arabic workouts)

    const workouts = [
        {
            day: 1, focus: 'صدر + ترايسبس + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة خفيفة + دوائر الذراعين + تمدد الصدر الديناميكي.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط عادي (Push-ups):</strong> ٤×١٥ (راحة ٤٥ ثانية)<br>
                • <strong>ضغط ماسي (Diamond Push-ups):</strong> ٤×١٢ (التركيز على الترايسبس)<br>
                • <strong>ترايسبس بالكرسي (Bench Dips):</strong> ٤×٢٠<br>
                • <strong>ضغط منخفض (Decline Push-ups):</strong> ٣×١٢ (للصدر العلوي)<br>
                • <strong>بلانك جانبي (Side Plank):</strong> ٣٠ ثانية لكل جانب + ١٥ ثانية تمدد جانبي<br>
                <strong>التبريد والمرونة:</strong> ٥ دقائق إطالة للصدر (تمدد الباب) والترايسبس (لمّ الكوع خلف الرأس) وتمارين تنفس.
            ` },
        {
            day: 2, focus: 'ظهر + بايسبس + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق لف الجذع + إطالة الظهر الديناميكية + تمرين القطة.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>عقلة (Pull-ups) أو تمرين السحب بالمنشفة:</strong> ٤×٨-١٢ (إذا لم يتوفر بار، استخدم طاولة قوية للصف الأفقي)<br>
                • <strong>صف منحني بزجاجات ماء (Bent-over Rows):</strong> ٤×٢٠ (لكل ذراع)<br>
                • <strong>بايسبس بالمنشفة (Towel Bicep Curls):</strong> ٤×٢٠<br>
                • <strong>سوبرمان (Superman):</strong> ٣×١٥ (مع تثبيت ٣ ثوانٍ)<br>
                • <strong>بايسبس هامر بزجاجات (Hammer Curls):</strong> ٣×٢٠<br>
                <strong>التبريد والمرونة:</strong> إطالة الظهر (وضعية الطفل) وإطالة العضلة ذات الرأسين (مد الذراع مع لف خارجي).
            ` },
        {
            day: 3, focus: 'أرجل + أرداف + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق سكوات هوائي + طعنات خفيفة + دوران الورك.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات (Squats):</strong> ٥×٢٠ (النزول كاملًا)<br>
                • <strong>اندفاع (Lunges):</strong> ٤×١٥ لكل رجل<br>
                • <strong>رفع أرداف بساق واحدة (Single Leg Glute Bridge):</strong> ٤×١٥ لكل رجل<br>
                • <strong>قفز سكوات (Jump Squats):</strong> ٣×١٢ (للانفجارية)<br>
                • <strong>تمرين الكرسي الثابت (Wall Sit):</strong> ٣×٦٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة عضلات الفخذ (وضعية الاندفاع مع تمدد) وأوتار الركبة (الانحناء للأمام) وتمدد الفراشة.
            ` },
        {
            day: 4, focus: 'أكتاف + بطن + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + رفع الكتفين + تمارين تمدد جانبي.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط بوش أب (Pike Push-ups):</strong> ٤×١٠-١٥ (إذا كان صعبًا، ابدأ بضغط زاوية)<br>
                • <strong>رفع جانبي بزجاجات ماء (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي (Front Raises):</strong> ٤×٢٠<br>
                • <strong>بلانك (Plank):</strong> ٤×٦٠ ثانية<br>
                • <strong>تمارين دراجة (Bicycle Crunches):</strong> ٤×٢٠<br>
                • <strong>رفع رجلين (Leg Raises):</strong> ٣×١٥<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف (سحب الذراع عبر الصدر) وتمدد البطن (وضعية الكوبرا).
            ` },
        {
            day: 5, focus: 'صدر + ظهر (سوبرست) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين + تمدد القطة.<br>
                <strong>التمارين الرئيسية (٤ جولات سوبرست):</strong><br>
                • <strong>ضغط عادي + صف منحني:</strong> ٢٠+٢٠<br>
                • <strong>ضغط واسع + سوبرمان:</strong> ١٥+١٥ (مع تثبيت)<br>
                • <strong>ترايسبس بالكرسي + بايسبس بالمنشفة:</strong> ٢٠+٢٠<br>
                • <strong>بلانك مع لمس كتف (Plank Shoulder Taps):</strong> ٣٠ ثانية<br>
                • <strong>تمرين الجسر (Bridge):</strong> ٣×٣٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والظهر معًا (وضعية تمدد الجانبين).
            ` },
        {
            day: 6, focus: 'أرجل + بطن (قوة أساسية) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق قفز نط + طعنات جانبية.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات ضيق (Sumo Squats):</strong> ٤×٢٠<br>
                • <strong>اندفاع جانبي (Side Lunges):</strong> ٤×١٥ لكل جانب<br>
                • <strong>رفع ساق خلفي (Donkey Kicks):</strong> ٤×٢٠ لكل رجل<br>
                • <strong>بلانك مع رفع رجل (Plank Leg Lift):</strong> ٣×١٥ لكل رجل<br>
                • <strong>تمارين بطن عكسي (Reverse Crunches):</strong> ٤×٢٠<br>
                • <strong>تمرين المقص (Scissors):</strong> ٣×٣٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل (وضعية الفراشة، الاندفاع العميق) وتمدد البطن.
            ` },
        {
            day: 7, focus: 'راحة نشطة + مرونة شاملة', details: `
                <strong>التمارين:</strong><br>
                • <strong>مشي سريع:</strong> ٣٠ دقيقة<br>
                • <strong>تمارين مرونة شاملة (Full Body Stretching):</strong> ٢٠ دقيقة (جميع المجموعات)<br>
                • <strong>تنفس عميق وتأمل:</strong> ١٠ دقائق.
            ` },
        {
            day: 8, focus: 'صدر + ترايسبس (تكثيف) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>ضغط مائل (Incline Push-ups):</strong> ٤×٢٠<br>
                • <strong>ضغط منخفض (Decline Push-ups):</strong> ٤×١٥<br>
                • <strong>ترايسبس بالكرسي (Bench Dips):</strong> ٤×٢٠<br>
                • <strong>ضغط بالكفين معاً (Close Grip Push-ups):</strong> ٣×١٥<br>
                • <strong>بلانك عالي مع لمس كتف:</strong> ٣×٣٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والترايسبس مع شد خلفي.
            ` },
        {
            day: 9, focus: 'ظهر + بايسبس (قوة) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق لف الجذع + إطالة الظهر.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>عقلة (أو صف بطاولة):</strong> ٤×١٠<br>
                • <strong>صف بزجاجات ماء:</strong> ٤×٢٠ لكل ذراع<br>
                • <strong>بايسبس بالمنشفة:</strong> ٤×٢٠<br>
                • <strong>سوبرمان مع تثبيت:</strong> ٣×٢٠ (ثانيتين تثبيت)<br>
                • <strong>بايسبس هامر:</strong> ٣×٢٠<br>
                <strong>التبريد والمرونة:</strong> إطالة الظهر والذراعين.
            ` },
        {
            day: 10, focus: 'أرجل + أرداف (عنيف) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق سكوات هوائي + رفع ركبتين.<br>
                <strong>التمارين الرئيسية (٦ جولات):</strong><br>
                • <strong>سكوات قفز (Jump Squats):</strong> ٤×١٥<br>
                • <strong>اندفاع قفز (Jump Lunges):</strong> ٤×١٠ لكل رجل<br>
                • <strong>رفع أرداف بساق واحدة (Single Leg Glute Bridge):</strong> ٤×١٥ لكل رجل<br>
                • <strong>تمرين الحمار (Donkey Kicks):</strong> ٤×٢٠ لكل رجل<br>
                • <strong>المشي الجانبي القرفصاء (Side Squat Walk):</strong> ٣×٢٠ خطوة لكل جانب<br>
                • <strong>الكرسي الثابت (Wall Sit):</strong> ٣×٧٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل والأرداف.
            ` },
        {
            day: 11, focus: 'أكتاف + بطن (تعريف) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + تمارين تمدد.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط بوش أب (Pike Push-ups):</strong> ٤×١٢<br>
                • <strong>رفع جانبي بزجاجات (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي بالتناوب (Alternating Front Raises):</strong> ٤×٢٠<br>
                • <strong>بلانك مع رفع ذراع (Plank with Arm Lift):</strong> ٣×١٥ لكل ذراع<br>
                • <strong>تمارين دراجة (Bicycle Crunches):</strong> ٤×٢٠<br>
                • <strong>رفع رجلين (Leg Raises):</strong> ٣×١٥<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف.
            ` },
        {
            day: 12, focus: 'صدر + ظهر (مركب) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٤ جولات سوبرست):</strong><br>
                • <strong>ضغط واسع + صف منحني:</strong> ١٥+١٥<br>
                • <strong>ضغط ماسي + سوبرمان:</strong> ١٥+١٥<br>
                • <strong>ترايسبس + بايسبس (Dips + Curls):</strong> ٢٠+٢٠<br>
                • <strong>بلانك جانبي (Side Plank):</strong> ٣٠ ثانية لكل جانب + ١٥ ثانية تمدد<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والظهر.
            ` },
        {
            day: 13, focus: 'أرجل + بطن (تحمل عالي) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق قفز نط + طعنات.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات بلغاري (Bulgarian Split Squats) على كرسي:</strong> ٤×١٢ لكل رجل<br>
                • <strong>اندفاع عكسي (Reverse Lunges):</strong> ٤×١٥ لكل رجل<br>
                • <strong>رفع ساق خلفي (Glute Kickbacks):</strong> ٤×٢٠ لكل رجل<br>
                • <strong>بلانك مع لمس كعب (Plank Heel Taps):</strong> ٣×٣٠ ثانية<br>
                • <strong>تمارين بطن V-up:</strong> ٣×١٥<br>
                • <strong>تمرين المقص (Scissors):</strong> ٣×٣٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل.
            ` },
        {
            day: 14, focus: 'أكتاف + ترايسبس (قوة) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + تمارين تمدد.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط عسكري بزجاجات (Overhead Press):</strong> ٤×٢٠<br>
                • <strong>رفع جانبي (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي (Front Raises):</strong> ٤×٢٠<br>
                • <strong>ترايسبس بالكرسي (Bench Dips):</strong> ٤×٢٠<br>
                • <strong>ترايسبس خلفي بزجاجة (Overhead Triceps Extension):</strong> ٣×١٥<br>
                • <strong>بلانك (Plank):</strong> ٣×٦٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف والترايسبس.
            ` },
        {
            day: 15, focus: 'نصف الشهر – شامل (تحدي القوة والمرونة)', details: `
                <strong>الإحماء:</strong> ١٠ دقائق هرولة + تمارين ديناميكية.<br>
                <strong>التمارين الرئيسية (٣ جولات شاملة):</strong><br>
                • <strong>الدائرة الأولى:</strong> ١٥ ضغط + ٢٠ سكوات + ١٠ عقلة (أو بديل) + ٢٠ طعنات + ٤٥ ثانية بلانك.<br>
                • <strong>الدائرة الثانية:</strong> ١٢ ضغط ماسي + ١٥ قفز سكوات + ١٥ صف بزجاجات + ٢٠ رفع أرداف + ٣٠ ثانية بلانك جانبي لكل جانب.<br>
                • <strong>الدائرة الثالثة:</strong> ٢٠ بايسبس + ٢٠ ترايسبس + ٢٠ رفع جانبي + ٢٠ رفع رجلين.<br>
                • <strong>الراحة:</strong> دقيقتين بين الدوائر.<br>
                <strong>التبريد والمرونة:</strong> ١٠ دقائق إطالة شاملة.
            ` },
        {
            day: 16, focus: 'صدر + ترايسبس (ضخ) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>ضغط عادي (Push-ups):</strong> ٤×٢٠<br>
                • <strong>ضغط ماسي (Diamond Push-ups):</strong> ٤×١٥<br>
                • <strong>ترايسبس بالكرسي (Dips):</strong> ٤×٢٠<br>
                • <strong>ضغط منخفض (Decline Push-ups):</strong> ٣×١٥<br>
                • <strong>بلانك جانبي (Side Plank):</strong> ٣×٣٠ ثانية لكل جانب<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر.
            ` },
        {
            day: 17, focus: 'ظهر + بايسبس (تكثيف) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق لف الجذع + إطالة الظهر.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>عقلة (Pull-ups) أو صف بطاولة:</strong> ٤×١٠-١٥<br>
                • <strong>صف بزجاجات (Rows):</strong> ٤×٢٠ لكل ذراع<br>
                • <strong>بايسبس بزجاجات (Bicep Curls):</strong> ٤×٢٠<br>
                • <strong>سوبرمان (Superman):</strong> ٣×٢٠<br>
                • <strong>بايسبس هامر (Hammer Curls):</strong> ٣×٢٠<br>
                <strong>التبريد والمرونة:</strong> إطالة الظهر.
            ` },
        {
            day: 18, focus: 'أرجل + أرداف (تحمل) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق سكوات هوائي + طعنات.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات (Squats):</strong> ٤×٢٥<br>
                • <strong>اندفاع (Lunges):</strong> ٤×٢٠ لكل رجل<br>
                • <strong>رفع أرداف (Glute Bridge):</strong> ٤×٢٠<br>
                • <strong>رفع ساق جانبي (Side Leg Raises):</strong> ٣×٢٠ لكل جانب<br>
                • <strong>تمرين الكرسي (Wall Sit):</strong> ٣×٧٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل.
            ` },
        {
            day: 19, focus: 'أكتاف + بطن (قوة) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + تمارين تمدد.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط بوش أب (Pike Push-ups):</strong> ٤×١٢<br>
                • <strong>رفع جانبي بزجاجات (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي (Front Raises):</strong> ٤×٢٠<br>
                • <strong>بلانك (Plank):</strong> ٤×٧٠ ثانية<br>
                • <strong>تمارين دراجة (Bicycle):</strong> ٤×٢٠<br>
                • <strong>رفع رجلين (Leg Raises):</strong> ٣×١٥<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف.
            ` },
        {
            day: 20, focus: 'صدر + ظهر (هايبرتروفي) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٤ جولات سوبرست):</strong><br>
                • <strong>ضغط عادي + صف منحني (Push-ups + Rows):</strong> ٢٠+٢٠<br>
                • <strong>ضغط واسع + سوبرمان (Wide Push-ups + Superman):</strong> ٢٠+٢٠<br>
                • <strong>ترايسبس + بايسبس (Dips + Curls):</strong> ٢٠+٢٠<br>
                • <strong>بلانك مع رفع ذراع (Plank Shoulder Taps):</strong> ٣×٣٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والظهر.
            ` },
        {
            day: 21, focus: 'أرجل + بطن (عنيف) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق قفز نط + طعنات.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات قفز (Jump Squats):</strong> ٤×٢٠<br>
                • <strong>اندفاع قفز (Jump Lunges):</strong> ٤×١٢ لكل رجل<br>
                • <strong>رفع أرداف بساق واحدة (Single Leg Glute Bridge):</strong> ٤×١٥ لكل رجل<br>
                • <strong>بلانك مع رفع رجل (Plank Leg Lift):</strong> ٣×٢٠ لكل رجل<br>
                • <strong>تمارين بطن عكسي (Reverse Crunches):</strong> ٤×٢٠<br>
                • <strong>تمرين الضفدع (Frog Jumps):</strong> ٣×١٢<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل.
            ` },
        {
            day: 22, focus: 'أكتاف + ترايسبس (حرق) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + تمارين تمدد.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط بوش أب (Pike Push-ups):</strong> ٤×١٢<br>
                • <strong>رفع جانبي بزجاجات (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي (Front Raises):</strong> ٤×٢٠<br>
                • <strong>ترايسبس بالكرسي (Dips):</strong> ٤×٢٠<br>
                • <strong>ترايسبس خلفي بزجاجة (Overhead Triceps Extension):</strong> ٣×١٥<br>
                • <strong>بلانك جانبي (Side Plank):</strong> ٣×٣٠ ثانية لكل جانب<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف.
            ` },
        {
            day: 23, focus: 'صدر + بايسبس (ضخ) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط عادي (Push-ups):</strong> ٤×٢٠<br>
                • <strong>ضغط مائل (Incline Push-ups):</strong> ٤×٢٠<br>
                • <strong>بايسبس بزجاجات (Bicep Curls):</strong> ٤×٢٠<br>
                • <strong>بايسبس هامر (Hammer Curls):</strong> ٤×٢٠<br>
                • <strong>بلانك (Plank):</strong> ٣×٦٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والذراعين.
            ` },
        {
            day: 24, focus: 'ظهر + ترايسبس (قوة) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق لف الجذع + إطالة الظهر.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>عقلة (Pull-ups) أو صف بطاولة:</strong> ٤×١٠-١٥<br>
                • <strong>صف بزجاجات (Rows):</strong> ٤×٢٠ لكل ذراع<br>
                • <strong>ترايسبس بالكرسي (Dips):</strong> ٤×٢٠<br>
                • <strong>سوبرمان (Superman):</strong> ٣×٢٠<br>
                • <strong>ترايسبس خلفي (Overhead Triceps Extension):</strong> ٣×١٥<br>
                <strong>التبريد والمرونة:</strong> إطالة الظهر.
            ` },
        {
            day: 25, focus: 'أرجل + أرداف (تحمل) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق سكوات هوائي + طعنات.<br>
                <strong>التمارين الرئيسية (٥ جولات):</strong><br>
                • <strong>سكوات (Squats):</strong> ٤×٢٥<br>
                • <strong>اندفاع (Lunges):</strong> ٤×٢٠ لكل رجل<br>
                • <strong>رفع أرداف (Glute Bridge):</strong> ٤×٢٠<br>
                • <strong>رفع ساق جانبي (Side Leg Raises):</strong> ٣×٢٠ لكل جانب<br>
                • <strong>تمرين الكرسي (Wall Sit):</strong> ٣×٧٠ ثانية<br>
                <strong>التبريد والمرونة:</strong> إطالة الأرجل.
            ` },
        {
            day: 26, focus: 'أكتاف + بطن (حرق) + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق دوران الذراعين + تمارين تمدد.<br>
                <strong>التمارين الرئيسية (٤ جولات):</strong><br>
                • <strong>ضغط بوش أب (Pike Push-ups):</strong> ٤×١٢<br>
                • <strong>رفع جانبي بزجاجات (Lateral Raises):</strong> ٤×٢٠<br>
                • <strong>رفع أمامي (Front Raises):</strong> ٤×٢٠<br>
                • <strong>بلانك (Plank):</strong> ٤×٦٠ ثانية<br>
                • <strong>تمارين دراجة (Bicycle):</strong> ٤×٢٠<br>
                • <strong>رفع رجلين (Leg Raises):</strong> ٣×١٥<br>
                <strong>التبريد والمرونة:</strong> إطالة الأكتاف.
            ` },
        {
            day: 27, focus: 'العشر الأواخر – راحة نشطة + مرونة عميقة', details: `
                <strong>التمارين:</strong><br>
                • <strong>مشي خفيف:</strong> ٢٠-٣٠ دقيقة<br>
                • <strong>تمارين مرونة عميقة (Deep Stretching):</strong> ٢٥ دقيقة (اليوجا: وضعية الطفل، الكلب المتجه لأسفل، تمدد الحمامة)<br>
                • <strong>تنفس وتأمل:</strong> ١٠ دقائق.
            ` },
        {
            day: 28, focus: 'صدر + ظهر (خفيف + مرونة)', details: `
                <strong>الإحماء:</strong> ٥ دقائق هرولة + دوائر الذراعين.<br>
                <strong>التمارين الرئيسية (٣ جولات):</strong><br>
                • <strong>ضغط عادي (Push-ups):</strong> ٣×١٥<br>
                • <strong>صف بزجاجات (Rows):</strong> ٣×١٥ لكل ذراع<br>
                • <strong>سوبرمان (Superman):</strong> ٣×١٥<br>
                • <strong>بلانك جانبي (Side Plank):</strong> ٣×٣٠ ثانية لكل جانب<br>
                <strong>التبريد والمرونة:</strong> إطالة الصدر والظهر.
            ` },
        {
            day: 29, focus: 'أرجل خفيفة + مرونة', details: `
                <strong>الإحماء:</strong> ٥ دقائق مشي.<br>
                <strong>التمارين الرئيسية (٣ جولات):</strong><br>
                • <strong>سكوات (Squats):</strong> ٣×١٥<br>
                • <strong>اندفاع (Lunges):</strong> ٣×١٠ لكل رجل<br>
                • <strong>رفع أرداف (Glute Bridge):</strong> ٣×١٥<br>
                • <strong>إطالة شاملة:</strong> ١٥ دقيقة (جميع المجموعات).
            ` },
        {
            day: 30, focus: 'ختام رمضان – دعاء وشكر', details: `
                <strong>التمارين:</strong><br>
                • <strong>لا يوجد تمرين</strong> – خذ قسطًا من الراحة.<br>
                • احمد الله على تمام الشهر، واسأله القبول.<br>
                • No workout – Take a rest.<br>
                • Thank Allah for completing the month and ask for acceptance.<br>
                • Eid Mubarak.
            ` }
    ];

    // English Workouts
    const workouts_en = [
        {
            day: 1, focus: 'Chest + Triceps + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min light jog + arm circles + dynamic chest stretch.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Push-ups:</strong> 4×15 (45 sec rest)<br>
                • <strong>Diamond Push-ups:</strong> 4×12 (focus on triceps)<br>
                • <strong>Bench Dips:</strong> 4×20<br>
                • <strong>Decline Push-ups:</strong> 3×12 (upper chest)<br>
                • <strong>Side Plank:</strong> 30 sec each side + 15 sec side stretch<br>
                <strong>Cool-down & Flexibility:</strong> 5 min chest stretch (doorway) and triceps (elbow behind head) and breathing exercises.
            ` },
        {
            day: 2, focus: 'Back + Biceps + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min torso twists + dynamic back stretch + cat pose.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pull-ups or Towel Rows:</strong> 4×8-12 (if no bar, use sturdy table for horizontal rows)<br>
                • <strong>Bent-over Rows (water bottles):</strong> 4×20 (each arm)<br>
                • <strong>Towel Bicep Curls:</strong> 4×20<br>
                • <strong>Superman:</strong> 3×15 (hold 3 sec)<br>
                • <strong>Hammer Curls (bottles):</strong> 3×20<br>
                <strong>Cool-down & Flexibility:</strong> Back stretch (child's pose) and bicep stretch (arm extension with external rotation).
            ` },
        {
            day: 3, focus: 'Legs + Glutes + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min air squats + light lunges + hip circles.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Squats:</strong> 5×20 (full depth)<br>
                • <strong>Lunges:</strong> 4×15 each leg<br>
                • <strong>Single Leg Glute Bridge:</strong> 4×15 each leg<br>
                • <strong>Jump Squats:</strong> 3×12 (explosive)<br>
                • <strong>Wall Sit:</strong> 3×60 sec<br>
                <strong>Cool-down & Flexibility:</strong> Quad stretch (lunge position) and hamstring stretch (forward bend) and butterfly stretch.
            ` },
        {
            day: 4, focus: 'Shoulders + Abs + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + shoulder shrugs + side stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pike Push-ups:</strong> 4×10-15 (if difficult, start with angled push-ups)<br>
                • <strong>Lateral Raises (water bottles):</strong> 4×20<br>
                • <strong>Front Raises:</strong> 4×20<br>
                • <strong>Plank:</strong> 4×60 sec<br>
                • <strong>Bicycle Crunches:</strong> 4×20<br>
                • <strong>Leg Raises:</strong> 3×15<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder stretch (arm across chest) and ab stretch (cobra pose).
            ` },
        {
            day: 5, focus: 'Chest + Back (Superset) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles + cat pose.<br>
                <strong>Main Exercises (4 superset rounds):</strong><br>
                • <strong>Push-ups + Bent-over Rows:</strong> 20+20<br>
                • <strong>Wide Push-ups + Superman:</strong> 15+15 (with hold)<br>
                • <strong>Bench Dips + Towel Bicep Curls:</strong> 20+20<br>
                • <strong>Plank Shoulder Taps:</strong> 30 sec<br>
                • <strong>Bridge:</strong> 3×30 sec<br>
                <strong>Cool-down & Flexibility:</strong> Combined chest and back stretch (side stretch position).
            ` },
        {
            day: 6, focus: 'Legs + Abs (Core Strength) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jumping jacks + side lunges.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Sumo Squats:</strong> 4×20<br>
                • <strong>Side Lunges:</strong> 4×15 each side<br>
                • <strong>Donkey Kicks:</strong> 4×20 each leg<br>
                • <strong>Plank Leg Lift:</strong> 3×15 each leg<br>
                • <strong>Reverse Crunches:</strong> 4×20<br>
                • <strong>Scissors:</strong> 3×30 sec<br>
                <strong>Cool-down & Flexibility:</strong> Leg stretch (butterfly, deep lunge) and ab stretch.
            ` },
        {
            day: 7, focus: 'Active Rest + Full Flexibility', details: `
                <strong>Exercises:</strong><br>
                • <strong>Brisk Walk:</strong> 30 min<br>
                • <strong>Full Body Stretching:</strong> 20 min (all muscle groups)<br>
                • <strong>Deep Breathing & Meditation:</strong> 10 min.
            ` },
        {
            day: 8, focus: 'Chest + Triceps (Intensified) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Incline Push-ups:</strong> 4×20<br>
                • <strong>Decline Push-ups:</strong> 4×15<br>
                • <strong>Bench Dips:</strong> 4×20<br>
                • <strong>Close Grip Push-ups:</strong> 3×15<br>
                • <strong>High Plank Shoulder Taps:</strong> 3×30 sec<br>
                <strong>Cool-down & Flexibility:</strong> Chest and triceps stretch with posterior stretch.
            ` },
        {
            day: 9, focus: 'Back + Biceps (Strength) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min torso twists + back stretch.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Pull-ups (or table rows):</strong> 4×10<br>
                • <strong>Rows with water bottles:</strong> 4×20 each arm<br>
                • <strong>Towel Bicep Curls:</strong> 4×20<br>
                • <strong>Superman with hold:</strong> 3×20 (2 sec hold)<br>
                • <strong>Hammer Curls:</strong> 3×20<br>
                <strong>Cool-down & Flexibility:</strong> Back and arm stretch.
            ` },
        {
            day: 10, focus: 'Legs + Glutes (Intense) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min air squats + knee raises.<br>
                <strong>Main Exercises (6 rounds):</strong><br>
                • <strong>Jump Squats:</strong> 4×15<br>
                • <strong>Jump Lunges:</strong> 4×10 each leg<br>
                • <strong>Single Leg Glute Bridge:</strong> 4×15 each leg<br>
                • <strong>Donkey Kicks:</strong> 4×20 each leg<br>
                • <strong>Side Squat Walk:</strong> 3×20 steps each side<br>
                • <strong>Wall Sit:</strong> 3×70 sec<br>
                <strong>Cool-down & Flexibility:</strong> Leg and glute stretch.
            ` },
        {
            day: 11, focus: 'Shoulders + Abs (Definition) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pike Push-ups:</strong> 4×12<br>
                • <strong>Lateral Raises (bottles):</strong> 4×20<br>
                • <strong>Alternating Front Raises:</strong> 4×20<br>
                • <strong>Plank with Arm Lift:</strong> 3×15 each arm<br>
                • <strong>Bicycle Crunches:</strong> 4×20<br>
                • <strong>Leg Raises:</strong> 3×15<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder stretch.
            ` },
        {
            day: 12, focus: 'Chest + Back (Compound) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (4 superset rounds):</strong><br>
                • <strong>Wide Push-ups + Bent-over Rows:</strong> 15+15<br>
                • <strong>Diamond Push-ups + Superman:</strong> 15+15<br>
                • <strong>Dips + Curls:</strong> 20+20<br>
                • <strong>Side Plank:</strong> 30 sec each side + 15 sec stretch<br>
                <strong>Cool-down & Flexibility:</strong> Chest and back stretch.
            ` },
        {
            day: 13, focus: 'Legs + Abs (High Endurance) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jumping jacks + lunges.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Bulgarian Split Squats (on chair):</strong> 4×12 each leg<br>
                • <strong>Reverse Lunges:</strong> 4×15 each leg<br>
                • <strong>Glute Kickbacks:</strong> 4×20 each leg<br>
                • <strong>Plank Heel Taps:</strong> 3×30 sec<br>
                • <strong>V-ups:</strong> 3×15<br>
                • <strong>Scissors:</strong> 3×30 sec<br>
                <strong>Cool-down & Flexibility:</strong> Leg stretch.
            ` },
        {
            day: 14, focus: 'Shoulders + Triceps (Strength) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Overhead Press (bottles):</strong> 4×20<br>
                • <strong>Lateral Raises:</strong> 4×20<br>
                • <strong>Front Raises:</strong> 4×20<br>
                • <strong>Bench Dips:</strong> 4×20<br>
                • <strong>Overhead Triceps Extension (bottle):</strong> 3×15<br>
                • <strong>Plank:</strong> 3×60 sec<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder and triceps stretch.
            ` },
        {
            day: 15, focus: 'Mid-Month – Full Body (Strength & Flexibility Challenge)', details: `
                <strong>Warm-up:</strong> 10 min jog + dynamic exercises.<br>
                <strong>Main Exercises (3 full rounds):</strong><br>
                • <strong>Circuit 1:</strong> 15 push-ups + 20 squats + 10 pull-ups (or alternative) + 20 lunges + 45 sec plank.<br>
                • <strong>Circuit 2:</strong> 12 diamond push-ups + 15 jump squats + 15 bottle rows + 20 glute bridges + 30 sec side plank each side.<br>
                • <strong>Circuit 3:</strong> 20 bicep curls + 20 tricep dips + 20 lateral raises + 20 leg raises.<br>
                • <strong>Rest:</strong> 2 min between circuits.<br>
                <strong>Cool-down & Flexibility:</strong> 10 min full body stretch.
            ` },
        {
            day: 16, focus: 'Chest + Triceps (Pump) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Push-ups:</strong> 4×20<br>
                • <strong>Diamond Push-ups:</strong> 4×15<br>
                • <strong>Dips:</strong> 4×20<br>
                • <strong>Decline Push-ups:</strong> 3×15<br>
                • <strong>Side Plank:</strong> 3×30 sec each side<br>
                <strong>Cool-down & Flexibility:</strong> Chest stretch.
            ` },
        {
            day: 17, focus: 'Back + Biceps (Intensified) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min torso twists + back stretch.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pull-ups or table rows:</strong> 4×10-15<br>
                • <strong>Rows (bottles):</strong> 4×20 each arm<br>
                • <strong>Bicep Curls (bottles):</strong> 4×20<br>
                • <strong>Superman:</strong> 3×20<br>
                • <strong>Hammer Curls:</strong> 3×20<br>
                <strong>Cool-down & Flexibility:</strong> Back stretch.
            ` },
        {
            day: 18, focus: 'Legs + Glutes (Endurance) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min air squats + lunges.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Squats:</strong> 4×25<br>
                • <strong>Lunges:</strong> 4×20 each leg<br>
                • <strong>Glute Bridge:</strong> 4×20<br>
                • <strong>Side Leg Raises:</strong> 3×20 each side<br>
                • <strong>Wall Sit:</strong> 3×70 sec<br>
                <strong>Cool-down & Flexibility:</strong> Leg stretch.
            ` },
        {
            day: 19, focus: 'Shoulders + Abs (Strength) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pike Push-ups:</strong> 4×12<br>
                • <strong>Lateral Raises (bottles):</strong> 4×20<br>
                • <strong>Front Raises:</strong> 4×20<br>
                • <strong>Plank:</strong> 4×70 sec<br>
                • <strong>Bicycle:</strong> 4×20<br>
                • <strong>Leg Raises:</strong> 3×15<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder stretch.
            ` },
        {
            day: 20, focus: 'Chest + Back (Hypertrophy) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (4 superset rounds):</strong><br>
                • <strong>Push-ups + Rows:</strong> 20+20<br>
                • <strong>Wide Push-ups + Superman:</strong> 20+20<br>
                • <strong>Dips + Curls:</strong> 20+20<br>
                • <strong>Plank Shoulder Taps:</strong> 3×30 sec<br>
                <strong>Cool-down & Flexibility:</strong> Chest and back stretch.
            ` },
        {
            day: 21, focus: 'Legs + Abs (Intense) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jumping jacks + lunges.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Jump Squats:</strong> 4×20<br>
                • <strong>Jump Lunges:</strong> 4×12 each leg<br>
                • <strong>Single Leg Glute Bridge:</strong> 4×15 each leg<br>
                • <strong>Plank Leg Lift:</strong> 3×20 each leg<br>
                • <strong>Reverse Crunches:</strong> 4×20<br>
                • <strong>Frog Jumps:</strong> 3×12<br>
                <strong>Cool-down & Flexibility:</strong> Leg stretch.
            ` },
        {
            day: 22, focus: 'Shoulders + Triceps (Burn) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pike Push-ups:</strong> 4×12<br>
                • <strong>Lateral Raises (bottles):</strong> 4×20<br>
                • <strong>Front Raises:</strong> 4×20<br>
                • <strong>Dips:</strong> 4×20<br>
                • <strong>Overhead Triceps Extension (bottle):</strong> 3×15<br>
                • <strong>Side Plank:</strong> 3×30 sec each side<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder stretch.
            ` },
        {
            day: 23, focus: 'Chest + Biceps (Pump) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Push-ups:</strong> 4×20<br>
                • <strong>Incline Push-ups:</strong> 4×20<br>
                • <strong>Bicep Curls (bottles):</strong> 4×20<br>
                • <strong>Hammer Curls:</strong> 4×20<br>
                • <strong>Plank:</strong> 3×60 sec<br>
                <strong>Cool-down & Flexibility:</strong> Chest and arm stretch.
            ` },
        {
            day: 24, focus: 'Back + Triceps (Strength) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min torso twists + back stretch.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pull-ups or table rows:</strong> 4×10-15<br>
                • <strong>Rows (bottles):</strong> 4×20 each arm<br>
                • <strong>Dips:</strong> 4×20<br>
                • <strong>Superman:</strong> 3×20<br>
                • <strong>Overhead Triceps Extension:</strong> 3×15<br>
                <strong>Cool-down & Flexibility:</strong> Back stretch.
            ` },
        {
            day: 25, focus: 'Legs + Glutes (Endurance) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min air squats + lunges.<br>
                <strong>Main Exercises (5 rounds):</strong><br>
                • <strong>Squats:</strong> 4×25<br>
                • <strong>Lunges:</strong> 4×20 each leg<br>
                • <strong>Glute Bridge:</strong> 4×20<br>
                • <strong>Side Leg Raises:</strong> 3×20 each side<br>
                • <strong>Wall Sit:</strong> 3×70 sec<br>
                <strong>Cool-down & Flexibility:</strong> Leg stretch.
            ` },
        {
            day: 26, focus: 'Shoulders + Abs (Burn) + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min arm circles + stretches.<br>
                <strong>Main Exercises (4 rounds):</strong><br>
                • <strong>Pike Push-ups:</strong> 4×12<br>
                • <strong>Lateral Raises (bottles):</strong> 4×20<br>
                • <strong>Front Raises:</strong> 4×20<br>
                • <strong>Plank:</strong> 4×60 sec<br>
                • <strong>Bicycle:</strong> 4×20<br>
                • <strong>Leg Raises:</strong> 3×15<br>
                <strong>Cool-down & Flexibility:</strong> Shoulder stretch.
            ` },
        {
            day: 27, focus: 'Last 10 Days – Active Rest + Deep Flexibility', details: `
                <strong>Exercises:</strong><br>
                • <strong>Light Walk:</strong> 20-30 min<br>
                • <strong>Deep Stretching:</strong> 25 min (Yoga: child's pose, downward dog, pigeon pose)<br>
                • <strong>Breathing & Meditation:</strong> 10 min.
            ` },
        {
            day: 28, focus: 'Chest + Back (Light + Flexibility)', details: `
                <strong>Warm-up:</strong> 5 min jog + arm circles.<br>
                <strong>Main Exercises (3 rounds):</strong><br>
                • <strong>Push-ups:</strong> 3×15<br>
                • <strong>Rows (bottles):</strong> 3×15 each arm<br>
                • <strong>Superman:</strong> 3×15<br>
                • <strong>Side Plank:</strong> 3×30 sec each side<br>
                <strong>Cool-down & Flexibility:</strong> Chest and back stretch.
            ` },
        {
            day: 29, focus: 'Light Legs + Flexibility', details: `
                <strong>Warm-up:</strong> 5 min walk.<br>
                <strong>Main Exercises (3 rounds):</strong><br>
                • <strong>Squats:</strong> 3×15<br>
                • <strong>Lunges:</strong> 3×10 each leg<br>
                • <strong>Glute Bridge:</strong> 3×15<br>
                • <strong>Full Stretch:</strong> 15 min (all muscle groups).
            ` },
        {
            day: 30, focus: 'Ramadan Completion – Prayer & Gratitude', details: `
                <strong>Exercises:</strong><br>
                • <strong>No workout</strong> – Take a rest.<br>
                • Thank Allah for completing the month and ask for acceptance.<br>
                • Eid Mubarak.
            ` }
    ];

    // Render function (defined after both arrays)
    function renderWorkoutTable() {
        if (!sportsBody) return;

        const t = translations[currentLang];
        // Select the correct workout array based on language
        const workoutData = currentLang === 'en' ? workouts_en : workouts;

        let rows = '';
        workoutData.forEach(item => {
            rows += `<tr>
                <td>${t.workoutDay} ${item.day}</td>
                <td>${item.focus}</td>
                <td>${item.details}</td>
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

        for (let day = 1; day <= 30; day++) {
            // Get timings for this day (or fallback to default)
            const times = isDynamic ? apiTimings[(day - 1) % apiTimings.length].timings : defaultTimings;

            // Calculate Suhoor (Fajr - 45 mins)
            let suhoorTime = "04:30"; // Default
            if (isDynamic) {
                const fajrDate = new Date(`2000-01-01 ${times.Fajr.split(' ')[0]}`);
                fajrDate.setMinutes(fajrDate.getMinutes() - 45);
                suhoorTime = fajrDate.toTimeString().slice(0, 5);
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

            allDaysHTML += `<div class="daily-card">`;
            allDaysHTML += `<div class="daily-title">📅 ${t.scheduleTitle.replace('🗓️ ', '')} ${day}</div>`;
            allDaysHTML += `<table class="table-gold">`;
            allDaysHTML += `<thead><tr><th>${t.scheduleTime}</th><th>${t.scheduleTask}</th></tr></thead>`;
            allDaysHTML += `<tbody>`;
            scheduleRows.forEach((item, index) => {
                const taskId = `day-${day}-task-${index}`;
                const isChecked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';

                allDaysHTML += `
                <tr>
                    <td style="font-weight: 600; color: #2e241f; direction: ltr; width: 30%;">${item.time}</td>
                    <td style="text-align: ${currentLang === 'ar' ? 'right' : 'left'}; display: flex; align-items: center; justify-content: space-between;">
                        <span>${item.task}</span>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="${taskId}" ${isChecked} onchange="localStorage.setItem('${taskId}', this.checked)">
                            <span class="checkmark"></span>
                        </label>
                    </td>
                </tr>`;
            });
            allDaysHTML += `</tbody></table></div>`;
        }
        daysContainer.innerHTML = allDaysHTML;
    }

    // Initial Render (Static)
    renderSchedule();

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
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

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
                    // The original renderSchedule expects full month data.
                    // The new diff caches only today's timings.
                    // To maintain compatibility, let's cache the full month data and pass it.
                    // Or, if the intention is to only show today's times, then renderSchedule needs adjustment.
                    // Assuming the goal is to update the *entire* schedule with the fetched month's data.
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data.data)); // Cache full month data
                    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
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
                    Sunrise: '05:45', // Added Sunrise for completeness
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

    // Safe localStorage wrapper with error handling
    const SafeStorage = {
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.error('localStorage.setItem failed:', e);
                if (e.name === 'QuotaExceededError') {
                    alert('Storage quota exceeded. Please clear some data.');
                } else {
                    alert('Failed to save data. Please check your browser settings.');
                }
                return false;
            }
        },

        getItem(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? value : defaultValue;
            } catch (e) {
                console.error('localStorage.getItem failed:', e);
                return defaultValue;
            }
        },

        removeItem(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('localStorage.removeItem failed:', e);
                return false;
            }
        }
    };

    // Certificate tracking functions
    function getCertificatesAwarded() {
        try {
            const data = SafeStorage.getItem(CERT_STORAGE_KEY, '{}');
            return JSON.parse(data);
        } catch (e) {
            console.error('Error reading certificates:', e);
            return {};
        }
    }

    function markCertificateAwarded(day, percentage) {
        const certs = getCertificatesAwarded();
        certs[`day_${day}`] = {
            awarded: true,
            timestamp: Date.now(),
            percentage: percentage
        };
        SafeStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
    }

    function hasCertificateBeenAwarded(day) {
        const certs = getCertificatesAwarded();
        return certs[`day_${day}`]?.awarded === true;
    }

    // Get or initialize progress data
    function getProgressData() {
        const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
        return data ? JSON.parse(data) : {};
    }

    // Save progress data
    function saveProgressData(data) {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
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

        progress[dayKey].tasks[taskIndex] = isChecked;
        saveProgressData(progress);
        checkCertificateEligibility(day);
    }

    // Calculate day progress
    function calculateDayProgress(day) {
        const progress = getProgressData();
        const dayKey = 'day-' + day;
        const dayData = progress[dayKey];

        if (!dayData || !dayData.tasks) {
            return { percentage: 0, completed: 0, total: 0 };
        }

        const total = dayData.tasks.length;
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

        const progress = getProgressData();
        const dayKey = 'day-' + day;
        const dayData = progress[dayKey];

        if (!dayData) return;

        const { percentage } = calculateDayProgress(day);

        if (percentage >= 75) {
            showCertificate(day, percentage);
            // Mark as awarded to prevent duplicates
            markCertificateAwarded(day, percentage);
            // Also mark in progress data for backward compatibility
            dayData.certificateAwarded = true;
            dayData.awardedAt = new Date().toISOString();
            saveProgressData(progress);
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

        // Count all completed tasks
        for (let day = 1; day <= 30; day++) {
            for (let taskIndex = 0; taskIndex < 12; taskIndex++) {
                const taskId = `day-${day}-task-${taskIndex}`;
                if (localStorage.getItem(taskId) === 'true') {
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

    // Check eligibility across all days (for global progress updates)
    function checkEligibility() {
        // Check each day's completion percentage
        for (let day = 1; day <= 30; day++) {
            // Skip if already awarded
            if (hasCertificateBeenAwarded(day)) {
                continue;
            }

            let completedTasks = 0;
            const totalTasks = 12;

            for (let taskIndex = 0; taskIndex < totalTasks; taskIndex++) {
                const taskId = `day-${day}-task-${taskIndex}`;
                if (SafeStorage.getItem(taskId) === 'true') {
                    completedTasks++;
                }
            }

            const percentage = Math.round((completedTasks / totalTasks) * 100);

            // Check if this day qualifies (≥75%)
            if (percentage >= 75) {
                return {
                    eligible: true,
                    day: day,
                    percentage: percentage,
                    completedTasks: completedTasks,
                    totalTasks: totalTasks
                };
            }
        }

        return {
            eligible: false,
            day: null,
            percentage: 0,
            completedTasks: 0,
            totalTasks: 0
        };
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
            certHijriDate.textContent = now.toLocaleDateString(hijriLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
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

        const particles = [];
        for (let i = 0; i < 150; i++) {
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

            requestAnimationFrame(draw);
        }

        draw();
        setTimeout(() => { canvas.style.display = 'none'; }, 5000);
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

    // Close certificate
    const closeBtn = document.getElementById('close-cert');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('certificate-modal');
            if (modal) modal.style.display = 'none';
        });
    }

    // Add checkboxes to schedule tasks
    function addCheckboxesToSchedule() {
        const progress = getProgressData();
        const dayCards = document.querySelectorAll('.day-card');

        dayCards.forEach((card, dayIndex) => {
            const day = dayIndex + 1;
            const dayKey = 'day-' + day;
            const dayData = progress[dayKey] || { tasks: [] };
            const rows = card.querySelectorAll('tbody tr');

            rows.forEach((row, taskIndex) => {
                const firstCell = row.querySelector('td');
                if (!firstCell) return;

                // Check if checkbox already exists
                if (firstCell.querySelector('.task-checkbox')) return;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = dayData.tasks[taskIndex] || false;
                checkbox.style.marginLeft = '8px';
                checkbox.style.cursor = 'pointer';

                checkbox.addEventListener('change', (e) => {
                    trackTaskCompletion(day, taskIndex, e.target.checked);
                });

                firstCell.insertBefore(checkbox, firstCell.firstChild);
            });
        });
    }

    // Initialize checkboxes immediately (no setTimeout needed)
    // This will be called after renderSchedule completes
    function initializeCheckboxes() {
        addCheckboxesToSchedule();
        updateGlobalProgress(); // Update progress on load
    }

    // Re-add checkboxes when language changes (already handled by updateLanguage)
});
