angular.module('WeatherReports',[])
	.controller('forecastController',['$scope', function($scope) {
			$scope.latitude = '4543';
			// $scope.longitude = '';
	
			// $scope.getWeatherData = function() {
			// 	var actionURL = "/api/weather/calebniara/json/?lat={{latitude}}&lon={{longitude}}";
			// 	$http.get(actionURL);
			// 	console.log("getWeatherData clicked!")
			// }
		}]);
