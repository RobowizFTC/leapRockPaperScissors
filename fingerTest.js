var Cylon = require('cylon');

Cylon
	.robot()
	.connection("leapmotion", { adaptor: "leapmotion" })
	.device("leapmotion", { driver: "leapmotion" })
	.on("ready", function(bot) {
		var pointers = 0;
		bot.leapmotion.on("hand", function(hand) {
			for (item in hand.pointables) {
				// console.log(hand.pointables.length)
				if (item["extended"] == true) {
					pointers++;
				}
			}
			console.log(pointers);
		});
	});

Cylon.start()