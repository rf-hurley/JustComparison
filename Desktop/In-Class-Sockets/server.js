const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const  io = require('socket.io')(http);

let circles = [];

class Circle {
    constructor(id, x, y, size, col, clicked, freq){
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.col = col;
        this.clicked = clicked;

    }
}

setInterval(heartbeat, 33);

function heartbeat(){
    io.sockets.emit('heartbeat', circles)
}

io.on('connection', function(socket){
    console.log('client connected, new player id is:' + socket.id);

 socket.on('start', (data) => {
     const circle = new Circle(socket.id, data.x, data.y, data.size, data.col, data.clicked, data.freq)
     // console.log(data);
     circles.push(circle);
 });

 socket.on('update', (data) => {
    circles.forEach((circle, i) => {
        if(circle => circle.id == socket.id){
             circles[i] = data;
        };
     })
 });

 socket.on('disconnect', function() {
     console.log("Client has disconnected");
     console.log(circles);
     newCircles = circles.filter(circle => circle.id != socket.id);
     circles = newCircles;
     console.log(circles)
   });

})

app.use('/', express.static(__dirname + '/public'));

http.listen(process.env.PORT || 7000);


console.log('server is running on port:7000');