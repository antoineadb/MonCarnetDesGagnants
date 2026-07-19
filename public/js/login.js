document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const button = document.getElementById("openBookButton");
    const cover = document.querySelector(".book-cover");
    const message = document.getElementById("loginMessage");

    if (!form || !button || !cover) {

        console.error("Impossible d'initialiser le carnet.");
        return;

    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        message.textContent = "";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {

            message.textContent = "Veuillez renseigner votre identifiant et votre mot de passe.";

            return;

        }

        button.disabled = true;
        button.textContent = "Ouverture du carnet...";

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username,
                    password

                })

            });

            const result = await response.json();

            if (!result.success) {

                message.textContent = result.message;

                button.disabled = false;
                button.textContent = "Ouvrir mon carnet →";

                return;

            }

            sessionStorage.setItem("user", JSON.stringify(result.user));

            cover.classList.add("book-cover--open");

            setTimeout(() => {

                window.location.href = "app.html";

            },1000);

        }

        catch(error){

            console.error(error);

            message.textContent="Impossible de contacter le serveur.";

            button.disabled=false;

            button.textContent="Ouvrir mon carnet →";

        }

    });

});