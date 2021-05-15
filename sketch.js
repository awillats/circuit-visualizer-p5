//https://stackoverflow.com/questions/51811935/point-of-intersection-between-bezier-curve-and-circle
//https://www.desmos.com/calculator/cahqdxeshd
//https://www.rpi.edu/dept/chem-eng/Biotech-Environ/RotArrows.htm

//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
let nodeMat;
let center;
let fontRegular;

let newEdge = null;

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
  addSimpleCircuit(maxNode);
  // link(1,0);
  // link(0,4);

  // addAlphabetChain(maxNode)
  // addHMMLogo();
}


function draw() {
  background(200);
  // nodes.forEach(n => n.select(mouseX,mouseY))
// nodes.forEach((n) => n.force());
    nodes.forEach((n) => n.show());
    nodeMat.show()

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
            arrowCurve,
            0,
            0
        )
    }
}



function keyPressed(){
    console.log(key)
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
    }
    if (key===" ")
    {
        // let maxNum = pow(2,nodes.length*nodes.length);
        //  let dec = floor(random(maxNum));
        // let bStr = flipStr(dec.toString(2));
        // nodeMat.binaryToMat(bStr);
        nodeMat.createSparseAdj(.1);
        linkNodesViaAdjacency(nodeMat.mat);
    }
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
    }
}



function startEdge(x,y)
{
    let selectI = null;
    nodes.forEach((n, i) => {
        if (n.select(x,y,true)) {
            selectI = i;
        }
    });
    console.log(selectI)
    if (selectI !== null) {
        newEdge = {startPos: createVector(x,y),startI: selectI}
        console.log('edge started')
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
        link(newEdge.startI, newEdge.endI);
        console.log('edge added')
    }
    else {
        console.log('edge missed')
    }
    newEdge = null;
}
