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

    lecture() {
        Navigation.go("lecture.html");
    },

    progression() {
        Navigation.go("progression.html");
    },

    parametres() {
        Navigation.go("parametres.html");
    }

};