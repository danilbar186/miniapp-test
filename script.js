console.log("SCRIPT WORKS");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM READY");

    const startButton = document.getElementById("startOrderButton");

    if (startButton) {
        startButton.addEventListener("click", function () {
            alert("КНОПКА РАБОТАЕТ");
        });
    } else {
        alert("Кнопка не найдена");
    }

});