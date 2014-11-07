(function() {
    var app = angular.module('table-controller', []);
    
    app.controller('tableCtrl', ['$scope', function($scope) {
        
        csvContainer = CodeMirror.fromTextArea(document.getElementById("csvContainer"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		csvContainer.setSize("100%", "100%"); 
        
        $scope.csvOutput; //probably not necessary
		
		$scope.editorVisibility = true;
		$scope.transformMappingVisibility = false;
		$scope.memberResultsVisibility = false;
		$scope.tableVisibility = true;
        
        $scope.active;
		
        $scope.processMemberCSV = function() {
			$scope.processMemberTools();
			//$scope.csvOutput = $scope.mToolsInput; 
            csvContainer.setValue("");
        };
		
		$scope.toEditor = function() {
			alert();
			csvContainer.setValue($scope.csvOutput.toString());
			//csvContainer.setValue($scope.mToolsOutput.projectTextOutput);
		};
		
		$scope.test = function () {
			alert("Test");
		};
        
        $scope.showInContainer = function (obj, array, header) {
            var text = TABLEHELPERS.arraysToCSVText(array, header);
            csvContainer.setValue(text);
            csvContainer.refresh();
            
            localStorage.currentText = text;
            $scope.active = obj;
        };
		
		$scope.reset = function() {
            csvContainer.setValue("");
			$scope.editorVisibility = true;
			$scope.transformMappingVisibility = false;
			$scope.memberResultsVisibility = false;
			
			$scope.mToolsInput = {
				originalInputText: "", 
				originalInputLinesArray: [],
				headersArray: [],
				portalMapArray: [], //[{portalHeader, csvHeader, portalHeaderIndex, csvHeaderIndex}]
				
				companies: [], //array of unique companies from the companies column
				compObjects: [], //[{compName, compSuffix, compABN, userArray}]
				companyColumnIndex: "",
				companyShortCodeInput: [],
				companyABNInput: []
			};
			
			$scope.mToolsOutput = {
				portalOrderedArray: [],
				projectOrderedArray: [],
				portalTextOutput: "",
				projectTextOutput: ""
			};
			
			$scope.memberHeaders = {
				portalColumnHeaders: ["First Name","Surname","Position","Division","Telephone (10 digits)","Fax","Mobile","Email","Username","TPS Instances Access","TimeZone"],
				projectColumnHeaders: ["Username","Company BRN","Position","Email","Fax","Mobile","Office","Street","City","ZIP/Postcode","State","Country","PO Box","To DistributionGroups","CC DistributionGroups","MemberGroups"],
				csvPortalHeaderInput: ["","","","","","","","","","",""],
				csvProjectHeaderInput: ["","","","","","","","","","","","","","","",""]
			};
			
			$scope.timezone = {
				timezones: MTOOLSFUNCTIONS.timezones,
				timezoneInput: MTOOLSFUNCTIONS.timezones[47] //default
			};
		
		};
		
        
        /*
        ========================================================================================
        Member Tools Specific
        ========================================================================================
        */
        $scope.mToolsInput = {
			originalInputText: "", 
			originalInputLinesArray: [],
			headersArray: [],
			portalMapArray: [], //[{portalHeader, csvHeader, portalHeaderIndex, csvHeaderIndex}]
			
			companies: [], //array of unique companies from the companies column
			compObjects: [], //[{compName, compSuffix, compABN, userArray}]
			companyColumnIndex: "",
			companyShortCodeInput: [],
			companyABNInput: []
		};
		
		$scope.mToolsOutput = {
			portalOrderedArray: [],
			projectOrderedArray: [],
			portalTextOutput: "",
			projectTextOutput: ""
		};
		
		$scope.memberHeaders = {
			portalColumnHeaders: ["First Name","Surname","Position","Division","Telephone (10 digits)","Fax","Mobile","Email","Username","TPS Instances Access","TimeZone"],
			projectColumnHeaders: ["Username","Company BRN","Position","Email","Fax","Mobile","Office","Street","City","ZIP/Postcode","State","Country","PO Box","To DistributionGroups","CC DistributionGroups","MemberGroups"],
			csvPortalHeaderInput: ["","","","","","","","","","",""],
			csvProjectHeaderInput: ["","","","","","","","","","","","","","","",""]
		};
		
		$scope.timezone = {
			timezones: MTOOLSFUNCTIONS.timezones,
			timezoneInput: MTOOLSFUNCTIONS.timezones[47] //default
		};
		
		//from the actual csv from the portal
		var portalUsernameIndex = 8; 
		var portalTimezoneIndex = 10;
		
		
		//2 - Generate CSV files
		$scope.savePortalCSV = function () {
			TABLEHELPERS.saveCSV($scope.mToolsOutput.portalTextOutput, 'portal_bulkImportUser');
		};
		
		$scope.saveProjectCSV = function () {
			TABLEHELPERS.saveCSV($scope.mToolsOutput.projectTextOutput, 'project_bulkImportUser');
		};
		
		$scope.saveCompanyCSV = function(compObject) {
			var csvText = TABLEHELPERS.arraysToCSVText(compObject.userArray, $scope.memberHeaders.portalColumnHeaders);
			TABLEHELPERS.saveCSV(csvText, compObject.compName + '_bulkImportUser');
		};
		//END 2
		
		//1 - After Transform Mapping
		$scope.generateCSVReadyText = function () {
			$scope.transformMappingVisibility = false;
			$scope.memberResultsVisibility = true;
            $scope.editorVisibility = true;
		
			var inp = $scope.mToolsInput;
			var out = $scope.mToolsOutput;
			var mHead = $scope.memberHeaders;
			
			createPortalMapArray(); 
			function createPortalMapArray() {
				for(var i=0, len=mHead.csvPortalHeaderInput.length; i<len; i++) {
					//alert(mHead.csvPortalHeaderInput[i]);
					if(mHead.csvPortalHeaderInput[i] != "") {
						
						var csvToPortalMap = {};
						csvToPortalMap.portalHeader = mHead.portalColumnHeaders[i];
						csvToPortalMap.csvHeader = mHead.csvPortalHeaderInput[i];
						var csvHeaderIndex = findIndex(inp.headersArray, csvToPortalMap.csvHeader);
						var portalHeaderIndex = findIndex(mHead.portalColumnHeaders, csvToPortalMap.portalHeader);
						csvToPortalMap.portalHeaderIndex = portalHeaderIndex;
						csvToPortalMap.csvHeaderIndex = csvHeaderIndex;
						inp.portalMapArray.push(csvToPortalMap);
						//[{portalHeader, csvHeader, portalHeaderIndex, csvHeaderIndex}]
					}
					else {
						//Just add blanks
						var csvToPortalMap = {};
						csvToPortalMap.portalHeader = mHead.portalColumnHeaders[i];
						csvToPortalMap.csvHeader = "";
						
						csvToPortalMap.portalHeaderIndex = "";
						csvToPortalMap.csvHeaderIndex = "";
						inp.portalMapArray.push(csvToPortalMap);
					}
				}
			}
			
			saveCompanies ();
			function saveCompanies () {
				for(var i=0, len=inp.companies.length; i<len; i++) {
					var obj = {};
					if(typeof inp.companies[i] != 'undefined')
						obj.compName = inp.companies[i];
					else
						obj.compName = "";
						
					if(typeof inp.companyShortCodeInput[i] != 'undefined')
						obj.compSuffix = inp.companyShortCodeInput[i];
					else
						obj.compSuffix = "";
					
					if(typeof inp.companyABNInput[i] != 'undefined')
						obj.compABN = inp.companyABNInput[i];
					else 
						obj.compABN = "";
						
					obj.userArray = [];
					
					inp.compObjects.push(obj);
					
				}
			}
			
			arrayToPortalCSVString ();
			function arrayToPortalCSVString () {
			
				//Reorder inp.originalInputLinesArray
				var lineArray = [];
				var colArray = [];
				var newColArray = []; //reordered colArray
				
				for(var i=1, lenI=inp.originalInputLinesArray.length; i<lenI; i++) {
					colArray = inp.originalInputLinesArray[i].split(",");
					//Loop through inp.portalMapArray 
					for(var j=0, lenJ=inp.portalMapArray.length; j<lenJ; j++) {
						//Find the column in colArray which corresponds to inp.portalMapArray[j].csvHeaderIndex
						//push the value in that column to $scope.newColArray
						var csvIndex = inp.portalMapArray[j].csvHeaderIndex;
						var portalIndex = inp.portalMapArray[j].portalHeaderIndex;
						var val = colArray[csvIndex];
						if(typeof colArray[csvIndex] != 'undefined') {
							val = val.trim();
						}
						else {
							val = "";
						}
						newColArray.push(val);
						
					}

					//Username 
					var compSuffix = {};
					var compObject = {};
					compObject = TABLEHELPERS.getObject(inp.compObjects, 'compName', colArray[inp.companyColumnIndex].toUpperCase());
					compSuffix = compObject.compSuffix;
					if(!newColArray[portalUsernameIndex]) {
						var username = newColArray[0] + "." + newColArray[1] + "." + compSuffix; //+company
						newColArray[portalUsernameIndex] = username.toLowerCase().replace(/[^a-zA-Z0-9\.]/g,'');
					}
					
					
					//add the timezone
					if(!newColArray[portalTimezoneIndex]) {
						newColArray[portalTimezoneIndex] = MTOOLSFUNCTIONS.getTimezoneId($scope.timezone.timezoneInput);
					}
					
					out.portalOrderedArray.push(newColArray);
					
					//add newColArray to compObjects
					compObject.userArray.push(newColArray);
					
					newColArray = [];
					compSuffix = "";
				}
				
				out.portalTextOutput = TABLEHELPERS.arraysToCSVText(out.portalOrderedArray, mHead.portalColumnHeaders);
				
			}
			
			arrayToProjectCSVString();
			function arrayToProjectCSVString() {
				//Loop through portalOrderedArray
				//assign newColArray = csvProjectHeaderInput
				var newColArray = []; //csvProjectHeaderInput;
				var orderedArray = [];
				for(var i=0, len=out.portalOrderedArray.length; i<len; i++) {
					//assign each column
					newColArray.push(out.portalOrderedArray[i][8]); //"username"
					newColArray.push(getCompObjectFromEmail(out.portalOrderedArray[i][7]).compABN); //"Company BRN" 
					newColArray.push(out.portalOrderedArray[i][2]); //Position,
					newColArray.push(out.portalOrderedArray[i][7]); //Email,
					newColArray.push(out.portalOrderedArray[i][5]); //Fax,
					newColArray.push(out.portalOrderedArray[i][6]); //Mobile,
					newColArray.push(out.portalOrderedArray[i][4]); //Office,
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
				
				out.projectOrderedArray = orderedArray;

				out.projectTextOutput = TABLEHELPERS.arraysToCSVText(out.projectOrderedArray, mHead.projectColumnHeaders);
			}
            
            
            //$scope.showInContainer($scope.mToolsOutput.portalOrderedArray, $scope.memberHeaders.portalColumnHeaders);
            

            
			
		};

		
        //0 - Initial Processing of Member CSV (until showing of Transform Map)
		$scope.processMemberTools = function () {
			$scope.editorVisibility = false;
			$scope.transformMappingVisibility = true;
			
			var inp = $scope.mToolsInput;
			var mHead = $scope.memberHeaders;
			
			inp.originalInputText = csvContainer.getValue();
			inp.originalInputLinesArray = TABLEHELPERS.stringToLineArray(inp.originalInputText);
			inp.headersArray = TABLEHELPERS.getHeadersArray(inp.originalInputText);
			
			inp.companies = getUniqueCompanies("Company");
			
			//This function will also set $scope.mToolsInput.companyColumnIndex
			function getUniqueCompanies (compColumnName) {
				var arrCache = [];
				inp.companyColumnIndex = inp.headersArray.indexOf(compColumnName);
				
				for(var i=1, len=inp.originalInputLinesArray.length;i<len;i++) {
					var arr = inp.originalInputLinesArray[i].split(",");
					if(inp.companyColumnIndex) {
						var comp = arr[inp.companyColumnIndex].toUpperCase();
						arrCache.push(comp);
					}
				}
				 return arrCache.unique();
			}	
		};
		
		/*
        ========================================================================================
        END Member Tools Specific
        ========================================================================================
        */

		
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
		
		function getCompObjectFromEmail (email) {
			var compObjects = $scope.mToolsInput.compObjects;
			for (var i=0,len=compObjects.length; i<len; i++) {
				var userArray = compObjects[i].userArray;
				for (var j=0, lenJ=userArray.length; j<lenJ; j++) {
					if (userArray[j][7] === email) {
						return compObjects[i];
					}
				}
			}
			return false;
		}
        
        
        
    }]);
})();