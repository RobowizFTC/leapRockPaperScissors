// var Cylon = require('cylon');

// Cylon.robot({
// 	connections:{
// 		arduino: {adaptor: 'firmata', port: '/dev/tty.usbmodem1411'}
// 	},

// 	devices: {
//     	servo: {driver: 'continuous-servo', pin:3}
//   },

//   work: function(my) {
//     	var clockwise = true;

//     	my.servo.clockwise();

//     	every((1).second(), function() {
//       	if (clockwise) {
//         	my.servo.counterClockwise();
//         	clockwise = false;
//       	} else {
//         	my.servo.clockwise();
//         	clockwise = true;
//       	}
//     });
//   	}
//   }

// }).start()
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 }
  },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();