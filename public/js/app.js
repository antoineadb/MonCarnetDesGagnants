class Dashboard {

    constructor() {

        this.dateElement = document.getElementById("currentDate");

        this.cards = document.querySelectorAll(".card");

    }

    init() {

        this.updateDate();

        this.bindEvents();

        this.loadProfilePhoto();

        this.loadObjectifsCount();

        this.loadGratitudeCount();

        this.loadLectureCount();

        this.loadJournalCount();

        this.loadProgressionCount();


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

        document.getElementById("cardMeditations")
            ?.addEventListener("click", Navigation.meditations);

        document.getElementById("cardAnals")
            ?.addEventListener("click", Navigation.anals);

        document.getElementById("cardStade")
            ?.addEventListener("click", Navigation.stade);

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

    async loadObjectifsCount() {

    try {

        const response =
            await fetch("/api/objectifs");

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }

        const objectifs =
            await response.json();

        const enCours =
            objectifs.filter(
                objectif =>
                    objectif.statut !== "atteint" &&
                    objectif.statut !== "abandonne"
            );

        const element =
            document.getElementById("objectifsStatut");

        if (!element) {
            return;
        }

        const nombre =
            enCours.length;

        element.textContent =
            `${nombre} objectif${nombre > 1 ? "s" : ""} en cours`;

    }
    catch (error) {

        console.error(
            "❌ Erreur compteur objectifs :",
            error
        );

    }

    

}    
async loadGratitudeCount() {

    try {

        const response =
            await fetch("/api/gratitude");

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }

        const cartes =
            await response.json();

        const element =
            document.getElementById("gratitudeStatut");

        if (!element) {
            return;
        }

        const nombre =
            cartes.length;

        element.textContent =
            `${nombre} pensée${nombre > 1 ? "s" : ""} positive${nombre > 1 ? "s" : ""}.`;

    }
    catch (error) {

        console.error(
            "❌ Erreur compteur gratitude :",
            error
        );

    }

}
async loadLectureCount() {

    try {

        const response =
            await fetch("/api/books", {
                credentials: "include"
            });

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }

        const livres =
            await response.json();

        const livresEnCours =
            livres.filter(
                livre =>
                    livre.status === "reading"
            );

        const element =
            document.getElementById("lectureStatut");

        if (!element) {
            return;
        }

        const nombre =
            livresEnCours.length;

        element.textContent =
            `${nombre} livre${nombre > 1 ? "s" : ""} en cours`;

    }
    catch (error) {

        console.error(
            "❌ Erreur compteur lecture :",
            error
        );

    }

}
async loadJournalCount() {

    try {

        const response =
            await fetch("/api/journal");

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }

        const entries =
            await response.json();

        const element =
            document.getElementById("journalStatut");

        if (!element) {
            return;
        }

        const nombre =
            entries.length;

        element.textContent =
            `${nombre} note${nombre > 1 ? "s" : ""} dans le journal`;

    }
    catch (error) {

        console.error(
            "❌ Erreur compteur journal :",
            error
        );

    }

}

    async loadProfilePhoto() {

        try {

            const response = await fetch(
                "/api/auth/me",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            const user =
                data.user ?? data;

            const profilePhoto =
                document.getElementById("profilePhoto");

            if (
                profilePhoto &&
                user.profile_image
            ) {

                profilePhoto.src =
                    user.profile_image +
                    "?t=" +
                    Date.now();

            }

        }
        catch (error) {

            console.error(
                "❌ Erreur chargement photo de profil :",
                error
            );

        }

    }

    async loadProgressionCount() {

    try {

        const response =
            await fetch("/api/progression/1");

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        const progress =
            data.state?.progress ?? 0;

        const percent =
            Math.round(progress * 100);

        const element =
            document.getElementById("progressionStatut");

        if (!element) {
            return;
        }

        element.textContent =
            `Progression : ${percent}%`;

    }
    catch (error) {

        console.error(
            "❌ Erreur compteur progression :",
            error
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

document.getElementById("menuStade")
    ?.addEventListener("click", e => {

        e.preventDefault();

        Navigation.stade();

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