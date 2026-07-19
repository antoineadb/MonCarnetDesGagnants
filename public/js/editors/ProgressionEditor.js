/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * ProgressionEditor
 * ==========================================================
 */

class ProgressionEditor {

    constructor(progression){

        this.progression = progression;

        this.visible = false;

        this.milestone = null;

    }

    open(milestone){

        this.visible = true;

        this.milestone = milestone;

    }

    close(){

        this.visible = false;

        this.milestone = null;

    }

    draw(){

        if(!this.visible) return;

        const ctx = this.progression.ctx;

        const w = 320;

        const h = 230;

        const x = this.progression.width - w - 40;

        const y = 70;

        ctx.save();

        // Ombre

        ctx.shadowColor = "rgba(0,0,0,.18)";

        ctx.shadowBlur = 25;

        ctx.fillStyle = "#fffdf8";

        ctx.strokeStyle = "#D4AF37";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.roundRect(

            x,

            y,

            w,

            h,

            14

        );

        ctx.fill();

        ctx.stroke();

        ctx.shadowBlur = 0;

        CanvasUI.title( ctx, this.milestone.getIcon() + " " + this.milestone.getTitle(), x + 20, y + 40 );

        CanvasUI.label(ctx, "📝 Titre",  x + 20, y + 75 );

        CanvasUI.input( ctx, this.milestone.getTitle(), x + 20, y + 85 );

        ctx.font = "16px Inter";

        ctx.fillText(

            "Position : "

            + Math.round(

                this.milestone.getPosition()*100

            )

            + "%",

            x + 20,

            y + 90

        );

        ctx.fillText(

            this.milestone.getDescription(),

            x + 20,

            y + 125

        );

        ctx.restore();

        this.drawSection( "📝 Titre", y + 70 );

        this.drawInput( this.milestone.getTitle(), y + 80 );

    }

    drawSection(title, y) {

        const ctx = this.progression.ctx;

        ctx.fillStyle = "#6b5538";

        ctx.font = "bold 15px Inter";

        ctx.fillText(

            title,

            this.x + 20,

            y

        );

    }
    drawInput(value, y) {

        const ctx = this.progression.ctx;

        ctx.fillStyle = "#ffffff";

        ctx.strokeStyle = "#d7c39a";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.roundRect(

            this.x + 20,

            y,

            260,

            34,

            6

        );

        ctx.fill();

        ctx.stroke();

        ctx.fillStyle = "#4a3b2d";

        ctx.font = "15px Inter";

        ctx.fillText(

            value,

            this.x + 30,

            y + 22

        );

    }

}