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
var replaceAccountComplete = new Object;
var thisIncomeAccount = "";
var thisIncomeAmmount = "";
var replaceDeletedInstance;

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
			var result = e.target.result;
			if(!!result == false){alert(result);}
			
			$('#incomeName').text(result.incomeName);
			$('#incomeAmmount').text(result.incomeAmmount);
			$('#incomeAccount').text(result.incomeAccount);
			$('#incomeCategory').text(result.incomeCategory);			
			//$('#incomeDueDate').text(result.incomeDueDate);
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
				var todayDMY = dd+'/'+mm+'/'+yyyy;
			$('#currentDate').text(todayDMY);
			
			if(result.incomeNumItems > 1){
				var listDates = (result.incomeCreated).split("+");
				for(var countDates = 0; countDates < listDates.length; countDates++) {
					$('#incomeCreated').html($('#incomeCreated').html() + "<br><br>Date of income: " + listDates[countDates]);
					$('#incomeCreated').html($('#incomeCreated').html() + "<input type='submit' value='Delete This' onclick=deleteIncome('" + result.incomeCreated + "','" + listDates[countDates] + "','" + countDates + "','" + listDates.length + "','" + result.incomeBillPaid + "')>");	
				}	
			}			
			
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
						replace.accountBalance = (parseFloat(cursorThisAccount.value.accountBalance) - parseFloat(thisIncomeAmmount));
						replace.accountDate = cursorThisAccount.value.accountDate;
						replace.id = cursorThisAccount.value.id;						
						//this is when delete by button from header, then we need to extract sum for all instances
						replaceAccountComplete.accountName = cursorThisAccount.value.accountName;
						replaceAccountComplete.accountType = cursorThisAccount.value.accountType;
						replaceAccountComplete.accountBalance = (parseFloat(cursorThisAccount.value.accountBalance) - (parseFloat(thisIncomeAmmount) * parseFloat(result.incomeNumItems)));
						replaceAccountComplete.accountDate = cursorThisAccount.value.accountDate;
						replaceAccountComplete.id = cursorThisAccount.value.id;
					}
					cursorThisAccount.continue();
				} else {
					//alert("finish");
				}
			}			
			replaceDeletedInstance =  {
				incomeName: result.incomeName,
				incomeAmmount: result.incomeAmmount,
				incomeAccount: result.incomeAccount,
				incomeCategory: result.incomeCategory,
				incomeDueDate: result.incomeDueDate,
				incomeRepeatCycle: result.incomeRepeatCycle,
				incomeRepeatEndDate: result.incomeRepeatEndDate,
				incomeRepeat: result.incomeRepeat,
				incomeRepeatLastUpdate: result.incomeRepeatLastUpdate,
				incomeCreated: result.incomeCreated,
				incomeNumItems: (parseInt(result.incomeNumItems) - 1).toString(),
				id: result.id
			};			
		}
		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

String.prototype.replaceBetween = function(start, end, what) {
	return this.substring(0, start) + what + this.substring(end);
};

function deleteIncome(comleteStringDate, dateToDelete, currentPosition, totalPositions, comleteStringPaidStatus) {
	//alert(comleteStringDate);
	//var completeString = comleteStringDate;
	
	if(totalPositions == 1) {
		if(confirm("Are you sure you want to completely delete this income?")){		
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
				window.location.href = "incomesList.html";
				return true;				
			}			
			requestDelete.onerror = function(e) {
				alert('request.onerror!');
			}				
		} else {
			event.preventDefault();
			return false;
		}
	} else {
		if(confirm("Are you sure you want to delete this instance of the income created at " + dateToDelete + " ?")){
			//get info for updating replaceDeletedInstance.expenseBillPaid
			var originalStringPaidStatus = comleteStringPaidStatus;		
			var newOriginalPaidStatusString;			
			if(currentPosition == 0) {
				newOriginalPaidStatusString = originalStringPaidStatus.replaceBetween(currentPosition, 8, "");		
			} else {
				var deleteStartPosition8 = ((8 * (parseInt(currentPosition))) - 1);				
				newOriginalPaidStatusString = originalStringPaidStatus.replaceBetween(deleteStartPosition8, parseInt(deleteStartPosition8) + 8, "");
			}	
		
			if (currentPosition == 0) {					//if the first instance of the income is deleted
				var allStringDates = comleteStringDate;
				var allWithoutDeletedDate = allStringDates.replace(dateToDelete + "+", "");
				replaceDeletedInstance.incomeCreated = allWithoutDeletedDate;
				replaceDeletedInstance.incomeBillPaid = newOriginalPaidStatusString;
				//alert(allWithoutDeletedDate);
			} else {									//if the other then first instance of the income is deleted
				var allStringDates = comleteStringDate;
				var allWithoutDeletedDate = allStringDates.replace("+" + dateToDelete, "");
				replaceDeletedInstance.incomeCreated = allWithoutDeletedDate;
				replaceDeletedInstance.incomeBillPaid = newOriginalPaidStatusString;
				//alert(allWithoutDeletedDate);
			}
			
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
				store.add(replaceDeletedInstance);
				alert("This instance of the income is deleted!");
				window.location.href = "incomeDetails.html";
				return true;				
			}			
			requestDelete.onerror = function(e) {
				alert('request.onerror!');
			}		
		} else {
			event.preventDefault();
			return false;
		}
	}
	//completeString.replace(dateToDelete, "");
}

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
				storeAccounts.delete(parseInt(replaceAccountComplete.id));
				storeAccounts.add(replaceAccountComplete);
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