require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var count = 3;
var Cylon = require('cylon');
var ready = false;
var currentAns = "";
var myVar;
console.log(document.getElementById("start"));
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
			
      //document.getElementById("countdown").innerHTML = currentAns;

		});
	});

Cylon.start()

setupGame()


//activated by start button, changes state of website to be replayable
function setupGame(){
	$("#start").html("Play Again");
	//start timer
	count = 3;
  myVar = setInterval(myTimer, 1000);

	//setName
	var name = $("#nameIn").val();
	$("#nameTitle").html(name + ":");
}

function startGame(){
	winner = "";
	var cur = "0";
  value = currentAns
	//choose random value and compare with player's
  switch(Math.floor(Math.random() * 3)){
	
		case 0:
			winner = compare("scissors", value); 
			break;
		case 1:
			winner = compare("rock", value); 
			break;
		case 2:
			winner = compare("paper", value); 
			break;
	}

	console.log("winner: " + winner)

	//increment based on result
	switch(winner){
		case "p1":
			cur = $("#jScore").html();
			$("#jScore").html(parseInt(cur)+1); 
			break;
		case "p2":
			cur = $("#nScore").html();
			$("#nScore").html(parseInt(cur)+1); 
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
		window.clearInterval(myVar);
		$("#countdown").html("Go!");
		
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
	var ans = ""
	if (fingers[0] && fingers[1] && fingers[2] && fingers[3] && fingers[4])
		ans = "paper";
	else if (fingers[1] && fingers[2] && !fingers[0] && !fingers[3] && !fingers[4])
		ans = "scissors";
	else if(!fingers[0] && !fingers[1] && !fingers[2] && !fingers[3] && !fingers[4])
		ans = "rock";

	return ans;
}





},{"cylon":27}],2:[function(require,module,exports){
/*
 * cylon-leapmotion adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon"),
    Leap = require("leapjs");

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.host = opts.host || "127.0.0.1";

  this.connector = this.leap = Leap;

  this.events = [
    /**
     * Emitted when the Leap Motion has finished processing a new frame
     *
     * @event frame
     * @value data
     */
    "frame",

    /**
     * Emitted per frame when the Leap Motion sees a hand
     *
     * @event hand
     * @value data
     */
    "hand",

    /**
     * Emitted per frame when the Leap Motion sees a gesture
     *
     * @event gesture
     * @value data
     */
    "gesture"
  ];
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

/**
 * Connects to the Leap Motion
 *
 * @param {Function} callback to be triggered when connected
 * @return {void}
 */
Adaptor.prototype.connect = function(callback) {
  var emit = this.emit;

  callback();

  Leap.loop({
    enableGestures: true,
    host: this.host,

    frame: function(frame) {
      if (frame.gestures && frame.gestures.length > 0) {
        for (var g = 0; g < frame.gestures.length; g++) {
          emit("gesture", frame.gestures[g]);
        }
      }

      emit("frame", frame);
    },

    hand: function(hand) {
      if (hand.palmPosition) {
        hand.palmX = hand.palmPosition[0];
        hand.palmY = hand.palmPosition[1];
        hand.palmZ = hand.palmPosition[2];
      }

      if (hand._rotation) {
        hand.rotation = {
          axis: hand._rotation[0],
          angle: hand._rotation[1],
          matrix: hand._rotation[2]
        };
      }

      emit("hand", hand);
    }
  });
};

/**
 * Disconnects from the Leap Motion
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {void}
 */
Adaptor.prototype.disconnect = function(callback) {
  callback();
};

},{"cylon":27,"leapjs":15}],3:[function(require,module,exports){
/*
 * cylon-leapmotion driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Driver = module.exports = function Driver() {
  Driver.__super__.constructor.apply(this, arguments);

  this.events = [
    /**
     * Emitted when the Leap Motion has finished processing a new frame
     *
     * @event frame
     * @value data
     */
    "frame",

    /**
     * Emitted per frame when the Leap Motion sees a hand
     *
     * @event hand
     * @value data
     */
    "hand",

    /**
     * Emitted per frame when the Leap Motion sees a gesture
     *
     * @event gesture
     * @value data
     */
    "gesture"
  ];
};

Cylon.Utils.subclass(Driver, Cylon.Driver);

/**
 * Starts the driver
 *
 * @param {Function} callback to be triggered when started
 * @return {void}
 */
Driver.prototype.start = function(callback) {
  this.defineDriverEvent("frame");
  this.defineDriverEvent("hand");
  this.defineDriverEvent("gesture");

  callback();
};

/**
 * Stops the driver
 *
 * @param {Function} callback to be triggered when halted
 * @return {void}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

},{"cylon":27}],4:[function(require,module,exports){
var Pointable = require('./pointable'),
  glMatrix = require("gl-matrix")
  , vec3 = glMatrix.vec3
  , mat3 = glMatrix.mat3
  , mat4 = glMatrix.mat4
  , _ = require('underscore');


var Bone = module.exports = function(finger, data) {
  this.finger = finger;

  this._center = null, this._matrix = null;

  /**
  * An integer code for the name of this bone.
  *
  * * 0 -- metacarpal
  * * 1 -- proximal
  * * 2 -- medial
  * * 3 -- distal
  * * 4 -- arm
  *
  * @member type
  * @type {number}
  * @memberof Leap.Bone.prototype
  */
  this.type = data.type;

  /**
   * The position of the previous, or base joint of the bone closer to the wrist.
   * @type {vector3}
   */
  this.prevJoint = data.prevJoint;

  /**
   * The position of the next joint, or the end of the bone closer to the finger tip.
   * @type {vector3}
   */
  this.nextJoint = data.nextJoint;

  /**
   * The estimated width of the tool in millimeters.
   *
   * The reported width is the average width of the visible portion of the
   * tool from the hand to the tip. If the width isn't known,
   * then a value of 0 is returned.
   *
   * Pointable objects representing fingers do not have a width property.
   *
   * @member width
   * @type {number}
   * @memberof Leap.Pointable.prototype
   */
  this.width = data.width;

  var displacement = new Array(3);
  vec3.sub(displacement, data.nextJoint, data.prevJoint);

  this.length = vec3.length(displacement);


  /**
   *
   * These fully-specify the orientation of the bone.
   * See examples/threejs-bones.html for more info
   * Three vec3s:
   *  x (red): The rotation axis of the finger, pointing outwards.  (In general, away from the thumb )
   *  y (green): The "up" vector, orienting the top of the finger
   *  z (blue): The roll axis of the bone.
   *
   *  Most up vectors will be pointing the same direction, except for the thumb, which is more rightwards.
   *
   *  The thumb has one fewer bones than the fingers, but there are the same number of joints & joint-bases provided
   *  the first two appear in the same position, but only the second (proximal) rotates.
   *
   *  Normalized.
   */
  this.basis = data.basis;
};

Bone.prototype.left = function(){

  if (this._left) return this._left;

  this._left =  mat3.determinant(this.basis[0].concat(this.basis[1]).concat(this.basis[2])) < 0;

  return this._left;

};


/**
 * The Affine transformation matrix describing the orientation of the bone, in global Leap-space.
 * It contains a 3x3 rotation matrix (in the "top left"), and center coordinates in the fourth column.
 *
 * Unlike the basis, the right and left hands have the same coordinate system.
 *
 */
Bone.prototype.matrix = function(){

  if (this._matrix) return this._matrix;

  var b = this.basis,
      t = this._matrix = mat4.create();

  // open transform mat4 from rotation mat3
  t[0] = b[0][0], t[1] = b[0][1], t[2]  = b[0][2];
  t[4] = b[1][0], t[5] = b[1][1], t[6]  = b[1][2];
  t[8] = b[2][0], t[9] = b[2][1], t[10] = b[2][2];

  t[3] = this.center()[0];
  t[7] = this.center()[1];
  t[11] = this.center()[2];

  if ( this.left() ) {
    // flip the basis to be right-handed
    t[0] *= -1;
    t[1] *= -1;
    t[2] *= -1;
  }

  return this._matrix;
};

/**
 * Helper method to linearly interpolate between the two ends of the bone.
 *
 * when t = 0, the position of prevJoint will be returned
 * when t = 1, the position of nextJoint will be returned
 */
Bone.prototype.lerp = function(out, t){

  vec3.lerp(out, this.prevJoint, this.nextJoint, t);

};

/**
 *
 * The center position of the bone
 * Returns a vec3 array.
 *
 */
Bone.prototype.center = function(){

  if (this._center) return this._center;

  var center = vec3.create();
  this.lerp(center, 0.5);
  this._center = center;
  return center;

};

// The negative of the z-basis
Bone.prototype.direction = function(){

 return [
   this.basis[2][0] * -1,
   this.basis[2][1] * -1,
   this.basis[2][2] * -1
 ];

};

},{"./pointable":18,"gl-matrix":24,"underscore":25}],5:[function(require,module,exports){
var CircularBuffer = module.exports = function(size) {
  this.pos = 0;
  this._buf = [];
  this.size = size;
}

CircularBuffer.prototype.get = function(i) {
  if (i == undefined) i = 0;
  if (i >= this.size) return undefined;
  if (i >= this._buf.length) return undefined;
  return this._buf[(this.pos - i - 1) % this.size];
}

CircularBuffer.prototype.push = function(o) {
  this._buf[this.pos % this.size] = o;
  return this.pos++;
}

},{}],6:[function(require,module,exports){
var chooseProtocol = require('../protocol').chooseProtocol
  , EventEmitter = require('events').EventEmitter
  , _ = require('underscore');

var BaseConnection = module.exports = function(opts) {
  this.opts = _.defaults(opts || {}, {
    host : '127.0.0.1',
    enableGestures: false,
    scheme: this.getScheme(),
    port: this.getPort(),
    background: false,
    optimizeHMD: false,
    requestProtocolVersion: BaseConnection.defaultProtocolVersion
  });
  this.host = this.opts.host;
  this.port = this.opts.port;
  this.scheme = this.opts.scheme;
  this.protocolVersionVerified = false;
  this.background = null;
  this.optimizeHMD = null;
  this.on('ready', function() {
    this.enableGestures(this.opts.enableGestures);
    this.setBackground(this.opts.background);
    this.setOptimizeHMD(this.opts.optimizeHMD);

    if (this.opts.optimizeHMD){
      console.log("Optimized for head mounted display usage.");
    }else {
      console.log("Optimized for desktop usage.");
    }

  });
};

// The latest available:
BaseConnection.defaultProtocolVersion = 6;

BaseConnection.prototype.getUrl = function() {
  return this.scheme + "//" + this.host + ":" + this.port + "/v" + this.opts.requestProtocolVersion + ".json";
}


BaseConnection.prototype.getScheme = function(){
  return 'ws:'
}

BaseConnection.prototype.getPort = function(){
  return 6437
}


BaseConnection.prototype.setBackground = function(state) {
  this.opts.background = state;
  if (this.protocol && this.protocol.sendBackground && this.background !== this.opts.background) {
    this.background = this.opts.background;
    this.protocol.sendBackground(this, this.opts.background);
  }
}

BaseConnection.prototype.setOptimizeHMD = function(state) {
  this.opts.optimizeHMD = state;
  if (this.protocol && this.protocol.sendOptimizeHMD && this.optimizeHMD !== this.opts.optimizeHMD) {
    this.optimizeHMD = this.opts.optimizeHMD;
    this.protocol.sendOptimizeHMD(this, this.opts.optimizeHMD);
  }
}

BaseConnection.prototype.handleOpen = function() {
  if (!this.connected) {
    this.connected = true;
    this.emit('connect');
  }
}

BaseConnection.prototype.enableGestures = function(enabled) {
  this.gesturesEnabled = enabled ? true : false;
  this.send(this.protocol.encode({"enableGestures": this.gesturesEnabled}));
}

BaseConnection.prototype.handleClose = function(code, reason) {
  if (!this.connected) return;
  this.disconnect();

  // 1001 - an active connection is closed
  // 1006 - cannot connect
  if (code === 1001 && this.opts.requestProtocolVersion > 1) {
    if (this.protocolVersionVerified) {
      this.protocolVersionVerified = false;
    }else{
      this.opts.requestProtocolVersion--;
    }
  }
  this.startReconnection();
}

BaseConnection.prototype.startReconnection = function() {
  var connection = this;
  if(!this.reconnectionTimer){
    (this.reconnectionTimer = setInterval(function() { connection.reconnect() }, 500));
  }
}

BaseConnection.prototype.stopReconnection = function() {
  this.reconnectionTimer = clearInterval(this.reconnectionTimer);
}

// By default, disconnect will prevent auto-reconnection.
// Pass in true to allow the reconnection loop not be interrupted continue
BaseConnection.prototype.disconnect = function(allowReconnect) {
  if (!allowReconnect) this.stopReconnection();
  if (!this.socket) return;
  this.socket.close();
  delete this.socket;
  delete this.protocol;
  delete this.background; // This is not persisted when reconnecting to the web socket server
  delete this.optimizeHMD;
  delete this.focusedState;
  if (this.connected) {
    this.connected = false;
    this.emit('disconnect');
  }
  return true;
}

BaseConnection.prototype.reconnect = function() {
  if (this.connected) {
    this.stopReconnection();
  } else {
    this.disconnect(true);
    this.connect();
  }
}

BaseConnection.prototype.handleData = function(data) {
  var message = JSON.parse(data);

  var messageEvent;
  if (this.protocol === undefined) {
    messageEvent = this.protocol = chooseProtocol(message);
    this.protocolVersionVerified = true;
    this.emit('ready');
  } else {
    messageEvent = this.protocol(message);
  }
  this.emit(messageEvent.type, messageEvent);
}

BaseConnection.prototype.connect = function() {
  if (this.socket) return;
  this.socket = this.setupSocket();
  return true;
}

BaseConnection.prototype.send = function(data) {
  this.socket.send(data);
}

BaseConnection.prototype.reportFocus = function(state) {
  if (!this.connected || this.focusedState === state) return;
  this.focusedState = state;
  this.emit(this.focusedState ? 'focus' : 'blur');
  if (this.protocol && this.protocol.sendFocused) {
    this.protocol.sendFocused(this, this.focusedState);
  }
}

_.extend(BaseConnection.prototype, EventEmitter.prototype);
},{"../protocol":19,"events":49,"underscore":25}],7:[function(require,module,exports){
var BaseConnection = module.exports = require('./base')
  , _ = require('underscore');


var BrowserConnection = module.exports = function(opts) {
  BaseConnection.call(this, opts);
  var connection = this;
  this.on('ready', function() { connection.startFocusLoop(); })
  this.on('disconnect', function() { connection.stopFocusLoop(); })
}

_.extend(BrowserConnection.prototype, BaseConnection.prototype);

BrowserConnection.__proto__ = BaseConnection;

BrowserConnection.prototype.useSecure = function(){
  return location.protocol === 'https:'
}

BrowserConnection.prototype.getScheme = function(){
  return this.useSecure() ? 'wss:' : 'ws:'
}

BrowserConnection.prototype.getPort = function(){
  return this.useSecure() ? 6436 : 6437
}

BrowserConnection.prototype.setupSocket = function() {
  var connection = this;
  var socket = new WebSocket(this.getUrl());
  socket.onopen = function() { connection.handleOpen(); };
  socket.onclose = function(data) { connection.handleClose(data['code'], data['reason']); };
  socket.onmessage = function(message) { connection.handleData(message.data) };
  socket.onerror = function(error) {

    // attempt to degrade to ws: after one failed attempt for older Leap Service installations.
    if (connection.useSecure() && connection.scheme === 'wss:'){
      connection.scheme = 'ws:';
      connection.port = 6437;
      connection.disconnect();
      connection.connect();
    }

  };
  return socket;
}

BrowserConnection.prototype.startFocusLoop = function() {
  if (this.focusDetectorTimer) return;
  var connection = this;
  var propertyName = null;
  if (typeof document.hidden !== "undefined") {
    propertyName = "hidden";
  } else if (typeof document.mozHidden !== "undefined") {
    propertyName = "mozHidden";
  } else if (typeof document.msHidden !== "undefined") {
    propertyName = "msHidden";
  } else if (typeof document.webkitHidden !== "undefined") {
    propertyName = "webkitHidden";
  } else {
    propertyName = undefined;
  }

  if (connection.windowVisible === undefined) {
    connection.windowVisible = propertyName === undefined ? true : document[propertyName] === false;
  }

  var focusListener = window.addEventListener('focus', function(e) {
    connection.windowVisible = true;
    updateFocusState();
  });

  var blurListener = window.addEventListener('blur', function(e) {
    connection.windowVisible = false;
    updateFocusState();
  });

  this.on('disconnect', function() {
    window.removeEventListener('focus', focusListener);
    window.removeEventListener('blur', blurListener);
  });

  var updateFocusState = function() {
    var isVisible = propertyName === undefined ? true : document[propertyName] === false;
    connection.reportFocus(isVisible && connection.windowVisible);
  }

  // save 100ms when resuming focus
  updateFocusState();

  this.focusDetectorTimer = setInterval(updateFocusState, 100);
}

BrowserConnection.prototype.stopFocusLoop = function() {
  if (!this.focusDetectorTimer) return;
  clearTimeout(this.focusDetectorTimer);
  delete this.focusDetectorTimer;
}

},{"./base":6,"underscore":25}],8:[function(require,module,exports){
var WebSocket = require('ws')
  , BaseConnection = require('./base')
  , _ = require('underscore');

var NodeConnection = module.exports = function(opts) {
  BaseConnection.call(this, opts);
  var connection = this;
  this.on('ready', function() { connection.reportFocus(true); });
}

_.extend(NodeConnection.prototype, BaseConnection.prototype);

NodeConnection.__proto__ = BaseConnection;

NodeConnection.prototype.setupSocket = function() {
  var connection = this;
  var socket = new WebSocket(this.getUrl());
  socket.on('open', function() { connection.handleOpen(); });
  socket.on('message', function(m) { connection.handleData(m); });
  socket.on('close', function(code, reason) { connection.handleClose(code, reason); });
  socket.on('error', function() { connection.startReconnection(); });
  return socket;
}

},{"./base":6,"underscore":25,"ws":26}],9:[function(require,module,exports){
(function (process){
var Frame = require('./frame')
  , Hand = require('./hand')
  , Pointable = require('./pointable')
  , Finger = require('./finger')
  , CircularBuffer = require("./circular_buffer")
  , Pipeline = require("./pipeline")
  , EventEmitter = require('events').EventEmitter
  , gestureListener = require('./gesture').gestureListener
  , Dialog = require('./dialog')
  , _ = require('underscore');

/**
 * Constructs a Controller object.
 *
 * When creating a Controller object, you may optionally pass in options
 * to set the host , set the port, enable gestures, or select the frame event type.
 *
 * ```javascript
 * var controller = new Leap.Controller({
 *   host: '127.0.0.1',
 *   port: 6437,
 *   enableGestures: true,
 *   frameEventName: 'animationFrame'
 * });
 * ```
 *
 * @class Controller
 * @memberof Leap
 * @classdesc
 * The Controller class is your main interface to the Leap Motion Controller.
 *
 * Create an instance of this Controller class to access frames of tracking data
 * and configuration information. Frame data can be polled at any time using the
 * [Controller.frame]{@link Leap.Controller#frame}() function. Call frame() or frame(0) to get the most recent
 * frame. Set the history parameter to a positive integer to access previous frames.
 * A controller stores up to 60 frames in its frame history.
 *
 * Polling is an appropriate strategy for applications which already have an
 * intrinsic update loop, such as a game.
 *
 * loopWhileDisconnected defaults to true, and maintains a 60FPS frame rate even when Leap Motion is not streaming
 * data at that rate (such as no hands in frame).  This is important for VR/WebGL apps which rely on rendering for
 * regular visual updates, including from other input devices.  Flipping this to false should be considered an
 * optimization for very specific use-cases.
 *
 *
 */


var Controller = module.exports = function(opts) {
  var inNode = (typeof(process) !== 'undefined' && process.versions && process.versions.node),
    controller = this;

  opts = _.defaults(opts || {}, {
    inNode: inNode
  });

  this.inNode = opts.inNode;

  opts = _.defaults(opts || {}, {
    frameEventName: this.useAnimationLoop() ? 'animationFrame' : 'deviceFrame',
    suppressAnimationLoop: !this.useAnimationLoop(),
    loopWhileDisconnected: true,
    useAllPlugins: false,
    checkVersion: true
  });

  this.animationFrameRequested = false;
  this.onAnimationFrame = function(timestamp) {
    if (controller.lastConnectionFrame.valid){
      controller.emit('animationFrame', controller.lastConnectionFrame);
    }
    controller.emit('frameEnd', timestamp);
    if (
      controller.loopWhileDisconnected &&
      ( ( controller.connection.focusedState !== false )  // loop while undefined, pre-ready.
        || controller.connection.opts.background) ){
      window.requestAnimationFrame(controller.onAnimationFrame);
    }else{
      controller.animationFrameRequested = false;
    }
  };
  this.suppressAnimationLoop = opts.suppressAnimationLoop;
  this.loopWhileDisconnected = opts.loopWhileDisconnected;
  this.frameEventName = opts.frameEventName;
  this.useAllPlugins = opts.useAllPlugins;
  this.history = new CircularBuffer(200);
  this.lastFrame = Frame.Invalid;
  this.lastValidFrame = Frame.Invalid;
  this.lastConnectionFrame = Frame.Invalid;
  this.accumulatedGestures = [];
  this.checkVersion = opts.checkVersion;
  if (opts.connectionType === undefined) {
    this.connectionType = (this.inBrowser() ? require('./connection/browser') : require('./connection/node'));
  } else {
    this.connectionType = opts.connectionType;
  }
  this.connection = new this.connectionType(opts);
  this.streamingCount = 0;
  this.devices = {};
  this.plugins = {};
  this._pluginPipelineSteps = {};
  this._pluginExtendedMethods = {};
  if (opts.useAllPlugins) this.useRegisteredPlugins();
  this.setupFrameEvents(opts);
  this.setupConnectionEvents();
  
  this.startAnimationLoop(); // immediately when started
}

Controller.prototype.gesture = function(type, cb) {
  var creator = gestureListener(this, type);
  if (cb !== undefined) {
    creator.stop(cb);
  }
  return creator;
}

/*
 * @returns the controller
 */
Controller.prototype.setBackground = function(state) {
  this.connection.setBackground(state);
  return this;
}

Controller.prototype.setOptimizeHMD = function(state) {
  this.connection.setOptimizeHMD(state);
  return this;
}

Controller.prototype.inBrowser = function() {
  return !this.inNode;
}

Controller.prototype.useAnimationLoop = function() {
  return this.inBrowser() && !this.inBackgroundPage();
}

Controller.prototype.inBackgroundPage = function(){
  // http://developer.chrome.com/extensions/extension#method-getBackgroundPage
  return (typeof(chrome) !== "undefined") &&
    chrome.extension &&
    chrome.extension.getBackgroundPage &&
    (chrome.extension.getBackgroundPage() === window)
}

/*
 * @returns the controller
 */
Controller.prototype.connect = function() {
  this.connection.connect();
  return this;
}

Controller.prototype.streaming = function() {
  return this.streamingCount > 0;
}

Controller.prototype.connected = function() {
  return !!this.connection.connected;
}

Controller.prototype.startAnimationLoop = function(){
  if (!this.suppressAnimationLoop && !this.animationFrameRequested) {
    this.animationFrameRequested = true;
    window.requestAnimationFrame(this.onAnimationFrame);
  }
}

/*
 * @returns the controller
 */
Controller.prototype.disconnect = function() {
  this.connection.disconnect();
  return this;
}

/**
 * Returns a frame of tracking data from the Leap.
 *
 * Use the optional history parameter to specify which frame to retrieve.
 * Call frame() or frame(0) to access the most recent frame; call frame(1) to
 * access the previous frame, and so on. If you use a history value greater
 * than the number of stored frames, then the controller returns an invalid frame.
 *
 * @method frame
 * @memberof Leap.Controller.prototype
 * @param {number} history The age of the frame to return, counting backwards from
 * the most recent frame (0) into the past and up to the maximum age (59).
 * @returns {Leap.Frame} The specified frame; or, if no history
 * parameter is specified, the newest frame. If a frame is not available at
 * the specified history position, an invalid Frame is returned.
 **/
Controller.prototype.frame = function(num) {
  return this.history.get(num) || Frame.Invalid;
}

Controller.prototype.loop = function(callback) {
  if (callback) {
    if (typeof callback === 'function'){
      this.on(this.frameEventName, callback);
    }else{
      // callback is actually of the form: {eventName: callback}
      this.setupFrameEvents(callback);
    }
  }

  return this.connect();
}

Controller.prototype.addStep = function(step) {
  if (!this.pipeline) this.pipeline = new Pipeline(this);
  this.pipeline.addStep(step);
}

// this is run on every deviceFrame
Controller.prototype.processFrame = function(frame) {
  if (frame.gestures) {
    this.accumulatedGestures = this.accumulatedGestures.concat(frame.gestures);
  }
  // lastConnectionFrame is used by the animation loop
  this.lastConnectionFrame = frame;
  this.startAnimationLoop(); // Only has effect if loopWhileDisconnected: false
  this.emit('deviceFrame', frame);
}

// on a this.deviceEventName (usually 'animationFrame' in browsers), this emits a 'frame'
Controller.prototype.processFinishedFrame = function(frame) {
  this.lastFrame = frame;
  if (frame.valid) {
    this.lastValidFrame = frame;
  }
  frame.controller = this;
  frame.historyIdx = this.history.push(frame);
  if (frame.gestures) {
    frame.gestures = this.accumulatedGestures;
    this.accumulatedGestures = [];
    for (var gestureIdx = 0; gestureIdx != frame.gestures.length; gestureIdx++) {
      this.emit("gesture", frame.gestures[gestureIdx], frame);
    }
  }
  if (this.pipeline) {
    frame = this.pipeline.run(frame);
    if (!frame) frame = Frame.Invalid;
  }
  this.emit('frame', frame);
  this.emitHandEvents(frame);
}

/**
 * The controller will emit 'hand' events for every hand on each frame.  The hand in question will be passed
 * to the event callback.
 *
 * @param frame
 */
Controller.prototype.emitHandEvents = function(frame){
  for (var i = 0; i < frame.hands.length; i++){
    this.emit('hand', frame.hands[i]);
  }
}

Controller.prototype.setupFrameEvents = function(opts){
  if (opts.frame){
    this.on('frame', opts.frame);
  }
  if (opts.hand){
    this.on('hand', opts.hand);
  }
}

/**
  Controller events.  The old 'deviceConnected' and 'deviceDisconnected' have been depricated -
  use 'deviceStreaming' and 'deviceStopped' instead, except in the case of an unexpected disconnect.

  There are 4 pairs of device events recently added/changed:
  -deviceAttached/deviceRemoved - called when a device's physical connection to the computer changes
  -deviceStreaming/deviceStopped - called when a device is paused or resumed.
  -streamingStarted/streamingStopped - called when there is/is no longer at least 1 streaming device.
									  Always comes after deviceStreaming.
  
  The first of all of the above event pairs is triggered as appropriate upon connection.  All of
  these events receives an argument with the most recent info about the device that triggered it.
  These events will always be fired in the order they are listed here, with reverse ordering for the
  matching shutdown call. (ie, deviceStreaming always comes after deviceAttached, and deviceStopped 
  will come before deviceRemoved).
  
  -deviceConnected/deviceDisconnected - These are considered deprecated and will be removed in
  the next revision.  In contrast to the other events and in keeping with it's original behavior,
  it will only be fired when a device begins streaming AFTER a connection has been established.
  It is not paired, and receives no device info.  Nearly identical functionality to
  streamingStarted/Stopped if you need to port.
*/
Controller.prototype.setupConnectionEvents = function() {
  var controller = this;
  this.connection.on('frame', function(frame) {
    controller.processFrame(frame);
  });
  // either deviceFrame or animationFrame:
  this.on(this.frameEventName, function(frame) {
    controller.processFinishedFrame(frame);
  });


  // here we backfill the 0.5.0 deviceEvents as best possible
  // backfill begin streaming events
  var backfillStreamingStartedEventsHandler = function(){
    if (controller.connection.opts.requestProtocolVersion < 5 && controller.streamingCount == 0){
      controller.streamingCount = 1;
      var info = {
        attached: true,
        streaming: true,
        type: 'unknown',
        id: "Lx00000000000"
      };
      controller.devices[info.id] = info;

      controller.emit('deviceAttached', info);
      controller.emit('deviceStreaming', info);
      controller.emit('streamingStarted', info);
      controller.connection.removeListener('frame', backfillStreamingStartedEventsHandler)
    }
  }

  var backfillStreamingStoppedEvents = function(){
    if (controller.streamingCount > 0) {
      for (var deviceId in controller.devices){
        controller.emit('deviceStopped', controller.devices[deviceId]);
        controller.emit('deviceRemoved', controller.devices[deviceId]);
      }
      // only emit streamingStopped once, with the last device
      controller.emit('streamingStopped', controller.devices[deviceId]);

      controller.streamingCount = 0;

      for (var deviceId in controller.devices){
        delete controller.devices[deviceId];
      }
    }
  }
  // Delegate connection events
  this.connection.on('focus', function() {

    if ( controller.loopWhileDisconnected ){

      controller.startAnimationLoop();

    }

    controller.emit('focus');

  });
  this.connection.on('blur', function() { controller.emit('blur') });
  this.connection.on('protocol', function(protocol) {

    protocol.on('beforeFrameCreated', function(frameData){
      controller.emit('beforeFrameCreated', frameData)
    });

    protocol.on('afterFrameCreated', function(frame, frameData){
      controller.emit('afterFrameCreated', frame, frameData)
    });

    controller.emit('protocol', protocol); 
  });

  this.connection.on('ready', function() {

    if (controller.checkVersion && !controller.inNode){
      // show dialog only to web users
      controller.checkOutOfDate();
    }

    controller.emit('ready');
  });

  this.connection.on('connect', function() {
    controller.emit('connect');
    controller.connection.removeListener('frame', backfillStreamingStartedEventsHandler)
    controller.connection.on('frame', backfillStreamingStartedEventsHandler);
  });

  this.connection.on('disconnect', function() {
    controller.emit('disconnect');
    backfillStreamingStoppedEvents();
  });

  // this does not fire when the controller is manually disconnected
  // or for Leap Service v1.2.0+
  this.connection.on('deviceConnect', function(evt) {
    if (evt.state){
      controller.emit('deviceConnected');
      controller.connection.removeListener('frame', backfillStreamingStartedEventsHandler)
      controller.connection.on('frame', backfillStreamingStartedEventsHandler);
    }else{
      controller.emit('deviceDisconnected');
      backfillStreamingStoppedEvents();
    }
  });

  // Does not fire for Leap Service pre v1.2.0
  this.connection.on('deviceEvent', function(evt) {
    var info = evt.state,
        oldInfo = controller.devices[info.id];

    //Grab a list of changed properties in the device info
    var changed = {};
    for(var property in info) {
      //If a property i doesn't exist the cache, or has changed...
      if( !oldInfo || !oldInfo.hasOwnProperty(property) || oldInfo[property] != info[property] ) {
        changed[property] = true;
      }
    }

    //Update the device list
    controller.devices[info.id] = info;

    //Fire events based on change list
    if(changed.attached) {
      controller.emit(info.attached ? 'deviceAttached' : 'deviceRemoved', info);
    }

    if(!changed.streaming) return;

    if(info.streaming) {
      controller.streamingCount++;
      controller.emit('deviceStreaming', info);
      if( controller.streamingCount == 1 ) {
        controller.emit('streamingStarted', info);
      }
      //if attached & streaming both change to true at the same time, that device was streaming
      //already when we connected.
      if(!changed.attached) {
        controller.emit('deviceConnected');
      }
    }
    //Since when devices are attached all fields have changed, don't send events for streaming being false.
    else if(!(changed.attached && info.attached)) {
      controller.streamingCount--;
      controller.emit('deviceStopped', info);
      if(controller.streamingCount == 0){
        controller.emit('streamingStopped', info);
      }
      controller.emit('deviceDisconnected');
    }

  });


  this.on('newListener', function(event, listener) {
    if( event == 'deviceConnected' || event == 'deviceDisconnected' ) {
      console.warn(event + " events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead");
    }
  });

};




// Checks if the protocol version is the latest, if if not, shows the dialog.
Controller.prototype.checkOutOfDate = function(){
  console.assert(this.connection && this.connection.protocol);

  var serviceVersion = this.connection.protocol.serviceVersion;
  var protocolVersion = this.connection.protocol.version;
  var defaultProtocolVersion = this.connectionType.defaultProtocolVersion;

  if (defaultProtocolVersion > protocolVersion){

    console.warn("Your Protocol Version is v" + protocolVersion +
        ", this app was designed for v" + defaultProtocolVersion);

    Dialog.warnOutOfDate({
      sV: serviceVersion,
      pV: protocolVersion
    });
    return true
  }else{
    return false
  }

};



Controller._pluginFactories = {};

/*
 * Registers a plugin, making is accessible to controller.use later on.
 *
 * @member plugin
 * @memberof Leap.Controller.prototype
 * @param {String} name The name of the plugin (usually camelCase).
 * @param {function} factory A factory method which will return an instance of a plugin.
 * The factory receives an optional hash of options, passed in via controller.use.
 *
 * Valid keys for the object include frame, hand, finger, tool, and pointable.  The value
 * of each key can be either a function or an object.  If given a function, that function
 * will be called once for every instance of the object, with that instance injected as an
 * argument.  This allows decoration of objects with additional data:
 *
 * ```javascript
 * Leap.Controller.plugin('testPlugin', function(options){
 *   return {
 *     frame: function(frame){
 *       frame.foo = 'bar';
 *     }
 *   }
 * });
 * ```
 *
 * When hand is used, the callback is called for every hand in `frame.hands`.  Note that
 * hand objects are recreated with every new frame, so that data saved on the hand will not
 * persist.
 *
 * ```javascript
 * Leap.Controller.plugin('testPlugin', function(){
 *   return {
 *     hand: function(hand){
 *       console.log('testPlugin running on hand ' + hand.id);
 *     }
 *   }
 * });
 * ```
 *
 * A factory can return an object to add custom functionality to Frames, Hands, or Pointables.
 * The methods are added directly to the object's prototype.  Finger and Tool cannot be used here, Pointable
 * must be used instead.
 * This is encouraged for calculations which may not be necessary on every frame.
 * Memoization is also encouraged, for cases where the method may be called many times per frame by the application.
 *
 * ```javascript
 * // This plugin allows hand.usefulData() to be called later.
 * Leap.Controller.plugin('testPlugin', function(){
 *   return {
 *     hand: {
 *       usefulData: function(){
 *         console.log('usefulData on hand', this.id);
 *         // memoize the results on to the hand, preventing repeat work:
 *         this.x || this.x = someExpensiveCalculation();
 *         return this.x;
 *       }
 *     }
 *   }
 * });
 *
 * Note that the factory pattern allows encapsulation for every plugin instance.
 *
 * ```javascript
 * Leap.Controller.plugin('testPlugin', function(options){
 *   options || options = {}
 *   options.center || options.center = [0,0,0]
 *
 *   privatePrintingMethod = function(){
 *     console.log('privatePrintingMethod - options', options);
 *   }
 *
 *   return {
 *     pointable: {
 *       publicPrintingMethod: function(){
 *         privatePrintingMethod();
 *       }
 *     }
 *   }
 * });
 *
 */
Controller.plugin = function(pluginName, factory) {
  if (this._pluginFactories[pluginName]) {
    console.warn("Plugin \"" + pluginName + "\" already registered");
  }
  return this._pluginFactories[pluginName] = factory;
};

/*
 * Returns a list of registered plugins.
 * @returns {Array} Plugin Factories.
 */
Controller.plugins = function() {
  return _.keys(this._pluginFactories);
};



var setPluginCallbacks = function(pluginName, type, callback){
  
  if ( ['beforeFrameCreated', 'afterFrameCreated'].indexOf(type) != -1 ){
    
      // todo - not able to "unuse" a plugin currently
      this.on(type, callback);
      
    }else {
      
      if (!this.pipeline) this.pipeline = new Pipeline(this);
    
      if (!this._pluginPipelineSteps[pluginName]) this._pluginPipelineSteps[pluginName] = [];

      this._pluginPipelineSteps[pluginName].push(
        
        this.pipeline.addWrappedStep(type, callback)
        
      );
      
    }
  
};

var setPluginMethods = function(pluginName, type, hash){
  var klass;
  
  if (!this._pluginExtendedMethods[pluginName]) this._pluginExtendedMethods[pluginName] = [];

  switch (type) {
    case 'frame':
      klass = Frame;
      break;
    case 'hand':
      klass = Hand;
      break;
    case 'pointable':
      klass = Pointable;
      _.extend(Finger.prototype, hash);
      _.extend(Finger.Invalid,   hash);
      break;
    case 'finger':
      klass = Finger;
      break;
    default:
      throw pluginName + ' specifies invalid object type "' + type + '" for prototypical extension'
  }

  _.extend(klass.prototype, hash);
  _.extend(klass.Invalid, hash);
  this._pluginExtendedMethods[pluginName].push([klass, hash])
  
}



/*
 * Begin using a registered plugin.  The plugin's functionality will be added to all frames
 * returned by the controller (and/or added to the objects within the frame).
 *  - The order of plugin execution inside the loop will match the order in which use is called by the application.
 *  - The plugin be run for both deviceFrames and animationFrames.
 *
 *  If called a second time, the options will be merged with those of the already instantiated plugin.
 *
 * @method use
 * @memberOf Leap.Controller.prototype
 * @param pluginName
 * @param {Hash} Options to be passed to the plugin's factory.
 * @returns the controller
 */
Controller.prototype.use = function(pluginName, options) {
  var functionOrHash, pluginFactory, key, pluginInstance;

  pluginFactory = (typeof pluginName == 'function') ? pluginName : Controller._pluginFactories[pluginName];

  if (!pluginFactory) {
    throw 'Leap Plugin ' + pluginName + ' not found.';
  }

  options || (options = {});

  if (this.plugins[pluginName]){
    _.extend(this.plugins[pluginName], options);
    return this;
  }

  this.plugins[pluginName] = options;

  pluginInstance = pluginFactory.call(this, options);

  for (key in pluginInstance) {

    functionOrHash = pluginInstance[key];

    if (typeof functionOrHash === 'function') {
      
      setPluginCallbacks.call(this, pluginName, key, functionOrHash);
      
    } else {
      
      setPluginMethods.call(this, pluginName, key, functionOrHash);
      
    }

  }

  return this;
};




/*
 * Stop using a used plugin.  This will remove any of the plugin's pipeline methods (those called on every frame)
 * and remove any methods which extend frame-object prototypes.
 *
 * @method stopUsing
 * @memberOf Leap.Controller.prototype
 * @param pluginName
 * @returns the controller
 */
Controller.prototype.stopUsing = function (pluginName) {
  var steps = this._pluginPipelineSteps[pluginName],
      extMethodHashes = this._pluginExtendedMethods[pluginName],
      i = 0, klass, extMethodHash;

  if (!this.plugins[pluginName]) return;

  if (steps) {
    for (i = 0; i < steps.length; i++) {
      this.pipeline.removeStep(steps[i]);
    }
  }

  if (extMethodHashes){
    for (i = 0; i < extMethodHashes.length; i++){
      klass = extMethodHashes[i][0];
      extMethodHash = extMethodHashes[i][1];
      for (var methodName in extMethodHash) {
        delete klass.prototype[methodName];
        delete klass.Invalid[methodName];
      }
    }
  }

  delete this.plugins[pluginName];

  return this;
}

Controller.prototype.useRegisteredPlugins = function(){
  for (var plugin in Controller._pluginFactories){
    this.use(plugin);
  }
}


_.extend(Controller.prototype, EventEmitter.prototype);

}).call(this,require('_process'))
},{"./circular_buffer":5,"./connection/browser":7,"./connection/node":8,"./dialog":10,"./finger":11,"./frame":12,"./gesture":13,"./hand":14,"./pipeline":17,"./pointable":18,"_process":50,"events":49,"underscore":25}],10:[function(require,module,exports){
(function (process){
var Dialog = module.exports = function(message, options){
  this.options = (options || {});
  this.message = message;

  this.createElement();
};

Dialog.prototype.createElement = function(){
  this.element = document.createElement('div');
  this.element.className = "leapjs-dialog";
  this.element.style.position = "fixed";
  this.element.style.top = '8px';
  this.element.style.left = 0;
  this.element.style.right = 0;
  this.element.style.textAlign = 'center';
  this.element.style.zIndex = 1000;

  var dialog  = document.createElement('div');
  this.element.appendChild(dialog);
  dialog.style.className = "leapjs-dialog";
  dialog.style.display = "inline-block";
  dialog.style.margin = "auto";
  dialog.style.padding = "8px";
  dialog.style.color = "#222";
  dialog.style.background = "#eee";
  dialog.style.borderRadius = "4px";
  dialog.style.border = "1px solid #999";
  dialog.style.textAlign = "left";
  dialog.style.cursor = "pointer";
  dialog.style.whiteSpace = "nowrap";
  dialog.style.transition = "box-shadow 1s linear";
  dialog.innerHTML = this.message;


  if (this.options.onclick){
    dialog.addEventListener('click', this.options.onclick);
  }

  if (this.options.onmouseover){
    dialog.addEventListener('mouseover', this.options.onmouseover);
  }

  if (this.options.onmouseout){
    dialog.addEventListener('mouseout', this.options.onmouseout);
  }

  if (this.options.onmousemove){
    dialog.addEventListener('mousemove', this.options.onmousemove);
  }
};

Dialog.prototype.show = function(){
  document.body.appendChild(this.element);
  return this;
};

Dialog.prototype.hide = function(){
  document.body.removeChild(this.element);
  return this;
};




// Shows a DOM dialog box with links to developer.leapmotion.com to upgrade
// This will work whether or not the Leap is plugged in,
// As long as it is called after a call to .connect() and the 'ready' event has fired.
Dialog.warnOutOfDate = function(params){
  params || (params = {});

  var url = "http://developer.leapmotion.com?";

  params.returnTo = window.location.href;

  for (var key in params){
    url += key + '=' + encodeURIComponent(params[key]) + '&';
  }

  var dialog,
    onclick = function(event){

       if (event.target.id != 'leapjs-decline-upgrade'){

         var popup = window.open(url,
           '_blank',
           'height=800,width=1000,location=1,menubar=1,resizable=1,status=1,toolbar=1,scrollbars=1'
         );

         if (window.focus) {popup.focus()}

       }

       dialog.hide();

       return true;
    },


    message = "This site requires Leap Motion Tracking V2." +
      "<button id='leapjs-accept-upgrade'  style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 16px;'>Upgrade</button>" +
      "<button id='leapjs-decline-upgrade' style='color: #444; transition: box-shadow 100ms linear; cursor: pointer; vertical-align: baseline; margin-left: 8px; '>Not Now</button>";

  dialog = new Dialog(message, {
      onclick: onclick,
      onmousemove: function(e){
        if (e.target == document.getElementById('leapjs-decline-upgrade')){
          document.getElementById('leapjs-decline-upgrade').style.color = '#000';
          document.getElementById('leapjs-decline-upgrade').style.boxShadow = '0px 0px 2px #5daa00';

          document.getElementById('leapjs-accept-upgrade').style.color = '#444';
          document.getElementById('leapjs-accept-upgrade').style.boxShadow = 'none';
        }else{
          document.getElementById('leapjs-accept-upgrade').style.color = '#000';
          document.getElementById('leapjs-accept-upgrade').style.boxShadow = '0px 0px 2px #5daa00';

          document.getElementById('leapjs-decline-upgrade').style.color = '#444';
          document.getElementById('leapjs-decline-upgrade').style.boxShadow = 'none';
        }
      },
      onmouseout: function(){
        document.getElementById('leapjs-decline-upgrade').style.color = '#444';
        document.getElementById('leapjs-decline-upgrade').style.boxShadow = 'none';
        document.getElementById('leapjs-accept-upgrade').style.color = '#444';
        document.getElementById('leapjs-accept-upgrade').style.boxShadow = 'none';
      }
    }
  );

  return dialog.show();
};


// Tracks whether we've warned for lack of bones API.  This will be shown only for early private-beta members.
Dialog.hasWarnedBones = false;

Dialog.warnBones = function(){
  if (this.hasWarnedBones) return;
  this.hasWarnedBones = true;

  console.warn("Your Leap Service is out of date");

  if ( !(typeof(process) !== 'undefined' && process.versions && process.versions.node) ){
    this.warnOutOfDate({reason: 'bones'});
  }

}
}).call(this,require('_process'))
},{"_process":50}],11:[function(require,module,exports){
var Pointable = require('./pointable'),
  Bone = require('./bone')
  , Dialog = require('./dialog')
  , _ = require('underscore');

/**
* Constructs a Finger object.
*
* An uninitialized finger is considered invalid.
* Get valid Finger objects from a Frame or a Hand object.
*
* @class Finger
* @memberof Leap
* @classdesc
* The Finger class reports the physical characteristics of a finger.
*
* Both fingers and tools are classified as Pointable objects. Use the
* Pointable.tool property to determine whether a Pointable object represents a
* tool or finger. The Leap classifies a detected entity as a tool when it is
* thinner, straighter, and longer than a typical finger.
*
* Note that Finger objects can be invalid, which means that they do not
* contain valid tracking data and do not correspond to a physical entity.
* Invalid Finger objects can be the result of asking for a Finger object
* using an ID from an earlier frame when no Finger objects with that ID
* exist in the current frame. A Finger object created from the Finger
* constructor is also invalid. Test for validity with the Pointable.valid
* property.
*/
var Finger = module.exports = function(data) {
  Pointable.call(this, data); // use pointable as super-constructor
  
  /**
  * The position of the distal interphalangeal joint of the finger.
  * This joint is closest to the tip.
  * 
  * The distal interphalangeal joint is located between the most extreme segment
  * of the finger (the distal phalanx) and the middle segment (the medial
  * phalanx).
  *
  * @member dipPosition
  * @type {number[]}
  * @memberof Leap.Finger.prototype
  */  
  this.dipPosition = data.dipPosition;

  /**
  * The position of the proximal interphalangeal joint of the finger. This joint is the middle
  * joint of a finger.
  *
  * The proximal interphalangeal joint is located between the two finger segments
  * closest to the hand (the proximal and the medial phalanges). On a thumb,
  * which lacks an medial phalanx, this joint index identifies the knuckle joint
  * between the proximal phalanx and the metacarpal bone.
  *
  * @member pipPosition
  * @type {number[]}
  * @memberof Leap.Finger.prototype
  */  
  this.pipPosition = data.pipPosition;

  /**
  * The position of the metacarpopophalangeal joint, or knuckle, of the finger.
  *
  * The metacarpopophalangeal joint is located at the base of a finger between
  * the metacarpal bone and the first phalanx. The common name for this joint is
  * the knuckle.
  *
  * On a thumb, which has one less phalanx than a finger, this joint index
  * identifies the thumb joint near the base of the hand, between the carpal
  * and metacarpal bones.
  *
  * @member mcpPosition
  * @type {number[]}
  * @memberof Leap.Finger.prototype
  */  
  this.mcpPosition = data.mcpPosition;

  /**
   * The position of the Carpometacarpal joint
   *
   * This is at the distal end of the wrist, and has no common name.
   *
   */
  this.carpPosition = data.carpPosition;

  /**
  * Whether or not this finger is in an extended posture.
  *
  * A finger is considered extended if it is extended straight from the hand as if
  * pointing. A finger is not extended when it is bent down and curled towards the 
  * palm.
  * @member extended
  * @type {Boolean}
  * @memberof Leap.Finger.prototype
  */
  this.extended = data.extended;

  /**
  * An integer code for the name of this finger.
  * 
  * * 0 -- thumb
  * * 1 -- index finger
  * * 2 -- middle finger
  * * 3 -- ring finger
  * * 4 -- pinky
  *
  * @member type
  * @type {number}
  * @memberof Leap.Finger.prototype
  */
  this.type = data.type;

  this.finger = true;
  
  /**
  * The joint positions of this finger as an array in the order base to tip.
  *
  * @member positions
  * @type {array[]}
  * @memberof Leap.Finger.prototype
  */
  this.positions = [this.carpPosition, this.mcpPosition, this.pipPosition, this.dipPosition, this.tipPosition];

  if (data.bases){
    this.addBones(data);
  } else {
    Dialog.warnBones();
  }

};

_.extend(Finger.prototype, Pointable.prototype);


Finger.prototype.addBones = function(data){
  /**
  * Four bones per finger, from wrist outwards:
  * metacarpal, proximal, medial, and distal.
  *
  * See http://en.wikipedia.org/wiki/Interphalangeal_articulations_of_hand
  */
  this.metacarpal   = new Bone(this, {
    type: 0,
    width: this.width,
    prevJoint: this.carpPosition,
    nextJoint: this.mcpPosition,
    basis: data.bases[0]
  });

  this.proximal     = new Bone(this, {
    type: 1,
    width: this.width,
    prevJoint: this.mcpPosition,
    nextJoint: this.pipPosition,
    basis: data.bases[1]
  });

  this.medial = new Bone(this, {
    type: 2,
    width: this.width,
    prevJoint: this.pipPosition,
    nextJoint: this.dipPosition,
    basis: data.bases[2]
  });

  /**
   * Note that the `distal.nextJoint` position is slightly different from the `finger.tipPosition`.
   * The former is at the very end of the bone, where the latter is the center of a sphere positioned at
   * the tip of the finger.  The btipPosition "bone tip position" is a few mm closer to the wrist than
   * the tipPosition.
   * @type {Bone}
   */
  this.distal       = new Bone(this, {
    type: 3,
    width: this.width,
    prevJoint: this.dipPosition,
    nextJoint: data.btipPosition,
    basis: data.bases[3]
  });

  this.bones = [this.metacarpal, this.proximal, this.medial, this.distal];
};

Finger.prototype.toString = function() {
    return "Finger [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + ' ]';
};

Finger.Invalid = { valid: false };

},{"./bone":4,"./dialog":10,"./pointable":18,"underscore":25}],12:[function(require,module,exports){
var Hand = require("./hand")
  , Pointable = require("./pointable")
  , createGesture = require("./gesture").createGesture
  , glMatrix = require("gl-matrix")
  , mat3 = glMatrix.mat3
  , vec3 = glMatrix.vec3
  , InteractionBox = require("./interaction_box")
  , Finger = require('./finger')
  , _ = require("underscore");

/**
 * Constructs a Frame object.
 *
 * Frame instances created with this constructor are invalid.
 * Get valid Frame objects by calling the
 * [Controller.frame]{@link Leap.Controller#frame}() function.
 *<C-D-Space>
 * @class Frame
 * @memberof Leap
 * @classdesc
 * The Frame class represents a set of hand and finger tracking data detected
 * in a single frame.
 *
 * The Leap detects hands, fingers and tools within the tracking area, reporting
 * their positions, orientations and motions in frames at the Leap frame rate.
 *
 * Access Frame objects using the [Controller.frame]{@link Leap.Controller#frame}() function.
 */
var Frame = module.exports = function(data) {
  /**
   * Reports whether this Frame instance is valid.
   *
   * A valid Frame is one generated by the Controller object that contains
   * tracking data for all detected entities. An invalid Frame contains no
   * actual tracking data, but you can call its functions without risk of a
   * undefined object exception. The invalid Frame mechanism makes it more
   * convenient to track individual data across the frame history. For example,
   * you can invoke:
   *
   * ```javascript
   * var finger = controller.frame(n).finger(fingerID);
   * ```
   *
   * for an arbitrary Frame history value, "n", without first checking whether
   * frame(n) returned a null object. (You should still check that the
   * returned Finger instance is valid.)
   *
   * @member valid
   * @memberof Leap.Frame.prototype
   * @type {Boolean}
   */
  this.valid = true;
  /**
   * A unique ID for this Frame. Consecutive frames processed by the Leap
   * have consecutive increasing values.
   * @member id
   * @memberof Leap.Frame.prototype
   * @type {String}
   */
  this.id = data.id;
  /**
   * The frame capture time in microseconds elapsed since the Leap started.
   * @member timestamp
   * @memberof Leap.Frame.prototype
   * @type {number}
   */
  this.timestamp = data.timestamp;
  /**
   * The list of Hand objects detected in this frame, given in arbitrary order.
   * The list can be empty if no hands are detected.
   *
   * @member hands[]
   * @memberof Leap.Frame.prototype
   * @type {Leap.Hand}
   */
  this.hands = [];
  this.handsMap = {};
  /**
   * The list of Pointable objects (fingers and tools) detected in this frame,
   * given in arbitrary order. The list can be empty if no fingers or tools are
   * detected.
   *
   * @member pointables[]
   * @memberof Leap.Frame.prototype
   * @type {Leap.Pointable}
   */
  this.pointables = [];
  /**
   * The list of Tool objects detected in this frame, given in arbitrary order.
   * The list can be empty if no tools are detected.
   *
   * @member tools[]
   * @memberof Leap.Frame.prototype
   * @type {Leap.Pointable}
   */
  this.tools = [];
  /**
   * The list of Finger objects detected in this frame, given in arbitrary order.
   * The list can be empty if no fingers are detected.
   * @member fingers[]
   * @memberof Leap.Frame.prototype
   * @type {Leap.Pointable}
   */
  this.fingers = [];

  /**
   * The InteractionBox associated with the current frame.
   *
   * @member interactionBox
   * @memberof Leap.Frame.prototype
   * @type {Leap.InteractionBox}
   */
  if (data.interactionBox) {
    this.interactionBox = new InteractionBox(data.interactionBox);
  }
  this.gestures = [];
  this.pointablesMap = {};
  this._translation = data.t;
  this._rotation = _.flatten(data.r);
  this._scaleFactor = data.s;
  this.data = data;
  this.type = 'frame'; // used by event emitting
  this.currentFrameRate = data.currentFrameRate;

  if (data.gestures) {
   /**
    * The list of Gesture objects detected in this frame, given in arbitrary order.
    * The list can be empty if no gestures are detected.
    *
    * Circle and swipe gestures are updated every frame. Tap gestures
    * only appear in the list for a single frame.
    * @member gestures[]
    * @memberof Leap.Frame.prototype
    * @type {Leap.Gesture}
    */
    for (var gestureIdx = 0, gestureCount = data.gestures.length; gestureIdx != gestureCount; gestureIdx++) {
      this.gestures.push(createGesture(data.gestures[gestureIdx]));
    }
  }
  this.postprocessData(data);
};

Frame.prototype.postprocessData = function(data){
  if (!data) {
    data = this.data;
  }

  for (var handIdx = 0, handCount = data.hands.length; handIdx != handCount; handIdx++) {
    var hand = new Hand(data.hands[handIdx]);
    hand.frame = this;
    this.hands.push(hand);
    this.handsMap[hand.id] = hand;
  }

  data.pointables = _.sortBy(data.pointables, function(pointable) { return pointable.id });

  for (var pointableIdx = 0, pointableCount = data.pointables.length; pointableIdx != pointableCount; pointableIdx++) {
    var pointableData = data.pointables[pointableIdx];
    var pointable = pointableData.dipPosition ? new Finger(pointableData) : new Pointable(pointableData);
    pointable.frame = this;
    this.addPointable(pointable);
  }
};

/**
 * Adds data from a pointable element into the pointablesMap; 
 * also adds the pointable to the frame.handsMap hand to which it belongs,
 * and to the hand's tools or hand's fingers map.
 * 
 * @param pointable {Object} a Pointable
 */
Frame.prototype.addPointable = function (pointable) {
  this.pointables.push(pointable);
  this.pointablesMap[pointable.id] = pointable;
  (pointable.tool ? this.tools : this.fingers).push(pointable);
  if (pointable.handId !== undefined && this.handsMap.hasOwnProperty(pointable.handId)) {
    var hand = this.handsMap[pointable.handId];
    hand.pointables.push(pointable);
    (pointable.tool ? hand.tools : hand.fingers).push(pointable);
    switch (pointable.type){
      case 0:
        hand.thumb = pointable;
        break;
      case 1:
        hand.indexFinger = pointable;
        break;
      case 2:
        hand.middleFinger = pointable;
        break;
      case 3:
        hand.ringFinger = pointable;
        break;
      case 4:
        hand.pinky = pointable;
        break;
    }
  }
};

/**
 * The tool with the specified ID in this frame.
 *
 * Use the Frame tool() function to retrieve a tool from
 * this frame using an ID value obtained from a previous frame.
 * This function always returns a Pointable object, but if no tool
 * with the specified ID is present, an invalid Pointable object is returned.
 *
 * Note that ID values persist across frames, but only until tracking of a
 * particular object is lost. If tracking of a tool is lost and subsequently
 * regained, the new Pointable object representing that tool may have a
 * different ID than that representing the tool in an earlier frame.
 *
 * @method tool
 * @memberof Leap.Frame.prototype
 * @param {String} id The ID value of a Tool object from a previous frame.
 * @returns {Leap.Pointable} The tool with the
 * matching ID if one exists in this frame; otherwise, an invalid Pointable object
 * is returned.
 */
Frame.prototype.tool = function(id) {
  var pointable = this.pointable(id);
  return pointable.tool ? pointable : Pointable.Invalid;
};

/**
 * The Pointable object with the specified ID in this frame.
 *
 * Use the Frame pointable() function to retrieve the Pointable object from
 * this frame using an ID value obtained from a previous frame.
 * This function always returns a Pointable object, but if no finger or tool
 * with the specified ID is present, an invalid Pointable object is returned.
 *
 * Note that ID values persist across frames, but only until tracking of a
 * particular object is lost. If tracking of a finger or tool is lost and subsequently
 * regained, the new Pointable object representing that finger or tool may have
 * a different ID than that representing the finger or tool in an earlier frame.
 *
 * @method pointable
 * @memberof Leap.Frame.prototype
 * @param {String} id The ID value of a Pointable object from a previous frame.
 * @returns {Leap.Pointable} The Pointable object with
 * the matching ID if one exists in this frame;
 * otherwise, an invalid Pointable object is returned.
 */
Frame.prototype.pointable = function(id) {
  return this.pointablesMap[id] || Pointable.Invalid;
};

/**
 * The finger with the specified ID in this frame.
 *
 * Use the Frame finger() function to retrieve the finger from
 * this frame using an ID value obtained from a previous frame.
 * This function always returns a Finger object, but if no finger
 * with the specified ID is present, an invalid Pointable object is returned.
 *
 * Note that ID values persist across frames, but only until tracking of a
 * particular object is lost. If tracking of a finger is lost and subsequently
 * regained, the new Pointable object representing that physical finger may have
 * a different ID than that representing the finger in an earlier frame.
 *
 * @method finger
 * @memberof Leap.Frame.prototype
 * @param {String} id The ID value of a finger from a previous frame.
 * @returns {Leap.Pointable} The finger with the
 * matching ID if one exists in this frame; otherwise, an invalid Pointable
 * object is returned.
 */
Frame.prototype.finger = function(id) {
  var pointable = this.pointable(id);
  return !pointable.tool ? pointable : Pointable.Invalid;
};

/**
 * The Hand object with the specified ID in this frame.
 *
 * Use the Frame hand() function to retrieve the Hand object from
 * this frame using an ID value obtained from a previous frame.
 * This function always returns a Hand object, but if no hand
 * with the specified ID is present, an invalid Hand object is returned.
 *
 * Note that ID values persist across frames, but only until tracking of a
 * particular object is lost. If tracking of a hand is lost and subsequently
 * regained, the new Hand object representing that physical hand may have
 * a different ID than that representing the physical hand in an earlier frame.
 *
 * @method hand
 * @memberof Leap.Frame.prototype
 * @param {String} id The ID value of a Hand object from a previous frame.
 * @returns {Leap.Hand} The Hand object with the matching
 * ID if one exists in this frame; otherwise, an invalid Hand object is returned.
 */
Frame.prototype.hand = function(id) {
  return this.handsMap[id] || Hand.Invalid;
};

/**
 * The angle of rotation around the rotation axis derived from the overall
 * rotational motion between the current frame and the specified frame.
 *
 * The returned angle is expressed in radians measured clockwise around
 * the rotation axis (using the right-hand rule) between the start and end frames.
 * The value is always between 0 and pi radians (0 and 180 degrees).
 *
 * The Leap derives frame rotation from the relative change in position and
 * orientation of all objects detected in the field of view.
 *
 * If either this frame or sinceFrame is an invalid Frame object, then the
 * angle of rotation is zero.
 *
 * @method rotationAngle
 * @memberof Leap.Frame.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @param {number[]} [axis] The axis to measure rotation around.
 * @returns {number} A positive value containing the heuristically determined
 * rotational change between the current frame and that specified in the sinceFrame parameter.
 */
Frame.prototype.rotationAngle = function(sinceFrame, axis) {
  if (!this.valid || !sinceFrame.valid) return 0.0;

  var rot = this.rotationMatrix(sinceFrame);
  var cs = (rot[0] + rot[4] + rot[8] - 1.0)*0.5;
  var angle = Math.acos(cs);
  angle = isNaN(angle) ? 0.0 : angle;

  if (axis !== undefined) {
    var rotAxis = this.rotationAxis(sinceFrame);
    angle *= vec3.dot(rotAxis, vec3.normalize(vec3.create(), axis));
  }

  return angle;
};

/**
 * The axis of rotation derived from the overall rotational motion between
 * the current frame and the specified frame.
 *
 * The returned direction vector is normalized.
 *
 * The Leap derives frame rotation from the relative change in position and
 * orientation of all objects detected in the field of view.
 *
 * If either this frame or sinceFrame is an invalid Frame object, or if no
 * rotation is detected between the two frames, a zero vector is returned.
 *
 * @method rotationAxis
 * @memberof Leap.Frame.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @returns {number[]} A normalized direction vector representing the axis of the heuristically determined
 * rotational change between the current frame and that specified in the sinceFrame parameter.
 */
Frame.prototype.rotationAxis = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return vec3.create();
  return vec3.normalize(vec3.create(), [
    this._rotation[7] - sinceFrame._rotation[5],
    this._rotation[2] - sinceFrame._rotation[6],
    this._rotation[3] - sinceFrame._rotation[1]
  ]);
}

/**
 * The transform matrix expressing the rotation derived from the overall
 * rotational motion between the current frame and the specified frame.
 *
 * The Leap derives frame rotation from the relative change in position and
 * orientation of all objects detected in the field of view.
 *
 * If either this frame or sinceFrame is an invalid Frame object, then
 * this method returns an identity matrix.
 *
 * @method rotationMatrix
 * @memberof Leap.Frame.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @returns {number[]} A transformation matrix containing the heuristically determined
 * rotational change between the current frame and that specified in the sinceFrame parameter.
 */
Frame.prototype.rotationMatrix = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return mat3.create();
  var transpose = mat3.transpose(mat3.create(), this._rotation)
  return mat3.multiply(mat3.create(), sinceFrame._rotation, transpose);
}

/**
 * The scale factor derived from the overall motion between the current frame and the specified frame.
 *
 * The scale factor is always positive. A value of 1.0 indicates no scaling took place.
 * Values between 0.0 and 1.0 indicate contraction and values greater than 1.0 indicate expansion.
 *
 * The Leap derives scaling from the relative inward or outward motion of all
 * objects detected in the field of view (independent of translation and rotation).
 *
 * If either this frame or sinceFrame is an invalid Frame object, then this method returns 1.0.
 *
 * @method scaleFactor
 * @memberof Leap.Frame.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative scaling.
 * @returns {number} A positive value representing the heuristically determined
 * scaling change ratio between the current frame and that specified in the sinceFrame parameter.
 */
Frame.prototype.scaleFactor = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return 1.0;
  return Math.exp(this._scaleFactor - sinceFrame._scaleFactor);
}

/**
 * The change of position derived from the overall linear motion between the
 * current frame and the specified frame.
 *
 * The returned translation vector provides the magnitude and direction of the
 * movement in millimeters.
 *
 * The Leap derives frame translation from the linear motion of all objects
 * detected in the field of view.
 *
 * If either this frame or sinceFrame is an invalid Frame object, then this
 * method returns a zero vector.
 *
 * @method translation
 * @memberof Leap.Frame.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative translation.
 * @returns {number[]} A vector representing the heuristically determined change in
 * position of all objects between the current frame and that specified in the sinceFrame parameter.
 */
Frame.prototype.translation = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return vec3.create();
  return vec3.subtract(vec3.create(), this._translation, sinceFrame._translation);
}

/**
 * A string containing a brief, human readable description of the Frame object.
 *
 * @method toString
 * @memberof Leap.Frame.prototype
 * @returns {String} A brief description of this frame.
 */
Frame.prototype.toString = function() {
  var str = "Frame [ id:"+this.id+" | timestamp:"+this.timestamp+" | Hand count:("+this.hands.length+") | Pointable count:("+this.pointables.length+")";
  if (this.gestures) str += " | Gesture count:("+this.gestures.length+")";
  str += " ]";
  return str;
}

/**
 * Returns a JSON-formatted string containing the hands, pointables and gestures
 * in this frame.
 *
 * @method dump
 * @memberof Leap.Frame.prototype
 * @returns {String} A JSON-formatted string.
 */
Frame.prototype.dump = function() {
  var out = '';
  out += "Frame Info:<br/>";
  out += this.toString();
  out += "<br/><br/>Hands:<br/>"
  for (var handIdx = 0, handCount = this.hands.length; handIdx != handCount; handIdx++) {
    out += "  "+ this.hands[handIdx].toString() + "<br/>";
  }
  out += "<br/><br/>Pointables:<br/>";
  for (var pointableIdx = 0, pointableCount = this.pointables.length; pointableIdx != pointableCount; pointableIdx++) {
      out += "  "+ this.pointables[pointableIdx].toString() + "<br/>";
  }
  if (this.gestures) {
    out += "<br/><br/>Gestures:<br/>";
    for (var gestureIdx = 0, gestureCount = this.gestures.length; gestureIdx != gestureCount; gestureIdx++) {
        out += "  "+ this.gestures[gestureIdx].toString() + "<br/>";
    }
  }
  out += "<br/><br/>Raw JSON:<br/>";
  out += JSON.stringify(this.data);
  return out;
}

/**
 * An invalid Frame object.
 *
 * You can use this invalid Frame in comparisons testing
 * whether a given Frame instance is valid or invalid. (You can also check the
 * [Frame.valid]{@link Leap.Frame#valid} property.)
 *
 * @static
 * @type {Leap.Frame}
 * @name Invalid
 * @memberof Leap.Frame
 */
Frame.Invalid = {
  valid: false,
  hands: [],
  fingers: [],
  tools: [],
  gestures: [],
  pointables: [],
  pointable: function() { return Pointable.Invalid },
  finger: function() { return Pointable.Invalid },
  hand: function() { return Hand.Invalid },
  toString: function() { return "invalid frame" },
  dump: function() { return this.toString() },
  rotationAngle: function() { return 0.0; },
  rotationMatrix: function() { return mat3.create(); },
  rotationAxis: function() { return vec3.create(); },
  scaleFactor: function() { return 1.0; },
  translation: function() { return vec3.create(); }
};

},{"./finger":11,"./gesture":13,"./hand":14,"./interaction_box":16,"./pointable":18,"gl-matrix":24,"underscore":25}],13:[function(require,module,exports){
var glMatrix = require("gl-matrix")
  , vec3 = glMatrix.vec3
  , EventEmitter = require('events').EventEmitter
  , _ = require('underscore');

/**
 * Constructs a new Gesture object.
 *
 * An uninitialized Gesture object is considered invalid. Get valid instances
 * of the Gesture class, which will be one of the Gesture subclasses, from a
 * Frame object.
 *
 * @class Gesture
 * @abstract
 * @memberof Leap
 * @classdesc
 * The Gesture class represents a recognized movement by the user.
 *
 * The Leap watches the activity within its field of view for certain movement
 * patterns typical of a user gesture or command. For example, a movement from side to
 * side with the hand can indicate a swipe gesture, while a finger poking forward
 * can indicate a screen tap gesture.
 *
 * When the Leap recognizes a gesture, it assigns an ID and adds a
 * Gesture object to the frame gesture list. For continuous gestures, which
 * occur over many frames, the Leap updates the gesture by adding
 * a Gesture object having the same ID and updated properties in each
 * subsequent frame.
 *
 * **Important:** Recognition for each type of gesture must be enabled;
 * otherwise **no gestures are recognized or reported**.
 *
 * Subclasses of Gesture define the properties for the specific movement patterns
 * recognized by the Leap.
 *
 * The Gesture subclasses for include:
 *
 * * CircleGesture -- A circular movement by a finger.
 * * SwipeGesture -- A straight line movement by the hand with fingers extended.
 * * ScreenTapGesture -- A forward tapping movement by a finger.
 * * KeyTapGesture -- A downward tapping movement by a finger.
 *
 * Circle and swipe gestures are continuous and these objects can have a
 * state of start, update, and stop.
 *
 * The screen tap gesture is a discrete gesture. The Leap only creates a single
 * ScreenTapGesture object appears for each tap and it always has a stop state.
 *
 * Get valid Gesture instances from a Frame object. You can get a list of gestures
 * from the Frame gestures array. You can also use the Frame gesture() method
 * to find a gesture in the current frame using an ID value obtained in a
 * previous frame.
 *
 * Gesture objects can be invalid. For example, when you get a gesture by ID
 * using Frame.gesture(), and there is no gesture with that ID in the current
 * frame, then gesture() returns an Invalid Gesture object (rather than a null
 * value). Always check object validity in situations where a gesture might be
 * invalid.
 */
var createGesture = exports.createGesture = function(data) {
  var gesture;
  switch (data.type) {
    case 'circle':
      gesture = new CircleGesture(data);
      break;
    case 'swipe':
      gesture = new SwipeGesture(data);
      break;
    case 'screenTap':
      gesture = new ScreenTapGesture(data);
      break;
    case 'keyTap':
      gesture = new KeyTapGesture(data);
      break;
    default:
      throw "unknown gesture type";
  }

 /**
  * The gesture ID.
  *
  * All Gesture objects belonging to the same recognized movement share the
  * same ID value. Use the ID value with the Frame::gesture() method to
  * find updates related to this Gesture object in subsequent frames.
  *
  * @member id
  * @memberof Leap.Gesture.prototype
  * @type {number}
  */
  gesture.id = data.id;
 /**
  * The list of hands associated with this Gesture, if any.
  *
  * If no hands are related to this gesture, the list is empty.
  *
  * @member handIds
  * @memberof Leap.Gesture.prototype
  * @type {Array}
  */
  gesture.handIds = data.handIds.slice();
 /**
  * The list of fingers and tools associated with this Gesture, if any.
  *
  * If no Pointable objects are related to this gesture, the list is empty.
  *
  * @member pointableIds
  * @memberof Leap.Gesture.prototype
  * @type {Array}
  */
  gesture.pointableIds = data.pointableIds.slice();
 /**
  * The elapsed duration of the recognized movement up to the
  * frame containing this Gesture object, in microseconds.
  *
  * The duration reported for the first Gesture in the sequence (with the
  * start state) will typically be a small positive number since
  * the movement must progress far enough for the Leap to recognize it as
  * an intentional gesture.
  *
  * @member duration
  * @memberof Leap.Gesture.prototype
  * @type {number}
  */
  gesture.duration = data.duration;
 /**
  * The gesture ID.
  *
  * Recognized movements occur over time and have a beginning, a middle,
  * and an end. The 'state()' attribute reports where in that sequence this
  * Gesture object falls.
  *
  * Possible values for the state field are:
  *
  * * start
  * * update
  * * stop
  *
  * @member state
  * @memberof Leap.Gesture.prototype
  * @type {String}
  */
  gesture.state = data.state;
 /**
  * The gesture type.
  *
  * Possible values for the type field are:
  *
  * * circle
  * * swipe
  * * screenTap
  * * keyTap
  *
  * @member type
  * @memberof Leap.Gesture.prototype
  * @type {String}
  */
  gesture.type = data.type;
  return gesture;
}

/*
 * Returns a builder object, which uses method chaining for gesture callback binding.
 */
var gestureListener = exports.gestureListener = function(controller, type) {
  var handlers = {};
  var gestureMap = {};

  controller.on('gesture', function(gesture, frame) {
    if (gesture.type == type) {
      if (gesture.state == "start" || gesture.state == "stop") {
        if (gestureMap[gesture.id] === undefined) {
          var gestureTracker = new Gesture(gesture, frame);
          gestureMap[gesture.id] = gestureTracker;
          _.each(handlers, function(cb, name) {
            gestureTracker.on(name, cb);
          });
        }
      }
      gestureMap[gesture.id].update(gesture, frame);
      if (gesture.state == "stop") {
        delete gestureMap[gesture.id];
      }
    }
  });
  var builder = {
    start: function(cb) {
      handlers['start'] = cb;
      return builder;
    },
    stop: function(cb) {
      handlers['stop'] = cb;
      return builder;
    },
    complete: function(cb) {
      handlers['stop'] = cb;
      return builder;
    },
    update: function(cb) {
      handlers['update'] = cb;
      return builder;
    }
  }
  return builder;
}

var Gesture = exports.Gesture = function(gesture, frame) {
  this.gestures = [gesture];
  this.frames = [frame];
}

Gesture.prototype.update = function(gesture, frame) {
  this.lastGesture = gesture;
  this.lastFrame = frame;
  this.gestures.push(gesture);
  this.frames.push(frame);
  this.emit(gesture.state, this);
}

Gesture.prototype.translation = function() {
  return vec3.subtract(vec3.create(), this.lastGesture.startPosition, this.lastGesture.position);
}

_.extend(Gesture.prototype, EventEmitter.prototype);

/**
 * Constructs a new CircleGesture object.
 *
 * An uninitialized CircleGesture object is considered invalid. Get valid instances
 * of the CircleGesture class from a Frame object.
 *
 * @class CircleGesture
 * @memberof Leap
 * @augments Leap.Gesture
 * @classdesc
 * The CircleGesture classes represents a circular finger movement.
 *
 * A circle movement is recognized when the tip of a finger draws a circle
 * within the Leap field of view.
 *
 * ![CircleGesture](images/Leap_Gesture_Circle.png)
 *
 * Circle gestures are continuous. The CircleGesture objects for the gesture have
 * three possible states:
 *
 * * start -- The circle gesture has just started. The movement has
 *  progressed far enough for the recognizer to classify it as a circle.
 * * update -- The circle gesture is continuing.
 * * stop -- The circle gesture is finished.
 */
var CircleGesture = function(data) {
 /**
  * The center point of the circle within the Leap frame of reference.
  *
  * @member center
  * @memberof Leap.CircleGesture.prototype
  * @type {number[]}
  */
  this.center = data.center;
 /**
  * The normal vector for the circle being traced.
  *
  * If you draw the circle clockwise, the normal vector points in the same
  * general direction as the pointable object drawing the circle. If you draw
  * the circle counterclockwise, the normal points back toward the
  * pointable. If the angle between the normal and the pointable object
  * drawing the circle is less than 90 degrees, then the circle is clockwise.
  *
  * ```javascript
  *    var clockwiseness;
  *    if (circle.pointable.direction.angleTo(circle.normal) <= PI/4) {
  *        clockwiseness = "clockwise";
  *    }
  *    else
  *    {
  *        clockwiseness = "counterclockwise";
  *    }
  * ```
  *
  * @member normal
  * @memberof Leap.CircleGesture.prototype
  * @type {number[]}
  */
  this.normal = data.normal;
 /**
  * The number of times the finger tip has traversed the circle.
  *
  * Progress is reported as a positive number of the number. For example,
  * a progress value of .5 indicates that the finger has gone halfway
  * around, while a value of 3 indicates that the finger has gone around
  * the the circle three times.
  *
  * Progress starts where the circle gesture began. Since the circle
  * must be partially formed before the Leap can recognize it, progress
  * will be greater than zero when a circle gesture first appears in the
  * frame.
  *
  * @member progress
  * @memberof Leap.CircleGesture.prototype
  * @type {number}
  */
  this.progress = data.progress;
 /**
  * The radius of the circle in mm.
  *
  * @member radius
  * @memberof Leap.CircleGesture.prototype
  * @type {number}
  */
  this.radius = data.radius;
}

CircleGesture.prototype.toString = function() {
  return "CircleGesture ["+JSON.stringify(this)+"]";
}

/**
 * Constructs a new SwipeGesture object.
 *
 * An uninitialized SwipeGesture object is considered invalid. Get valid instances
 * of the SwipeGesture class from a Frame object.
 *
 * @class SwipeGesture
 * @memberof Leap
 * @augments Leap.Gesture
 * @classdesc
 * The SwipeGesture class represents a swiping motion of a finger or tool.
 *
 * ![SwipeGesture](images/Leap_Gesture_Swipe.png)
 *
 * Swipe gestures are continuous.
 */
var SwipeGesture = function(data) {
 /**
  * The starting position within the Leap frame of
  * reference, in mm.
  *
  * @member startPosition
  * @memberof Leap.SwipeGesture.prototype
  * @type {number[]}
  */
  this.startPosition = data.startPosition;
 /**
  * The current swipe position within the Leap frame of
  * reference, in mm.
  *
  * @member position
  * @memberof Leap.SwipeGesture.prototype
  * @type {number[]}
  */
  this.position = data.position;
 /**
  * The unit direction vector parallel to the swipe motion.
  *
  * You can compare the components of the vector to classify the swipe as
  * appropriate for your application. For example, if you are using swipes
  * for two dimensional scrolling, you can compare the x and y values to
  * determine if the swipe is primarily horizontal or vertical.
  *
  * @member direction
  * @memberof Leap.SwipeGesture.prototype
  * @type {number[]}
  */
  this.direction = data.direction;
 /**
  * The speed of the finger performing the swipe gesture in
  * millimeters per second.
  *
  * @member speed
  * @memberof Leap.SwipeGesture.prototype
  * @type {number}
  */
  this.speed = data.speed;
}

SwipeGesture.prototype.toString = function() {
  return "SwipeGesture ["+JSON.stringify(this)+"]";
}

/**
 * Constructs a new ScreenTapGesture object.
 *
 * An uninitialized ScreenTapGesture object is considered invalid. Get valid instances
 * of the ScreenTapGesture class from a Frame object.
 *
 * @class ScreenTapGesture
 * @memberof Leap
 * @augments Leap.Gesture
 * @classdesc
 * The ScreenTapGesture class represents a tapping gesture by a finger or tool.
 *
 * A screen tap gesture is recognized when the tip of a finger pokes forward
 * and then springs back to approximately the original postion, as if
 * tapping a vertical screen. The tapping finger must pause briefly before beginning the tap.
 *
 * ![ScreenTap](images/Leap_Gesture_Tap2.png)
 *
 * ScreenTap gestures are discrete. The ScreenTapGesture object representing a tap always
 * has the state, STATE_STOP. Only one ScreenTapGesture object is created for each
 * screen tap gesture recognized.
 */
var ScreenTapGesture = function(data) {
 /**
  * The position where the screen tap is registered.
  *
  * @member position
  * @memberof Leap.ScreenTapGesture.prototype
  * @type {number[]}
  */
  this.position = data.position;
 /**
  * The direction of finger tip motion.
  *
  * @member direction
  * @memberof Leap.ScreenTapGesture.prototype
  * @type {number[]}
  */
  this.direction = data.direction;
 /**
  * The progess value is always 1.0 for a screen tap gesture.
  *
  * @member progress
  * @memberof Leap.ScreenTapGesture.prototype
  * @type {number}
  */
  this.progress = data.progress;
}

ScreenTapGesture.prototype.toString = function() {
  return "ScreenTapGesture ["+JSON.stringify(this)+"]";
}

/**
 * Constructs a new KeyTapGesture object.
 *
 * An uninitialized KeyTapGesture object is considered invalid. Get valid instances
 * of the KeyTapGesture class from a Frame object.
 *
 * @class KeyTapGesture
 * @memberof Leap
 * @augments Leap.Gesture
 * @classdesc
 * The KeyTapGesture class represents a tapping gesture by a finger or tool.
 *
 * A key tap gesture is recognized when the tip of a finger rotates down toward the
 * palm and then springs back to approximately the original postion, as if
 * tapping. The tapping finger must pause briefly before beginning the tap.
 *
 * ![KeyTap](images/Leap_Gesture_Tap.png)
 *
 * Key tap gestures are discrete. The KeyTapGesture object representing a tap always
 * has the state, STATE_STOP. Only one KeyTapGesture object is created for each
 * key tap gesture recognized.
 */
var KeyTapGesture = function(data) {
    /**
     * The position where the key tap is registered.
     *
     * @member position
     * @memberof Leap.KeyTapGesture.prototype
     * @type {number[]}
     */
    this.position = data.position;
    /**
     * The direction of finger tip motion.
     *
     * @member direction
     * @memberof Leap.KeyTapGesture.prototype
     * @type {number[]}
     */
    this.direction = data.direction;
    /**
     * The progess value is always 1.0 for a key tap gesture.
     *
     * @member progress
     * @memberof Leap.KeyTapGesture.prototype
     * @type {number}
     */
    this.progress = data.progress;
}

KeyTapGesture.prototype.toString = function() {
  return "KeyTapGesture ["+JSON.stringify(this)+"]";
}

},{"events":49,"gl-matrix":24,"underscore":25}],14:[function(require,module,exports){
var Pointable = require("./pointable")
  , Bone = require('./bone')
  , glMatrix = require("gl-matrix")
  , mat3 = glMatrix.mat3
  , vec3 = glMatrix.vec3
  , _ = require("underscore");

/**
 * Constructs a Hand object.
 *
 * An uninitialized hand is considered invalid.
 * Get valid Hand objects from a Frame object.
 * @class Hand
 * @memberof Leap
 * @classdesc
 * The Hand class reports the physical characteristics of a detected hand.
 *
 * Hand tracking data includes a palm position and velocity; vectors for
 * the palm normal and direction to the fingers; properties of a sphere fit
 * to the hand; and lists of the attached fingers and tools.
 *
 * Note that Hand objects can be invalid, which means that they do not contain
 * valid tracking data and do not correspond to a physical entity. Invalid Hand
 * objects can be the result of asking for a Hand object using an ID from an
 * earlier frame when no Hand objects with that ID exist in the current frame.
 * A Hand object created from the Hand constructor is also invalid.
 * Test for validity with the [Hand.valid]{@link Leap.Hand#valid} property.
 */
var Hand = module.exports = function(data) {
  /**
   * A unique ID assigned to this Hand object, whose value remains the same
   * across consecutive frames while the tracked hand remains visible. If
   * tracking is lost (for example, when a hand is occluded by another hand
   * or when it is withdrawn from or reaches the edge of the Leap field of view),
   * the Leap may assign a new ID when it detects the hand in a future frame.
   *
   * Use the ID value with the {@link Frame.hand}() function to find this
   * Hand object in future frames.
   *
   * @member id
   * @memberof Leap.Hand.prototype
   * @type {String}
   */
  this.id = data.id;
  /**
   * The center position of the palm in millimeters from the Leap origin.
   * @member palmPosition
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
  this.palmPosition = data.palmPosition;
  /**
   * The direction from the palm position toward the fingers.
   *
   * The direction is expressed as a unit vector pointing in the same
   * direction as the directed line from the palm position to the fingers.
   *
   * @member direction
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
  this.direction = data.direction;
  /**
   * The rate of change of the palm position in millimeters/second.
   *
   * @member palmVeclocity
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
  this.palmVelocity = data.palmVelocity;
  /**
   * The normal vector to the palm. If your hand is flat, this vector will
   * point downward, or "out" of the front surface of your palm.
   *
   * ![Palm Vectors](images/Leap_Palm_Vectors.png)
   *
   * The direction is expressed as a unit vector pointing in the same
   * direction as the palm normal (that is, a vector orthogonal to the palm).
   * @member palmNormal
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
  this.palmNormal = data.palmNormal;
  /**
   * The center of a sphere fit to the curvature of this hand.
   *
   * This sphere is placed roughly as if the hand were holding a ball.
   *
   * ![Hand Ball](images/Leap_Hand_Ball.png)
   * @member sphereCenter
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
  this.sphereCenter = data.sphereCenter;
  /**
   * The radius of a sphere fit to the curvature of this hand, in millimeters.
   *
   * This sphere is placed roughly as if the hand were holding a ball. Thus the
   * size of the sphere decreases as the fingers are curled into a fist.
   *
   * @member sphereRadius
   * @memberof Leap.Hand.prototype
   * @type {number}
   */
  this.sphereRadius = data.sphereRadius;
  /**
   * Reports whether this is a valid Hand object.
   *
   * @member valid
   * @memberof Leap.Hand.prototype
   * @type {boolean}
   */
  this.valid = true;
  /**
   * The list of Pointable objects (fingers and tools) detected in this frame
   * that are associated with this hand, given in arbitrary order. The list
   * can be empty if no fingers or tools associated with this hand are detected.
   *
   * Use the {@link Pointable} tool property to determine
   * whether or not an item in the list represents a tool or finger.
   * You can also get only the tools using the Hand.tools[] list or
   * only the fingers using the Hand.fingers[] list.
   *
   * @member pointables[]
   * @memberof Leap.Hand.prototype
   * @type {Leap.Pointable[]}
   */
  this.pointables = [];
  /**
   * The list of fingers detected in this frame that are attached to
   * this hand, given in arbitrary order.
   *
   * The list can be empty if no fingers attached to this hand are detected.
   *
   * @member fingers[]
   * @memberof Leap.Hand.prototype
   * @type {Leap.Pointable[]}
   */
  this.fingers = [];
  
  if (data.armBasis){
    this.arm = new Bone(this, {
      type: 4,
      width: data.armWidth,
      prevJoint: data.elbow,
      nextJoint: data.wrist,
      basis: data.armBasis
    });
  }else{
    this.arm = null;
  }
  
  /**
   * The list of tools detected in this frame that are held by this
   * hand, given in arbitrary order.
   *
   * The list can be empty if no tools held by this hand are detected.
   *
   * @member tools[]
   * @memberof Leap.Hand.prototype
   * @type {Leap.Pointable[]}
   */
  this.tools = [];
  this._translation = data.t;
  this._rotation = _.flatten(data.r);
  this._scaleFactor = data.s;

  /**
   * Time the hand has been visible in seconds.
   *
   * @member timeVisible
   * @memberof Leap.Hand.prototype
   * @type {number}
   */
   this.timeVisible = data.timeVisible;

  /**
   * The palm position with stabalization
   * @member stabilizedPalmPosition
   * @memberof Leap.Hand.prototype
   * @type {number[]}
   */
   this.stabilizedPalmPosition = data.stabilizedPalmPosition;

   /**
   * Reports whether this is a left or a right hand.
   *
   * @member type
   * @type {String}
   * @memberof Leap.Hand.prototype
   */
   this.type = data.type;
   this.grabStrength = data.grabStrength;
   this.pinchStrength = data.pinchStrength;
   this.confidence = data.confidence;
}

/**
 * The finger with the specified ID attached to this hand.
 *
 * Use this function to retrieve a Pointable object representing a finger
 * attached to this hand using an ID value obtained from a previous frame.
 * This function always returns a Pointable object, but if no finger
 * with the specified ID is present, an invalid Pointable object is returned.
 *
 * Note that the ID values assigned to fingers persist across frames, but only
 * until tracking of a particular finger is lost. If tracking of a finger is
 * lost and subsequently regained, the new Finger object representing that
 * finger may have a different ID than that representing the finger in an
 * earlier frame.
 *
 * @method finger
 * @memberof Leap.Hand.prototype
 * @param {String} id The ID value of a finger from a previous frame.
 * @returns {Leap.Pointable} The Finger object with
 * the matching ID if one exists for this hand in this frame; otherwise, an
 * invalid Finger object is returned.
 */
Hand.prototype.finger = function(id) {
  var finger = this.frame.finger(id);
  return (finger && (finger.handId == this.id)) ? finger : Pointable.Invalid;
}

/**
 * The angle of rotation around the rotation axis derived from the change in
 * orientation of this hand, and any associated fingers and tools, between the
 * current frame and the specified frame.
 *
 * The returned angle is expressed in radians measured clockwise around the
 * rotation axis (using the right-hand rule) between the start and end frames.
 * The value is always between 0 and pi radians (0 and 180 degrees).
 *
 * If a corresponding Hand object is not found in sinceFrame, or if either
 * this frame or sinceFrame are invalid Frame objects, then the angle of rotation is zero.
 *
 * @method rotationAngle
 * @memberof Leap.Hand.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @param {numnber[]} [axis] The axis to measure rotation around.
 * @returns {number} A positive value representing the heuristically determined
 * rotational change of the hand between the current frame and that specified in
 * the sinceFrame parameter.
 */
Hand.prototype.rotationAngle = function(sinceFrame, axis) {
  if (!this.valid || !sinceFrame.valid) return 0.0;
  var sinceHand = sinceFrame.hand(this.id);
  if(!sinceHand.valid) return 0.0;
  var rot = this.rotationMatrix(sinceFrame);
  var cs = (rot[0] + rot[4] + rot[8] - 1.0)*0.5
  var angle = Math.acos(cs);
  angle = isNaN(angle) ? 0.0 : angle;
  if (axis !== undefined) {
    var rotAxis = this.rotationAxis(sinceFrame);
    angle *= vec3.dot(rotAxis, vec3.normalize(vec3.create(), axis));
  }
  return angle;
}

/**
 * The axis of rotation derived from the change in orientation of this hand, and
 * any associated fingers and tools, between the current frame and the specified frame.
 *
 * The returned direction vector is normalized.
 *
 * If a corresponding Hand object is not found in sinceFrame, or if either
 * this frame or sinceFrame are invalid Frame objects, then this method returns a zero vector.
 *
 * @method rotationAxis
 * @memberof Leap.Hand.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @returns {number[]} A normalized direction Vector representing the axis of the heuristically determined
 * rotational change of the hand between the current frame and that specified in the sinceFrame parameter.
 */
Hand.prototype.rotationAxis = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return vec3.create();
  var sinceHand = sinceFrame.hand(this.id);
  if (!sinceHand.valid) return vec3.create();
  return vec3.normalize(vec3.create(), [
    this._rotation[7] - sinceHand._rotation[5],
    this._rotation[2] - sinceHand._rotation[6],
    this._rotation[3] - sinceHand._rotation[1]
  ]);
}

/**
 * The transform matrix expressing the rotation derived from the change in
 * orientation of this hand, and any associated fingers and tools, between
 * the current frame and the specified frame.
 *
 * If a corresponding Hand object is not found in sinceFrame, or if either
 * this frame or sinceFrame are invalid Frame objects, then this method returns
 * an identity matrix.
 *
 * @method rotationMatrix
 * @memberof Leap.Hand.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative rotation.
 * @returns {number[]} A transformation Matrix containing the heuristically determined
 * rotational change of the hand between the current frame and that specified in the sinceFrame parameter.
 */
Hand.prototype.rotationMatrix = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return mat3.create();
  var sinceHand = sinceFrame.hand(this.id);
  if(!sinceHand.valid) return mat3.create();
  var transpose = mat3.transpose(mat3.create(), this._rotation);
  var m = mat3.multiply(mat3.create(), sinceHand._rotation, transpose);
  return m;
}

/**
 * The scale factor derived from the hand's motion between the current frame and the specified frame.
 *
 * The scale factor is always positive. A value of 1.0 indicates no scaling took place.
 * Values between 0.0 and 1.0 indicate contraction and values greater than 1.0 indicate expansion.
 *
 * The Leap derives scaling from the relative inward or outward motion of a hand
 * and its associated fingers and tools (independent of translation and rotation).
 *
 * If a corresponding Hand object is not found in sinceFrame, or if either this frame or sinceFrame
 * are invalid Frame objects, then this method returns 1.0.
 *
 * @method scaleFactor
 * @memberof Leap.Hand.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative scaling.
 * @returns {number} A positive value representing the heuristically determined
 * scaling change ratio of the hand between the current frame and that specified in the sinceFrame parameter.
 */
Hand.prototype.scaleFactor = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return 1.0;
  var sinceHand = sinceFrame.hand(this.id);
  if(!sinceHand.valid) return 1.0;

  return Math.exp(this._scaleFactor - sinceHand._scaleFactor);
}

/**
 * The change of position of this hand between the current frame and the specified frame
 *
 * The returned translation vector provides the magnitude and direction of the
 * movement in millimeters.
 *
 * If a corresponding Hand object is not found in sinceFrame, or if either this frame or
 * sinceFrame are invalid Frame objects, then this method returns a zero vector.
 *
 * @method translation
 * @memberof Leap.Hand.prototype
 * @param {Leap.Frame} sinceFrame The starting frame for computing the relative translation.
 * @returns {number[]} A Vector representing the heuristically determined change in hand
 * position between the current frame and that specified in the sinceFrame parameter.
 */
Hand.prototype.translation = function(sinceFrame) {
  if (!this.valid || !sinceFrame.valid) return vec3.create();
  var sinceHand = sinceFrame.hand(this.id);
  if(!sinceHand.valid) return vec3.create();
  return [
    this._translation[0] - sinceHand._translation[0],
    this._translation[1] - sinceHand._translation[1],
    this._translation[2] - sinceHand._translation[2]
  ];
}

/**
 * A string containing a brief, human readable description of the Hand object.
 * @method toString
 * @memberof Leap.Hand.prototype
 * @returns {String} A description of the Hand as a string.
 */
Hand.prototype.toString = function() {
  return "Hand (" + this.type + ") [ id: "+ this.id + " | palm velocity:"+this.palmVelocity+" | sphere center:"+this.sphereCenter+" ] ";
}

/**
 * The pitch angle in radians.
 *
 * Pitch is the angle between the negative z-axis and the projection of
 * the vector onto the y-z plane. In other words, pitch represents rotation
 * around the x-axis.
 * If the vector points upward, the returned angle is between 0 and pi radians
 * (180 degrees); if it points downward, the angle is between 0 and -pi radians.
 *
 * @method pitch
 * @memberof Leap.Hand.prototype
 * @returns {number} The angle of this vector above or below the horizon (x-z plane).
 *
 */
Hand.prototype.pitch = function() {
  return Math.atan2(this.direction[1], -this.direction[2]);
}

/**
 *  The yaw angle in radians.
 *
 * Yaw is the angle between the negative z-axis and the projection of
 * the vector onto the x-z plane. In other words, yaw represents rotation
 * around the y-axis. If the vector points to the right of the negative z-axis,
 * then the returned angle is between 0 and pi radians (180 degrees);
 * if it points to the left, the angle is between 0 and -pi radians.
 *
 * @method yaw
 * @memberof Leap.Hand.prototype
 * @returns {number} The angle of this vector to the right or left of the y-axis.
 *
 */
Hand.prototype.yaw = function() {
  return Math.atan2(this.direction[0], -this.direction[2]);
}

/**
 *  The roll angle in radians.
 *
 * Roll is the angle between the y-axis and the projection of
 * the vector onto the x-y plane. In other words, roll represents rotation
 * around the z-axis. If the vector points to the left of the y-axis,
 * then the returned angle is between 0 and pi radians (180 degrees);
 * if it points to the right, the angle is between 0 and -pi radians.
 *
 * @method roll
 * @memberof Leap.Hand.prototype
 * @returns {number} The angle of this vector to the right or left of the y-axis.
 *
 */
Hand.prototype.roll = function() {
  return Math.atan2(this.palmNormal[0], -this.palmNormal[1]);
}

/**
 * An invalid Hand object.
 *
 * You can use an invalid Hand object in comparisons testing
 * whether a given Hand instance is valid or invalid. (You can also use the
 * Hand valid property.)
 *
 * @static
 * @type {Leap.Hand}
 * @name Invalid
 * @memberof Leap.Hand
 */
Hand.Invalid = {
  valid: false,
  fingers: [],
  tools: [],
  pointables: [],
  left: false,
  pointable: function() { return Pointable.Invalid },
  finger: function() { return Pointable.Invalid },
  toString: function() { return "invalid frame" },
  dump: function() { return this.toString(); },
  rotationAngle: function() { return 0.0; },
  rotationMatrix: function() { return mat3.create(); },
  rotationAxis: function() { return vec3.create(); },
  scaleFactor: function() { return 1.0; },
  translation: function() { return vec3.create(); }
};

},{"./bone":4,"./pointable":18,"gl-matrix":24,"underscore":25}],15:[function(require,module,exports){
/**
 * Leap is the global namespace of the Leap API.
 * @namespace Leap
 */
module.exports = {
  Controller: require("./controller"),
  Frame: require("./frame"),
  Gesture: require("./gesture"),
  Hand: require("./hand"),
  Pointable: require("./pointable"),
  Finger: require("./finger"),
  InteractionBox: require("./interaction_box"),
  CircularBuffer: require("./circular_buffer"),
  UI: require("./ui"),
  JSONProtocol: require("./protocol").JSONProtocol,
  glMatrix: require("gl-matrix"),
  mat3: require("gl-matrix").mat3,
  vec3: require("gl-matrix").vec3,
  loopController: undefined,
  version: require('./version.js'),

  /**
   * Expose utility libraries for convenience
   * Use carefully - they may be subject to upgrade or removal in different versions of LeapJS.
   *
   */
  _: require('underscore'),
  EventEmitter: require('events').EventEmitter,

  /**
   * The Leap.loop() function passes a frame of Leap data to your
   * callback function and then calls window.requestAnimationFrame() after
   * executing your callback function.
   *
   * Leap.loop() sets up the Leap controller and WebSocket connection for you.
   * You do not need to create your own controller when using this method.
   *
   * Your callback function is called on an interval determined by the client
   * browser. Typically, this is on an interval of 60 frames/second. The most
   * recent frame of Leap data is passed to your callback function. If the Leap
   * is producing frames at a slower rate than the browser frame rate, the same
   * frame of Leap data can be passed to your function in successive animation
   * updates.
   *
   * As an alternative, you can create your own Controller object and use a
   * {@link Controller#onFrame onFrame} callback to process the data at
   * the frame rate of the Leap device. See {@link Controller} for an
   * example.
   *
   * @method Leap.loop
   * @param {function} callback A function called when the browser is ready to
   * draw to the screen. The most recent {@link Frame} object is passed to
   * your callback function.
   *
   * ```javascript
   *    Leap.loop( function( frame ) {
   *        // ... your code here
   *    })
   * ```
   */
  loop: function(opts, callback) {
    if (opts && callback === undefined &&  ( ({}).toString.call(opts) === '[object Function]' ) ) {
      callback = opts;
      opts = {};
    }

    if (this.loopController) {
      if (opts){
        this.loopController.setupFrameEvents(opts);
      }
    }else{
      this.loopController = new this.Controller(opts);
    }

    this.loopController.loop(callback);
    return this.loopController;
  },

  /*
   * Convenience method for Leap.Controller.plugin
   */
  plugin: function(name, options){
    this.Controller.plugin(name, options)
  }
}

},{"./circular_buffer":5,"./controller":9,"./finger":11,"./frame":12,"./gesture":13,"./hand":14,"./interaction_box":16,"./pointable":18,"./protocol":19,"./ui":20,"./version.js":23,"events":49,"gl-matrix":24,"underscore":25}],16:[function(require,module,exports){
var glMatrix = require("gl-matrix")
  , vec3 = glMatrix.vec3;

/**
 * Constructs a InteractionBox object.
 *
 * @class InteractionBox
 * @memberof Leap
 * @classdesc
 * The InteractionBox class represents a box-shaped region completely within
 * the field of view of the Leap Motion controller.
 *
 * The interaction box is an axis-aligned rectangular prism and provides
 * normalized coordinates for hands, fingers, and tools within this box.
 * The InteractionBox class can make it easier to map positions in the
 * Leap Motion coordinate system to 2D or 3D coordinate systems used
 * for application drawing.
 *
 * ![Interaction Box](images/Leap_InteractionBox.png)
 *
 * The InteractionBox region is defined by a center and dimensions along the x, y, and z axes.
 */
var InteractionBox = module.exports = function(data) {
  /**
   * Indicates whether this is a valid InteractionBox object.
   *
   * @member valid
   * @type {Boolean}
   * @memberof Leap.InteractionBox.prototype
   */
  this.valid = true;
  /**
   * The center of the InteractionBox in device coordinates (millimeters).
   * This point is equidistant from all sides of the box.
   *
   * @member center
   * @type {number[]}
   * @memberof Leap.InteractionBox.prototype
   */
  this.center = data.center;

  this.size = data.size;
  /**
   * The width of the InteractionBox in millimeters, measured along the x-axis.
   *
   * @member width
   * @type {number}
   * @memberof Leap.InteractionBox.prototype
   */
  this.width = data.size[0];
  /**
   * The height of the InteractionBox in millimeters, measured along the y-axis.
   *
   * @member height
   * @type {number}
   * @memberof Leap.InteractionBox.prototype
   */
  this.height = data.size[1];
  /**
   * The depth of the InteractionBox in millimeters, measured along the z-axis.
   *
   * @member depth
   * @type {number}
   * @memberof Leap.InteractionBox.prototype
   */
  this.depth = data.size[2];
}

/**
 * Converts a position defined by normalized InteractionBox coordinates
 * into device coordinates in millimeters.
 *
 * This function performs the inverse of normalizePoint().
 *
 * @method denormalizePoint
 * @memberof Leap.InteractionBox.prototype
 * @param {number[]} normalizedPosition The input position in InteractionBox coordinates.
 * @returns {number[]} The corresponding denormalized position in device coordinates.
 */
InteractionBox.prototype.denormalizePoint = function(normalizedPosition) {
  return vec3.fromValues(
    (normalizedPosition[0] - 0.5) * this.size[0] + this.center[0],
    (normalizedPosition[1] - 0.5) * this.size[1] + this.center[1],
    (normalizedPosition[2] - 0.5) * this.size[2] + this.center[2]
  );
}

/**
 * Normalizes the coordinates of a point using the interaction box.
 *
 * Coordinates from the Leap Motion frame of reference (millimeters) are
 * converted to a range of [0..1] such that the minimum value of the
 * InteractionBox maps to 0 and the maximum value of the InteractionBox maps to 1.
 *
 * @method normalizePoint
 * @memberof Leap.InteractionBox.prototype
 * @param {number[]} position The input position in device coordinates.
 * @param {Boolean} clamp Whether or not to limit the output value to the range [0,1]
 * when the input position is outside the InteractionBox. Defaults to true.
 * @returns {number[]} The normalized position.
 */
InteractionBox.prototype.normalizePoint = function(position, clamp) {
  var vec = vec3.fromValues(
    ((position[0] - this.center[0]) / this.size[0]) + 0.5,
    ((position[1] - this.center[1]) / this.size[1]) + 0.5,
    ((position[2] - this.center[2]) / this.size[2]) + 0.5
  );

  if (clamp) {
    vec[0] = Math.min(Math.max(vec[0], 0), 1);
    vec[1] = Math.min(Math.max(vec[1], 0), 1);
    vec[2] = Math.min(Math.max(vec[2], 0), 1);
  }
  return vec;
}

/**
 * Writes a brief, human readable description of the InteractionBox object.
 *
 * @method toString
 * @memberof Leap.InteractionBox.prototype
 * @returns {String} A description of the InteractionBox object as a string.
 */
InteractionBox.prototype.toString = function() {
  return "InteractionBox [ width:" + this.width + " | height:" + this.height + " | depth:" + this.depth + " ]";
}

/**
 * An invalid InteractionBox object.
 *
 * You can use this InteractionBox instance in comparisons testing
 * whether a given InteractionBox instance is valid or invalid. (You can also use the
 * InteractionBox.valid property.)
 *
 * @static
 * @type {Leap.InteractionBox}
 * @name Invalid
 * @memberof Leap.InteractionBox
 */
InteractionBox.Invalid = { valid: false };

},{"gl-matrix":24}],17:[function(require,module,exports){
var Pipeline = module.exports = function (controller) {
  this.steps = [];
  this.controller = controller;
}

Pipeline.prototype.addStep = function (step) {
  this.steps.push(step);
}

Pipeline.prototype.run = function (frame) {
  var stepsLength = this.steps.length;
  for (var i = 0; i != stepsLength; i++) {
    if (!frame) break;
    frame = this.steps[i](frame);
  }
  return frame;
}

Pipeline.prototype.removeStep = function(step){
  var index = this.steps.indexOf(step);
  if (index === -1) throw "Step not found in pipeline";
  this.steps.splice(index, 1);
}

/*
 * Wraps a plugin callback method in method which can be run inside the pipeline.
 * This wrapper method loops the callback over objects within the frame as is appropriate,
 * calling the callback for each in turn.
 *
 * @method createStepFunction
 * @memberOf Leap.Controller.prototype
 * @param {Controller} The controller on which the callback is called.
 * @param {String} type What frame object the callback is run for and receives.
 *       Can be one of 'frame', 'finger', 'hand', 'pointable', 'tool'
 * @param {function} callback The method which will be run inside the pipeline loop.  Receives one argument, such as a hand.
 * @private
 */
Pipeline.prototype.addWrappedStep = function (type, callback) {
  var controller = this.controller,
    step = function (frame) {
      var dependencies, i, len;
      dependencies = (type == 'frame') ? [frame] : (frame[type + 's'] || []);

      for (i = 0, len = dependencies.length; i < len; i++) {
        callback.call(controller, dependencies[i]);
      }

      return frame;
    };

  this.addStep(step);
  return step;
};
},{}],18:[function(require,module,exports){
var glMatrix = require("gl-matrix")
  , vec3 = glMatrix.vec3;

/**
 * Constructs a Pointable object.
 *
 * An uninitialized pointable is considered invalid.
 * Get valid Pointable objects from a Frame or a Hand object.
 *
 * @class Pointable
 * @memberof Leap
 * @classdesc
 * The Pointable class reports the physical characteristics of a detected
 * finger or tool.
 *
 * Both fingers and tools are classified as Pointable objects. Use the
 * Pointable.tool property to determine whether a Pointable object represents a
 * tool or finger. The Leap classifies a detected entity as a tool when it is
 * thinner, straighter, and longer than a typical finger.
 *
 * Note that Pointable objects can be invalid, which means that they do not
 * contain valid tracking data and do not correspond to a physical entity.
 * Invalid Pointable objects can be the result of asking for a Pointable object
 * using an ID from an earlier frame when no Pointable objects with that ID
 * exist in the current frame. A Pointable object created from the Pointable
 * constructor is also invalid. Test for validity with the Pointable.valid
 * property.
 */
var Pointable = module.exports = function(data) {
  /**
   * Indicates whether this is a valid Pointable object.
   *
   * @member valid
   * @type {Boolean}
   * @memberof Leap.Pointable.prototype
   */
  this.valid = true;
  /**
   * A unique ID assigned to this Pointable object, whose value remains the
   * same across consecutive frames while the tracked finger or tool remains
   * visible. If tracking is lost (for example, when a finger is occluded by
   * another finger or when it is withdrawn from the Leap field of view), the
   * Leap may assign a new ID when it detects the entity in a future frame.
   *
   * Use the ID value with the pointable() functions defined for the
   * {@link Frame} and {@link Frame.Hand} classes to find this
   * Pointable object in future frames.
   *
   * @member id
   * @type {String}
   * @memberof Leap.Pointable.prototype
   */
  this.id = data.id;
  this.handId = data.handId;
  /**
   * The estimated length of the finger or tool in millimeters.
   *
   * The reported length is the visible length of the finger or tool from the
   * hand to tip. If the length isn't known, then a value of 0 is returned.
   *
   * @member length
   * @type {number}
   * @memberof Leap.Pointable.prototype
   */
  this.length = data.length;
  /**
   * Whether or not the Pointable is believed to be a tool.
   * Tools are generally longer, thinner, and straighter than fingers.
   *
   * If tool is false, then this Pointable must be a finger.
   *
   * @member tool
   * @type {Boolean}
   * @memberof Leap.Pointable.prototype
   */
  this.tool = data.tool;
  /**
   * The estimated width of the tool in millimeters.
   *
   * The reported width is the average width of the visible portion of the
   * tool from the hand to the tip. If the width isn't known,
   * then a value of 0 is returned.
   *
   * Pointable objects representing fingers do not have a width property.
   *
   * @member width
   * @type {number}
   * @memberof Leap.Pointable.prototype
   */
  this.width = data.width;
  /**
   * The direction in which this finger or tool is pointing.
   *
   * The direction is expressed as a unit vector pointing in the same
   * direction as the tip.
   *
   * ![Finger](images/Leap_Finger_Model.png)
   * @member direction
   * @type {number[]}
   * @memberof Leap.Pointable.prototype
   */
  this.direction = data.direction;
  /**
   * The tip position in millimeters from the Leap origin.
   * Stabilized
   *
   * @member stabilizedTipPosition
   * @type {number[]}
   * @memberof Leap.Pointable.prototype
   */
  this.stabilizedTipPosition = data.stabilizedTipPosition;
  /**
   * The tip position in millimeters from the Leap origin.
   *
   * @member tipPosition
   * @type {number[]}
   * @memberof Leap.Pointable.prototype
   */
  this.tipPosition = data.tipPosition;
  /**
   * The rate of change of the tip position in millimeters/second.
   *
   * @member tipVelocity
   * @type {number[]}
   * @memberof Leap.Pointable.prototype
   */
  this.tipVelocity = data.tipVelocity;
  /**
   * The current touch zone of this Pointable object.
   *
   * The Leap Motion software computes the touch zone based on a floating touch
   * plane that adapts to the user's finger movement and hand posture. The Leap
   * Motion software interprets purposeful movements toward this plane as potential touch
   * points. When a Pointable moves close to the adaptive touch plane, it enters the
   * "hovering" zone. When a Pointable reaches or passes through the plane, it enters
   * the "touching" zone.
   *
   * The possible states include:
   *
   * * "none" -- The Pointable is outside the hovering zone.
   * * "hovering" -- The Pointable is close to, but not touching the touch plane.
   * * "touching" -- The Pointable has penetrated the touch plane.
   *
   * The touchDistance value provides a normalized indication of the distance to
   * the touch plane when the Pointable is in the hovering or touching zones.
   *
   * @member touchZone
   * @type {String}
   * @memberof Leap.Pointable.prototype
   */
  this.touchZone = data.touchZone;
  /**
   * A value proportional to the distance between this Pointable object and the
   * adaptive touch plane.
   *
   * ![Touch Distance](images/Leap_Touch_Plane.png)
   *
   * The touch distance is a value in the range [-1, 1]. The value 1.0 indicates the
   * Pointable is at the far edge of the hovering zone. The value 0 indicates the
   * Pointable is just entering the touching zone. A value of -1.0 indicates the
   * Pointable is firmly within the touching zone. Values in between are
   * proportional to the distance from the plane. Thus, the touchDistance of 0.5
   * indicates that the Pointable is halfway into the hovering zone.
   *
   * You can use the touchDistance value to modulate visual feedback given to the
   * user as their fingers close in on a touch target, such as a button.
   *
   * @member touchDistance
   * @type {number}
   * @memberof Leap.Pointable.prototype
   */
  this.touchDistance = data.touchDistance;

  /**
   * How long the pointable has been visible in seconds.
   *
   * @member timeVisible
   * @type {number}
   * @memberof Leap.Pointable.prototype
   */
  this.timeVisible = data.timeVisible;
}

/**
 * A string containing a brief, human readable description of the Pointable
 * object.
 *
 * @method toString
 * @memberof Leap.Pointable.prototype
 * @returns {String} A description of the Pointable object as a string.
 */
Pointable.prototype.toString = function() {
  return "Pointable [ id:" + this.id + " " + this.length + "mmx | width:" + this.width + "mm | direction:" + this.direction + ' ]';
}

/**
 * Returns the hand which the pointable is attached to.
 */
Pointable.prototype.hand = function(){
  return this.frame.hand(this.handId);
}

/**
 * An invalid Pointable object.
 *
 * You can use this Pointable instance in comparisons testing
 * whether a given Pointable instance is valid or invalid. (You can also use the
 * Pointable.valid property.)

 * @static
 * @type {Leap.Pointable}
 * @name Invalid
 * @memberof Leap.Pointable
 */
Pointable.Invalid = { valid: false };

},{"gl-matrix":24}],19:[function(require,module,exports){
var Frame = require('./frame')
  , Hand = require('./hand')
  , Pointable = require('./pointable')
  , Finger = require('./finger')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter;

var Event = function(data) {
  this.type = data.type;
  this.state = data.state;
};

exports.chooseProtocol = function(header) {
  var protocol;
  switch(header.version) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      protocol = JSONProtocol(header);
      protocol.sendBackground = function(connection, state) {
        connection.send(protocol.encode({background: state}));
      }
      protocol.sendFocused = function(connection, state) {
        connection.send(protocol.encode({focused: state}));
      }
      protocol.sendOptimizeHMD = function(connection, state) {
        connection.send(protocol.encode({optimizeHMD: state}));
      }
      break;
    default:
      throw "unrecognized version";
  }
  return protocol;
}

var JSONProtocol = exports.JSONProtocol = function(header) {

  var protocol = function(frameData) {

    if (frameData.event) {

      return new Event(frameData.event);

    } else {

      protocol.emit('beforeFrameCreated', frameData);

      var frame = new Frame(frameData);

      protocol.emit('afterFrameCreated', frame, frameData);

      return frame;

    }

  };

  protocol.encode = function(message) {
    return JSON.stringify(message);
  };
  protocol.version = header.version;
  protocol.serviceVersion = header.serviceVersion;
  protocol.versionLong = 'Version ' + header.version;
  protocol.type = 'protocol';

  _.extend(protocol, EventEmitter.prototype);

  return protocol;
};



},{"./finger":11,"./frame":12,"./hand":14,"./pointable":18,"events":49,"underscore":25}],20:[function(require,module,exports){
exports.UI = {
  Region: require("./ui/region"),
  Cursor: require("./ui/cursor")
};
},{"./ui/cursor":21,"./ui/region":22}],21:[function(require,module,exports){
var Cursor = module.exports = function() {
  return function(frame) {
    var pointable = frame.pointables.sort(function(a, b) { return a.z - b.z })[0]
    if (pointable && pointable.valid) {
      frame.cursorPosition = pointable.tipPosition
    }
    return frame
  }
}

},{}],22:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')

var Region = module.exports = function(start, end) {
  this.start = new Vector(start)
  this.end = new Vector(end)
  this.enteredFrame = null
}

Region.prototype.hasPointables = function(frame) {
  for (var i = 0; i != frame.pointables.length; i++) {
    var position = frame.pointables[i].tipPosition
    if (position.x >= this.start.x && position.x <= this.end.x && position.y >= this.start.y && position.y <= this.end.y && position.z >= this.start.z && position.z <= this.end.z) {
      return true
    }
  }
  return false
}

Region.prototype.listener = function(opts) {
  var region = this
  if (opts && opts.nearThreshold) this.setupNearRegion(opts.nearThreshold)
  return function(frame) {
    return region.updatePosition(frame)
  }
}

Region.prototype.clipper = function() {
  var region = this
  return function(frame) {
    region.updatePosition(frame)
    return region.enteredFrame ? frame : null
  }
}

Region.prototype.setupNearRegion = function(distance) {
  var nearRegion = this.nearRegion = new Region(
    [this.start.x - distance, this.start.y - distance, this.start.z - distance],
    [this.end.x + distance, this.end.y + distance, this.end.z + distance]
  )
  var region = this
  nearRegion.on("enter", function(frame) {
    region.emit("near", frame)
  })
  nearRegion.on("exit", function(frame) {
    region.emit("far", frame)
  })
  region.on('exit', function(frame) {
    region.emit("near", frame)
  })
}

Region.prototype.updatePosition = function(frame) {
  if (this.nearRegion) this.nearRegion.updatePosition(frame)
  if (this.hasPointables(frame) && this.enteredFrame == null) {
    this.enteredFrame = frame
    this.emit("enter", this.enteredFrame)
  } else if (!this.hasPointables(frame) && this.enteredFrame != null) {
    this.enteredFrame = null
    this.emit("exit", this.enteredFrame)
  }
  return frame
}

Region.prototype.normalize = function(position) {
  return new Vector([
    (position.x - this.start.x) / (this.end.x - this.start.x),
    (position.y - this.start.y) / (this.end.y - this.start.y),
    (position.z - this.start.z) / (this.end.z - this.start.z)
  ])
}

Region.prototype.mapToXY = function(position, width, height) {
  var normalized = this.normalize(position)
  var x = normalized.x, y = normalized.y
  if (x > 1) x = 1
  else if (x < -1) x = -1
  if (y > 1) y = 1
  else if (y < -1) y = -1
  return [
    (x + 1) / 2 * width,
    (1 - y) / 2 * height,
    normalized.z
  ]
}

_.extend(Region.prototype, EventEmitter.prototype)
},{"events":49,"underscore":25}],23:[function(require,module,exports){
// This file is automatically updated from package.json by grunt.
module.exports = {
  full: '0.6.4',
  major: 0,
  minor: 6,
  dot: 4
}
},{}],24:[function(require,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.1
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/*
* Rotate a 3D vector around the x-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/*
* Rotate a 3D vector around the y-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/*
* Rotate a 3D vector around the z-axis
* @param {vec3} out The receiving vec3
* @param {vec3} a The vec3 point to rotate
* @param {vec3} b The origin of the rotation
* @param {Number} c The angle of rotation
* @returns {vec3} out
*/
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

},{}],25:[function(require,module,exports){
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],26:[function(require,module,exports){
(function (global){
/// shim for browser packaging

module.exports = function() {
  return global.WebSocket || global.MozWebSocket;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (process){
"use strict";

var MCP = require("./lib/mcp");

module.exports = {
  MCP: require("./lib/mcp"),

  Robot: require("./lib/robot"),

  Driver: require("./lib/driver"),
  Adaptor: require("./lib/adaptor"),

  Utils: require("./lib/utils"),
  Logger: require("./lib/logger"),

  IO: {
    DigitalPin: require("./lib/io/digital-pin"),
    Utils: require("./lib/io/utils")
  },

  robot: MCP.create,
  api: require("./lib/api").create,
  config: require("./lib/config").update,

  start: MCP.start,
  halt: MCP.halt
};

process.on("SIGINT", function() {
  MCP.halt(process.kill.bind(process, process.pid));
});

if (process.platform === "win32") {
  var io = { input: process.stdin, output: process.stdout },
      quit = process.emit.bind(process, "SIGINT");

  require("readline").createInterface(io).on("SIGINT", quit);
}

}).call(this,require('_process'))
},{"./lib/adaptor":28,"./lib/api":29,"./lib/config":31,"./lib/driver":32,"./lib/io/digital-pin":34,"./lib/io/utils":35,"./lib/logger":36,"./lib/mcp":37,"./lib/robot":39,"./lib/utils":44,"_process":50,"readline":48}],28:[function(require,module,exports){
"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in connection", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Adaptor class
 *
 * @constructor Adaptor
 *
 * @param {Object} [opts] adaptor options
 * @param {String} [opts.name] the adaptor's name
 * @param {Object} [opts.robot] the robot the adaptor belongs to
 * @param {Object} [opts.host] the host the adaptor will connect to
 * @param {Object} [opts.port] the port the adaptor will connect to
 */
var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;

  // the Robot the adaptor belongs to
  this.robot = opts.robot;

  // some default options
  this.host = opts.host;
  this.port = opts.port;

  // misc. details provided in args hash
  this.details = {};

  _.each(opts, function(opt, name) {
    if (!_.includes(["robot", "name", "adaptor", "events"], name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Adaptor, Basestar);

/**
 * A base connect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.connect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#connect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base disconnect function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Adaptor.prototype.disconnect = function() {
  var message = formatErrorMessage(
    this.name,
    "Adaptor#disconnect method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Expresses the Adaptor in a JSON-serializable format
 *
 * @return {Object} a representation of the Adaptor in a serializable format
 */
Adaptor.prototype.toJSON = function() {
  return {
    name: this.name,
    adaptor: this.constructor.name || this.name,
    details: this.details
  };
};

},{"./basestar":30,"./utils":44,"./utils/helpers":45}],29:[function(require,module,exports){
"use strict";

var MCP = require("./mcp"),
    Logger = require("./logger"),
    _ = require("./utils/helpers");

var api = module.exports = {};

api.instances = [];

/**
 * Creates a new API instance
 *
 * @param {String} [Server] which API plugin to use (e.g. "http" loads
 * cylon-api-http)
 * @param {Object} opts options for the new API instance
 * @return {void}
 */
api.create = function create(Server, opts) {
  // if only passed options (or nothing), assume HTTP server
  if (Server == null || _.isObject(Server) && !_.isFunction(Server)) {
    opts = Server;
    Server = "http";
  }

  opts = opts || {};

  if (_.isString(Server)) {
    var req = "cylon-api-" + Server;

    try {
      Server = require(req);
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
      }

      [
        "Cannot find the " + req + " API module.",
        "You may be able to install it: `npm install " + req + "`"
      ].forEach(Logger.log);

      throw new Error("Missing API plugin - cannot proceed");
    }
  }

  opts.mcp = MCP;

  var instance = new Server(opts);
  api.instances.push(instance);
  instance.start();
};

},{"./logger":36,"./mcp":37,"./utils/helpers":45}],30:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;

var Utils = require("./utils"),
    _ = require("./utils/helpers");

/**
 * The Basestar class is a wrapper class around EventEmitter that underpins most
 * other Cylon adaptor/driver classes, providing useful external base methods
 * and functionality.
 *
 * @constructor Basestar
 */
var Basestar = module.exports = function Basestar() {
  Utils.classCallCheck(this, Basestar);
};

Utils.subclass(Basestar, EventEmitter);

/**
 * Proxies calls from all methods in the source to a target object
 *
 * @param {String[]} methods methods to proxy
 * @param {Object} target object to proxy methods to
 * @param {Object} source object to proxy methods from
 * @param {Boolean} [force=false] whether or not to overwrite existing methods
 * @return {Object} the source
 */
Basestar.prototype.proxyMethods = Utils.proxyFunctionsToObject;

/**
 * Triggers the provided callback, and emits an event with the provided data.
 *
 * If an error is provided, emits the 'error' event.
 *
 * @param {String} event what event to emit
 * @param {Function} callback function to be invoked with error/data
 * @param {*} err possible error value
 * @param {...*} data data values to be passed to error/callback
 * @return {void}
 */
Basestar.prototype.respond = function(event, callback, err) {
  var args = Array.prototype.slice.call(arguments, 3);

  if (err) {
    this.emit("error", err);
  } else {
    this.emit.apply(this, [event].concat(args));
  }

  if (typeof callback === "function") {
    callback.apply(this, [err].concat(args));
  }
};

/**
 * Defines an event handler to proxy events from a source object to a target
 *
 * @param {Object} opts event options
 * @param {EventEmitter} opts.source source of events to listen for
 * @param {EventEmitter} opts.target target new events should be emitted from
 * @param {String} opts.eventName name of event to listen for, and proxy
 * @param {Bool} [opts.sendUpdate=false] whether to emit the 'update' event
 * @param {String} [opts.targetEventName] new event name to emit from target
 * @return {EventEmitter} the source object
 */
Basestar.prototype.defineEvent = function(opts) {
  opts.sendUpdate = opts.sendUpdate || false;
  opts.targetEventName = opts.targetEventName || opts.eventName;

  opts.source.on(opts.eventName, function() {
    var args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
    args.unshift(opts.targetEventName);
    opts.target.emit.apply(opts.target, args);

    if (opts.sendUpdate) {
      args.unshift("update");
      opts.target.emit.apply(opts.target, args);
    }
  });

  return opts.source;
};

/**
 * A #defineEvent shorthand for adaptors.
 *
 * Proxies events from an adaptor's connector to the adaptor itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the adaptor's connector
 */
Basestar.prototype.defineAdaptorEvent = function(opts) {
  return this._proxyEvents(opts, this.connector, this);
};

/**
 * A #defineEvent shorthand for drivers.
 *
 * Proxies events from an driver's connection to the driver itself.
 *
 * @param {Object} opts proxy options
 * @return {EventEmitter} the driver's connection
 */
Basestar.prototype.defineDriverEvent = function(opts) {
  return this._proxyEvents(opts, this.connection, this);
};

Basestar.prototype._proxyEvents = function(opts, source, target) {
  opts = _.isString(opts) ? { eventName: opts } : opts;

  opts.source = source;
  opts.target = target;

  return this.defineEvent(opts);
};

},{"./utils":44,"./utils/helpers":45,"events":49}],31:[function(require,module,exports){
"use strict";

var _ = require("./utils/helpers");

var config = module.exports = {},
    callbacks = [];

// default data
config.haltTimeout = 3000;
config.testMode = false;
config.logger = null;
config.silent = false;
config.debug = false;

/**
 * Updates the Config, and triggers handler callbacks
 *
 * @param {Object} data new configuration information to set
 * @return {Object} the updated configuration
 */
config.update = function update(data) {
  var forbidden = ["update", "subscribe", "unsubscribe"];

  Object.keys(data).forEach(function(key) {
    if (~forbidden.indexOf(key)) { delete data[key]; }
  });

  if (!Object.keys(data).length) {
    return config;
  }

  _.extend(config, data);

  callbacks.forEach(function(callback) { callback(data); });

  return config;
};

/**
 * Subscribes a function to be called whenever the config is updated
 *
 * @param {Function} callback function to be called with updated data
 * @return {void}
 */
config.subscribe = function subscribe(callback) {
  callbacks.push(callback);
};

/**
 * Unsubscribes a callback from configuration changes
 *
 * @param {Function} callback function to unsubscribe from changes
 * @return {void}
 */
config.unsubscribe = function unsubscribe(callback) {
  var idx = callbacks.indexOf(callback);
  if (idx >= 0) { callbacks.splice(idx, 1); }
};

},{"./utils/helpers":45}],32:[function(require,module,exports){
"use strict";

var Basestar = require("./basestar"),
    Utils = require("./utils"),
    _ = require("./utils/helpers");

function formatErrorMessage(name, message) {
  return ["Error in driver", "'" + name + "'", "- " + message].join(" ");
}

/**
 * Driver class
 *
 * @constructor Driver
 * @param {Object} [opts] driver options
 * @param {String} [opts.name] the driver's name
 * @param {Object} [opts.robot] the robot the driver belongs to
 * @param {Object} [opts.connection] the adaptor the driver works through
 * @param {Number} [opts.pin] the pin number the driver should have
 * @param {Number} [opts.interval=10] read interval in milliseconds
 */
var Driver = module.exports = function Driver(opts) {
  Driver.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.name = opts.name;
  this.robot = opts.robot;

  this.connection = opts.connection;

  this.commands = {};
  this.events = [];

  // some default options
  this.pin = opts.pin;
  this.interval = opts.interval || 10;

  this.details = {};

  _.each(opts, function(opt, name) {
    var banned = ["robot", "name", "connection", "driver", "events"];

    if (!_.includes(banned, name)) {
      this.details[name] = opt;
    }
  }, this);
};

Utils.subclass(Driver, Basestar);

/**
 * A base start function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.start = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#start method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * A base halt function. Must be overwritten by a descendent.
 *
 * @throws Error if not overridden by a child class
 * @return {void}
 */
Driver.prototype.halt = function() {
  var message = formatErrorMessage(
    this.name,
    "Driver#halt method must be overwritten by descendant classes."
  );

  throw new Error(message);
};

/**
 * Sets up an array of commands for the Driver.
 *
 * Proxies commands from the Driver to its connection (or a manually specified
 * proxy), and adds a snake_cased version to the driver's commands object.
 *
 * @param {String[]} commands an array of driver commands
 * @param {Object} [proxy=this.connection] proxy target
 * @return {void}
 */
Driver.prototype.setupCommands = function(commands, proxy) {
  if (proxy == null) {
    proxy = this.connection;
  }

  Utils.proxyFunctionsToObject(commands, proxy, this);

  function endsWith(string, substr) {
    return string.indexOf(substr, string.length - substr.length) !== -1;
  }

  commands.forEach(function(command) {
    var snakeCase = command.replace(/[A-Z]+/g, function(match) {
      if (match.length > 1 && !endsWith(command, match)) {
        match = match.replace(/[A-Z]$/, function(m) {
          return "_" + m.toLowerCase();
        });
      }

      return "_" + match.toLowerCase();
    }).replace(/^_/, "");

    this.commands[snakeCase] = this[command];
  }, this);
};

/**
 * Expresses the Driver in a JSON-serializable format
 *
 * @return {Object} a representation of the Driver in a serializable format
 */
Driver.prototype.toJSON = function() {
  return {
    name: this.name,
    driver: this.constructor.name || this.name,
    connection: this.connection.name,
    commands: Object.keys(this.commands),
    events: this.events,
    details: this.details
  };
};

},{"./basestar":30,"./utils":44,"./utils/helpers":45}],33:[function(require,module,exports){
(function (process){
"use strict";

var Registry = require("./registry"),
    Config = require("./config"),
    _ = require("./utils/helpers");

function testMode() {
  return process.env.NODE_ENV === "test" && Config.testMode;
}

module.exports = function Initializer(type, opts) {
  var mod;

  mod = Registry.findBy(type, opts[type]);

  if (!mod) {
    if (opts.module) {
      Registry.register(opts.module);
    } else {
      Registry.register("cylon-" + opts[type]);
    }

    mod = Registry.findBy(type, opts[type]);
  }

  if (!mod) {
    var err = [ "Unable to find", type, "for", opts[type] ].join(" ");
    throw new Error(err);
  }

  var obj = mod[type](opts);

  _.each(obj, function(prop, name) {
    if (name === "constructor") {
      return;
    }

    if (_.isFunction(prop)) {
      obj[name] = prop.bind(obj);
    }
  });

  if (testMode()) {
    var test = Registry.findBy(type, "test")[type](opts);

    _.each(obj, function(prop, name) {
      if (_.isFunction(prop) && !test[name]) {
        test[name] = function() { return true; };
      }
    });

    return test;
  }

  return obj;
};

}).call(this,require('_process'))
},{"./config":31,"./registry":38,"./utils/helpers":45,"_process":50}],34:[function(require,module,exports){
/* eslint no-sync: 0 */

"use strict";

var FS = require("fs"),
    EventEmitter = require("events").EventEmitter;

var Utils = require("../utils");

var GPIO_PATH = "/sys/class/gpio";

var GPIO_READ = "in";
var GPIO_WRITE = "out";

/**
 * The DigitalPin class provides an interface with the Linux GPIO system present
 * in single-board computers such as Raspberry Pi, or Beaglebone Black.
 *
 * @constructor DigitalPin
 * @param {Object} opts digital pin options
 * @param {String} pin which pin number to use
 * @param {String} mode which pin mode to use
 */
var DigitalPin = module.exports = function DigitalPin(opts) {
  this.pinNum = opts.pin.toString();
  this.status = "low";
  this.ready = false;
  this.mode = opts.mode;
};

Utils.subclass(DigitalPin, EventEmitter);

DigitalPin.prototype.connect = function(mode) {
  if (this.mode == null) {
    this.mode = mode;
  }

  FS.exists(this._pinPath(), function(exists) {
    if (exists) {
      this._openPin();
    } else {
      this._createGPIOPin();
    }
  }.bind(this));
};

DigitalPin.prototype.close = function() {
  FS.writeFile(this._unexportPath(), this.pinNum, function(err) {
    this._closeCallback(err);
  }.bind(this));
};

DigitalPin.prototype.closeSync = function() {
  FS.writeFileSync(this._unexportPath(), this.pinNum);
  this._closeCallback(false);
};

DigitalPin.prototype.digitalWrite = function(value) {
  if (this.mode !== "w") {
    this._setMode("w");
  }

  this.status = value === 1 ? "high" : "low";

  FS.writeFile(this._valuePath(), value, function(err) {
    if (err) {
      var str = "Error occurred while writing value ";
      str += value + " to pin " + this.pinNum;

      this.emit("error", str);
    } else {
      this.emit("digitalWrite", value);
    }
  }.bind(this));

  return value;
};

// Public: Reads the digial pin"s value periodicly on a supplied interval,
// and emits the result or an error
//
// interval - time (in milliseconds) to read from the pin at
//
// Returns the defined interval
DigitalPin.prototype.digitalRead = function(interval) {
  if (this.mode !== "r") { this._setMode("r"); }

  Utils.every(interval, function() {
    FS.readFile(this._valuePath(), function(err, data) {
      if (err) {
        var error = "Error occurred while reading from pin " + this.pinNum;
        this.emit("error", error);
      } else {
        var readData = parseInt(data.toString(), 10);
        this.emit("digitalRead", readData);
      }
    }.bind(this));
  }.bind(this));
};

DigitalPin.prototype.setHigh = function() {
  return this.digitalWrite(1);
};

DigitalPin.prototype.setLow = function() {
  return this.digitalWrite(0);
};

DigitalPin.prototype.toggle = function() {
  return (this.status === "low") ? this.setHigh() : this.setLow();
};

// Creates the GPIO file to read/write from
DigitalPin.prototype._createGPIOPin = function() {
  FS.writeFile(this._exportPath(), this.pinNum, function(err) {
    if (err) {
      this.emit("error", "Error while creating pin files");
    } else {
      this._openPin();
    }
  }.bind(this));
};

DigitalPin.prototype._openPin = function() {
  this._setMode(this.mode, true);
  this.emit("open");
};

DigitalPin.prototype._closeCallback = function(err) {
  if (err) {
    this.emit("error", "Error while closing pin files");
  } else {
    this.emit("close", this.pinNum);
  }
};

// Sets the mode for the pin by writing the values to the pin reference files
DigitalPin.prototype._setMode = function(mode, emitConnect) {
  if (emitConnect == null) { emitConnect = false; }

  this.mode = mode;

  var data = (mode === "w") ? GPIO_WRITE : GPIO_READ;

  FS.writeFile(this._directionPath(), data, function(err) {
    this._setModeCallback(err, emitConnect);
  }.bind(this));
};

DigitalPin.prototype._setModeCallback = function(err, emitConnect) {
  if (err) {
    return this.emit("error", "Setting up pin direction failed");
  }

  this.ready = true;

  if (emitConnect) {
    this.emit("connect", this.mode);
  }
};

DigitalPin.prototype._directionPath = function() {
  return this._pinPath() + "/direction";
};

DigitalPin.prototype._valuePath = function() {
  return this._pinPath() + "/value";
};

DigitalPin.prototype._pinPath = function() {
  return GPIO_PATH + "/gpio" + this.pinNum;
};

DigitalPin.prototype._exportPath = function() {
  return GPIO_PATH + "/export";
};

DigitalPin.prototype._unexportPath = function() {
  return GPIO_PATH + "/unexport";
};

},{"../utils":44,"events":49,"fs":48}],35:[function(require,module,exports){
"use strict";

module.exports = {
  /**
   * Calculates PWM Period and Duty based on provided params.
   *
   * @param {Number} scaledDuty the scaled duty value
   * @param {Number} freq frequency to use
   * @param {Number} pulseWidth pulse width
   * @param {String} [polarity=high] polarity value (high or low)
   * @return {Object} calculated period and duty encapsulated in an object
   */
  periodAndDuty: function(scaledDuty, freq, pulseWidth, polarity) {
    var period, duty, maxDuty;

    polarity = polarity || "high";
    period = Math.round(1.0e9 / freq);

    if (pulseWidth != null) {
      var pulseWidthMin = pulseWidth.min * 1000,
          pulseWidthMax = pulseWidth.max * 1000;

      maxDuty = pulseWidthMax - pulseWidthMin;
      duty = Math.round(pulseWidthMin + (maxDuty * scaledDuty));
    } else {
      duty = Math.round(period * scaledDuty);
    }

    if (polarity === "low") {
      duty = period - duty;
    }

    return { period: period, duty: duty };
  }
};

},{}],36:[function(require,module,exports){
(function (process){
"use strict";

/* eslint no-use-before-define: 0 */

var Config = require("./config"),
    _ = require("./utils/helpers");

var BasicLogger = function basiclogger(str) {
  var prefix = new Date().toISOString() + " : ";
  console.log(prefix + str);
};

var NullLogger = function nulllogger() {};

var Logger = module.exports = {
  setup: setup,

  should: {
    log: true,
    debug: false
  },

  log: function log(str) {
    if (Logger.should.log) {
      Logger.logger.call(Logger.logger, str);
    }
  },

  debug: function debug(str) {
    if (Logger.should.log && Logger.should.debug) {
      Logger.logger.call(Logger.logger, str);
    }
  }
};

function setup(opts) {
  if (_.isObject(opts)) { _.extend(Config, opts); }

  var logger = Config.logger;

  // if no logger supplied, use basic logger
  if (logger == null) { logger = BasicLogger; }

  // if logger is still falsy, use NullLogger
  Logger.logger = logger || NullLogger;

  Logger.should.log = !Config.silent;
  Logger.should.debug = Config.debug;

  // --silent CLI flag overrides
  if (_.includes(process.argv, "--silent")) {
    Logger.should.log = false;
  }

  // --debug CLI flag overrides
  if (_.includes(process.argv, "--debug")) {
    Logger.should.debug = false;
  }

  return Logger;
}

setup();
Config.subscribe(setup);

// deprecated holdovers
["info", "warn", "error", "fatal"].forEach(function(method) {
  var called = false;

  function showDeprecationNotice() {
    console.log("The method Logger#" + method + " has been deprecated.");
    console.log("It will be removed in Cylon 2.0.0.");
    console.log("Please switch to using the #log or #debug Logger methods");

    called = true;
  }

  Logger[method] = function() {
    if (!called) { showDeprecationNotice(); }
    Logger.log.apply(null, arguments);
  };
});

}).call(this,require('_process'))
},{"./config":31,"./utils/helpers":45,"_process":50}],37:[function(require,module,exports){
"use strict";

var EventEmitter = require("events").EventEmitter;

var Config = require("./config"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Robot = require("./robot"),
    _ = require("./utils/helpers");

var mcp = module.exports = new EventEmitter();

mcp.robots = {};
mcp.commands = {};
mcp.events = [ "robot_added", "robot_removed" ];

/**
 * Creates a new Robot with the provided options.
 *
 * @param {Object} opts robot options
 * @return {Robot} the new robot
 */
mcp.create = function create(opts) {
  opts = opts || {};

  // check if a robot with the same name exists already
  if (opts.name && mcp.robots[opts.name]) {
    var original = opts.name;
    opts.name = Utils.makeUnique(original, Object.keys(mcp.robots));

    var str = "Robot names must be unique. Renaming '";
    str += original + "' to '" + opts.name + "'";

    Logger.log(str);
  }

  var bot = new Robot(opts);
  mcp.robots[bot.name] = bot;
  mcp.emit("robot_added", bot.name);

  return bot;
};

mcp.start = function start(callback) {
  var fns = _.pluck(mcp.robots, "start");

  _.parallel(fns, function() {
    var mode = Utils.fetch(Config, "workMode", "async");
    if (mode === "sync") { _.invoke(mcp.robots, "startWork"); }
    callback();
  });
};

/**
 * Halts all MCP robots.
 *
 * @param {Function} callback function to call when done halting robots
 * @return {void}
 */
mcp.halt = function halt(callback) {
  callback = callback || function() {};

  var timeout = setTimeout(callback, Config.haltTimeout || 3000);

  _.parallel(_.pluck(mcp.robots, "halt"), function() {
    clearTimeout(timeout);
    callback();
  });
};

/**
 * Serializes MCP robots, commands, and events into a JSON-serializable Object.
 *
 * @return {Object} a serializable representation of the MCP
 */
mcp.toJSON = function() {
  return {
    robots: _.invoke(mcp.robots, "toJSON"),
    commands: Object.keys(mcp.commands),
    events: mcp.events
  };
};

},{"./config":31,"./logger":36,"./robot":39,"./utils":44,"./utils/helpers":45,"events":49}],38:[function(require,module,exports){
(function (process){
"use strict";

var Logger = require("./logger"),
    _ = require("./utils/helpers");

// Explicitly these modules here, so Browserify can grab them later
require("./test/loopback");
require("./test/test-adaptor");
require("./test/test-driver");
require("./test/ping");

var missingModuleError = function(module) {
  var str = "Cannot find the '" + module + "' module.\n";
  str += "This problem might be fixed by installing it with ";
  str += "'npm install " + module + "' and trying again.";

  console.log(str);

  process.emit("SIGINT");
};

var Registry = module.exports = {
  data: {},

  register: function(module) {
    if (this.data[module]) {
      return this.data[module].module;
    }

    var pkg;

    try {
      pkg = require(module);
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        missingModuleError(module);
      }

      throw e;
    }

    this.data[module] = {
      module: pkg,
      adaptors: pkg.adaptors || [],
      drivers: pkg.drivers || [],
      dependencies: pkg.dependencies || []
    };

    this.logRegistration(module, this.data[module]);

    this.data[module].dependencies.forEach(function(dep) {
      Registry.register(dep);
    });

    return this.data[module].module;
  },

  findBy: function(prop, name) {
    // pluralize, if necessary
    if (prop.slice(-1) !== "s") {
      prop += "s";
    }

    return this.search(prop, name);
  },

  findByModule: function(module) {
    if (!this.data[module]) {
      return null;
    }

    return this.data[module].module;
  },

  logRegistration: function(name) {
    var module = this.data[name];

    Logger.debug("Registering module " + name);

    ["adaptors", "drivers", "dependencies"].forEach(function(field) {
      if (module[field].length) {
        Logger.debug("  " + field + ":");
        module[field].forEach(function(item) {
          Logger.debug("    - " + item);
        });
      }
    });
  },

  search: function(entry, value) {
    for (var name in this.data) {
      if (this.data.hasOwnProperty(name)) {
        var repo = this.data[name];

        if (repo[entry] && _.includes(repo[entry], value)) {
          return repo.module;
        }
      }
    }

    return false;
  }
};

// Default drivers/adaptors:
["loopback", "ping", "test-adaptor", "test-driver"].forEach(function(module) {
  Registry.register("./test/" + module);
});

}).call(this,require('_process'))
},{"./logger":36,"./test/loopback":40,"./test/ping":41,"./test/test-adaptor":42,"./test/test-driver":43,"./utils/helpers":45,"_process":50}],39:[function(require,module,exports){
(function (process){
"use strict";

var initializer = require("./initializer"),
    Logger = require("./logger"),
    Utils = require("./utils"),
    Config = require("./config"),
    _ = require("./utils/helpers");

var validator = require("./validator");

var EventEmitter = require("events").EventEmitter;

// used when creating default robot names
var ROBOT_ID = 1;

/**
 * Creates a new Robot instance based on provided options
 *
 * @constructor
 * @param {Object} opts object with Robot options
 * @param {String} [name] the name the robot should have
 * @param {Object} [connections] object containing connection info for the Robot
 * @param {Object} [devices] object containing device information for the Robot
 * @param {Function} [work] a function the Robot will run when started
 * @returns {Robot} new Robot instance
 */
var Robot = module.exports = function Robot(opts) {
  Utils.classCallCheck(this, Robot);

  opts = opts || {};

  validator.validate(opts);

  // auto-bind prototype methods
  for (var prop in Object.getPrototypeOf(this)) {
    if (this[prop] && prop !== "constructor") {
      this[prop] = this[prop].bind(this);
    }
  }

  this.initRobot(opts);

  _.each(opts, function(opt, name) {
    if (this[name] !== undefined) {
      return;
    }

    if (_.isFunction(opt)) {
      this[name] = opt.bind(this);

      if (opts.commands == null) {
        this.commands[name] = opt.bind(this);
      }
    } else {
      this[name] = opt;
    }
  }, this);

  if (opts.commands) {
    var cmds;

    if (_.isFunction(opts.commands)) {
      cmds = opts.commands.call(this);
    } else {
      cmds = opts.commands;
    }

    if (_.isObject(cmds)) {
      this.commands = cmds;
    } else {
      var err = "#commands must be an object ";
      err += "or a function that returns an object";
      throw new Error(err);
    }
  }

  var mode = Utils.fetch(Config, "mode", "manual");

  if (mode === "auto") {
    // run on the next tick, to allow for "work" event handlers to be set up
    setTimeout(this.start, 0);
  }
};

Utils.subclass(Robot, EventEmitter);

/**
 * Condenses information on a Robot to a JSON-serializable format
 *
 * @return {Object} serializable information on the Robot
 */
Robot.prototype.toJSON = function() {
  return {
    name: this.name,
    connections: _.invoke(this.connections, "toJSON"),
    devices: _.invoke(this.devices, "toJSON"),
    commands: Object.keys(this.commands),
    events: _.isArray(this.events) ? this.events : []
  };
};

/**
 * Adds a new Connection to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Connection to use
 * @param {Object} conn options for the Connection initializer
 * @return {Object} the robot
 */
Robot.prototype.connection = function(name, conn) {
  conn.robot = this;
  conn.name = name;

  if (this.connections[conn.name]) {
    var original = conn.name,
        str;

    conn.name = Utils.makeUnique(original, Object.keys(this.connections));

    str = "Connection names must be unique.";
    str += "Renaming '" + original + "' to '" + conn.name + "'";
    this.log(str);
  }

  this.connections[conn.name] = initializer("adaptor", conn);

  return this;
};

/**
 * Initializes all values for a new Robot.
 *
 * @param {Object} opts object passed to Robot constructor
 * @return {void}
 */
Robot.prototype.initRobot = function(opts) {
  this.name = opts.name || "Robot " + ROBOT_ID++;
  this.running = false;

  this.connections = {};
  this.devices = {};

  this.work = opts.work || opts.play;

  this.commands = {};

  if (!this.work) {
    this.work = function() { this.log("No work yet."); };
  }

  _.each(opts.connections, function(conn, key) {
    var name = _.isString(key) ? key : conn.name;

    if (conn.devices) {
      opts.devices = opts.devices || {};

      _.each(conn.devices, function(device, d) {
        device.connection = name;
        opts.devices[d] = device;
      });

      delete conn.devices;
    }

    this.connection(name, _.extend({}, conn));
  }, this);

  _.each(opts.devices, function(device, key) {
    var name = _.isString(key) ? key : device.name;
    this.device(name, _.extend({}, device));
  }, this);
};

/**
 * Adds a new Device to the Robot with the provided name and details.
 *
 * @param {String} name string name for the Device to use
 * @param {Object} device options for the Device initializer
 * @return {Object} the robot
 */
Robot.prototype.device = function(name, device) {
  var str;

  device.robot = this;
  device.name = name;

  if (this.devices[device.name]) {
    var original = device.name;
    device.name = Utils.makeUnique(original, Object.keys(this.devices));

    str = "Device names must be unique.";
    str += "Renaming '" + original + "' to '" + device.name + "'";
    this.log(str);
  }

  if (_.isString(device.connection)) {
    if (this.connections[device.connection] == null) {
      str = "No connection found with the name " + device.connection + ".\n";
      this.log(str);
      process.emit("SIGINT");
    }

    device.connection = this.connections[device.connection];
  } else {
    for (var c in this.connections) {
      device.connection = this.connections[c];
      break;
    }
  }

  this.devices[device.name] = initializer("driver", device);

  return this;
};

/**
 * Starts the Robot's connections, then devices, then work.
 *
 * @param {Function} callback function to be triggered when the Robot has
 * started working
 * @return {Object} the Robot
 */
Robot.prototype.start = function(callback) {
  if (this.running) {
    return this;
  }

  var mode = Utils.fetch(Config, "workMode", "async");

  var start = function() {
    if (mode === "async") {
      this.startWork();
    }
  }.bind(this);

  _.series([
    this.startConnections,
    this.startDevices,
    start
  ], function(err, results) {
    if (err) {
      this.log("An error occured while trying to start the robot:");
      this.log(err);

      this.halt(function() {
        if (_.isFunction(this.error)) {
          this.error.call(this, err);
        }

        if (this.listeners("error").length) {
          this.emit("error", err);
        }
      }.bind(this));
    }

    if (_.isFunction(callback)) {
      callback(err, results);
    }
  }.bind(this));

  return this;
};

/**
 * Starts the Robot's work function
 *
 * @return {void}
 */
Robot.prototype.startWork = function() {
  this.log("Working.");

  this.emit("ready", this);
  this.work.call(this, this);
  this.running = true;
};

/**
 * Starts the Robot's connections
 *
 * @param {Function} callback function to be triggered after the connections are
 * started
 * @return {void}
 */
Robot.prototype.startConnections = function(callback) {
  this.log("Starting connections.");

  var starters = _.map(this.connections, function(conn) {
    return function(cb) {
      return this.startConnection(conn, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single connection on Robot
 *
 * @param {Object} connection to start
 * @param {Function} callback function to be triggered after the connection is
 * started
 * @return {void}
 */
Robot.prototype.startConnection = function(connection, callback) {
  if (connection.connected === true) {
    return callback.call(connection);
  }

  var str = "Starting connection '" + connection.name + "'";

  if (connection.host) {
    str += " on host " + connection.host;
  } else if (connection.port) {
    str += " on port " + connection.port;
  }

  this.log(str + ".");
  connection.connect.call(connection, callback);
  connection.connected = true;
  return true;
};

/**
 * Starts the Robot's devices
 *
 * @param {Function} callback function to be triggered after the devices are
 * started
 * @return {void}
 */
Robot.prototype.startDevices = function(callback) {
  var log = this.log;

  log("Starting devices.");

  var starters = _.map(this.devices, function(device) {
    return function(cb) {
      return this.startDevice(device, cb);
    }.bind(this);
  }, this);

  return _.parallel(starters, callback);
};

/**
 * Starts a single device on Robot
 *
 * @param {Object} device to start
 * @param {Function} callback function to be triggered after the device is
 * started
 * @return {void}
 */
Robot.prototype.startDevice = function(device, callback) {
  if (device.started === true) {
    return callback.call(device);
  }

  var log = this.log;
  var str = "Starting device '" + device.name + "'";

  if (device.pin) {
    str += " on pin " + device.pin;
  }

  log(str + ".");
  this[device.name] = device;
  device.start.call(device, callback);
  device.started = true;

  return device.started;
};

/**
 * Halts the Robot, attempting to gracefully stop devices and connections.
 *
 * @param {Function} callback to be triggered when the Robot has stopped
 * @return {void}
 */
Robot.prototype.halt = function(callback) {
  callback = callback || function() {};

  if (!this.running) {
    return callback();
  }

  // ensures callback(err) won't prevent others from halting
  function wrap(fn) {
    return function(cb) { fn.call(null, cb.bind(null, null)); };
  }

  var devices = _.pluck(this.devices, "halt").map(wrap),
      connections = _.pluck(this.connections, "disconnect").map(wrap);

  try {
    _.parallel(devices, function() {
      _.parallel(connections, callback);
    });
  } catch (e) {
    var msg = "An error occured while attempting to safely halt the robot";
    this.log(msg);
    this.log(e.message);
  }

  this.running = false;
};

/**
 * Generates a String representation of a Robot
 *
 * @return {String} representation of a Robot
 */
Robot.prototype.toString = function() {
  return "[Robot name='" + this.name + "']";
};

Robot.prototype.log = function(str) {
  Logger.log("[" + this.name + "] - " + str);
};

}).call(this,require('_process'))
},{"./config":31,"./initializer":33,"./logger":36,"./utils":44,"./utils/helpers":45,"./validator":47,"_process":50,"events":49}],40:[function(require,module,exports){
"use strict";

var Adaptor = require("../adaptor"),
    Utils = require("../utils");

var Loopback = module.exports = function Loopback() {
  Loopback.__super__.constructor.apply(this, arguments);
};

Utils.subclass(Loopback, Adaptor);

Loopback.prototype.connect = function(callback) {
  callback();
};

Loopback.prototype.disconnect = function(callback) {
  callback();
};

Loopback.adaptors = ["loopback"];
Loopback.adaptor = function(opts) { return new Loopback(opts); };

},{"../adaptor":28,"../utils":44}],41:[function(require,module,exports){
"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var Ping = module.exports = function Ping() {
  Ping.__super__.constructor.apply(this, arguments);

  this.commands = {
    ping: this.ping
  };

  this.events = ["ping"];
};

Utils.subclass(Ping, Driver);

Ping.prototype.ping = function() {
  this.emit("ping", "ping");
  return "pong";
};

Ping.prototype.start = function(callback) {
  callback();
};

Ping.prototype.halt = function(callback) {
  callback();
};

Ping.drivers = ["ping"];
Ping.driver = function(opts) { return new Ping(opts); };

},{"../driver":32,"../utils":44}],42:[function(require,module,exports){
"use strict";

var Adaptor = require("../adaptor"),
    Utils = require("../utils");

var TestAdaptor = module.exports = function TestAdaptor() {
  TestAdaptor.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestAdaptor, Adaptor);

TestAdaptor.adaptors = ["test"];
TestAdaptor.adaptor = function(opts) { return new TestAdaptor(opts); };

},{"../adaptor":28,"../utils":44}],43:[function(require,module,exports){
"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var TestDriver = module.exports = function TestDriver() {
  TestDriver.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestDriver, Driver);

TestDriver.drivers = ["test"];
TestDriver.driver = function(opts) { return new TestDriver(opts); };

},{"../driver":32,"../utils":44}],44:[function(require,module,exports){
(function (global){
"use strict";

var _ = require("./utils/helpers");

var monkeyPatches = require("./utils/monkey-patches");

var Utils = module.exports = {
  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "every 5 seconds, do this thing")
   *
   * @param {Number} interval delay between action invocations
   * @param {Function} action function to trigger every time interval elapses
   * @example every((5).seconds(), function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  every: function every(interval, action) {
    return setInterval(action, interval);
  },

  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "after 5 seconds, do this thing")
   *
   * @param {Number} delay how long to wait
   * @param {Function} action action to perform after delay
   * @example after((5).seconds(), function() {});
   * @return {timeoutId} setTimeout ID to pass to clearTimeout()
   */
  after: function after(delay, action) {
    return setTimeout(action, delay);
  },

  /**
   * A wrapper around setInterval, with a delay of 0ms
   *
   * @param {Function} action function to invoke constantly
   * @example constantly(function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  constantly: function constantly(action) {
    return every(0, action);
  },

  /**
   * A wrapper around clearInterval
   *
   * @param {intervalID} intervalID ID of every/after/constantly
   * @example finish(blinking);
   * @return {void}
   */
  finish: function finish(intervalID) {
    clearInterval(intervalID);
  },

  /**
   * Sleeps the program for a period of time.
   *
   * Use of this is not advised, as your program can't do anything else while
   * it's running.
   *
   * @param {Number} ms number of milliseconds to sleep
   * @return {void}
   */
  sleep: function sleep(ms) {
    var start = Date.now(),
        i = 0;

    while (Date.now() < start + ms) {
      i = i.toString();
    }
  },

  /**
   * Utility for providing class inheritance.
   *
   * Based on CoffeeScript's implementation of inheritance.
   *
   * Parent class methods/properites are available on Child.__super__.
   *
   * @param {Function} child the descendent class
   * @param {Function} parent the parent class
   * @return {Function} the child class
   */
  subclass: function subclass(child, parent) {
    var Ctor = function() {
      this.constructor = child;
    };

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  },

  proxyFunctions: function proxyFunctions(source, target) {
    _.each(source, function(prop, key) {
      if (_.isFunction(prop) && !target[key]) {
        target[key] = prop.bind(source);
      }
    });
  },

  /**
   * Proxies calls from all methods in the source to a target object
   *
   * @param {String[]} methods methods to proxy
   * @param {Object} target object to proxy methods to
   * @param {Object} [base=this] object to proxy methods from
   * @param {Boolean} [force=false] whether to overwrite existing methods
   * @return {Object} the base
   */
  proxyFunctionsToObject: function(methods, target, base, force) {
    if (base == null) {
      base = this;
    }

    force = force || false;

    methods.forEach(function(method) {
      if (_.isFunction(base[method]) && !force) {
        return;
      }

      base[method] = function() {
        return target[method].apply(target, arguments);
      };
    });

    return base;
  },

  classCallCheck: function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  },

  /**
   * Approximation of Ruby's Hash#fetch method for object property lookup
   *
   * @param {Object} obj object to do lookup on
   * @param {String} property property name to attempt to access
   * @param {*} fallback a fallback value if property can't be found. if
   * a function, will be invoked with the string property name.
   * @throws Error if fallback needed but not provided, or fallback fn doesn't
   * return anything
   * @example
   *    fetch({ property: "hello world" }, "property"); //=> "hello world"
   * @example
   *    fetch({}, "notaproperty", "default value"); //=> "default value"
   * @example
   *    var notFound = function(prop) { return prop + " not found!" };
   *    fetch({}, "notaproperty", notFound); //=> "notaproperty not found!"
   * @example
   *    var badFallback = function(prop) { prop + " not found!" };
   *    fetch({}, "notaproperty", badFallback);
   *    // Error: no return value from provided callback function
   * @example
   *    fetch(object, "notaproperty");
   *    // Error: key not found: "notaproperty"
   * @return {*} fetched property, fallback, or fallback function return value
   */
  fetch: function(obj, property, fallback) {
    if (obj.hasOwnProperty(property)) {
      return obj[property];
    }

    if (fallback === void 0) {
      throw new Error("key not found: \"" + property + "\"");
    }

    if (_.isFunction(fallback)) {
      var value = fallback(property);

      if (value === void 0) {
        throw new Error("no return value from provided fallback function");
      }

      return value;
    }

    return fallback;
  },

  /**
   * Given a name, and an array of existing names, returns a unique new name
   *
   * @param {String} name the name that's colliding with existing names
   * @param {String[]} arr array of existing names
   * @example
   *   makeUnique("hello", ["hello", "hello-1", "hello-2"]); //=> "hello3"
   * @return {String} the new name
   */
  makeUnique: function(name, arr) {
    var newName;

    if (!~arr.indexOf(name)) {
      return name;
    }

    for (var n = 1; ; n++) {
      newName = name + "-" + n;
      if (!~arr.indexOf(newName)) {
        return newName;
      }
    }
  },

  /**
   * Adds every/after/constantly to the global namespace, and installs
   * monkey-patches.
   *
   * @return {Object} utils object
   */
  bootstrap: function bootstrap() {
    global.every = this.every;
    global.after = this.after;
    global.constantly = this.constantly;

    monkeyPatches.install();

    return this;
  }
};

Utils.bootstrap();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/helpers":45,"./utils/monkey-patches":46}],45:[function(require,module,exports){
"use strict";

/* eslint no-use-before-define: 0 */

var __slice = Array.prototype.slice;

var H = module.exports = {};

function identity(value) {
  return value;
}

function extend(base, source) {
  var isArray = Array.isArray(source);

  if (base == null) {
    base = isArray ? [] : {};
  }

  if (isArray) {
    source.forEach(function(e, i) {
      if (typeof base[i] === "undefined") {
        base[i] = e;
      } else if (typeof e === "object") {
        base[i] = extend(base[i], e);
      } else if (!~base.indexOf(e)) {
        base.push(e);
      }
    });
  } else {
    var key;

    for (key in source) {
      if (typeof source[key] !== "object" || !source[key]) {
        base[key] = source[key];
      } else if (base[key]) {
        extend(base[key], source[key]);
      } else {
        base[key] = source[key];
      }
    }
  }

  return base;
}

extend(H, {
  identity: identity,
  extend: extend
});

function kind(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}

function isA(type) {
  return function(thing) {
    return kind(thing) === type;
  };
}

extend(H, {
  isObject: isA("Object"),
  isObjectLoose: function(thing) { return typeof thing === "object"; },
  isFunction: isA("Function"),
  isArray: isA("Array"),
  isString: isA("String"),
  isNumber: isA("Number"),
  isArguments: isA("Arguments"),
  isUndefined: isA("Undefined")
});

function iterate(thing, fn, thisVal) {
  if (H.isArray(thing)) {
    thing.forEach(fn, thisVal);
    return;
  }

  if (H.isObject(thing)) {
    for (var key in thing) {
      var value = thing[key];
      fn.call(thisVal, value, key);
    }
  }
}

function pluck(collection, key) {
  var keys = [];

  iterate(collection, function(object) {
    if (H.isObject(object)) {
      if (H.isFunction(object[key])) {
        keys.push(object[key].bind(object));
      } else {
        keys.push(object[key]);
      }
    }
  });

  return keys;
}

function map(collection, fn, thisVal) {
  var vals = [];

  if (fn == null) {
    fn = identity;
  }

  iterate(collection, function(object, index) {
    vals.push(fn.call(thisVal, object, index));
  });

  return vals;
}

function invoke(collection, fn) {
  var args = __slice.call(arguments, 2),
      vals = [];

  iterate(collection, function(object) {
    if (H.isFunction(fn)) {
      vals.push(fn.apply(object, args));
      return;
    }

    vals.push(object[fn].apply(object, arguments));
  });

  return vals;
}

function reduce(collection, iteratee, accumulator, thisVal) {
  var isArray = H.isArray(collection);

  if (!isArray && !H.isObjectLoose(collection)) {
    return null;
  }

  if (iteratee == null) {
    iteratee = identity;
  }

  if (accumulator == null) {
    if (isArray) {
      accumulator = collection.shift();
    } else {
      for (var key in collection) {
        accumulator = collection[key];
        delete collection[key];
        break;
      }
    }
  }

  iterate(collection, function(object, name) {
    accumulator = iteratee.call(thisVal, accumulator, object, name);
  });

  return accumulator;
}

extend(H, {
  pluck: pluck,
  each: iterate,
  map: map,
  invoke: invoke,
  reduce: reduce
});

function arity(fn, n) {
  return function() {
    var args = __slice.call(arguments, 0, n);
    return fn.apply(null, args);
  };
}

function partial(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, args.concat(__slice.call(arguments)));
  };
}

function partialRight(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, __slice.call(arguments).concat(args));
  };
}

extend(H, {
  arity: arity,
  partial: partial,
  partialRight: partialRight
});

function includes(arr, value) {
  return !!~arr.indexOf(value);
}

extend(H, {
  includes: includes
});

function parallel(functions, done) {
  var total = functions.length,
      completed = 0,
      results = [],
      error;

  if (typeof done !== "function") { done = function() {}; }

  function callback(err, result) {
    if (error) {
      return;
    }

    if (err || error) {
      error = err;
      done(err);
      return;
    }

    completed++;
    results.push(result);

    if (completed === total) {
      done(null, results);
    }
  }

  if (!functions.length) { done(); }

  functions.forEach(function(fn) { fn(callback); });
}

extend(H, {
  parallel: parallel
});

function series(functions, done) {
  var results = [],
      error;

  if (typeof done !== "function") { done = function() {}; }

  function callback(err, result) {
    if (err || error) {
      error = err;
      return done(err);
    }

    results.push(result);

    if (!functions.length) {
      return done(null, results);
    }

    next();
  }

  function next() {
    functions.shift()(callback);
  }

  if (!functions.length) { done(null, results); }
  next();
}

extend(H, {
  series: series
});

},{}],46:[function(require,module,exports){
/* eslint no-extend-native: 0 key-spacing: 0 */

"use strict";

var max = Math.max,
    min = Math.min;

var originals = {
  seconds:   Number.prototype.seconds,
  second:    Number.prototype.second,
  fromScale: Number.prototype.fromScale,
  toScale:   Number.prototype.toScale
};

module.exports.uninstall = function() {
  for (var opt in originals) {
    if (originals[opt] == null) {
      Number.prototype[opt] = originals[opt];
    } else {
      delete Number.prototype[opt];
    }
  }
};

module.exports.install = function() {
  /**
   * Multiplies a number by 60000 to convert minutes
   * to milliseconds
   *
   * @example
   * (2).minutes(); //=> 120000
   * @return {Number} time in milliseconds
   */
  Number.prototype.minutes = function() {
    return this * 60000;
  };

  /**
   * Alias for Number.prototype.minutes
   *
   * @see Number.prototype.minute
   * @example
   * (1).minute(); //=>60000
   * @return {Number} time in milliseconds
   */
  Number.prototype.minute = Number.prototype.minutes;

  /**
   * Multiplies a number by 1000 to convert seconds
   * to milliseconds
   *
   * @example
   * (2).seconds(); //=> 2000
   * @return {Number} time in milliseconds
   */
  Number.prototype.seconds = function() {
    return this * 1000;
  };

  /**
   * Alias for Number.prototype.seconds
   *
   * @see Number.prototype.seconds
   * @example
   * (1).second(); //=> 1000
   * @return {Number} time in milliseconds
   */
  Number.prototype.second = Number.prototype.seconds;

  /**
   * Passthru to get time in milliseconds
   *
   * @example
   * (200).milliseconds(); //=> 200
   * @return {Number} time in milliseconds
   */
  Number.prototype.milliseconds = function() {
    return this;
  };

  /**
   * Alias for Number.prototype.milliseconds
   *
   * @see Number.prototype.milliseconds
   * @example
   * (100).ms(); //=> 100
   * @return {Number} time in milliseconds
   */
  Number.prototype.ms = Number.prototype.milliseconds;

  /**
   * Converts microseconds to milliseconds.
   * Note that timing of events in terms of microseconds
   * is not very accurate in JS.
   *
   * @example
   * (2000).microseconds(); //=> 2
   * @return {Number} time in milliseconds
   */
  Number.prototype.microseconds = function() {
    return this / 1000;
  };

  /**
   * Converts a number from a current scale to a 0 - 1 scale.
   *
   * @param {Number} start low point of scale to convert from
   * @param {Number} end high point of scale to convert from
   * @example
   * (5).fromScale(0, 10) //=> 0.5
   * @return {Number} the scaled value
   */
  Number.prototype.fromScale = function(start, end) {
    var val = (this - min(start, end)) / (max(start, end) - min(start, end));

    if (val > 1) {
      return 1;
    }

    if (val < 0) {
      return 0;
    }

    return val;
  };

  /**
   * Converts a number from a 0 - 1 scale to the specified scale.
   *
   * @param {Number} start low point of scale to convert to
   * @param {Number} end high point of scale to convert to
   * @example
   * (0.5).toScale(0, 10) //=> 5
   * @return {Number} the scaled value
   */
  Number.prototype.toScale = function(start, end) {
    var i = this * (max(start, end) - min(start, end)) + min(start, end);

    if (i < start) {
      return start;
    }

    if (i > end) {
      return end;
    }

    return i;
  };
};

},{}],47:[function(require,module,exports){
"use strict";

// validates an Object containing Robot parameters

var Logger = require("./logger"),
    _ = require("./utils/helpers");

function hasProp(object, prop) {
  return object.hasOwnProperty(prop);
}

function die() {
  var RobotDSLError = new Error("Unable to start robot due to a syntax error");
  RobotDSLError.name = "RobotDSLError";
  throw RobotDSLError;
}

function warn(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
}

function fatal(messages) {
  messages = [].concat(messages);
  messages.map(function(msg) { Logger.log(msg); });
  die();
}

var checks = {};

checks.singleObjectSyntax = function(opts, key) {
  var single = hasProp(opts, key),
      plural = hasProp(opts, key + "s");

  if (single && !plural) {
    fatal([
      "The single-object '" + key + "' syntax for robots is not valid.",
      "Instead, use the multiple-value '" + key + "s' key syntax.",
      "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
    ]);
  }
};

checks.singleObjectSyntax = function(opts) {
  ["connection", "device"].map(function(key) {
    var single = hasProp(opts, key),
        plural = hasProp(opts, key + "s");

    if (single && !plural) {
      fatal([
        "The single-object '" + key + "' syntax for robots is not valid.",
        "Instead, use the multiple-value '" + key + "s' key syntax.",
        "Details: http://cylonjs.com/documentation/guides/working-with-robots/"
      ]);
    }
  });
};

checks.deviceWithoutDriver = function(opts) {
  if (opts.devices) {
    _.each(opts.devices, function(device, name) {
      if (!device.driver || device.driver === "") {
        fatal("No driver supplied for device " + name);
      }
    });
  }
};

checks.devicesWithoutConnection = function(opts) {
  var connections = opts.connections,
      devices = opts.devices;

  if (devices && connections && Object.keys(connections).length > 1) {
    var first = Object.keys(connections)[0];

    _.each(devices, function(device, name) {
      if (!device.connection || device.connection === "") {
        warn([
          "No explicit connection provided for device " + name,
          "Will default to using connection " + first
        ]);
      }
    });
  }
};

checks.noConnections = function(opts) {
  var connections = Object.keys(opts.connections || {}).length,
      devices = Object.keys(opts.devices || {}).length;

  if (devices && !connections) {
    fatal(["No connections provided for devices"]);
  }
};

module.exports.validate = function validate(opts) {
  opts = opts || {};

  _.each(checks, function(check) {
    check(opts);
  });
};

},{"./logger":36,"./utils/helpers":45}],48:[function(require,module,exports){

},{}],49:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],50:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"cylon-leapmotion":[function(require,module,exports){
"use strict";

var Adaptor = require("./lib/adaptor"),
    Driver = require("./lib/driver");

module.exports = {
  adaptors: ["leapmotion"],
  drivers: ["leapmotion"],

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    return new Driver(opts);
  }
};

},{"./lib/adaptor":2,"./lib/driver":3}]},{},[1]);
