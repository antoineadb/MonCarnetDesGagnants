/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * ProgressionEditor
 * ==========================================================
 */

class ProgressionEditor {

    constructor(progression){

        this.progression = progression;

        this.panel = document.getElementById("progression-editor");

        this.icon = document.getElementById("editor-icon");

        this.title = document.getElementById("editor-title");

        this.description = document.getElementById("editor-description");

        this.value = document.getElementById("editor-value");

        this.slider = document.getElementById("editor-slider");

        this.saveButton = document.getElementById("editor-save");

        this.milestone = null;

        this.slider.addEventListener("input", () => {

        if (!this.milestone) return;

            const value = Number(this.slider.value);

            this.value.textContent = value + "%";

            this.milestone.setPosition(value / 100);

            this.progression.draw();

        });

    }

    open(milestone){

        console.log("panel :", this.panel);
        console.log("editor :", this);
        this.milestone = milestone;

        this.panel.classList.remove("hidden");

        this.icon.textContent = milestone.getIcon();

        this.title.textContent = milestone.getTitle();

        this.description.textContent = milestone.getDescription();

        const score = Math.round(
            milestone.getPosition() * 100
        );

        this.value.textContent = score + "%";

        this.slider.value = score;

    }

    close(){

        this.panel.classList.add("hidden");

        this.milestone = null;

    }

   

}