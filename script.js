var count = 3;
var Cylon = require('cylon');
var five = require("johnny-five");
var board = new five.Board();
var ready = false;
var currentAns = "";
var fingers = [];
var thumb, index, middle, ring, pinky, elbow, joints;

console.log("ffff");
//Cylon setup
// Cylon
// 	.robot()
// 	.connection("leapmotion", { adaptor: "leapmotion" })
// 	.device("leapmotion", { driver: "leapmotion" })
// 	.on("ready", function(bot) 
// 	{
// 		bot.leapmotion.on("hand", function(hand) 
// 		{
// 			fingers = [hand.thumb.extended,
// 			hand.indexFinger.extended,
// 			hand.middleFinger.extended,
// 			hand.ringFinger.extended,
// 			hand.pinky.extended];
// 			//currentAns = RPS(fingers);
			
// 		});
// 	});

// Cylon.start()
board.on("ready", function() {



  thumb = new five.Servo(24);
  index = new five.Servo(22);
  middle = new five.Servo(8);
  ring = new five.Servo(10);
  pinky = new five.Servo(12);
  elbow = new five.Servo(30);
  joints = new five.Servos([thumb, index, middle, ring, pinky]);

  // this.loop(500, function() {
  //   console.log(fingers);
  //   for (var i = joints.length - 1; i >= 0; i--) {
  //   	if(fingers[i]){
  //   	joints[i].max();	
  //   	}
  //   	else if(fingers[i] == false){
  //   	joints[i].min();
  //   	} 	
  //   };
  // });
	//joints.to(170, 1000)
	//joints.to(10, 1000)
	//joints.sweep([40,100]);


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
  myVar = setInterval(myTimer, 500);

	//setName
	// var name = $("#nameIn").val();
	// $("#nameTitle").html(name + ":");
}



function startGame(){
	winner = "";
	var cur = "0";
  value = currentAns
	//choose random value and compare with player's
  switch(Math.floor(Math.random() * 3)){
		case 0:
			jarvisMove = "scissors";
			console.log('scissors');
			index.max();
			break;
		case 1:
			jarvisMove = "rock";
			console.log("rock"); 
			index.min();
			break;
		case 2:
			jarvisMove = "paper"; 
			console.log("paper");
			index.max();
			break;
	}
  winner = compare(jarvisMove, value);
  $("#jMove").html(jarvisMove);
  $("#nMove").html(value);

	console.log("winner: " + winner)

	//increment based on result
	switch(winner){
		case "p1":
			cur = $("#jScore").html();
      console.log(cur);
			$("#jScore").html(parseInt(cur)+1); 
			break;
		case "p2":
			cur = $("#nScore").html();
      console.log(cur);
			$("#nScore").html(parseInt(cur)+1); 
			break;
		case "tie":
			cur = $("#tScore").html();
      console.log(cur);
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
		window.clearInterval(myVar);
		$("#countdown").html("Go!");
		$("#start").prop("disabled",false);
    startGame();
		
	}
}

//compare method, returns winner
function compare(p1, p2){
	console.log(p1, p2);
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
	var ans = "undefined"
	if (fingers[0] && fingers[1] && fingers[2] && fingers[3] && fingers[4])
		ans = "paper";
	else if (fingers[1] && fingers[2] && !fingers[0] && !fingers[3] && !fingers[4])
		ans = "scissors";
	else if(!fingers[0] && !fingers[1] && !fingers[2] && !fingers[3] && !fingers[4])
		ans = "rock";

	return ans;
}


// $(document).ready(function() {
//     $("#start").click(function(){
//       setupGame();
//       $("#start").prop("disabled",true);
//       }  
//     ); 
//     $("#reset").click(function(){
//         location = location;
//     }); 

// });





