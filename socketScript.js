var five = require("johnny-five");
//var express = require("express");
//var app = express();
//app.use(express.static(__dirname + '/public'));
var board = new five.Board();

var Cylon = require('cylon');


// var http = require("http");
// var url = require('url');
// var fs = require('fs');
// var io = require('socket.io');
var joints, ring, index, pinky, middle, thumb;

// var server = http.createServer(function(request, response){
//     var path = url.parse(request.url).pathname;

//     switch(path){
//         case '/':
//             response.writeHead(200, {'Content-Type': 'text/html'});
//             response.write('hello world');
//             response.end();
//             break;
//         case '/index.html':
//             fs.readFile(__dirname + "/Public" + path, function(error, data){
//                 if (error){
//                     response.writeHead(404);
//                     response.write("opps this doesn't exist - 404");
//                     response.end();
//                 }
//                 else{
//                     response.writeHead(200, {"Content-Type": "text/html"});
//                     response.write(data, "utf8");
//                     response.end();
//                 }
//             });
//             break;
//         case '/browser_script.js':
//             fs.readFile(__dirname + "/Public" + path, function(error, data){
//                 if (error){
//                     response.writeHead(404);
//                     response.write("opps this doesn't exist - 404");
//                     response.end();
//                 }
//                 else{
//                     response.writeHead(200, {"Content-Type": "text/html"});
//                     response.write(data, "utf8");
//                     response.end();
//                 }
//             });
//             break;
//         case '/style.css':
//             fs.readFile(__dirname + "/Public" + path, function(error, data){
//                 if (error){
//                     response.writeHead(404);
//                     response.write("opps this doesn't exist - 404");
//                     response.end();
//                 }
//                 else{
//                     response.writeHead(200, {"Content-Type": "text/html"});
//                     response.write(data, "utf8");
//                     response.end();
//                 }
//             });
//             break;
//         case '/bower_components':
//             fs.readFile(__dirname + "/Public" + path, function(error, data){
//                 if (error){
//                     response.writeHead(404);
//                     response.write("opps this doesn't exist - 404");
//                     response.end();
//                 }
//                 else{
//                     response.writeHead(200, {"Content-Type": "text/html"});
//                     response.write(data, "utf8");
//                     response.end();
//                 }
//             });
//             break;
//         default:
//             response.writeHead(404);
//             response.write("opps this doesn't exist - 404");
//             response.end();
//             break;
//     }
// });

// server.listen(8001);

// var listener = io.listen(server);
// listener.sockets.on('connection', function(socket){
//     setInterval(function(){
//         socket.emit('date', {'date': new Date()});
//     }, 1000);
//       socket.on('client_data', function(data){
//       stupid(data);
//   });
// });

// function stupid(data){
//   console.log(data);
// }

// board.on("ready", function() {



//   var thumb    = new five.Servo(24);
//   var index    = new five.Servo(22);
//   var middle   = new five.Servo(8);
//   var ring     = new five.Servo(10);
//   var pinky    = new five.Servo(12);
//   var elbow    = new five.Servo(30);
//   joints       = new five.Servos([thumb, index, middle, ring, pinky]);
//   console.log("fr");
//   joints.sweep();
//   //elbow.sweep();
//   //joints.max();

// });
var i = false;
var pi = false;
var extended = [false,false,false,false,false];

Cylon
  .robot()
  .connection("leapmotion", { adaptor: "leapmotion" })
  .device("leapmotion", { driver: "leapmotion" })
  .on("ready", function(bot) 
  {
    board.on("ready", function() {
      thumb    = new five.Servo(4);
      index    = new five.Servo(6);
      middle   = new five.Servo(8);
      ring     = new five.Servo(10);
      pinky    = new five.Servo(12);
      elbow    = new five.Servo(30);
      joints   = new five.Servos([thumb, index, middle, ring, pinky]);
      joints.sweep();
    });

    // bot.leapmotion.on("hand", function(hand) 
    // {
    //   var fingers = [hand.thumb.extended,
    //   hand.indexFinger.extended,
    //   hand.middleFinger.extended,
    //   hand.ringFinger.extended,
    //   hand.pinky.extended];

    //   for (var z = fingers.length - 1; z >= 0; z--) {
    //           if(fingers[z]){
    //             if (!extended[z]){
    //                 //index.max();
    //                 joints[z].max();
    //                 extended[z] = true;
    //             }
    //             //console.log("extended");
    //           }

    //           else if (!fingers[z]){
    //             if (extended[z]){
    //                 //index.min();
    //                 joints[z].min();
    //                 extended[z] = false;
    //             }
    //             //console.log("stopped");
    //           }
    //   };
     

      // if (fingers[4]){
      //   if(!pi){
      //       index.min();
      //       i = true;
      //   }
      // }

      // else if (!fingers[4]){
      //   if(pi){
      //       pinky.min();
      //       pi = false;
      //   }
      // }
      //currentAns = RPS(fingers);
      //console.log(currentAns)
    });
  // });

Cylon.start();
