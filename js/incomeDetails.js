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

//var idGET = getUrlVars()["id"];
//var idGET = localStorage["clickedID"];
var getIncomeID = sessionStorage.getItem("incomeClickedID");
if(getIncomeID == null) {
	getIncomeID = 1;
}
															//alert(idGET);
function init() {
															//  alert("init");
  html5rocks.indexedDB.open(); // open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
var storeAccounts;
var replace = new Object;
var thisIncomeAccount = "";
var thisIncomeAmmount = "";

html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("incomes")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		
		store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		//$('#busy').hide();
		var requestID = store.get(parseInt(getIncomeID));
		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			$('#incomeName').text(result.incomeName);
			$('#incomeAmmount').text(result.incomeAmmount);
			$('#incomeAccount').text(result.incomeAccount);
			$('#incomeCategory').text(result.incomeCategory);			
			//$('#incomeDueDate').text(result.incomeDueDate);
			$('#incomeDueDate').text(result.incomeCreated);
			$('#incomeRepeatCycle').text(result.incomeRepeatCycle);
			$('#incomeRepeatEndDate').text(result.incomeRepeatEndDate);
				//get today date
				var today = new Date();
				var min = today.getMinutes();	if(min<10){min='0'+min}
				var h = today.getHours();		if(h<10){h='0'+h}
				var dd = today.getDate();		if(dd<10){dd='0'+dd}
				var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
				var yyyy = today.getFullYear(); 
				today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
			$('#currentDate').text(today);
			
			//this informations we need in case user delete this income, then we need to update the account that is related to the income
			thisIncomeAccount = result.incomeAccount;
			thisIncomeAmmount = result.incomeAmmount;
			
			storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
			var openedIndexFindAccount = storeAccounts.index("by_accountName");
			var singleKeyRangeAccount = IDBKeyRange.only(thisIncomeAccount);
			var cursorFindAccount = openedIndexFindAccount.openCursor(singleKeyRangeAccount);	
		
			cursorFindAccount.onsuccess = function (eve){
				var cursorThisAccount = eve.target.result;
				if (cursorThisAccount){
					if(cursorThisAccount.value.accountName == thisIncomeAccount){
						replace.accountName = cursorThisAccount.value.accountName;
						replace.accountType = cursorThisAccount.value.accountType;
						replace.accountBalance = (cursorThisAccount.value.accountBalance - thisIncomeAmmount);
						replace.accountDate = cursorThisAccount.value.accountDate;
						replace.id = cursorThisAccount.value.id;									
					}
					cursorThisAccount.continue();
				} else {
					//alert("finish");
				}
			}
		}
		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
		if(confirm("Are you sure you want to delete this income?")){
		
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);
			
			requestDelete.onsuccess = function(e) {
				html5rocks.indexedDB.db = e.target.result;

				var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
				storeAccounts.delete(parseInt(replace.id));
				storeAccounts.add(replace);
				var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
				store.delete(parseInt(getIncomeID));
				alert("This income is deleted!");
				return true;				
			}
			
			requestDelete.onerror = function(e) {
				alert('request.onerror!');
			}	
			
		} else {
			event.preventDefault();
			return false;
		}
	});
});

/*
	replace.incomeName = cursorThisID.value.incomeName;
	replace.incomeAmmount = cursorThisID.value.incomeAmmount;
	replace.incomeAccount = cursorThisID.value.incomeAccount;
	replace.incomeCategory = cursorThisID.value.incomeCategory;
	replace.incomeDueDate = cursorThisID.value.incomeDueDate;
	if(cursorThisID.value.incomeRepeatCycle == '') 	{ replace.incomeRepeatCycle = ''; } 
	else 			 { replace.incomeRepeatCycle = cursorThisID.value.incomeRepeatCycle; }
	if(cursorThisID.value.incomeRepeatEndDate == '')	{ replace.incomeRepeatEndDate = ''; }
	else			 { replace.incomeRepeatEndDate = cursorThisID.value.incomeRepeatEndDate; }
	replace.incomeRepeat = cursorThisID.value.incomeRepeat;
	replace.incomeRepeatLastUpdate = cursorThisID.value.incomeRepeatLastUpdate;
	replace.incomeCreated = cursorThisID.value.incomeCreated;
	replace.incomeNumItems = cursorThisID.value.incomeNumItems;
	replace.id = cursorThisID.value.id;
*/
