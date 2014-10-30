(function() {
	
	var app = angular.module('controller', []);
	
	/*
	 * Controller
	 */
	app.controller('homeCtrl', ['$scope', 'companies', function($scope, companies) {
		$scope.title = "This is the $scope.title of homeCtrl";
		$scope.items = ['This is $scope.items[0]', 'This is $scope.items[1]', 'This is $scope.items[2]'];
		$scope.selectedValue = "This is $scope.items[2]";
		$scope.companies = companies;
		
		$scope.save = function() {
			alert(JSON.stringify($scope.companies));
			//$http.post('files/companies', companies);
		};
		$scope.add = function() {
			$scope.companies.push({
				"companyId": $scope.company.companyId,
				"companyName": $scope.company.companyName
			});
		};
		
	}]);
	
	app.controller('aboutCtrl', ['$scope', 'DataFactory', function($scope, DataFactory) {
		$scope.title = "This is the $scope.title of aboutCtrl";
		$scope.items = ['This is $scope.items[0]', 'This is $scope.items[1]', 'This is $scope.items[2]'];
		DataFactory.getAll().success(function(comp) {
			$scope.companies = comp;
		});
		
		$scope.save = function() {
			alert(JSON.stringify($scope.companies));
			//$http.post('files/companies', companies);
		};
		$scope.add = function() {
			$scope.companies.push({
				"companyId": $scope.company.companyId,
				"companyName": $scope.company.companyName
			});
		};
	}]);
	
})();