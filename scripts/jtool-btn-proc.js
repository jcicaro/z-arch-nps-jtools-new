var JTOOLBTNPROC = (function() {
	
	//Declare local functions here
	//var localFunc = function() {};
	
	return {
		 	parToRow: function(inp) {
				
				var txtToBeTrimmed = inp.toString().trim();
				var txt = "";
				if (txtToBeTrimmed.indexOf("(") != 0) {
					txt = txtToBeTrimmed.substring(txtToBeTrimmed.indexOf("("),txtToBeTrimmed.length);
					//alert(txt);
				}
				else {
					txt = txtToBeTrimmed;
				}
				
				var newTxt = "(";
				
				
				var i=1;
				while (i < txt.length) {

					if (txt.charAt(i) === "(") {
						newTxt = newTxt + "\n" + txt.charAt(i);
					}
					else {
						newTxt = newTxt + txt.charAt(i);
					}
					i++;
					
				}
				
				newTxt = newTxt.trim();
				return newTxt;
			},
			
			//helper function only - need to refactor the function that calls this in the controller.js
			_findParentheses : function(parToFind, inp) {

				var txt = inp.toString().trim();
				var ptf = parToFind;
				
				var indexCountOpen = 1;
				var indexOpen = 0;
				
				var numOpen = 1;
				var m = 0;
				while (m < txt.length) {
		
					if(txt.charAt(m) == "(") {
						numOpen++;
		
					}
					m++;
				}
				var newNumOpen = numOpen - 1;
				if(ptf >= numOpen) {
					alert("Value is greater than the number of brackets. The number of brackets is " + newNumOpen + ".");
				}
				else {
					var i=0;
					while (i < txt.length) {
						
						if (txt.charAt(i) == "(") {
							
							if(indexCountOpen == ptf) {
								indexOpen = i;
								break;
							}
							else {
								indexCountOpen++;
							}
						}
						else {
						}
						i++;
					}
					
					var indexClosed = 0;
					var brackCounter = 0;
					i++;
					while (i < txt.length) {
						//alert(brackCounter);
						if (txt.charAt(i) == ")") {
							if(brackCounter == 0) {
								indexClosed = i;
								break;
							}
							else {
								brackCounter--;
							}
							
						}
						else if (txt.charAt(i) == "("){
							brackCounter++;
						}
						i++;
						
					}
		
					var newTxt = txt.substring(indexOpen, indexClosed) + ")";
					return newTxt;
				}
			},
			
			//Add FNC Without Brackets Example
			addFNCWoBrackets: function() {
				var INPUT = "^[123456]-[234567]-[5678941]\\.pdf$";
				var note = "\n\n\n" + "Note: Do not put a semicolon at the end of the file extension section. This will automatically do it for you if required." + "\n";
				return (INPUT + note);
			},
			
			addSimpleInput: function() {
				var SIMPLEINPUT = "^((([1234567])-([234567]))|(([123456])))-([567894])|^(((([123456])-([234567]))|(([123456])))-([567894]))\.pdf$";
				var note = "\n\n\n" + "Note: You can ignore the \'ADD BRACKETS\' section if there are brackets in the input already." + "\n";
				return (SIMPLEINPUT + note);
			},
			
			addComplexInput: function() {
				var COMPLEXINPUT = "^(((([6461181])-([646119])-((([646112])-([646085]))|(([646112])-([854793])-([865427])-([646085])(-([646092]))?)|(([646099])-([646112])-([646093])-([646092])-(([646095])|([865428])))))_([646102])\.(pdf|nwd|tbp|xsr)$)|((([646118])-([646119])-([646112])-([859160])-([854794])-([646093]))_([646102])(-([859159]))?\.(pdf|nwd|tbp|xsr)$)|((([646118])-([646119])-((([682689])-([646085]))|(([646099])-([682689])-([646093])-([646092])-([646095]))))_([646102])\.(zip)$)|((([646118])-([646119])-(((MP|MD)-([865427]))|((SD)-([854793])))-([646085]))_([646102])\.(pdf|nwd|tbp|xsr)$))";
				var note = "\n\n\n" + "Note: Do not put a semicolon at the end of the file extension section. This will automatically do it for you if required." + "\n";
				return (COMPLEXINPUT + note);
			}
			
			
		};
	
})();
