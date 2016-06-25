var domain = require('domain');
var errDomain = domain.createDomain();

errDomain.on('error', function(err) {
  console.log('Everything is broken forever');
  console.log((new Date).toUTCString(), ': Process uptime (s)', process.uptime());
  console.log(err.stack);
});

errDomain.run(function() {
	//=========================================Require Dependencies
	var app = require('express')();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
	var view          = require('./views/view.json');
	var techHelper    = require('./helpers/techHelper');
	//=========================================Require Dependencies

  app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 4444);
  app.set('host', process.env.OPENSHIFT_NODEJS_IP   || process.env.HOST || '192.168.2.57');

  server.listen(app.get('port'), app.get('host'), function() {
    console.log("Express server running");
  });

	var availableTech = [];
	var gameStarted = false;
	var round = 1;
	var compressedTechnology;

	app.get('/', function(req, res){
		res.sendfile('./views/index.html');
	});

	app.get('/index.js', function(req, res, next) {
    	res.sendfile('./views/js/index.js');
    });

  app.get('/views.js', function(req, res, next) {
   	res.sendfile('./views/js/views.js');
  });

  app.get('/main.css', function(req, res, next) {
    res.sendfile('./views/css/main.css');
  });

	io.on('connection', function(socket) {
	 	console.log('a user connected ');

	 	if(gameStarted == true) {
	 		updateRound();
  		dislayEndTheRoundButton();
			publishTech();
  	}

	 	socket.on('disconnect', function() {
	 		console.log('a user disconnected');
  	});

  	socket.on('startGame', function(numberofPlayers) {
      if(numberofPlayers > 0 && numberofPlayers < 10) {
    		clearError();
        gameStarted = true;
    		updateRound();
    		dislayEndTheRoundButton();
    		availableTech = techHelper.generateInitialTechnology(numberofPlayers);
        publishNewlyAvailableTech(availableTech);
  			publishTech();
      } else {
        publishNumberOfPlayersError();
      }
   	});

  	socket.on('buyTech', function (techName) {
  	 	var index = -1;
  	 	for(var i=0;i<compressedTechnology.length;i++) {
  	 		if(compressedTechnology[i].name == techName) {
  	 			index = i;
  	 		}
  	 	}
    	if (index != -1) {
    		if(compressedTechnology[index].qty > 1) {
     			compressedTechnology[index].qty--;
     		} else {
      		compressedTechnology.splice(index, 1);
      	}
     	}

    	index = -1;
     	for(var i=0;i<availableTech.length;i++) {
  	 		if(availableTech[i].name == techName) {
  	 			index = i;
  	 		}
  	 	}
     	if (index != -1) {
        	availableTech.splice(index, 1);
     	}
	 		publishTech();
    });

  	socket.on('endTheGame', function () {
  	 	round = 1;
  	 	gameStarted = false;
  	 	availableTech = [];
  	 	resetView();
  	});

  	socket.on('endTheRound', function () {
	  	var newAvailableTech = techHelper.generateTechnologyAtEndOfRound();
	  	for(var i=0;i<newAvailableTech.length;i++) {
	  		availableTech.push(newAvailableTech[i]);
	  	}
      if(newAvailableTech.length > 0) {
        publishNewlyAvailableTech(newAvailableTech);
      }
			publishTech();
		  round++;
			if(round >= 9) {
        round = 9;
				displayEndTheGameButton();
			}
      updateRound();
  	});
	});

	function resetView() {
  	io.emit("updateRound", "");
  	displayStartGame();
  	publishTech();
  }

  function updateRound() {
		io.emit("updateRound", round);
	}

	function displayStartGame() {
		io.emit("updateButtons", view.startTheGame);
	}

  function dislayEndTheRoundButton() {
  	io.emit("updateButtons", view.endTheRoundButton);
  }

  function displayEndTheGameButton() {
   	io.emit("updateButtons", view.endTheGame);
  }

  function displayJoinGameButton() {
  	io.emit("updateButtons", view.joinTheGame);
  }

  function publishNewlyAvailableTech(newlyAvailbleTech) {
    var compressedTechnology = techHelper.compressTechnology(newlyAvailbleTech);
    io.emit('publishNewlyAvailableTech', compressedTechnology);
  }

  function publishTech() {
  	compressedTechnology = techHelper.compressTechnology(availableTech);
	  io.emit('publishTech', compressedTechnology);
  }

  function publishNumberOfPlayersError() {
    io.emit('error', "Please enter a valid number of players (2-9).");
  }

  function clearError() {
    io.emit('error', "");
  }

  module.exports = app;
});