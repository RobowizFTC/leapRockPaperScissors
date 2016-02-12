"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    leap: { adaptor: "leapmotion" },
    arduino: { adaptor: "firmata", port: "/dev/tty.usbmodem1421" }
  },

  devices: {
    led: { driver: "led", pin: 13, connection: "arduino" },
    leapmotion: {driver: "leapmotion", connection: "leap"}
  },

  work: function(my) {
    my.leapmotion.on("frame", function(frame) {
      if (frame.hands.length > 0) {
        my.led.turnOn();
      } else {
        my.led.turnOff();
      }
    });
  }
}).start();