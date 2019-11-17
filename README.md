# African Armed Conflicts: Visualization & Forecasting

Predicting Interstate and Internal Conflicts using Small Arms Transfers, Defense Spending, etc. We use a time-series framework to tackle the problem.

[Link to interactive map](http://jeanromainroy.com/dataviz_election_2016.html)

# Overview

Let's first look at all the files in the repo

	$ tree --dirsfirst --filelimit 100

	.
	├── analysis
	│   ├── data
	│   │   ├── dataviz
	│   │   │   ├── arms_imports.json
	│   │   │   └── country_codes.json
	│   │   ├── nisat
	│   │   │   ├── resources
	│   │   │   │   ├── NISAT database public user manual.pdf
	│   │   │   │   └── nisat_query.png
	│   │   │   ├── arms_trades_exports.csv
	│   │   │   ├── arms_trades_imports.csv
	│   │   │   ├── arms_trades.zip
	│   │   │   ├── preproc_arms_import.csv
	│   │   │   └── prio_weapons_code.txt
	│   │   └── world
	│   │       ├── african_countries.csv
	│   │       ├── country_continent.csv
	│   │       ├── COW country codes.csv
	│   │       └── world_population.csv
	│   ├── 1-scraping.ipynb
	│   └── 2-preprocessing.ipynb
	├── dataviz
	│   ├── assets
	│   │   ├── css
	│   │   │   ├── leaflet.css
	│   │   │   └── style.css
	│   │   ├── img
	│   │   │   └── search.svg
	│   │   └── libs
	│   │       ├── d3.js
	│   │       ├── d3-tip.js
	│   │       ├── leaflet.js
	│   │       └── localization-en.js
	│   ├── data
	│   │   ├── arms_imports.json
	│   │   ├── country_continent.csv
	│   │   ├── cow_codes.json
	│   │   └── world.json
	│   ├── scripts
	│   │   ├── 1-preproc.js
	│   │   ├── 2-map.js
	│   │   └── main.js
	│   └── index.html
	└── README.md


**analysis/** : Contains the notebooks to collect, process, train and predict

**dataviz/** : Contains the interactive map, made with the D3.js library


# Datasets

- [Norwegian Initiative on Small Arms Transfers](http://nisat.prio.org/Trade-Database/Researchers-Database/)
- [Uppsala Conflict Data Program](https://ucdp.uu.se/downloads/)
- [Our World in Data](https://ourworldindata.org/military-spending#data-sources)
- [The World Bank](https://data.worldbank.org/indicator/sp.pop.totl)

# Launching jupyter notebook

Make sure to cd in analysis/ before launching jupyter notebook. If not, the paths won't work


# Potential Future Development


# Authors

* **Jean-Romain Roy** - *Co-author: data collection, preprocessing, logistic regression, interactive map* - [jeanromainroy](https://github.com/jeanromainroy)
