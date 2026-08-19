"use strict";


/* ======================================================
   INITIALISATION
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🏺 Initialisation des objectifs...");

    chargerCategories();

});


/* ======================================================
   CHARGER LES CATÉGORIES
   ====================================================== */

async function chargerCategories() {

    const container =
        document.getElementById("objectifs-app");


    if (!container) {

        console.error(
            "❌ Conteneur #objectifs-app introuvable."
        );

        return;

    }


    console.log("📡 Chargement des catégories...");


    try {

        const response =
            await fetch("/api/categories-objectifs");


        console.log(
            "📡 Statut API :",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }


        const categories =
            await response.json();


        console.log(
            "📜 Catégories chargées :",
            categories
        );


        afficherCategories(
            container,
            categories
        );


    } catch (error) {

        console.error(
            "❌ Erreur chargement catégories :",
            error
        );


        container.innerHTML = `

            <div class="objectifs-error">

                Impossible de charger
                les catégories d'objectifs.

            </div>

        `;

    }

}


/* ======================================================
   AFFICHER LES CATÉGORIES
   ====================================================== */

/* ======================================================
   AFFICHER LES CATÉGORIES
   ====================================================== */

function afficherCategories(
    container,
    categories
) {

    container.innerHTML = `

        <div class="objectifs-categories">

            <h2 class="objectifs-section-title">
                Mes catégories
            </h2>


            ${
                categories.length === 0

                    ? `

                        <div class="objectifs-empty">

                            Aucune catégorie d'objectif
                            n'a encore été créée.

                        </div>

                    `

                    : `

                        <div class="categories-grid">

                            ${categories.map(
                                categorie => `

                                    <button
                                        class="categorie-card"
                                        type="button"
                                        data-categorie-id="${categorie.id}"
                                    >

                                        <span class="categorie-symbole">

                                            ${categorie.symbole || "🏺"}

                                        </span>


                                        <span class="categorie-nom">

                                            ${echapperHTML(
                                                categorie.nom
                                            )}

                                        </span>

                                    </button>

                                `
                            ).join("")}

                        </div>

                    `
            }


            <!-- GESTION DES CATÉGORIES -->

            <button
                type="button"
                class="gerer-categories"
                id="gerer-categories"
            >
                ⚙️ Gérer mes catégories
            </button>


        </div>

    `;


    document
        .getElementById("gerer-categories")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "/pages/categories-objectifs.html";

            }
        );


    console.log(
        "✅ Catégories affichées."
    );


    initialiserClicCategories();

}

/* ======================================================
   CLIC SUR UNE CATÉGORIE
   ====================================================== */

function initialiserClicCategories() {

    const cartes =
        document.querySelectorAll(".categorie-card");


    cartes.forEach(carte => {

        carte.addEventListener("click", () => {

            const categorieId =
                carte.dataset.categorieId;


           console.log(
                "🏺 Catégorie sélectionnée :",
                categorieId
            );

            afficherObjectifsCategorie(categorieId);

        });

    });

}
/* ======================================================
   AFFICHER LES OBJECTIFS D'UNE CATÉGORIE
   ====================================================== */

async function afficherObjectifsCategorie(categorieId) {

    const container =
        document.getElementById("objectifs-app");


    if (!container) {

        console.error(
            "❌ Conteneur #objectifs-app introuvable."
        );

        return;

    }


    console.log(
        "📡 Chargement des objectifs pour la catégorie :",
        categorieId
    );


    container.innerHTML = `

        <div class="objectifs-loading">

            Chargement des objectifs...

        </div>

    `;


    try {

        /* ==================================================
           RÉCUPÉRER LES CATÉGORIES
           ================================================== */

        const categoriesResponse =
            await fetch("/api/categories-objectifs");


        if (!categoriesResponse.ok) {

            throw new Error(
                `Erreur HTTP catégories ${categoriesResponse.status}`
            );

        }


        const categories =
            await categoriesResponse.json();


        const categorie =
            categories.find(
                categorie =>
                    Number(categorie.id) ===
                    Number(categorieId)
            );


        if (!categorie) {

            throw new Error(
                "Catégorie introuvable."
            );

        }


        console.log(
            "🏺 Catégorie sélectionnée :",
            categorie
        );


        /* ==================================================
           RÉCUPÉRER LES OBJECTIFS
           ================================================== */

        const response =
            await fetch("/api/objectifs");


        console.log(
            "📡 Statut API objectifs :",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );

        }


        const objectifs =
            await response.json();


        console.log(
            "🎯 Tous les objectifs :",
            objectifs
        );


        const objectifsCategorie =
            objectifs.filter(
                objectif =>
                    Number(objectif.categorie_id) ===
                    Number(categorieId)
            );


        console.log(
            "🎯 Objectifs de la catégorie :",
            objectifsCategorie
        );


        afficherListeObjectifs(
            container,
            categorieId,
            objectifsCategorie,
            categorie
        );


    } catch (error) {

        console.error(
            "❌ Erreur chargement objectifs :",
            error
        );


        container.innerHTML = `

            <div class="objectifs-error">

                Impossible de charger
                les objectifs.

            </div>

        `;

    }

}

/* ======================================================
   AFFICHER LA LISTE DES OBJECTIFS
   ====================================================== */

    function afficherListeObjectifs( container, categorieId, objectifs, categorie ) {

        window.objectifCategorieId =  Number(categorieId);

        window.objectifsActuels = objectifs 

        container.innerHTML = `

            <div class="objectifs-categorie">

                <button
                    type="button"
                    class="retour-categories"
                    id="retour-categories"
                >
                    ← Mes catégories
                </button>

                <h2 class="objectifs-section-title">
                    Mes objectifs
                </h2>

                <div class="objectif-categorie-selectionnee">

                    <span class="objectif-categorie-symbole">
                        ${categorie.symbole || "🏺"}
                    </span>

                    <span class="objectif-categorie-nom">
                        ${echapperHTML(categorie.nom)}
                    </span>

                </div>
                ${
                    objectifs.length === 0

                        ? `

                            <div class="objectifs-empty">

                                Aucun objectif dans cette catégorie.

                            </div>

                        `

                        : `

                            <div class="objectifs-liste">

                                ${objectifs.map(
                                    objectif => `

                                        <div
                                        class="objectif-card"
                                        data-objectif-id="${objectif.id}"
                                    >

                                        <h3>
                                            ${echapperHTML(
                                                objectif.titre
                                            )}
                                        </h3>

                                        <p>
                                            ${echapperHTML(
                                                objectif.description || ""
                                            )}
                                        </p>


                                        <div class="objectif-progression">

                                            <div class="objectif-progression-entete">

                                                <span>
                                                    Progression
                                                </span>

                                                <strong
                                                    class="objectif-progression-valeur"
                                                >
                                                    ${Number(objectif.progression) || 0} %
                                                </strong>

                                            </div>


                                            <div class="objectif-progression-barre">

                                                <div
                                                    class="objectif-progression-remplissage"
                                                    style="width: ${Number(objectif.progression) || 0}%"
                                                ></div>

                                            </div>


                                            <input
                                                type="range"
                                                class="objectif-progression-slider"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value="${Number(objectif.progression) || 0}"
                                                data-objectif-id="${objectif.id}"
                                                aria-label="Progression de l'objectif"
                                            >

                                        </div>

                                        <div class="objectif-actions">

                                            <button
                                                type="button"
                                                class="objectif-btn-modifier"
                                                data-objectif-id="${objectif.id}"
                                            >
                                                ✎ Modifier
                                            </button>

                                            <button
                                                type="button"
                                                class="objectif-btn-supprimer"
                                                data-objectif-id="${objectif.id}"
                                            >
                                                🗑 Supprimer
                                            </button>

                                        </div>

                                    </div>

                                    `
                                ).join("")}

                            </div>

                        `
                }

                <button
                    type="button"
                    class="ajouter-objectif"
                    id="ajouter-objectif"
                >
                    ＋ Ajouter un objectif
                </button>

            </div>

        `;

        document
            .getElementById("retour-categories")
            .addEventListener(
                "click",
                chargerCategories
            );


        console.log(
            "✅ Liste des objectifs affichée."
        );

        initialiserProgressionObjectifs();
        initialiserBoutonsObjectifs(container);
        
        document
        .getElementById("ajouter-objectif")
        .addEventListener(
            "click",
            () => afficherFormulaireObjectif(
                container,
                categorieId,
                categorie
            )
        );

    }


/* ======================================================
   GESTION DE LA PROGRESSION
   ====================================================== */

function initialiserProgressionObjectifs() {

    const sliders =
        document.querySelectorAll(
            ".objectif-progression-slider"
        );


    sliders.forEach(slider => {

        slider.addEventListener(
            "input",
            () => {

                const progression =
                    Number(slider.value);


                const carte =
                    slider.closest(".objectif-card");


                if (!carte) {
                    return;
                }


                // Mettre à jour immédiatement
                // le pourcentage affiché

                const valeur =
                    carte.querySelector(
                        ".objectif-progression-valeur"
                    );


                if (valeur) {

                    valeur.textContent =
                        `${progression} %`;

                }


                // Mettre à jour immédiatement
                // la barre visuelle

                const remplissage =
                    carte.querySelector(
                        ".objectif-progression-remplissage"
                    );


                if (remplissage) {

                    remplissage.style.width =
                        `${progression}%`;

                }

            }
        );


        slider.addEventListener(
            "change",
            () => {

                sauvegarderProgression(
                    slider
                );

            }
        );

    });

}

/* ======================================================
   SAUVEGARDER LA PROGRESSION
   ====================================================== */

async function sauvegarderProgression(slider) {

    const objectifId =
        Number(
            slider.dataset.objectifId
        );


    const progression =
        Number(slider.value);


    const carte =
        slider.closest(".objectif-card");


    if (!objectifId || !carte) {

        console.error(
            "❌ Impossible d'identifier l'objectif."
        );

        return;

    }


    const titre =
        carte.querySelector("h3")?.textContent
        .trim();


    const description =
        carte.querySelector("p")?.textContent
        .trim() || "";


    let statut =
        "en_cours";


    if (progression === 0) {

        statut = "a_commencer";

    } else if (progression === 100) {

        statut = "atteint";

    }


    console.log(
        "💾 Sauvegarde progression :",
        {
            objectifId,
            progression,
            statut
        }
    );


    try {

        /*
         * Récupérer la catégorie directement
         * depuis la carte actuelle.
         */

        const categorieId =
            window.objectifCategorieId;


        const response =
            await fetch(
                `/api/objectifs/${objectifId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        categorie_id:
                            Number(categorieId),

                        titre,

                        description,

                        progression,

                        statut

                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "📡 Statut sauvegarde progression :",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Impossible de sauvegarder la progression."
            );

        }


        console.log(
            "✅ Progression enregistrée :",
            data
        );


    } catch (error) {

        console.error(
            "❌ Erreur sauvegarde progression :",
            error
        );

    }

}

/* ======================================================
   FORMULAIRE DE CRÉATION D'OBJECTIF
   ====================================================== */

function afficherFormulaireObjectif( container,categorieId, categorie ) {

    console.log(
        "✍️ Création d'un objectif pour la catégorie :",
        categorieId
    );


    container.innerHTML = `

        <div class="objectif-form-container">

            <button
                type="button"
                class="retour-categories"
                id="annuler-objectif"
            >
                ← Annuler
            </button>


            <h2 class="objectifs-section-title">
                Nouvel objectif
            </h2>

            <div class="objectif-categorie-selectionnee">

                <span class="objectif-categorie-symbole">
                    ${categorie.symbole || "🏺"}
                </span>

                <span class="objectif-categorie-nom">
                    ${echapperHTML(categorie.nom)}
                </span>

            </div>


            <form
                id="objectif-form"
                class="objectif-form"
            >

                <div class="objectif-form-group">

                    <label for="objectif-titre">
                        Titre de l'objectif
                    </label>

                    <input
                        type="text"
                        id="objectif-titre"
                        name="titre"
                        maxlength="200"
                        required
                        autocomplete="off"
                    >

                </div>


                <div class="objectif-form-group">

                    <label for="objectif-description">
                        Description
                    </label>

                    <textarea
                        id="objectif-description"
                        name="description"
                        rows="5"
                        maxlength="2000"
                    ></textarea>

                </div>


                <div
                    id="objectif-form-erreur"
                    class="objectif-form-erreur"
                    hidden
                ></div>


                <div class="objectif-form-actions">

                    <button
                        type="button"
                        class="retour-categories"
                        id="annuler-objectif-bas"
                    >
                        Annuler
                    </button>


                    <button
                        type="submit"
                        class="ajouter-objectif"
                    >
                        Enregistrer
                    </button>

                </div>

            </form>

        </div>

    `;


    document
        .getElementById("annuler-objectif")
        .addEventListener(
            "click",
            () => afficherListeObjectifs(
                container,
                categorieId,
                []
            )
        );


    document
        .getElementById("annuler-objectif-bas")
        .addEventListener(
            "click",
            () => afficherListeObjectifs(
                container,
                categorieId,
                []
            )
        );


document
    .getElementById("objectif-form")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const titre =
                document
                    .getElementById("objectif-titre")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("objectif-description")
                    .value
                    .trim();


            const erreur =
                document.getElementById(
                    "objectif-form-erreur"
                );


            erreur.hidden = true;
            erreur.textContent = "";


            console.log(
                "💾 Enregistrement de l'objectif...",
                {
                    categorie_id: categorieId,
                    titre,
                    description
                }
            );


            try {

                const response =
                    await fetch(
                        "/api/objectifs",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                categorie_id:
                                    Number(categorieId),

                                titre,

                                description
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "📡 Statut création objectif :",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Impossible de créer l'objectif."
                    );

                }


                console.log(
                    "✅ Objectif créé :",
                    data
                );


                // Recharger les objectifs
                // de la catégorie

                afficherObjectifsCategorie(
                    categorieId
                );


            } catch (error) {

                console.error(
                    "❌ Erreur création objectif :",
                    error
                );


                erreur.textContent =
                    error.message;


                erreur.hidden = false;

            }

        }
    );


    const champTitre =
    document.getElementById("objectif-titre");

    if (champTitre) {

        champTitre.focus();

    }

}

/* ======================================================
   GESTION DES BOUTONS DES OBJECTIFS
   ====================================================== */

/* ======================================================
   GESTION DU BOUTON MODIFIER
   ====================================================== */

function initialiserBoutonsObjectifs(container) {

    const boutonsModifier =
        document.querySelectorAll(
            ".objectif-btn-modifier"
        );


    boutonsModifier.forEach(bouton => {

        bouton.addEventListener(
            "click",
            () => {

                const objectifId =
                    Number(
                        bouton.dataset.objectifId
                    );


                const objectif =
                    window.objectifsActuels.find(
                        objectif =>
                            Number(objectif.id) ===
                            objectifId
                    );


                if (!objectif) {

                    console.error(
                        "❌ Objectif introuvable :",
                        objectifId
                    );

                    return;
                }


                console.log(
                    "✏️ Modification de l'objectif :",
                    objectif
                );


                afficherFormulaireModification(
                    container,
                    objectif
                );

            }
        );

    });

        /* ==================================================
       SUPPRIMER UN OBJECTIF
       ================================================== */

    const boutonsSupprimer =
        document.querySelectorAll(
            ".objectif-btn-supprimer"
        );


    boutonsSupprimer.forEach(bouton => {

        bouton.addEventListener(
            "click",
            async () => {

                const objectifId =
                    Number(
                        bouton.dataset.objectifId
                    );


                const objectif =
                    window.objectifsActuels.find(
                        objectif =>
                            Number(objectif.id) ===
                            objectifId
                    );


                if (!objectif) {

                    console.error(
                        "❌ Objectif introuvable :",
                        objectifId
                    );

                    return;
                }


                const ok = await Confirm.show({

                    icon: "⚠️",

                    title: "Supprimer cet objectif",

                    message:
                        `Voulez-vous vraiment supprimer l'objectif « ${objectif.titre} » ?`,

                    confirmText: "Supprimer",

                    cancelText: "Annuler"

                });


                if (!ok) {

                    return;

                }


                console.log(
                    "🗑️ Suppression de l'objectif :",
                    objectifId
                );


                try {

                    const response =
                        await fetch(
                            `/api/objectifs/${objectifId}`,
                            {
                                method: "DELETE"
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "📡 Statut suppression :",
                        response.status
                    );


                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Impossible de supprimer l'objectif."
                        );

                    }


                    console.log(
                        "✅ Objectif supprimé :",
                        objectifId
                    );

                    Toast.show(
                        "Objectif supprimé avec succès."
                    );

                    /*
                     * Recharger les objectifs
                     * de la catégorie
                     */

                    afficherObjectifsCategorie(
                        window.objectifCategorieId
                    );


                } catch (error) {

                    console.error(
                        "❌ Erreur suppression objectif :",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );

    });

}
/* ======================================================
   FORMULAIRE DE MODIFICATION D'OBJECTIF
   ====================================================== */

/* ======================================================
   FORMULAIRE DE MODIFICATION D'OBJECTIF
   ====================================================== */

function afficherFormulaireModification(
    container,
    objectif
) {

    console.log(
        "✏️ Modification de l'objectif :",
        objectif
    );


    const categorieId =
        Number(
            window.objectifCategorieId
        );


    const progressionInitiale =
        Number(
            objectif.progression
        ) || 0;


    container.innerHTML = `

        <div class="objectif-form-container">

            <button
                type="button"
                class="retour-categories"
                id="annuler-modification-objectif"
            >
                ← Retour aux objectifs
            </button>


            <h2 class="objectifs-section-title">
                Modifier l'objectif
            </h2>


            <form
                id="objectif-form-modification"
                class="objectif-form"
            >

                <div class="objectif-form-group">

                    <label
                        for="objectif-titre-modification"
                    >
                        Titre de l'objectif
                    </label>


                    <input
                        type="text"
                        id="objectif-titre-modification"
                        name="titre"
                        maxlength="200"
                        required
                        autocomplete="off"
                        value="${echapperHTML(
                            objectif.titre || ""
                        )}"
                    >

                </div>


                <div class="objectif-form-group">

                    <label
                        for="objectif-description-modification"
                    >
                        Description
                    </label>


                    <textarea
                        id="objectif-description-modification"
                        name="description"
                        rows="5"
                        maxlength="2000"
                    >${echapperHTML(
                        objectif.description || ""
                    )}</textarea>

                </div>


                <div class="objectif-form-group">

                    <label>
                        Progression
                    </label>


                    <div
                        class="objectif-progression-formulaire"
                    >

                        <div
                            class="objectif-progression-entete"
                        >

                            <span>
                                Avancement
                            </span>


                            <strong
                                id="objectif-progression-valeur"
                            >
                                ${progressionInitiale} %
                            </strong>

                        </div>


                        <input
                            type="range"
                            id="objectif-progression"
                            min="0"
                            max="100"
                            step="1"
                            value="${progressionInitiale}"
                            class="objectif-progression-slider"
                        >

                    </div>

                </div>


                <div
                    id="objectif-form-erreur-modification"
                    class="objectif-form-erreur"
                    hidden
                ></div>


                <div class="objectif-form-actions">

                    <button
                        type="button"
                        class="retour-categories"
                        id="annuler-modification-objectif-bas"
                    >
                        Annuler
                    </button>


                    <button
                        type="submit"
                        class="ajouter-objectif"
                    >
                        Enregistrer les modifications
                    </button>

                </div>

            </form>

        </div>

    `;


    /* ==================================================
       ANNULATION
       ================================================== */

    function annulerModification() {

        afficherListeObjectifs(
            container,
            categorieId,
            window.objectifsActuels || []
        );

    }


    document
        .getElementById(
            "annuler-modification-objectif"
        )
        .addEventListener(
            "click",
            annulerModification
        );


    document
        .getElementById(
            "annuler-modification-objectif-bas"
        )
        .addEventListener(
            "click",
            annulerModification
        );


    /* ==================================================
       PROGRESSION
       ================================================== */

    const slider =
        document.getElementById(
            "objectif-progression"
        );


    const valeur =
        document.getElementById(
            "objectif-progression-valeur"
        );


    slider.addEventListener(
        "input",
        () => {

            valeur.textContent =
                `${Number(slider.value)} %`;

        }
    );


    /* ==================================================
       ENREGISTREMENT
       ================================================== */

    document
        .getElementById(
            "objectif-form-modification"
        )
        .addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const titre =
                    document
                        .getElementById(
                            "objectif-titre-modification"
                        )
                        .value
                        .trim();


                const description =
                    document
                        .getElementById(
                            "objectif-description-modification"
                        )
                        .value
                        .trim();


                const progression =
                    Number(
                        document
                            .getElementById(
                                "objectif-progression"
                            )
                            .value
                    );


                const erreur =
                    document.getElementById(
                        "objectif-form-erreur-modification"
                    );


                erreur.hidden = true;
                erreur.textContent = "";


                let statut = "en_cours";


                if (progression === 0) {

                    statut = "a_commencer";

                } else if (progression === 100) {

                    statut = "atteint";

                }


                console.log(
                    "💾 Modification de l'objectif...",
                    {
                        id: objectif.id,
                        categorie_id: categorieId,
                        titre,
                        description,
                        progression,
                        statut
                    }
                );


                try {

                    const response =
                        await fetch(
                            `/api/objectifs/${objectif.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    categorie_id:
                                        categorieId,

                                    titre,

                                    description,

                                    progression,

                                    statut

                                })
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "📡 Statut modification :",
                        response.status
                    );


                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Impossible de modifier l'objectif."
                        );

                    }


                    console.log(
                        "✅ Objectif modifié :",
                        data
                    );


                    afficherObjectifsCategorie(
                        categorieId
                    );


                } catch (error) {

                    console.error(
                        "❌ Erreur modification objectif :",
                        error
                    );


                    erreur.textContent =
                        error.message;


                    erreur.hidden = false;

                }

            }
        );


    document
        .getElementById(
            "objectif-titre-modification"
        )
        .focus();

}
    /* ==================================================
       FOCUS SUR LE TITRE
       ================================================== */

    const champTitreModification =
    document.getElementById("objectif-titre-modification");

    if (champTitreModification) {

        champTitreModification.focus();

    }

/* ======================================================
   PROTECTION HTML
   ====================================================== */

function echapperHTML(texte) {

    const div =
        document.createElement("div");

    div.textContent =
        texte ?? "";

    return div.innerHTML;

}