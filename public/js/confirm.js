class Confirm {

    static show({
        icon = "",
        title = "Confirmation",
        message = "Êtes-vous sûr ?",
        confirmText = "Confirmer",
        cancelText = "Annuler"
    } = {}) {

        return new Promise(resolve => {

            // Supprime une ancienne fenêtre si elle existe
            const ancienne = document.querySelector(".confirm-overlay");

            if (ancienne) {
                ancienne.remove();
            }

            // Création de l'overlay
            const overlay = document.createElement("div");

            overlay.className = "confirm-overlay";

            overlay.innerHTML = `
                <div class="confirm-box">

                  <div class="confirm-title">

                        ${icon ? `<span class="confirm-icon">${icon}</span>` : ""}

                        <span>${title}</span>

                    </div>

                    <div class="confirm-message">
                        ${message}
                    </div>

                    <div class="confirm-buttons">

                        <button class="confirm-cancel">
                            ${cancelText}
                        </button>

                        <button class="confirm-ok">
                            ${confirmText}
                        </button>

                    </div>

                </div>
            `;

            document.body.appendChild(overlay);

            requestAnimationFrame(() => {

                overlay.classList.add("show");

            });

            const fermer = (resultat) => {

                overlay.classList.remove("show");

                setTimeout(() => {

                    overlay.remove();

                    resolve(resultat);

                }, 250);

            };

            overlay
                .querySelector(".confirm-cancel")
                .addEventListener("click", () => fermer(false));

            overlay
                .querySelector(".confirm-ok")
                .addEventListener("click", () => fermer(true));

            // Clic à l'extérieur
            overlay.addEventListener("click", (e) => {

                if (e.target === overlay) {

                    fermer(false);

                }

            });

            // Touche Échap
            const keyHandler = (e) => {

                if (e.key === "Escape") {

                    document.removeEventListener("keydown", keyHandler);

                    fermer(false);

                }

            };

            document.addEventListener("keydown", keyHandler);

        });

   }
}
   window.Confirm = Confirm;
