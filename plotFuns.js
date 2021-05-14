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

function bezierArrowEnd(BezSeg, arrowLen)
{
    bezPerc = 1-arrowLen/approxBezierLength(BezSeg.p1,BezSeg.a1,BezSeg.a2,BezSeg.p2) 
    let blp = bezierLerp(BezSeg.p1,BezSeg.a1,BezSeg.a2,BezSeg.p2, bezPerc)
    // circle(blp.x,blp.y,2)
    return BezSeg.p2.sub(blp);
}

function drawCurveArrow(base, vec, myColor, curveAmount=100, startRadius=25, endRadius=25) {
  
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
  
}


function whiteCircle(p)
{
  push()
  noFill()
  stroke(255)
  circle(p.x,p.y,10)
  pop()
}