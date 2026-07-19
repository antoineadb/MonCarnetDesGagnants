/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * Module : Progression
 * ==========================================================
 */

class Progression {

    constructor() {

        // Canvas

        this.canvas = document.getElementById("progressCanvas");

        this.ctx = this.canvas.getContext("2d");

        // Dimensions

        this.width = this.canvas.width;

        this.height = this.canvas.height;

        // Zone du graphique

        this.marginLeft = 120;

        this.marginRight = 120;

        this.marginTop = 80;

        this.marginBottom = 180;

        this.graphWidth =
            this.width -
            this.marginLeft -
            this.marginRight;

        this.graphHeight =
            this.height -
            this.marginTop -
            this.marginBottom;

        // Courbe

        this.curvePower = 4.5;
        this.today = 0.72;

        // Progression du jour (0 → 1)

        // TODO : sera remplacé par ProgressionModel

        // Animation

        this.milestones = [

        {

                t: 0.08,

                icon: "🍎",

                title: "Santé"

            },

            {

                t: 0.22,

                icon: "😴",

                title: "Sommeil"

            },

            {

                t: 0.38,

                icon: "🌅",

                title: "Miracle Morning"

            },

            {

                t: 0.68,

                icon: "🚀",

                title: "Action Massive"

            },

            {

                t: 0.96,

                icon: "⭐",

                title: "Potentiel"

            }

        ];
        this.animation = 0;

        // Couleurs

        this.colors = {

            paper: "#f8f3e8",

            grid: "rgba(180,170,140,.15)",

            axis: "#777",

            curveStart: "#8d6b2b",

            curveMiddle: "#c99b38",

            curveEnd: "#ffd86b",

            today: "#3cb371",

            text: "#4a3b2d"

        };

        // Jalons
        this.model = null;

        this.selectedMilestone = null;

        this.editMode = false;

        this.editor = new ProgressionEditor(this);

    }

    onClick(event) {

        const rect = this.canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;

        const y = event.clientY - rect.top;

        const milestone = this.findMilestone(x, y);

        if (!milestone) {

            return;

        }

        this.editor.open(

            milestone

        );

        this.draw();
        

    }

    findMilestone(x, y) {

        for (const milestone of this.model.getMilestones()) {

            const point = this.getCurvePoint(

                milestone.getPosition()

            );

            if (milestone.contains(x, y, point)) {

                return milestone;

            }

        }

        return null;

    }

    /**
 * ======================================================
 * Initialisation
 * ======================================================
 */

    async init() {

        await this.load();

        this.resize();

        this.bindEvents();

        this.animate();

        window.addEventListener(

            "resize",

            () => this.resize()

        );

    }


    /**
     * ======================================================
     * Resize
     * ======================================================
     */

    resize() {

        this.canvas.width =

            this.canvas.offsetWidth;

        this.canvas.height = 650;

        this.width = this.canvas.width;

        this.height = this.canvas.height;

        this.graphWidth =

            this.width -

            this.marginLeft -

            this.marginRight;

        this.graphHeight =

            this.height -

            this.marginTop -

            this.marginBottom;

        this.draw();

    }

    /**
     * ======================================================
     * Dessin principal
     * ======================================================
     */

    draw() {

        this.clear();

        this.drawPaper();

        this.drawGrid();

        // this.drawAxes();

        this.drawCurve();

        this.drawMilestones();

        this.drawTodayGlow();

        this.drawToday();

        this.drawInfoCard();

        this.drawQuote();

        if (this.editMode && this.selectedMilestone) {

            this.drawEditor();

        }

        this.editor.draw();

    }
        /**
     * ======================================================
     * Effacement
     * ======================================================
     */

    clear() {

        this.ctx.clearRect(

            0,

            0,

            this.width,

            this.height

        );

    }

    /**
     * ======================================================
     * Fond papier
     * ======================================================
     */

    drawPaper() {

        const ctx = this.ctx;

        ctx.fillStyle = this.colors.paper;

        ctx.fillRect(

            0,

            0,

            this.width,

            this.height

        );

        // Texture très légère

        ctx.save();

        ctx.strokeStyle = "rgba(120,100,70,.03)";

        ctx.lineWidth = 1;

        for (

            let y = 0;

            y < this.height;

            y += 12

        ) {

            ctx.beginPath();

            ctx.moveTo(0, y);

            ctx.lineTo(this.width, y);

            ctx.stroke();

        }

        ctx.restore();

    }

    /**
     * ======================================================
     * Grille
     * ======================================================
     */

    drawGrid() {

        const ctx = this.ctx;

        ctx.save();

        ctx.strokeStyle = this.colors.grid;

        ctx.lineWidth = 1;

        for (

            let x = this.marginLeft;

            x <= this.width - this.marginRight;

            x += 160

        ) {

            ctx.beginPath();

            ctx.moveTo(

                x,

                this.marginTop

            );

            ctx.lineTo(

                x,

                this.height - this.marginBottom

            );

            ctx.stroke();

        }

        for (

            let y = this.marginTop;

            y <= this.height - this.marginBottom;

            y += 80

        ) {

            ctx.beginPath();

            ctx.moveTo(

                this.marginLeft,

                y

            );

            ctx.lineTo(

                this.width - this.marginRight,

                y

            );

            ctx.stroke();

        }

        ctx.restore();

    }

    /**
     * ======================================================
     * Axes
     * ======================================================
     */

    drawAxes() {

        const ctx = this.ctx;

        ctx.save();

        ctx.strokeStyle = this.colors.axis;

        ctx.lineWidth = 2;

        // Axe horizontal

        ctx.beginPath();

        ctx.moveTo(

            this.marginLeft,

            this.height - this.marginBottom

        );

        ctx.lineTo(

            this.width - this.marginRight,

            this.height - this.marginBottom

        );

        ctx.stroke();

        // Axe vertical

        ctx.beginPath();

        ctx.moveTo(

            this.marginLeft,

            this.height - this.marginBottom

        );

        ctx.lineTo(

            this.marginLeft,

            this.marginTop

        );

        ctx.stroke();

        ctx.restore();

    }

    /**
     * ======================================================
     * Point sur la courbe
     * ======================================================
     */

    getCurvePoint(t) {

        const x =

            this.marginLeft +

            t * this.graphWidth;

        const e =

            (Math.exp(this.curvePower * t) - 1)

            /

            (Math.exp(this.curvePower) - 1);

        const y =

            this.height -

            this.marginBottom -

            e * this.graphHeight;

        return {

            x,

            y

        };

    }
        /**
     * ======================================================
     * Dégradé de la courbe
     * ======================================================
     */

    getCurveGradient() {

        const gradient = this.ctx.createLinearGradient(

            this.marginLeft,

            0,

            this.width - this.marginRight,

            0

        );

        gradient.addColorStop(0.00, "#8d6b2b");

        gradient.addColorStop(0.35, "#b8860b");

        gradient.addColorStop(0.70, "#d4af37");

        gradient.addColorStop(1.00, "#ffd86b");

        return gradient;

    }

    /**
     * ======================================================
     * Courbe exponentielle
     * ======================================================
     */

    drawCurve() {

        const ctx = this.ctx;

        ctx.save();

        ctx.beginPath();

        const start = this.getCurvePoint(0);

        ctx.moveTo(

            start.x,

            start.y

        );

        const animationLimit = Math.max(

            2,

            Math.floor(320 * this.animation)

        );

        for (

            let i = 1;

            i <= animationLimit;

            i++

        ) {

            const point = this.getCurvePoint(i / 320);

            ctx.lineTo(

                point.x,

                point.y

            );

        }

        ctx.strokeStyle = this.getCurveGradient();

        ctx.lineWidth = 6;

        ctx.lineCap = "round";

        ctx.lineJoin = "round";

        ctx.stroke();

        // Halo lumineux

        ctx.globalAlpha = .18;

        ctx.strokeStyle = "#ffd86b";

        ctx.lineWidth = 14;

        ctx.stroke();

        ctx.restore();

    }

    /**
     * ======================================================
     * Animation
     * ======================================================
     */

    animate() {

        this.animation = 0;

        const step = () => {

            this.animation += 0.02;

            if (

                this.animation > 1

            ) {

                this.animation = 1;

            }

            this.draw();

            if (

                this.animation < 1

            ) {

                requestAnimationFrame(step);

            }

        };

        requestAnimationFrame(step);

    }
        /**
     * ======================================================
     * Jalons
     * ======================================================
     */

    drawMilestones() {

        const ctx = this.ctx;

        ctx.save();

      const milestones = this.model ? this.model.getMilestones() : this.milestones;
    
        milestones.forEach(milestone => {

            const t = milestone.getPosition ? milestone.getPosition() : milestone.curve_position;
            const point = this.getCurvePoint(t);

            // Petit cercle sur la courbe

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                7,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#ffffff";

            ctx.fill();

            ctx.lineWidth = 3;

            ctx.strokeStyle = "#d4af37";

            ctx.stroke();

            // Trait vertical

            ctx.beginPath();

            ctx.setLineDash([5,5]);

            ctx.lineWidth = 1;

            ctx.strokeStyle = "rgba(120,120,120,.35)";

            ctx.moveTo(
                point.x,
                point.y
            );

            ctx.lineTo(
                point.x,
                this.height - this.marginBottom + 30
            );

            ctx.stroke();

            ctx.setLineDash([]);

            // Icône

            ctx.font = "24px Inter";

            ctx.textAlign = "center";

            ctx.fillStyle = this.colors.text;

            ctx.font = "28px serif";

            const icon = milestone.getIcon ? milestone.getIcon() : milestone.icon;
            
            ctx.fillText(

                icon,

                point.x - 35,

                point.y + 8

            );
            // Titre

            ctx.font = "16px Inter";

            const title = milestone.getTitle ? milestone.getTitle() : milestone.title;
            ctx.fillText(

                title,

                point.x,

                this.height - this.marginBottom + 85

            );

            if (milestone.title === "Potentiel") {

                ctx.font = "bold 26px Cormorant Garamond";

                ctx.fillStyle = "#5a4635";

                ctx.textAlign = "left";

                ctx.fillText(

                    "Ton potentiel",

                    point.x + 25,

                    point.y - 10

                );

            }

        });


        ctx.restore();

    }

    /**
     * ======================================================
     * Aujourd'hui
     * ======================================================
     */

    drawToday() {

        const ctx = this.ctx;

        const progress = this.model ? this.model.getProgress() : this.today;

        const point = this.getCurvePoint(progress);

        ctx.save();

        // Ligne verticale

        ctx.beginPath();

        ctx.setLineDash([8,8]);

        ctx.lineWidth = 2;

        ctx.strokeStyle = "#3cb371";

        ctx.moveTo(

            point.x,

            point.y

        );

        ctx.lineTo(

            point.x,

            this.height - this.marginBottom

        );

        ctx.stroke();

        ctx.setLineDash([]);

        // Point vert

        ctx.beginPath();

        ctx.arc(

            point.x,

            point.y,

            10,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = this.colors.today;

        ctx.fill();

        ctx.lineWidth = 4;

        ctx.strokeStyle = "#ffffff";

        ctx.stroke();

        // Texte

        ctx.textAlign = "left";

        ctx.fillStyle = this.colors.today;

        ctx.font = "bold 18px Inter";

        ctx.fillText(

            "Aujourd'hui",

            point.x + 18,

            point.y - 10

        );

        ctx.font = "15px Inter";

        ctx.fillStyle = "#555";

        ctx.fillText(

            "Niveau : Croissance",

            point.x + 18,

            point.y + 15

        );

        ctx.restore();

    }

    /**
     * ======================================================
     * Titres
     * ======================================================
     */

    /*drawLegend()  {

        const ctx = this.ctx;

        ctx.save();

        ctx.fillStyle = this.colors.text;

        ctx.textAlign = "center";

        ctx.font = "bold 30px Cormorant Garamond";

        ctx.fillText(

            "⭐ Ton potentiel",

            this.width - 180,

            this.marginTop - 20

        );

        ctx.restore();

    }*/

        
    /**
     * ======================================================
     * Citation
     * ======================================================
     */

    drawQuote() {

        const ctx = this.ctx;

        ctx.save();

        ctx.fillStyle = "#7b6855";

        ctx.textAlign = "center";

        ctx.font = "italic 18px Georgia";

        ctx.fillText(

            "Les habitudes quotidiennes créent une dynamique qui révèle progressivement ton potentiel.",

            this.width / 2,

            this.height - 35

        );

        ctx.restore();

    }
        /**
     * ======================================================
     * Halo du point Aujourd'hui
     * ======================================================
     */

    drawTodayGlow() {

        const ctx = this.ctx;

        const progress = this.model ? this.model.getProgress() : this.today;

        const point = this.getCurvePoint(progress);

        const gradient = ctx.createRadialGradient(

            point.x,

            point.y,

            0,

            point.x,

            point.y,

            35

        );

        gradient.addColorStop(0, "rgba(60,179,113,.45)");

        gradient.addColorStop(.4, "rgba(60,179,113,.20)");

        gradient.addColorStop(1, "rgba(60,179,113,0)");

        ctx.save();

        ctx.beginPath();

        ctx.fillStyle = gradient;

        ctx.arc(

            point.x,

            point.y,

            35,

            0,

            Math.PI * 2

        );

        ctx.fill();

        ctx.restore();

    }

    /**
     * ======================================================
     * Petit cartouche d'information
     * ======================================================
     */

    drawInfoCard() {

        const ctx = this.ctx;

        const x = this.width - 290;

        const y = 95;

        const w = 220;

        const h = 95;

        ctx.save();

        ctx.fillStyle = "rgba(255,255,255,.85)";

        ctx.strokeStyle = "#d8c8a2";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.roundRect(x, y, w, h, 12);

        ctx.fill();

        ctx.stroke();

        ctx.fillStyle = "#444";

        ctx.font = "bold 16px Inter";

        ctx.fillText(

            "Aujourd'hui",

            x + 20,

            y + 28

        );

        ctx.font = "15px Inter";

        ctx.fillText(

            "Niveau : Croissance 🌿",

            x + 20,

            y + 55

        );

        const progress = this.model ? this.model.getProgress() : this.today;

        const percent = Math.round(progress * 100);

        ctx.fillText(

            `Progression : ${percent}%`,

            x + 20,

            y + 78

        );

        ctx.restore();

    }
 
    /**
 * ======================================================
 * Chargement du parcours
 * ======================================================
 */

    async load() {

        try {

            const data = await ProgressionService.load(1);

            this.model = new ProgressionModel(data);

            console.log("✔ Parcours chargé", this.model);

        }

        catch(error){

            console.error(error);

        }

    }

    bindEvents() {

        this.canvas.addEventListener(

            "click",

            this.onClick.bind(this)

        );

    }

    drawEditor() {

    const ctx = this.ctx;

    const milestone = this.selectedMilestone;

    ctx.save();

    const x = this.width - 320;

    const y = 120;

    const w = 260;

    const h = 180;

    ctx.fillStyle = "#fffdf7";

    ctx.strokeStyle = "#d4af37";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.roundRect(x, y, w, h, 12);

    ctx.fill();

    ctx.stroke();

    ctx.fillStyle = "#4a3b2d";

    ctx.font = "bold 22px Cormorant Garamond";

    ctx.fillText(

            milestone.getIcon() + " " + milestone.getTitle(),

            x + 20,

            y + 35

        );

        ctx.font = "16px Inter";

        ctx.fillText(

            "Position : " +

            Math.round(

                milestone.getPosition() * 100

            ) + "%",

            x + 20,

            y + 75

        );

        ctx.restore();

    }

}

/**
 * ==========================================================
 * Initialisation
 * ==========================================================
 */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const progression = new Progression();

        progression.init();

    }

);

