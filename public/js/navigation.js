/**
 * ==========================================================
 * Navigation
 * ==========================================================
 */

const Navigation = {

    go(page) {

        window.location.href = page;

    },

    journal() {

        Navigation.go("journal.html");

    },

    journalHistory() {

        Navigation.go("journal-history.html");

    },

    objectifs() {

        Navigation.go("objectifs.html");

    },

    gratitude() {

        Navigation.go("gratitude.html");

    },

    lecture() {

        Navigation.go("lecture.html");

    },

    parametres() {

        Navigation.go("parametres.html");

    },

    progression() {

        Navigation.go("progression.html");

    },
};