"use strict";

/**
 * We create a [id,name] list of all branches and districts
 *
 * @param countriesDict               	Countries with their COW code
 * @param imports               		All the arms imports
 * @param conflicts          			All the conflicts
 */
function createFromSources(countriesDict, imports, conflicts, population, mil_exp, mil_pers, water, surface, predictions){

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
			'water': water[key],
			'surface': surface[key],
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

	// Grab all the predictions years
	var predictionsAllYears = Object.keys(datum['predictions']);
	predictionsAllYears = predictionsAllYears.map(function(v){return +v});	// parse to float

	// Get the min/max
	var minYear = Math.min(...predictionsAllYears);
	var maxYear = Math.max(...predictionsAllYears);

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
			'water':country['water'][year],
			'surface':country['surface'][year],
			'predictions':country['predictions'][year]
		});	
	});

	return timebound_data;
}