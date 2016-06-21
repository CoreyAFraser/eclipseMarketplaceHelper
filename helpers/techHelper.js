var technologies = require('../objects/technologies.json');
var config = require('../configs/config.json');

var technologyBag = [];
var technologiesPerRound = 0;
var techGenerationMap = config.techGenMap;
var numberOfPlayers = 1;
var initialTechsInBag = config.initialTechsInBag;

module.exports = {
	generateInitialTechnology : function(numOfPlayers) {
		numberOfPlayers = numOfPlayers;
		generateTechnologyBag();
		var initialNumberOfTechs = techGenerationMap[numberOfPlayers.toString()].initial;
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

		var techSortedByTrack = {};
		techSortedByTrack.military = [];
		techSortedByTrack.grid = [];
		techSortedByTrack.nano = [];
		techSortedByTrack.rare = [];

		for(var i=0;i<compressedTechnologies.length;i++) {
			switch(compressedTechnologies[i].track) {
				case "Military" :
					techSortedByTrack.military.push(compressedTechnologies[i]);
					break;
				case "Grid" :
					techSortedByTrack.grid.push(compressedTechnologies[i]);
					break;
				case "Nano" :
					techSortedByTrack.nano.push(compressedTechnologies[i]);
					break;
				case "Rare" :
					techSortedByTrack.rare.push(compressedTechnologies[i]);
					break; 
			}
		}

		return techSortedByTrack;
	}
};

function pullTechnologies(numberOfTechnologies) {
	var pulledTechnologies = []
	var count = 0;
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

	for(var tech in technologies) {
		var techLimit = initialTechsInBag[tech].lessThanSix;
		if(numberOfPlayers > 6) {
			techLimit = initialTechsInBag[tech].moreThanSix;
		}
		for(var i=0;i<techLimit;i++) {
			technologyBag.push(technologies[tech]);
		}
	}

	var tempTechnologyBag = [];
	for(var i=0;i<technologyBag.length;i++) {
		tempTechnologyBag[i] = technologyBag[i];
	}
	technologyBag = tempTechnologyBag;
}