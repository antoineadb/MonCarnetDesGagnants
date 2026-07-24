/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * Classe : Milestone
 * ==========================================================
 */

class Milestone {

    constructor(data) {

        this.id = data.id;
        this.pathId = data.path_id;
        this.stepOrder = data.step_order;

        this.code = data.code;
        this.title = data.title;

        this.icon = data.icon;
        this.description = data.description;
        this.color = data.color;

        this.position = data.curve_position;

        this.visible = data.is_visible;
        this.editable = data.editable;

        this.citation = data.citation;

    }


    getId() {

        return this.id;

    }

    getCode() {
        return this.code;
    }

    getDescription() {

        return this.description;
    }

    getColor() {
        return this.color;
    }

    getPosition() {

    return this.position;

    }
  
    getTitle() {

        return this.title;

    }

    getIcon() {

        return this.icon;

    }

    isVisible() {

        return this.visible;

    }

    isEditable() {

        return this.editable;

    }

        setTitle(title) {

        this.title = title;

    }

    getCitation() {

        return this.citation;

    }

    setIcon(icon) {

        this.icon = icon;

    }

    setDescription(description) {

        this.description = description;

    }

    setColor(color) {

        this.color = color;

    }

    setPosition(position) {

        this.position = position;

    }

        show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

    toggle() {

        this.visible = !this.visible;

    }

    move(position) {

        this.position = Math.max(

            0,

            Math.min(1, position)

        );

    }
    
    getData() {

        return this.toJSON();

    }

    getPathId() {
        return this.pathId;
    }

        toJSON() {

        return {

            id: this.id,

            path_id: this.pathId,

            step_order: this.stepOrder,

            code: this.code,

            title: this.title,

            icon: this.icon,

            description: this.description,

            color: this.color,

            curve_position: this.position,

            is_visible: this.visible,

            citation: this.citation,

            editable: this.editable

        };

    }

    contains(x, y, point) {

        const dx = x - point.x;

        const dy = y - point.y;

        return Math.sqrt(dx * dx + dy * dy) < 20;

    }

}