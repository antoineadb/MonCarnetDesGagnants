document.addEventListener("DOMContentLoaded", async () => {

    const form =
        document.getElementById("resetPasswordForm");

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");


    // =========================================
    // RÉCUPÉRATION DU TOKEN
    // =========================================

    const params =
        new URLSearchParams(window.location.search);

    const token =
        params.get("token");


    // =========================================
    // VÉRIFICATION DES ÉLÉMENTS
    // =========================================

    if (
        !form ||
        !newPasswordInput ||
        !confirmPasswordInput
    ) {

        console.error(
            "❌ Éléments du formulaire introuvables."
        );

        return;
    }


    // =========================================
    // TOKEN ABSENT
    // =========================================

    if (!token) {

        Toast.error(
            "Lien de réinitialisation invalide."
        );

        return;
    }


    // =========================================
    // VÉRIFICATION DU TOKEN
    // =========================================

    try {

        const response = await fetch(
            `/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`
        );

        const data =
            await response.json();


        if (!response.ok || !data.success) {

            Toast.error(
                data.message ||
                "Ce lien de réinitialisation est invalide."
            );

            return;
        }


        console.log(
            "✅ Token de réinitialisation valide"
        );

    }
    catch (error) {

        console.error(
            "❌ Erreur vérification token :",
            error
        );

        Toast.error(
            "Impossible de vérifier le lien de réinitialisation."
        );

        return;
    }


    // =========================================
    // SOUMISSION DU FORMULAIRE
    // =========================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const password =
                newPasswordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            // =====================================
            // VALIDATION
            // =====================================

            if (!password) {

                Toast.error(
                    "Veuillez saisir votre nouveau mot de passe."
                );

                return;
            }


            if (!confirmPassword) {

                Toast.error(
                    "Veuillez confirmer votre mot de passe."
                );

                return;
            }


            if (password.length < 8) {

                Toast.error(
                    "Le mot de passe doit contenir au moins 8 caractères."
                );

                return;
            }


            if (password !== confirmPassword) {

                Toast.error(
                    "Les deux mots de passe ne correspondent pas."
                );

                return;
            }


            // =====================================
            // ENVOI AU SERVEUR
            // =====================================

            try {

                const response = await fetch(
                    "/api/auth/reset-password",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            token: token,

                            password: password,

                            confirmPassword: confirmPassword

                        })

                    }
                );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Impossible de modifier le mot de passe."
                    );

                }


                // =================================
                // SUCCÈS
                // =================================

                Toast.success(
                    data.message
                );


                form.reset();


                // Retour vers la connexion

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 2000);


            }
            catch (error) {

                console.error(
                    "❌ Erreur réinitialisation :",
                    error
                );

                Toast.error(
                    error.message ||
                    "Impossible de modifier le mot de passe."
                );

            }

        }
    );

});