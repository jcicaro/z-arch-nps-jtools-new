var CSVTOOLSFUNCTIONS = (function() {
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
		
		//Returns a downloadable CSV ready string converted from headerArray and rowArray
		arraysToCSVReadyString: function(headerArray, rowArray) {
			
			//Use "%0A" for each new line 
			var newStr = "";
			newStr = headerArray.join(",") + "%0A";
			for(var l=0, lenL = rowArray.length; l<lenL; l++) {
				newStr = newStr + rowArray[l].join(",") + "%0A"; //converts rowArray to string
			}
			return newStr;
			
			
			/*
			//Same as above - removes spaces in cells
			var headerString = headerArray.join(",");
			var rowStrArray = []; //each rowArray[l] will be converted to string and pushed here
			for(var l=0, lenL = rowArray.length; l<lenL; l++) {
				var rowString = rowArray[l].join(","); // convert rowArray[l] to string
				rowStrArray.push(rowString); //push it to rowStrArray
			}
			rowStrArray.unshift(headerString);
			var newStr = rowStrArray.join("%0A");
			return newStr;
			*/
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
		}
	};
})();
