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
			if(getAccountID > 3) {
				//if we have account that we created than we can change the name
				$('#accName').hide();
				$('#accNameValue').show();
			} else {
				//we can not change account name of the first 3 accounts
				$('#accName').show();
				$('#accNameValue').hide();
			}
			//$('#accType').text(result.accountType);
			$('#accTypeValue').attr("value",result.accountType);
			//$('#accBalance').text(result.accountBalance);
			$('#accBalanceValue').attr("value",result.accountBalance);
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
				requestDelete.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
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
	});
	
	$("#saveAcc").on("click", function(event){
		if(confirm("Are you sure you want to update this account?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;
			var modifyAccountObject;
			
			var openedDB = localStorage["openedDB"];	
			var requestEdit = indexedDB.open(openedDB);	
				requestEdit.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
					var storeEdit = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	

					modifyAccountObject =  { 
						accountName: $("#accNameValue").val(),
						accountType: $("#accTypeValue").val(),
						accountBalance: $("#accBalanceValue").val(),
						accountDate: $("#accDate").html(),
						id: parseInt(getAccountID)
					};
					
					storeEdit.delete(parseInt(modifyAccountObject.id));
					storeEdit.add(modifyAccountObject);
					
					if(getAccountName != $("#accNameValue").val()) {
						//alert("name changed we should update this account name at all places");
						//update all incomes
						var storeEditIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
						var openedIndexIncomes = storeEditIncomes.index("by_incomeAccount");
						var numItemsIncomes = openedIndexIncomes.count();	
						var countTestIncomes = 0;
						numItemsIncomes.onsuccess = function(evt) {   		
							var numItemsIn = evt.target.result;
							var range = IDBKeyRange.only(getAccountName);
							if (openedIndexIncomes) {
								var curCursorIncomes = openedIndexIncomes.openCursor(range);		
								curCursorIncomes.onsuccess = function(evt) {
									var cursorIncomeAccount = evt.target.result;
									if (cursorIncomeAccount) {
										countTestIncomes++;
										//here we update income //alert("Income: " + countTestIncomes);
										var objIncomeAccount =  { 
											incomeName: cursorIncomeAccount.value.incomeName,
											incomeAmmount: cursorIncomeAccount.value.incomeAmmount,
											incomeAccount: $("#accNameValue").val(),
											incomeCategory: cursorIncomeAccount.value.incomeCategory,
											incomeDueDate: cursorIncomeAccount.value.incomeDueDate,
											incomeRepeatCycle: cursorIncomeAccount.value.incomeRepeatCycle,
											incomeRepeatEndDate: cursorIncomeAccount.value.incomeRepeatEndDate,
											incomeRepeat: cursorIncomeAccount.value.incomeRepeat,
											incomeRepeatLastUpdate: cursorIncomeAccount.value.incomeRepeatLastUpdate,
											incomeCreated: cursorIncomeAccount.value.incomeCreated,
											incomeNumItems: cursorIncomeAccount.value.incomeNumItems,
											id: cursorIncomeAccount.value.id
										};
										storeEditIncomes.delete(parseInt(objIncomeAccount.id));
										storeEditIncomes.add(objIncomeAccount);
										cursorIncomeAccount.continue();
									} else {
										//update all expenses
										var storeEditExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
										var openedIndexExpenses = storeEditExpenses.index("by_expenseAccount");
										var numItemsExpenses = openedIndexExpenses.count();	
										var countTestExpenses = 0;
										numItemsExpenses.onsuccess = function(evt) {   		
											var numItemsEx = evt.target.result;
											var rangeEx = IDBKeyRange.only(getAccountName);
											if (openedIndexExpenses) {
												var curCursorExpenses = openedIndexExpenses.openCursor(rangeEx);		
												curCursorExpenses.onsuccess = function(evt) {
													var cursorExpenseAccount = evt.target.result;
													if (cursorExpenseAccount) {
														countTestExpenses++;
														//here we update expense //alert("Expense: " + countTestExpenses);
														var objExpenseAccount =  { 
															expenseName: cursorExpenseAccount.value.expenseName,
															expenseAmmount: cursorExpenseAccount.value.expenseAmmount,
															expenseAccount: $("#accNameValue").val(),
															expenseCategory: cursorExpenseAccount.value.expenseCategory,
															expenseDueDate: cursorExpenseAccount.value.expenseDueDate,
															expenseRepeatCycle: cursorExpenseAccount.value.expenseRepeatCycle,
															expenseRepeatEndDate: cursorExpenseAccount.value.expenseRepeatEndDate,
															expenseRepeat: cursorExpenseAccount.value.expenseRepeat,
															expenseRepeatLastUpdate: cursorExpenseAccount.value.expenseRepeatLastUpdate,
															expenseCreated: cursorExpenseAccount.value.expenseCreated,
															expenseNumItems: cursorExpenseAccount.value.expenseNumItems,
															expenseBillPaid: cursorExpenseAccount.value.expenseBillPaid,
															id: cursorExpenseAccount.value.id
														};
														storeEditExpenses.delete(parseInt(objExpenseAccount.id));
														storeEditExpenses.add(objExpenseAccount);
														cursorExpenseAccount.continue();
													} else {
														sessionStorage.setItem("accountClickedName", $("#accNameValue").val());
														alert("This account is updated!");
														window.location.href = "accountDetails.html";
														return true;
													}
												}
											}
										}
										numItemsExpenses.onerror = function(evt) { var numItemsEx = 0; }
									}
								}
							}
						}	
						numItemsIncomes.onerror = function(evt) { var numItemsIn = 0; }
					} else {
						//alert("name no changed");
						sessionStorage.setItem("accountClickedName", $("#accNameValue").val());
						alert("This account is updated!");
						return true;
					}					
				}
				
				requestEdit.onerror = function(e) {
					alert('request.onerror!');
				}				
		} else {
			event.preventDefault();
			return false;
		}
	});
});