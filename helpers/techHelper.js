var military = require('../objects/military.json');
var grid = require('../objects/grid.json');
var nano = require('../objects/nano.json');
var rare = require('../objects/rare.json');

var technologyBag = [];
var technologiesPerRound = 0;
var techGenerationMap = {
	"2" : {"inital" : 12, "perRound" : 4},
	"3" : {"inital" : 14, "perRound" : 6},
	"4" : {"inital" : 16, "perRound" : 7},
	"5" : {"inital" : 18, "perRound" : 8},
	"6" : {"inital" : 20, "perRound" : 9}
};

module.exports = {
	generateInitialTechnology : function(numberOfPlayers) {
		generateTechnologyBag();
		initialNumberOfTechs = techGenerationMap[numberOfPlayers.toString()].inital;
		technologiesPerRound = techGenerationMap[numberOfPlayers.toString()].perRound;
		return pullTechnologies(initialNumberOfTechs);
	},
	generateTechnologyAtEndOfRound : function() {
		return pullTechnologies(technologiesPerRound);
	},
	compressTechnology : function(technologies) {
		var compressedTechnologies = [];

		for(var i=0;i<technologies.length;i++) {
			if(typeof compressedTechnologies[technologies[i].name] == 'undefined') {
				compressedTechnologies[technologies[i].name] = technologies[i];
				compressedTechnologies[technologies[i].name].qty = 1;
			} else {
				compressedTechnologies[technologies[i].name].qty++;
			}
		}

		var tempCompressedTech = [];
		for(var tech in compressedTechnologies) {
			tempCompressedTech.push(compressedTechnologies[tech]);
		}
		compressedTechnologies = tempCompressedTech;

		compressedTechnologies.sort(function(a, b) { return a.id - b.id; });

		return compressedTechnologies;
	}
};

function pullTechnologies(numberOfTechnologies) {
	pulledTechnologies = []
	count = 0;
	while(count < numberOfTechnologies && technologyBag.length > 0) {
  	  	var nextTechnologyIndex = Math.floor(Math.random() * technologyBag.length);
  	  	var nextTechnology = technologyBag[nextTechnologyIndex];
  	  	pulledTechnologies.push(nextTechnology);
  	  	technologyBag.splice(nextTechnologyIndex, 1);

  	  	if(nextTechnology.track != "Rare") {
  	  		count++;
  	  	}
  	}
  	return pulledTechnologies;
}

function generateTechnologyBag() {
	technologyBag = [];
	technologyBag.push(rare["Zero-Point Source"]);
	technologyBag.push(rare["Conifold Field"]);
	technologyBag.push(rare["Flux Missile"]);
	technologyBag.push(rare["Interceptor Bay"]);
	technologyBag.push(rare["Sentient Hull"]);
	technologyBag.push(rare["Antimatter Splitter"]);
	technologyBag.push(rare["Neutron Absorber"]);
	technologyBag.push(rare["Distortion Shield"]);
	technologyBag.push(rare["Cloaking Device"]);
	technologyBag.push(rare["Point Defense"]);
	technologyBag.push(rare["Tractor Beam"]);

	for(var i=0;i<3;i++) {
		technologyBag.push(grid["Tachyon Drive"]);
		technologyBag.push(nano["Artifact Key"]);
	}

	for(var i=0;i<4;i++) {
		technologyBag.push(military["Tachyon Source"]);
		technologyBag.push(military["Plasma Missiles"]);
		technologyBag.push(military["Gluon Computer"]);
		technologyBag.push(grid["Antimatter Cannon"]);
		technologyBag.push(grid["Quantum Grid"]);
		technologyBag.push(nano["Monolith"]);
		technologyBag.push(nano["Wormhole Generator"]);
	}

	for(var i=0;i<5;i++) {
		technologyBag.push(military["Neutron Bomb"]);
		technologyBag.push(military["Star Base"]);
		technologyBag.push(military["Phase Shield"]);
		technologyBag.push(military["Advanced Mining"]);
		technologyBag.push(grid["Gauss Shield"]);
		technologyBag.push(grid["Positron Computer"]);
		technologyBag.push(grid["Advanced Economy"]);
		technologyBag.push(nano["Nanorobots"]);
		technologyBag.push(nano["Orbital"]);
		technologyBag.push(nano["Advanced Labs"]);
	}

	for(var i=0;i<6;i++) {
		technologyBag.push(military["Plasma Cannon"]);
		technologyBag.push(grid["Improved Hull"]);
		technologyBag.push(grid["Fusion Source"]);
		technologyBag.push(nano["Fusion Drive"]);
		technologyBag.push(nano["Advanced Robotics"]);
	}

	var tempTechnologyBag = [];
	for(var i=0;i<technologyBag.length;i++) {
		tempTechnologyBag[i] = technologyBag[i];
	}
	technologyBag = tempTechnologyBag;
}