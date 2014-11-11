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
        
        $scope.tableVisibility = false;
        
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
            $scope.tableVisibility = true;
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
            
            $scope.tableVisibility = false;
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
            $scope.tableVisibility = false;
			$scope.csvOutput = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.csvColumnHeadersArray, $scope.csvRowsArray);
			csvContainer.setValue($scope.csvOutput.trim());
			csvContainer.refresh();
		};
        
        
        $scope.addSampleData = function () {
            var sample = "First name,Last name,Position,Company,Phone Number,Fax,Mobile Phone,Email,Existing account?,Current User Name,Training Required?\n" +
"Russell,Westbrook,Point Guard,Oklahoma Thunder,(07) 3002 1234,(07) 3002 9789,,rwestbrook@gmail.com,y,russell.westbrook.oth,y\n" +
"Kobe,Bryant,Shooting Guard,LA Lakers,(07) 3002 7852,(07) 3002 9789,0421 526 635,kobe.bryant@live.com,y,kobe.bryant.lal,n\n" +
"Kevin,Durant,Forward,Oklahoma Thunder,02 9632 2547,,0456 963 258,kdurant@gmail.com,y,kevin.durant.oth,n\n" +
"Charles,Barkley,Forward,LA Lakers,0415 604 215,07 5236 9658,07 4125 8563,charles.barkley@live.com,n,,y\n" +
"Martina,Hingis,Tennis star,Tennis International,,07 5236 5214,07 8525 9636,mhingis@tennis.com,n,,y";
            csvContainer.setValue(sample);
            csvContainer.refresh();
        };
	}]);
})();