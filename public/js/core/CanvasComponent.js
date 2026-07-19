/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * CanvasComponent
 * Classe de base pour tous les composants Canvas
 * ==========================================================
 */

class CanvasComponent {

    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.visible = true;
        this.enabled = true;

        this.hover = false;
        this.focus = false;

    }

    /**
     * Dessin du composant
     * À surcharger dans les classes filles.
     */
    draw(ctx) {
    }

    /**
     * Détection du clic
     */
    contains(x, y) {

        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );

    }

    /**
     * Gestion du clic
     */
    onClick(x, y) {
    }

    /**
     * Gestion du survol
     */
    onMouseMove(x, y) {

        this.hover = this.contains(x, y);

    }

    /**
     * Gestion du clavier
     */
    onKeyDown(event) {
    }

}