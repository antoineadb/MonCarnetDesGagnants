/**
 * ==========================================================
 * Navigation
 * ==========================================================
 */

const Navigation = {

    go(page) {
        window.location.href = "/pages/" + page;
    },

    objectifs() {
        Navigation.go("objectifs.html");
    },

    journal() {
        Navigation.go("journal.html");
    },

    gratitude() {
        Navigation.go("gratitude.html");
    },

    meditations() {
        Navigation.go("meditations.html");
    },

    anals() {
        Navigation.go("anals.html");
    },

    lecture() {
        Navigation.go("lecture.html");
    },

    stade() {
        Navigation.go("exercices.html");
    },

    progression() {
        Navigation.go("progression.html");
    },

    parametres() {
        Navigation.go("parametres.html");
    },

    administration() {

        window.location.href = "administration.html";

    },
    
    accueil() {
        Navigation.go("app.html");
    },

};