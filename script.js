// ========================================
// TELEGRAM MINI APP
// ========================================

const tg = window.Telegram?.WebApp;


// ========================================
// ИНИЦИАЛИЗАЦИЯ TELEGRAM
// ========================================

if (tg) {
    tg.ready();
    tg.expand();

    if (tg.setHeaderColor) {
        tg.setHeaderColor("#f5f7f4");
    }

    if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#f5f7f4");
    }

    if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
    }
}


// ========================================
// СТРАНИЦЫ
// ========================================

const homePage = document.getElementById("homePage");
const orderPage = document.getElementById("orderPage");
const successPage = document.getElementById("successPage");


// ========================================
// НАВИГАЦИЯ
// ========================================

const homeNav = document.getElementById("homeNav");
const orderNav = document.getElementById("orderNav");
const profileNav = document.getElementById("profileNav");

const startOrderButton =
    document.getElementById("startOrderButton");

const orderBackButton =
    document.getElementById("orderBackButton");

const backHomeButton =
    document.getElementById("backHomeButton");


// ========================================
// ПРОФИЛЬ
// ========================================

const profileButton =
    document.getElementById("profileButton");

const profileModal =
    document.getElementById("profileModal");

const closeProfileButton =
    document.getElementById("closeProfileButton");

const profileText =
    document.getElementById("profileText");


// ========================================
// ФОРМА
// ========================================

const serviceOptions =
    document.querySelectorAll(".service-option");

const serviceCards =
    document.querySelectorAll(".service-card");

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

const submitOrderButton =
    document.getElementById("submitOrderButton");


// ========================================
// ИТОГОВЫЕ ДАННЫЕ
// ========================================

const summaryService =
    document.getElementById("summaryService");

const summaryDate =
    document.getElementById("summaryDate");

const summaryTime =
    document.getElementById("summaryTime");

const summaryPrice =
    document.getElementById("summaryPrice");


// ========================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ========================================

let selectedService = "general";


// ========================================
// ЦЕНЫ
// ========================================

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


// ========================================
// ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
// ========================================

const additionalPrices = {

    windows: 800,

    fridge: 500,

    oven: 400

};


// ========================================
// ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
// ========================================

function showPage(page) {

    homePage.hidden = true;
    orderPage.hidden = true;
    successPage.hidden = true;

    page.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// АКТИВНАЯ НИЖНЯЯ КНОПКА
// ========================================

function setActiveNav(button) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });

    if (button) {
        button.classList.add("active");
    }
}


// ========================================
// ОТКРЫТЬ ГЛАВНУЮ
// ========================================

function openHome() {

    showPage(homePage);

    setActiveNav(homeNav);

}


// ========================================
// ОТКРЫТЬ ЗАКАЗ
// ========================================

function openOrder() {

    showPage(orderPage);

    setActiveNav(orderNav);

    calculatePrice();

}


// ========================================
// КНОПКА "РАССЧИТАТЬ СТОИМОСТЬ"
// ========================================

startOrderButton.addEventListener(
    "click",
    () => {

        openOrder();

        haptic("light");

    }
);


// ========================================
// НИЖНЯЯ НАВИГАЦИЯ
// ========================================

homeNav.addEventListener(
    "click",
    () => {

        openHome();

        haptic("light");

    }
);


orderNav.addEventListener(
    "click",
    () => {

        openOrder();

        haptic("light");

    }
);


// ========================================
// НАЗАД ИЗ ЗАКАЗА
// ========================================

orderBackButton.addEventListener(
    "click",
    () => {

        openHome();

        haptic("light");

    }
);


// ========================================
// КАРТОЧКИ УСЛУГ НА ГЛАВНОЙ
// ========================================

serviceCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const service =
                card.dataset.service;

            selectService(service);

            openOrder();

            haptic("light");

        }
    );

});


// ========================================
// ВЫБОР УСЛУГИ
// ========================================

serviceOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            const service =
                option.dataset.service;

            selectService(service);

            haptic("selection");

        }
    );

});


function selectService(service) {

    selectedService = service;

    serviceOptions.forEach(option => {

        option.classList.remove("selected");

    });

    const selectedOption =
        document.querySelector(
            `.service-option[data-service="${service}"]`
        );

    if (selectedOption) {

        selectedOption.classList.add(
            "selected"
        );

    }

    calculatePrice();

}


// ========================================
// РАСЧЁТ СТОИМОСТИ
// ========================================

function calculatePrice() {

    let price =
        servicePrices[selectedService] || 0;


    // ------------------------------------
    // Площадь
    // ------------------------------------

    let area =
        Number(areaInput.value);

    if (!area || area < 1) {
        area = 1;
    }


    /*
        Для уборки помещения увеличиваем
        стоимость за площадь.

        Первые 50 м² входят в базовую цену.
        Каждые дополнительные 10 м²
        добавляют 100 ₽.
    */

    if (
        selectedService === "maintenance" ||
        selectedService === "general" ||
        selectedService === "renovation"
    ) {

        if (area > 50) {

            const extraArea =
                area - 50;

            const extraBlocks =
                Math.ceil(extraArea / 10);

            price +=
                extraBlocks * 100;

        }

    }


    // ------------------------------------
    // Дополнительные услуги
    // ------------------------------------

    if (
        windowsOption &&
        windowsOption.checked
    ) {

        price += additionalPrices.windows;

    }


    if (
        fridgeOption &&
        fridgeOption.checked
    ) {

        price += additionalPrices.fridge;

    }


    if (
        ovenOption &&
        ovenOption.checked
    ) {

        price += additionalPrices.oven;

    }


    // ------------------------------------
    // Вывод
    // ------------------------------------

    totalPrice.textContent =
        formatPrice(price);


    return price;

}


// ========================================
// СЛУШАТЕЛИ ФОРМЫ
// ========================================

areaInput.addEventListener(
    "input",
    calculatePrice
);


windowsOption.addEventListener(
    "change",
    () => {

        calculatePrice();

        haptic("selection");

    }
);


fridgeOption.addEventListener(
    "change",
    () => {

        calculatePrice();

        haptic("selection");

    }
);


ovenOption.addEventListener(
    "change",
    () => {

        calculatePrice();

        haptic("selection");

    }
);


// ========================================
// ФОРМАТ ЦЕНЫ
// ========================================

function formatPrice(price) {

    return (
        Math.round(price)
            .toLocaleString("ru-RU")
        + " ₽"
    );

}


// ========================================
// ДАТА
// ========================================

function setMinDate() {

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

    const date =
        `${year}-${month}-${day}`;

    dateInput.min = date;

    if (!dateInput.value) {
        dateInput.value = date;
    }

}


setMinDate();


// ========================================
// ПРОВЕРКА ВРЕМЕНИ
// ========================================

timeInput.addEventListener(
    "change",
    () => {

        if (!timeInput.value) {
            return;
        }

        const [hours, minutes] =
            timeInput.value
                .split(":")
                .map(Number);

        /*
            Работаем условно с 08:00 до 21:00.
        */

        const totalMinutes =
            hours * 60 + minutes;

        const minMinutes =
            8 * 60;

        const maxMinutes =
            21 * 60;

        if (
            totalMinutes < minMinutes ||
            totalMinutes > maxMinutes
        ) {

            showAlert(
                "Пожалуйста, выберите время с 08:00 до 21:00."
            );

            timeInput.value = "";

        }

    }
);


// ========================================
// ПРОФИЛЬ
// ========================================

profileButton.addEventListener(
    "click",
    openProfile
);


profileNav.addEventListener(
    "click",
    openProfile
);


function openProfile() {

    if (
        tg &&
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user
    ) {

        const user =
            tg.initDataUnsafe.user;

        let name =
            user.first_name ||
            "Пользователь";

        if (user.last_name) {

            name +=
                ` ${user.last_name}`;

        }

        profileText.textContent =
            `Вы вошли как ${name}.`;

    } else {

        profileText.textContent =
            "Приложение открыто в браузере.";

    }

    profileModal.hidden = false;

    haptic("light");

}


// ========================================
// ЗАКРЫТЬ ПРОФИЛЬ
// ========================================

closeProfileButton.addEventListener(
    "click",
    closeProfile
);


document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        closeProfile
    );


function closeProfile() {

    profileModal.hidden = true;

}


// ========================================
// ОФОРМЛЕНИЕ ЗАЯВКИ
// ========================================

submitOrderButton.addEventListener(
    "click",
    submitOrder
);


function submitOrder() {

    // ------------------------------------
    // Получаем данные
    // ------------------------------------

    const area =
        Number(areaInput.value);

    const address =
        addressInput.value.trim();

    const name =
        nameInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const date =
        dateInput.value;

    const time =
        timeInput.value;


    // ------------------------------------
    // Проверка услуги
    // ------------------------------------

    if (!selectedService) {

        showAlert(
            "Выберите тип уборки."
        );

        return;

    }


    // ------------------------------------
    // Проверка площади
    // ------------------------------------

    if (!area || area < 1) {

        showAlert(
            "Укажите площадь помещения."
        );

        areaInput.focus();

        return;

    }


    // ------------------------------------
    // Проверка даты
    // ------------------------------------

    if (!date) {

        showAlert(
            "Выберите дату уборки."
        );

        dateInput.focus();

        return;

    }


    // ------------------------------------
    // Проверка времени
    // ------------------------------------

    if (!time) {

        showAlert(
            "Выберите удобное время."
        );

        timeInput.focus();

        return;

    }


    // ------------------------------------
    // Проверка адреса
    // ------------------------------------

    if (!address) {

        showAlert(
            "Укажите адрес."
        );

        addressInput.focus();

        return;

    }


    // ------------------------------------
    // Проверка имени
    // ------------------------------------

    if (!name) {

        showAlert(
            "Укажите ваше имя."
        );

        nameInput.focus();

        return;

    }


    // ------------------------------------
    // Проверка телефона
    // ------------------------------------

    if (!phone) {

        showAlert(
            "Укажите номер телефона."
        );

        phoneInput.focus();

        return;

    }


    // ------------------------------------
    // Расчёт
    // ------------------------------------

    const price =
        calculatePrice();


    // ------------------------------------
    // Заполняем экран результата
    // ------------------------------------

    summaryService.textContent =
        serviceNames[selectedService];

    summaryDate.textContent =
        formatDate(date);

    summaryTime.textContent =
        time;

    summaryPrice.textContent =
        formatPrice(price);


    // ------------------------------------
    // Формируем данные заявки
    // ------------------------------------

    const orderData = {

        service:
            selectedService,

        serviceName:
            serviceNames[selectedService],

        area:
            area,

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


    // ------------------------------------
    // Сохраняем локально
    // ------------------------------------

    localStorage.setItem(
        "cleaningLastOrder",
        JSON.stringify(orderData)
    );


    // ------------------------------------
    // Telegram
    // ------------------------------------

    /*
        Пока здесь только подготовка данных.

        На следующем этапе подключим
        отправку заявки непосредственно
        в Telegram-бот.
    */

    console.log(
        "Новая заявка:",
        orderData
    );


    // ------------------------------------
    // Показываем результат
    // ------------------------------------

    showPage(successPage);

    setActiveNav(null);

    haptic("success");

}


// ========================================
// ФОРМАТ ДАТЫ
// ========================================

function formatDate(date) {

    if (!date) {
        return "—";
    }

    const parts =
        date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return (
        `${parts[2]}.${parts[1]}.${parts[0]}`
    );

}


// ========================================
// ВОЗВРАТ НА ГЛАВНУЮ
// ========================================

backHomeButton.addEventListener(
    "click",
    () => {

        openHome();

        haptic("light");

    }
);


// ========================================
// УВЕДОМЛЕНИЯ
// ========================================

function showAlert(text) {

    if (
        tg &&
        tg.showAlert
    ) {

        tg.showAlert(text);

    } else {

        alert(text);

    }

}


// ========================================
// HAPTIC FEEDBACK
// ========================================

function haptic(type) {

    if (
        !tg ||
        !tg.HapticFeedback
    ) {

        return;

    }


    if (type === "success") {

        tg.HapticFeedback.notificationOccurred(
            "success"
        );

        return;

    }


    if (type === "error") {

        tg.HapticFeedback.notificationOccurred(
            "error"
        );

        return;

    }


    if (type === "selection") {

        tg.HapticFeedback.selectionChanged();

        return;

    }


    tg.HapticFeedback.impactOccurred(
        "light"
    );

}


// ========================================
// НАЧАЛЬНОЕ СОСТОЯНИЕ
// ========================================

selectService("general");

calculatePrice();

openHome();