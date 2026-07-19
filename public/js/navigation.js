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

        Navigation.go("goals.html");

    },

    gratitude() {

        Navigation.go("gratitude.html");

    },

    lecture() {

        Navigation.go("reading.html");

    },

    parametres() {

        Navigation.go("settings.html");

    },

    progression() {

        Navigation.go("progression.html");

    },
};