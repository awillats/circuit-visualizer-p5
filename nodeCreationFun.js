function addSimpleCircuit(maxNode) {

    for (let i = 0; i < maxNode; i++) {
        let circRadius = 20;
        let posRadius = min(40+(maxNode-3)*circRadius,width*.4);
        let xy = plotAroundCircle(posRadius,i/maxNode-.25);

      nodes.push(
        new Node(
          getAlphabet(i),
          (width / 2) + xy.x,
          (height / 2) + xy.y,
          circRadius
        )
    )};

    // CONNECT the nodes
    // // OPTION 1
    // linkNodesInRing(1);

    // // OPTION 3
    nodeMat = new AdjMat(maxNode);
    nodeMat.mat = nodeMat.binaryToMat("11000" +
                            "00100" +
                            "00010" +
                            "00001" +
                            "10000")

    // // OPTION 3:
    let dec = (31<<20);
    let bStr = flipStr(dec.toString(2));
    console.log(bStr)

    nodeMat.mat = nodeMat.binaryToMat(bStr);
    nodeMat.matToBinary();
    nodeMat.mat = nodeMat.binaryToMat(nodeMat.binaryStr);


    nodeMat.mat = nodeMat.createSparseAdj(.2);
    linkNodesViaAdjacency(nodeMat.mat)
}
function flipStr(s)
{
    return s.split("").reverse().join("")
}
function link(i,j)
{
    nodes[i].addEdge(nodes[j]);
}
function linkNodesViaAdjacency(adjMat)
{
    for (let i=0; i<adjMat.length; i++){
        nodes[i].children = []; //reset all connections
        for (let j=0; j<adjMat[0].length; j++){
            if (adjMat[i][j]) link(i,j);
        }
    }
}

function linkNodesInRing(linkStride=1)
{
    for (let i = 0; i < nodes.length; i++) {

        j = (i+linkStride);
        if (j<0) j+= nodes.length;
        j = j%nodes.length;
        nodes[i].addEdge(nodes[j]);
    }
}




function addAlphabetChain(maxNode) {
  for (let i = 0; i < maxNode; i++) {
    nodes.push(
      new Node(
        getAlphabet(i),
        (width / 2) * (1 + random(-0.25, 0.25)),
        (height / 2) * (1 + random(-0.25, 0.25)),
        10
        //random(10, 50)
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
