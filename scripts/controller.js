(function() {
	
	var app = angular.module('controller', []);
	
	/*
	 * Controller
	 */
	app.controller('jtoolsCtrl', ['$scope', function($scope) {
		
		$scope.results = {};
		$scope.savedLines = [];
	
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
			$scope.results = JTOOLAUTOPROC.processText(getLeftText());
			editorRight.setValue($scope.results.combinedResults);
			toSummary($scope.results);
		});
	
		
		//==================================================================================================================//
		
		/*
		 * Helper Functions
		 */
		
		function getLeftText() {
			//editorLeft
			var cursor = editorLeft.getCursor();
			var textLeft = editorLeft.getLine(cursor.line);
			return textLeft;
		}
		
		function getTextFromEditor(cmEditor) {
			var cursor = cmEditor.getCursor();
			var text = cmEditor.getLine(cursor.line);
			return text;
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
		
		//==================================================================================================================//
		
		/*
		 * Button Clicks
		 */
		
		$scope.ptRow = function() {
			var results = JTOOLBTNPROC.parToRow(getLeftText());
			editorRight.setValue(results);
		};
		
		$scope.findAllPar = function() {
			inp = getLeftText();
			var numOpen = 1;
			var m = 0;
			while (m < inp.length) {

				if(inp.charAt(m) == "(") {
					numOpen++;

				}
				m++;
			}

			editorRight.setValue("");
			for(var i = 1; i < numOpen; i++) {
				var newTxt = JTOOLBTNPROC._findParentheses(i, inp);
				if(editorRight.getValue()) {
					editorRight.setValue(editorRight.getValue() + "\n" + newTxt);
				}
				else {
					editorRight.setValue(newTxt);
				}
			}
		};
		
		$scope.fncWoBrackets = function() {
			var results = JTOOLBTNPROC.addFNCWoBrackets(getLeftText());
			editorLeft.setValue(results);
		};
		
		$scope.addSimple = function() {
			var results = JTOOLBTNPROC.addSimpleInput(getLeftText());
			editorLeft.setValue(results);
		};
		
		$scope.addComplex = function() {
			var results = JTOOLBTNPROC.addComplexInput(getLeftText());
			editorLeft.setValue(results);
		};
		
		$scope.clearText = function() {
			editorLeft.setValue("");
			editorRight.setValue("");
		};

		$scope.copyLine = function() {
			var line = editorRight.getLine(editorRight.getCursor().line);
			editorLeft.setValue(editorLeft.getValue() + "\n\n" + line);
		};
		
		$scope.saveLine = function() {
			var index = $scope.savedLines.unshift(getTextFromEditor(editorRight));
			alert("Line Saved! \n\n" + $scope.savedLines[0]);
		};
		
		$scope.retrieveLines = function() {
			var len = $scope.savedLines.length;
			var retHeader = "\n\n########## RETRIEVED LINES ##########\n";
			var retFooter = "\n\n######## END RETRIEVED LINES ########\n";
			editorLeft.setValue(editorLeft.getValue() + retHeader);
			for (var i=0; i<len; i++) {
				var newTxt = $scope.savedLines[i];
				if(editorLeft.getValue()) {
					editorLeft.setValue(editorLeft.getValue() + "\n\n" + newTxt);
				}
				else {
					editorLeft.setValue(newTxt);
				}
			}
			editorLeft.setValue(editorLeft.getValue() + retFooter);
		};
		
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


//==================================================================================================================//
/*
 * Archive Code
 */


/*
// The ui-codemirror option
$scope.cmOptionLeft = {
	lineNumbers : true,
	mode : "text/javascript",
	lineWrapping : true,
	indentUnit : 4,
	theme : 'twilight',
	matchBrackets : true
};

// The ui-codemirror option
$scope.cmOptionRight = {
	lineNumbers : true,
	mode : "text/javascript",
	lineWrapping : true,
	indentUnit : 4,
	theme: 'twilight',
	matchBrackets : true
};

$scope.cmLeft = "Test";
//$scope.cmRight = "Test";
 */	