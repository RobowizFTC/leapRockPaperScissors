var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var servo = new five.Servo(11);
  this.repl.inject({
    servo: servo
  });

  // Sweep from 0-180 and repeat.
  servo.sweep();
});