(function() {
	var app = angular.module('csvtools-controller', []);
	
	app.controller('csvToolsCtrl', ['$scope', function($scope) {
		var csvContainer = CodeMirror.fromTextArea(document.getElementById("csvContainer"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		csvContainer.setSize("100%", "100%");
	
		
		$scope.csvInput = "";
		$scope.csvOutput = "";
		$scope.jsonResultArray = []; //converts csv to array of objects, each object correspond to a row
		
		
		$scope.csvConvertedArray = []; //each i is a string of comma delimited rows
		$scope.csvRowsArray = []; //each i is an array of comma delimited rows
		$scope.csvColumnHeadersArray = []; //each i is a string of column header
		
		$scope.executeButton = function() {
			alert($scope.csvRowsArray[0]);
		};
		
		$scope.processCSV = function() {
			//$scope.clearCM();
			$scope.parseColumnHeaders();
			$scope.rowsToObjects();
		};
		
		$scope.retrieveInputCSV = function() {
			csvContainer.setValue($scope.csvInput);
			csvContainer.refresh();
		};
		
		$scope.clearAll = function() {
			csvContainer.setValue("");
			csvContainer.refresh();
			
			$scope.csvInput = "";
			$scope.csvOutput = "";
			$scope.jsonResultArray = []; //converts csv to array of objects, each object correspond to a row
			
			
			$scope.csvConvertedArray = []; //each i is a string of comma delimited rows
			$scope.csvRowsArray = []; //each i is an array of comma delimited rows
			$scope.csvColumnHeadersArray = []; //each i is a string of column header
		};
		
		//Helper: processCSV - sets $scope.csvConvertedArray and $scope.csvColumnHeadersArray
		$scope.parseColumnHeaders = function() {
			$scope.csvInput = csvContainer.getValue();
			$scope.csvConvertedArray = csvContainer.getValue().split('\n');
			$scope.csvColumnHeadersArray = $scope.csvConvertedArray[0].split(",");
			csvContainer.setValue("");
		};
		
		//Helper: processCSV - sets $scope.jsonResultArray
		$scope.rowsToObjects = function() {
			//Loop through each row starting from row 1; 0 is a header
			for(var i=1, len=$scope.csvConvertedArray.length; i<len; i++) {
				var obj = {};
				var cellArray = $scope.csvConvertedArray[i].split(",");
				
				//Loop through each cell
				for(var j=0, lenJ=cellArray.length; j<lenJ; j++) {
					//if($scope.csvColumnHeadersArray[j]!="" && cellArray[j]!="") {
					if($scope.csvColumnHeadersArray[j]!="") {
						cellArray[j] = cellArray[j].trim();
						obj[$scope.csvColumnHeadersArray[j]] = cellArray[j];
					}
				}
				$scope.jsonResultArray.push(obj);
				$scope.csvRowsArray.push(cellArray);
			}
		};
		
		$scope.saveCSV = function () {
			//alert();
			$scope.jsonArrayToString();
			
			var csvString = $scope.csvOutput;
			var a         = document.createElement('a');
			a.href        = 'data:attachment/csv,' + csvString;
			a.target      = '_blank';
			a.download    = 'savedCSV.csv';
			
			document.body.appendChild(a);
			a.click();
		};
		
		//Helper : saveCSV
		$scope.jsonArrayToString = function() {
			//alert($scope.jsonResultArray);
			//Need to convert $scope.jsonResultArray Object to Array first
			//generate CSV friendly string using "%0A"
			var newStr = "";
			newStr = $scope.csvColumnHeadersArray.join(",") + "%0A";
			for(var l=0, lenL = $scope.csvRowsArray.length; l<lenL; l++) {
				newStr = newStr + $scope.csvRowsArray[l].join(",") + "%0A";
			}
			$scope.csvOutput = newStr;
			//alert($scope.csvOutput);
		};
		
		
	}]);
})();