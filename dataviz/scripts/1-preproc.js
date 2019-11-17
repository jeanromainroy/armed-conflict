"use strict";

/**
 * We create a [id,name] list of all branches and districts
 *
 * @param countriesDict               	Countries with their COW code
 * @param imports               		All the arms imports
 * @param conflicts          			All the conflicts
 */
function createFromSources(countriesDict, imports, conflicts, population, mil_exp, mil_pers, predictions){

	var dataframe = [];

	Object.keys(countriesDict).forEach(function(key){

		var countryName = countriesDict[key]['name'];

		// Create entry
		var datum = {
			'name':countryName,
			'COW':key,
			'imports':imports[key],
			'conflicts':conflicts[key],
			'population':population[key],
			'mil_exp':mil_exp[key],
			'mil_pers':mil_pers[key],
			'predictions':predictions[key]
		};		

		// Add to dataframe
		dataframe.push(datum);
	});

	return dataframe;
}

/**
 * Set the time scale for the project
 *
 * @param xScale      X scale to be made proportional to the dates of the project
 * @param dataframe   The data object generated from the two CSV files
 */
function domainX(xScale, dataframe, dateparser){

	// Get first datum
	var datum = dataframe[0];

	// --- WE NEED TO MAKE SURE THE SHOWN VISUALIZATION AS ALL THE FEATURES FOR THOSE YEARS ---
	
	// Grab all the imports years
	var importsAllYears = Object.keys(datum['imports']);
	importsAllYears = importsAllYears.map(function(v){return +v});	// parse to int

	// Grab all the conflicts years
	var conflictsAllYears = Object.keys(datum['conflicts']);
	conflictsAllYears = conflictsAllYears.map(function(v){return +v});	// parse to int

	// Grab all the population years
	var populationAllYears = Object.keys(datum['population']);
	populationAllYears = populationAllYears.map(function(v){return +v});	// parse to int

	// Grab all the population years
	var milexpAllYears = Object.keys(datum['mil_exp']);
	milexpAllYears = milexpAllYears.map(function(v){return +v});	// parse to float

	// Grab all the population years
	var milpersAllYears = Object.keys(datum['mil_pers']);
	milpersAllYears = milpersAllYears.map(function(v){return +v});	// parse to float

	// Grab all the population years
	var predictionsAllYears = Object.keys(datum['predictions']);
	predictionsAllYears = predictionsAllYears.map(function(v){return +v});	// parse to float

	// Get the min/max
	var importsMinYear = Math.min(...importsAllYears);
	var importsMaxYear = Math.max(...importsAllYears);

	var conflictsMinYear = Math.min(...conflictsAllYears);
	var conflictsMaxYear = Math.max(...conflictsAllYears);

	var populationMinYear = Math.min(...populationAllYears);
	var populationMaxYear = Math.max(...populationAllYears);

	var milexpMinYear = Math.min(...milexpAllYears);
	var milexpMaxYear = Math.max(...milexpAllYears);

	var milpersMinYear = Math.min(...milpersAllYears);
	var milpersMaxYear = Math.max(...milpersAllYears);

	var predictionsMinYear = Math.min(...predictionsAllYears);
	var predictionsMaxYear = Math.max(...predictionsAllYears);

	var minYear = Math.max(...[importsMinYear,conflictsMinYear,populationMinYear,milexpMinYear,milpersMinYear,predictionsMinYear]);
	var maxYear = Math.min(...[importsMaxYear,conflictsMaxYear,populationMaxYear,milexpMaxYear,milpersMaxYear,predictionsMaxYear]);

	// parse to date
	var min = dateparser(minYear);
	var max = dateparser(maxYear+1);
	
	var min_date = new Date(min);
	var max_date = new Date(max);

	min_date.setDate(min.getDate());
	max_date.setDate(max.getDate());
	
	// Set the scale
	xScale.domain([min_date,max_date]);
}

/**
 * Restrict the data to the time constraints
 *
 * @param branches           The data object generated from the two CSV files
 * @param datemin           The earliest date defined by the sliders
 * 
 */
function timeBoundData(dataframe,slider_date){

	// Create a deep copy
	var timebound_data = [];
	
	dataframe.forEach(function(country){

		// Get the selected year
		var year = slider_date.getFullYear();

		// add datum
		timebound_data.push({
			'name':country['name'],
			'COW':country['COW'],
			'imports':country['imports'][year],
			'conflicts':country['conflicts'][year],
			'population':country['population'][year],
			'mil_exp':country['mil_exp'][year],
			'mil_pers':country['mil_pers'][year],
			'predictions':country['predictions'][year]
		});	
	});

	return timebound_data;
}