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
  // fontRegluar = loadFont('assets/lmmono10-regular.otf',good,bad)
  // console.log(fontRegular)
}
function good()
{
 console.log('noice') 
}
function bad()
{
  console.log('oops')
}
function setup() {
  createCanvas(800, 800);
  center = createVector(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont('Kreon')



  // nodes.push(new Node("?", width / 4, height / 2));
  // nodes.push( new Node('b',width*.75, height/2) )
  // nodes.push( new Node('c',width*.66, height*.75) )

  // GENERATE the nodes
  let maxNode = 20;
  addAlphabetChain(maxNode)

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

   nodes.forEach((n) => n.force());
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

function addAlphabetChain(maxNode) {
  for (let i = 0; i < maxNode; i++) {
    nodes.push(
      new Node(
        getAlphabet(i),
        (width / 2) * (1 + random(-0.25, 0.25)),
        (height / 2) * (1 + random(-0.25, 0.25)),
        random(10, 50)
      )
    );
    // nodes.push( new Node('c',random(width),random(height)) )
  }

  // CONNECT the nodes
  let connectionSpan = nodes.length / 5;
  for (let i = 0; i < maxNode * 2; i++) {
    let i_ = i % nodes.length;
    let ri = random(connectionSpan) - 0 * connectionSpan;
    //let ri = random([1,2]);

    // let ri=0;
    // while (ri==0)
    // {
    //   ri = round(random(-.5,.5)*nodes.length/4);
    // }

    let ri_ = floor(ri + i + nodes.length) % nodes.length;
    console.log(ri_);

    nodes[i_].addEdge(nodes[ri_]);
  }
}


function getAlphabet(abc_idx) {
  return String.fromCharCode(abc_idx + 97);
}
function addHMMLogo()
{
    nodes.push(new Node("H"))
  nodes.push(new Node("M"))
  nodes.push(new Node("M"))
  
  nodes.push(new Node(" "))
  nodes.push(new Node(" "))
  nodes.push(new Node(" "))
  
    let paleBlue = color(200,200,255);
  let paleRed = color(255,200,200);
  nodes[0].faceColor = paleRed;
  nodes[1].faceColor = paleBlue
  nodes[2].faceColor = paleRed;

   nodes[0].addEdge(nodes[1]);
   nodes[1].addEdge(nodes[2]);
  
     nodes[0].addEdge(nodes[3]);
     nodes[1].addEdge(nodes[4]);
     nodes[2].addEdge(nodes[5]);

  let dx = 80;
  for ( let i=0; i<3; i++)
    {
      nodes[i].teleport(width/2+(i-1)*dx,height/2-dx/2)
      nodes[i+3].teleport(width/2+(i-1)*dx,height/2+dx/2)
    }
}
