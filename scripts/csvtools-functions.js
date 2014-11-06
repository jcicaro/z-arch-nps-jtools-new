var CSVTOOLSFUNCTIONS = (function () {
	return {
		//Initiates file download of CSV. 
		//String needs to be properly formatted with "%0A" for each new line
		saveCSV: function (csvString, filename) {
			var a         = document.createElement('a');
			a.href        = 'data:attachment/csv;charset=utf-8,' + encodeURI(csvString);
			a.target      = '_blank';
			a.download    = filename + '.csv';
			
			document.body.appendChild(a);
			a.click();
		},
		
		//UNUSED - Returns a downloadable CSV ready string converted from headerArray and rowArray
		arraysToCSVReadyString: function (headerArray, rowArray) {
			
			//Use "%0A" for each new line 
			var newStr = "";
			newStr = headerArray.join(",") + "%0A";
			for (var l=0, lenL = rowArray.length; l<lenL; l++) {
				newStr = newStr + rowArray[l].join(",") + "%0A"; //converts rowArray to string
			}
			return newStr;
		},
		
		//Returns a CSV copy/paste ready string converted from headerArray and rowArray
		arraysToCSVText: function(headerArray, rowArray) {
			//Use "\n" for each new line 
			var newStr = "";
			newStr = headerArray.join(",") + "\n";
			for(var l=0, lenL = rowArray.length; l<lenL; l++) {
				newStr = newStr + rowArray[l].join(",") + "\n";
			}
			return newStr;
		},
		
		
		//objs.sort(compare);
		compare: function (a,b) {
		    if (a.last_nom < b.last_nom)
			   return -1;
		    if (a.last_nom > b.last_nom)
			   return 1;
		    return 0;
		},
		
		
		findIndex: function(arr, txt) {
			var found = false;
			for (i = 0; i < arr.length && !found; i++) {
			    if (arr[i] === txt) {
				    found = true;
					return i;
			    }
			}
		},
        
        createPropertyArray: function(inp, delim) {
			
			var linesArray = inp.split('\n');
			var propArray = [];
			
			for (var i=0, len=linesArray.length; i<len; i++) {
                if (linesArray[i]) {
                    var delimIndex = linesArray[i].indexOf(delim);
                    var prop = {};
                    prop.propId = linesArray[i].substr(0, delimIndex).trim();
                    prop.propValue = linesArray[i].substr(delimIndex + 1).trim();
                    propArray.push(prop);
                }
			}
			
			return propArray;
		},

        replaceIdsWithValues: function(propInfoArray, txt){
			if (propInfoArray.length > 0) {
                var newTxt = txt;
				for (var i=0, len=propInfoArray.length; i<len; i++) { //loop through each propInfoArray object
                    var pId = propInfoArray[i].propId;
					var rePId = new RegExp(pId, 'g');
					if(newTxt.match(rePId)) {
						newTxt = newTxt.replace(rePId, propInfoArray[i].propValue);
					}
				}
                return newTxt;
			}
			else {
				return false;
			}
		},
        
        replaceValuesWithIds: function(propInfoArray, txt){
			if (propInfoArray.length > 0) {
                var newTxt = txt;
				for (var i=0, len=propInfoArray.length; i<len; i++) { //loop through each propInfoArray object
                    var pValue = propInfoArray[i].propValue;
					var rePValue = new RegExp(pValue, 'g');
					if(newTxt.match(rePValue)) {
						newTxt = newTxt.replace(rePValue, propInfoArray[i].propId);
					}
				}
                return newTxt;
			}
			else {
				return false;
			}
		}
	};
})();
