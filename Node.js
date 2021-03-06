//to discourage rotation:

//threshold speed low end;

class Node {
  constructor(name, x = random(width), y = random(height), r = 25) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.r = r;
    this.vxy = createVector(0, 0);
    // this.nxy = createVector(0, 0);
    this.children = [];
    this.clicked = false;
    this.highlighted = false;
    this.isControlled = false;

    this.faceColor = color(255);
    this.faceColor2 = color(0,0,255);
    this.currentFaceColor = this.faceColor;

    this.currentValue = 0;
    this.values = [0];
    this.valueLen = 200;


    this.valueFun = function (t,i ) {
        // let s = sin(t / (2*PI));
        // let s = noise(t*i/100 + i*i*123); // works nicely
        let s = noise(( (t+i*123.4321+rseed)   /i)/5 );

        // s = (s>0) ? 1 : 0;
        // s = map(s,-1,1,0,1);
        // s = ((5/30)*s > random()) ? 0 : 1;
        return s;
    }

    // this.valueFun = function (t) {
    //     let s = sin(t / (2*PI));
    //     // s = (s>0) ? 1 : 0;
    //     s = map(s,-1,1,0,1);
    //     // s = ((5/30)*s > random()) ? 0 : 1;
    //     return s;
    // }
    // this.valueLen = 500;
  }
  xy() {
    return createVector(this.x, this.y);
  }
  addEdge(eNode) {
    this.children.push(eNode);
  }

  calcOutDegree()
  {
      return this.children.length;
  }

  pushVal(v=this.currentValue)
  {
      this.values.unshift(v);
      this.values = this.values.slice(0,this.valueLen);
  }

  accel(Axy) {
    this.vxy.add(Axy);
    this.vxy.setMag(constrain(this.vxy.mag(), -5, 5));
  }

  show(doShowEdges=true) {
    let borderColor, edgeColor, faceColor, textColor;
    if (this.highlighted) {
      borderColor = 0;
      edgeColor = 0;
      faceColor = this.faceColor2; //color(100,100,200);
      textColor = edgeColor;
    } else {
      let darkGray = color(50);
      borderColor = darkGray;
      edgeColor = color(red(borderColor), green(borderColor), blue(borderColor));
      // edgeColor.setAlpha(100);
      //
      //
//     adjMat

      // this.faceColor
      // faceColor = lerpColor(color(150),color(0,0,255), outScore);//255;
      // faceColor = color(inScore*255, 255, outScore*255)


      // colorMode(HSB, 1)
      // faceColor = this.values[0];
      // let r,g,b;
      // r = red(faceColor);
      // b = green(faceColor);
      // b = blue(faceColor);
      // colorMode(RGB,255);
      // faceColor = color(r,g,b);
      let cv = this.values[0]*255
      faceColor = color(cv,cv,cv);
      let degreeMax = 3;
      if (this.inDegree !== undefined)
      {

          let inScore = map(this.inDegree,0,degreeMax,0,1);
          let outScore = map(this.outDegree,0,degreeMax,0,1);

          // faceColor = color(inScore*255, 0, outScore*255)
          // faceColor = lerpColor(color(150), faceColor,
          //           map(this.inDegree+this.outDegree,0,degreeMax,0,1))

          //SCALE radius by degree
          // this.r = 2*(this.inDegree*this.outDegree)+25;
      }
      else
      {

      }
    textColor = darkGray;
    }
    this.borderColor = borderColor;
    this.edgeColor = edgeColor;
    this.currentFaceColor = faceColor;
    this.textColor = textColor;

    //noFill()
    strokeWeight(5);
    stroke(0);
    let arrowCurve = 0.125; //0.125
    (sin(frameCount/10))/12; //0.125

    if (doShowEdges)
    {
        this.children.forEach((c) => {
          let dv = c.xy().sub(this.xy());
          let dvStart = dv.copy();
          dvStart.setMag(0);

          // dvStart.setMag(this.r)
          // dv.setMag(dv.mag()-this.r*2)
          // dv = dv.add(dvStart)

          //draw self-connection
          if (this.xy().equals(c.xy()))
          {
              noFill();
              stroke(edgeColor);
              circle(this.x, this.y, this.r*1.5);
          }
          else
          {
              let arrowBase = this.xy().add(dvStart);
              let bezSeg = drawCurveArrow(
                arrowBase,
                dv,
                edgeColor,
                arrowCurve,

                this.r,
                c.r
              );

              // translate(dvStart);
              // translate(width/2, height/2)
              if (c.isControlled)
              {
                  push()
                  translate(arrowBase);
                  rotate(dv.heading())
                  drawArrowX(bezSeg);
                  pop()
              }
          }

          // drawArrow(this.xy(), dvStart,200)
        });
    }


    stroke(borderColor);
    fill(this.currentFaceColor);//faceColor);
    circle(this.x, this.y, this.r);

    strokeWeight(1);
    stroke(textColor);
    fill(textColor);
    text(this.name, this.x, this.y);
  }

  select(x, y, justCheck=false) {
      let isOverlapped = (dist(this.x, this.y, x, y) < this.r);
      if (justCheck)
      {
          // console.log(dist(this.x, this.y, x, y) - this.r)
          // if (isOverlapped) { this.clicked=true;}
          this.clicked=isOverlapped;
          return isOverlapped;
      }

    if (isOverlapped){
      this.highlighted = true;
      this.clicked = true;
      this.highlightChildren(nodes.length);
      // console.log(this.name+' was clicked')
    } else {
      this.clicked = false;
      this.highlighted=false;
    }
    return this.highlighted;
  }
  highlightChildren(depth) {
      let propogationDelay = 300;

    if (depth < 0) {
      // console.log("done-" + depth);
      return;
    }
    // console.log("." + depth);

    if (this.highlighted) {
      this.currentFaceColor = lerpColor(
        color(0, 0, 255),
        color(240, 240, 255),
        ((nodes.length - depth)) / nodes.length
      );

      this.children.forEach((c) => {
        if (!c.highlighted) {
          setTimeout(() => {
            c.highlighted = true;
            c.highlightChildren(depth - 1);
            // c.faceColor = color(0,0,255)
            // console.log(this.name + c.name);
        }, propogationDelay);
        }
        // else {
        //   console.log('cutting short')
        // }
      });
    }
  }

  teleport(x, y) {
    this.x = x;
    this.y = y;
  }
  dmove(dx,dy)
  {
      // console.log(dx)
      this.x += dx;
      this.y += dy;
  }
  move() {
    let slow = 0.7; //.9
    this.vxy.setMag(constrain(this.vxy.mag() * (1 - slow), -50, 50));
    if (abs(this.vxy.mag()) < 0.5) {
      this.vxy.setMag(0);
    }

    this.x += this.vxy.x;
    this.y += this.vxy.y;
  }

  force() {
    let forceSep = 8; //3 is cozy, 5-10 is spacious
    let attractAccel = 0.02;
    let repelAccel = 0.6 / nodes.length;

    //attract to within a radius of center
    let dc = p5.Vector.sub(center, this.xy());
    let targDist = 100;
    // dc.setMag(  -0.00001* dc.mag());
    if (dc.mag() > targDist)
    {
      // this.accel(dc.setMag(dc.mag()-targDist))
      let centForce = dc.setMag(dc.mag() * 2); //setMag(.5);//dc.setMag(-dc.mag()*100
      this.accel(dc);
      // push()
      // translate(this.xy().x,this.xy().y)
      // line(0,0,dc.x,dc.y)
      // pop()
    }

    //attract to descendants
    this.children.forEach((c) => {
      let dv = p5.Vector.sub(c.xy(), this.xy());
      let targDist = forceSep * (this.r + c.r);
      dv.setMag(attractAccel * (dv.mag() - targDist));
      this.accel(dv);
    });

    //repel from all
    nodes.forEach((n) => {
      let dv = p5.Vector.sub(n.xy(), this.xy());
      let targDist = forceSep * (this.r + n.r);
      dv.setMag(repelAccel * constrain(dv.mag() - targDist, -999999, 0));

      this.accel(dv);
    });
    this.move();
  }
}

// end of class definition


// function name2index(nameStr)
// {
//
// }
