import Component from "/js/core/Component.js";

export default class Postcard extends Component {

    constructor(container) {

        super(container, "postcard");

    }

    async init() {

        await super.init();
        //this.hide();

    }

    cacheElements() {

        this.card = this.$("#postcard");
        this.inner = this.$(".postcard-inner");
        this.text = this.$(".gratitude-text");

    }

    bindEvents() {

    }

    show() {

        console.log("Postcard.show()");

        this.card.classList.remove("hidden");

        // Lance l'animation de sortie du coffre
        requestAnimationFrame(() => {
            this.card.classList.add("show");
        });

    }

    hide() {

        this.card.classList.remove("show");
        this.card.classList.remove("flip");

        this.card.classList.add("hidden");

    }

    flip() {

        this.card.classList.add("flip");

    }

    unflip() {

        this.card.classList.remove("flip");

    }

    sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    async reveal() {

        this.show();

        // Temps nécessaire pour que la carte sorte du coffre
        await this.sleep(1400);

        // Petite pause
        await this.sleep(250);

        // Puis elle se retourne
        this.flip();

    }   
}