class Dashboard {

    constructor() {

        this.dateElement = document.getElementById("currentDate");

        this.cards = document.querySelectorAll(".card");

    }

    init() {

        this.updateDate();

        this.bindEvents();

        }

    updateDate() {

        if (!this.dateElement) return;

        const today = new Date();

        const options = {

            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"

        };

        this.dateElement.textContent =
            today.toLocaleDateString("fr-FR", options);

    }

    bindEvents() {

        document.getElementById("cardJournal")
            ?.addEventListener("click", Navigation.journal);

        document.getElementById("cardObjectifs")
            ?.addEventListener("click", Navigation.objectifs);

        document.getElementById("cardGratitude")
            ?.addEventListener("click", Navigation.gratitude);

        document.getElementById("cardLecture")
            ?.addEventListener("click", Navigation.lecture);

        document.getElementById("cardParametres")
            ?.addEventListener("click", Navigation.parametres);

        const changeProfilePhoto =
            document.getElementById("changeProfilePhoto");

        const profilePhotoInput =
            document.getElementById("profilePhotoInput");

        if (changeProfilePhoto && profilePhotoInput) {

            changeProfilePhoto.addEventListener(
                "click",
                () => {

                    profilePhotoInput.click();

                }
            );

            profilePhotoInput.addEventListener(
                "change",
                async () => {

                    const file =
                        profilePhotoInput.files[0];

                    if (!file) {
                        return;
                    }

                    const formData =
                        new FormData();

                    formData.append(
                        "profilePhoto",
                        file
                    );

                    try {

                        const response =
                            await fetch(
                                "/api/auth/profile-photo",
                                {
                                    method: "POST",
                                    credentials: "include",
                                    body: formData
                                }
                            );

                        const data =
                            await response.json();

                        if (!response.ok || !data.success) {

                            throw new Error(
                                data.message ||
                                "Erreur lors de l'envoi de la photo."
                            );

                        }

                        const profilePhoto =
                            document.getElementById("profilePhoto");

                        if (profilePhoto) {

                            profilePhoto.src =
                                data.profile_image +
                                "?t=" +
                                Date.now();

                        }

                        console.log(
                            "📷 Photo de profil mise à jour"
                        );

                    }
                    catch (error) {

                        console.error(
                            "Erreur photo de profil :",
                            error
                        );

                    }

                }
            );

        }

    }


}

document.addEventListener("DOMContentLoaded", () => {
    
    const user = JSON.parse(sessionStorage.getItem("user"));

     if (!user) {

        window.location.href = "login.html";
        return;

    }
    
    document.querySelector(".topbar h1").textContent = `Bonjour ${user.firstname} 👋`;

    const userFirstName =
    document.getElementById("userFirstName");

    if (userFirstName) {

        userFirstName.textContent =
            user.firstname;

    }

    if (user && user.role === "admin") {

        document.getElementById("menuAdministration").style.display = "";
        document.getElementById("cardAdministration").style.display = "";

    }

    const dashboard = new Dashboard();

    dashboard.init();

});

document.getElementById("cardProgression")
    ?.addEventListener("click", Navigation.progression);

document.getElementById("menuProgression")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.progression();

    });
document.getElementById("menuLecture")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.lecture();

    });
document.getElementById("menuJournal")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.journal();

    });
document.getElementById("menuGratitude")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.gratitude();

    });
document.getElementById("menuObjectifs")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.objectifs();

    });
document.getElementById("menuParametres")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.parametres();

    });

document.getElementById("btnLogout")
    .addEventListener("click", async () => {
        console.log("Avant Confirm");
        const ok = await Confirm.show({
            
            title: "Déconnexion",

            message: "Voulez-vous vraiment vous déconnecter ?",

            confirmText: "Déconnexion",

            cancelText: "Annuler"

        });
        console.log("Après Confirm", ok);
        if (!ok) return;

        try {

            const response = await fetch("/api/auth/logout", {

                method: "POST"

            });

            const data = await response.json();

            if (!data.success) {

                Toast.error("Impossible de se déconnecter.");

                return;

            }

            Toast.success("Déconnexion réussie.");

            setTimeout(() => {

                window.location.href = "../index.html";

            }, 500);

        }

        catch (err) {

            console.error(err);

            Toast.error("Erreur lors de la déconnexion.");

        }

});

document.getElementById("menuAdministration")
?.addEventListener("click", e => {

    e.preventDefault();

    Navigation.administration();

});

document.getElementById("btnAdministration")
    ?.addEventListener("click", () => {

        Navigation.administration();

    });