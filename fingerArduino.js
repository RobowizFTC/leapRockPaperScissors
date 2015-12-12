var Cylon = require('cylon');

Cylon.robot({
	connections:{
		leap: {adaptor: 'leapmotion'},
		arduino: {adaptor: 'firmata', port: '/dev/tty.usbmodem1421'}
	},

	devices: {
    	servo: {driver: 'continuous-servo', pin:3}
  },

  work: function(my) {
    	var clockwise = true;

    	my.servo.clockwise();

    	every((1).second(), function() {
      	if (clockwise) {
        	my.servo.counterClockwise();
        	clockwise = false;
      	} else {
        	my.servo.clockwise();
        	clockwise = true;
      	}
    });
  	}
  }

}).start()