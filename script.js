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

const areaInput        = document.getElementById("areaInput");

const windowsOption    = document.getElementById("windowsOption");
const fridgeOption     = document.getElementById("fridgeOption");
const ovenOption       = document.getElementById("ovenOption");

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

/* Quick actions */

const quickOrderButton      = document.getElementById("quickOrderButton");
const quickMyOrdersButton   = document.getElementById("quickMyOrdersButton");
const quickServicesButton   = document.getElementById("quickServicesButton");
const quickPromoButton      = document.getElementById("quickPromoButton");
const quickAboutButton      = document.getElementById("quickAboutButton");
const quickContactButton    = document.getElementById("quickContactButton");

/* My orders */

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
    if (fridgeOption?.checked)  price += 500;
    if (ovenOption?.checked)    price += 400;

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

[windowsOption, fridgeOption, ovenOption].forEach((cb) => {
    cb?.addEventListener("change", updatePrice);
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

/* ========================================
   SUBMIT ORDER
======================================== */

submitOrderButton?.addEventListener("click", () => {
    if (!validateForm()) return;

    const price = calculatePrice();
    const service = PRICES[selectedService];

    const orderData = {
        service: selectedService,
        serviceName: service?.name || "",
        area: selectedService === "windows" ? 0 : getArea(),
        extras: {
            windows: Boolean(windowsOption?.checked && selectedService !== "windows"),
            fridge:  Boolean(fridgeOption?.checked),
            oven:    Boolean(ovenOption?.checked)
        },
        address: addressInput?.value.trim() || "",
        name:    nameInput?.value.trim()    || "",
        phone:   phoneInput?.value.trim()   || "",
        price:   price
    };

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
    if (summaryPrice)   summaryPrice.textContent   = formatPrice(price);

    showPage("successPage");

    try {
        tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch (e) {
        console.log("Haptic error:", e);
    }
});

/* ========================================
   MY ORDERS
======================================== */

function escapeHtml(s) {
    return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderOrderCard(order) {
    const status = order.status || "Новая";
    const statusClass = status === "Завершена" ? "status-done" : "status-new";

    const extrasLine = (order.extras && order.extras.length)
        ? `<div class="order-item-row"><span class="label">Доп.</span><span class="value">${escapeHtml(order.extras.join(", "))}</span></div>`
        : "";

    const areaLine = (order.area && order.area > 0 && order.service !== "windows")
        ? `<div class="order-item-row"><span class="label">Площадь</span><span class="value">${order.area} м²</span></div>`
        : "";

    return `
        <div class="order-item" data-id="${order.id}">
            <div class="order-item-head">
                <div class="order-item-title">
                    <span class="order-item-number">ЗАКАЗ №${escapeHtml(order.id)}</span>
                    <span class="order-item-service">${escapeHtml(order.serviceName)}</span>
                </div>
                <span class="order-item-status ${statusClass}">${escapeHtml(status)}</span>
            </div>

            <div class="order-item-rows">
                ${areaLine}
                ${extrasLine}
                <div class="order-item-row">
                    <span class="label">Адрес</span>
                    <span class="value">${escapeHtml(order.address)}</span>
                </div>
                <div class="order-item-row">
                    <span class="label">Создан</span>
                    <span class="value">${escapeHtml(order.createdAt || "—")}</span>
                </div>
                <div class="order-item-row">
                    <span class="label">Стоимость</span>
                    <span class="value order-item-price">${formatPrice(order.price || 0)}</span>
                </div>
            </div>

            <div class="order-item-actions">
                <button
                    class="order-item-btn"
                    data-action="contact"
                    data-id="${order.id}"
                    type="button"
                >
                    💬 Связаться
                </button>
                <button
                    class="order-item-btn danger"
                    data-action="delete"
                    data-id="${order.id}"
                    type="button"
                >
                    🗑 Отменить
                </button>
            </div>
        </div>
    `;
}

function renderEmptyOrders(message) {
    if (!myOrdersList) return;
    myOrdersList.innerHTML = `
        <div class="my-orders-empty">
            <div class="my-orders-empty-icon">📋</div>
            <h3>Заказов пока нет</h3>
            <p>${escapeHtml(message || "Оформите первую заявку — и она появится здесь.")}</p>
        </div>
    `;
}

async function renderMyOrders() {
    if (!myOrdersList) return;

    myOrdersList.innerHTML = `
        <div class="my-orders-empty">
            <div class="my-orders-empty-icon">⏳</div>
            <p>Загружаем заказы...</p>
        </div>
    `;

    try {
        const data = await apiFetch("/api/orders");
        const orders = data.orders || [];

        if (orders.length === 0) {
            renderEmptyOrders();
            return;
        }

        myOrdersList.innerHTML = orders.map(renderOrderCard).join("");

        myOrdersList.querySelectorAll(".order-item-btn").forEach((btn) => {
            btn.addEventListener("click", () => handleOrderAction(btn));
        });
    } catch (e) {
        console.log("renderMyOrders error:", e);
        if (e.status === 401) {
            renderEmptyOrders("Откройте приложение через Telegram, чтобы увидеть заказы.");
        } else {
            renderEmptyOrders("Не удалось загрузить заказы. Попробуйте позже.");
        }
    }
}

async function handleOrderAction(btn) {
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "delete") {
        let confirmed = false;

        if (tg?.showConfirm) {
            confirmed = await new Promise((resolve) => {
                tg.showConfirm("Отменить заказ №" + id + "?", resolve);
            });
        } else {
            confirmed = confirm("Отменить заказ №" + id + "?");
        }

        if (!confirmed) return;

        try {
            await apiFetch("/api/orders/" + id, { method: "DELETE" });
            renderMyOrders();
        } catch (e) {
            console.log("delete error:", e);
            if (tg?.showAlert) {
                tg.showAlert("Не удалось отменить заказ.");
            } else {
                alert("Не удалось отменить заказ.");
            }
        }
    } else if (action === "contact") {
        if (tg?.showAlert) {
            tg.showAlert("Напишите менеджеру в чат бота.");
        } else {
            alert("Напишите менеджеру в чат бота.");
        }
    }
}

/* ========================================
   INIT
======================================== */

selectService(selectedService);
showPage("homePage");
updateProfileText();