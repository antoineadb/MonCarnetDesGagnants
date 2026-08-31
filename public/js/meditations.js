/*=========================================================

    LE CARNET DES GAGNANTS
    MEDITATIONS & BIEN-ÊTRE

    Gestion du calendrier et des pratiques

=========================================================*/

(() => {

    "use strict";


    /*=========================================================
        ÉTAT
    =========================================================*/

    let currentDate = new Date();

    let selectedDate = new Date();

    let meditations = [];

    let meditationTypes = [];

    let editingMeditationId = null;


    /*=========================================================
        ÉLÉMENTS DOM
    =========================================================*/

    const calendarMonth =
        document.getElementById("calendarMonth");

    const meditationCalendar =
        document.getElementById("meditationCalendar");

    const previousMonth =
        document.getElementById("previousMonth");

    const nextMonth =
        document.getElementById("nextMonth");

    const selectedDay =
        document.getElementById("selectedDay");

    const selectedDayTitle =
        document.getElementById("selectedDayTitle");

    const selectedDaySubtitle =
        document.getElementById("selectedDaySubtitle");

    const meditationPractices =
        document.getElementById("meditationPractices");

    const addMeditationButton =
        document.getElementById("addMeditationButton");
    
    const addMeditationTypeButton =
        document.getElementById("addMeditationTypeButton");

    const meditationTypeModal =
    document.getElementById("meditationTypeModal");

    const meditationTypeName =
        document.getElementById("meditationTypeName");

    const meditationTypeIcon =
        document.getElementById("meditationTypeIcon");

    const cancelMeditationTypeButton =
        document.getElementById("cancelMeditationTypeButton");

    const saveMeditationTypeButton =
        document.getElementById("saveMeditationTypeButton");

    const meditationModal =
        document.getElementById("meditationModal");

    const meditationForm =
        document.getElementById("meditationForm");

    const cancelMeditationButton =
        document.getElementById("cancelMeditationButton");

    const meditationDate =
        document.getElementById("meditationDate");

    const meditationTime =
        document.getElementById("meditationTime");

    const meditationType =
        document.getElementById("meditationType");

    const meditationDuration =
        document.getElementById("meditationDuration");

    const meditationNotes =
        document.getElementById("meditationNotes");


    /*=========================================================
        OUTILS
    =========================================================*/

    function pad(number) {

        return String(number).padStart(2, "0");

    }


    function dateToString(date) {

        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate())
        );

    }

    function closeMeditationTypeModal() {

        if (!meditationTypeModal) {
            return;
        }

        meditationTypeModal.hidden = true;

        meditationTypeName.value = "";
        meditationTypeIcon.value = "🌿";

    }

    function formatDate(dateString) {

        const date = new Date(
            dateString + "T00:00:00"
        );

        return date.toLocaleDateString(
            "fr-FR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /*=========================================================
    TOAST
=========================================================*/

function showMessage(
    message,
    type = "success"
) {

    if (
        type === "error"
    ) {

        Toast.error(
            message
        );

        return;

    }


    Toast.success(
        message
    );

}


/*=========================================================
    CONFIRM
=========================================================*/

async function confirmAction(
    message
) {

    return await Confirm.show({

        icon: "🧘",

        title: "Méditations & Bien-être",

        message: message,

        confirmText: "🗑 Supprimer",

        cancelText: "Conserver"

    });

}


/*=========================================================
    TOAST
=========================================================*/



    /*=========================================================
        API
    =========================================================*/

    async function loadMeditations() {

        try {

            const response =
                await fetch(
                    "/api/meditations"
                );


            if (!response.ok) {

                throw new Error(
                    "Impossible de charger les pratiques."
                );

            }


            meditations =
                await response.json();


        } catch (error) {

            console.error(
                "Erreur chargement méditations :",
                error
            );

            meditations = [];

            showMessage(
                "Impossible de charger vos pratiques.",
                "error"
            );

        }

    }


    async function loadMeditationTypes() {

        try {

            const response =
                await fetch(
                    "/api/meditations/types"
                );


            if (!response.ok) {

                throw new Error(
                    "Impossible de charger les types."
                );

            }


            meditationTypes =
                await response.json();


            populateTypes();


        } catch (error) {

            console.error(
                "Erreur chargement types :",
                error
            );

            showMessage(
                "Impossible de charger les types de pratique.",
                "error"
            );

        }

    }


    async function createMeditation(data) {

        const response =
            await fetch(
                "/api/meditations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible d'enregistrer la pratique."
            );

        }


        return result;

    }


    async function updateMeditation(
        id,
        data
    ) {

        const response =
            await fetch(
                `/api/meditations/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible de modifier la pratique."
            );

        }


        return result;

    }


    async function deleteMeditation(id) {

        const response =
            await fetch(
                `/api/meditations/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible de supprimer la pratique."
            );

        }


        return result;

    }


    /*=========================================================
        TYPES
    =========================================================*/
function populateTypes() {

    if (!meditationType) {
        return;
    }

    meditationType.innerHTML = `
        <option value="">
            Choisissez une pratique...
        </option>
    `;

    meditationTypes.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type.id;

        option.textContent =
            `${type.icon || "🌿"} ${type.name}`;

        meditationType.appendChild(
            option
        );

    });

}
function showTypeActions() {

    const selectedId =
        Number(meditationType.value);

    const type =
        meditationTypes.find(
            item => item.id === selectedId
        );

    const oldActions =
        document.getElementById(
            "meditationTypeActions"
        );

    if (oldActions) {
        oldActions.remove();
    }

    if (!type) {
        return;
    }

    const actions =
        document.createElement("div");

    actions.id =
        "meditationTypeActions";

    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.marginTop = "8px";

    actions.innerHTML = `
        <button
            type="button"
            id="editMeditationTypeButton"
            class="secondary-button">
            ✏️ Modifier
        </button>

        <button
            type="button"
            id="deleteMeditationTypeButton"
            class="secondary-button">
            🗑 Supprimer
        </button>
    `;

    meditationType
        .parentElement
        .appendChild(actions);

    document
        .getElementById(
            "editMeditationTypeButton"
        )
        .addEventListener(
            "click",
            () => updateMeditationType(type)
        );

    cancelMeditationTypeButton?.addEventListener(
        "click",
        closeMeditationTypeModal
    );

    document
        .getElementById(
            "deleteMeditationTypeButton"
        )
        .addEventListener(
            "click",
            () => deleteMeditationType(type)
        );
}
/*=========================================================
    GESTION DES TYPES DE PRATIQUES
=========================================================*/
async function createMeditationType() {

    if (!meditationTypeModal) {
        return;
    }

    meditationTypeName.value = "";

    meditationTypeIcon.value = "🌿";

    meditationTypeModal.hidden = false;

    setTimeout(
        () => {
            meditationTypeName.focus();
        },
        50
    );
}

async function saveNewMeditationType() {

    const name =
        meditationTypeName.value.trim();

    const icon =
        meditationTypeIcon.value.trim() || "🌿";


    if (!name) {

        showMessage(
            "Le nom de la pratique est obligatoire.",
            "error"
        );

        meditationTypeName.focus();

        return;
    }


    try {

        const response =
            await fetch(
                "/api/meditations/types",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        icon: icon
                    })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible de créer la pratique."
            );

        }


        meditationTypeModal.hidden =
            true;


        await loadMeditationTypes();


        meditationType.value =
            String(result.id);


        showTypeActions();


        showMessage(
            "Nouvelle pratique ajoutée."
        );


    } catch (error) {

        console.error(
            "Erreur création pratique :",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}



/*=========================================================
    MODIFIER UN TYPE DE PRATIQUE
=========================================================*/

async function updateMeditationType(type) {

    const name = prompt(
        "Nom de la pratique :",
        type.name
    );

    if (!name || !name.trim()) {
        return;
    }

    const icon = prompt(
        "Icône de la pratique :",
        type.icon || "🌿"
    );

    try {

        const response =
            await fetch(
                `/api/meditations/types/${type.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        icon: icon?.trim() || "🌿"
                    })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible de modifier la pratique."
            );

        }

        await loadMeditationTypes();

        showMessage(
            "Pratique modifiée avec succès."
        );

    } catch (error) {

        console.error(
            "Erreur modification pratique :",
            error
        );

        showMessage(
            error.message,
            "error"
        );

    }

}


/*=========================================================
    SUPPRIMER UN TYPE DE PRATIQUE
=========================================================*/

async function deleteMeditationType(type) {

    const confirmed =
        await confirmAction(
            `Voulez-vous vraiment supprimer la pratique « ${type.name} » ?`
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/meditations/types/${type.id}`,
                {
                    method: "DELETE"
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Impossible de supprimer la pratique."
            );

        }

        await loadMeditationTypes();

        showMessage(
            "Pratique supprimée."
        );

    } catch (error) {

        console.error(
            "Erreur suppression pratique :",
            error
        );

        showMessage(
            error.message,
            "error"
        );

    }

}

    /*=========================================================
        CALENDRIER
    =========================================================*/

    function renderCalendar() {

        if (
            !calendarMonth ||
            !meditationCalendar
        ) {
            return;
        }


        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        calendarMonth.textContent =
            currentDate.toLocaleDateString(
                "fr-FR",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        /*
         * Première colonne = lundi.
         */

        const firstDay =
            new Date(
                year,
                month,
                1
            );


        let startDay =
            firstDay.getDay();


        if (startDay === 0) {
            startDay = 7;
        }


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        meditationCalendar.innerHTML = "";


        /*
         * Cases vides avant le premier jour.
         */

        for (
            let i = 1;
            i < startDay;
            i++
        ) {

            const empty =
                document.createElement("div");


            empty.className =
                "calendar-day empty";


            meditationCalendar.appendChild(
                empty
            );

        }


        /*
         * Jours du mois.
         */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );


            const dateString =
                dateToString(date);


            const dayElement =
                document.createElement("div");


            dayElement.className =
                "calendar-day";


            if (
                dateString ===
                dateToString(new Date())
            ) {

                dayElement.classList.add(
                    "today"
                );

            }


            if (
                dateString ===
                dateToString(selectedDate)
            ) {

                dayElement.classList.add(
                    "selected"
                );

            }


            const number =
                document.createElement("div");


            number.className =
                "calendar-day-number";


            number.textContent =
                day;


            dayElement.appendChild(
                number
            );


            /*
             * Pratiques du jour.
             */

            const dayMeditations =
                meditations.filter(
                    meditation =>
                        meditation.meditation_date ===
                        dateString
                );


            if (
                dayMeditations.length > 0
            ) {

                const exercises =
                    document.createElement("div");


                exercises.className =
                    "calendar-meditations";


                dayMeditations.forEach(
                    meditation => {

                        const type =
                            meditationTypes.find(
                                item =>
                                    item.id ===
                                    Number(
                                        meditation.type_id
                                    )
                            );


                        const practice =
                            document.createElement("div");


                        practice.className =
                            "calendar-meditation";


                        practice.textContent =
                            `${type?.icon || "🧘"} ${type?.name || "Pratique"}`;


                        exercises.appendChild(
                            practice
                        );

                    }
                );


                dayElement.appendChild(
                    exercises
                );

            }


            dayElement.addEventListener(
                "click",
                () => {

                    selectedDate =
                        new Date(date);


                    renderCalendar();

                    renderSelectedDay();

                }
            );


            meditationCalendar.appendChild(
                dayElement
            );

        }

    }


    /*=========================================================
        JOUR SÉLECTIONNÉ
    =========================================================*/

    function renderSelectedDay() {

        if (
            !selectedDay ||
            !meditationPractices
        ) {
            return;
        }


        const dateString =
            dateToString(
                selectedDate
            );


        selectedDay.hidden = false;


        selectedDayTitle.textContent =
            formatDate(
                dateString
            );


        const practices =
            meditations.filter(
                meditation =>
                    meditation.meditation_date ===
                    dateString
            );


        if (
            practices.length === 0
        ) {

            meditationPractices.innerHTML = `
                <p class="no-practices">
                    Aucune pratique pour cette journée.
                </p>
            `;

            return;

        }


        meditationPractices.innerHTML = "";


        practices.forEach(
            meditation => {

                renderPractice(
                    meditation
                );

            }
        );

    }


    /*=========================================================
        AFFICHAGE D'UNE PRATIQUE
    =========================================================*/

    function renderPractice(
        meditation
    ) {

        const type =
            meditationTypes.find(
                item =>
                    item.id ===
                    Number(
                        meditation.type_id
                    )
            );


        const article =
            document.createElement("article");


        article.className =
            "meditation-practice";


        const icon =
            type?.icon || "🧘";


        const name =
            type?.name || "Pratique";


        article.innerHTML = `

            <div class="meditation-practice-main">

                <div class="meditation-practice-icon">
                    ${icon}
                </div>

                <div class="meditation-practice-info">

                    <h3>
                        ${escapeHtml(name)}
                    </h3>

                    ${
                        meditation.meditation_time
                            ? `
                                <p>
                                    🕐 ${escapeHtml(
                                        meditation.meditation_time
                                    )}
                                </p>
                              `
                            : ""
                    }

                    ${
                        Number(meditation.duration) > 0
                            ? `
                                <p>
                                    ⏱️ ${meditation.duration} minutes
                                </p>
                              `
                            : ""
                    }

                    ${
                        meditation.notes
                            ? `
                                <p class="meditation-notes">
                                    ${escapeHtml(
                                        meditation.notes
                                    )}
                                </p>
                              `
                            : ""
                    }

                </div>

            </div>


            <div class="meditation-practice-actions">

                <button
                    type="button"
                    class="secondary-button edit-meditation">
                    ✏️ Modifier
                </button>

                <button
                    type="button"
                    class="danger-button delete-meditation">
                    🗑️ Supprimer
                </button>

            </div>

        `;


        article
            .querySelector(
                ".edit-meditation"
            )
            .addEventListener(
                "click",
                () => {

                    openEditModal(
                        meditation
                    );

                }
            );


        article
            .querySelector(
                ".delete-meditation"
            )
            .addEventListener(
                "click",
                () => {

                    handleDelete(
                        meditation
                    );

                }
            );


        meditationPractices.appendChild(
            article
        );

    }


    /*=========================================================
        SÉCURITÉ HTML
    =========================================================*/

    function escapeHtml(value) {

        if (value === null ||
            value === undefined) {

            return "";

        }


        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /*=========================================================
        MODALE
    =========================================================*/

    function openModal() {

        editingMeditationId = null;


        meditationForm.reset();


        meditationDate.value =
            dateToString(
                selectedDate
            );


        meditationModal.hidden =
            false;


        setTimeout(
            () => {

                meditationType?.focus();

            },
            50
        );

    }


    function openEditModal(
        meditation
    ) {

        editingMeditationId =
            meditation.id;


        meditationDate.value =
            meditation.meditation_date ||
            "";


        meditationTime.value =
            meditation.meditation_time ||
            "";


        meditationType.value =
            meditation.type_id ||
            "";


        meditationDuration.value =
            meditation.duration ||
            "";


        meditationNotes.value =
            meditation.notes ||
            "";


        meditationModal.hidden =
            false;

    }


    function closeModal() {

        meditationModal.hidden =
            true;


        editingMeditationId =
            null;


        meditationForm.reset();

    }


    /*=========================================================
        ENREGISTREMENT
    =========================================================*/

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        const data = {

            meditation_date:
                meditationDate.value,

            meditation_time:
                meditationTime.value,

            type_id:
                Number(
                    meditationType.value
                ),

            duration:
                Number(
                    meditationDuration.value
                ) || 0,

            notes:
                meditationNotes.value.trim()

        };


        try {

            if (
                editingMeditationId
            ) {

                await updateMeditation(
                    editingMeditationId,
                    data
                );


                showMessage(
                    "Pratique modifiée avec succès."
                );

            } else {

                await createMeditation(
                    data
                );


                showMessage(
                    "Pratique enregistrée avec succès."
                );

            }


            closeModal();


            await loadMeditations();


            renderCalendar();

            renderSelectedDay();


        } catch (error) {

            console.error(
                "Erreur enregistrement :",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }

    }


    /*=========================================================
        SUPPRESSION
    =========================================================*/

    async function handleDelete(
        meditation
    ) {

        const type =
            meditationTypes.find(
                item =>
                    item.id ===
                    Number(
                        meditation.type_id
                    )
            );


        const name =
            type?.name ||
            "cette pratique";


        const confirmed =
            await confirmAction(
                `Voulez-vous vraiment supprimer ${name} ?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteMeditation(
                meditation.id
            );


            showMessage(
                "Pratique supprimée."
            );


            await loadMeditations();


            renderCalendar();

            renderSelectedDay();


        } catch (error) {

            console.error(
                "Erreur suppression :",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }

    }


    /*=========================================================
        NAVIGATION MOIS
    =========================================================*/

    function goToPreviousMonth() {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar();

    }


    function goToNextMonth() {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar();

    }


    /*=========================================================
        RETOUR ACCUEIL
    =========================================================*/

    function backToHome() {

        if (
            window.Navigation &&
            typeof Navigation.home ===
                "function"
        ) {

            Navigation.home();

            return;

        }


        window.location.href =
            "/pages/app.html";

    }


    /*=========================================================
        ÉVÉNEMENTS
    =========================================================*/

    previousMonth?.addEventListener(
        "click",
        goToPreviousMonth
    );


    nextMonth?.addEventListener(
        "click",
        goToNextMonth
    );


    addMeditationButton?.addEventListener(
        "click",
        openModal
    );

    addMeditationTypeButton?.addEventListener(
        "click",
        createMeditationType
    );


    cancelMeditationTypeButton?.addEventListener(
        "click",
        () => {

            meditationTypeModal.hidden = true;

        }
    );


    saveMeditationTypeButton?.addEventListener(
        "click",
        saveNewMeditationType
    );


    meditationForm?.addEventListener(
        "submit",
        handleSubmit
    );

    meditationType?.addEventListener(
        "change",
        showTypeActions
    );


    /*
     * Cliquer sur le fond de la modale
     * ferme la fenêtre.
     */

    document
        .querySelector(
            ".meditation-modal-overlay"
        )
        ?.addEventListener(
            "click",
            closeModal
        );

    document
        .querySelector(
            ".meditation-type-modal-overlay"
        )
        ?.addEventListener(
            "click",
            () => {

                meditationTypeModal.hidden = true;

            }
        );
    /*
     * Touche Échap.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                meditationModal &&
                !meditationModal.hidden
            ) {

                closeModal();

            }

        }
    );

    
    cancelMeditationButton?.addEventListener(
        "click",
        closeModal
    );

    document
        .getElementById("backToHome")
        ?.addEventListener(
            "click",
            backToHome
        );


    /*=========================================================
        INITIALISATION
    =========================================================*/

    async function init() {

        console.log(
            "🧘 Module Méditations & Bien-être"
        );


        await loadMeditationTypes();

        await loadMeditations();


        /*
         * Par défaut, on sélectionne aujourd'hui.
         */

        selectedDate =
            new Date();


        /*
         * Le calendrier démarre sur le mois courant.
         */

        currentDate =
            new Date();


        renderCalendar();

        renderSelectedDay();

    }


    init();

})();