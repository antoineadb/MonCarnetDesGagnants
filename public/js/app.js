class Dashboard {

    constructor() {

        this.dateElement = document.getElementById("currentDate");

        this.cards = document.querySelectorAll(".card");

    }

    init() {

        this.updateDate();

        this.bindEvents();

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

        document.getElementById("cardParametres")
            ?.addEventListener("click", Navigation.parametres);

    }


}

document.addEventListener("DOMContentLoaded", () => {

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