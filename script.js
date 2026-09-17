document.addEventListener("DOMContentLoaded", function () {
    /* ========================================
       TELEGRAM
    ======================================== */

    const tg = window.Telegram?.WebApp;

    if (tg) {
        tg.ready();
        tg.expand();
    }


    /* ========================================
       ELEMENTS
    ======================================== */

    const homePage = document.getElementById("homePage");
    const orderPage = document.getElementById("orderPage");
    const successPage = document.getElementById("successPage");

    const homeNav = document.getElementById("homeNav");
    const orderNav = document.getElementById("orderNav");
    const profileNav = document.getElementById("profileNav");

    const profileButton = document.getElementById("profileButton");
    const profileModal = document.getElementById("profileModal");
    const closeProfileButton = document.getElementById("closeProfileButton");
    const profileText = document.getElementById("profileText");

    const themeButton = document.getElementById("themeButton");
    const themeIcon = document.getElementById("themeIcon");
    const themeColorMeta = document.getElementById("themeColorMeta");

    const backHomeButton = document.getElementById("backHomeButton");

    const submitOrderButton =
        document.getElementById("submitOrderButton");

    const areaInput =
        document.getElementById("areaInput");

    const windowsOption =
        document.getElementById("windowsOption");

    const fridgeOption =
        document.getElementById("fridgeOption");

    const ovenOption =
        document.getElementById("ovenOption");

    const totalPrice =
        document.getElementById("totalPrice");

    const dateInput =
        document.getElementById("dateInput");

    const timeInput =
        document.getElementById("timeInput");

    const addressInput =
        document.getElementById("addressInput");

    const nameInput =
        document.getElementById("nameInput");

    const phoneInput =
        document.getElementById("phoneInput");

    const summaryService =
        document.getElementById("summaryService");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const summaryPrice =
        document.getElementById("summaryPrice");

    const serviceOptions =
        document.querySelectorAll(".service-option");

    const serviceCards =
        document.querySelectorAll(".service-card");


    /* ========================================
       SERVICES / PRICES
    ======================================== */

    const servicePrices = {
        maintenance: 1500,
        general: 2500,
        windows: 800,
        renovation: 4000
    };

    const serviceNames = {
        maintenance: "Поддерживающая уборка",
        general: "Генеральная уборка",
        windows: "Мытьё окон",
        renovation: "Уборка после ремонта"
    };

    const additionalPrices = {
        windows: 800,
        fridge: 500,
        oven: 400
    };

    let selectedService = "maintenance";


    /* ========================================
       THEME
    ======================================== */

    const THEME_STORAGE_KEY = "cleaningTheme";


    function getPreferredTheme() {
        const savedTheme =
            localStorage.getItem(THEME_STORAGE_KEY);

        if (
            savedTheme === "light" ||
            savedTheme === "dark"
        ) {
            return savedTheme;
        }

        if (
            tg &&
            tg.colorScheme === "dark"
        ) {
            return "dark";
        }

        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {
            return "dark";
        }

        return "light";
    }


    function updateTelegramTheme(theme) {
        const isDark = theme === "dark";

        const backgroundColor =
            isDark
                ? "#101512"
                : "#f5f7f4";

        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                backgroundColor
            );
        }

        if (tg) {
            if (typeof tg.setHeaderColor === "function") {
                tg.setHeaderColor(backgroundColor);
            }

            if (
                typeof tg.setBackgroundColor === "function"
            ) {
                tg.setBackgroundColor(backgroundColor);
            }
        }
    }


    function updateThemeIcon(theme) {
        if (!themeIcon) {
            return;
        }

        if (theme === "dark") {
            themeIcon.textContent = "☀";
            themeButton.setAttribute(
                "aria-label",
                "Включить светлую тему"
            );
        } else {
            themeIcon.textContent = "☾";
            themeButton.setAttribute(
                "aria-label",
                "Включить тёмную тему"
            );
        }
    }


    function applyTheme(theme, save = true) {
        if (
            theme !== "light" &&
            theme !== "dark"
        ) {
            theme = "light";
        }

        document.documentElement.dataset.theme =
            theme;

        updateThemeIcon(theme);
        updateTelegramTheme(theme);

        if (save) {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
            );
        }
    }


    applyTheme(
        getPreferredTheme(),
        false
    );


    if (themeButton) {
        themeButton.addEventListener(
            "click",
            function () {
                const currentTheme =
                    document.documentElement.dataset.theme ||
                    "light";

                const newTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";

                applyTheme(
                    newTheme,
                    true
                );

                if (
                    tg &&
                    typeof tg.HapticFeedback?.impactOccurred ===
                        "function"
                ) {
                    tg.HapticFeedback.impactOccurred(
                        "light"
                    );
                }
            }
        );
    }


    /* ========================================
       PAGE SWITCHING
    ======================================== */

    const pages = [
        homePage,
        orderPage,
        successPage
    ];


    function showPage(pageName) {
        pages.forEach(function (page) {
            if (!page) {
                return;
            }

            page.hidden = true;
            page.classList.remove("active");
        });

        let targetPage = null;

        if (pageName === "home") {
            targetPage = homePage;
        }

        if (pageName === "order") {
            targetPage = orderPage;
        }

        if (pageName === "success") {
            targetPage = successPage;
        }

        if (!targetPage) {
            return;
        }

        targetPage.hidden = false;

        void targetPage.offsetWidth;

        targetPage.classList.add("active");

        updateNavigation(pageName);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    function updateNavigation(pageName) {
        if (homeNav) {
            homeNav.classList.remove("active");
        }

        if (orderNav) {
            orderNav.classList.remove("active");
        }

        if (profileNav) {
            profileNav.classList.remove("active");
        }

        if (pageName === "home") {
            if (homeNav) {
                homeNav.classList.add("active");
            }
        }

        if (pageName === "order") {
            if (orderNav) {
                orderNav.classList.add("active");
            }
        }
    }


    /* ========================================
       HOME / ORDER NAVIGATION
    ======================================== */

    if (homeNav) {
        homeNav.addEventListener(
            "click",
            function () {
                showPage("home");
            }
        );
    }


    if (orderNav) {
        orderNav.addEventListener(
            "click",
            function () {
                showPage("order");
            }
        );
    }


    if (profileNav) {
        profileNav.addEventListener(
            "click",
            function () {
                openProfile();
            }
        );
    }


    /* ========================================
       SERVICE CARDS
    ======================================== */

    serviceCards.forEach(function (card) {
        card.addEventListener(
            "click",
            function () {
                const service =
                    card.dataset.service;

                if (!service) {
                    return;
                }

                selectService(service);

                showPage("order");
            }
        );
    });


    /* ========================================
       SERVICE OPTIONS
    ======================================== */

    serviceOptions.forEach(function (option) {
        option.addEventListener(
            "click",
            function () {
                const service =
                    option.dataset.service;

                if (!service) {
                    return;
                }

                selectService(service);
            }
        );
    });


    function selectService(service) {
        if (
            !Object.prototype.hasOwnProperty.call(
                servicePrices,
                service
            )
        ) {
            return;
        }

        selectedService = service;

        serviceOptions.forEach(
            function (option) {
                option.classList.remove(
                    "selected"
                );

                if (
                    option.dataset.service ===
                    service
                ) {
                    option.classList.add(
                        "selected"
                    );
                }
            }
        );

        updatePrice();
    }


    /* ========================================
       PRICE CALCULATION
    ======================================== */

    function calculatePrice() {
        let price =
            servicePrices[selectedService] || 0;

        const area =
            Number(areaInput?.value) || 0;


        /*
            Поддерживающая:
            1500 ₽ до 30 м²
            +60 ₽ за каждый м² свыше 30

            Генеральная:
            2500 ₽ до 30 м²
            +100 ₽ за каждый м² свыше 30

            После ремонта:
            4000 ₽ до 30 м²
            +140 ₽ за каждый м² свыше 30

            Мытьё окон:
            800 ₽ фиксировано
        */

        if (
            selectedService === "maintenance" &&
            area > 30
        ) {
            price +=
                (area - 30) * 60;
        }


        if (
            selectedService === "general" &&
            area > 30
        ) {
            price +=
                (area - 30) * 100;
        }


        if (
            selectedService === "renovation" &&
            area > 30
        ) {
            price +=
                (area - 30) * 140;
        }


        if (
            windowsOption &&
            windowsOption.checked
        ) {
            price +=
                additionalPrices.windows;
        }


        if (
            fridgeOption &&
            fridgeOption.checked
        ) {
            price +=
                additionalPrices.fridge;
        }


        if (
            ovenOption &&
            ovenOption.checked
        ) {
            price +=
                additionalPrices.oven;
        }


        return Math.round(price);
    }


    function formatPrice(price) {
        return (
            Number(price)
                .toLocaleString("ru-RU")
            + " ₽"
        );
    }


    function updatePrice(animated = true) {
        if (!totalPrice) {
            return;
        }

        const price =
            calculatePrice();

        totalPrice.textContent =
            formatPrice(price);

        const priceCard =
            totalPrice.closest(
                ".price-card"
            );

        if (
            animated &&
            priceCard
        ) {
            priceCard.classList.remove(
                "price-updated"
            );

            void priceCard.offsetWidth;

            priceCard.classList.add(
                "price-updated"
            );

            setTimeout(
                function () {
                    priceCard.classList.remove(
                        "price-updated"
                    );
                },
                300
            );
        }
    }


    /* ========================================
       PRICE EVENTS
    ======================================== */

    if (areaInput) {
        areaInput.addEventListener(
            "input",
            function () {
                let value =
                    Number(areaInput.value);

                if (
                    Number.isNaN(value)
                ) {
                    value = 1;
                }

                if (value < 1) {
                    value = 1;
                }

                if (value > 1000) {
                    value = 1000;
                }

                areaInput.value =
                    value;

                updatePrice();
            }
        );
    }


    [
        windowsOption,
        fridgeOption,
        ovenOption
    ].forEach(
        function (checkbox) {
            if (!checkbox) {
                return;
            }

            checkbox.addEventListener(
                "change",
                function () {
                    updatePrice();
                }
            );
        }
    );


    /* ========================================
       DATE / TIME
    ======================================== */

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    const todayString =
        `${year}-${month}-${day}`;


    if (dateInput) {
        dateInput.min =
            todayString;

        if (!dateInput.value) {
            dateInput.value =
                todayString;
        }
    }


    if (timeInput) {
        timeInput.min = "08:00";
        timeInput.max = "21:00";
    }


    /* ========================================
       PROFILE
    ======================================== */

    function openProfile() {
        if (!profileModal) {
            return;
        }

        if (tg?.initDataUnsafe?.user) {
            const user =
                tg.initDataUnsafe.user;

            const firstName =
                user.first_name || "";

            const lastName =
                user.last_name || "";

            const username =
                user.username
                    ? `@${user.username}`
                    : "";

            const fullName =
                `${firstName} ${lastName}`.trim();

            if (profileText) {
                if (username) {
                    profileText.textContent =
                        `${fullName} ${username}`;
                } else {
                    profileText.textContent =
                        fullName ||
                        "Пользователь Telegram";
                }
            }
        } else {
            if (profileText) {
                profileText.textContent =
                    "Профиль доступен внутри Telegram";
            }
        }

        profileModal.hidden = false;

        requestAnimationFrame(
            function () {
                profileModal.classList.add(
                    "active"
                );
            }
        );
    }


    function closeProfile() {
        if (!profileModal) {
            return;
        }

        profileModal.classList.remove(
            "active"
        );

        setTimeout(
            function () {
                profileModal.hidden = true;
            },
            300
        );
    }


    if (profileButton) {
        profileButton.addEventListener(
            "click",
            openProfile
        );
    }


    if (closeProfileButton) {
        closeProfileButton.addEventListener(
            "click",
            closeProfile
        );
    }


    if (profileModal) {
        const overlay =
            profileModal.querySelector(
                ".modal-overlay"
            );

        if (overlay) {
            overlay.addEventListener(
                "click",
                closeProfile
            );
        }
    }


    /* ========================================
       BACK HOME
    ======================================== */

    if (backHomeButton) {
        backHomeButton.addEventListener(
            "click",
            function () {
                showPage("home");
            }
        );
    }


    /* ========================================
       FORM VALIDATION
    ======================================== */

    function showValidationMessage(
        message
    ) {
        alert(message);
    }


    function validateForm() {
        const area =
            Number(areaInput?.value) || 0;

        if (
            area < 1 ||
            area > 1000
        ) {
            showValidationMessage(
                "Укажи площадь от 1 до 1000 м²."
            );

            areaInput?.focus();

            return false;
        }


        if (
            !dateInput ||
            !dateInput.value
        ) {
            showValidationMessage(
                "Выбери дату уборки."
            );

            dateInput?.focus();

            return false;
        }


        if (
            dateInput.value <
            todayString
        ) {
            showValidationMessage(
                "Нельзя выбрать прошедшую дату."
            );

            dateInput.focus();

            return false;
        }


        if (
            !timeInput ||
            !timeInput.value
        ) {
            showValidationMessage(
                "Выбери время уборки."
            );

            timeInput?.focus();

            return false;
        }


        if (
            timeInput.value < "08:00" ||
            timeInput.value > "21:00"
        ) {
            showValidationMessage(
                "Время уборки должно быть с 08:00 до 21:00."
            );

            timeInput.focus();

            return false;
        }


        const address =
            addressInput?.value.trim() || "";

        if (!address) {
            showValidationMessage(
                "Укажи адрес."
            );

            addressInput?.focus();

            return false;
        }


        const clientName =
            nameInput?.value.trim() || "";

        if (!clientName) {
            showValidationMessage(
                "Укажи имя."
            );

            nameInput?.focus();

            return false;
        }


        const phone =
            phoneInput?.value.trim() || "";

        if (!phone) {
            showValidationMessage(
                "Укажи номер телефона."
            );

            phoneInput?.focus();

            return false;
        }


        const phoneDigits =
            phone.replace(
                /\D/g,
                ""
            );

        if (
            phoneDigits.length < 10
        ) {
            showValidationMessage(
                "Проверь номер телефона."
            );

            phoneInput?.focus();

            return false;
        }


        return true;
    }


    /* ========================================
       SUBMIT ORDER
    ======================================== */

    if (submitOrderButton) {
        submitOrderButton.addEventListener(
            "click",
            function () {
                if (!validateForm()) {
                    return;
                }


                const price =
                    calculatePrice();

                const orderData = {
                    service:
                        selectedService,

                    serviceName:
                        serviceNames[
                            selectedService
                        ],

                    area:
                        Number(
                            areaInput.value
                        ),

                    extras: {
                        windows:
                            Boolean(
                                windowsOption?.checked
                            ),

                        fridge:
                            Boolean(
                                fridgeOption?.checked
                            ),

                        oven:
                            Boolean(
                                ovenOption?.checked
                            )
                    },

                    date:
                        dateInput.value,

                    time:
                        timeInput.value,

                    address:
                        addressInput.value.trim(),

                    name:
                        nameInput.value.trim(),

                    phone:
                        phoneInput.value.trim(),

                    price:
                        price
                };


                /* ================================
                   SAVE LOCALLY
                ================================= */

                try {
                    localStorage.setItem(
                        "lastCleaningOrder",
                        JSON.stringify(
                            orderData
                        )
                    );
                } catch (error) {
                    console.warn(
                        "Не удалось сохранить заказ:",
                        error
                    );
                }


                /* ================================
                   SEND TO TELEGRAM BOT
                ================================= */

                if (
                    tg &&
                    typeof tg.sendData ===
                        "function"
                ) {
                    tg.sendData(
                        JSON.stringify(
                            orderData
                        )
                    );
                } else {
                    console.warn(
                        "Telegram WebApp sendData недоступен."
                    );
                }


                /* ================================
                   SUCCESS SCREEN
                ================================= */

                if (summaryService) {
                    summaryService.textContent =
                        serviceNames[
                            selectedService
                        ];
                }

                if (summaryDate) {
                    summaryDate.textContent =
                        formatDate(
                            dateInput.value
                        );
                }

                if (summaryTime) {
                    summaryTime.textContent =
                        timeInput.value;
                }

                if (summaryPrice) {
                    summaryPrice.textContent =
                        formatPrice(price);
                }


                showPage("success");


                /* ================================
                   HAPTIC
                ================================= */

                if (
                    tg &&
                    tg.HapticFeedback &&
                    typeof tg.HapticFeedback
                        .notificationOccurred ===
                        "function"
                ) {
                    tg.HapticFeedback
                        .notificationOccurred(
                            "success"
                        );
                }
            }
        );
    }


    /* ========================================
       DATE FORMAT
    ======================================== */

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        const parts =
            dateString.split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]);

        const day =
            Number(parts[2]);

        const date =
            new Date(
                year,
                month - 1,
                day
            );

        return date.toLocaleDateString(
            "ru-RU",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    /* ========================================
       INITIALIZATION
    ======================================== */

    selectService(
        "maintenance"
    );

    updatePrice(false);

    showPage("home");


    /* ========================================
       TELEGRAM THEME UPDATE
    ======================================== */

    if (tg) {
        updateTelegramTheme(
            document.documentElement
                .dataset.theme ||
            "light"
        );
    }
});