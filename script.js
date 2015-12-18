var count = 3;
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
			var temp = RPS(fingers);
			var currentAns = RPS(fingers);
			console.log(RPS(fingers));
		});
	});

Cylon.start()

function startGame(){
	$("#start").html("Play Again");
	document.getElementById("start").setAttribute("onClick", "pAgain()");
	var myVar = setInterval(myTimer, 1000);
	$.getScript("fingerTest.js", function(){
		console.log("asdf");
	});
	doTurn();
}

function doTurn(){
	var r =  Math.floor(Math.random() * 3);
	winner = "";
	if (r==0){
		winner = compare("scissors", currentAns, "J", "N");
	}

	else if (r == 1){
		winner = compare("rock", currentAns, "J", "N");
	}
	else{
		winner = compare("paper", currentAns, "J", "N");
	}

	if (winner == "J"){
		cur = $("#jScore").html();
		$("#jScore").html(parseInt(cur) + 1);
	}

	else if (winner == "tie"){
		cur = $("#tScore").html();
		$("#tScore").html(parseInt(cur) + 1);
	}
}

function pAgain(){
	var myVar = setInterval(myTimer, 1000);
	doTurn();
}

function reset(){
	location.reload();
}

function myTimer() {
	console.log(count);
	if(count > 0){
		$("#countdown").html(""+count);
		count--;
	}
	else{
		$("#countdown").html("Go!");
	}
}

function compare(p1, p2, player1, player2){
	if (p1 === p2)
		return "tie"
	if (p1 === "scissors" && p2 === "rock")
		return player2;
	if (p1 === "rock" && p2 === "scissors")
		return player1;
	if (p1 === "paper" && p2 === "scissors")
		return player2;
	if (p1 === "scissors" && p2 === "paper")
		return player1;
	if (p1 === "rock" && p2 === "paper")
		return player2;
	if (p1 === "paper" && p2 === "rock")
		return player1;
}

function RPS(fingers){
	var ans = ""
	if (fingers[0] && fingers[1] && fingers[2] && fingers[3] && fingers[4])
		ans = "paper";
	if (!fingers[1] && !fingers[2] && !fingers[0] && !fingers[3] && !fingers[4])
		ans = "rock";
	else
		ans = "scissors";

	document.getElementById("countdown").innerHTML = ans;

	return ans;
}




