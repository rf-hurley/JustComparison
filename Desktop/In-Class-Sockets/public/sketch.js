const socket = io.connect();

socket.on('connect', () => {
    console.log('client connected')
})


let env, osc;
let myCircle;

let otherCircles = [];
socket.on('heartbeat', (data) => {

    otherCircles = [];

   data.forEach(item => {
       if(item.id != socket.id){
           otherCircles.push(item);
       }
   })    
})


function setup(){
    createCanvas(600, 600);
    
    env = new p5.Envelope(0.01, 0.7, 0.3, 0.0);
    osc = new p5.Oscillator('sine');
    osc.start();
    osc.amp(0);


    // const myCircleOpts = {
    //     x: random(150, width-150),
    //     y: random(150, height-150),
    //     size: random(20,40),
    //     col: [random(255), random(255), random(255)],
    // }

    const myCircleOpts = {
        x: 100,
        y: random(150, height-150),
        size: random(20,40),
        col: [random(255), random(255), random(255)],
    }


    myCircle = new SoundCircle(1, myCircleOpts.x, myCircleOpts.y, myCircleOpts.size, myCircleOpts.col);
    
    const data = {
        x: myCircle.pos.x,
        y: myCircle.pos.y,
        size: myCircle.size,
        col: myCircle.col,
        clicked: myCircle.clicked,
    }

    socket.emit('start', data);

}

function draw(){
    background(120,90,200);


    myCircle.move();
    myCircle.checkEdges();
    myCircle.display();

    const data = {
        x: myCircle.pos.x,
        y: myCircle.pos.y,
        size: myCircle.size,
        col: myCircle.col,
        clicked: myCircle.clicked,
    }

    socket.emit('update', data);
    otherCircles.forEach(circle => {
        displayCircle(circle);
    })
}

const playSound = (freq) => {
    console.log('playing sound');

}
function displayCircle(circle){
    const { x, y, size, col, clicked} = circle;
    fill(col);
    stroke(220, 200, 220);
    const ellipseStroke = clicked ? 9 : 3;
    strokeWeight(ellipseStroke);
    ellipse(x, y, size);
}

function mousePressed(){
    const playSound = myCircle.checkClick(mouseX, mouseY);
    if(playSound){
        console.log(playSound);
        const freq = myCircle.size * 10;
        osc.freq(freq);
        env.play(osc);
    }
}

function mouseReleased(){
    if(myCircle.clicked){
        myCircle.setSpeed(mouseX, mouseY);
    }  
    myCircle.clicked = false;
}


