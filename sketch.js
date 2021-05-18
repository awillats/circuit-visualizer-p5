
//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
let nodes2 = [];
let controlIndex = 9999;

let nodeMat, nodeMat2;

let center;
let fontRegular;

let newEdge = null;
let doShowEdges = true;

const DRAG = 0b0;
const ADDEDGE = 0b1;
let editMode = DRAG;

function preload()
{
}

function setup() {
  createCanvas(600, 600);
  center = createVector(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont('Kreon')

  // GENERATE the nodes
  let maxNode = 10;

  let Circuit1 = addSimpleCircuit(maxNode,width*.25);
  // nodes = Circuit1.nodes;
  // nodeMat = Circuit1.nodeMat;

  // let Circuit2 = addSimpleCircuit(maxNode, width*.75);
  // nodes2 = Circuit2.nodes;
  // nodeMat2 = Circuit2.nodeMat;

  nodeMat2 = new AdjMat(maxNode, 20, width*.75);
  transformMat2();

  // addAlphabetChain(maxNode)
  // addHMMLogo();
}


function transformMat2()
{
    let m = nodeMat.mat;
    //m & m' : highlights reciprocal connections
    //m & !m' : highlights strictly directional links
    nodeMat2.mat = undirectMat( zeroCol(controlIndex, m));
}

function draw() {
  background(200);
  // nodes.forEach(n => n.select(mouseX,mouseY))
// nodes.forEach((n) => n.force());
//
//
    drawAdj2();

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
    controlIndex = (controlIndex == selectI) ? -1 : selectI;

    // controlIndex = selectI;
}

function drawAdj2()
{
    push();
    noFill();
    strokeWeight(3)
    stroke(color(255,0,0));
    for (let i=0; i<nodes.length; i++)
    {
        for (let j=0; j<nodes.length; j++)
        {
            if ((nodeMat2.mat[i][j]) && (i!=j))
            {

                let p1 = nodes[i].xy();
                let p2 = nodes[j].xy();
                let dv = p5.Vector.sub(p2,p1);
                let d = dv.mag();

                let p1_ = dv.copy().mult( (nodes[i].r/d) );
                let p2_ = dv.copy().mult(1 - (nodes[j].r/d) )
                push();
                translate(p1.x,p1.y);
                vline(p1_, p2_);

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
