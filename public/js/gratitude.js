/**
 * ==========================================================
 * Le Carnet des Gagnants
 * gratitude.js
 * Version 1.0
 * ==========================================================
 */


class Gratitude {

    constructor() {

        this.cards = [];
        this.container = null;

    }

    async init() {

        this.container = document.getElementById("gratitudeCards");

        await this.loadCards();

    }

    async loadCards() {

        try {

            const response = await fetch("/api/gratitude");

            if (!response.ok) {

                throw new Error("Erreur lors du chargement des cartes");

            }

            this.cards = await response.json();

            this.render();

        }

        catch (error) {

            console.error(error);

        }

    }

    render() {

        this.container.innerHTML = "";

        if (this.cards.length === 0) {

            this.container.innerHTML = `

                <div class="gratitude-empty">

                    <h2>📮</h2>

                    <p>Votre coffre est vide.</p>

                    <p>Créez votre première carte postale.</p>

                </div>

            `;

            return;

        }

        this.cards.forEach(card => {

            this.container.appendChild(

                this.createCard(card)

            );

        });

    }

    createCard(card) {

        const element = document.createElement("div");

        element.className = "postcard";

        element.innerHTML = `

            <div class="postcard-image">

                ${
                    card.image
                        ? `<img src="${card.image}" alt="">`
                        : `<div class="postcard-placeholder">📮</div>`
                }

            </div>

            <div class="postcard-footer">

                <h3>${card.title}</h3>

                <p>${card.location ?? ""}</p>

                <small>${this.formatDate(card.created_at)}</small>

            </div>

        `;

        element.addEventListener("click", () => {

            console.log(card);

        });

        return element;

    }

    formatDate(date) {

        return new Date(date).toLocaleDateString("fr-FR", {

            day: "numeric",
            month: "long",
            year: "numeric"

        });

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const gratitude = new Gratitude();

    gratitude.init();

});