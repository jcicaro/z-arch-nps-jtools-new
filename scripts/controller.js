(function() {
	
	var app = angular.module('controller', []);

	/*
	 * Controller
	 */
	app.controller('jtoolsCtrl', ['$scope', function($scope) {
		$scope.results = "";
		
		var editorRight = CodeMirror.fromTextArea(document.getElementById("editorRight"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		editorRight.setSize("100%", "100%");

		var editorLeft = CodeMirror.fromTextArea(document.getElementById("editorLeft"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		editorLeft.setSize("100%", "510");
		editorLeft.on('cursorActivity', function() { //'change'
			toEditorRight();
		});
		
		var textLeft = "";
		var textRight = "";
		
		function toEditorRight() {
			
			//editorLeft
			var cursor = editorLeft.getCursor();
			textLeft = editorLeft.getLine(cursor.line);
			
			//process textLeft
			$scope.results = JTOOLAUTOPROC.processText(textLeft);
			
			//editorRight
			textRight = $scope.results.combinedResults;
			editorRight.setValue(textRight);
		}
		
		function toSummary() {
			
		}

	}]);

	
	
	/*
	app.controller('codemeCtrl', ['$scope', 'DataFactory', function($scope, DataFactory) {
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
	*/
})();