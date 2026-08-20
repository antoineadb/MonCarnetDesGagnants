/**
 * ==========================================================
 * Le Carnet des Gagnants
 * gratitude.js
 * Version 1.0
 * ==========================================================
 */

import Chest from "/components/chest/chest.js";
import EventBus from "/js/core/EventBus.js";
import Postcard from "/components/postcard/postcard.js";
import ChestMenu from "/components/chest-menu/chest-menu.js";
import GratitudeGallery from "/components/gratitude-gallery/gratitude-gallery.js";
import GratitudeViewer from "/components/gratitude-viewer/gratitude-viewer.js";

class Gratitude {

    constructor() {

        this.chest = null;
        this.postcard = null;

    }
    

    async init() {

        // ======================================================
        // Conteneurs
        // ======================================================

        // ======================================================
        // Composants
        // ======================================================

        this.chest = new Chest(
            document.getElementById("gratitudeChest")
        );

        this.chestMenu = new ChestMenu(
            document.getElementById("gratitudeChestMenu")
        );

        this.postcard = new Postcard(

            document.getElementById("gratitudePostcard"),

            {

                mode:"edit"

            }

        );

        // ======================================================
        // Initialisation
        // ======================================================

        this.initChest();

        await this.chest.init();

        await this.chestMenu.init();

        await this.postcard.init();

        this.gallery = new GratitudeGallery(
            document.getElementById("gratitudeCards")
        );

        this.viewer = new GratitudeViewer(

            document.getElementById("gratitudeViewerContainer")

        );

        await this.viewer.init();

        await this.gallery.init();

        
        // ==
        // ====================================================
        // Événements
        // ======================================================

        EventBus.on(

            "gratitude.write",

            async () => {

                this.chestMenu.hide();

                await this.postcard.reveal();

            }

        );

        EventBus.on(

            "gratitude.gallery",

            () => {

                this.chestMenu.hide();

                this.showGallery();

            }

        );

        EventBus.on(

            "gratitude.view",

            card => {

                this.viewer.showCard(card);

            }

        );

        EventBus.on(

            "postcard.edit",

            card => {

                this.viewer.hide();

                this.postcard.fill(card);

                this.postcard.setMode("edit");

                this.postcard.show();

            }

        );

        EventBus.on(

            "postcard.save",

            data => this.saveCard(data)

        );

        EventBus.on(

          "postcard.favorite",

            card => {

                console.log("EVENT FAVORITE REÇU", card);

                this.saveCard(card);

            }

        );

          EventBus.on(

                "postcard.delete",

                card => this.deleteCard(card)

            );
            
    }

    async showGallery() {

        await this.gallery.loadCards();

        this.gallery.show();

    }
    
    initChest() {

        EventBus.on(

            "chest.open",

            () => {

                console.log("Chest ouvert");

                this.chestMenu.show();

            }

        );

    }


    async saveCard(data) {

        if (!data.title.trim() && !data.message.trim()) {

            Toast.warning(
                "Écris quelques mots avant de déposer ta carte."
            );

            return;

        }

        try {
            
            this.postcard.setLoading(true);

            const isUpdate = !!data.id;

            const url = isUpdate
                ? `/api/gratitude/${data.id}`
                : "/api/gratitude";

            const method = isUpdate
                ? "PUT"
                : "POST";

            console.log("DATA ENVOYÉE :", data);

            const response = await fetch(url, {

                method,

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            });

            const result = await response.json();

            if (!response.ok) {

                Toast.error(
                    result.message || result.error || "Impossible de sauvegarder la carte."
                );

                return;

            }

            Toast.success(

                isUpdate

                    ? "Souvenir mis à jour ✨"

                    : "Carte déposée dans le coffre ✨"

            );
            
            await this.postcard.deposit();

           await this.gallery.loadCards();

        }

        catch (error) {

            console.error(error);

            Toast.error(
                "Impossible de sauvegarder la carte."
            );

        }
        finally {

            this.postcard.setLoading(false);

        }

    }

    async deleteCard(card) {
        const ok = await Confirm.show({

            icon: "🗝️",

            title: "Retirer du coffre",

            message: "Voulez-vous vraiment retirer ce souvenir du Coffre de Gratitude ? Cette action est définitive.",

            confirmText: "🗝 Retirer",

            cancelText: "Le conserver"

        });

        if (!ok) {

            return;

        }
        if (!ok) {

            return;

        }

        try {

            const response = await fetch(

                `/api/gratitude/${card.id}`,

                {

                    method: "DELETE"

                }

            );

            const result = await response.json();

            if (!response.ok) {

                Toast.error(

                    result.error || "Impossible de supprimer le souvenir."

                );

                return;

            }

            Toast.success(

                "Souvenir supprimé 🗑"

            );

            this.viewer.hide();

            await this.gallery.loadCards();

        }

        catch (error) {

            console.error(error);

            Toast.error(

                "Impossible de supprimer le souvenir."

            );

        }

    }    
  
}

document.addEventListener("DOMContentLoaded", () => {

    const gratitude = new Gratitude();

    gratitude.init();

});

document.querySelector(".btn-retour-carnet").addEventListener(
        "click",
        () => {
            window.location.href = "/pages/app.html";
        }
);