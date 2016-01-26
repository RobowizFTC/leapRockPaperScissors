var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {



  var thumb = new five.Servo(9);
  var index = new five.Servo(10);
  var middle = new five.Servo(11);
  var ring = new five.Servo(12);
  var pinky = new five.Servo(13);

var joints = new five.Servos([thumb, index, middle, ring, pinky]);

  // move servos independently

  // Center all servos.
  joints.center();

});
extend = 0;
retract = 0;

function rock(joints){
	joints.to(retract);
}
function rock(joints){
	joints.to(extend);
}
function scissors(joints){
	thumb.to(retract);
	index.to(extend);
	middle.to(extend);
	ring.to(retract);
	pinky.to(retract);
}
