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

//Tone.js sketch starts here


let clickedState = 0;

const button = document.getElementById("button");
button.addEventListener('click', changeClickFunction);

function changeClickFunction() {
    console.log(clickedState);
    if(clickedState == 0) {
        clickZero();
        clickedState = 1;
    } else if(clickedState == 1){ 
        clickOne();
        clickedState = 2;
    } else if(clickedState == 2){ 
        clickTwo();
        clickedState = 0;
    }
}

function clickZero() {
    const crusher = new Tone.BitCrusher(4).toDestination();
    const synth = new Tone.Synth().connect(crusher);
    synth.triggerAttackRelease("C2", 2);    
}

function clickOne() {
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth().toDestination();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("C4", "8n");
}

function clickTwo() {
    // create a new cheby
    const cheby = new Tone.Chebyshev(20).toDestination();
    // create a monosynth connected to our cheby
    const synth = new Tone.MonoSynth().connect(cheby);
    synth.triggerAttackRelease("C2", "8n");
}