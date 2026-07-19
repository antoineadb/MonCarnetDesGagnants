class CanvasInput {

    constructor(x, y, width, value = "") {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 34;

        this.value = value;

        this.focus = false;

    }

    draw(ctx) {

        CanvasUI.input(

            ctx,

            this.value,

            this.x,

            this.y,

            this.width,

            this.height

        );

    }

    contains(x, y) {

        return CanvasUI.isInside(

            x,

            y,

            this.x,

            this.y,

            this.width,

            this.height

        );

    }

}