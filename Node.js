//to discourage rotation:

//threshold speed low end;

class Node {
  constructor(name, x = random(width), y = random(height), r = 25) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.r = r;
    this.vxy = createVector(0, 0);
    this.children = [];
    this.clicked = false;
    this.highlighted = false;
    this.faceColor = color(255);
    this.faceColor2 = color(0,0,255);
    this.currentFaceColor = this.faceColor;
  }
  xy() {
    return createVector(this.x, this.y);
  }
  addEdge(eNode) {
    this.children.push(eNode);
  }
  accel(Axy) {
    this.vxy.add(Axy);
    this.vxy.setMag(constrain(this.vxy.mag(), -5, 5));
  }

  show() {
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
      faceColor = this.faceColor;//255;
      textColor = darkGray;
    }
    this.borderColor = borderColor;
    this.edgeColor = edgeColor;
    this.currentFaceColor = faceColor;
    this.textColor = textColor;

    //noFill()
    strokeWeight(5);
    stroke(0);
    let arrowCurve = 0.125

    this.children.forEach((c) => {
      let dv = c.xy().sub(this.xy());
      let dvStart = dv.copy();
      dvStart.setMag(0);

      // dvStart.setMag(this.r)
      // dv.setMag(dv.mag()-this.r*2)
      // dv = dv.add(dvStart)


      if (this.xy().equals(c.xy()))
      {
          noFill();
          stroke(edgeColor);
          circle(this.x, this.y, this.r*1.5);
      }
      else
      {
          drawCurveArrow(
            this.xy().add(dvStart),
            dv,
            edgeColor,
            arrowCurve,
            //(sin(frameCount/10))/12,
            this.r,
            c.r
          );
      }

      // drawArrow(this.xy(), dvStart,200)
    });

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
