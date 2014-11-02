(function() {
	var app = angular.module('membertools-controller', []);
	
	app.controller('memberToolsCtrl', ['$scope', function($scope) {
		
		Array.prototype.unique = function(a){
		    return function(){ return this.filter(a) }
		}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
		
		var csvContainer = CodeMirror.fromTextArea(document.getElementById("csvContainer"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		csvContainer.setSize("100%", "100%");
		//csvContainer.setValue(txt);
		//csvContainer.getValue()
		
		$scope.jsonResult = {};
		
		$scope.portalHeaders = ["First Name","Surname","Position","Division","Telephone (10 digits)","Fax","Mobile","Email","Username","TPS Instances Access","TimeZone"];

		$scope.csvConvertedArray;
		$scope.csvColumnHeaders = [];
		$scope.csvCompanyIndex; //shows which column of the CSV the company is

		$scope.companies = [];
		$scope.companyShortCodeInput = [];
		$scope.companyABNInput = [];
		//$scope.companyABNInput[0]
		
		$scope.csvToPortalMapArray = [];
		$scope.csvToPortalMap = {}; //portalHeaderIndex; 
		
		$scope.execute = function() {
			alert();
		};

		$scope.setColumnHeaders = function() {
			$scope.csvConvertedArray = csvContainer.getValue().split('\n');
			$scope.csvColumnHeaders = $scope.csvConvertedArray[0].split(",");
		};
		
		$scope.setCompanies = function() {
			
			var arrCache = [];
			$scope.csvCompanyIndex = $scope.csvColumnHeaders.indexOf("Company");
			
			for(var i=1, len=$scope.csvConvertedArray.length;i<len;i++) {
				var arr = $scope.csvConvertedArray[i].split(",");
				if(arr[$scope.csvCompanyIndex]) {
					var comp = arr[$scope.csvCompanyIndex].toUpperCase();
					arrCache.push(comp);
				}
			}
			$scope.companies = arrCache.unique();
		};
		
		$scope.getCompanies = function() {
			alert($scope.companies.unique());
		};
		
	}]);
})();
