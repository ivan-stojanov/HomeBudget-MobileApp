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

var ArrayObjectsFrom = new Array();
var indexAarraysFrom = 0;
var ArrayObjectsTo = new Array();
var indexAarraysTo = 0;
var ArrayObjectsIncomes = new Array();
var indexAarraysIncomes = 0;
var ArrayObjectsExpenses = new Array();
var indexAarraysExpenses = 0;

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
		}

	//this info will be stored, in case the account is deleted
		//when delete an account, update transfer store so later to have information what was the name of deleted account
		var storeTransfer = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
			//update everywhere when this account is set as FromAccount
		var openedIndexAccFrom = storeTransfer.index("by_transferFromAccount");					
		var numAccFrom = openedIndexAccFrom.count();			
		numAccFrom.onsuccess = function(evt) {	
			var numberAccountsFrom = evt.target.result;					
			
			if (openedIndexAccFrom) {
				var singleKeyRangeTransferAccFrom = IDBKeyRange.only(getAccountID.toString());
				var curCursorTransferAccFrom = openedIndexAccFrom.openCursor(singleKeyRangeTransferAccFrom);
				curCursorTransferAccFrom.onsuccess = function(evet) {
					var cursorTransAccFrom = evet.target.result;								
					if (cursorTransAccFrom) {
						if((cursorTransAccFrom.value.transferFromAccount).toString() == getAccountID.toString()) {
							var objTransferFrom = {
								transferAmmount: (cursorTransAccFrom.value.transferAmmount).toString(),
								transferDate: cursorTransAccFrom.value.transferDate,
								transferFromAccount: cursorTransAccFrom.value.transferFromAccount,
								transferToAccount: cursorTransAccFrom.value.transferToAccount,
								transferStatus: cursorTransAccFrom.value.transferStatus,
								transferHistoryFromAccount: getAccountName,
								transferHistoryToAccount: cursorTransAccFrom.value.transferHistoryToAccount,
								id: cursorTransAccFrom.value.id
							};
							
							var todayDate = new Date();
							var currentTransferDateArray = (cursorTransAccFrom.value.transferDate).split('-');
							var currentTransferDate = new Date(currentTransferDateArray[0],currentTransferDateArray[1]-1,currentTransferDateArray[2]);
							if(todayDate < currentTransferDate) {
								objTransferFrom.transferStatus = "fail";
							}
							ArrayObjectsFrom[indexAarraysFrom] = objTransferFrom;
							indexAarraysFrom++;						
						}
						cursorTransAccFrom.continue();
					} else {
							//update everywhere when this account is set as ToAccount
						var openedIndexAccTo = storeTransfer.index("by_transferToAccount");
						
						var numAccTo = openedIndexAccTo.count();			
						numAccTo.onsuccess = function(evtn) {	
							var numberAccountsFrom = evtn.target.result;					
										
							if (openedIndexAccTo) {
								var singleKeyRangeTransferAccTo = IDBKeyRange.only(getAccountID.toString());
								var curCursorTransferAccFrom = openedIndexAccTo.openCursor(singleKeyRangeTransferAccTo);
								curCursorTransferAccFrom.onsuccess = function(event) {
									var cursorTransAccTo = event.target.result;
									if (cursorTransAccTo) {	
										if((cursorTransAccTo.value.transferToAccount).toString() == getAccountID.toString()) {
											var objTransferTo = {
												transferAmmount: (cursorTransAccTo.value.transferAmmount).toString(),
												transferDate: cursorTransAccTo.value.transferDate,
												transferFromAccount: cursorTransAccTo.value.transferFromAccount,
												transferToAccount: cursorTransAccTo.value.transferToAccount,
												transferStatus: cursorTransAccTo.value.transferStatus,
												transferHistoryFromAccount: cursorTransAccTo.value.transferHistoryFromAccount,
												transferHistoryToAccount: getAccountName,
												id: cursorTransAccTo.value.id
											};
											
											var todayDate = new Date();
											var currentTransferDateArray = (cursorTransAccTo.value.transferDate).split('-');
											var currentTransferDate = new Date(currentTransferDateArray[0],currentTransferDateArray[1]-1,currentTransferDateArray[2]);
											if(todayDate < currentTransferDate) {
												objTransferTo.transferStatus = "fail";
											}
											ArrayObjectsTo[indexAarraysTo] = objTransferTo;
											indexAarraysTo++;						
										}
										cursorTransAccTo.continue();										
									}
								}
							} else {
							}
						}						
						numAccTo.onerror = function(evt) { 
							alert("numAccTo.onerror"); 
						}
					}
				}
			}
		}		
		numAccFrom.onerror = function(evt) { 
			alert("numAccFrom.onerror"); 
		}		
		
		//when delete an account, update income store and replace incomeAccout to "Bank Account" where the account is set to this account
		var storeIncome = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
			//update everywhere where the account is set to this account
		var openedIndexIncomeUpdate = storeIncome.index("by_incomeAccount");					
		var numIncomeUpdates = openedIndexIncomeUpdate.count();			
		numIncomeUpdates.onsuccess = function(evt) {
			var numberIncomeUpdates = evt.target.result;										
			if (openedIndexIncomeUpdate) {
				var singleKeyRangeIncomeUpdate = IDBKeyRange.only(getAccountName.toString());
				var curCursorIncomeUpdate = openedIndexIncomeUpdate.openCursor(singleKeyRangeIncomeUpdate);
				curCursorIncomeUpdate.onsuccess = function(event) {
					var cursorIncomeUpdate = event.target.result;
					if (cursorIncomeUpdate) {	
						//alert(cursorIncomeUpdate.value.incomeName);
						var objIncome = {
							incomeName: cursorIncomeUpdate.value.incomeName,
							incomeAmmount: cursorIncomeUpdate.value.incomeAmmount,
							incomeAccount: "Bank Account",	//cursorIncomeUpdate.value.incomeAccount,
							incomeCategory: cursorIncomeUpdate.value.incomeCategory,
							incomeDueDate: cursorIncomeUpdate.value.incomeDueDate,
							incomeRepeatCycle: cursorIncomeUpdate.value.incomeRepeatCycle,
							incomeRepeatEndDate: cursorIncomeUpdate.value.incomeRepeatEndDate,
							incomeRepeat: cursorIncomeUpdate.value.incomeRepeat,
							incomeRepeatLastUpdate: cursorIncomeUpdate.value.incomeRepeatLastUpdate,
							incomeCreated: cursorIncomeUpdate.value.incomeCreated,
							incomeNumItems: cursorIncomeUpdate.value.incomeNumItems,
							id: cursorIncomeUpdate.value.id
						};						
						ArrayObjectsIncomes[indexAarraysIncomes] = objIncome;
						indexAarraysIncomes++;				
						cursorIncomeUpdate.continue();
					}
				}
			}
		}
		numIncomeUpdates.onerror = function(evt) { 
			alert("numIncomeUpdates.onerror"); 
		}

		//when delete an account, update expense store and replace expenseAccout to "Bank Account" where the account is set to this account
		var storeExpense = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
			//update everywhere where the account is set to this account
		var openedIndexExpenseUpdate = storeExpense.index("by_expenseAccount");					
		var numExpenseUpdates = openedIndexExpenseUpdate.count();			
		numExpenseUpdates.onsuccess = function(evt) {
			var numberExpenseUpdates = evt.target.result;										
			if (openedIndexExpenseUpdate) {
				var singleKeyRangeExpenseUpdate = IDBKeyRange.only(getAccountName.toString());
				var curCursorExpenseUpdate = openedIndexExpenseUpdate.openCursor(singleKeyRangeExpenseUpdate);
				curCursorExpenseUpdate.onsuccess = function(event) {
					var cursorExpenseUpdate = event.target.result;
					if (cursorExpenseUpdate) {	
						//alert(cursorExpenseUpdate.value.incomeName);
						var objExpense = {
							expenseName: cursorExpenseUpdate.value.expenseName,
							expenseAmmount: cursorExpenseUpdate.value.expenseAmmount,
							expenseAccount: "Credit Card",	//cursorExpenseUpdate.value.expenseAccount,
							expenseCategory: cursorExpenseUpdate.value.expenseCategory,
							expenseDueDate: cursorExpenseUpdate.value.expenseDueDate,
							expenseRepeatCycle: cursorExpenseUpdate.value.expenseRepeatCycle,
							expenseRepeatEndDate: cursorExpenseUpdate.value.expenseRepeatEndDate,
							expenseRepeat: cursorExpenseUpdate.value.expenseRepeat,
							expenseRepeatLastUpdate: cursorExpenseUpdate.value.expenseRepeatLastUpdate,
							expenseCreated: cursorExpenseUpdate.value.expenseCreated,
							expenseNumItems: cursorExpenseUpdate.value.expenseNumItems,
							expenseBillPaid: cursorExpenseUpdate.value.expenseBillPaid,
							id: cursorExpenseUpdate.value.id
						};						
						ArrayObjectsExpenses[indexAarraysExpenses] = objExpense;
						indexAarraysExpenses++;				
						cursorExpenseUpdate.continue();
					}
				}
			}
		}
		numExpenseUpdates.onerror = function(evt) { 
			alert("numExpenseUpdates.onerror"); 
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {

	$(".confirmDelete").on("click", function(event){		
		if((getAccountID == 1) || (getAccountID == 2) || (getAccountID == 3)) {
			alert("This account can not be deleted!");
		} else {
			if(confirm("Are you sure you want to delete this account?")){	
				var html5rocks = {};
				html5rocks.indexedDB = {};
				html5rocks.indexedDB.db = null;

				var openedDB = localStorage["openedDB"];	
				var requestDelete = indexedDB.open(openedDB);	
					requestDelete.onsuccess = function(e) {				
						html5rocks.indexedDB.db = e.target.result;
						
						//when delete an account, update transfer store so later to have information what was the name of deleted account
						var storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
						for(var counterFrom = 0; counterFrom < ArrayObjectsFrom.length; counterFrom++) {
							storeTransfers.delete(parseInt(ArrayObjectsFrom[counterFrom].id));
							storeTransfers.add(ArrayObjectsFrom[counterFrom]);								
						}
						for(var counterTo = 0; counterTo < ArrayObjectsTo.length; counterTo++) {
							storeTransfers.delete(parseInt(ArrayObjectsTo[counterTo].id));
							storeTransfers.add(ArrayObjectsTo[counterTo]);								
						}
						
						//when delete an account, update income store and replace incomeAccout to "Bank Account" where the account is set to this account
						var storeIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
						for(var counterIncome = 0; counterIncome < ArrayObjectsIncomes.length; counterIncome++) {
							storeIncomes.delete(parseInt(ArrayObjectsIncomes[counterIncome].id));
							storeIncomes.add(ArrayObjectsIncomes[counterIncome]);								
						}
						
						//when delete an account, update expense store and replace expenseAccout to "Bank Account" where the account is set to this account
						var storeExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
						for(var counterExpense = 0; counterExpense < ArrayObjectsExpenses.length; counterExpense++) {
							storeExpenses.delete(parseInt(ArrayObjectsExpenses[counterExpense].id));
							storeExpenses.add(ArrayObjectsExpenses[counterExpense]);								
						}
						
						var storeDelete = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
						storeDelete.delete(parseInt(getAccountID));
						alert("This account is deleted!");
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
		}
	});
	
	$("#addIncomeAcc").on("click", function(event){
		window.location.href = "incomeAdd.html?accountIncomeStart=" + getAccountName;
	});
	
	$("#addExpenseAcc").on("click", function(event){
		window.location.href = "expenseAdd.html?accountExpenseStart=" + getAccountName;
	});
});