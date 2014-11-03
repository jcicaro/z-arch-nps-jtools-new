(function() {
	var app = angular.module('membertools-controller', []);
	
	app.controller('memberToolsCtrl', ['$scope', function($scope) {

		var csvContainer = CodeMirror.fromTextArea(document.getElementById("csvContainer"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		csvContainer.setSize("100%", "100%");
		//csvContainer.setValue(str);
		//csvContainer.getValue()
		
		$scope.jsonResult = {}; //not used yet
		
		
		$scope.csvInput = ""; //the input from csvContainer CM editor
		$scope.csvConvertedArray; //each line in the csvInput as arrays
		$scope.csvColumnHeaders = []; //array containing strings - column headers from the CSV
		$scope.csvCompanyIndex; //shows which column of the CSV the company is
		$scope.portalOrderedArray = [];
		$scope.projectOrderedArray = [];
		$scope.csvOutput = ""; //the main output string - need to convert to CSV
		$scope.csvOutputProject = ""; //the main output string - need to convert to CSV

		$scope.companies = []; //array of Companies from the CSV
		$scope.compObjects = []; //array of Company Objects with suffix and ABN : //[{compName, compSuffix, compABN}]
		$scope.companyShortCodeInput = []; //from the ng-repeat input in the company section
		$scope.companyABNInput = []; //from the ng-repeat input in the company section
		
		//initialises the text inputs for the CSV section
		//so none of them will be undefined
		$scope.csvPortalHeaderInput = ["","","","","","","","","","",""]; 
		$scope.portalColumnHeaders = ["First Name","Surname","Position","Division","Telephone (10 digits)","Fax","Mobile","Email","Username","TPS Instances Access","TimeZone"];
		$scope.projectColumnHeaders = ["Username","Company BRN","Position","Email","Fax","Mobile","Office","Street","City","ZIP/Postcode","State","Country","PO Box","To DistributionGroups","CC DistributionGroups","MemberGroups"];
		$scope.csvProjectHeaderInput = ["","","","","","","","","","","","","","","",""];
		$scope.csvHeaderInput = $scope.csvPortalHeaderInput; 
		
		
		$scope.csvToPortalMapArray = []; //[{portalHeader, csvHeader, portalHeaderIndex, csvHeaderIndex}]
		
		$scope.portalUsernameIndex = 8; //from the actual csv from the portal
		
		//Test function only, test functions can be put here for testing and debugging
		$scope.execute = function() {
			//alert("");
			//arrayToProjectCSVString();
			//alert(getCompanySuffixFromUsername('wendy.parker.thiess'));
			//getCompanyABN = function(compSuffix) 
			//alert(getCompanyABN(getCompanySuffixFromUsername('wendy.parker.thiess')));
		};
		
		$scope.showPreProcessor = function() {
			$scope.setColumnHeaders();
			$scope.setCompanies();
		};

		//Helper: showPreProcessor - Sets $scope.csvColumnHeaders, this one starts the process for transform mapping csv
		$scope.setColumnHeaders = function() {
			$scope.csvInput = csvContainer.getValue();
			$scope.csvConvertedArray = csvContainer.getValue().split('\n');
			$scope.csvColumnHeaders = $scope.csvConvertedArray[0].split(",");
			csvContainer.setValue("");
		};
		
		//Helper: showPreProcessor - sets $scope.companies, starts the process for getting the Company ABN and suffix info from users
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
		
		//Helper: process - saves the companies into scope.compObjects so the ABN and suffix are available
		$scope.saveCompanies = function() {
			//$scope.companyShortCodeInput
			//$scope.companyABNInput
			//$scope.compObjects
			for(var i=0, len=$scope.companies.length; i<len; i++) {
				var obj = {};
				if(typeof $scope.companies[i] != 'undefined')
					obj.compName = $scope.companies[i];
				else
					obj.compName = "";
					
				if(typeof $scope.companyShortCodeInput[i] != 'undefined')
					obj.compSuffix = $scope.companyShortCodeInput[i];
				else
					obj.compSuffix = "";
				
				if(typeof $scope.companyABNInput[i] != 'undefined')
					obj.compABN = $scope.companyABNInput[i];
				else 
					obj.compABN = "";
				
				$scope.compObjects.push(obj);
				//[{compName, compSuffix, compABN}]
			}
			//alert($scope.compObjects);
		};
		
		//Helper: returns the suffix based on the Company name from the CSV
		getCompanySuffix = function(compName) {
			//alert($scope.compObjects);
			var suffix = "";
			for(var i=0, len=$scope.compObjects.length; i<len; i++) {
				suffix = $scope.compObjects[i].compSuffix;
				if($scope.compObjects[i].compName == compName) {
					return suffix;
				}
			}
			return suffix;
		};
		
		//Helper: returns the ABN based on the Company suffix from the CSV
		getCompanyABN = function(compSuffix) {
			//alert($scope.compObjects);
			var compABN = "";
			for(var i=0, len=$scope.compObjects.length; i<len; i++) {
				compABN = $scope.compObjects[i].compABN;
				if($scope.compObjects[i].compSuffix == compSuffix) {
					return compABN;
				}
			}
			return compABN;
		};
		
		//Helper: returns the suffix based on the username
		getCompanySuffixFromUsername = function(username) {
			//alert($scope.compObjects);
			var unameArray = username.split(".");
			var suffix = unameArray[2]; //[fname,lname,suffix]
			return suffix;
		};
		
		
		//$scope.csvHeaderInput = [];
		$scope.process = function() {
			$scope.saveCompanies();
			//alert($scope.csvHeaderInput);
		
			createPortalMapArray(); //Uses: $scope.csvHeaderInput, $scope.portalColumnHeaders, $scope.csvColumnHeaders, $scope.csvToPortalMapArray
			function createPortalMapArray() {
				//process $scope.csvToPortalMapArray
				for(var i=0, len=$scope.csvHeaderInput.length; i<len; i++) {
					if($scope.csvHeaderInput[i] != "") {
						
						var csvToPortalMap = {};
						csvToPortalMap.portalHeader = $scope.portalColumnHeaders[i];
						csvToPortalMap.csvHeader = $scope.csvHeaderInput[i];
						var csvHeaderIndex = findIndex($scope.csvColumnHeaders, csvToPortalMap.csvHeader);
						var portalHeaderIndex = findIndex($scope.portalColumnHeaders, csvToPortalMap.portalHeader);
						csvToPortalMap.portalHeaderIndex = portalHeaderIndex;
						csvToPortalMap.csvHeaderIndex = csvHeaderIndex;
						$scope.csvToPortalMapArray.push(csvToPortalMap);
						//[{portalHeader, csvHeader, portalHeaderIndex, csvHeaderIndex}]
					}
					else {
						//Just add blanks
						var csvToPortalMap = {};
						csvToPortalMap.portalHeader = $scope.portalColumnHeaders[i];
						csvToPortalMap.csvHeader = "";
						//var csvHeaderIndex = findIndex($scope.csvColumnHeaders, csvToPortalMap.csvHeader);
						//var portalHeaderIndex = findIndex($scope.portalColumnHeaders, csvToPortalMap.portalHeader);
						csvToPortalMap.portalHeaderIndex = "";
						csvToPortalMap.csvHeaderIndex = "";
						$scope.csvToPortalMapArray.push(csvToPortalMap);
					}
				}
				//alert($scope.csvToPortalMapArray);
			}
			
			
			arrayToPortalCSVString();
			function arrayToPortalCSVString() {
				//process arrays
				//var energy = fruits.join();
				//var energy = fruits.join(" and ");
				//$scope.csvConvertedArray;
				
				var lineArray = [];
				var colArray = [];
				var newColArray = []; //reordered colArray
				var orderedArray = [];
				//i=0 is a header
				//Loop through all the lines
				for(var i=1, lenI=$scope.csvConvertedArray.length; i<lenI; i++) {
					colArray = $scope.csvConvertedArray[i].split(",");
					//Loop through $scope.csvToPortalMapArray 
					for(var j=0, lenJ=$scope.csvToPortalMapArray.length; j<lenJ; j++) {
						//Find the column in colArray which corresponds to $scope.csvToPortalMapArray[j].csvHeaderIndex
						//push the value in that column to $scope.newColArray
						var csvIndex = $scope.csvToPortalMapArray[j].csvHeaderIndex;
						var portalIndex = $scope.csvToPortalMapArray[j].portalHeaderIndex;
						//newColArray.push(colArray[csvIndex]);
						var val = colArray[csvIndex];
						if(typeof colArray[csvIndex] != 'undefined') {
							val = val.trim();
						}
						else {
							val = "";
						}
							
						newColArray.push(val);
						
					}

					//Username //str.toLowerCase()
					if(!newColArray[$scope.portalUsernameIndex]) {
						var username = newColArray[0] + "." + newColArray[1] + "." + getCompanySuffix(colArray[$scope.csvCompanyIndex]); //+company
						newColArray[$scope.portalUsernameIndex] = username.toLowerCase();
					}
					orderedArray.push(newColArray);
					newColArray = [];
				}
				
				$scope.portalOrderedArray = orderedArray;
				//alert($scope.portalOrderedArray);
			
				//convert orderedArray to string
				//Loop through orderedArray
				var newStr = "";
				var newStr = $scope.portalColumnHeaders.join(",") + "\n";
				for(var k=0, lenK = orderedArray.length; k<lenK; k++) {
					newStr = newStr + orderedArray[k].join(",") + "\n";
				}
				$scope.csvOutput = newStr;
			
			}
			
			arrayToProjectCSVString();
			function arrayToProjectCSVString() {
				//alert($scope.projectColumnHeaders);
				//Loop through $scope.portalOrderedArray
				//assign newColArray = $scope.csvProjectHeaderInput
				var newColArray = []; //$scope.csvProjectHeaderInput;
				var orderedArray = [];
				for(var i=0, len=$scope.portalOrderedArray.length; i<len; i++) {
					//newColArray = $scope.portalOrderedArray[i];
					//alert($scope.portalOrderedArray[i][8]);
					//assign each column
					newColArray.push($scope.portalOrderedArray[i][8]); //"username"
					newColArray.push(getCompanyABN(getCompanySuffixFromUsername($scope.portalOrderedArray[i][8]))); //"Company BRN" //getCompanyABN(getCompanySuffixFromUsername('wendy.parker.thiess'))
					newColArray.push($scope.portalOrderedArray[i][2]); //Position,
					newColArray.push($scope.portalOrderedArray[i][7]); //Email,
					newColArray.push($scope.portalOrderedArray[i][5]); //Fax,
					newColArray.push($scope.portalOrderedArray[i][7]); //Mobile,
					newColArray.push($scope.portalOrderedArray[i][5]); //Office,
					newColArray.push(""); //Street,
					newColArray.push(""); //City,
					newColArray.push(""); //ZIP/Postcode,
					newColArray.push(""); //State,
					newColArray.push(""); //Country,
					newColArray.push(""); //PO Box,
					newColArray.push(""); //To DistributionGroups,
					newColArray.push(""); //CC DistributionGroups,
					newColArray.push(""); //MemberGroups
					orderedArray.push(newColArray);
				}
				
				
				//Set $scope.projectOrderedArray
				$scope.projectOrderedArray = orderedArray;
				
				var newStr = "";
				var newStr = $scope.projectColumnHeaders.join(",") + "\n";
				for(var k=0, lenK = $scope.projectOrderedArray.length; k<lenK; k++) {
					newStr = newStr + $scope.projectOrderedArray[k].join(",") + "\n";
				}
				$scope.csvOutputProject = newStr;
			}
			
			
			//doesn't work
			//downloadNewCSV($scope.csvOutput);
			function downloadNewCSV(newStr) {
				//Convert to csv
				var csvContent = "data:text/csv;charset=utf-8,";
				csvContent += index < newStr; //index is not defined
				var encodedUri = encodeURI(newStr); //csvContent
				$window.open(encodedUri);
				
				/*
				var encodedUri = encodeURI(csvContent);
				var link = document.createElement("a");
				link.setAttribute("href", encodedUri);
				link.setAttribute("download", "my_data.csv");

				link.click(); // This will download the data file named "my_data.csv".
				
				//you can use: $window.open(url, windowName, attributes);
				*/
			}
		};
		
		
		/*
		 * Helper Functions
		 */
		Array.prototype.unique = function(a){
		    return function(){ return this.filter(a) }
		}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
		
		function findIndex(arr, txt) {
			var found = false;
			for (i = 0; i < arr.length && !found; i++) {
			  if (arr[i] === txt) {
				found = true;
				return i;
			  }
			}
		}
		
		//objs.sort(compare);
		function compare(a,b) {
		  if (a.last_nom < b.last_nom)
			 return -1;
		  if (a.last_nom > b.last_nom)
			return 1;
		  return 0;
		}
		//JSON.stringify(obj);
		/*
		 * End Helper Functions
		 */
	}]);
})();
