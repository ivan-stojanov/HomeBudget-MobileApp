				//alert(json_encode(JSON.stringify($('#formDetails').serialize())));
				//var test2 = {accountName : theName};
				//var test = JSON.stringify({accountName : theName});
				//alert((JSON.parse(test)).accountName);
				//alert("serialize: " + $('#formDetails').serialize());
                // Send data to server through the ajax call
                // action is functionality we want to call and outputJSON is our data
                    $.ajax({
					    type: 'post',                   
						url: 'accountAdd.js',
						//data: /*$.parseJSON JSON.stringify(*/$('#formDetails').serialize(),
						data: {accountName : theName},
//UNCOMMENT THIS LINE				////		
//dataType: 'json',
						//contentType: "application/json",
						crossDomain: true,
						timeout: 5000,	
                        beforeSend: function() {
                            // This callback function will trigger before data is sent
							//alert("before send");
                            //$.mobile.showPageLoadingMsg(true); // This will show ajax spinner
							//alert("after send");
							sessionStorage.setItem("accountName", $.trim($("#accountName").val()));
							sessionStorage.setItem("accountType", $.trim($("#accountType").val()));
                        },/*
                        complete: function() {
                            // This callback function will trigger on data sent/received complete
							alert("before complete");
                            //$.mobile.hidePageLoadingMsg(); // This will hide ajax spinner
							alert("after complete");
                        },*/
                        success: function (result, status) {
							//$.mobile.changePage("#second");
						/*	alert("1JSON.stringify(result).accountName: " + JSON.stringify(result).accountName);		
							alert("2JSON.stringify(result.accountName): " + JSON.stringify(result.accountName));	
							alert("3JSON.stringify(result): " + JSON.parse(JSON.stringify(result)));								
							alert("4JSON.stringify(result).accountName: " + JSON.stringify(result).accountName);							
							alert("5result.accountName: " + result.accountName);	
							alert("6result: " + result);	
							alert("7accountName: " + accountName);
							alert("8JSON.stringify(result).accountName: " + JSON.stringify(result).accountName);
						
							alert("1eval('(' + result + ')'): " + eval('(' + result + ')'));
							alert("2eval('(' + result.accountName + ')'): " + eval('(' + result.accountName + ')'));
							alert("3eval('(' + (result).accountName + ')'): " + eval('(' + (result).accountName + ')'));
							alert("4eval('(' + (result) + ')').accountName: " + eval('(' + (result) + ')').accountName);
						*/		
	//						alert(sessionStorage.getItem("concat"));						
							//alert("8JSON.parse(result.accountName): " + JSON.parse(result.accountName));	
							//alert("9JSON.parse(result).accountName: " + JSON.parse(result).accountName);	
							//alert("10JSON.parse(result): " + JSON.parse(result));	

							//var response = JSON.stringify(result);
							//var obj = eval ("(" + response + ")");
							//alert(obj.accountName/*.accountName*/);
							alert(result.accountName);
							//$("#resultLog").html("accountName: " + returnResult.accountName/* + result.accountType response.accountName*/);
							//alert("after success");
                        },
                        error: function (request,error) {
                            // This callback function will trigger on unsuccessful action                
                            alert('Network error has occurred please try again! Status: ' + request.status + ', Error: ' + error);
							//$("#resultLog").html("Result: ");
                        }
                    });  













/*var request = new XMLHttpRequest();
    request.open("POST", "file:///accountAdd.html", true);
    request.onreadystatechange = function(){
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
                console.log("response " + request.responseText);
            }
        }
    }
    request.send();*/
/*	var concat = sessionStorage.getItem("accountName") + " " + sessionStorage.getItem("accountType");
	sessionStorage.setItem("concat", concat);
	alert("JS: " + sessionStorage.getItem("concat"));	
	alert($.trim($("#accountName").val()));
*/
var returnResult =  { 
						accountName: $("#accountName").val()/*,
						accountType: $("#accountType").val(),
						accountBalance: $("#accountBalance").val(),
						accountDate: $("#accountDate").val()*/
					};	
					return returnResult;
					
					
	