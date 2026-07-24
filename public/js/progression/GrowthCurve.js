/**
 * ==========================================================
 * LE CARNET DES GAGNANTS
 * GrowthCurve
 * Courbe de Bézier cubique
 * ==========================================================
 */

class GrowthCurve {

    static p0 = { x: 0.00, y: 0.00 };

    static p1 = { x: 0.28, y: 0.00 };

    static p2 = { x: 0.55, y: 0.18 };

    static p3 = { x: 1.00, y: 1.00 };

    static getPoint(t) {

        const u = 1 - t;

        return {

            x:

                u*u*u*GrowthCurve.p0.x +

                3*u*u*t*GrowthCurve.p1.x +

                3*u*t*t*GrowthCurve.p2.x +

                t*t*t*GrowthCurve.p3.x,

            y:

                u*u*u*GrowthCurve.p0.y +

                3*u*u*t*GrowthCurve.p1.y +

                3*u*t*t*GrowthCurve.p2.y +

                t*t*t*GrowthCurve.p3.y

        };

    }

}