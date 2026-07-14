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

        this.cards.forEach(card => {

            card.addEventListener("click", () => {

                const title = card.querySelector("h2").textContent;

                this.openModule(title);

            });

        });

    }

    openModule(module) {

        switch(module){

            case "Objectifs":

                alert("Module Objectifs (Sprint suivant)");

                break;

            case "Journal":

                alert("Module Journal (Sprint suivant)");

                break;

            case "Gratitude":

                alert("Module Gratitude (Sprint suivant)");

                break;

            case "Lecture":

            case "Lectures":

                alert("Module Lecture (Sprint suivant)");

                break;

            case "Paramètres":

                alert("Module Paramètres");

                break;

            default:

                console.log(module);

        }

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const dashboard = new Dashboard();

    dashboard.init();

});