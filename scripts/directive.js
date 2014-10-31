(function() {
	
	var app = angular.module('directive', []);
	
	/*
	 * Directives
	 */
	app.directive('jNav', function(){
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


