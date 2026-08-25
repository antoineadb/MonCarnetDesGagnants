/* =========================================================

   LE CARNET DES GAGNANTS
   LE STADE DES GAGNANTS

   Calendrier des exercices

========================================================= */


class Exercices {

    constructor() {

        this.exercises = [];

        const today = new Date();

        this.currentYear =
            today.getFullYear();

        this.currentMonth =
            today.getMonth();

        this.selectedDate = null;


        this.calendar =
            document.getElementById(
                "exerciseCalendar"
            );

        this.calendarMonth =
            document.getElementById(
                "calendarMonth"
            );

        this.selectedDay =
            document.getElementById(
                "selectedDay"
            );

        this.selectedDayTitle =
            document.getElementById(
                "selectedDayTitle"
            );

        this.selectedDaySubtitle =
            document.getElementById(
                "selectedDaySubtitle"
            );

        this.exerciseHours =
            document.getElementById(
                "exerciseHours"
            );

        this.previousMonth =
            document.getElementById(
                "previousMonth"
            );

        this.nextMonth =
            document.getElementById(
                "nextMonth"
            );

        this.addExerciseButton =
            document.getElementById(
                "addExerciseButton"
            );

        this.exerciseFormSection =
            document.getElementById(
                "exerciseFormSection"
            );

        this.exerciseForm =
            document.getElementById(
                "exerciseForm"
            );

        this.cancelExerciseButton =
            document.getElementById(
                "cancelExerciseButton"
            );

        this.bindEvents();

    }


    /* =====================================================
       INITIALISATION
    ====================================================== */

    async init() {

        await this.loadExercises();

        this.renderCalendar();

    }


    /* =====================================================
       ÉVÉNEMENTS
    ====================================================== */

    bindEvents() {

        this.previousMonth.addEventListener(
            "click",
            () => {

                this.changeMonth(-1);

            }
        );


        this.nextMonth.addEventListener(
            "click",
            () => {

                this.changeMonth(1);

            }
        );

        this.addExerciseButton.addEventListener(
            "click",
            () => {

                this.openExerciseForm();

            }
        );


        this.cancelExerciseButton.addEventListener(
            "click",
            () => {

                this.closeExerciseForm();

            }
        );


        this.exerciseForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveExercise();

            }
        );

    }


    /* =====================================================
       CHARGER LES EXERCICES
    ====================================================== */

    async loadExercises() {

        try {

            const response =
                await fetch(
                    "/api/exercises",
                    {
                        credentials: "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Erreur API : ${response.status}`
                );

            }


            this.exercises =
                await response.json();


            console.log(
                "🏛️ Exercices chargés :",
                this.exercises
            );

        }
        catch (error) {

            console.error(
                "❌ Impossible de charger les exercices :",
                error
            );

            this.exercises = [];

        }

    }


    /* =====================================================
       CHANGER DE MOIS
    ====================================================== */

    changeMonth(offset) {

        this.currentMonth += offset;


        if (this.currentMonth < 0) {

            this.currentMonth = 11;

            this.currentYear--;

        }


        if (this.currentMonth > 11) {

            this.currentMonth = 0;

            this.currentYear++;

        }


        this.selectedDate = null;

        this.selectedDay.hidden = true;

        this.renderCalendar();

    }


    /* =====================================================
       CALENDRIER
    ====================================================== */

    renderCalendar() {

        const date =
            new Date(
                this.currentYear,
                this.currentMonth,
                1
            );


        const firstDay =
            date.getDay();


        const daysInMonth =
            new Date(
                this.currentYear,
                this.currentMonth + 1,
                0
            ).getDate();


        const mondayOffset =
            firstDay === 0
                ? 6
                : firstDay - 1;


        const monthName =
            date.toLocaleDateString(
                "fr-FR",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        this.calendarMonth.textContent =
            this.capitalize(
                monthName
            );


        this.calendar.innerHTML = "";


        /* --------------------------------------------------
           CASES VIDES AVANT LE PREMIER JOUR
        -------------------------------------------------- */

        for (
            let i = 0;
            i < mondayOffset;
            i++
        ) {

            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "calendar-day empty";

            this.calendar.appendChild(
                empty
            );

        }


        /* --------------------------------------------------
           JOURS
        -------------------------------------------------- */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const cell =
                document.createElement(
                    "div"
                );

            cell.className =
                "calendar-day";


            const dateString =
                this.formatDate(
                    this.currentYear,
                    this.currentMonth,
                    day
                );


            const today =
                new Date();


            if (
                day === today.getDate() &&
                this.currentMonth === today.getMonth() &&
                this.currentYear === today.getFullYear()
            ) {

                cell.classList.add(
                    "today"
                );

            }


            if (
                this.selectedDate ===
                dateString
            ) {

                cell.classList.add(
                    "selected"
                );

            }


            const number =
                document.createElement(
                    "div"
                );

            number.className =
                "calendar-day-number";

            number.textContent =
                day;


            cell.appendChild(
                number
            );


            const dayExercises =
                this.exercises.filter(
                    exercise =>
                        exercise.exercise_date ===
                        dateString
                );


            if (
                dayExercises.length > 0
            ) {

                const list =
                    document.createElement(
                        "div"
                    );

                list.className =
                    "calendar-exercises";


                dayExercises.forEach(
                    exercise => {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "calendar-exercise";


                        item.innerHTML =
                            `<strong>${
                                exercise.exercise_time || ""
                            }</strong> ${
                                exercise.exercise_type
                            }`;


                        list.appendChild(
                            item
                        );

                    }
                );


                cell.appendChild(
                    list
                );

            }


            cell.addEventListener(
                "click",
                () => {

                    this.selectDay(
                        dateString
                    );

                }
            );


            this.calendar.appendChild(
                cell
            );

        }

    }


    /* =====================================================
       SÉLECTIONNER UN JOUR
    ====================================================== */

    selectDay(dateString) {

        this.selectedDate =
            dateString;


        this.renderCalendar();

        this.renderSelectedDay();

    }


    /* =====================================================
       AFFICHER LE JOUR
    ====================================================== */

    renderSelectedDay() {

        const date =
            this.parseDate(
                this.selectedDate
            );


        const formatted =
            date.toLocaleDateString(
                "fr-FR",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        this.selectedDayTitle.textContent =
            this.capitalize(
                formatted
            );


        this.selectedDaySubtitle.textContent =
            "Votre stade d'entraînement";


        this.selectedDay.hidden =
            false;


        this.renderHours();

    }


    /* =====================================================
       HORAIRES
    ====================================================== */

    renderHours() {

        this.exerciseHours.innerHTML = "";


        const dayExercises =
            this.exercises.filter(
                exercise =>
                    exercise.exercise_date ===
                    this.selectedDate
            );


        for (
            let hour = 6;
            hour <= 22;
            hour++
        ) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "exercise-hour";


            const time =
                document.createElement(
                    "div"
                );

            time.className =
                "exercise-hour-time";

            time.textContent =
                `${String(hour).padStart(2, "0")}:00`;


            const content =
                document.createElement(
                    "div"
                );

            content.className =
                "exercise-hour-content";


            const sessions =
                dayExercises.filter(
                    exercise => {

                        if (
                            !exercise.exercise_time
                        ) {

                            return false;

                        }

                        return Number(
                            exercise.exercise_time
                                .substring(0, 2)
                        ) === hour;

                    }
                );


            sessions.forEach(
                exercise => {

                    const session =
                        document.createElement(
                            "div"
                        );

                    session.className =
                        "exercise-session";


                    session.innerHTML = `

                        <strong>
                            🏅 ${exercise.exercise_type}
                        </strong>

                        <br>

                        <span>
                            ⏱️ ${exercise.duration || 0} min
                            ·
                            📏 ${exercise.distance || 0} km
                        </span>

                    `;


                    content.appendChild(
                        session
                    );

                }
            );


            row.appendChild(
                time
            );

            row.appendChild(
                content
            );


            this.exerciseHours.appendChild(
                row
            );

        }

    }

/* =====================================================
   FORMULAIRE
====================================================== */

/* =====================================================
   FORMULAIRE
====================================================== */

openExerciseForm() {

    if (!this.selectedDate) {

        alert(
            "Veuillez d'abord sélectionner un jour dans le calendrier."
        );

        return;

    }

    this.exerciseForm.reset();


    document.getElementById(
        "exerciseDate"
    ).value = this.selectedDate;


    this.exerciseFormSection.hidden = false;

    // Empêche le défilement de la page derrière la popup
    document.body.classList.add(
        "exercise-modal-open"
    );

}

/* =====================================================
   FERMER LE FORMULAIRE
====================================================== */

/* =====================================================
   FERMER LE FORMULAIRE
====================================================== */

closeExerciseForm() {

    this.exerciseForm.reset();

    this.exerciseFormSection.hidden = true;

    document.body.classList.remove(
        "exercise-modal-open"
    );

}


/* =====================================================
   ENREGISTRER UN EXERCICE
====================================================== */

async saveExercise() {

    const data = {

        exercise_date:
            document.getElementById(
                "exerciseDate"
            ).value,

        exercise_time:
            document.getElementById(
                "exerciseTime"
            ).value,

        exercise_type:
            document.getElementById(
                "exerciseType"
            ).value,

        duration:
            Number(
                document.getElementById(
                    "exerciseDuration"
                ).value
            ) || 0,

        distance:
            Number(
                document.getElementById(
                    "exerciseDistance"
                ).value
            ) || 0,

        notes:
            document.getElementById(
                "exerciseNotes"
            ).value.trim()

    };


    if (!data.exercise_date) {

        alert(
            "Veuillez renseigner une date."
        );

        return;

    }


    if (!data.exercise_type) {

        alert(
            "Veuillez choisir un type d'exercice."
        );

        return;

    }


    try {

        const response =
            await fetch(
                "/api/exercises",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        const responseText =
            await response.text();


        let result;

        try {

            result =
                JSON.parse(
                    responseText
                );

        }
        catch {

            throw new Error(
                responseText ||
                `Erreur API : ${response.status}`
            );

        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                `Erreur API : ${response.status}`
            );

        }


        console.log(
            "🏅 Séance enregistrée :",
            result
        );


        await this.loadExercises();


        this.closeExerciseForm();


        /*
         * Si la date saisie est différente
         * du jour actuellement sélectionné,
         * on affiche directement cette date.
         */

        this.selectedDate =
            data.exercise_date;


        const selected =
            this.parseDate(
                data.exercise_date
            );


        this.currentYear =
            selected.getFullYear();

        this.currentMonth =
            selected.getMonth();


        this.renderCalendar();


        this.renderSelectedDay();


    }
    catch (error) {

        console.error(
            "❌ Impossible d'enregistrer la séance :",
            error
        );


        alert(
            `Impossible d'enregistrer la séance.\n\n${error.message}`
        );

    }

}
    /* =====================================================
       FORMAT DATE
    ====================================================== */

    formatDate(
        year,
        month,
        day
    ) {

        return [
            year,
            String(month + 1)
                .padStart(2, "0"),
            String(day)
                .padStart(2, "0")
        ].join("-");

    }


    /* =====================================================
       PARSE DATE
    ====================================================== */

    parseDate(dateString) {

        const [
            year,
            month,
            day
        ] =
            dateString
                .split("-")
                .map(Number);


        return new Date(
            year,
            month - 1,
            day
        );

    }


    /* =====================================================
       MAJUSCULE
    ====================================================== */

    capitalize(text) {

        return text.charAt(0).toUpperCase()
            + text.slice(1);

    }

}


/* =========================================================
   DÉMARRAGE
========================================================= */

const exercices =
    new Exercices();

exercices.init();