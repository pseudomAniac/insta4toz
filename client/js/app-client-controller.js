angular.constant('moment',moment)
	.module('WeatherReports', ['ngResource'])
	.controller('forecastController', ['$scope', '$resource', 'moment', function ($scope, $resource, moment) {
		var forecastData = $resource('/forecast/:city');
		forecastData.query(function (data) {
			$scope.weatherForecast = data;
			
		})
	}
])
