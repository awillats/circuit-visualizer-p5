//https://stackoverflow.com/questions/51811935/point-of-intersection-between-bezier-curve-and-circle
//https://www.desmos.com/calculator/cahqdxeshd
//https://www.rpi.edu/dept/chem-eng/Biotech-Environ/RotArrows.htm
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  fill(myColor);
  translate(base.x, base.y);

  rotate(vec.heading());
  line(0,0,vec.mag(),0);

  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function bezierLerp(BezSeg, prc)
{
  let a1,a2,p1,p2;
  a1=BezSeg.a1;
  p1=BezSeg.p1;
  p2=BezSeg.p2;
  a2=BezSeg.a2;

  let q1 = p5.Vector.lerp(p1,a1,prc)
  let qA = p5.Vector.lerp(a1,a2,prc)
  let q2 = p5.Vector.lerp(a2,p2,prc)

  let r1 = p5.Vector.lerp(q1,qA,prc)
  let r2 = p5.Vector.lerp(qA,q2,prc)
  let bp = p5.Vector.lerp(r1,r2,prc)

  // whiteCircle(bp);
  return bp
}
function bezierRender(BezSeg)
{
  let a1,a2,p1,p2;
  a1=BezSeg.a1;
  p1=BezSeg.p1;
  p2=BezSeg.p2;
  a2=BezSeg.a2;

  //   stroke(200,0,0)
  // line(a1.x,a1.y,
  //     p1.x,p1.y)

  // stroke(0)
  bezier(p1.x,p1.y,
    a1.x,a1.y,
    a2.x,a2.y,
        p2.x,p2.y)

  // stroke(0,0,200)
  // line(a2.x,a2.y,
  //     p2.x,p2.y)
}
function vecDiffLen(v1,v2)
{
  return p5.Vector.sub(v2,v1).mag();
}
function approxBezierLength(BezSeg)
{
    let a1,a2,p1,p2;
  a1=BezSeg.a1;
  p1=BezSeg.p1;
  p2=BezSeg.p2;
  a2=BezSeg.a2;
  //https://stackoverflow.com/questions/29438398/cheap-way-of-calculating-cubic-bezier-length
   let chordLen = vecDiffLen(p1,p2);
   let netLen = vecDiffLen(p1,a1) + vecDiffLen(a1,a2) + vecDiffLen(a2,p2);
  return (chordLen + netLen) / 2;
}


function curveSeg(mag, c, bezDist, curveType='rightAngle')
{

  let pStart = createVector(0,0)
  let pEnd = createVector(mag,0)

  switch (curveType)
    {
      case 'rightAngle':
          cStart = createVector(mag*c, -mag*c)
          cEnd = createVector( mag-mag*c, -mag*c)
        break;
      case 'quad':
        cStart = createVector(mag/2, -mag*c)
        cEnd = createVector( mag/2, -mag*c)
        break;

      case 'angle':
        let anchorLength = mag/4;
        let ang = -c*2*PI;
        let uv = createVector(anchorLength,0);
        let uvEnd = createVector(mag-anchorLength,0);

        cStart = uv.copy().rotate(ang)
        cEnd = uv.copy().rotate(PI-ang).add(createVector(mag,0));//uv.rotate(2*PI-c)
        // whiteCircle(cEnd)
        break;
      default:
        cStart = createVector(1,0) ;
        cEnd = createVector(-1,0);
        break;
    }




  return {p1:pStart, a1:cStart,a2:cEnd, p2:pEnd};

}
function drawArrowX(BezSeg, xColor=color(255,0,0),xSize=10)
{

    let bMid = bezierLerp(BezSeg, .5);
    drawX(bMid, xColor,xSize);

    //
    // line(bMid.x-10, bMid.y, bMid.x+10, bMid.y);
    // line(bMid.x, bMid.y-10, bMid.x,bMid.y+10);
}
function drawX(xPos=createVector(0,0), xColor=color(255,0,0),xSize=10)
{
    push()
    translate(xPos.x, xPos.y);
    noFill();
    stroke(xColor);
    line(-xSize, -xSize, xSize, xSize);
    line(xSize, -xSize, -xSize, xSize);
    pop()
}
function bezierArrowEnd(BezSeg, arrowLen)
{
    bezPerc = 1-arrowLen/approxBezierLength(BezSeg.p1,BezSeg.a1,BezSeg.a2,BezSeg.p2)
    let blp = bezierLerp(BezSeg.p1,BezSeg.a1,BezSeg.a2,BezSeg.p2, bezPerc)
    // circle(blp.x,blp.y,2)
    return BezSeg.p2.sub(blp);
}

function drawCurveArrow(base, vec, myColor=color(0), curveAmount=0.125, startRadius=0, endRadius=0) {

  let originalEndPoint = p5.Vector.add(base,vec);

  let arrowSize = min(15,vec.mag()/8);
  // curveAmount = 1-mouseY/height;

   let testBSeg = curveSeg(vec.mag(),curveAmount, arrowSize,'angle')

   let circleStartSeg = p5.Vector.sub(testBSeg.a1, testBSeg.p1).setMag(startRadius);
   let circleEndSeg = p5.Vector.sub(testBSeg.p2, testBSeg.a2).setMag(endRadius*1.2);
    circleStartSeg.rotate(vec.heading())
    circleEndSeg.rotate(vec.heading())

  let circleEndPoint=p5.Vector.sub(originalEndPoint,circleEndSeg);
  //p5.Vector.sub(originalEndPoint,circleEndSeg);




  //let startOff = p5.Vector.sub(BezSeg.a1, BezSeg.p1);

  // base.add(startOff)
  // vec.sub(circleEndSeg);
  // vec.sub(startOff)

  base.add(circleStartSeg)
  vec = p5.Vector.sub(circleEndPoint,base)
  BezSeg = curveSeg(vec.mag(), curveAmount, arrowSize,'angle')



  push();
  stroke(myColor);
  fill(myColor);

  translate(base.x, base.y);
  rotate(vec.heading());

  // circle(originalEndPoint.x, originalEndPoint.y,30)

  // line(0,0,vec.mag(),0);

  // push()
  // translate(vec.mag(),0)
  // rotate(circleEndSeg.heading())
  // translate(-endRadius,0)
  // stroke(100,0,0)
  // line(0,0,endRadius,0);
  // pop()

   noFill();

  // stroke(0)
    // bezierRender(testBSeg)


  bezierRender(BezSeg)
  //backtrack along the bezier curve 1 arrowLength's distance
  // let endSeg = bezierArrowEnd(BezSeg,arrowSize)

  let curveLen = approxBezierLength(BezSeg);
  let radiusPerc = endRadius / curveLen;
  let arrowPerc = arrowSize / curveLen;

  let arrowStart = bezierLerp(BezSeg, 1-arrowPerc*2) //*2 is a fudge-factor
  let arrowEnd = bezierLerp(BezSeg, 1)

  let arrowSeg = p5.Vector.sub(arrowEnd,arrowStart);
  //then use this to rotate the arrowhead


  stroke(myColor);
  fill(myColor);

  //translate(arrowStart.x, arrowStart.y)
  translate(arrowEnd.x,arrowEnd.y)
  rotate(arrowSeg.heading())

  // translate(vec.mag(),0)
  // rotate(endSeg.heading())
    translate(-arrowSize,0)
  triangle(0, arrowSize / 3, 0, -arrowSize / 3, arrowSize, 0);
  pop();
  return BezSeg;
}

function plotAroundCircle(r, anglePerc )
{
    xy = createVector(r*cos(anglePerc*2*PI), r*sin(anglePerc*2*PI),)
    return xy;
}

function drawController(x,y,r)
{
    let cr = 1.5*r;
    let ndiv = 4;
    let ccolor = color(0,255,255);
    let phase = .06*frameCount;

    dA = (2*PI / ndiv) * (1/10);

    push()
    translate(x,y)
    noFill()
    stroke(ccolor)
    strokeWeight(5)

    for (let i=1; i<ndiv+1; i++)
    {
        let a1 = 2*PI*(i-1)/ndiv + phase;
        let a2 = 2*PI*(i)/ndiv + phase;

        arc(0,0,2*cr,2*cr, a1+dA,a2-dA)
        xyPrev = xy;

    }
    pop();
}

// function dashedLine(v1, v2,dLen=5,spaceLen = 10)
// {
//
//     let dv = p5.Vector.sub(v2,v1);
//     let totalDist = dv.mag();
//     // console.log(totalDist)
//     let dvPiece = dv.copy();
//     dvPiece.setMag(dLen);
//
//
//     let nSeg = totalDist/dLen;
//
//
//     let d = 0;
//     let onOff = true;
//     push()
//     translate(v1.x,v1.y)
//     strokeWeight(2)
//     line(0,0,dv.x,dv.y)
//
//     pop();
// }

function drawBolt(x,y, L,W,n=3, a=PI/4,boltColor)
{
    boltColor = boltColor || color(255,255,0)
    //color(0,0,255)
    push()

    let dY = L/n;
    let dX = W/n;//10;//W/2;//W/n;
    let skewX = -1.5*W;


    translate(x - dX*(n-1) - skewX,  y-L)


    fill(boltColor)
    // noFill()
    strokeWeight(3)
    stroke(boltColor)
    beginShape()
    vertex(0,0) //A

    // let skewX;
    for (let i = 1; i<n; i++)
    {
        let sx = skewX*i/n;
        vertex((i-1)*dX +sx, i*dY) //B1
        vertex(i*dX +sx, i*dY) //B2
    }
    vertex((n-1)*dX + skewX, n*dY) //D - bottom point
    let yi;
    let hShiftPerc;
    for (let i = n-1; i>0; i--)
    {
        let sx = skewX*i/n;

        yi = (i*dY-dX)
        hShiftPerc = 1 - (yi/L);
        xShift = hShiftPerc*W + sx;
        // console.log(hShiftPerc)
        //

        vertex(     i*dX + xShift, yi)
        vertex( (i-1)*dX + xShift, yi)
    }
    vertex(W,0)
    vertex(0,0)
    endShape()

    pop()
}
// function circleSeg(x,y,r,a1,a2)
// {
//
// }
function whiteCircle(p)
{
  push()
  noFill()
  stroke(255)
  circle(p.x,p.y,10)
  pop()
}

function vline(v1, v2)
{
    line(v1.x, v1.y, v2.x, v2.y);
}
