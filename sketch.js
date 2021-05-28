
//how d3 does it: https://github.com/d3/d3-force

//shiffman solution: https://www.youtube.com/watch?v=QHEQuoIKgNE

let nodes = [];
let nodes2 = [];
let controlIndex = null;

let nodeMat, nodeMat2;

let adjFun;

let center;
let fontRegular;

let newEdge = null;
let doShowEdges = true;
let doShowReachEdges = true;
let doWiggle = true;//false;

let bgColor;

let startTime,endTime;


let graphEntryArea;
let graphEntryFocus=false;

const DRAG = 0b0;
const ADDEDGE = 0b1;
const STIM = 0b11;

let editMode = DRAG;

function preload()
{
    bgColor= color(200);
}

function setup() {
  createCanvas(800,800);
  center = createVector(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont('Kreon')
  graphEntryArea = createElement('textarea');
  graphEntryArea.elt.placeholder = "specify a graph here.."
  graphEntryArea.attribute("rows","10");
  graphEntryArea.attribute("cols","50");
  graphEntryArea.center('horizontal');
  graphEntryArea.elt.onfocus = () => graphEntryFocus=true;
  graphEntryArea.elt.onblur = () => graphEntryFocus=false;

  // frameRate(10)

  let pageBody = document.querySelector(':root')
  pageBody.style.setProperty('--page-color', bgColor)

  // GENERATE the nodes
  let maxNode = 10;

  let Circuit1 = addSimpleCircuit(maxNode,width*.25);
  // big chain
  // clearMat();
  // for (let i=0; i<6; i++)
  // link(i, i+1)

  //chain
  clearMat();
  link(0,1)
  link(1,2)
//collider
  link(3,4)
  link(5,4)
//fork
  link(7,6)
  link(7,8)

  for (let i=0; i<nodes.length; i++)
  {
      nodes[i].x = floor(i/3)*100+ width/2
      nodes[i].y = 100+40*i;
  }
  nodes[1].x += 50
  nodes[4].x += 50
  nodes[7].x -= 50

  nodes[maxNode-1].y = height;


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
    if (!(nodeMat) || !(nodeMat2)) { return false;}
    let m = nodeMat.mat;

    //m & m' : highlights reciprocal connections
    //m & !m' : highlights strictly directional links
    // let mc = undirectMat( zeroCol(controlIndex, m));
    let mc = ( zeroCol(controlIndex, m));

    // nodeMat2.mat = undirectMat( zeroCol(controlIndex, m));

    // nodeMat2.mat = mats_OR(m, bMat_mult(m,m)); // second order reachability
    // nodeMat2.mat = mats_OR(mc, bMat_mult(mc,mc)); // second order reachability

    // nodeMat2.mat = mats_XOR(mc, reachability_bMult(mc));
    // nodeMat2.mat = reachability_bMult(mc);
    // nodeMat2.mat = reachability_bMult(undirectMat(mc));
    nodeMat2.mat = reachability_bMult(mc);
    // nodeMat2.mat = forkShapedReachability(mc);

    // nodeMat2.mat = colliderReachability(mc);
   nodeMat2.mat = mats_OR(reachability_bMult(mc), colliderReachability(mc));
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
  background(bgColor);
  // nodes.forEach(n => n.select(mouseX,mouseY))
// nodes.forEach((n) => n.force());

    // if (doWiggle) { wiggleNodes(); }

    if (doShowReachEdges) {
        let highOrder = nodeMat2.mat;//mats_AND(nodeMat2.mat, mat_NOT(nodeMat.mat));
        // draw uncontrolled adjacency matrix
       // drawAdj2(reachability_bMult(nodeMat.mat),color(180));
       drawAdj2(highOrder,color(90));
    }


    // let adj = nodeMat2.mat
    let adj;
    if (editMode==STIM) {adj = nodeMat2.mat;}
    else {adj = nodeMat.mat;}
    assignDegreeToNodes(adj)

    //update value in all nodes

    let nvLen = 300;
    // let nVals = new Array(nodes.length).fill(0);



    nodes.forEach(n=> {n.currentValue=1;})
    if (doWiggle)
    {
        propogateNodeSignals();
    }
    drawNodeSignals();



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
    if (editMode == STIM)
    {
        let boltW = 30;
        drawBolt(mouseX,mouseY, boltW, boltW/4,2);
    }
}
function propogateNodeSignals()
{
    let t = frameCount;

    nodes.forEach(n=> {n.currentValue=0;})
    nodes.forEach((n,i)=>{
        let F = 0;
        if ((n.type=='source') || (i==controlIndex)){

            let v=0;;
            if (i==controlIndex)
            {
                v = 1;
            }
            if (i!=controlIndex) {
                // v = n.valueFun(t*(i+1)/5) // works pretty well
                v = 1.5*n.valueFun(t, i+2);
                // v = n.valueFun(2*t/(i*2+1))
                //
                // v = n.valueFun(t*(F+1)/5)
                // F+=.1;
            }
            // v = 1;//
            n.currentValue = v;


            // nVals[i] = v;
            //n.values.push(v);
            for (let j = 0; j< nodes.length; j++)
            {
                if ( (i!=j) && (nodeMat2.mat[i][j] ) )
                {
                    nodes[j].currentValue += n.currentValue;
                }
            }
            // n.children.forEach(nc => {
            //     nc.currentValue += v;
            // })
        }
    })
    nodes.forEach( n => {
        if (n.inDegree>1)
        {
            n.currentValue /= n.inDegree;
        }
    })

}
function drawNodeSignals()
{
    nodes.forEach(n=> {
        // let a = .5;
        // n.currentValue += random()/10+ n.values[0]*a;

        //
        n.pushVal();
        n.r = 3*(n.values[0]) + 20;
        push();
        translate(width*.8,n.y)
        text(n.name, -10,0)
        stroke(0);
        plotWave(n.values, 150, 20)
        pop();
    })
}
function assignDegreeToNodes(adj)
{
    let adjT = transposeMat(adj)
    for (let i=0; i<nodes.length; i++)
    {
        let indeg=0;
        let outdeg=0;

        for (let j=0; j<nodes.length; j++)
        {
            //for now ignoring self-connection when calculating degree
            if (i!=j)
            {
                if (adj[i][j]) { outdeg++; }
                if (adj[j][i]) { indeg++; }
            }

        }
        nodes[i].inDegree = indeg;
        nodes[i].outDegree = outdeg;

        if (indeg>0)
        {
            nodes[i].type = (outdeg > 0) ? 'bridge' : 'sink';
        }
        else
        {
            nodes[i].type = (outdeg > 0) ? 'source' : 'island';
        }
        nodes[i].ioDegree = indeg+outdeg;
    }
}


function plotWave(wave, W,H)
{
    noFill();
    beginShape();
    let m=1;
     // m= Math.max(...wave);
    // console.log(m)
    for (let i=0; i<wave.length; i++)
    {
        let x,y;

        x = map(i, 0,wave.length, 0, W);
        y = map(wave[i], 0, m, -H/2, H/2);
        vertex(x,y)
    }
    endShape();
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
function name2index(nameStr)
{
    const isMatchingName =  (n) => n.name === nameStr;
    return nodes.findIndex(isMatchingName);

    // let result = nodes.filter(n => {
    //     if (n.name===nameStr)
    //     {
    //         console.log('eureka')
    //     }
    //     return n.name===nameStr;
    // })
    // return result;
}
function parseTextToAdj(txt)
{
    const bothValid = (idF, idT) => ((idF >=0 ) && (idT >=0));

    clearMat();
    let lines = txt.split('\n');
    lines.forEach(aLine =>{
        console.log(aLine)

        let pieces;
        if (aLine.includes('<->'))
        {
            pieces = aLine.split('<->')
            isBidirectional = true;
        }
        else {
            pieces = aLine.split('->')
            isBidirectional = false;
        }
        if (pieces.length < 2)
        {
            //skip lines without arrows
            return;
        }

        let idFrom, idTo;
        let fromIndices, toIndices;

        idFrom = name2index(pieces[0]);

        let fromPieces = pieces[0].split(',');
        let toPieces = pieces[1].split(',');

        fromPieces.forEach( fromP => {
            let idFrom = name2index(fromP);
            toPieces.forEach( toP =>
            {
                let idTo = name2index(toP);
                if (link (idFrom, idTo))
                {
                    console.log('valid link from ' + pieces[0] +' to '+toP)
                    if (isBidirectional)
                    {
                        link(idTo, idFrom);
                        console.log('and back')
                    }
                }
                else
                {
                    console.log("WARNING: something about this>> " + aLine + " << is invalid\n")
                }
            })
        })

        // if (toPieces.length > 1)
        // {
        //
        //     idTo = name2index(toPieces[0]);
        // }
        // else
        // {
        //     idTo = name2index(pieces[1]);
        // }



        // console.log(pieces[0] +":"+ idFrom + "," + pieces[1] +":"+ idTo)
        // if (bothValid(idFrom,idTo))
        // {
        //     link (idFrom, idTo);
        //     console.log('valid link!')
        // }
        // else
        // {
        //     console.log("WARNING: something about this>> " + aLine + " << is invalid\n")
        // }
    })
    // console.log(txt);
}


function updateGraphViaText()
{
    let txt = graphEntryArea.elt.value;
    let adjOut = parseTextToAdj(txt);
    // if (adjOut.isValid)
    {
        //set adjacency based on adjOut
    }
    // console.log()
}

function keyPressed(){
    https://discourse.processing.org/t/prevent-p5-dom-js-input-widget-generating-keypressed-events/13019/2
    if (graphEntryFocus) {
        switch(keyCode)
        {
            // could be triggering this from elt.changed instead
            // or elt.input
            case ENTER:
                updateGraphViaText();
        }
        return;
    }
    //only do things with keypresses if the user isn't entering text

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
        case "o":
            editMode = STIM;
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
          // if (n.clicked) {
          // if (n.select(mouseX, mouseY,true)){
          if (n.clicked){
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
        // console.log(editMode)
        nodes.forEach((n) => n.select(mouseX, mouseY,editMode!==STIM));
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
    else
    {
        nodes.forEach((n) => n.select(mouseX, mouseY,true));
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

function drawAdj2(adj=nodeMat2.mat, edgeColor = color(255,0,0))
{
    // let corrEdgeColor = color(255,0,0);
    push();
    noFill();
    strokeWeight(3)
    stroke(edgeColor);
    for (let i=0; i<nodes.length; i++)
    {
        for (let j=0; j<nodes.length; j++)
        {
            if ((adj[i][j]) && (i!=j))
            {
                // stroke(edgeColor);
                drawConnect(i,j)
            }
        }
    }
    pop();
}

function drawConnect(i,j,offset=0)
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
    line(d1*d,offset , d2*d, offset)
    // stroke(color(0,0,255))
    // line(d1*d,2.5,d2*d,2.5)

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
