/* =====================================================
   MON COMPTE
===================================================== */

class Parametres {

    constructor() {

        this.init();

    }


    async init() {

        try {

            const response =
                await fetch(
                    "/api/auth/me",
                    {
                        credentials: "include"
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Impossible de récupérer l'utilisateur."
                );

            }

            const data =
                await response.json();

            console.log(
                "👤 Utilisateur connecté :",
                data
            );

            const user =
                data.user ?? data;

            this.afficherUtilisateur(user);

            const saveAccount =
                document.getElementById("saveAccount");

            if (saveAccount) {

                saveAccount.addEventListener(
                    "click",
                    () => this.enregistrerCompte()
                );

            }

        }
        catch (error) {

            console.error(
                "❌ Erreur chargement compte :",
                error
            );

        }

    }


    afficherUtilisateur(user) {

        /* ==========================================
           INFORMATIONS
        =========================================== */

        const firstname =
            document.getElementById("accountFirstname");

        const lastname =
            document.getElementById("accountLastname");

        const username =
            document.getElementById("accountUsername");

        const role =
            document.getElementById("accountRoleField");

        const email =
            document.getElementById("accountEmail");

        if (firstname) {

            firstname.value =
                user.firstname ?? "";

        }

        if (lastname) {

            lastname.value =
                user.lastname ?? "";

        }

        if (email) {

            email.value =
                user.email ?? "";

        }

        if (username) {

            username.value =
                user.username ?? "";

        }

        if (role) {

            role.value =
                user.role ?? "";

        }


        /* ==========================================
           NOM AFFICHÉ
        =========================================== */

        const displayName =
            document.getElementById("accountDisplayName");

        if (displayName) {

            displayName.textContent =
                `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()
                || "Mon compte";

        }


        /* ==========================================
           RÔLE
        =========================================== */

        const accountRole =
            document.getElementById("accountRole");

        if (accountRole) {

            accountRole.textContent =
                user.role ?? "Utilisateur";

        }


        /* ==========================================
           PHOTO
        =========================================== */

        const profilePhoto =
            document.getElementById("accountProfilePhoto");

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

    async enregistrerCompte() {

        const firstname =
            document.getElementById("accountFirstname")?.value.trim();

        const lastname =
            document.getElementById("accountLastname")?.value.trim();

        const email =
            document.getElementById("accountEmail")?.value.trim();


        // =========================================
        // VALIDATION
        // =========================================

        if (!firstname) {

           Toast.error("Le prénom est obligatoire.");

            return;

        }

        
        if (!lastname) {

            Toast.error("Le nom est obligatoire.");

            return;

        }   


        try {

            const response =
                await fetch(
                    "/api/auth/me",
                    {
                        method: "PUT",

                        credentials: "include",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            firstname,
                            lastname,
                            email

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Impossible d'enregistrer les modifications."
                );

            }


            console.log(
                "✅ Compte mis à jour"
            );

            
            Toast.success(
                "Vos informations ont été enregistrées."
            );

        }
        catch (error) {

            console.error(
                "❌ Erreur mise à jour compte :",
                error
            );

            Toast.error(
                error.message ||
                "Une erreur est survenue."
            );

        }

    }

    async sauvegarderCompte() {

        const firstname =
            document.getElementById("accountFirstname").value.trim();

        const lastname =
            document.getElementById("accountLastname").value.trim();

        const email =
            document.getElementById("accountEmail").value.trim();


        try {

            const response =
                await fetch(
                    "/api/auth/me",
                    {
                        method: "PUT",

                        credentials: "include",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            firstname,
                            lastname,
                            email
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Erreur lors de la sauvegarde."
                );

            }


            console.log(
                "✅ Compte enregistré :",
                data.user
            );


            // Mise à jour du nom affiché

            const displayName =
                document.getElementById("accountDisplayName");

            if (displayName) {

                displayName.textContent =
                    `${data.user.firstname} ${data.user.lastname}`;

            }


            // Message temporaire

            Toast.success(
                "Vos informations ont été enregistrées."
            );


        }
        catch (error) {

            console.error(
                "❌ Erreur sauvegarde compte :",
                error
            );

            Toast.error(
                error.message
            );

        }

    }

}


/* =====================================================
   DÉMARRAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        new Parametres();

    }
);


document.querySelector(".btn-retour-carnet").addEventListener(
        "click",
        () => {
            window.location.href = "/pages/app.html";
        }
    );