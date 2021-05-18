function matsAreEqual(mat1, mat2)
{
    if (mat1.length != mat2.length) { return false; }
    if (mat1[0].length != mat2[0].length) { return false; }

    for (let i=0; i<mat1.length; i++)
    {
        for (let j=0; j<mat1[0].length; j++)
        {
            if (mat1[i][j] !== mat2[i][j]) { return false; }
        }
    }
    return true;
}

function are_passively_ambig(mat1, mat2)
{
    return matsAreEqual(undirectMat(mat1), undirectMat(mat2));
}
function undirectMat(mat)
{
    return mats_OR(mat, transposeMat(mat));
}
function transposeMat(mat)
{
    let nRowsOut = mat[0].length;
    let nColsOut = mat.length;
    let matT = [];
    for (let i=0; i<nRowsOut; i++)
    {
        matT[i] = [];
        for (let j=0; j<nColsOut; j++)
        {
            matT[i][j] = mat[j][i];
        }
    }
    return matT;
}
function mats_AND(mat1, mat2)
{
    //assume components are boolean?
    //for now assume they're ints
    let matR = [];
    //assume they're equal size
    for (let i=0; i<mat1.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat1[0].length; j++)
        {
            matR[i][j] = (mat1[i][j] && mat2[i][j]);
        }
    }
    return matR;
}
function mats_OR(mat1, mat2)
{
    let matR = [];
    for (let i=0; i<mat1.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat1[0].length; j++)
        {
            matR[i][j] = (mat1[i][j] || mat2[i][j]);
        }
    }
    return matR;
}
function bMat_mult(bmat1, bmat2)
{
    
}
function mats_XOR(mat1, mat2)
{
    let matR = [];
    for (let i=0; i<mat1.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat1[0].length; j++)
        {
            matR[i][j] = (mat1[i][j] != mat2[i][j]);
        }
    }
    return matR;
}

function mat_NOT(mat)
{
    let matR = [];
    for (let i=0; i<mat.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat[0].length; j++)
        {
            matR[i][j] = !mat[i][j];
        }
    }
    return matR;
}
function zeroCol(colIdx, mat=this.mat)
{
    let matR=[];
    for (let i=0; i<mat.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat[0].length; j++)
        {
            matR[i][j] = (j==colIdx) ?  0 : mat[i][j] ;
        }
    }
    return matR;
}
function zeroRow(rowIdx, mat)
{
    let matR=[];
    for (let i=0; i<mat.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<mat[0].length; j++)
        {
            matR[i][j] = (i==rowIdx) ? 0 : mat[i][j] ;
        }
    }
    return matR;
}
