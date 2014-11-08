(function() {
	var app = angular.module('csvtools-controller', []);
	
	app.controller('csvToolsCtrl', ['$scope', '$filter', '$state', '$stateParams', function($scope, $filter, $state, $stateParams) {
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
        
        if(typeof $state.$current.locals.globals.$stateParams.detail !== 'undefined') {
            csvContainer.setValue(localStorage.currentText);
            csvContainer.refresh();
        }
        

		$scope.executeButton = function() {
			//var str = CSVTOOLSFUNCTIONS.arraysToCSVReadyString($scope.csvColumnHeadersArray, $scope.csvRowsArray);
			//CSVTOOLSFUNCTIONS.saveCSV(str);
			//alert(localStorage.currentText);
            alert(typeof $state.$current.locals.globals.$stateParams.detail);
		};
        
        $scope.openInMTools = function () {
            localStorage.currentText = csvContainer.getValue();

            var a         = document.createElement('a');
			a.href        = '#/mtools/valstored';
			a.target      = '_blank';
			
			document.body.appendChild(a);
			a.click();
        };
        
        $scope.moveLeft = function (column) {
            
            if(column !== 0) {
                
                for (var i=0, len=$scope.csvRowsArray.length; i<len; i++) {
                    var colStr = $scope.csvRowsArray[i][column];
                    //$scope.csvRowsArray[i].splice(column,1);
                    $scope.csvRowsArray[i].splice(column-1,0,colStr);
                }
                var colHeaderStr = $scope.csvColumnHeadersArray[column];
                $scope.csvColumnHeadersArray.splice(column-1,0,colHeaderStr);
                
                $scope.deleteColumn(column+1);
            }
        };
        
        $scope.moveRight = function (column) {
            
            if(column !== $scope.csvRowsArray.length-1) {
                
                for (var i=0, len=$scope.csvRowsArray.length; i<len; i++) {
                    var colStr = $scope.csvRowsArray[i][column];
                    //$scope.csvRowsArray[i].splice(column,1);
                    $scope.csvRowsArray[i].splice(column+2,0,colStr);
                }
                var colHeaderStr = $scope.csvColumnHeadersArray[column];
                $scope.csvColumnHeadersArray.splice(column+2,0,colHeaderStr);
                
                $scope.deleteColumn(column);
            }
        };
        
        $scope.moveDown = function (row) {
            if(row !== $scope.csvRowsArray.length-1) {
                var rowStr = $scope.csvRowsArray[row];
                $scope.csvRowsArray.splice(row,1);
                $scope.csvRowsArray.splice(row+1,0,rowStr); 
            }
        };
        
        $scope.moveUp = function (row) {
            if(row !== 0) {
                var rowStr = $scope.csvRowsArray[row];
                $scope.csvRowsArray.splice(row,1);
                $scope.csvRowsArray.splice(row-1,0,rowStr);  
            }
        };
        
        $scope.deleteColumn = function (column) {
            //alert(column);
            for (var i=0, len=$scope.csvRowsArray.length; i<len; i++) {
                $scope.csvRowsArray[i].splice(column,1);
            }
            
            $scope.csvColumnHeadersArray.splice(column,1);
        };
        
        $scope.addColumnAfter = function (column) {
            //alert(column);
            for (var i=0, len=$scope.csvRowsArray.length; i<len; i++) {
                $scope.csvRowsArray[i].splice(column+1,0,$scope.csvRowsArray[i][column]);
            }
            
            $scope.csvColumnHeadersArray.splice(column+1,0,$scope.csvColumnHeadersArray[column]);
        };
		
	    $scope.deleteRow = function(row) {
	       $scope.csvRowsArray.splice(row,1);
	    };
        
        $scope.addRowAfter = function(row) {
            $scope.csvRowsArray.splice(row+1,0,$scope.csvColumnHeadersArray);    
	    };
		
		$scope.processCSV = function() {
			$scope.csvRowsArray = []; //this is to clear the table when the button is clicked
			$scope.parseColumnHeaders();
			$scope.rowsToObjects();
		};

		$scope.clearAll = function() {
			csvContainer.setValue("");
			csvContainer.refresh();
			
			$scope.csvInput = "";
			$scope.csvOutput = "";
			$scope.jsonResultArray = []; 

			$scope.csvConvertedArray = []; 
			$scope.csvRowsArray = []; 
			$scope.csvColumnHeadersArray = []; 
		};
		
		//Helper: processCSV - sets $scope.csvConvertedArray and $scope.csvColumnHeadersArray
		$scope.parseColumnHeaders = function() {
			$scope.csvInput = csvContainer.getValue();
			$scope.csvConvertedArray = csvContainer.getValue().split('\n');
			$scope.csvColumnHeadersArray = $scope.csvConvertedArray[0].split(",");
			csvContainer.setValue("");
		};
		
		//Helper: processCSV - sets $scope.jsonResultArray and $scope.csvRowsArray
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
			$scope.csvOutput = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.csvColumnHeadersArray, $scope.csvRowsArray);
			CSVTOOLSFUNCTIONS.saveCSV($scope.csvOutput, 'savedCSV');
		};
		
		$scope.showCurrentCSVInContainer = function() {
			$scope.csvOutput = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.csvColumnHeadersArray, $scope.csvRowsArray);
			csvContainer.setValue($scope.csvOutput);
			csvContainer.refresh();
		};
	}]);
})();