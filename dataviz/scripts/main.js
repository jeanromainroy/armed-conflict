(function (L, d3, localization) {
	"use strict";

	/***** Constants *****/

	// created_at parser
	var dateparser = d3.timeParse("%Y");

	// Continent 
	var continentFilter = "Africa";

	// Set the center coordinates for world
	const centerLat = 5.443452;
	const centerLng = 20.964024;
	const initZoom = 3;

	/***** UI Objects *****/
	var map = L.map('map', {
		maxBounds:[[-45, -22.16],[45, 53.4]],
	});


	// Time Sliders
	var track = d3.select("#track");
	var slider = d3.select("#slider");
	const sliderWidth = remove_px(slider.style("width"));
	const trackWidth = remove_px(track.style("width"));
	const trackLeftOffset = remove_px(track.style("left"));

	/***** Set the Timeline's attributes *****/
	const timelineWidth = remove_px(track.style("width"));
	const timelineHeight = remove_px(track.style("height"));
	const timelineOffset = remove_px(track.style("left"));


	// Init the color scale
	var color = d3.scaleSqrt();
	color.domain([0.0, 1.0]).range(["#fff", '#5b92e5']).interpolate(d3.interpolate);


	// Scales
	var timelineScale = d3.scaleTime().range([0, timelineWidth]);
	var timelineAxis = d3.axisBottom(timelineScale).tickFormat(localization.getFormattedDate);


	/***** We initiate the timeline html object *****/
	var trackSvg = track.select("svg")    // we grab the SVG object inside of the track html object
		.attr("width", timelineWidth)       // set the width and height
		.attr("height", timelineHeight);


	/***** Loading the data *****/
	var promises = [];
	promises.push(d3.json("data/world.json"));
	promises.push(d3.json("data/cow_codes.json"));
	promises.push(d3.json("data/arms_imports.json"));
	promises.push(d3.csv("data/country_continent.csv"));
	
	Promise.all(promises).then(function (results) {

		/***** Load the data *****/
		var world = results[0];
		var COWcodes = results[1];
		var imports = results[2];
		var countries_continents = results[3];

		// Check
		if(imports == null || imports.length == 0){
			console.log("ERROR: Imports invalid")
			return;
		}

		// Get countries data from geojson
		var countries = [];
		world.features.forEach(function(country){
			
			var datum = {
				"id":country.id,
				"name": localization.capitalize(country.properties.name)
			};

			// Try to add the COW codes
			Object.keys(COWcodes).forEach(function(code){

				var name = COWcodes[code]['name'];

				if(datum['name'].toLowerCase() == name.toLowerCase()){
					datum["COW"] = code;
				}
			});

			// Try to add the continent
			countries_continents.forEach(function(country_continent){

				var continent = country_continent['Continent'];
				var country2 = country_continent['Country'];

				if(datum['name'].toLowerCase() == country2.toLowerCase()){
					datum['continent'] = continent;
				}
			});


			// Add to array
			countries.push(datum);
		});

		// Create the dataframe
		var all_dataframe = createFromSources(imports,countries);
		
		// Filter by continent
		const dataframe = all_dataframe.filter(function(country){
			return country['continent'] == continentFilter;	
		});

		// Set the time scale using the data
		domainX(timelineScale,dataframe,dateparser);


		/***** Initialize the map *****/
		initTileLayer(L, map, centerLat, centerLng, initZoom);
		var mapSvg = initSvgLayer(map);
		var g = undefined;
		if (mapSvg) {
			g = mapSvg.select("g");
		}
		

		/***** Tip Info Box *****/
		var tip = d3.tip().attr('class','d3-tip');
		tip.html(function(d) {
            return getToolTipText.call(this, d, data, localization);
        });
		g.call(tip);

		

		/***** Create the states *****/
		var path = createPath();
		createStates(g, path, world, tip);

		
		// Get active data
		var data = [];

		function updateView(){

			// Get slider date
			var slider_date = timelineScale.invert(slider_getXPos(slider));

			// Update Data
			data = timeBoundData(dataframe,slider_date);
			
			// Update Colors
			updateColors(data, color);
		}
		updateView();


		/***** Draw and onview reset redraw *****/
		map.on("zoom", function () {
			updateMap(mapSvg, g, path, world);
		});
		updateMap(mapSvg, g, path, world);


		/***** Set the timeline axis *****/
		trackSvg.append("g")
			.attr("class", "axis")
			.call(timelineAxis
					.ticks(d3.timeYear, 5)
					.tickFormat(d3.timeFormat('%Y'))); 

		/***** Add Mouse event to Time Slider *****/
		var drag = d3.drag()
			.on("start", function(d){
				slider_select(d3.select(this));
			})
			.on("drag", function(d){
				var x_pos = d3.event.x;
				slider_setXPos(d3.select(this),x_pos);
				updateView();
			})
			.on("end", function(d){
				slider_deselect(d3.select(this));
				updateView();
			});

		// Set drag event handle on sliders
		slider.call(drag)

	});


/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survollée par la souris.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d, data, localization) {

	var datum = data.filter(function(datum){
		return datum.id == d.id;
	})[0];

	var total = "NaN";
	if(datum != null){
		total = localization.getFormattedNumber(datum.total) + " USD";
	}

	var info = "<h2>" + d.properties["name"] + "</h2><p>" + total + "</p>";

	return info;
}

/**
 * Projete un point dans le repère de la carte.
 *
 * @param x   Le point X à projeter.
 * @param y   Le point Y à projeter.
 */
function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	this.stream.point(point.x, point.y);
}

/**
 * Trace un ensemble de coordonnées dans le repère de la carte.
 *
 * @return {*}  La transformation à utiliser.
 */
function createPath() {
	var transform = d3.geoTransform({point: projectPoint});
	return d3.geoPath().projection(transform);
}



/**
* Convert position string to integer, ex. 42px -> 42
* 
* @param attr_str  The string of a value followed by px
*/
function remove_px(attr_str){
	return +attr_str.substring(0,attr_str.length-2);
}


/***** Sliders Functions *****/
// Getter
function slider_getXPos(slider){

	var sliderOffset = remove_px(slider.style("left"));

	return sliderOffset - timelineOffset + sliderWidth/2.0;
}

// Setter
function slider_setXPos(slider,x_pos){
	
	// Get new position for slider
	var newpos = x_pos - sliderWidth/2;

	// Make sure this position is inside of the track
	if(newpos < trackLeftOffset){ 										// too left
		return;
	}else if(newpos + sliderWidth > trackLeftOffset + trackWidth){		// too right
		return;
	}

	// Set position
	slider.style("left",newpos + "px");

	// Set the date under the slider
	var actualXPos = slider_getXPos(slider);
	var parsedDate = timelineScale.invert(actualXPos);
	var formattedDate = localization.getYearStr(parsedDate);
	slider.select("p").text(formattedDate);
}

// Appearance
function slider_select(slider){
	slider.style("opacity","0.5");
}

function slider_deselect(slider){
	slider.style("opacity","1.0");
}


})(L, d3, localization);
