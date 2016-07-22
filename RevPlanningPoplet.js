/*
 * Created by G on 11/07/2016.
 */


//planning.js
var Planning = require('./lib/planning.js');

var datasetId = '';

var planningPoplet_url = 'https://q.nqminds.com/v1/datasets/' + datasetId + '/data?opts={"limit":450000}';

var config = {"tdxConfig": {}, "url": planningPoplet_url};

var myPlanning = new Planning(config);

myPlanning.revPlanningPoplet(function(dataInfo, buildGeography, buildPopulationSize, buildDemographics) {
	console.log('the data id of the data information is: ' + dataInfo.id);
	console.log('one ratio of the build geography is: ' + buildGeography[2].ratio);
	console.log('one year of the build population size is: ' + buildPopulationSize[2].year);
	console.log('one ratio of the build demographics is: ' + buildDemographics[4].ratio);
});
