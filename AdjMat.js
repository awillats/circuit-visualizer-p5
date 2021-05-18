// for (let i=0; i<mat.length; i++)
// {
//     for (let j=0; j<mat[0].length; j++)
//     {
//         mat[i][j]
//     }
// }
class AdjMat{
    constructor(nNodes,tileW=20, x=width/2, y)
    {
        this.nNodes = nNodes;
        this.x=x+tileW/2;
        // this.y=y;
        this.y = y || height - tileW*nNodes/2;
        this.tileW=tileW;
        this.mat = this.createBlankMat();
    }
    show()
    {
        let clr;
        let tileW = this.tileW;
        push();
        translate(this.x, this.y);
        let xy;
        // let x0 = -this.nNodes/2;
        // let y0 = -this.nNodes/2;

        rectMode(CENTER);
        textAlign(CENTER);

        for (let i=0; i< this.nNodes; i++)
        {
            for (let j=0; j<this.nNodes; j++)
            {
                // x = i+x0;
                // y = j+y0;
                xy = this.indexToPosition(i,j);
                // this should really use the color associated with edge i->j
                clr = (this.mat[i][j]) ? nodes[i].currentFaceColor : color(150);

                fill(clr);
                stroke(0);
                strokeWeight(2);
                rect(xy.x, xy.y, tileW, tileW);
            }

            stroke(nodes[0].borderColor)
            strokeWeight(0);

            let xyN1 = this.indexToPosition(-1,-1);
            fill(nodes[0].borderColor)
            text(nodes[i].name, xy.x, xyN1.y)
            text(nodes[i].name, xyN1.x, xy.x)
        }
        fill(240)
        strokeWeight(0)
        let xyN2 = this.indexToPosition(-2,-2);

        text("from", -tileW/2, xyN2.y)
        text("to", xyN2.x, -tileW/2);
        pop();
    }
    click(cX, cY)
    {
        let cij = this.positionToIndex(cX,cY);
        if ((cij.x>=0) && (cij.x<this.nNodes) && (cij.y>=0) && (cij.y<this.nNodes))
        {

            this.mat[cij.x][cij.y] = !this.mat[cij.x][cij.y];
            // console.log(cij.x + " " +cij.y)
            linkNodesViaAdjacency(nodeMat.mat);
        }

        // if
        //for all tiles
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

    indexToPosition(i,j)
    {
        let x,y;
        let x0 = -this.nNodes/2;
        let y0 = -this.nNodes/2;
        x = (i+x0)*this.tileW;
        y = (j+y0)*this.tileW;
        return createVector(x,y);
    }
    positionToIndex(x,y)
    {
        let i,j;
        let x0 = -this.nNodes/2;
        let y0 = -this.nNodes/2;
        i = floor((x-this.x+this.tileW/2)/this.tileW-x0);
        j = floor((y-this.y+this.tileW/2)/this.tileW-y0);
        return createVector(i,j);
    }


}
