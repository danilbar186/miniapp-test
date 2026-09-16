javascript
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
        tg.setHeaderColor("#f6f6f4");
    }

    if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#f6f6f4");
    }
}


// ========================================
// ЭЛЕМЕНТЫ
// ========================================

const categories = document.querySelectorAll(".category");
const products = document.querySelectorAll(".product-card");
const addButtons = document.querySelectorAll(".add-button");

const cartBadge = document.getElementById("cartBadge");

const heroButton = document.getElementById("heroButton");
const showAllButton = document.getElementById("showAll");

const cartNav = document.getElementById("cartNav");
const profileNav = document.getElementById("profileNav");

const profileButton = document.getElementById("profileButton");


// ========================================
// КОРЗИНА
// ========================================

let cart = [];


// ========================================
// ОБНОВЛЕНИЕ СЧЁТЧИКА
// ========================================

function updateCartBadge() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartBadge.textContent = totalItems;

    if (totalItems > 0) {
        cartBadge.style.display = "flex";
    } else {
        cartBadge.style.display = "none";
    }
}


// ========================================
// ДОБАВЛЕНИЕ ТОВАРА
// ========================================

function addToCart(name, price) {

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }

    updateCartBadge();

    showAddedMessage(name);

    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred("light");
    }
}


// ========================================
// УВЕДОМЛЕНИЕ О ДОБАВЛЕНИИ
// ========================================

function showAddedMessage(name) {

    const message = document.createElement("div");

    message.textContent = `${name} добавлен в корзину`;

    message.style.position = "fixed";
    message.style.left = "50%";
    message.style.bottom = "100px";
    message.style.transform = "translateX(-50%)";

    message.style.padding = "12px 18px";

    message.style.background = "#222";
    message.style.color = "#fff";

    message.style.borderRadius = "14px";

    message.style.fontSize = "13px";
    message.style.fontWeight = "600";

    message.style.zIndex = "999";

    message.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.2)";

    document.body.appendChild(message);


    setTimeout(() => {

        message.style.opacity = "0";

        message.style.transition =
            "opacity 0.25s ease";

    }, 1200);


    setTimeout(() => {

        message.remove();

    }, 1500);
}


// ========================================
// КНОПКИ ДОБАВЛЕНИЯ
// ========================================

addButtons.forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        const name =
            button.dataset.product;

        const price =
            button.dataset.price;

        addToCart(name, price);

    });

});


// ========================================
// ФИЛЬТРАЦИЯ КАТЕГОРИЙ
// ========================================

categories.forEach(category => {

    category.addEventListener("click", () => {

        categories.forEach(item => {
            item.classList.remove("active");
        });

        category.classList.add("active");


        const selectedCategory =
            category.dataset.category;


        products.forEach(product => {

            const productCategory =
                product.dataset.category;


            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                product.style.display = "block";

                product.style.animation =
                    "cardAppear 0.35s ease both";

            } else {

                product.style.display = "none";

            }

        });


        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }

    });

});


// ========================================
// ПОКАЗАТЬ ВСЕ ТОВАРЫ
// ========================================

showAllButton.addEventListener("click", () => {

    categories.forEach(item => {
        item.classList.remove("active");
    });


    products.forEach(product => {

        product.style.display = "block";

        product.style.animation =
            "cardAppear 0.35s ease both";

    });


    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }

});


// ========================================
// КНОПКА HERO
// ========================================

heroButton.addEventListener("click", () => {

    const productsSection =
        document.querySelector(".products-section");

    productsSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ========================================
// КОРЗИНА
// ========================================

cartNav.addEventListener("click", () => {

    if (cart.length === 0) {

        showSimpleMessage(
            "Корзина пока пустая"
        );

        return;
    }


    let text = "Ваша корзина:\n\n";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        text +=
            `${item.name} × ${item.quantity} — ${itemTotal} ₽\n`;

    });


    text += `\nИтого: ${total} ₽`;


    showSimpleMessage(text);

});


// ========================================
// ПРОФИЛЬ
// ========================================

profileNav.addEventListener("click", () => {

    openProfile();

});

profileButton.addEventListener("click", () => {

    openProfile();

});


function openProfile() {

    if (tg && tg.showPopup) {

        tg.showPopup({
            title: "Профиль",
            message: getUserInfo(),
            buttons: [
                {
                    id: "close",
                    type: "close",
                    text: "Закрыть"
                }
            ]
        });

    } else {

        showSimpleMessage(
            getUserInfo()
        );

    }

}


// ========================================
// ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ
// ========================================

function getUserInfo() {

    if (
        tg &&
        tg.initDataUnsafe &&
        tg.initDataUnsafe.user
    ) {

        const user =
            tg.initDataUnsafe.user;


        let name =
            user.first_name || "Пользователь";


        if (user.last_name) {
            name += ` ${user.last_name}`;
        }


        return `Вы вошли как:\n${name}`;

    }


    return "Приложение открыто в браузере.";

}


// ========================================
// ПРОСТОЕ УВЕДОМЛЕНИЕ
// ========================================

function showSimpleMessage(text) {

    if (tg && tg.showAlert) {

        tg.showAlert(text);

        return;
    }


    alert(text);

}


// ========================================
// НАЧАЛЬНОЕ СОСТОЯНИЕ
// ========================================

updateCartBadge();
```
