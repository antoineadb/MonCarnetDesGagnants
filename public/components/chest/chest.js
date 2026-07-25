/**
 * ==========================================================
 * Le Carnet des Gagnants
 * Chest.js
 * ==========================================================
 */

import Component from "/js/core/Component.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export default class Chest extends Component {

    constructor(container){

        super(container,"chest");

    }

    async init(){

        await super.init();

        this.build();

    }

    cacheElements(){

        this.svg = this.$("#chest-svg");

        this.body = this.$(".chest-body");

    }

    bindEvents(){

        this.on(this.body,"click",()=>{

            console.log("Coffre");

        });

    }

    build(){

        this.drawShadow();

        this.drawFeet();

        this.drawBody();
        
        this.drawBodyBoards();

        this.drawWoodGrain();

        this.drawLid();

        this.drawSideBands();

        this.drawSideBands();

        this.drawSideBandRivets();

    }

    create(tag){

        return document.createElementNS(SVG_NS,tag);

    }

    drawShadow(){

        const e=this.create("ellipse");

        e.setAttribute("cx",400);
        e.setAttribute("cy",490);

        e.setAttribute("rx",230);
        e.setAttribute("ry",22);

        e.setAttribute("fill","#000");

        e.setAttribute("opacity",".15");

        this.svg.appendChild(e);

    }

    drawFeet(){

        const left=this.create("rect");

        left.setAttribute("x",160);
        left.setAttribute("y",425);

        left.setAttribute("width",55);
        left.setAttribute("height",28);

        left.setAttribute("fill","#6f4523");

        this.svg.appendChild(left);

        const right=this.create("rect");

        right.setAttribute("x",585);
        right.setAttribute("y",425);

        right.setAttribute("width",55);
        right.setAttribute("height",28);

        right.setAttribute("fill","#6f4523");

        this.svg.appendChild(right);

    }

    drawBody(){

        const body=this.create("rect");

        body.setAttribute("x",120);

        body.setAttribute("y",180);

        body.setAttribute("width",560);

        body.setAttribute("height",250);

        body.setAttribute("rx",8);

        body.setAttribute("fill","none");

        body.setAttribute("stroke","#4f2d15");

        body.setAttribute("stroke-width","4");

        this.svg.appendChild(body);

    }

    drawLid(){

        const lid=this.create("path");

        lid.setAttribute(

            "d",

            "M120 180 Q400 35 680 180 L680 205 Q400 60 120 205 Z"

        );

        lid.setAttribute("fill","#8f5d35");

        lid.setAttribute("stroke","#4f2d15");

        lid.setAttribute("stroke-width","4");

        this.svg.appendChild(lid);

    }

    drawBodyBoards() {

        const colors = [
            "#8B5A2B",
            "#7E4E25",
            "#8D5B31",
            "#74441F",
            "#845229",
            "#6F4120"
        ];

        const startX = 120;
        const startY = 185;

        const width = 560;
        const boardHeight = 40;

        for(let i=0;i<6;i++){

            const board = this.create("rect");

            board.setAttribute("x", startX);

            board.setAttribute("y", startY + i * boardHeight);

            board.setAttribute("width", width);

            board.setAttribute("height", boardHeight);

            board.setAttribute("fill", colors[i]);

            board.setAttribute("stroke", "#5B3417");

            board.setAttribute("stroke-width", "1");

            this.svg.appendChild(board);

        }

    }

    drawWoodGrain() {

        for (let i = 0; i < 180; i++) {

            const line = this.create("path");

            const x = 135 + Math.random() * 530;
            const y = 190 + Math.random() * 230;

            const length = 15 + Math.random() * 50;

            const curve = (Math.random() - 0.5) * 12;

            const d = `
                M ${x} ${y}
                Q ${x + length / 2} ${y + curve}
                ${x + length} ${y}
            `;

            line.setAttribute("d", d);

            line.setAttribute("fill", "none");

            line.setAttribute("stroke", "#5A3419");

            line.setAttribute("stroke-width", "0.8");

            line.setAttribute("stroke-linecap", "round");

            line.setAttribute("opacity", "0.30");

            this.svg.appendChild(line);

        }

    }

    drawSideBands() {

        const left = this.create("path");

        left.setAttribute(

            "d",

    `M120 120
    Q135 128 140 145
    L140 430
    Q135 447 120 455
    L108 455
    Q95 447 90 430
    L90 145
    Q95 128 108 120
    Z`

        );

        left.setAttribute("fill","#4e3422");
        left.setAttribute("stroke","#2d1b10");
        left.setAttribute("stroke-width","2");

        this.svg.appendChild(left);


        const right = this.create("path");

        right.setAttribute(

            "d",

    `M680 120
    Q665 128 660 145
    L660 430
    Q665 447 680 455
    L692 455
    Q705 447 710 430
    L710 145
    Q705 128 692 120
    Z`

        );

        right.setAttribute("fill","#4e3422");
        right.setAttribute("stroke","#2d1b10");
        right.setAttribute("stroke-width","2");

        this.svg.appendChild(right);

    }

    drawRivet(x,y){

        const rivet = this.create("circle");

        rivet.setAttribute("cx",x);

        rivet.setAttribute("cy",y);

        rivet.setAttribute("r",5);

        rivet.setAttribute("fill","#9f7745");

        rivet.setAttribute("stroke","#4a2f18");

        rivet.setAttribute("stroke-width","1");

        this.svg.appendChild(rivet);

    }

    drawSideBandRivets(){

        const left = [

            [115,140],
            [115,180],
            [115,220],
            [115,260],
            [115,300],
            [115,340],
            [115,380],
            [115,420]

        ];

        left.forEach(p=>this.drawRivet(p[0],p[1]));


        const right=[

            [685,140],
            [685,180],
            [685,220],
            [685,260],
            [685,300],
            [685,340],
            [685,380],
            [685,420]

        ];

        right.forEach(p=>this.drawRivet(p[0],p[1]));

    }

}