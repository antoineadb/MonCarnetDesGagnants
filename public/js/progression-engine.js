/**
 * ======================================================
 * PROGRESSION ENGINE
 * ======================================================
 */

class ProgressionEngine {

    constructor(width, height) {

        this.width = width;

        this.height = height;

        this.marginLeft = 120;
        this.marginRight = 120;
        this.marginTop = 80;
        this.marginBottom = 120;

        this.graphWidth =
            this.width -
            this.marginLeft -
            this.marginRight;

        this.graphHeight =
            this.height -
            this.marginTop -
            this.marginBottom;

    }

    /**
     * Retourne les coordonnées d'un jalon
     */

    getPoint(position) {

        const x =
            this.marginLeft +
            position * this.graphWidth;

        const e =
            (Math.exp(4.5 * position) - 1) /
            (Math.exp(4.5) - 1);

        const y =
            this.height -
            this.marginBottom -
            e * this.graphHeight;

        return {

            x,

            y

        };

    }

}
/**
 * Calcule tous les jalons
 */

build(milestones){

    return milestones.map(m=>{

        return{

            ...m,

            point:this.getPoint(

                m.curve_position

            )

        };

    });

}