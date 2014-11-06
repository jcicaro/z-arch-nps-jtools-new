(function() {

	var app = angular.module('matrixtools-controller', []);
	
	app.controller('matrixToolsCtrl', ['$scope', function($scope) {
		var csvContainer = CodeMirror.fromTextArea(document.getElementById("csvContainer"), {
			lineNumbers : true,
			mode : "text/javascript",
			lineWrapping : true,
			indentUnit : 4,
			theme: 'twilight',
			matchBrackets : true
		}); //theme: 'twilight',
		csvContainer.setSize("100%", "100%");
		
		$scope.csvOutput = "";
		$scope.rowArray = [];
		$scope.topHeaderArray = [];
		$scope.leftHeaderArray = [];
		
		$scope.userMapArray = [];
		$scope.userGroupArray = [];
        
        $scope.propertyArray = []; //with propId and propName
		
		$scope.executeButton = function() {

            $scope.csvOutput = CSVTOOLSFUNCTIONS.replaceValuesWithIds($scope.propertyArray, csvContainer.getValue());
		};
        
        $scope.createPropertyArray = function () {
            $scope.propertyArray = CSVTOOLSFUNCTIONS.createPropertyArray(csvContainer.getValue(), "-");
            $scope.csvOutput = $scope.propertyArray;
        };
		
		/*
		userMapArray
		[
			{
				obj.leftHeader: WP09-BD-0010
				obj.topHeader: fname.lname.comp
			},
			{
				obj.leftHeader: WP09-BD-0020
				obj.topHeader: fname.lname.comp
			},
			{
				obj.leftHeader: WP09-BD-0040
				obj.topHeader: fname.lname.comp
			},
		]
		*/
        
        $scope.initialiseMatrix = function () {
            toRowArray();
			toTopHeaderArray();
			rowsToUserMapArray();
			userMapToUserGroupArrayLMTU();
			createGroupMemberCSV($scope.userGroupArray);
        };
		
		var toRowArray = function() {
			$scope.rowArray = csvContainer.getValue().split("\n");
		};
		
		var toTopHeaderArray = function() {
			$scope.topHeaderArray = $scope.rowArray[0].split(",");
		};
		
		var rowsToUserMapArray = function() {
			$scope.leftHeaderArray.push(""); //push nothing so that the index will start at 1
			//Loop through each rows
			for(var i=1, len=$scope.rowArray.length; i<len; i++) {
				var row = $scope.rowArray[i].split(",");
				$scope.leftHeaderArray.push(row[0]);
				//loop through each column and find X's 
				for(var j=1, lenJ=row.length; j<lenJ; j++) {
					if(row[j] != "") {
						var obj = {};
						obj.leftHeader = $scope.leftHeaderArray[i];
						obj.topHeader = $scope.topHeaderArray[j];
						$scope.userMapArray.push(obj);
					}
				}
			}
		};
		
		var findUser = function(userGroupArray, header) {
			//return false;
			for (var i=0, len=userGroupArray.length;i<len;i++) {
				if(header === userGroupArray[i].user) {
					return userGroupArray[i];
				}
			}
			return false;
		};
		
		//Left: Member Group; Top: User
		var userMapToUserGroupArrayLMTU = function() {
			for (var i=0, len=$scope.userMapArray.length; i<len; i++) {
				var obj = {};
				obj.user = "";
				obj.groups = [];
				
				var lHeader = $scope.userMapArray[i].leftHeader;
				var tHeader = $scope.userMapArray[i].topHeader;
				
				//if user doesn't already exist in the group array, returns userGroupArray object
				var existingUser = findUser($scope.userGroupArray, $scope.userMapArray[i].topHeader);
				if(!existingUser) {
					obj.user = $scope.userMapArray[i].topHeader;
					obj.groups.push($scope.userMapArray[i].leftHeader); //find unique groups at the end
					$scope.userGroupArray.push(obj);
				}
				else {
					existingUser.groups.push($scope.userMapArray[i].leftHeader);
				}
			}
		};
		
		//Left: User; Top: Member Group
		var userMapToUserGroupArrayLUTM = function() {
			for (var i=0, len=$scope.userMapArray.length; i<len; i++) {
				var obj = {};
				obj.user = "";
				obj.groups = [];
				
				var lHeader = $scope.userMapArray[i].leftHeader;
				var tHeader = $scope.userMapArray[i].topHeader;
				
				//if user doesn't already exist in the group array, returns userGroupArray object
				var existingUser = findUser($scope.userGroupArray, $scope.userMapArray[i].leftHeader);
				if(!existingUser) {
					obj.user = $scope.userMapArray[i].leftHeader;
					obj.groups.push($scope.userMapArray[i].topHeader); //find unique groups at the end
					$scope.userGroupArray.push(obj);
				}
				else {
					existingUser.groups.push($scope.userMapArray[i].topHeader);
				}
			}
		};
		
		var createGroupMemberCSV = function(userGroupArray) {
			for(var i=0, len=userGroupArray.length; i<len; i++) {
				var groups = userGroupArray[i].groups.join(";");
				$scope.csvOutput = $scope.csvOutput + userGroupArray[i].user + "," + groups + "\n";
			}
		};
        
		
	}]);

})();