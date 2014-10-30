(function() {
	var app = angular.module('app', ['ui.router', 'controller', 'factory', 'directive']);
	
	/*
	 * Route
	 */
	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise('/');
		
		$stateProvider
			.state('jtools', {
				url: '/',
				templateUrl: 'templates/jtools.html',
				controller: 'jtoolsCtrl',
			})
			.state('codeme', {
				url: '/codeme',
				templateUrl: 'templates/codeme.html',
				controller: 'codemeCtrl'
			})
	}]);
	
	

})();
