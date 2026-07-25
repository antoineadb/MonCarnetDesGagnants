/**
 * ==========================================================
 * Le Carnet des Gagnants
 * Component.js
 * Classe de base de tous les composants
 * ==========================================================
 */

export default class Component {

    static loadedStyles = new Set();

    constructor(container, componentName) {

        this.container = container;
        this.componentName = componentName;
        this.events = [];

    }

    async init() {

        await this.loadCSS();
        await this.loadHTML();

        this.cacheElements();
        this.bindEvents();

    }

    on(element, eventName, callback) {

        if (!element) {
            return;
        }

        element.addEventListener(eventName, callback);

        this.events.push({
            element,
            eventName,
            callback
        });

    }

    destroy() {

        this.events.forEach(event => {

            event.element.removeEventListener(
                event.eventName,
                event.callback
            );

        });

        this.events = [];

        this.container.innerHTML = "";

    }

    async loadHTML() {

        const response = await fetch(
            `/components/${this.componentName}/${this.componentName}.html`
        );

        if (!response.ok) {

            throw new Error(
                `Impossible de charger ${this.componentName}.html`
            );

        }

        this.container.innerHTML = await response.text();

    }

    async loadCSS() {

        if (Component.loadedStyles.has(this.componentName)) {

            return;

        }

        const link = document.createElement("link");

        link.rel = "stylesheet";

        link.href =
            `/components/${this.componentName}/${this.componentName}.css`;

        document.head.appendChild(link);

        Component.loadedStyles.add(this.componentName);

    }

   /*=========================================================
        Sélecteurs
    =========================================================*/

    $(selector) {

        return this.container.querySelector(selector);

    }

    $$(selector) {

        return this.container.querySelectorAll(selector);

    }

    /*=========================================================
        Classes CSS
    =========================================================*/

    addClass(selector, className) {

        this.$(selector)?.classList.add(className);

    }

    removeClass(selector, className) {

        this.$(selector)?.classList.remove(className);

    }

    toggleClass(selector, className) {

        this.$(selector)?.classList.toggle(className);

    }

    /*=========================================================
        Affichage
    =========================================================*/

    show() {

        this.container.hidden = false;

    }

    hide() {

        this.container.hidden = true;

    }

    /*=========================================================
        À surcharger
    =========================================================*/

    cacheElements() {}

    bindEvents() {}

}