(function() {
	
	var app = angular.module('directive', []);
	
	/*
	 * Directives
	 */
	app.directive('navArea', function(){
		return {
			restrict: 'E',
			templateUrl: 'templates/nav.html'
			/*
			controller: 'aController',
			controllerAs: 'aCtrl'
			//
			controller: function() {
				
			}
			 */
		};
	});
	
})();


