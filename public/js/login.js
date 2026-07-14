document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const button = document.getElementById("openBookButton");
    const cover = document.querySelector(".book-cover");

    if (!form || !button || !cover) {
        console.error("Impossible d'initialiser le carnet.");
        return;
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        button.disabled = true;
        button.innerHTML = "📖 Ouverture du carnet...";

        cover.classList.add("book-cover--open");

        setTimeout(() => {

            window.location.href = "app.html";

        }, 1000);

    });

});