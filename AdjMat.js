class AdjMat{
    constructor(nNodes)
    {
        this.nNodes = nNodes;
        // this.mat=[];
        this.mat = createBlankMat();
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
        return mat;
    }


    binaryToMat(bin)
    {
        let mat = createBlankMat();
        for (let bi=0; bi<bin.length; bi++)
        {
            let i = bi%bin.length;
            let j = floor(bi/bin.length);
            mat[i][j] = bin[bi];
        }
        console.log(mat)
        return mat;
    }
}
