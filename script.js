var count = 3;
var Cylon = require('cylon');
var five = require("johnny-five");
var board = new five.Board();
var ready = false;
var currentAns = "";
console.log("ffff");
//Cylon setup
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
			currentAns = RPS(fingers);
			console.log(currentAns)
			console.log("ay");
		});
	});

Cylon.start()
board.on("ready", function() {



  var thumb = new five.Servo(4);
  var index = new five.Servo(6);
  var middle = new five.Servo(8);
  var ring = new five.Servo(10);
  var pinky = new five.Servo(12);
  var elbow = new five.Servo(2);
  var joints = new five.Servos([thumb, index, middle, ring, pinky]);
  joints.sweep();
  elbow.sweep();
  //joints.max();

});



extend = 0;
retract = 180;

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

//activated by start button, changes state of website to be replayable
function setupGame(){
	$("#start").html("Play Again");
	//start timer
	count = 3;
	var myVar = setInterval(myTimer, 1000);

	//setName
	var name = $("#nameIn").val();
	$("#nameTitle").html(name + ":");
}

function startGame(){
	console.log("r: " + r);
	winner = "";
	var cur = "0";

	//choose random value and compare with player's
	switch(Math.floor(Math.random() * 3)){
	
		case 0:
			winner = compare("scissors", currentAns); 
			break;
		case 1:
			winner = compare("rock", currentAns); 
			break;
		case 2:
			winner = compare("paper", currentAns); 
			break;
	}

	console.log("winner: " + winner)

	//increment based on result
	switch(winner){
		case "p1":
			cur = $("#nScore").html();
			$("#nScore").html(parseInt(cur)+1); 
			break;
		case "p2":
			cur = $("#jScore").html();
			$("#jScore").html(parseInt(cur)+1); 
			break;
		case "tie":
			cur = $("#tScore").html();
			$("#tScore").html(parseInt(cur)+1); 
			break;

	}
}

//timer function, starts game after 3 seconds
function myTimer() {
	if(count > 0){
		$("#countdown").html(""+count);
		count--;
	}
	else if (count == 0){
		window.clearInterval(myTimer);
		$("#countdown").html("Go!");
		startGame();
		
	}
}

//compare method, returns winner
function compare(p1, p2){
	if (p1 === p2)
		return "tie"
	if (p1 === "scissors" && p2 === "rock")
		return "p2";
	if (p1 === "rock" && p2 === "scissors")
		return "p1";
	if (p1 === "paper" && p2 === "scissors")
		return "p2";
	if (p1 === "scissors" && p2 === "paper")
		return "p1";
	if (p1 === "rock" && p2 === "paper")
		return "p2";
	if (p1 === "paper" && p2 === "rock")
		return "p1";
}
//checks what kind of symbol in hands
function RPS(fingers){
	var ans = ""
	if (fingers[0] && fingers[1] && fingers[2] && fingers[3] && fingers[4])
		ans = "paper";
	if (fingers[1] && fingers[2] && !fingers[0] && !fingers[3] && !fingers[4])
		ans = "scissors";
	else
		ans = "rock";

	return ans;
}




