const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();
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
const quickOrderButton      = document.getElementById("quickOrderButton");
const quickMyOrdersButton   = document.getElementById("quickMyOrdersButton");
const quickServicesButton   = document.getElementById("quickServicesButton");
const quickPromoButton      = document.getElementById("quickPromoButton");
const quickAboutButton      = document.getElementById("quickAboutButton");
const quickContactButton    = document.getElementById("quickContactButton");
const orderBackButton  = document.getElementById("orderBackButton");
const submitOrderButton = document.getElementById("submitOrderButton");

const addressInput     = document.getElementById("addressInput");
const nameInput        = document.getElementById("nameInput");
const phoneInput       = document.getElementById("phoneInput");

const summaryService   = document.getElementById("summaryService");
const summaryPrice     = document.getElementById("summaryPrice");

const backHomeButton   = document.getElementById("backHomeButton");

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
        void priceCard.offsetWidth; // перезапуск анимации
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

    // Доп. опция "Мытьё окон" не имеет смысла, если сама услуга — мытьё окон
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

quickOrderButton?.addEventListener("click", () => {
    showPage("orderPage");
});

quickMyOrdersButton?.addEventListener("click", () => {
    console.log("Мои заказы — экран будет на шаге 2");
});

quickServicesButton?.addEventListener("click", () => {
    console.log("Услуги — экран будет на шаге 3");
});

quickPromoButton?.addEventListener("click", () => {
    console.log("Акции — экран будет на шаге 5");
});

quickAboutButton?.addEventListener("click", () => {
    console.log("О компании — экран будет на шаге 4");
});

quickContactButton?.addEventListener("click", () => {
    console.log("Связаться — экран будет на шаге 4");
});

orderBackButton?.addEventListener("click", () => {
    showPage("homePage");
});

backHomeButton?.addEventListener("click", () => {
    showPage("homePage");
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
   INIT
======================================== */

selectService(selectedService);
showPage("homePage");
updateProfileText();