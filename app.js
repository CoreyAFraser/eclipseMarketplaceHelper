var domain = require('domain');
var errDomain = domain.createDomain();

errDomain.on('error', function(err) {
	console.log('Everything is broken forever');
	console.log((new Date).toUTCString(), ': Process uptime (s)', process.uptime());
	console.log(err.stack);
});

errDomain.run(function() {
	//=========================================Require Dependencies
	var express      = require('express');
	var app          = express();
	var http 		 = require('http').Server(app);
	var io			 = require('socket.io')(http);
	var banker   	 = require('./views/banker.json');
	var playerView   = require('./views/player.json');
	var player       = require('./objects/player');
	//=========================================Require Dependencies

	var bankerSocketId = "";
	var players = [];
	var availableTech = [];

	var numberOfReadyPlayers = 0;
	var playerOrder = [];

	app.get('/', function(req, res){
		res.sendfile('./views/index.html');
	});

	app.get('/index.js', function(req, res, next) {
    	res.sendfile('./views/js/index.js');
    });

	io.on('connection', function(socket) {
		var newPlayer = new player.create();
		newPlayer.socketId = socket.id;
		players.push(newPlayer);
	  	console.log('a user connected ' + players.length);
	 	socket.on('disconnect', function() {
	 		for(var i=0;i<players.length;i++) {
	 			if(players[i].socketId == socket.id) {
	 				players.splice(i, 1);
	 			}
	 		}
	 		console.log('a user disconnected ' + players.length);
	  	});

	  	socket.on('startGame', function(name, fn) {
	  		for(var i=0;i<players.length;i++) {
	 			if(players[i].socketId == socket.id) {
	 				players[i].name = name;
	 			}
	 		}

	  		fn(playerView.body);
	  		numberOfReadyPlayers++;
	  		if(numberOfReadyPlayers == players.length) {
	  			generatePlayerOrder();
	  		}
	  	});

  	  	socket.on('buyTech', function (techName) {
  	  		var index = availableTech.indexOf(techName);
        	if (index != -1) {
            	availableTech.splice(index, 1);
        	}

	  		publishTech();
  	  	});

  	  	function generateMoreTech() {
  	  		for(var i=0;i<3;i++) {
				tech = "Tech" + (availableTech.length + 1);
	  			availableTech.push(tech);
	  		}

			publishTech();
  	  	}

  	  	function publishTech() {
  	  		io.emit('clearTech');

	  		for(var i=0;i<availableTech.length;i++) {
	  			io.emit('addTech', availableTech[i]);
	  		}
  	  	}

  	  	function publishPlayerOrder() {
	  		io.emit('publishPlayerOrder', playerOrder);
  	  	}

  	  	function generatePlayerOrder() {
  	  		var tempPlayers = [];
  	  		for(var i=0;i<players.length;i++) {
  	  			tempPlayers.push(players[i]);
  	  		}

  	  		while(tempPlayers.length > 0) {
  	  			var nextPlayerIndex = Math.floor(Math.random() * tempPlayers.length);
  	  			playerOrder.push(tempPlayers[nextPlayerIndex]);
  	  			tempPlayers.splice(nextPlayerIndex, 1);
  	  		}

			publishPlayerOrder();
			generateMoreTech();
  	  	}
	});

	app.set('port', process.env.PORT || 4444);
	app.set('host', process.env.HOST || '192.168.2.57');

	var server = http.listen(app.get('port'), app.get('host'), function() {
		console.log("Express server listening at IP: " + app.get('host') + " on port " + app.get('port'));
	});

	module.exports = app;
});