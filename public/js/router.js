class Router {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

        this.routes = {};

    }

    register(name, view) {

        this.routes[name] = view;

    }

    navigate(name) {

        const view = this.routes[name];

        if (!view) {

            console.error(`Vue "${name}" introuvable`);

            return;

        }

        this.container.innerHTML = view.render();

        if (typeof view.init === "function") {

            view.init();

        }

    }

}

window.Router = Router;
