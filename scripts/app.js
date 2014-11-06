(function() {
	var app = angular.module('app', ['ui.router', 'controller', 'membertools-controller', 'csvtools-controller', 'matrixtools-controller', 'factory', 'directive', 'xeditable']);

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
			
			.state('matrixtools', {
				url: '/matrixtools',
				templateUrl: 'templates/matrixtools.html',
				controller: 'matrixToolsCtrl'
			})
			
			.state('codeme', {
				url: '/codeme',
				templateUrl: 'templates/codeme.html'
				/*controller: 'codemeCtrl'*/
			})
	}]);
	
	app.run(function(editableOptions) {
	  	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	});
	
})();
