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
						accountName: $("#accountName").val(),
						accountType: $("#accountType").val(),
						accountBalance: $("#accountBalance").val(),
						accountDate: $("#accountDate").val()
					};	