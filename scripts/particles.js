
class Point{
    constructor(_x,_y,_angle,_speed){
        if(!Point._id){
            Point._id = 0;
        }
        this.id = Point._id++;
        this.x = _x;
        this.y = _y;
        this.angle = _angle;
        this.speed = _speed;
        this.time = performance.now();
        this.radius = Random(2,4);
    }
}

let mouseX = 0,mouseY = 0;





const Random = (start,end) => {
    return start + Math.random()*(end - start);
}

const fill = (r,g,b,a = 1) => {
    let ctx = Canvas.context;
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
}

const stroke = (r,g,b,a = 1) => {
    let ctx = Canvas.context;
    ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
}

const strokeWidth = (w) => {
    let ctx = Canvas.context;
    ctx.lineWidth = w;
}

const circle = (x,y,r) => {
    let ctx = Canvas.context;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

const line = (x1,y1,x2,y2) =>{
    let ctx = Canvas.context;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}


function fps(){
    return 1./Time.deltaTime;
}



const Points = {};
const Canvas = {};
let MaxPoints = 100;
const Speed = 100;
const Radius = 120;
const EstimatedFPS = 35;
const MaxDist = 160;
const Time = {
    deltaTime:1./EstimatedFPS
}


function createCanvas(_width,_height){
    Canvas.width = _width;
    Canvas.height = _height;
    Canvas.canvas = document.createElement('canvas');
    document.body.append(Canvas.canvas);
    Canvas.canvas.width = _width;
    Canvas.canvas.height = _height;
    Canvas.context = Canvas.canvas.getContext("2d");
    MaxPoints = Math.floor(Canvas.width*Canvas.height/15000);
}


function resizeCanvas(_width,_height){
    Canvas.width = _width;
    Canvas.height = _height;
    Canvas.canvas.width = _width;
    Canvas.canvas.height = _height;
    MaxPoints = Math.floor(Canvas.width*Canvas.height/15000);
}

function generatePoint(){
    let edge = Math.floor(Math.random()*4);

    /**
     * 0 - top
     * 1 - right
     * 2 - bottom
     * 3 - left
     */

    let x,y; 
    let p;
    if(edge == 0){
        y = -10;
        x = Math.random()*Canvas.width;
        p = new Point(x,y,Random(Math.PI,2*Math.PI),Random(Speed - Speed*0.2,Speed + Speed*0.2))
    }else if(edge == 1){
        x = Canvas.width + 10;
        y = Math.random()*Canvas.height;
        p = new Point(x,y,Random(Math.PI*0.5,1.5*Math.PI),Random(Speed - Speed*0.2,Speed + Speed*0.2))
    }else if(edge == 2){
        y = Canvas.height + 10;
        x = Math.random()*Canvas.width;
        p = new Point(x,y,Random(0,Math.PI),Random(Speed - Speed*0.2,Speed + Speed*0.2))
    }else{
        x = -10;
        y = Math.random()*Canvas.height;
        p = new Point(x,y,Random(-0.5*Math.PI,0.5*Math.PI),Random(Speed - Speed*0.2,Speed + Speed*0.2))
    }
    
    Points[p.id] = p;
}










 function interval(duration, fn){
    this.baseline = undefined
    
    this.run = function(){
      if(this.baseline === undefined){
        this.baseline = performance.now()
      }
      fn()
      var end = performance.now()
      this.baseline += duration
   
      var nextTick = duration - (end - this.baseline)
      if(nextTick<0){
        nextTick = 0
      }
      (function(i){
          i.timer = setTimeout(function(){
          i.run(end)
        }, nextTick)
      }(this))
    }
  
  this.stop = function(){
     clearTimeout(this.timer)
   }
  }


  let last = performance.now();
  let _start = false;
  var MainLoop = new interval(1000./EstimatedFPS, function(){
    if(!_start && window.setup){
      setup();
      _start = true;
      jQuery(function($) {
      var x,y;
      $("canvas").mousemove(function(event) {
        var offset = $(this).offset();
        x = event.pageX- offset.left;
        y = event.pageY- offset.top;
        mouseX = x;
        mouseY = y;
       // $("#div1").html("(X: "+x+", Y: "+y+")");
    });
});
    }
    Time.deltaTime = (performance.now() - last)*0.001;
    last = performance.now();
    if(window.draw)
      draw();


  })
  MainLoop.run()