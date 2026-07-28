document.addEventListener("DOMContentLoaded", async () => {

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

    }
    catch (err) {

        console.error(err);

        alert("Impossible de charger les utilisateurs.");

    }

    const modal = document.getElementById("userModal");
console.log(document.getElementById("btnAddUser"));
    document
        .getElementById("btnAddUser")
        .addEventListener("click", () => {

            document.getElementById("modalTitle").textContent =
                "Nouvel utilisateur";

            document.getElementById("userForm").reset();

            document.getElementById("userId").value = "";

            modal.classList.remove("hidden");

        });

    document
        .getElementById("btnCancel")
        .addEventListener("click", () => {

            modal.classList.add("hidden");

        });

});

document
.getElementById("userForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

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

    modal.classList.add("hidden");

    location.reload();

});