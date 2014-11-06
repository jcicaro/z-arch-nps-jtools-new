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
		
		$scope.csvOutput = ""; //the main output string - portal CSV
		$scope.csvOutputProject = ""; //the main output string - project CSV
		$scope.textOutput = ""; //for the text Area
		$scope.textOutputProject = ""; //for the text Area

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
		$scope.portalTimezoneIndex = 10;
		$scope.timezones = MTOOLSFUNCTIONS.timezones; //declare this membertools-controller.js
		$scope.timezoneInput = $scope.timezones[47]; //47 is the Sydney Timezone
		
		$scope.showResults = false;
		$scope.showTransformMap = false;
		
		
		
		
		$scope.showPreProcessor = function() {
			$scope.setColumnHeaders();
			$scope.setCompanies();
			$scope.showTransformMap = true;
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
					
				obj.userArray = [];
				
				$scope.compObjects.push(obj);
				//[{compName, compSuffix, compABN}]
			}
		};
		
		//Helper: returns the suffix based on the Company name from the CSV
		var getCompanySuffix = function(compName) {
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
		var getCompanyABN = function(compSuffix) {
			var compABN = "";
			for(var i=0, len=$scope.compObjects.length; i<len; i++) {
				compABN = $scope.compObjects[i].compABN;
				if($scope.compObjects[i].compSuffix == compSuffix) {
					return compABN;
				}
			}
			return compABN;
		};
		
		//Helper:
		var getCompObjectFromSuffix = function(compSuffix) {
			var comp = {};
			for(var i=0, len=$scope.compObjects.length; i<len; i++) {
				comp = $scope.compObjects[i];
				if(comp.compSuffix == compSuffix) {
					return comp;
				}
			}
			return false;
		};
		
		//Helper: returns the suffix based on the username
		var getCompanySuffixFromUsername = function(username) {
			var unameArray = username.split(".");
			var suffix = unameArray[2]; //[fname,lname,suffix]
			return suffix;
		};
		
		
		$scope.process = function() {
			$scope.saveCompanies();
			$scope.showResults = true;
			$scope.showTransformMap = false;
		
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
						
						csvToPortalMap.portalHeaderIndex = "";
						csvToPortalMap.csvHeaderIndex = "";
						$scope.csvToPortalMapArray.push(csvToPortalMap);
					}
				}
			}
			
			
			arrayToPortalCSVString();
			function arrayToPortalCSVString() {
				
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
					var compSuffix = getCompanySuffix(colArray[$scope.csvCompanyIndex]); 
					if(!newColArray[$scope.portalUsernameIndex]) {
						var username = newColArray[0] + "." + newColArray[1] + "." + compSuffix; //+company
						newColArray[$scope.portalUsernameIndex] = username.toLowerCase().replace(/[^a-zA-Z0-9\.]/g,'');
					}
					
					
					//code to add the timezone goes here
					if(!newColArray[$scope.portalTimezoneIndex]) {
						newColArray[$scope.portalTimezoneIndex] = MTOOLSFUNCTIONS.getTimezoneId($scope.timezoneInput);
					}
					
					orderedArray.push(newColArray);
					
					//Need to add newColArray to $scope.compObjects
					compObject = getCompObjectFromSuffix(compSuffix);
					compObject.userArray.push(newColArray);
					
					newColArray = [];
					compSuffix = "";
					
					//alert(compObject.userArray);
				}
				
				$scope.portalOrderedArray = orderedArray;

				$scope.textOutput = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.portalColumnHeaders, $scope.portalOrderedArray);
				$scope.csvOutput = $scope.textOutput;
			}
			
			arrayToProjectCSVString();
			function arrayToProjectCSVString() {
				//Loop through $scope.portalOrderedArray
				//assign newColArray = $scope.csvProjectHeaderInput
				var newColArray = []; //$scope.csvProjectHeaderInput;
				var orderedArray = [];
				for(var i=0, len=$scope.portalOrderedArray.length; i<len; i++) {
					//assign each column
					newColArray.push($scope.portalOrderedArray[i][8]); //"username"
					newColArray.push(getCompanyABN(getCompanySuffixFromUsername($scope.portalOrderedArray[i][8]))); //"Company BRN" //getCompanyABN(getCompanySuffixFromUsername('wendy.parker.thiess'))
					newColArray.push($scope.portalOrderedArray[i][2]); //Position,
					newColArray.push($scope.portalOrderedArray[i][7]); //Email,
					newColArray.push($scope.portalOrderedArray[i][5]); //Fax,
					newColArray.push($scope.portalOrderedArray[i][6]); //Mobile,
					newColArray.push($scope.portalOrderedArray[i][4]); //Office,
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
					newColArray = [];
				}
				
				
				//Set $scope.projectOrderedArray
				$scope.projectOrderedArray = orderedArray;

				$scope.textOutputProject = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.projectColumnHeaders, $scope.projectOrderedArray);
				$scope.csvOutputProject = $scope.textOutputProject;

			}

		};
		
		$scope.savePortalCSV = function () {
			CSVTOOLSFUNCTIONS.saveCSV($scope.csvOutput, 'portal_bulkImportUser');
		};
		
		$scope.saveProjectCSV = function () {
			CSVTOOLSFUNCTIONS.saveCSV($scope.csvOutputProject, 'project_bulkImportUser');
		};
		
		$scope.saveCompanyCSV = function(compObject) {
			var csvText = CSVTOOLSFUNCTIONS.arraysToCSVText($scope.portalColumnHeaders, compObject.userArray);
			CSVTOOLSFUNCTIONS.saveCSV(csvText, compObject.compName + '_bulkImportUser');
		};
		
		$scope.reloadRoute = function() {
			$scope.csvInput = ""; //the input from csvContainer CM editor
			$scope.csvConvertedArray = []; //each line in the csvInput as arrays
			$scope.csvColumnHeaders = []; //array containing strings - column headers from the CSV
			$scope.csvCompanyIndex = null; //shows which column of the CSV the company is
			$scope.portalOrderedArray = [];
			$scope.projectOrderedArray = [];
			
			$scope.csvOutput = ""; //the main output string - for the CSV
			$scope.csvOutputProject = ""; //the main output string - for the CSV
			$scope.textOutput = ""; //for the text Area
			$scope.textOutputProject = ""; //for the text Area
	
			$scope.companies = []; //array of Companies from the CSV
			$scope.compObjects = []; //array of Company Objects with suffix and ABN : //[{compName, compSuffix, compABN}]
			$scope.companyShortCodeInput = []; //from the ng-repeat input in the company section
			$scope.companyABNInput = []; //from the ng-repeat input in the company section
			
			$scope.csvToPortalMapArray = []; 
			
			$scope.showResults = false;
			$scope.showTransformMap = false;
		
		};
		
		
		/*
		 * Helper Functions
		 */
		Array.prototype.unique = function(a){
		    return function(){ return this.filter(a) }
		}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
		
		//added to csvtools-functions
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
		//added to csvtools-functions
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
