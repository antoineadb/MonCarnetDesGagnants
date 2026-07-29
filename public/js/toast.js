class Toast {

    static show(message, type = "info") {

        let container = document.querySelector(".toast-container");

        if (!container) {

            container = document.createElement("div");

            container.className = "toast-container";

            document.body.appendChild(container);

        }

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        toast.textContent = message;

        container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 350);

        }, 3500);

    }

    static success(message) {

        this.show(message, "success");

    }

    static info(message) {

        this.show(message, "info");

    }

    static warning(message) {

        this.show(message, "warning");

    }

    static error(message) {

        this.show(message, "error");

    }

}