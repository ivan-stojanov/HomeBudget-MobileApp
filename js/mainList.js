localStorage["openedDB"] = "MyTestDatabase";
var version = 2;
													// alert("startMain");	
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;	
// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
// Hook up the errors to the console so we could see it. In the future, we need to push these messages to the user.
indexedDB.onerror = function(e) {
  console.log(e);
  //alert('Error:' + e);
};
//alert("in");
function init() {
												//alert("initMain");
	html5rocks.indexedDB.open();	// open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var storeAccounts;
var storeIncomes;
var storeExpenses;

html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
												//alert("openedMain");
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB, version);  
												//alert("opened MyTest Main");
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
											   //alert("request onupgradeneeded Main"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;

		//var storeAccounts;
		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//storeAccounts = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeAccounts = request.transaction.objectStore("accounts");/*html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeAccounts = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
													 //alert("after get objectStore onupgradeneeded"); 
//this part is to add items in the account objectStore (when app is first Installed)
		const objAccounts = [
			{ accountName: "Ivan", accountType: "PrivatenIvan", accountBalance: 35000, accountDate: "10/10/2010" },
			{ accountName: "Zoran", accountType: "PrivatenZoran", accountBalance: 1100, accountDate: "11/11/2011" },
			{ accountName: "Niko", accountType: "PrivatenNiko", accountBalance: 65000, accountDate: "11/10/2013" },
		];	
													//alert("created objects onupgradeneeded");
		storeAccounts.add(objAccounts[0]);storeAccounts.add(objAccounts[1]);storeAccounts.add(objAccounts[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the accounts													
		storeAccounts.createIndex( "by_accountName", "accountName", { unique: false } );
		storeAccounts.createIndex( "by_accountType", "accountType", { unique: false } );
		storeAccounts.createIndex( "by_accountBalance", "accountBalance", { unique: false } );
		storeAccounts.createIndex( "by_accountDate", "accountDate", { unique: false } );
		storeAccounts.createIndex( "by_id", "id", { unique: false } );			

		//var storeIncomes;
		if(dbS.objectStoreNames.contains("incomes")) {
			//dbS.deleteObjectStore("incomes");
			//storeIncomes = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeIncomes = request.transaction.objectStore("incomes");/*html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeIncomes = html5rocks.indexedDB.db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
													 //alert("after get objectStore onupgradeneeded"); 
	
//this part is to add items in the account objectStore (when app is first Installed)
		const objIncomes = [
			{ incomeName: "Party Income", incomeCategory: "Party", incomeAmmount: 500, incomeDueDate: "10/10/2010", incomeAccount: "Ivan", incomeRepeat: "no", incomeRepeatCycle: "", incomeRepeatEndDate: "" },
			{ incomeName: "My Payment", incomeCategory: "Pay", incomeAmmount: 100, incomeDueDate: "10/10/2010", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatCycle: "Monthly", incomeRepeatEndDate: "12/12/2012" },
			{ incomeName: "Codefu Award", incomeCategory: "Award", incomeAmmount: 200, incomeDueDate: "10/10/2010", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatCycle: "Dayly", incomeRepeatEndDate: "11/11/2010" },
		];	
													//alert("created objects onupgradeneeded");
		storeIncomes.add(objIncomes[0]);storeIncomes.add(objIncomes[1]);storeIncomes.add(objIncomes[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the incomes			
		storeIncomes.createIndex( "by_incomeName", "incomeName", { unique: false } );
		storeIncomes.createIndex( "by_incomeCategory", "incomeCategory", { unique: false } );
		storeIncomes.createIndex( "by_incomeAmmount", "incomeAmmount", { unique: false } );
		storeIncomes.createIndex( "by_incomeDueDate", "incomeDueDate", { unique: false } );
		storeIncomes.createIndex( "by_incomeAccount", "incomeAccount", { unique: false } );
		storeIncomes.createIndex( "by_incomeRepeat", "incomeRepeat", { unique: false } );
		storeIncomes.createIndex( "by_incomeRepeatCycle", "incomeRepeatCycle", { unique: false } );
		storeIncomes.createIndex( "by_incomeRepeatEndDate", "incomeRepeatEndDate", { unique: false } );
		storeIncomes.createIndex( "by_id", "id", { unique: false } );	

		//var storeExpenses;
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("expenses");
			//storeExpenses = dbS.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeExpenses = request.transaction.objectStore("expenses");/*html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeExpenses = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
													 //alert("after get objectStore onupgradeneeded"); 
	
//this part is to add items in the account objectStore (when app is first Installed)
		const objExpenses = [
			{ expenseName: "Books", expenseCategory: "Education", expenseAmmount: 520, expenseDueDate: "10/10/2010", expenseAccount: "Ivan", expenseRepeat: "no", expenseRepeatPeriod: "" },
			{ expenseName: "Pizza", expenseCategory: "Food", expenseAmmount: 170, expenseDueDate: "10/10/2010", expenseAccount: "Zoran", expenseRepeat: "yes", expenseRepeatPeriod: "1 Month" },
			{ expenseName: "T-Shirt", expenseCategory: "Clothes", expenseAmmount: 400, expenseDueDate: "10/10/2010", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatPeriod: "1 Year" },
		];	
													//alert("created objects onupgradeneeded");
		storeExpenses.add(objExpenses[0]);storeExpenses.add(objExpenses[1]);storeExpenses.add(objExpenses[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the expenses			
		storeExpenses.createIndex( "by_expenseName", "expenseName", { unique: false } );
		storeExpenses.createIndex( "by_expenseCategory", "expenseCategory", { unique: false } );
		storeExpenses.createIndex( "by_expenseAmmount", "expenseAmmount", { unique: false } );
		storeExpenses.createIndex( "by_expenseDueDate", "expenseDueDate", { unique: false } );
		storeExpenses.createIndex( "by_expenseAccount", "expenseAccount", { unique: false } );
		storeExpenses.createIndex( "by_expenseRepeat", "expenseRepeat", { unique: false } );
		storeExpenses.createIndex( "by_expenseRepeatCycle", "expenseRepeatCycle", { unique: false } );
		storeExpenses.createIndex( "by_expenseRepeatEndDate", "expenseRepeatEndDate", { unique: false } );
		storeExpenses.createIndex( "by_id", "id", { unique: false } );
												////alert("end opened");
		
		//var storeBills;
		if(dbS.objectStoreNames.contains("bills")) {
			//dbS.deleteObjectStore("bills");
			//storeBills = dbS.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeBills = request.transaction.objectStore("bills");/*html5rocks.indexedDB.db.transaction(["bills"], "readwrite").objectStore("bills");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeBills = html5rocks.indexedDB.db.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeBills = html5rocks.indexedDB.db.transaction(["bills"], "readwrite").objectStore("bills");
													 //alert("after get objectStore onupgradeneeded"); 
	
//this part is to add items in the account objectStore (when app is first Installed)
		const objBills = [
			{ billName: "Books", billCategory: "Education", billAmmount: 520, billDueDate: "10/10/2010", billAccount: "Ivan", billRepeat: "no", billRepeatPeriod: "" },
			{ billName: "Pizza", billCategory: "Food", billAmmount: 170, billDueDate: "10/10/2010", billAccount: "Zoran", billRepeat: "yes", billRepeatPeriod: "1 Month" },
			{ billName: "T-Shirt", billCategory: "Clothes", billAmmount: 400, billDueDate: "10/10/2010", billAccount: "Niko", billRepeat: "yes", billRepeatPeriod: "1 Year" },
		];	
													//alert("created objects onupgradeneeded");
		storeBills.add(objBills[0]);storeBills.add(objBills[1]);storeBills.add(objBills[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the bills			
		storeBills.createIndex( "by_billName", "billName", { unique: false } );
		storeBills.createIndex( "by_billCategory", "billCategory", { unique: false } );
		storeBills.createIndex( "by_billAmmount", "billAmmount", { unique: false } );
		storeBills.createIndex( "by_billDueDate", "billDueDate", { unique: false } );
		storeBills.createIndex( "by_billAccount", "billAccount", { unique: false } );
		storeBills.createIndex( "by_billRepeat", "billRepeat", { unique: false } );
		storeBills.createIndex( "by_billRepeatCycle", "billRepeatCycle", { unique: false } );
		storeBills.createIndex( "by_billRepeatEndDate", "billRepeatEndDate", { unique: false } );
		storeBills.createIndex( "by_id", "id", { unique: false } );	
	};
												////alert("end opened");
												
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(idGet) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("clickedID", idGet);
}
