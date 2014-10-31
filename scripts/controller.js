(function() {
	
	var app = angular.module('controller', []);
	
	

	/*
	 * Controller
	 */
	app.controller('jtoolsCtrl', ['$scope', function($scope) {
		$scope.results = {};
	
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
			$scope.results = getProcessedText();
			toEditorRight($scope.results);
			toSummary($scope.results);
		});
	
		var textLeft = "";
		var textRight = "";
		
		function getProcessedText() {
			//editorLeft
			var cursor = editorLeft.getCursor();
			textLeft = editorLeft.getLine(cursor.line);
			
			return JTOOLAUTOPROC.processText(textLeft);
		}
		
		function toEditorRight(resultSet) {
			//editorRight
			textRight = resultSet.combinedResults;
			editorRight.setValue(textRight);
		}
		
		function toSummary(resultSet) {
			var count = document.getElementById("count");
			count.value = resultSet.characters;
			
			var countOpen = document.getElementById("countOpen");
			countOpen.value = resultSet.openParenthesis;
			
			var countClosed = document.getElementById("countClosed");
			countClosed.value = resultSet.closedParenthesis;
			
			var resText = document.getElementById("textResult");
			resText.innerHTML = resultSet.addedAssignments;
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