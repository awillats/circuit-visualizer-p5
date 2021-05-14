//https://stackoverflow.com/questions/51811935/point-of-intersection-between-bezier-curve-and-circle
//https://www.desmos.com/calculator/cahqdxeshd
//https://www.rpi.edu/dept/chem-eng/Biotech-Environ/RotArrows.htm

//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
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



  // nodes.push(new Node("?", width / 4, height / 2));
  // nodes.push( new Node('b',width*.75, height/2) )
  // nodes.push( new Node('c',width*.66, height*.75) )

  // GENERATE the nodes
  let maxNode = 5;
  addSimpleCircuit(maxNode);
  link(1,0);
  link(0,4);

  // addAlphabetChain(maxNode)
  // addHMMLogo();


  // nodes[1].addEdge(nodes[0]);
}


function draw() {
  background(200);
  // nodes.forEach(n => n.select(mouseX,mouseY))

  // noFill();
  // background(color(255,255,255,250) )
  // fill(200)
  // stroke(0);
  // strokeWeight(5)
  // rectMode(CENTER)
  // let rScale = 1;
  // rect(width/2, height/2,640*rScale,320*rScale,25)
  // rect(width/2, height/2-30,200*rScale,55*rScale,25)

    // nodes.forEach((n) => n.force());
    nodes.forEach((n) => n.show());

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
