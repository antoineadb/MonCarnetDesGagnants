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

    async show() {

        console.log("Postcard.show()");

        this.card.classList.remove("hidden");

        // Laisse le navigateur afficher la carte
        await this.sleep(20);

        // La carte sort du coffre
        this.card.classList.add("show");

        // Attendre la fin de la montée
        await this.sleep(1400);

        // Petite pause
        await this.sleep(300);

        // Retourner la carte
        this.flip();

        await this.sleep(900);

        this.expand();

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

        await this.show();

    }

    expand(){

        this.card.classList.add("expand");

    }
        
}
