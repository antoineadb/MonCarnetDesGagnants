/**
 * ==========================================================
 * Le Carnet des Gagnants
 * Chest.js
 * ==========================================================
 */

import Component from "/js/core/Component.js";
import EventBus from "/js/core/EventBus.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export default class Chest extends Component {

    constructor(container){

        super(container,"chest");

    }

    async init(){

        await super.init();

        this.showClosed();
    }

    cacheElements(){

        this.closed = this.$("#chest-closed");

        this.half = this.$("#chest-half");

        this.openContainer = this.$("#chest-open");

        this.bottom = this.$("#chest-bottom");

        this.lid = this.$("#chest-lid");

        this.chest = this.$("#chest");

    }

    bindEvents() {

        this.on(this.chest, "click", () => {

            if (this.chest.classList.contains("open")) {

                this.close();

            } else {

                this.open();

            }

        });

    }
    async open() {

        if (this.opening) return;
        this.opening = true;

        this.chest.classList.add("open");

        await this.sleep(400);
        this.showHalf();

        await this.sleep(700);
        this.showOpen();

        EventBus.emit("chest.open");

        this.opening = false;
    }

    async close() {

        if (this.opening) return;
        this.opening = true;

        this.showHalf();

        await this.sleep(600);

        this.showClosed();

        this.chest.classList.remove("open");

        this.opening = false;
    }

    sleep(ms){

        return new Promise(resolve=>setTimeout(resolve,ms));

    }

    showClosed() {

        this.closed.classList.remove("hidden");
        this.half.classList.add("hidden");
        this.openContainer.classList.add("hidden");

        this.closed.animate(
            [
                { transform: "scale(1.02)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 250,
                easing: "ease-out"
            }
        );
    }

    showHalf() {

        this.closed.classList.add("hidden");
        this.half.classList.remove("hidden");
        this.openContainer.classList.add("hidden");

    }

    showOpen() {

        this.closed.classList.add("hidden");
        this.half.classList.add("hidden");
        this.openContainer.classList.remove("hidden");

        this.openContainer.animate(
            [
                { transform: "scale(0.95)" },
                { transform: "scale(1.06)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 450,
                easing: "ease-out"
            }
        );

    }
}