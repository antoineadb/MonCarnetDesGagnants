import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";

export default class Postcard extends Component {

    constructor(container) {

        super(container, "postcard");

    }

    async init() {

        await super.init();

    }

    cacheElements() {

        this.card = this.$("#postcard");
        this.inner = this.$(".postcard-inner");
        this.text = this.$(".gratitude-text");
        this.title = this.$("#gratitudeTitle");
        this.message = this.$("#gratitudeMessage");
        this.saveButton = this.$("#saveGratitude");

    }

    bindEvents() {

        this.saveButton.addEventListener(

            "click",

            () => {

                EventBus.emit(
                    "postcard.save",
                    this.getData()
                );

            }

        );

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

        // La carte est maintenant interactive
        this.card.parentElement.style.pointerEvents = "auto";

    }

    hide() {

        this.card.classList.remove("show");

        this.card.classList.remove("flip");

        this.card.classList.remove("expand");

        this.card.classList.add("hidden");

    }
    
    async deposit() {

        // On empêche toute interaction
        this.card.parentElement.style.pointerEvents = "none";

        // On remet la carte côté recto
        this.unflip();

        await this.sleep(900);

        // Elle reprend sa taille normale
        this.card.classList.remove("expand");

        await this.sleep(500);

        // Elle redescend dans le coffre
        this.card.classList.remove("show");

        await this.sleep(1200);

        // Elle disparaît
        this.card.classList.add("hidden");

        // On vide le formulaire
        this.clear();

    }
    clear() {

        this.title.value = "";

        this.message.value = "";

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

    getData(){

        return{

            title: this.title.value.trim(),

            message: this.message.value.trim()

        };

    }

    clear(){

        this.title.value = "";

        this.message.value = "";

    }

    setLoading(isLoading){

        this.saveButton.disabled = isLoading;

        this.title.disabled = isLoading;

        this.message.disabled = isLoading;

        this.saveButton.textContent = isLoading
            ? "⏳ Dépôt dans le coffre..."
            : "📮 Déposer dans le coffre";

    }
}
