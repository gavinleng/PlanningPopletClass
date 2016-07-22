/*
 * Created by G on 11/07/2016.
 */


"use strict";

var request = require("request");
var _ = require("lodash");

var import2Tdx = require('./import2Tdx.js');

module.exports = function(config) {
	this._tdxConfig = config.tdxConfig || {};
	this._url = config.url || "";
	
	this.getPlanningPoplet = function(dataInfo, buildGeography, buildPopulationSize, buildDemographics, cb) {
		var self = this;

		planningPoplet(dataInfo, buildGeography, buildPopulationSize, buildDemographics, function(data) {
			import2Tdx(self._tdxConfig, data, function(id) {
				console.log('the PlanningPoplet data id is: ' + id);
				console.log('PlanningPoplet data set is saved to TDX.');
				
				var urlOut = 'https://q.nqminds.com/v1/datasets/' + id + '/data?opts={"limit":450000}';
				
				self._url = urlOut;
				
				cb(urlOut);
			});
		});
	};
	
	this.revPlanningPoplet = function(cb) {
		var self = this;

		buildComponents.call(self, function(dataInfo, buildGeography, buildPopulationSize, buildDemographics) {
			cb(dataInfo, buildGeography, buildPopulationSize, buildDemographics);
		});
	};

	var buildComponents = function (cb) {
		var self = this;

		request(self._url, { json: true }, function(err, resp, body) {
			if (err || (resp && resp.statusCode !== 200)) {
				var msg = err ? err.message : body && body.message;
				console.log("failure running the input data query: " + msg);
				process.exit(-1);
			} else {
				var data = body.data;

				var dataInfo = {};
				dataInfo.id = data[0].popId;
				dataInfo.description = data[0].popId_description;

				var i, j, sData, tData, lentData, obuildPopulationSize, obuildGeography, obuildDemographics;
				var yearArray = [];
				var idArray = [];
				var personsArray = [];

				var buildPopulationSize = [];

				var buildGeography = [];

				var buildDemographics = [];

				var lenData = data.length;
				
				for (i = 0; i < lenData; i++) {
					yearArray.push(data[i].year);
					idArray.push(data[i].area_id);
				}

				yearArray = _.uniq(yearArray);
				idArray = _.uniq(idArray);

				yearArray.sort();
				idArray.sort();

				var lenYearArray = yearArray.length;

				for (i = 0; i < lenYearArray; i++) {
					obuildPopulationSize = {};

					obuildPopulationSize.year = '"' + yearArray[i] + '"';

					tData = _.filter(data, function(obj) {
						return (obj.year == yearArray[i]);
					});
					lentData = tData.length;

					sData = 0;
					for (j = 0; j < lentData; j++) {
						sData += (+tData[j].persons);
					}

					obuildPopulationSize.persons = +sData;

					buildPopulationSize.push(obuildPopulationSize);
				}

				var lenIdArray = idArray.length;

				for (i = 0; i < lenIdArray; i++) {
					obuildGeography = {};

					obuildGeography.id = '"' + idArray[i] + '"';

					tData = _.filter(data, function(obj) {
						return ((obj.year == yearArray[0]) && (obj.area_id == idArray[i]));
					});

					obuildGeography.name = '"' + tData[0].area_name + '"';

					lentData = tData.length;

					sData = 0;
					for (j = 0; j < lentData; j++) {
						sData += (+tData[j].persons);
					}

					personsArray.push(sData);

					obuildGeography.ratio = +sData / (+buildPopulationSize[0].persons);

					buildGeography.push(obuildGeography);
				}

				tData = _.filter(data, function(obj) {
					return ((obj.year == yearArray[0]) && (obj.area_id == idArray[0]));
				});

				lentData = tData.length;

				for (i = 0; i < lentData; i++) {
					obuildDemographics = {};

					obuildDemographics.age_band = '"' + tData[i].age_band + '"';

					obuildDemographics.gender = '"' + tData[i].gender + '"';

					obuildDemographics.ratio = +tData[i].persons / (+personsArray[0]);

					buildDemographics.push(obuildDemographics);
				}

				cb(dataInfo, buildGeography, buildPopulationSize, buildDemographics);
			}
		});
	};
	
	var planningPoplet = function(dataInfo, buildGeography, buildPopulationSize, buildDemographics, cb) {
		var i, j, k, year, persons, area_id, area_name, area_ratio, pdata;
		var delta = 1e-10;
		
		var popId = dataInfo.id;
		var popId_description = dataInfo.description;
		
		var lenBuildGeography = buildGeography.length;
		
		var tratio = 0;
		for (i = 0; i < lenBuildGeography; i++) {
			tratio += (+buildGeography[i].ratio);
		}
		if (Math.abs(tratio - 1) > delta) {
			console.log("Please check the ratios of the build geography data.");
			process.exit(-1);
		}
		
		var lenBuildDemographics = buildDemographics.length;
		
		tratio = 0;
		for (i = 0; i < lenBuildDemographics; i++) {
			tratio += (+buildDemographics[i].ratio);
		}
		if (Math.abs(tratio - 1) > delta) {
			console.log("Please check the ratios of the build demographics data.");
			process.exit(-1);
		}
		
		var lenBuildPopulationSize = buildPopulationSize.length;
		
		var data = [];
		for (i = 0; i < lenBuildPopulationSize; i++) {
			year = buildPopulationSize[i].year;
			persons = +buildPopulationSize[i].persons;
			
			for (j = 0; j < lenBuildGeography; j++) {
				area_id = buildGeography[j].id;
				area_name = buildGeography[j].name;
				area_ratio = +buildGeography[j].ratio;
				
				for (k = 0; k < lenBuildDemographics; k++) {
					pdata = {};
					
					pdata.popId = popId;
					pdata.popId_description = popId_description;
					pdata.year = year;
					pdata.area_id = area_id;
					pdata.area_name = area_name;
					pdata.gender = buildDemographics[k].gender;
					pdata.age_band = buildDemographics[k].age_band;
					pdata.persons = +buildDemographics[k].ratio * persons * area_ratio;
					
					data.push(pdata);
				}
			}
		}
		
		cb(data);
	};
};
