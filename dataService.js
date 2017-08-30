function insertParams(string,params){
	for(i in params){
		string = string.replace('{'+i+'}',params[i]);
	}
	return string;
}

app.service('dataService',['$http',function($http){

	var countryQuery = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=\
	SELECT DISTINCT ?country ?countryLabel ?flag \
	WHERE {?country wdt:P31 wd:Q3624078 . \
		FILTER NOT EXISTS {?country wdt:P31 wd:Q3024240} \
		OPTIONAL { ?country wdt:P41 ?flag } . \
		SERVICE wikibase:label { bd:serviceParam wikibase:language "ru" } \
	} \
	ORDER BY ?countryLabel';

	var countryLanguages = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=\
	SELECT DISTINCT ?langLabel \
	WHERE {?country wdt:P31 wd:Q3624078 . \
		FILTER NOT EXISTS {?country wdt:P31 wd:Q3024240} \
		FILTER (?country = wd:{country_id}) \
		OPTIONAL { ?country wdt:P37 ?lang } . \
		SERVICE wikibase:label { bd:serviceParam wikibase:language "ru" } \
	} \
	ORDER BY ?countryLabel';

	var countryNeighbors = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query= \
	SELECT DISTINCT ?neighbor ?neighborLabel \
	WHERE \
	{ \
		?country wdt:P31 wd:Q3624078 . \
		FILTER (?country = wd:{country_id}) \
		OPTIONAL { ?country wdt:P47 ?neighbor } . \
		SERVICE wikibase:label { bd:serviceParam wikibase:language "ru" } \
	} \
	ORDER BY ?countryLabel';

	var countryRegions = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?query= \
	SELECT DISTINCT ?region ?regionLabel ?pop ?popLabel \
	WHERE \
	{ \
		?country wdt:P31 wd:Q3624078 . \
		FILTER (?country = wd:{country_id}) \
		OPTIONAL { ?country wdt:P150 ?region } . \
		OPTIONAL { ?region wdt:P1082 ?pop } . \
		SERVICE wikibase:label { bd:serviceParam wikibase:language "ru" } \
	} \
	ORDER BY ?countryLabel';

	var countries = {
		'list':[]
	};

	return {
		getCountries:function(){
			return $http.get(countryQuery).then(function(response){
				countries.list = response.data.results.bindings;
				console.log(countries.list);
				return countries;
			});
		},

		getLanguages:function(country){
			var c_id = country.country.value.split('/').pop();
			return $http.get(insertParams(countryLanguages,{
				'country_id':c_id
			})).then(function(response){
				country.langs = response.data.results.bindings;
				return country;
			});
		},

		getNeighbors:function(country){
			var c_id = country.country.value.split('/').pop();
			return $http.get(insertParams(countryNeighbors,{
				'country_id':c_id
			})).then(function(response){
				country.neighbors = response.data.results.bindings;
				return country;
			});
		},

		getRegions:function(country){
			var c_id = country.country.value.split('/').pop();
			return $http.get(insertParams(countryRegions,{
				'country_id':c_id
			})).then(function(response){
				country.regions = response.data.results.bindings;
				return country;
			});
		}
	}
}]);