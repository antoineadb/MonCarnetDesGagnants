// ==========================================
// CHARGEMENT DES UTILISATEURS
// ==========================================
let modal;
let modeEdition = false;

async function chargerUtilisateurs() {

    try {

        const response = await fetch("/api/admin/users");

        const result = await response.json();

        if (!result.success) {

            Toast.success(result.message);

            return;

        }

        const tbody = document.querySelector("#usersTable tbody");

        tbody.innerHTML = "";

        result.users.forEach(user => {

            const roleBadge =
                user.role === "admin"
                    ? "👑 Admin"
                    : "👤 Utilisateur";

            tbody.innerHTML += `

                <tr>

                    <td>${user.id}</td>

                    <td>${user.username}</td>

                    <td>${user.lastname}</td>

                    <td>${user.firstname}</td>

                    <td>${roleBadge}</td>

                    <td class="actions">

                        <button
                            class="btn-edit"
                            data-id="${user.id}">

                            ✏️

                        </button>

                        <button
                            class="btn-delete"
                            data-id="${user.id}"
                            data-username="${user.username}"
                            data-firstname="${user.firstname}"
                            data-lastname="${user.lastname}">

                            🗑️

                        </button>

                    </td>

                </tr>

            `;

        });

        // Gestion des boutons Supprimer
        document
            .querySelectorAll(".btn-delete")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    const id = button.dataset.id;
                    const username = button.dataset.username;
                    const firstname = button.dataset.firstname;
                    const lastname = button.dataset.lastname;

                    const ok = await Confirm.show({

                    title: "<i class='bi bi-exclamation-triangle-fill'></i> Supprimer un utilisateur",

                    message: `Voulez-vous vraiment supprimer l'utilisateur <strong>${firstname}</strong>?`,

                    confirmText: "Supprimer",

                    cancelText: "Annuler"

                });

                if (!ok) {

                    return;

                }

                    try {

                        const response = await fetch(`/api/admin/users/${id}`, {

                            method: "DELETE"

                        });

                        const result = await response.json();

                        if (!result.success) {

                            Toast.success(result.message);

                            return;

                        }

                        await chargerUtilisateurs();

                        Toast.success("Utilisateur supprimé avec succès.");

                    }
                    catch (err) {

                        console.error(err);

                        Toast.error("Erreur lors de la suppression.");

                    }

                });

            });

            // Gestion des boutons Modifier
document
    .querySelectorAll(".btn-edit")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            const response = await fetch(`/api/admin/users/${id}`);

            const result = await response.json();

            if (!result.success) {

                Toast.success(result.message);

                return;

            }

            const user = result.user;

            modeEdition = true;

            document.getElementById("userId").value = user.id;

            document.getElementById("lastname").value = user.lastname;

            document.getElementById("firstname").value = user.firstname;

            document.getElementById("username").value = user.username;

            document.getElementById("password").value = "";

            document.getElementById("role").value = user.role;

            document.getElementById("modalTitle").textContent =
                "Modifier un utilisateur";

            document.getElementById("btnSave").textContent =
                "Enregistrer";

            modal.classList.remove("hidden");

        });

    });
    }
    
    catch (err) {

        console.error(err);

        Toast.error("Impossible de charger les utilisateurs.");

    }

}

// ==========================================
// INITIALISATION DE LA PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    modal = document.getElementById("userModal");


    // Chargement du tableau
    await chargerUtilisateurs();

    // Bouton "Nouvel utilisateur"
    modeEdition = false;

        // Bouton "Nouvel utilisateur"
document
    .getElementById("btnAddUser")
    .addEventListener("click", () => {

        modeEdition = false;

        document.getElementById("modalTitle").textContent =
            "Nouvel utilisateur";

        document.getElementById("btnSave").textContent =
            "Créer";

        document.getElementById("userForm").reset();

        document.getElementById("userId").value = "";

        modal.classList.remove("hidden");

    });

    // Bouton Annuler
    document
    .getElementById("btnCancel")
    .addEventListener("click", () => {

        modeEdition = false;

        document.getElementById("userForm").reset();

        document.getElementById("userId").value = "";

        modal.classList.add("hidden");

    });
});


    // Bouton retour
    document
    .getElementById("btnRetour")
    .addEventListener("click", () => {

        window.location.href = "administration.html";

    });

// ==========================================
// ENREGISTREMENT D'UN UTILISATEUR
// ==========================================

document
    .getElementById("userForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            const id = document.getElementById("userId").value;

            const url = modeEdition
                ? `/api/admin/users/${id}`
                : "/api/admin/users";

            const methode = modeEdition
                ? "PUT"
                : "POST";

            const response = await fetch(url, {

                method: methode,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    lastname: document.getElementById("lastname").value,

                    firstname: document.getElementById("firstname").value,

                    username: document.getElementById("username").value,

                    password: document.getElementById("password").value,

                    role: document.getElementById("role").value

                })

            });

            const result = await response.json();

            if (!result.success) {

                Toast.success(result.message);

                return;

            }

            modeEdition = false;
            document.getElementById("userId").value = "";

            // Ferme la fenêtre
            modal.classList.add("hidden");

            // Vide le formulaire
            document.getElementById("userForm").reset();

            // Recharge uniquement le tableau
            await chargerUtilisateurs();

            // Notification
            if (methode === "POST") {

                Toast.success("Utilisateur créé avec succès.");

            } else {

                Toast.success("Utilisateur modifié avec succès.");

            }

        }
        catch (err) {

            console.error(err);

            Toast.error("Erreur lors de la création de l'utilisateur.");

        }

    });