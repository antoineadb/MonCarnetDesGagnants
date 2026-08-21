/**
 * ==========================================================
 * Le Carnet des Gagnants
 * gratitude.js
 * Version 1.0
 * ==========================================================
 */


import EventBus from "/js/core/EventBus.js";
import Postcard from "/components/postcard/postcard.js";
import GratitudeGallery from "/components/gratitude-gallery/gratitude-gallery.js";
import GratitudeViewer from "/components/gratitude-viewer/gratitude-viewer.js";

class Gratitude {

    constructor() {

        this.postcard = null;
        this.gallery = null;
        this.viewer = null;

    }
    

    async init() {

        // ======================================================
        // Composants
        // ======================================================

        this.postcard = new Postcard(

            document.getElementById("gratitudePostcard"),

            {

                mode:"edit"

            }

        );

        // ======================================================
        // Initialisation
        // ======================================================

        await this.postcard.init();

        this.gallery = new GratitudeGallery(
            document.getElementById("gratitudeCards")
        );

        this.viewer = new GratitudeViewer(

            document.getElementById("gratitudeViewerContainer")

        );

        await this.viewer.init();

        await this.gallery.init();

        this.renderLibrary();

        // ======================================================
        // Bouton : ajouter une pensée
        // ======================================================

        document
            .getElementById("btnAjouterGratitude")
            .addEventListener(
                "click",
                async () => {

                    await this.postcard.reveal();

                }
            );


        // ======================================================
        // Bouton : voir toutes les cartes
        // ======================================================

        document
            .getElementById("btnVoirToutesCartes")
            .addEventListener(
                "click",
                () => {

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

        this.renderLibrary();

        this.gallery.show();

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
                : "Carte conservée dans la bibliothèque ✨"

            );
            
            await this.postcard.deposit();

           await this.gallery.loadCards();

           this.renderLibrary();

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

            title: "Retirer de la bibliothèque",

            message: "Voulez-vous vraiment retirer ce souvenir de la Bibliothèque de Gratitude ? Cette action est définitive.",

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

            this.renderLibrary();

        }

        catch (error) {

            console.error(error);

            Toast.error(

                "Impossible de supprimer le souvenir."

            );

        }

    }    

    renderLibrary() {

        const shelves = [

            document.getElementById("gratitudeLibraryCards1"),
            document.getElementById("gratitudeLibraryCards2"),
            document.getElementById("gratitudeLibraryCards3")

        ];

        // Vider les étagères
        shelves.forEach(shelf => {

            shelf.innerHTML = "";

        });

        // Les 9 cartes les plus récentes
        const cards = this.gallery.cards.slice(0, 9);

        cards.forEach((card, index) => {

            const shelfIndex = Math.floor(index / 3);

            const shelf = shelves[shelfIndex];

            const element = this.gallery.createCard(card);

            shelf.appendChild(element);

        });

        // Compteur
        const count = document.getElementById("gratitudeCount");

        if (count) {

            count.textContent = this.gallery.cards.length;

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