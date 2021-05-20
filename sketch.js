
//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
let nodes2 = [];
let controlIndex = null;

let nodeMat, nodeMat2;

let center;
let fontRegular;

let newEdge = null;
let doShowEdges = true;
let doShowReachEdges = true;
let doWiggle = false;


let startTime,endTime;

const DRAG = 0b0;
const ADDEDGE = 0b1;
let editMode = DRAG;

function preload()
{
}

function setup() {
  createCanvas(800, 800);
  center = createVector(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont('Kreon')

  // GENERATE the nodes
  let maxNode = 10;

  let Circuit1 = addSimpleCircuit(maxNode,width*.25);
  clearMat();
  link(0,1)
  link(1,2)
  link(2,3)
  link(3,4)
  link(4,5)
  link(4,5)


  // let Circuit1 = addSimpleChain(maxNode,width*.25);

  // nodes = Circuit1.nodes;
  // nodeMat = Circuit1.nodeMat;

  // let Circuit2 = addSimpleCircuit(maxNode, width*.75);
  // nodes2 = Circuit2.nodes;
  // nodeMat2 = Circuit2.nodeMat;

  nodeMat2 = new AdjMat(maxNode, 20, width*.75);
  transformMat2();
  nodeMat.title = "adjacency"
  nodeMat2.title = "reachability"

  // addAlphabetChain(maxNode)
  // addHMMLogo();
}


function transformMat2()
{
    // let m = nodeMat.mat;
    // console.log('slow')
    let m = nodeMat.mat;
    //m & m' : highlights reciprocal connections
    //m & !m' : highlights strictly directional links
    // let mc = undirectMat( zeroCol(controlIndex, m));
    let mc = ( zeroCol(controlIndex, m));

    // nodeMat2.mat = undirectMat( zeroCol(controlIndex, m));

    // nodeMat2.mat = mats_OR(m, bMat_mult(m,m)); // second order reachability
    // nodeMat2.mat = mats_OR(mc, bMat_mult(mc,mc)); // second order reachability

    // nodeMat2.mat = mats_XOR(mc, reachability_bMult(mc));
    nodeMat2.mat = reachability_bMult(mc);

}

function startT(){
    startTime = performance.now();
}
function endT(){
    endTime = performance.now();
    var timeDiff = endTime-startTime;
    console.log(roundTo(timeDiff,4))
}
function roundTo(val,nPlaces)
{
    let shiftTen = pow(10,nPlaces)
    return round(val*shiftTen)/shiftTen;
}

function draw() {
  background(200);
  // nodes.forEach(n => n.select(mouseX,mouseY))
// nodes.forEach((n) => n.force());

    if (doWiggle) { wiggleNodes(); }
    if (doShowReachEdges) {
        let highOrder = nodeMat2.mat;//mats_AND(nodeMat2.mat, mat_NOT(nodeMat.mat));
       drawAdj2(highOrder);
    }
    nodes.forEach((n) => n.show(doShowEdges));
    nodeMat.show()
    nodeMat2.show()

    if ((newEdge !== null) && (typeof newEdge.endPos !== 'undefined'))
    {
        // console.log(newEdge.startPos)
        // console.log(newEdge.endPos)
        // console.log(p5.Vector.sub(newEdge.endPos, newEdge.startPos))
        strokeWeight(5);
        stroke(0);
        let arrowCurve = 0.125
        drawCurveArrow(newEdge.startPos,
            p5.Vector.sub(newEdge.endPos, newEdge.startPos),
            color(0),
            arrowCurve
        )
    }

    if (controlIndex!==null)
    {
        let n = nodes[controlIndex];
        drawController(n.x, n.y, n.r)
    }
}


// right now this is very haphazrd, but basically want correlated nodes to oscillate together
//
function wiggleNodes()
{

    let f = .2;
    let osc = 3*sin(f*(frameCount));
    let osc2 = 3*sin(f*(frameCount)+PI/2);

    let osc3 = sin(2*PI*random());
    let osc4 = sin(2*PI*random());
    let adj = nodeMat2.mat;
    let adjT = transposeMat(nodeMat2.mat);


    for (let i=0; i<nodes.length; i++)
    {
        let c = adjT[i]
        let r = adj[i]

        if ((row_ANY_AND(r,r))||(row_ANY_AND(c,c))){
            nodes[i].dmove(-0*osc,-osc2);
        }
    }
    if ((controlIndex !== null) && (controlIndex < nodes.length) && (controlIndex >=0))
    {
        nodes[controlIndex].dmove(osc,osc2);
        // nodes[controlIndex].dmove(osc3,osc4);
        for (let i=0; i<nodes.length; i++)
        {
            if (nodeMat2.mat[controlIndex][i]){

                nodes[i].dmove(osc,osc2);
                // nodes[i].dmove(osc3,osc4);

            }
                // console.log(controlIndex)

                // if (nodeMat2.mat[i][controlIndex]){
                //     // console.log('yass')
                //     nodes[i].dmove(osc,osc2);
                // }

        }
    }
}

function keyPressed(){
    console.log(key)
    switch (keyCode)
    {
        case CONTROL:
            setControlIdx(mouseX,mouseY);
            break;
    }
    switch(key)
    {
        case " ":
            break;
        case "c":
            clearMat();
            break;
        case "n":
            editMode = ADDEDGE;
            break;
        case "m":
            editMode = DRAG;
            break;
        case "s":
            doShowEdges = !doShowEdges;
            break;
        case "r":
            doShowReachEdges = !doShowReachEdges;
            break;
        case "w":
            doWiggle = !doWiggle;
            break;
    }
    if (key===" ")
    {
        nodeMat.createSparseAdj(.1);
        nodeMat2.createSparseAdj(.1);

        linkNodesViaAdjacency(nodeMat.mat);
    }
    transformMat2();

}
function mouseDragged() {
    if (editMode===DRAG)
    {
        nodes.forEach((n) => {
          if (n.clicked) {
            n.teleport(mouseX, mouseY);
          }
        });
    }
    if (editMode===ADDEDGE)
    {
        moveEdgeEnd(mouseX,mouseY)
    }

}

function mousePressed() {
  if (mouseButton == CENTER) {
    // saveCanvas('hmmlogo2','png')
    console.log("clear");
    nodes.forEach((n) => (n.highlighted = false));
  } else {

     nodeMat.click(mouseX,mouseY);
     transformMat2()
    if (editMode!==ADDEDGE){
        nodes.forEach((n) => n.select(mouseX, mouseY));
    }

    if (editMode===ADDEDGE)
    {
        startEdge(mouseX,mouseY);
    }

  }
  // nodes.forEach(n=>n.highlightChildren())
}
function mouseReleased() {
    if (newEdge)
    {
        endEdge(mouseX,mouseY);
        transformMat2();
    }
}

function setControlIdx(x,y)
{
    let selectI = null;
    nodes.forEach((n, i) => {
        if (n.select(x,y,true)) {
            selectI = i;
        }
    });
    // console.log(selectI);
    controlIndex = (controlIndex == selectI) ? null : selectI;

    // controlIndex = selectI;
}

function drawAdj2(adj=nodeMat2.mat)
{
    let corrEdgeColor = color(255,0,0);
    push();
    noFill();
    strokeWeight(3)
    stroke(corrEdgeColor);
    for (let i=0; i<nodes.length; i++)
    {
        for (let j=0; j<nodes.length; j++)
        {
            if ((adj[i][j]) && (i!=j))
            {

                let p1 = nodes[i].xy();
                let p2 = nodes[j].xy();
                let dv = p5.Vector.sub(p2,p1);
                let d = dv.mag();

                let d1 = (nodes[i].r/d);
                let d2 = 1 - (nodes[j].r/d);
                let p1_ = dv.copy().mult( d1 );
                let p2_ = dv.copy().mult( d2 );
                push();
                translate(p1.x,p1.y);
                // vline(p1_, p2_);

                rotate(dv.heading());
                line(d1*d,0,d2*d,0)
                // stroke(color(0,0,255))
                // line(d1*d,2.5,d2*d,2.5)

                pop();
            }
        }
    }
    pop();
}

function startEdge(x,y)
{
    let selectI = null;
    nodes.forEach((n, i) => {
        if (n.select(x,y,true)) {
            selectI = i;
        }
    });
    // console.log(selectI)
    if (selectI !== null) {
        newEdge = {startPos: createVector(x,y),startI: selectI}
        // console.log('edge started')
    }
}
function moveEdgeEnd(x,y)
{
    if (newEdge)
    {
        newEdge.endPos = createVector(x,y);
    }
}
function endEdge(x,y)
{
    //if the final x,y overlaps a node, then add the edge, else drop it
    moveEdgeEnd(x,y);
    let selectI = null;
    nodes.forEach((n, i) => {
        if (n.select(x,y,true)) {
            selectI = i;
        }
    });
    if (selectI !== null) {
        newEdge.endI = selectI;
        toggleLink(newEdge.startI, newEdge.endI);
        // console.log('edge added')
    }
    else {
        console.log('edge missed')
    }
    newEdge = null;
}
