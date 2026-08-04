import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";

export default class ChestMenu extends Component {

    constructor(container){

        super(container,"chest-menu");

    }

    async init(){

        await super.init();

    }

    cacheElements(){

        this.menu = this.$("#chestMenu");

        this.writeButton = this.$("#btnWriteCard");

        this.viewButton = this.$("#btnViewCards");

    }

    bindEvents(){

        this.writeButton.addEventListener(

            "click",

            () => EventBus.emit("gratitude.write")

        );

        this.viewButton.addEventListener(

            "click",

            () => EventBus.emit("gratitude.gallery")

        );

    }

    show(){

        this.menu.classList.remove("hidden");

        requestAnimationFrame(() => {

            this.menu.classList.add("show");

        });

    }

    hide(){

        this.menu.classList.remove("show");

        setTimeout(() => {

            this.menu.classList.add("hidden");

        },300);

    }

}