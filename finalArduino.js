var fs = require("fs");
var five = require("johnny-five");
var board = new five.Board();
var fileName = "jarvisMove.txt";
var data = ""
var joints, thumb, index, middle, ring, pinky, elbow;

board.on("ready", function() {

  thumb = new five.Servo(12);
  index = new five.Servo(4);
  middle = new five.Servo(6);
  ring = new five.Servo(10);
  pinky = new five.Servo(8);
  elbow = new five.Servo(30);
  joints = new five.Servos([thumb, index, middle, ring, pinky]);
  var led = new five.Led(13);
  joints.max();
  //joints.sweep();
  //elbow.sweep();
  //joints.max();

});

fs.watchFile(fileName,{ persistent: true, interval: 100 }, (curr, prev) => {

fs.exists(fileName, function(exists) {
  console.log(fileName);
  if (exists) {
    fs.stat(fileName, function(error, stats) {
      fs.open(fileName, "r+", function(error, fd) {
        var buffer = new Buffer(stats.size);

        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
          data = buffer.toString("utf8", 0, buffer.length);
          printdata();
          if(data === 'rock'){
          	//joints.sweep();
          	rock();
          }
          else if(data === 'paper'){
          	//joints.sweep();
          	paper();
          }
          else if(data === 'scissors'){
          	//joints.sweep();
          	scissors();
          }
        fs.close(fd);  
        });
      
      });


    });
    
  }

}); });

function printdata(){
	console.log(data);
	console.log("ay");
}

extend = 0;
retract = 180;

function rock(){
	joints.min();
	console.log("rock");
}
function paper(){
	joints.max();
	console.log("paper");
}
function scissors(){
	index.max();
	middle.max();
	ring.min();
	pinky.min();
	thumb.min();
	console.log("scissors");
}