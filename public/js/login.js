document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const book = document.querySelector(".book");
    const button = document.getElementById("openBookButton");

    if (!form || !book || !button) {
        console.error("Impossible d'initialiser la page de connexion.");
        return;
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        button.disabled = true;
        button.textContent = "Ouverture du carnet...";

        book.classList.add("book--opening");

        console.log("Animation du carnet lancée");

    });

});