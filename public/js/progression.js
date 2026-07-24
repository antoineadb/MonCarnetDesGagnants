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

        this.curveSteepness = 6,2;

        this.arrowImage = new Image();
        
        this.arrowImage.src = "../images/arrow.svg";

        this.graphWidth =

            this.width -
            this.marginLeft -
            this.marginRight;

        this.graphHeight =
            this.height -
            this.marginTop -
            this.marginBottom;

        this.selectedMilestone = null;

        // Courbe

        this.curvePower = 4.5;
        this.today = 0.72;

        // Progression du jour (0 → 1)

        // TODO : sera remplacé par ProgressionModel
        // Animation

        this.milestones = [

            { t: 0.08, y: 0.02, icon: "🍎", title: "Santé" },

            { t: 0.22, y: 0.05, icon: "😴", title: "Sommeil" },

            { t: 0.38, y: 0.12, icon: "🌅", title: "Miracle Morning" },

            // Point de contrôle
            { t: 0.52, y: 0.28, hidden: true },

            { t: 0.68, y: 0.58, icon: "🚀", title: "Action Massive" },

            // Point de contrôle
            { t: 0.82, y: 0.82, hidden: true },

            { t: 0.96, y: 0.95, icon: "⭐", title: "Potentiel" }

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

            this.selectedMilestone = null;

            this.draw();

            return;

        }

        this.selectedMilestone = milestone;

        this.editor.open(milestone);

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

        this.drawPotentialLabel();

        this.drawQuote();

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

    getCurveY(t) {

        const k = this.curveSteepness;

        return (Math.exp(k * t) - 1) /
            (Math.exp(k) - 1);

    }

    getCurvePoint(value) {

        const t = typeof value === "number"
            ? value
            : value.t;

        const y = this.getCurveY(t);

        return {

            x:
                this.marginLeft +
                t * this.graphWidth,

            y:
                this.height -
                this.marginBottom -
                y * this.graphHeight

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

        ctx.moveTo(start.x, start.y);

        const lastT = 0.96;

        const max = Math.floor(lastT *400 * this.animation);

        for (let i = 1; i <= max; i++) {

            const point = this.getCurvePoint(i / 400);

            ctx.lineTo(point.x, point.y);

        }

        ctx.strokeStyle = this.getCurveGradient();
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.globalAlpha = .18;
        ctx.strokeStyle = "#ffd86b";
        ctx.lineWidth = 14;
        ctx.stroke();

        // Flèche finale

        const end = this.getCurvePoint(0.96);

        const angle = Math.atan2(-1.4, 1);

        const arrowLength = 65;

        const x2 = end.x + Math.cos(angle) * arrowLength;
        const y2 = end.y + Math.sin(angle) * arrowLength;

        // Pointe
        const head = 22;

        ctx.beginPath();
        ctx.moveTo(x2, y2);

        ctx.lineTo(
            x2 - head * Math.cos(angle - Math.PI / 6),
            y2 - head * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 - head * Math.cos(angle + Math.PI / 6),
            y2 - head * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();
        ctx.fill();

       

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
        const isMobile = this.width < 900;

        milestones.forEach(milestone => {
            if (milestone.hidden) return;
            const t = milestone.getPosition ? milestone.getPosition() : milestone.curve_position;
            const point = this.getCurvePoint(t);

            // Petit cercle sur la courbe
            const selected = this.selectedMilestone === milestone;

            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                selected ? 10 : 7,
                0,
                Math.PI * 2
            );
            
            ctx.fillStyle = "#ffffff";

            ctx.fill();

            ctx.lineWidth = selected ? 5 : 3;

            ctx.strokeStyle = selected ? "#2fbf71" : "#d4af37";

            ctx.stroke();

            // Trait vertical

            ctx.beginPath();

            ctx.setLineDash([5, 5]);

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

            const title = milestone.getTitle
                ? milestone.getTitle()
                : milestone.title;

            const icon = milestone.getIcon
                ? milestone.getIcon()
                : milestone.icon;
            ctx.font = "28px serif";
            ctx.textAlign = "center";
            ctx.fillStyle = this.colors.text;

            ctx.fillText(
                icon,
                point.x - 25,
                point.y - 10
            );

            // Titre

            const isMobile = this.width < 900;

            ctx.font = isMobile ? "13px Inter" : "16px Inter";
            ctx.fillStyle = "#4b4036";
            ctx.textAlign = "center";

            const titleY = this.height - this.marginBottom + (isMobile ? 75 : 85);

            switch (title) {

                case "Miracle Morning":

                    if (isMobile) {

                        ctx.fillText("Miracle", point.x, titleY - 10);
                        ctx.fillText("Morning", point.x, titleY + 10);

                    } else {

                        ctx.fillText(title, point.x, titleY);

                    }

                    break;

                case "Action Massive":

                    if (isMobile) {

                        ctx.fillText("Action", point.x, titleY - 10);
                        ctx.fillText("Massive", point.x, titleY + 10);

                    } else {

                        ctx.fillText(title, point.x, titleY);

                    }

                    break;

                default:

                    ctx.fillText(title, point.x, titleY);

            }



        });

        const end = this.getCurvePoint(0.96);

        ctx.drawImage(
            this.arrowImage,
            end.x - 16,
            end.y - 24,
            40,
            40
        );

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

        ctx.setLineDash([8, 8]);

        ctx.lineWidth = 2;

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
            7,
            0,
            Math.PI * 2
        );

        ctx.lineWidth = 4;
        ctx.fillStyle = this.colors.today;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        // Texte

        // Flèche

       ctx.strokeStyle = this.colors.today;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(point.x, point.y - 92);
        ctx.lineTo(point.x, point.y - 42);
        ctx.stroke();

        // Pointe de flèche

        ctx.beginPath();
        ctx.moveTo(point.x - 6, point.y - 48);
        ctx.lineTo(point.x, point.y - 38);
        ctx.lineTo(point.x + 6, point.y - 48);
        ctx.stroke();

        // Texte

        ctx.textAlign = "center";
        ctx.fillStyle = this.colors.today;
        ctx.font = "bold 22px Inter";

        ctx.fillText(
            "Aujourd'hui",
            point.x,
            point.y - 105
        );

        ctx.restore();

    }

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
        ctx.font = "italic 18px Cormorant Garamond";
        ctx.fillStyle = "#6b5b4b";

        const quoteY = this.height - 50;

        ctx.fillText(
            "Les habitudes quotidiennes créent une dynamique",
            this.width / 2,
            quoteY
        );

        ctx.fillText(
            "qui révèle progressivement ton potentiel.",
            this.width / 2,
            quoteY + 30
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

        const w = 240;
        const h = 100;

        const progress = this.model
            ? this.model.getProgress()
            : this.today;

        const point = this.getCurvePoint(progress);



        // Position au-dessus de la courbe

        const centerX = this.width / 2;

        let x = centerX - (w / 2);
        let y = this.marginTop + 40;

        // Empêche de sortir du canvas

        x = Math.min(x, this.width - w - 30);

        x = Math.max(x, 30);

        y = Math.max(y, 40);

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

        const percent = Math.round(progress * 100);

        ctx.fillText(

            `Progression : ${percent}%`,

            x + 20,

            y + 78

        );

        ctx.restore();

    }

    drawPotentialLabel() {

        const ctx = this.ctx;

        const milestone = this.model
            ? this.model.getMilestones().find(m => m.getTitle() === "Potentiel")
            : this.milestones.find(m => m.title === "Potentiel");

        if (!milestone) {
            return;
        }

        const point = this.getCurvePoint(
            milestone.getPosition
                ? milestone.getPosition()
                : milestone.t
        );

        ctx.save();

        ctx.font = "bold 28px Cormorant Garamond";
        ctx.fillStyle = "#5a4635";

        ctx.textAlign = "right";

        ctx.fillText(
            "Ton potentiel",
            point.x - 60,
            point.y - 80
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

        catch (error) {

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

