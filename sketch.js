//https://stackoverflow.com/questions/51811935/point-of-intersection-between-bezier-curve-and-circle
//https://www.desmos.com/calculator/cahqdxeshd
//https://www.rpi.edu/dept/chem-eng/Biotech-Environ/RotArrows.htm

//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
let nodeMat;
let center;
let fontRegular;
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
  let maxNode = 5;
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
}



function keyPressed(){
    console.log(key)
    if (key===" ")
    {
        let maxNum = pow(2,nodes.length*nodes.length);
         let dec = floor(random(maxNum));
        //
        let bStr = flipStr(dec.toString(2));
        nodeMat.binaryToMat(bStr);
        linkNodesViaAdjacency(nodeMat.mat);
    }
}
function mouseDragged() {
  nodes.forEach((n) => {
    if (n.clicked) {
      n.teleport(mouseX, mouseY);
    }
  });
}
function mousePressed() {
  if (mouseButton == CENTER) {
    // saveCanvas('hmmlogo2','png')
    console.log("clear");
    nodes.forEach((n) => (n.highlighted = false));
  } else {
    nodes.forEach((n) => n.select(mouseX, mouseY));

  }
  // nodes.forEach(n=>n.highlightChildren())
}
