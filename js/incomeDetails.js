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
		
		var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		$('#busy').hide();
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
		if(confirm("Are you sure you want to delete this income?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);
			
			requestDelete.onsuccess = function(e) {
				html5rocks.indexedDB.db = e.target.result;
				var storeDelete = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
				//get the account that is connected with this income, and subtract the amount of this income, from the account balance
/*				var accountThatNeedUpdate;
				var sumThatIsDeleted;
				var openedIndexFindThisID = storeDelete.index("by_incomeName");
				var cursorFindThisID = openedIndexFindThisID.openCursor();	
//alert("106");
				cursorFindThisID.onsuccess = function (ev){
					var cursorThisID = ev.target.result;
					if (cursorThisID){	
//alert("eachID: " + cursorThisID.value.id + " + currentID: " + parseInt(getIncomeID));
						if(cursorThisID.value["id"] == (parseInt(getIncomeID))){
							accountThatNeedUpdate = cursorThisID.value.incomeAccount;
							sumThatIsDeleted = cursorThisID.value.incomeAmmount;
//alert("114 - " + accountThatNeedUpdate + " - " + sumThatIsDeleted);
						}						
						cursorThisID.continue();
					} else {
// alert("finish");
					
//alert("118 - " + accountThatNeedUpdate + " - " + sumThatIsDeleted);
						//after we got the account that need to be updates, subtract the amount of the deleted income from the account balance
						var storeUpdateAccount = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
						var replace = new Object;
						
						var openedIndexFindAccount = storeUpdateAccount.index("by_accountName");
						var cursorFindAccount = openedIndexFindAccount.openCursor();	
						cursorFindAccount.onsuccess = function (eve){
							var cursorThisAccount = eve.target.result;
							if (cursorThisAccount){
								if(cursorThisAccount.value["accountName"] == accountThatNeedUpdate){
									replace.accountName = cursorThisAccount.value.accountName;
									replace.accountType = cursorThisAccount.value.accountType;
									replace.accountBalance = (cursorThisAccount.value.accountBalance - sumThatIsDeleted);
									replace.accountDate = cursorThisAccount.value.accountDate;
									replace.id = cursorThisAccount.value.id;
								}
								cursorThisAccount.continue();
							} else {
								storeUpdateAccount.delete(parseInt(replace.id));
								storeUpdateAccount.add(replace);
								
				storeDelete.delete(parseInt(getIncomeID));
				alert("This income is deleted!");
				return true;
							}
						}
					}
				}
*/
				storeDelete.delete(parseInt(getIncomeID));
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
