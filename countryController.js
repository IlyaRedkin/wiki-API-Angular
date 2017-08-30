var app = angular.module("myApp", []);
app.controller('CountryController', ['$scope','dataService', function($scope,dataService) {
	
	dataService.getCountries().then(function(countries){
		$scope.countriesList = countries;
	})

	$scope.selectedCountry = false;
	

	$scope.setSelectedCountry = function(country){
		$scope.selectedCountry = country;
		$scope.selectedRegion = false;
		dataService.getLanguages(country).then(function(country){
			$scope.languages = country;
		})

		dataService.getNeighbors(country).then(function(country){
			$scope.neighbors = country;
		})

		dataService.getRegions(country).then(function(country){
			$scope.regions = country;
		})
	}

	$scope.setSelectedRegion = function(region){
		$scope.selectedRegion = region;
	}
	
}]);