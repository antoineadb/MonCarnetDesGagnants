import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";

export default class Postcard extends Component {

    constructor(container, options = {}){

        super(container, "postcard");

        this.mode = options.mode || "edit";

    }

    async init() {

        await super.init();

        this.setMode(this.mode);

    }

    cacheElements() {

        this.card = this.$("#postcard");

        this.inner = this.$(".postcard-inner");

        this.text = this.$(".gratitude-text");

        this.title = this.$("#gratitudeTitle");

        this.message = this.$("#gratitudeMessage");

        this.saveButton = this.$("#saveGratitude");

        this.editor = this.$("#gratitudeEditor");

        this.reader = this.$("#gratitudeReader");

        this.actionsEdit = this.$("#postcardActionsEdit");

        this.actionsView = this.$("#postcardActionsView");

        this.titleView = this.$("#gratitudeTitleView");

        this.messageView = this.$("#gratitudeMessageView");

        this.favoriteButton = this.$("#favoriteCard");

        this.editButton = this.$("#editCard");

        this.deleteButton = this.$("#deleteCard");

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

        this.editButton.addEventListener(

            "click",

            () => {

                EventBus.emit(
                    "postcard.edit",
                    this.cardData
                );

            }

        );
  
        this.deleteButton.addEventListener(

            "click",

            () => {

                EventBus.emit(
                    "postcard.delete",
                    this.cardData
                );

            }

        );

        this.favoriteButton.addEventListener(

            "click",

            () => {

                console.log("CLICK FAVORI");

                this.cardData.favorite = !this.cardData.favorite;

                this.refreshFavorite();

                EventBus.emit(

                    "postcard.favorite",

                    this.cardData

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

        return {

            ...this.cardData,

            title: this.title.value.trim(),

            message: this.message.value.trim()

        };

    }

    setLoading(isLoading){

        this.saveButton.disabled = isLoading;

        this.title.disabled = isLoading;

        this.message.disabled = isLoading;

        this.saveButton.textContent = isLoading
            ? "⏳ Dépôt dans le coffre..."
            : "📮 Déposer dans le coffre";

    }

    isEditMode(){

        return this.mode === "edit";

    }

    isViewMode(){

        return this.mode === "view";

    }

    setMode(mode){

        this.mode = mode;

        if(mode==="edit"){

            this.initEditMode();

        }else{

            this.initViewMode();

        }

    }

    initEditMode(){

        this.editor.classList.remove("hidden");

        this.reader.classList.add("hidden");

        this.actionsEdit.classList.remove("hidden");

        this.actionsView.classList.add("hidden");

    }

    initViewMode(){

        this.editor.classList.add("hidden");

        this.reader.classList.remove("hidden");

        this.actionsEdit.classList.add("hidden");

        this.actionsView.classList.remove("hidden");

    }

    fill(card){

        this.cardData = card;

        // Champs du mode édition
        this.title.value = card.title;
        this.message.value = card.message;

        // Champs du mode lecture
        this.titleView.textContent = card.title;
        this.messageView.textContent = card.message;

        this.refreshFavorite();

    }

    clear(){

        this.title.value = "";

        this.message.value = "";

        this.titleView.textContent = "";

        this.messageView.textContent = "";

    }   
 
    refreshFavorite(){

        this.favoriteButton.classList.toggle(
            "favorite",
            this.cardData.favorite
        );
        this.favoriteButton.textContent =

            this.cardData.favorite

                ? "⭐ Favori"

                : "☆ Favori";

    }

    
}
