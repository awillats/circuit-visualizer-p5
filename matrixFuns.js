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


function row_ANY_AND(row1, row2)
{
    for (let i=0; i<row1.length;i++)
    {
        if (row1[i] && row2[i]) {return true;}
    }
    return false;
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
    bmat2 = bmat2 || bmat1; // if bmat2 doesn't exist, call this on itself
    let matR = [];

    for (let i=0; i<bmat1.length; i++)
    {
        matR[i] = [];
        for (let j=0; j<bmat1[0].length; j++)
        {
            let b = false;
            for (let k=0; k<bmat1[0].length; k++)
            {
                if (bmat1[i][k] && bmat2[k][j]) {
                    b=true;
                    break;
                }
            }
            matR[i][j] = b;

        }
    }
    return matR;
}

function bMat_fastMult(bmat1, bmat2)
{
    let matR = [];
    let br1, br2;
    let bmat2T = transposeMat(bmat2);

    for (let i=0; i<bmat1.length; i++)
    {
        matR[i] = [];
        br1 = bmat1[i];
        for (let j=0; j<bmat1[0].length; j++)
        {
            br2 = bmat2T[j]
            matR[i][j] = row_ANY_AND(br1,br2);
        }
    }
    return matR;
}

function highOrderReach(bmat)
{
    //just get the second order and higher connections
    return mats_AND(reachability_bMult(bmat), mat_NOT(bmat));
}
function reachability_bMult(bmat,fast=true)
{
    let R = bmat;
    for (let i=0; i< bmat.length; i++)
    {
        if (fast) {
            R = mats_OR(R, bMat_mult(R,R))
        }
        else {
            R = mats_OR(R, bMat_fastMult(R,R))
        }
    }
    return R;

}
function reachability_FloydWarshall(bmat)
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
