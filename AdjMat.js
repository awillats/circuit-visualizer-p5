class AdjMat{
    constructor(nNodes,x=width/2,y=height*.9,tileW=20)
    {
        this.nNodes = nNodes;
        this.x=x;
        this.y=y;
        this.tileW=tileW;
        this.mat = this.createBlankMat();
    }
    createBlankMat()
    {
        let mat = [];
        for (let i=0; i< this.nNodes; i++)
        {
            mat[i] = [];
            for (let j=0; j<this.nNodes; j++)
            {
                mat[i][j] = 0;
            }
        }
        this.mat = mat;
        return mat;
    }
    createSparseAdj(pConnect=1.5/this.nNodes)
    {
        let mat = [];
        // console.log(pConnect)
        for (let i=0; i< this.nNodes; i++)
        {
            mat[i] = [];
            for (let j=0; j<this.nNodes; j++)
            {
                mat[i][j] = (random(1) < pConnect) ? 1 : 0;
            }
        }
        this.mat = mat;
        // console.log(mat)
        this.binaryStr = this.matToBinary();
        return mat;
    }

    binaryToMat(bin)
    {
        //loops (forward/backward) through binary array
        //placing elements in (column/row)-major order
        let mat = this.createBlankMat();
        // console.log(mat)
        // console.log(bin)
        for (let bi=0; bi<bin.length; bi++)
        {
            let i = bi % this.nNodes;
            let j = floor(bi/ this.nNodes) % this.nNodes;
            mat[i][j] = parseInt(bin[bi],10);
        }
        // console.log(mat)
        this.mat = mat;
        this.binaryStr = bin;
        return mat;
    }
    matToBinary(mat=this.mat)
    {
        let bin = "";
        let bi;

        // mat[i] = [];
        for (let j=0; j<this.nNodes; j++)
        {
            for (let i=0; i< this.nNodes; i++)
            {
                let v = mat[i][j];
                bin = bin.concat(v.toString(10));
            }
        }
        this.mat = mat;
        this.binaryStr = bin;
        return bin;
    }
    show()
    {
        let clr;
        let tileW = this.tileW;
        push();
        translate(this.x, this.y);
        let x,y;
        let x0 = -this.nNodes/2;
        let y0 = -this.nNodes/2;

        rectMode(CENTER);
        textAlign(CENTER);

        for (let i=0; i< this.nNodes; i++)
        {
            for (let j=0; j<this.nNodes; j++)
            {
                x = i+x0;
                y = j+y0;

                // this should really use the color associated with edge i->j
                clr = (this.mat[i][j]) ? nodes[i].currentFaceColor : color(150);

                fill(clr);
                stroke(0);
                strokeWeight(2);
                rect(x*tileW, y*tileW, tileW, tileW);
            }

            stroke(nodes[0].borderColor)
            strokeWeight(0);


            fill(nodes[0].borderColor)
            text(nodes[i].name, x*tileW, (y0-1)*tileW)
            text(nodes[i].name, (x0-1)*tileW, (x)*tileW)
        }
        fill(240)
        strokeWeight(0)
        text("from", -tileW/2, (y0-2)*tileW)
        text("to", (x0-2)*tileW, -tileW/2);
        pop();
    }
    click(cX, cY)
    {
        //for all tiles
    }

}
