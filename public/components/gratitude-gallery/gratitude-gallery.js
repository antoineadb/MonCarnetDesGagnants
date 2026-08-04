import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";

export default class GratitudeGallery extends Component {

    constructor(container) {

        super(container, "gratitude-gallery");

        this.cards = [];

    }

    async init() {

        await super.init();

        await this.loadCards();

    }

    cacheElements() {

    }
    
    bindEvents() {}

   async loadCards() {

        try {

            const response = await fetch("/api/gratitude");

            if (!response.ok) {

                throw new Error("Erreur lors du chargement des cartes");

            }

            this.cards = await response.json();

             console.log("Cartes reçues :", this.cards);

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

        console.log("Container avant :", this.container.innerHTML);

        this.cards.forEach((card, index) => {

            const element = this.createCard(card);

            element.style.left = `${index * 35}px`;

            element.style.top = `${index * 18}px`;

            element.style.zIndex = index;

            this.container.appendChild(element);

        });

    }
     createCard(card) {

        const element = document.createElement("div");
        const angle = Math.floor(Math.random() * 7) - 3;

        element.style.setProperty(
            "--rotation",
            `${angle}deg`
        );
        
        element.className = "gratitude-card";

        const preview =
            card.message.length > 90
            ? card.message.substring(0, 90) + "…"
            : card.message;

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

            <p class="preview">
                ${preview}
            </p>

            <small>
                ${this.formatDate(card.created_at)}
            </small>

        </div>

        `;

        element.addEventListener("click", () => {

            EventBus.emit(

            "gratitude.view",

            card

        );

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


    show() {

        this.container.classList.remove("hidden");

    }

    hide() {

        this.container.classList.add("hidden");

    }
}