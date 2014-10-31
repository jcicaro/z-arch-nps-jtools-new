var JTOOLAUTOPROC = (function() {
	
	/*
	 * START HELPER FUNCTIONS
	 */
	var pId = 6;
	var propIdFormat = /\[\d{6}\]/;
	var pIdSize = pId + 2;
	
	var newpId = 7;
	var newpropIdFormat = /\[\d{7}\]/;
	var newpIdSize = newpId + 2;
			
	var  addParenthesisSix = function(inp) {
				
		var txt = inp.toString().trim();
		
		var newTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "[") {
				//var propIdFormat = /\[\d{6}\]/;
				var subStr = txt.substring(i, i+pIdSize);
				
				if(propIdFormat.test(subStr)){
					newTxt = newTxt + "(" + txt.substring(i, i+pIdSize) + ")";
					i = i+pIdSize;
				}
				else {
					newTxt = newTxt + txt.charAt(i);
					i++;
				}
				
			}
			else {
				newTxt = newTxt + txt.charAt(i);
				i++;
				
			}
		
		}
		
		//Result
		var res = newTxt; //should return the text
		return res;
		
	};
			
	var  addParenthesisSeven = function(inp) {
				
		var txt = inp.toString().trim();
		
		var newTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "[") {
				//var newpropIdFormat = /\[\d{6}\]/;
				var subStr = txt.substring(i, i+newpIdSize);
				
				if(newpropIdFormat.test(subStr)){
					newTxt = newTxt + "(" + txt.substring(i, i+newpIdSize) + ")";
					i = i+newpIdSize;
				}
				else {
					newTxt = newTxt + txt.charAt(i);
					i++;
				}
				
			}
			else {
				newTxt = newTxt + txt.charAt(i);
				i++;
				
			}
		
		}
		
		//Result
		var res = newTxt; //should return the text
		return res;
		
	};
	
	var addExclamationSix = function(inp){
		var txt = inp.toString().trim();

		var newTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "[") {
				//var propIdFormat = /\[\d{6}\]/;
				var subStr = txt.substring(i, i+pIdSize);
				
				if(propIdFormat.test(subStr)){
					newTxt = newTxt + "[!" + txt.substring(i+1, i+pIdSize);
					i = i+pIdSize;
				}
				else {
					newTxt = newTxt + txt.charAt(i);
					i++;
				}
				
			}
			else {
				newTxt = newTxt + txt.charAt(i);
				i++;
				
			}
		
		}

		//Result
		var res = newTxt; //should return the text
		return res;

	};
			
	var addExclamationSeven = function(inp){

		var txt = inp.toString().trim();

		var newTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "[") {
				var subStr = txt.substring(i, i+newpIdSize);
				
				if(newpropIdFormat.test(subStr)){
					newTxt = newTxt + "[!" + txt.substring(i+1, i+newpIdSize);
					i = i+newpIdSize;
				}
				else {
					newTxt = newTxt + txt.charAt(i);
					i++;
				}
				
			}
			else {
				newTxt = newTxt + txt.charAt(i);
				i++;
				
			}
		
		}
		
		//Result
		var res = newTxt; //should return the text
		return res;

	};
	
	var addAssignmentSix = function(inp) {
		var parArray = [];
		var charArray = [];
		
		var txt = inp.toString().trim();
		var txt = inp.toString().trim();
		if (txt.slice(-1) == ";") {
			txt = txt.substring(0, txt.length - 1);
		}

		var newTxt = "";
		var assignTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "(") {
				//alert("true");
				parArray.push(txt.charAt(i));
				
				if (txt.charAt(i+1) === "[") {
					
					//var propIdFormat = /\[\d{6}\]/;
					var subStr = txt.substring(i+1, i+pIdSize+1);

					if(propIdFormat.test(subStr)){

						charArray.push(subStr + "=$" + parArray.length);
						i = i+pIdSize+1;
						
					}
					else {
						i++;
					}
				}
				else {
					i++;
				}
				
			}
			else {
				i++;
				
			}
		
		}
		
		
		var newCharArray = [];
		for(var i=0; i<charArray.length; i++) {
			if(i == 0) {
				newCharArray[0] = charArray[0];
			}
			else {
				var found = false;
				
				for (var j=0; j<newCharArray.length; j++) {
					var stri = charArray[i].toString().substring(0, pIdSize);
					var strj = newCharArray[j].toString().substring(0, pIdSize);
					
					if(stri === strj) {
						var strn =  newCharArray[j] + "||" + charArray[i].toString().substring(pIdSize+1);
						newCharArray[j] = strn;
						found = true;
						break;
					}
				}
				
				
				if (found === false) {
					newCharArray.push(charArray[i]);
				}
				
			}
		}
		
		for(var i=0; i<newCharArray.length; i++) {
			assignTxt = assignTxt + newCharArray[i] + ";";
		}
		
		newTxt = txt + ";" + assignTxt;
		
		//Result
		var res = newTxt; //should return the text
		return res;
				
	};
			
	var addAssignmentSeven = function(inp) {
		var parArray = [];
		var charArray = [];
		
		var txt = inp.toString().trim();
		if (txt.slice(-1) == ";") {
			txt = txt.substring(0, txt.length - 1);
		}

		var newTxt = "";
		var assignTxt = "";
		
		var i=0;
		while (i < txt.length) {
			
			if (txt.charAt(i) === "(") {
				parArray.push(txt.charAt(i));
				
				if (txt.charAt(i+1) === "[") {

					var subStr = txt.substring(i+1, i+newpIdSize+1);

					if(newpropIdFormat.test(subStr)){

						charArray.push(subStr + "=$" + parArray.length);
						i = i+newpIdSize+1;
						
					}
					else {
						i++;
					}
				}
				else {
					i++;
				}
				
			}
			else {
				i++;
				
			}
		
		}
		
		
		var newCharArray = [];
		for(var i=0; i<charArray.length; i++) {
			if(i == 0) {
				newCharArray[0] = charArray[0];
			}
			else {
				var found = false;
				
				for (var j=0; j<newCharArray.length; j++) {
					var stri = charArray[i].toString().substring(0, newpIdSize);
					var strj = newCharArray[j].toString().substring(0, newpIdSize);
					
					if(stri === strj) {
						var strn =  newCharArray[j] + "||" + charArray[i].toString().substring(newpIdSize+1);
						newCharArray[j] = strn;
						found = true;
						break;
					}
				}
				
				
				if (found === false) {
					newCharArray.push(charArray[i]);
				}
				
			}
		}
		
		for(var i=0; i<newCharArray.length; i++) {
			assignTxt = assignTxt + newCharArray[i] + ";";
		}
		
		newTxt = txt + ";" + assignTxt;

		
		//Result
		var res = newTxt; //should return the text
		return res;
	};
	
	/*
	 * END HELPER FUNCTIONS
	 */

	return {
		processText: function(inp) {
		
			var resultSet = {};
		
			var resAddPar = addParenthesisSix(inp);
			resAddPar = addParenthesisSeven(resAddPar);
			
			var resAddExcl = addExclamationSix(inp);
			resAddExcl = addExclamationSeven(resAddExcl);
			
			if (inp.search(/\d{6}\]\=\$\d/gi) >= 0 || inp.search(/\d{7}\]\=\$\d/gi) >= 0) {
				var resAddAssign = inp;
			}
			else {
				var resAddAssign = addAssignmentSix(inp);
				var resAddAssign = addAssignmentSeven(resAddAssign);
			}
			
			var res = "=== ADD BRACKETS ===\n" + resAddPar + "\n\n=== ADD EXCLAMATION ===\n" + resAddExcl + "\n\n=== ADD ASSIGNMENTS ===\n" + resAddAssign;
			
			//count
			var count = document.getElementById("count");
			//count.value = resAddAssign.length;
			resultSet.characters = resAddAssign.length;
			
			var matchOpen = resAddAssign.match(/\(/g);
			var countOpen = document.getElementById("countOpen");
			
			var matchClosed = resAddAssign.match(/\)/g);
			var countClosed = document.getElementById("countClosed");
			
			if(matchOpen && matchClosed) {
				//countOpen.value = matchOpen.length;
				//countClosed.value = matchClosed.length;
				resultSet.openBrackets = matchOpen.length;
				resultSet.closedBrackets = matchClosed.length;
			}
			else {
				//countOpen.value = 0;
				//countClosed.value = 0;
				resultSet.openParenthesis = 0;
				resultSet.closedParenthesis = 0;
			}
			
			//Result Text
			var resText = document.getElementById("textResult");
			//resText.innerHTML = resAddAssign;
			resultSet.addedAssignments = resAddAssign;
			
			resultSet.combinedResults = res;

			return resultSet;
			//return res;
		}
	};
})();