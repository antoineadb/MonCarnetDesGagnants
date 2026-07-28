console.log("Administration chargée");document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    document.getElementById("adminWelcome").textContent =
        `Bienvenue ${user.firstname}`;

    document.getElementById("btnRetour")
        .addEventListener("click", () => {

            window.location.href = "app.html";

        });

});
document.addEventListener("DOMContentLoaded", () => {

    const cardUsers = document.getElementById("cardUsers");

    if (cardUsers) {

        cardUsers.addEventListener("click", () => {

            window.location.href = "administration-users.html";

        });

    }

});