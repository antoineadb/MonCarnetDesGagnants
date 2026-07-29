// ==========================================
// CHARGEMENT DES UTILISATEURS
// ==========================================
let modal;

async function chargerUtilisateurs() {

    try {

        const response = await fetch("/api/admin/users");

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

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
                            data-id="${user.id}">

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

                    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {

                        return;

                    }

                    try {

                        const response = await fetch(`/api/admin/users/${id}`, {

                            method: "DELETE"

                        });

                        const result = await response.json();

                        if (!result.success) {

                            alert(result.message);

                            return;

                        }

                        await chargerUtilisateurs();

                    }
                    catch (err) {

                        console.error(err);

                        alert("Erreur lors de la suppression.");

                    }

                });

            });
    }
    
    catch (err) {

        console.error(err);

        alert("Impossible de charger les utilisateurs.");

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
    document
        .getElementById("btnAddUser")
        .addEventListener("click", () => {

            document.getElementById("modalTitle").textContent =
                "Nouvel utilisateur";

            document.getElementById("userForm").reset();

            document.getElementById("userId").value = "";

            modal.classList.remove("hidden");

        });

    // Bouton Annuler
    document
        .getElementById("btnCancel")
        .addEventListener("click", () => {

            modal.classList.add("hidden");

        });

});

// ==========================================
// ENREGISTREMENT D'UN UTILISATEUR
// ==========================================

document
    .getElementById("userForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            const response = await fetch("/api/admin/users", {

                method: "POST",

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

                alert(result.message);

                return;

            }

            // Ferme la fenêtre
            modal.classList.add("hidden");

            // Vide le formulaire
            document.getElementById("userForm").reset();

            // Recharge uniquement le tableau
            await chargerUtilisateurs();

        }
        catch (err) {

            console.error(err);

            alert("Erreur lors de la création de l'utilisateur.");

        }

    });