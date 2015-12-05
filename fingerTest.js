var Cylon = require('cylon');

Cylon
	.robot()
	.connection("leapmotion", { adaptor: "leapmotion" })
	.device("leapmotion", { driver: "leapmotion" })
	.on("ready", function(bot) 
	{
		bot.leapmotion.on("hand", function(hand) 
		{
			var fingers = [hand.thumb.extended,
			hand.indexFinger.extended,
			hand.middleFinger.extended,
			hand.ringFinger.extended,
			hand.pinky.extended];
			console.log(RPS(fingers));
		});
	});

Cylon.start()

function RPS(fingers){
	if (fingers[1] && fingers[2] && !fingers[0] && !fingers[3] && !fingers[4])
		return "scissors";
	if (fingers[0] && fingers[1] && fingers[2] && fingers[3] && fingers[4])
		return "paper";
	else
		return "rock";
}

function compare(p1, p2){
	if (p1 === p2):
		return "tie"
	if (p1 === "scissors" && p2 === "rock")
		return p2;
	if (p1 === "rock" && p2 === "scissors")
		return p1;
	if (p1 === "paper" && p2 === "scissors")
		return p2;
	if (p1 === "scissors" && p2 === "paper")
		return p1;
	if (p1 === "rock" && p2 === "paper")
		return p2;
	if (p1 === "paper" && p2 === "rock")
		return p1;
}