															// alert("start");	
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;	
// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
// Hook up the errors to the console so we could see it.
// In the future, we need to push these messages to the user.
indexedDB.onerror = function(e) {
	console.log(e);
	//alert('Error:' + e);
};

//var getAccountID = getUrlVars()["id"];
//var getAccountID = localStorage["clickedID"];
var getAccountID = sessionStorage.getItem("accountClickedID");
if(getAccountID == null) {
	getAccountID = 1;
}
var getAccountName = sessionStorage.getItem("accountClickedName");
															//alert(getAccountID);
//if(getAccountID == 1) 
//{ $("#deleteAcc").hide(); } 
												
function init() {
															//  alert("init");
  html5rocks.indexedDB.open(); // open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
//												alert("html5rocks.indexedDB.open accountDetails.js");
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//store = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getAccountID));
		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			$('#accName').text(result.accountName);
			$('#accNameValue').attr("value",result.accountName);
			$('#accType').text(result.accountType);
			$('#accBalance').text(result.accountBalance);
			$('#accDate').text(result.accountDate);
				//get today date
				var today = new Date();
				var min = today.getMinutes();	if(min<10){min='0'+min}
				var h = today.getHours();		if(h<10){h='0'+h}
				var dd = today.getDate();		if(dd<10){dd='0'+dd}
				var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
				var yyyy = today.getFullYear(); 
				today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
			$('#currentDate').text(today);
			
			/*// now let's close the database again!
			var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();*/
		}
		

	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
		if(confirm("Are you sure you want to delete this account?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);	
//alert("90");
				requestDelete.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
//alert("93");
					var storeDelete = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
					storeDelete.delete(parseInt(getAccountID));
					alert("This account is deleted!");
				/*	var dbCLOSEdelete;
					dbCLOSEdelete = requestDelete.result;
					dbCLOSEdelete.close();*/
					return true;
				}
				
				requestDelete.onerror = function(e) {
					alert('request.onerror!');
				}				
				//return true;
				
		} else {
			event.preventDefault();
			return false;
		}
		
		/*var dbCLOSEdelete;
		dbCLOSEdelete = requestDelete.result;
		dbCLOSEdelete.close();*/
	});
	
	
	$("#addIncomeAcc").on("click", function(event){
		window.location.href = "incomeAdd.html?accountIncomeStart=" + getAccountName;
	});
	
	$("#addExpenseAcc").on("click", function(event){
		window.location.href = "expenseAdd.html?accountExpenseStart=" + getAccountName;
	});
});