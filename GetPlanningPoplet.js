/*
 * Created by G on 11/07/2016.
 */


// tdxconfig file
var tdxConfig = require('./tdx-config.js');

//planning.js
var Planning = require('./lib/planning.js');

var datasetId = '';

var datasetName = "PlanningPoplet_1";

var dataInfo = { id: 'planning1', description: '' };

var buildGeography = [{ 'id': 'E01000001', 'name': 'aaaa', 'ratio': 0.25 }, { 'id': 'E01000002', 'name': 'bbbb', 'ratio': 0.5 }, { 'id': 'E01000003', 'name': 'cccc', 'ratio': 0.25 }];

var buildPopulationSize = [{ 'year': '2018', 'persons': 20 }, { 'year': '2019', 'persons': 40 }, { 'year': '2020', 'persons': 80 }];

var buildDemographics = [{ 'age_band': '0-4', 'gender': 'female', 'ratio': 0.10 }, { 'age_band': '0-4', 'gender': 'male', 'ratio': 0.15 }, { 'age_band': '5-9', 'gender': 'female', 'ratio': 0.1 }, { 'age_band': '5-9', 'gender': 'male', 'ratio': 0.15 }, { 'age_band': '25-29', 'gender': 'male', 'ratio': 0.5 }];

var tdxConfig1 = {};
tdxConfig1.credentials = tdxConfig.credentials;
tdxConfig1.basedOnSchema = tdxConfig.basedOnSchema;
tdxConfig1.targetFolder = tdxConfig.targetFolder;
tdxConfig1.upsertMode = tdxConfig.upsertMode;
tdxConfig1.schema = tdxConfig.schema;

tdxConfig1.datasetName = datasetName;

if (datasetId) {
	tdxConfig1.truncateAddMode = true;
	tdxConfig1.targetDataset = datasetId;
}

var config = {"tdxConfig": tdxConfig1, "url":""};

var myPlanning = new Planning(config);

myPlanning.getPlanningPoplet(dataInfo, buildGeography, buildPopulationSize, buildDemographics, function(urlOut1) {
	console.log('the url of the PlanningPoplet data is: ' + urlOut1);
});
