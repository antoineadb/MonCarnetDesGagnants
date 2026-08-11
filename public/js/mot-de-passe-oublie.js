document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("forgotPasswordForm");

    const emailInput =
        document.getElementById("forgotPasswordEmail");

    if (!form || !emailInput) {
        return;
    }


    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();


        // =========================================
        // VALIDATION
        // =========================================

        if (!email) {

            Toast.error(
                "Veuillez saisir votre adresse e-mail."
            );

            return;
        }


        if (!emailInput.checkValidity()) {

            Toast.error(
                "Veuillez saisir une adresse e-mail valide."
            );

            return;
        }


        // =========================================
        // DEMANDE DE RÉINITIALISATION
        // =========================================

        try {

            const response = await fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Une erreur est survenue."
                );

            }


            console.log(
                "📧 Demande de réinitialisation envoyée"
            );


            Toast.success(
                data.message
            );

        }
        catch (error) {

            console.error(
                "❌ Erreur réinitialisation :",
                error
            );

            Toast.error(
                error.message ||
                "Une erreur est survenue."
            );

        }

    });

});