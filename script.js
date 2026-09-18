const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();
}

/* ========================================
   API
======================================== */

const API_URL = "https://plastic-settle-missouri-mid.trycloudflare.com";

async function apiFetch(path, options = {}) {
    const initData = tg?.initData || "";
    const headers = {
        "X-Telegram-Init-Data": initData,
        ...(options.headers || {})
    };
    const url = API_URL + path;
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const err = new Error("HTTP " + response.status);
        err.status = response.status;
        throw err;
    }
    return response.json();
}

/* ========================================
   ELEMENTS
======================================== */

const themeButton      = document.getElementById("themeButton");
const themeIcon        = document.getElementById("themeIcon");
const themeColorMeta   = document.getElementById("themeColorMeta");

const profileButton    = document.getElementById("profileButton");
const profileModal     = document.getElementById("profileModal");
const closeProfileButton = document.getElementById("closeProfileButton");
const profileText      = document.getElementById("profileText");

const homeNav          = document.getElementById("homeNav");
const orderNav         = document.getElementById("orderNav");
const profileNav       = document.getElementById("profileNav");

const pages            = document.querySelectorAll(".page");

const serviceCards     = document.querySelectorAll(".service-card");
const serviceOptions   = document.querySelectorAll(".service-option");

const roomsInput       = document.getElementById("roomsInput");
const bathroomsInput   = document.getElementById("bathroomsInput");
const areaInput        = document.getElementById("areaInput");
const floorInput       = document.getElementById("floorInput");

const elevatorOption   = document.getElementById("elevatorOption");
const petsOption       = document.getElementById("petsOption");

const windowsOption    = document.getElementById("windowsOption");
const fridgeOption     = document.getElementById("fridgeOption");
const ovenOption       = document.getElementById("ovenOption");
const balconyOption    = document.getElementById("balconyOption");
const sofaOption       = document.getElementById("sofaOption");
const mattressOption   = document.getElementById("mattressOption");
const cabinetsOption   = document.getElementById("cabinetsOption");

const dirtOptions      = document.querySelectorAll(".dirt-option");

const totalPrice       = document.getElementById("totalPrice");

const startOrderButton = document.getElementById("startOrderButton");
const orderBackButton  = document.getElementById("orderBackButton");
const submitOrderButton = document.getElementById("submitOrderButton");

const addressInput     = document.getElementById("addressInput");
const nameInput        = document.getElementById("nameInput");
const phoneInput       = document.getElementById("phoneInput");

const summaryService   = document.getElementById("summaryService");
const summaryPrice     = document.getElementById("summaryPrice");

const backHomeButton   = document.getElementById("backHomeButton");
/* Confirm page */

const confirmBackButton   = document.getElementById("confirmBackButton");
const confirmSummary      = document.getElementById("confirmSummary");
const confirmSubmitButton = document.getElementById("confirmSubmitButton");
const confirmEditButton   = document.getElementById("confirmEditButton");

/* Quick actions */

const quickOrderButton      = document.getElementById("quickOrderButton");
const quickMyOrdersButton   = document.getElementById("quickMyOrdersButton");
const quickServicesButton   = document.getElementById("quickServicesButton");
const quickPromoButton      = document.getElementById("quickPromoButton");
const quickAboutButton      = document.getElementById("quickAboutButton");
const quickContactButton    = document.getElementById("quickContactButton");

/* My orders page (не используется, но кнопки есть) */

const myOrdersBackButton = document.getElementById("myOrdersBackButton");
const myOrdersList       = document.getElementById("myOrdersList");

/* Static pages */

const servicesBackButton  = document.getElementById("servicesBackButton");
const servicesOrderButton = document.getElementById("servicesOrderButton");

const promoBackButton     = document.getElementById("promoBackButton");
const promoOrderButton    = document.getElementById("promoOrderButton");

const aboutBackButton     = document.getElementById("aboutBackButton");

const contactsBackButton  = document.getElementById("contactsBackButton");
const contactsOrderButton = document.getElementById("contactsOrderButton");

const priceItems          = document.querySelectorAll(".price-item[data-service]");

let selectedService    = "maintenance";
let selectedDirt       = "light";
let modalHideTimer     = null;

/* ========================================
   THEME
======================================== */

const THEME_KEY = "cleaningTheme";

function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    if (tg?.colorScheme === "dark") return "dark";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) {
        themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    }
    if (themeButton) {
        themeButton.setAttribute(
            "aria-label",
            theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
        );
    }
    if (themeColorMeta) {
        themeColorMeta.setAttribute(
            "content",
            theme === "dark" ? "#0f0f0f" : "#faf8f4"
        );
    }
    if (tg) {
        try {
            tg.setHeaderColor(theme === "dark" ? "#0f0f0f" : "#faf8f4");
            tg.setBackgroundColor(theme === "dark" ? "#0f0f0f" : "#faf8f4");
        } catch (e) {
            console.log("Telegram theme error:", e);
        }
    }
}

let currentTheme = getInitialTheme();
applyTheme(currentTheme);

themeButton?.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
});

/* ========================================
   NAVIGATION
======================================== */

function showPage(pageId) {
    pages.forEach((page) => {
        const isActive = page.id === pageId;
        page.classList.toggle("active", isActive);
        page.hidden = !isActive;
    });

    [homeNav, orderNav, profileNav].forEach((btn) => {
        if (btn) btn.classList.remove("active");
    });

    if (pageId === "homePage" && homeNav) homeNav.classList.add("active");
    if (pageId === "orderPage" && orderNav) orderNav.classList.add("active");
    if (pageId === "successPage" && homeNav) homeNav.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

homeNav?.addEventListener("click", () => showPage("homePage"));
orderNav?.addEventListener("click", () => showPage("orderPage"));

/* ========================================
   PROFILE
======================================== */

function updateProfileText() {
    if (!profileText) return;

    const user = tg?.initDataUnsafe?.user;

    if (user) {
        const fullName = [user.first_name, user.last_name]
            .filter(Boolean)
            .join(" ");

        profileText.textContent =
            `Имя: ${fullName || "—"}\n` +
            `Username: ${user.username ? "@" + user.username : "—"}\n` +
            `ID: ${user.id}`;
    } else {
        profileText.textContent =
            "Откройте приложение через Telegram, чтобы увидеть данные профиля.";
    }
}

function openProfile() {
    if (!profileModal) return;

    if (modalHideTimer) {
        clearTimeout(modalHideTimer);
        modalHideTimer = null;
    }

    updateProfileText();
    profileModal.hidden = false;

    requestAnimationFrame(() => {
        profileModal.classList.add("active");
    });
}

function closeProfile() {
    if (!profileModal) return;

    profileModal.classList.remove("active");

    modalHideTimer = setTimeout(() => {
        profileModal.hidden = true;
    }, 300);
}

profileButton?.addEventListener("click", openProfile);
profileNav?.addEventListener("click", openProfile);
closeProfileButton?.addEventListener("click", closeProfile);

profileModal?.addEventListener("click", (e) => {
    if (
        e.target === profileModal ||
        e.target.classList.contains("modal-overlay")
    ) {
        closeProfile();
    }
});

/* ========================================
   PRICING
======================================== */

const PRICES = {
    maintenance: {
        name: "Поддерживающая уборка",
        base: 1500,
        baseArea: 30,
        pricePerExtraM2: 60
    },
    general: {
        name: "Генеральная уборка",
        base: 2500,
        baseArea: 30,
        pricePerExtraM2: 100
    },
    windows: {
        name: "Мытьё окон",
        base: 800,
        baseArea: 0,
        pricePerExtraM2: 0
    },
    renovation: {
        name: "Уборка после ремонта",
        base: 4000,
        baseArea: 30,
        pricePerExtraM2: 140
    }
};

function getArea() {
    return Math.max(0, Number(areaInput?.value) || 0);
}

function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
}

function calculatePrice() {
    const service = PRICES[selectedService];
    if (!service) return 0;

    const area = getArea();
    let price = 0;

    if (selectedService === "windows") {
        price = service.base;
    } else if (area <= service.baseArea) {
        price = service.base;
    } else {
        price = service.base + (area - service.baseArea) * service.pricePerExtraM2;
    }

    if (windowsOption?.checked && selectedService !== "windows") price += 800;
    if (fridgeOption?.checked)    price += 500;
    if (ovenOption?.checked)      price += 400;
    if (balconyOption?.checked)   price += 800;
    if (sofaOption?.checked)      price += 1500;
    if (mattressOption?.checked)  price += 1200;
    if (cabinetsOption?.checked)  price += 1000;

    return Math.round(price);
}

function updatePrice() {
    if (!totalPrice) return;

    const price = calculatePrice();
    const priceCard = totalPrice.closest(".price-card");

    if (priceCard) {
        priceCard.classList.remove("price-updated");
        void priceCard.offsetWidth;
    }

    totalPrice.textContent = formatPrice(price);

    if (priceCard) {
        priceCard.classList.add("price-updated");
    }
}

/* ========================================
   SERVICE SELECTION
======================================== */

function selectService(service, openOrder = false) {
    if (!PRICES[service]) return;

    selectedService = service;

    serviceCards.forEach((card) => {
        card.classList.toggle("selected", card.dataset.service === service);
    });

    serviceOptions.forEach((opt) => {
        opt.classList.toggle("selected", opt.dataset.service === service);
    });

    if (windowsOption) {
        if (service === "windows") {
            windowsOption.checked = false;
            windowsOption.disabled = true;
        } else {
            windowsOption.disabled = false;
        }
    }

    updatePrice();

    if (openOrder) showPage("orderPage");
}

serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
        selectService(card.dataset.service, true);
    });
});

serviceOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
        selectService(opt.dataset.service);
    });
});

/* ========================================
   AREA / EXTRAS
======================================== */

areaInput?.addEventListener("input", () => {
    let v = Number(areaInput.value);

    if (!Number.isNaN(v)) {
        if (v > 1000) areaInput.value = "1000";
        if (v < 1 && areaInput.value !== "") areaInput.value = "1";
    }

    areaInput.classList.remove("error");
    updatePrice();
});

[
    windowsOption,
    fridgeOption,
    ovenOption,
    balconyOption,
    sofaOption,
    mattressOption,
    cabinetsOption
].forEach((cb) => {
    cb?.addEventListener("change", () => {
        console.log("Extra changed:", cb?.id, cb?.checked);
        updatePrice();
    });
});

/* Dirt level */

dirtOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
        selectedDirt = btn.dataset.dirt || "light";
        dirtOptions.forEach((b) => {
            b.classList.toggle("selected", b === btn);
        });
    });
});

/* ========================================
   START / BACK
======================================== */

startOrderButton?.addEventListener("click", () => {
    showPage("orderPage");
});

orderBackButton?.addEventListener("click", () => {
    showPage("homePage");
});

backHomeButton?.addEventListener("click", () => {
    showPage("homePage");
});

/* ========================================
   QUICK ACTIONS
======================================== */

quickOrderButton?.addEventListener("click", () => {
    showPage("orderPage");
});

quickMyOrdersButton?.addEventListener("click", () => {
    if (tg?.showAlert) {
        tg.showAlert(
            "История заказов доступна в боте.\n\n" +
            "Вернитесь в чат и нажмите 📋 Мои заявки."
        );
    } else {
        alert("История заказов доступна в боте. Нажмите 📋 Мои заявки.");
    }
});

quickServicesButton?.addEventListener("click", () => {
    showPage("servicesPage");
});

quickPromoButton?.addEventListener("click", () => {
    showPage("promoPage");
});

quickAboutButton?.addEventListener("click", () => {
    showPage("aboutPage");
});

quickContactButton?.addEventListener("click", () => {
    showPage("contactsPage");
});

/* Static pages — back buttons */

myOrdersBackButton?.addEventListener("click", () => showPage("homePage"));
servicesBackButton?.addEventListener("click", () => showPage("homePage"));
promoBackButton?.addEventListener("click",    () => showPage("homePage"));
aboutBackButton?.addEventListener("click",    () => showPage("homePage"));
contactsBackButton?.addEventListener("click", () => showPage("homePage"));

/* Static pages — «Оформить заявку» */

servicesOrderButton?.addEventListener("click", () => showPage("orderPage"));
promoOrderButton?.addEventListener("click",    () => showPage("orderPage"));
contactsOrderButton?.addEventListener("click", () => showPage("orderPage"));

/* Price items — клик по услуге → экран заказа с выбранной услугой */

priceItems.forEach((item) => {
    item.addEventListener("click", () => {
        const service = item.dataset.service;
        if (service && PRICES[service]) {
            selectService(service, true);
        } else {
            showPage("orderPage");
        }
    });
});

/* ========================================
   VALIDATION
======================================== */

function validateForm() {
    let valid = true;

    const area = getArea();

    if (selectedService !== "windows" && area <= 0) {
        areaInput?.classList.add("error");
        valid = false;
    } else {
        areaInput?.classList.remove("error");
    }

    if (!addressInput?.value.trim()) {
        addressInput?.classList.add("error");
        valid = false;
    } else {
        addressInput?.classList.remove("error");
    }

    if (!nameInput?.value.trim()) {
        nameInput?.classList.add("error");
        valid = false;
    } else {
        nameInput?.classList.remove("error");
    }

    const phoneDigits = (phoneInput?.value || "").replace(/\D/g, "");

    if (phoneDigits.length < 6) {
        phoneInput?.classList.add("error");
        valid = false;
    } else {
        phoneInput?.classList.remove("error");
    }

    return valid;
}

[areaInput, addressInput, nameInput, phoneInput].forEach((input) => {
    input?.addEventListener("input", () => {
        input.classList.remove("error");
    });
});

function escapeHtml(s) {
    return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ========================================
   SUBMIT ORDER
======================================== */

/* Клик по «Оформить заявку» → открываем подтверждение */

let pendingOrderData = null;

submitOrderButton?.addEventListener("click", () => {
    if (!validateForm()) return;

    const price = calculatePrice();
    const service = PRICES[selectedService];

    const orderData = {
        service: selectedService,
        serviceName: service?.name || "",
        area: selectedService === "windows" ? 0 : getArea(),
        extras: {
            windows:  Boolean(windowsOption?.checked && selectedService !== "windows"),
            fridge:   Boolean(fridgeOption?.checked),
            oven:     Boolean(ovenOption?.checked),
            balcony:  Boolean(balconyOption?.checked),
            sofa:     Boolean(sofaOption?.checked),
            mattress: Boolean(mattressOption?.checked),
            cabinets: Boolean(cabinetsOption?.checked)
        },
        object: {
            rooms:     Number(roomsInput?.value)     || 0,
            bathrooms: Number(bathroomsInput?.value) || 0,
            floor:     Number(floorInput?.value)     || 0,
            elevator:  Boolean(elevatorOption?.checked),
            pets:      Boolean(petsOption?.checked),
            dirtLevel: selectedDirt
        },
        address: addressInput?.value.trim() || "",
        name:    nameInput?.value.trim()    || "",
        phone:   phoneInput?.value.trim()   || "",
        price:   price
    };

    pendingOrderData = orderData;
    renderConfirmSummary(orderData);
    showPage("confirmPage");
});


function renderConfirmSummary(order) {
    if (!confirmSummary) return;

    const rows = [];

    // Услуга
    rows.push('<div class="confirm-section">');
    rows.push('<span class="confirm-section-title">УСЛУГА</span>');
    rows.push(confirmRow("Тип", order.serviceName));
    if (order.area > 0 && order.service !== "windows") {
        rows.push(confirmRow("Площадь", order.area + " м²"));
    }
    rows.push('</div>');

    // Параметры объекта
    const objRows = [];
    if (order.object.rooms)     objRows.push(confirmRow("Комнат", order.object.rooms));
    if (order.object.bathrooms) objRows.push(confirmRow("Санузлов", order.object.bathrooms));
    if (order.object.floor)     objRows.push(confirmRow("Этаж", order.object.floor));
    if (order.object.elevator)  objRows.push(confirmRow("Лифт", "есть"));
    if (order.object.pets)      objRows.push(confirmRow("Животные", "есть"));

    const dirtMap = { light: "Лёгкое", medium: "Среднее", heavy: "Сильное" };
    if (dirtMap[order.object.dirtLevel]) {
        objRows.push(confirmRow("Загрязнение", dirtMap[order.object.dirtLevel]));
    }

    if (objRows.length) {
        rows.push('<div class="confirm-section">');
        rows.push('<span class="confirm-section-title">ПОМЕЩЕНИЕ</span>');
        rows.push(...objRows);
        rows.push('</div>');
    }

    // Доп. услуги
    const extras = [];
    if (order.extras.windows)  extras.push("Окна");
    if (order.extras.fridge)   extras.push("Холодильник");
    if (order.extras.oven)     extras.push("Духовка");
    if (order.extras.balcony)  extras.push("Балкон");
    if (order.extras.sofa)     extras.push("Диван");
    if (order.extras.mattress) extras.push("Матрас");
    if (order.extras.cabinets) extras.push("Шкафы");

    if (extras.length) {
        rows.push('<div class="confirm-section">');
        rows.push('<span class="confirm-section-title">ДОПОЛНИТЕЛЬНО</span>');
        rows.push(confirmRow("Услуги", extras.join(", ")));
        rows.push('</div>');
    }

    // Адрес
    rows.push('<div class="confirm-section">');
    rows.push('<span class="confirm-section-title">АДРЕС</span>');
    rows.push(confirmRow("Куда", order.address));
    rows.push('</div>');

    // Контакты
    rows.push('<div class="confirm-section">');
    rows.push('<span class="confirm-section-title">КОНТАКТЫ</span>');
    rows.push(confirmRow("Имя", order.name));
    rows.push(confirmRow("Телефон", order.phone));
    rows.push('</div>');

    // Итог
    const priceFormatted = formatPrice(order.price);
    rows.push(
        '<div class="confirm-total">' +
            '<span class="confirm-total-label">Предварительная стоимость</span>' +
            '<span class="confirm-total-value">' + priceFormatted + '</span>' +
        '</div>'
    );

    confirmSummary.innerHTML = rows.join("");
}


function confirmRow(label, value) {
    return (
        '<div class="confirm-row">' +
            '<span class="confirm-row-label">' + escapeHtml(label) + '</span>' +
            '<span class="confirm-row-value">' + escapeHtml(value) + '</span>' +
        '</div>'
    );
}


/* Кнопки на экране подтверждения */

confirmBackButton?.addEventListener("click", () => {
    showPage("orderPage");
});

confirmEditButton?.addEventListener("click", () => {
    showPage("orderPage");
});

confirmSubmitButton?.addEventListener("click", () => {
    if (!pendingOrderData) return;

    const orderData = pendingOrderData;

    try {
        localStorage.setItem("lastCleaningOrder", JSON.stringify(orderData));
    } catch (e) {
        console.log("LocalStorage error:", e);
    }

    if (tg && typeof tg.sendData === "function") {
        try {
            tg.sendData(JSON.stringify(orderData));
        } catch (e) {
            console.log("Telegram sendData error:", e);
        }
    }

    if (summaryService) summaryService.textContent = orderData.serviceName;
    if (summaryPrice)   summaryPrice.textContent   = formatPrice(orderData.price);

    showPage("successPage");

    try {
        tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch (e) {
        console.log("Haptic error:", e);
    }
});

/* ========================================
   INIT
======================================== */

selectService(selectedService);
showPage("homePage");
updateProfileText();