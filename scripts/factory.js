(function() {
	var app = angular.module('factory', []);
	
	/*
	 * Factory
	 */
	app.factory('DataFactory', ['$http', function($http) {
		var urlBase = 'files/jc-company.json';
		var dataFactory = {};
		
		dataFactory.getAll = function() {
			return $http.get(urlBase);
		};
		
		dataFactory.getOne = function (id) {
	        return $http.get(urlBase + '/' + id);
	    };
	
	    dataFactory.insertOne = function (param) {
	        return $http.post(urlBase, param);
	    };
	
	    dataFactory.updateOne = function (param) {
	        return $http.put(urlBase + '/' + param.ID, param)
	    };
	
	    dataFactory.deleteOne = function (id) {
	        return $http.delete(urlBase + '/' + id);
	    };
	
	    dataFactory.getOneParam = function (id) {
	        return $http.get(urlBase + '/' + id + '/orders');
	    };
		
		return dataFactory;
	}]);
	
	
})();
