/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * CanvasUI
 * ==========================================================
 */

class CanvasUI {

     static theme = {

        paper: "#fffdf8",

        paperDark: "#f7f2e8",

        border: "#D4AF37",

        text: "#4a3b2d",

        subtitle: "#6b5538",

        success: "#4CAF50",

        danger: "#d9534f",

        shadow: "rgba(0,0,0,.18)"

    };

    static card(ctx, x, y, w, h) {

        ctx.save();

        ctx.shadowColor = this.theme.shadow;

        ctx.shadowBlur = 25;

        ctx.shadowOffsetY = 6;

        ctx.fillStyle = this.theme.paper;

        ctx.strokeStyle = this.theme.border;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.roundRect(x, y, w, h, 16);

        ctx.fill();

        ctx.stroke();

        ctx.restore();

    }

    /**
    * Titre
    */
    static title(ctx, text, x, y) {

        ctx.save();

        ctx.fillStyle = "#4a3b2d";

        ctx.font = "bold 26px Cormorant Garamond";

        ctx.textAlign = "left";

        ctx.fillText(text, x, y);

        ctx.restore();

    }

    static separator(ctx, x, y, w) {

        ctx.save();

        ctx.strokeStyle = "#eadfbd";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.lineTo(x + w, y);

        ctx.stroke();

        ctx.restore();

    }

    static button(ctx, text, x, y, w = 120, h = 36) {

        ctx.save();

        ctx.fillStyle = "#fff";

        ctx.strokeStyle = this.theme.border;

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.roundRect(x, y, w, h, 8);

        ctx.fill();

        ctx.stroke();

        ctx.fillStyle = this.theme.text;

        ctx.font = "15px Inter";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(

            text,

            x + w/2,

            y + h/2

        );

        ctx.restore();

    }

    static badge(ctx, text, x, y) {

        ctx.save();

        ctx.fillStyle = "#FFF6DD";

        ctx.strokeStyle = "#D4AF37";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.roundRect(

            x,

            y,

            90,

            26,

            13

        );

        ctx.fill();

        ctx.stroke();

        ctx.fillStyle = "#7a5a10";

        ctx.font = "13px Inter";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(

            text,

            x + 45,

            y + 13

        );

        ctx.restore();

    }

/**
 * Label
 */
static label(ctx, text, x, y) {

    ctx.save();

    ctx.fillStyle = "#6b5538";

    ctx.font = "bold 15px Inter";

    ctx.fillText(text, x, y);

    ctx.restore();

}

    /**
    * Texte
    */
    static text(ctx, text, x, y) {

        ctx.save();

        ctx.fillStyle = "#4a3b2d";

        ctx.font = "15px Inter";

        ctx.fillText(text, x, y);

        ctx.restore();

    }

    /**
     * Input
     */
    static input(ctx, value, x, y, w = 260, h = 34) {

        ctx.save();

        ctx.fillStyle = "#ffffff";

        ctx.strokeStyle = "#d7c39a";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.roundRect(x, y, w, h, 6);

        ctx.fill();

        ctx.stroke();

        ctx.fillStyle = "#4a3b2d";

        ctx.font = "15px Inter";

        ctx.fillText(

            value,

            x + 10,

            y + 22

        );

        ctx.restore();

    }

    

}