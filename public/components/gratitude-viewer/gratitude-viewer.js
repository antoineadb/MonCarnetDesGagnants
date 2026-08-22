import Component from "/js/core/Component.js";
import Postcard from "/components/postcard/postcard.js";

export default class GratitudeViewer extends Component{

    constructor(container){

        super(container,"gratitude-viewer");

    }

    async init(){

        await super.init();

        this.postcard = new Postcard(

            this.content,

            {
                mode: "view",
                gallery: true
            }

        );

        await this.postcard.init();

    }

    cacheElements(){

        this.viewer = this.$("#gratitudeViewer");

        this.closeButton = this.$("#viewerClose");

        this.content = this.$("#viewerContent");
    }

    bindEvents(){

        this.on(

            this.closeButton,

            "click",

            () => this.hide()

        );

    }

    show(){

        this.viewer.classList.remove("hidden");

    }

    hide(){

        this.viewer.classList.add("hidden");

    }

    async showCard(card){

        this.postcard.fill(card);

        this.postcard.setMode("view");

        this.show();

        await this.postcard.show();

    }

}