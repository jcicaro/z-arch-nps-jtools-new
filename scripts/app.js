(function() {
	var app = angular.module('app', ['ui.router', 'controller', 'membertools-controller', 'csvtools-controller', 'factory', 'directive']);

	/*
	 * Route
	 */
	app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise('/');
		
		$stateProvider
			.state('jtools', {
				url: '/',
				templateUrl: 'templates/jtools.html',
				controller: 'jtoolsCtrl'
			})
			.state('membertools', {
				url: '/membertools',
				templateUrl: 'templates/membertools.html',
				controller: 'memberToolsCtrl'
			})
			.state('csvtools', {
				url: '/csvtools',
				templateUrl: 'templates/csvtools.html',
				controller: 'csvToolsCtrl'
			})
			.state('codeme', {
				url: '/codeme',
				templateUrl: 'templates/codeme.html'
				/*controller: 'codemeCtrl'*/
			})
	}]);
	
})();
