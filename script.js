const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();
}

/* =========================
   ELEMENTS
========================= */

const themeButton = document.getElementById("themeButton");
const themeIcon = document.getElementById("themeIcon");
const themeColorMeta = document.getElementById("themeColorMeta");

const profileButton = document.getElementById("profileButton");
const profileModal = document.getElementById("profileModal");
const closeProfileButton = document.getElementById("closeProfileButton");

const navButtons = document.querySelectorAll(".bottom-nav button");
const pages = document.querySelectorAll(".page");

const serviceCards = document.querySelectorAll(".service-card");

const areaInput = document.getElementById("areaInput");

const windowsCheckbox = document.getElementById("windowsCheckbox");
const fridgeCheckbox = document.getElementById("fridgeCheckbox");
const ovenCheckbox = document.getElementById("ovenCheckbox");

const priceValue = document.getElementById("priceValue");

const startOrderButton = document.getElementById("startOrderButton");
const submitOrderButton = document.getElementById("submitOrderButton");

const orderForm = document.getElementById("orderForm");

const addressInput = document.getElementById("addressInput");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");

const successPage = document.getElementById("successPage");
const orderNumber = document.getElementById("orderNumber");

const backToHomeButton = document.getElementById("backToHomeButton");

let selectedService = "maintenance";

/* =========================
   THEME
========================= */

function getInitialTheme() {
    const savedTheme = localStorage.getItem("cleaningTheme");

    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }

    if (tg && tg.colorScheme === "dark") {
        return "dark";
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

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
            theme === "dark"
                ? "Включить светлую тему"
                : "Включить тёмную тему"
        );
    }

    if (themeColorMeta) {
        themeColorMeta.setAttribute(
            "content",
            theme === "dark" ? "#111411" : "#f5f7f4"
        );
    }

    if (tg) {
        try {
            tg.setHeaderColor(
                theme === "dark" ? "#111411" : "#f5f7f4"
            );

            tg.setBackgroundColor(
                theme === "dark" ? "#111411" : "#f5f7f4"
            );
        } catch (error) {
            console.log("Telegram theme error:", error);
        }
    }
}

let currentTheme = getInitialTheme();
applyTheme(currentTheme);

if (themeButton) {
    themeButton.addEventListener("click", () => {
        currentTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem(
            "cleaningTheme",
            currentTheme
        );

        applyTheme(currentTheme);
    });
}

/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {
    pages.forEach((page) => {
        page.classList.toggle(
            "active",
            page.id === pageId
        );
    });

    navButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const pageId = button.dataset.page;

        if (pageId) {
            showPage(pageId);
        }
    });
});

/* =========================
   PROFILE
========================= */

if (profileButton && profileModal) {
    profileButton.addEventListener("click", () => {
        profileModal.classList.add("active");
    });
}

if (closeProfileButton && profileModal) {
    closeProfileButton.addEventListener("click", () => {
        profileModal.classList.remove("active");
    });
}

if (profileModal) {
    profileModal.addEventListener("click", (event) => {
        if (event.target === profileModal) {
            profileModal.classList.remove("active");
        }
    });
}

/* =========================
   PRICING
========================= */

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

    renovation: {
        name: "Уборка после ремонта",
        base: 4000,
        baseArea: 30,
        pricePerExtraM2: 140
    },

    windows: {
        name: "Мытьё окон",
        base: 800,
        baseArea: 0,
        pricePerExtraM2: 0
    }
};

function calculatePrice() {
    const area = Number(areaInput?.value) || 0;

    let price = 0;

    const service = PRICES[selectedService];

    if (!service) {
        return 0;
    }

    if (selectedService === "windows") {
        price = 800;
    } else {
        if (area <= service.baseArea) {
            price = service.base;
        } else {
            const extraArea = area - service.baseArea;

            price =
                service.base +
                extraArea * service.pricePerExtraM2;
        }
    }

    if (fridgeCheckbox?.checked) {
        price += 500;
    }

    if (ovenCheckbox?.checked) {
        price += 400;
    }

    return Math.round(price);
}

function updatePrice() {
    const price = calculatePrice();

    if (!priceValue) {
        return;
    }

    priceValue.classList.remove("price-update");

    void priceValue.offsetWidth;

    priceValue.textContent =
        price > 0
            ? `${price.toLocaleString("ru-RU")} ₽`
            : "Рассчитаем";

    priceValue.classList.add("price-update");
}

/* =========================
   SERVICE SELECTION
========================= */

serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
        const service = card.dataset.service;

        if (!service || !PRICES[service]) {
            return;
        }

        selectedService = service;

        serviceCards.forEach((item) => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        updatePrice();
    });
});

/* =========================
   AREA / EXTRAS
========================= */

if (areaInput) {
    areaInput.addEventListener("input", () => {
        let value = areaInput.value.replace(/\D/g, "");

        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        areaInput.value = value;

        updatePrice();
    });
}

if (windowsCheckbox) {
    windowsCheckbox.addEventListener(
        "change",
        updatePrice
    );
}

if (fridgeCheckbox) {
    fridgeCheckbox.addEventListener(
        "change",
        updatePrice
    );
}

if (ovenCheckbox) {
    ovenCheckbox.addEventListener(
        "change",
        updatePrice
    );
}

/* =========================
   START ORDER
========================= */

if (startOrderButton) {
    startOrderButton.addEventListener("click", () => {
        const area = Number(areaInput?.value) || 0;

        if (
            selectedService !== "windows" &&
            area <= 0
        ) {
            if (areaInput) {
                areaInput.focus();
            }

            return;
        }

        updatePrice();

        showPage("orderPage");
    });
}

/* =========================
   FORM VALIDATION
========================= */

function validateForm() {
    let valid = true;

    const area = Number(areaInput?.value) || 0;

    if (
        selectedService !== "windows" &&
        area <= 0
    ) {
        valid = false;

        if (areaInput) {
            areaInput.classList.add("error");
        }
    } else if (areaInput) {
        areaInput.classList.remove("error");
    }

    if (!addressInput?.value.trim()) {
        valid = false;

        if (addressInput) {
            addressInput.classList.add("error");
        }
    } else if (addressInput) {
        addressInput.classList.remove("error");
    }

    if (!nameInput?.value.trim()) {
        valid = false;

        if (nameInput) {
            nameInput.classList.add("error");
        }
    } else if (nameInput) {
        nameInput.classList.remove("error");
    }

    const phone = phoneInput?.value.trim() || "";

    if (phone.length < 6) {
        valid = false;

        if (phoneInput) {
            phoneInput.classList.add("error");
        }
    } else if (phoneInput) {
        phoneInput.classList.remove("error");
    }

    return valid;
}

/* =========================
   REMOVE ERROR ON INPUT
========================= */

[
    areaInput,
    addressInput,
    nameInput,
    phoneInput
].forEach((input) => {
    if (!input) {
        return;
    }

    input.addEventListener("input", () => {
        input.classList.remove("error");
    });
});

/* =========================
   SUBMIT ORDER
========================= */

if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const price = calculatePrice();

        const orderData = {
            service: selectedService,
            serviceName:
                PRICES[selectedService]?.name || "",

            area:
                Number(areaInput?.value) || 0,

            extras: {
                windows:
                    Boolean(windowsCheckbox?.checked),

                fridge:
                    Boolean(fridgeCheckbox?.checked),

                oven:
                    Boolean(ovenCheckbox?.checked)
            },

            address:
                addressInput?.value.trim() || "",

            name:
                nameInput?.value.trim() || "",

            phone:
                phoneInput?.value.trim() || "",

            price: price
        };

        /* =========================
           SAVE LAST ORDER
        ========================= */

        try {
            localStorage.setItem(
                "lastCleaningOrder",
                JSON.stringify(orderData)
            );
        } catch (error) {
            console.log(
                "LocalStorage error:",
                error
            );
        }

        /* =========================
           SEND TO TELEGRAM BOT
        ========================= */

        if (
            tg &&
            typeof tg.sendData === "function"
        ) {
            try {
                tg.sendData(
                    JSON.stringify(orderData)
                );
            } catch (error) {
                console.log(
                    "Telegram sendData error:",
                    error
                );
            }
        }

        /* =========================
           SUCCESS
        ========================= */

        const randomNumber =
            Math.floor(
                1000 + Math.random() * 9000
            );

        if (orderNumber) {
            orderNumber.textContent =
                `№${randomNumber}`;
        }

        showPage("successPage");

        if (tg) {
            try {
                tg.HapticFeedback.notificationOccurred(
                    "success"
                );
            } catch (error) {
                console.log(
                    "Haptic error:",
                    error
                );
            }
        }
    });
}

/* =========================
   SUBMIT BUTTON
========================= */

if (
    submitOrderButton &&
    orderForm
) {
    submitOrderButton.addEventListener(
        "click",
        () => {
            if (
                typeof orderForm.requestSubmit ===
                "function"
            ) {
                orderForm.requestSubmit();
            } else {
                orderForm.dispatchEvent(
                    new Event("submit", {
                        bubbles: true,
                        cancelable: true
                    })
                );
            }
        }
    );
}

/* =========================
   BACK TO HOME
========================= */

if (backToHomeButton) {
    backToHomeButton.addEventListener(
        "click",
        () => {
            showPage("homePage");
        }
    );
}

/* =========================
   INITIALIZATION
========================= */

if (serviceCards.length > 0) {
    serviceCards.forEach((card) => {
        card.classList.remove("selected");
    });

    const maintenanceCard =
        document.querySelector(
            '.service-card[data-service="maintenance"]'
        );

    if (maintenanceCard) {
        maintenanceCard.classList.add("selected");
    }
}

updatePrice();

showPage("homePage");