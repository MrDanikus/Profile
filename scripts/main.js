

function setup(){    
    var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    createCanvas(window.innerWidth,height - window.innerHeight);

    //Canvas.canvas.style.backgroundImage = `url(https://picsum.photos/${Canvas.width}/${Canvas.height})`;
    for(let i = 0; i < MaxPoints;++i){
        generatePoint();
    }


    for(let i in Points){
        let p = Points[i];
        p.x = Random(0,Canvas.width);
        p.y = Random(0,Canvas.height);
    }
}


function draw(){
    if(!Canvas.canvas) return;
    let ctx = Canvas.context;
    
    stroke(0,0,0,255);

    ctx.clearRect(0,0,Canvas.width,Canvas.height);
    let point;

    for(let i = Object.keys(Points).length; i < MaxPoints; ++i){
        generatePoint();
    }


    let set = [];
    let left = Infinity,right = -Infinity,top = -Infinity,down = Infinity;

    for(let i in Points){
        let point = Points[i];
        
        point.x += Math.cos(point.angle)*Time.deltaTime*point.speed;
        point.y -= Math.sin(point.angle)*Time.deltaTime*point.speed;

        left = Math.min(left,point.x);
        right = Math.max(right,point.x);
        top = Math.max(top,point.y);
        down = Math.min(down,point.y);

        set.push({x:point.x,y:point.y,id:point.id});
    }

    let tree = BuildKDTree(set,{x:left,y:top,width: right - left,height: top - down});

    const map = new Map();

    let idToDelete = [];
    for(let i in Points){
        
        point = Points[i];

        let checkPoint = function(p){
            if(p.x > Canvas.width+10 || p.x < -10 || p.y > Canvas.height + 10 || p.y < -10){
                return true;
            }
        }

        if(checkPoint(point) && checkPoint({x:point.x + Math.cos(point.angle)*(MaxDist+20),y:point.y - Math.sin(point.angle)*(MaxDist+20)})){
            idToDelete.push(i);
        }


        

        for(let j of InRadius(point,MaxDist,tree)){
            if(j.id == point.id) continue;


            //console.log(map.get(`${Math.min(j.id,point.id)}-${Math.min(j.id,point.id)}`));

            if(map.get(`${Math.min(j.id,point.id)}-${Math.max(j.id,point.id)}`) != undefined) continue;

            map.set(`${Math.min(j.id,point.id)}-${Math.max(j.id,point.id)}`,true);
            let a = j;
            let d = Math.sqrt((point.x - a.x)*(point.x - a.x) + (point.y - a.y)*(point.y - a.y));
            


            strokeWidth((1.-d/MaxDist) * 1.5);
            line(a.x,a.y,point.x,point.y);

        }


        fill(0,0,0,255);
        strokeWidth(0);
        //strokeWidth(point.radius*1);
        circle(point.x,point.y,point.radius);
    }

    for(let i of idToDelete){
        delete Points[i];
    }
}

window.onresize = () =>{
    var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    resizeCanvas(window.innerWidth,height - window.innerHeight);
    //Canvas.canvas.style.backgroundImage = `url(https://picsum.photos/${Canvas.width}/${Canvas.height})`;
    MaxPoints = Math.floor(Canvas.width*Canvas.height/11000);
}


