document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // TELEGRAM
    // ==========================================

    const tg = window.Telegram?.WebApp;

    if (tg) {
        tg.ready();
        tg.expand();

        if (tg.setHeaderColor) {
            tg.setHeaderColor("#f5f7f4");
        }

        if (tg.setBackgroundColor) {
            tg.setBackgroundColor("#f5f7f4");
        }
    }


    // ==========================================
    // ELEMENTS
    // ==========================================

    const homePage = document.getElementById("homePage");
    const orderPage = document.getElementById("orderPage");
    const successPage = document.getElementById("successPage");

    const startOrderButton =
        document.getElementById("startOrderButton");

    const submitOrderButton =
        document.getElementById("submitOrderButton");

    const backHomeButton =
        document.getElementById("backHomeButton");

    const homeNav =
        document.getElementById("homeNav");

    const orderNav =
        document.getElementById("orderNav");

    const profileNav =
        document.getElementById("profileNav");

    const profileButton =
        document.getElementById("profileButton");

    const profileModal =
        document.getElementById("profileModal");

    const closeProfileButton =
        document.getElementById("closeProfileButton");

    const profileText =
        document.getElementById("profileText");

    const areaInput =
        document.getElementById("areaInput");

    const windowsOption =
        document.getElementById("windowsOption");

    const fridgeOption =
        document.getElementById("fridgeOption");

    const ovenOption =
        document.getElementById("ovenOption");

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

    const totalPrice =
        document.getElementById("totalPrice");

    const summaryService =
        document.getElementById("summaryService");

    const summaryDate =
        document.getElementById("summaryDate");

    const summaryTime =
        document.getElementById("summaryTime");

    const summaryPrice =
        document.getElementById("summaryPrice");


    // ==========================================
    // DATA
    // ==========================================

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


    // ==========================================
    // PAGE SWITCHING
    // ==========================================

    function showPage(pageName) {

        homePage.hidden = true;
        orderPage.hidden = true;
        successPage.hidden = true;

        if (pageName === "home") {
            homePage.hidden = false;
        }

        if (pageName === "order") {
            orderPage.hidden = false;
        }

        if (pageName === "success") {
            successPage.hidden = false;
        }

        window.scrollTo(0, 0);
    }


    // ==========================================
    // SERVICE SELECTION
    // ==========================================

    function selectService(service) {

        selectedService = service;

        document
            .querySelectorAll(".service-option")
            .forEach(function (option) {

                option.classList.remove("selected");

                if (option.dataset.service === service) {
                    option.classList.add("selected");
                }

            });
    }


    // ==========================================
    // PRICE CALCULATION
    // ==========================================

    function calculatePrice() {

        let price = servicePrices[selectedService] || 0;

        const area =
            Number(areaInput.value) || 0;


        // Доплата за площадь
        if (
            selectedService !== "windows" &&
            selectedService !== "renovation" &&
            area > 50
        ) {

            const extraArea = area - 50;

            const extraBlocks =
                Math.ceil(extraArea / 10);

            price += extraBlocks * 100;
        }


        // Дополнительные услуги
        if (windowsOption.checked) {
            price += additionalPrices.windows;
        }

        if (fridgeOption.checked) {
            price += additionalPrices.fridge;
        }

        if (ovenOption.checked) {
            price += additionalPrices.oven;
        }

        return price;
    }


    function updatePrice() {

        const price = calculatePrice();

        totalPrice.textContent =
            price.toLocaleString("ru-RU") + " ₽";
    }


    // ==========================================
    // START ORDER
    // ==========================================

    startOrderButton.addEventListener(
        "click",
        function () {

            showPage("order");

            updatePrice();

        }
    );


    // ==========================================
    // SERVICE CARDS
    // ==========================================

    document
        .querySelectorAll(".service-card")
        .forEach(function (card) {

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

                    updatePrice();

                }
            );

        });


    // ==========================================
    // SERVICE OPTIONS
    // ==========================================

    document
        .querySelectorAll(".service-option")
        .forEach(function (option) {

            option.addEventListener(
                "click",
                function () {

                    const service =
                        option.dataset.service;

                    if (!service) {
                        return;
                    }

                    selectService(service);

                    updatePrice();

                }
            );

        });


    // ==========================================
    // BOTTOM NAVIGATION
    // ==========================================

    homeNav.addEventListener(
        "click",
        function () {

            showPage("home");

        }
    );


    orderNav.addEventListener(
        "click",
        function () {

            showPage("order");

            updatePrice();

        }
    );


    profileNav.addEventListener(
        "click",
        function () {

            openProfile();

        }
    );


    // ==========================================
    // PROFILE BUTTON
    // ==========================================

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                openProfile();

            }
        );

    }


    function openProfile() {

        if (!profileModal) {
            return;
        }

        profileModal.hidden = false;
        profileModal.classList.add("active");


        if (
            tg &&
            tg.initDataUnsafe &&
            tg.initDataUnsafe.user
        ) {

            const user =
                tg.initDataUnsafe.user;

            let text = "";

            if (user.first_name) {
                text += user.first_name;
            }

            if (user.last_name) {
                text +=
                    " " +
                    user.last_name;
            }

            if (user.username) {
                text +=
                    "\n@" +
                    user.username;
            }

            profileText.textContent =
                text || "Пользователь Telegram";

        } else {

            profileText.textContent =
                "Профиль доступен внутри Telegram.";

        }

    }


    // ==========================================
    // CLOSE PROFILE
    // ==========================================

    if (closeProfileButton) {

        closeProfileButton.addEventListener(
            "click",
            function () {

                closeProfile();

            }
        );

    }


    function closeProfile() {

        profileModal.classList.remove("active");
        profileModal.hidden = true;

    }


    if (profileModal) {

        profileModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === profileModal
                ) {

                    closeProfile();

                }

            }
        );

    }


    // ==========================================
    // PRICE INPUTS
    // ==========================================

    areaInput.addEventListener(
        "input",
        function () {

            updatePrice();

        }
    );


    windowsOption.addEventListener(
        "change",
        function () {

            updatePrice();

        }
    );


    fridgeOption.addEventListener(
        "change",
        function () {

            updatePrice();

        }
    );


    ovenOption.addEventListener(
        "change",
        function () {

            updatePrice();

        }
    );


    // ==========================================
    // DATE
    // ==========================================

    const today = new Date();

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

    dateInput.min =
        `${year}-${month}-${day}`;


    // ==========================================
    // TIME
    // ==========================================

    timeInput.min = "08:00";
    timeInput.max = "21:00";


    // ==========================================
    // SUBMIT ORDER
    // ==========================================

    submitOrderButton.addEventListener(
        "click",
        function () {

            const area =
                areaInput.value.trim();

            const date =
                dateInput.value;

            const time =
                timeInput.value;

            const address =
                addressInput.value.trim();

            const name =
                nameInput.value.trim();

            const phone =
                phoneInput.value.trim();


            // Проверяем площадь
            if (!area) {

                alert(
                    "Укажи площадь помещения."
                );

                areaInput.focus();

                return;
            }


            if (Number(area) <= 0) {

                alert(
                    "Площадь должна быть больше 0."
                );

                areaInput.focus();

                return;
            }


            // Проверяем дату
            if (!date) {

                alert(
                    "Выбери дату."
                );

                dateInput.focus();

                return;
            }


            // Проверяем время
            if (!time) {

                alert(
                    "Выбери время."
                );

                timeInput.focus();

                return;
            }


            // Проверяем адрес
            if (!address) {

                alert(
                    "Укажи адрес."
                );

                addressInput.focus();

                return;
            }


            // Проверяем имя
            if (!name) {

                alert(
                    "Укажи имя."
                );

                nameInput.focus();

                return;
            }


            // Проверяем телефон
            if (!phone) {

                alert(
                    "Укажи номер телефона."
                );

                phoneInput.focus();

                return;
            }


            // Рассчитываем цену
            const price =
                calculatePrice();


            // Формируем заявку
            const orderData = {

                service:
                    selectedService,

                serviceName:
                    serviceNames[selectedService],

                area:
                    Number(area),

                windows:
                    windowsOption.checked,

                fridge:
                    fridgeOption.checked,

                oven:
                    ovenOption.checked,

                date:
                    date,

                time:
                    time,

                address:
                    address,

                name:
                    name,

                phone:
                    phone,

                price:
                    price

            };


            // Сохраняем заявку
            localStorage.setItem(
                "cleaningLastOrder",
                JSON.stringify(orderData)
            );


            // Показываем результат
            summaryService.textContent =
                orderData.serviceName;

            summaryDate.textContent =
                orderData.date;

            summaryTime.textContent =
                orderData.time;

            summaryPrice.textContent =
                orderData.price
                    .toLocaleString("ru-RU") +
                " ₽";


            showPage("success");


            // Вибрация Telegram
            if (
                tg &&
                tg.HapticFeedback
            ) {

                tg.HapticFeedback
                    .notificationOccurred(
                        "success"
                    );

            }

        }
    );


    // ==========================================
    // BACK HOME
    // ==========================================

    backHomeButton.addEventListener(
        "click",
        function () {

            showPage("home");

        }
    );


    // ==========================================
    // INITIAL STATE
    // ==========================================

    selectService("maintenance");

    updatePrice();

    showPage("home");

});