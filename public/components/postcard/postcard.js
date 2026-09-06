import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";
console.log("POSTCARD.JS CHARGÉ - TEST IMAGE");
export default class Postcard extends Component {

    constructor(container, options = {}){

        super(container, "postcard");

        this.mode = options.mode || "edit";

        this.gallery = options.gallery || false;

    }

    async init() {

        await super.init();

        this.setMode(this.mode);

    }

    cacheElements() {

        this.card = this.$("#postcard");

        this.inner = this.$(".postcard-inner");

        this.image = this.$(".postcard-image img");
        
        this.imageInput = this.$("#postcardImageInput");

        this.imageSelector = this.$(".postcard-image-selector");

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

        this.cancelEditButton = this.$("#cancelEdit");

    }

    bindEvents() {

        this.imageInput.addEventListener("change", event => {

            const file = event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                Toast.error("Veuillez choisir une image.");
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {

                const img = new Image();

                img.onload = () => {

                    const maxSize = 1200;

                    let width = img.width;
                    let height = img.height;

                    if (width > maxSize || height > maxSize) {

                        if (width > height) {
                            height = Math.round(height * maxSize / width);
                            width = maxSize;
                        } else {
                            width = Math.round(width * maxSize / height);
                            height = maxSize;
                        }

                    }

                    const canvas = document.createElement("canvas");

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");

                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedImage =
                        canvas.toDataURL("image/jpeg", 0.75);

                    this.image.src = compressedImage;

                    this.cardData = this.cardData || {};
                    this.cardData.image = compressedImage;

                };

                img.src = reader.result;

            };

            reader.readAsDataURL(file);

        });        

        this.saveButton.addEventListener(

            "click",

            () => {

                EventBus.emit(
                    "postcard.save",
                    this.getData()
                );

            }

        );

        if (this.gallery) {

                    this.card.addEventListener(
                        "click",
                        () => {

                            if (
                                this.mode === "view" &&
                                !this.card.classList.contains("flip")
                            ) {

                                this.flip();

                            }

                        }
                    );

                }

        this.cancelEditButton.addEventListener(

            "click",

            async () => {

                // --------------------------------------------------
                // Modification d'une carte existante
                // --------------------------------------------------

                if (this.cardData?.id) {

                    this.title.value = this.cardData.title || "";
                    this.message.value = this.cardData.message || "";

                    this.titleView.textContent = this.cardData.title || "";
                    this.messageView.textContent = this.cardData.message || "";

                    this.hide();

                    // La carte reste une carte en lecture
                    this.setMode("view");

                    return;
                }

                // --------------------------------------------------
                // Nouvelle pensée : rien à restaurer
                // --------------------------------------------------

                this.clear();

                this.hide();

                // On reste en mode édition pour la prochaine pensée
                this.setMode("edit");

            }

        );

        this.editButton.addEventListener(

            "click",

            event => {

                event.stopPropagation();

                EventBus.emit(
                    "postcard.edit",
                    this.cardData
                );

            }

        );
  
        this.deleteButton.addEventListener(

            "click",

            event => {

                event.stopPropagation();

                EventBus.emit(
                    "postcard.delete",
                    this.cardData
                );

            }

        );

        this.favoriteButton.addEventListener(

            "click",

            event => {

                event.stopPropagation();

                console.log("CLICK FAVORI");

                this.cardData.favorite =
                    !this.cardData.favorite;

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

        // Réinitialiser l'état visuel
        this.card.classList.remove("hidden");
        this.card.classList.remove("flip");
        this.card.classList.remove("expand");

        // La carte doit pouvoir recevoir les clics
        if (this.card.parentElement) {
            this.card.parentElement.style.pointerEvents = "auto";
        }

        await this.sleep(20);

        this.card.classList.add("show");

        await this.sleep(1400);

        if (!this.gallery) {

            await this.sleep(300);

            this.flip();

            await this.sleep(900);

        }

        this.expand();
    }

    hide() {

        this.card.classList.remove("show");
        this.card.classList.remove("flip");
        this.card.classList.remove("expand");

        this.card.classList.add("hidden");

        // La carte ne doit plus intercepter les clics
        if (this.card.parentElement) {
            this.card.parentElement.style.pointerEvents = "none";
        }

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

        // Elle redescend dans lA Bibliothèque
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

        const data = {

            ...this.cardData,

            title: this.title.value.trim(),

            message: this.message.value.trim(),

            image: this.image.src

        };

        console.log("IMAGE ENVOYÉE :", data.image);

        return data;

    }

    setLoading(isLoading){

        this.saveButton.disabled = isLoading;

        this.title.disabled = isLoading;

        this.message.disabled = isLoading;

        this.saveButton.textContent = isLoading
            ? "⏳ Dépôt dans la Bibliothèque..."
            : "📮 Déposer dans la Bibliothèque";

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

        this.imageSelector.classList.remove("hidden");

    }

    initViewMode(){

        this.editor.classList.add("hidden");

        this.reader.classList.remove("hidden");

        this.actionsEdit.classList.add("hidden");

        this.actionsView.classList.remove("hidden");

        this.imageSelector.classList.add("hidden");

    }

    fill(card){
        this.cardData = card;

        this.title.value = card.title;
        this.message.value = card.message;

        this.titleView.textContent = card.title;
        this.messageView.textContent = card.message;

        // Restaurer l'image de la carte
        this.image.src =
            card.image ||
            "/assets/images/postcards/france/bordeaux_1908.png";

        this.refreshFavorite();
    }

    clear(){

        this.title.value = "";

        this.message.value = "";

        this.titleView.textContent = "";

        this.messageView.textContent = "";

        this.cardData = null;

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
