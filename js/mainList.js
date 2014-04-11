localStorage["openedDB"] = "MyTestDatabase";
var version = 1;
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

//get today date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 
today = dd+'/'+mm+'/'+yyyy;

var html5rocks = {};
html5rocks.indexedDB = {};
var storeAccounts;
var storeIncomes;
var storeExpenses;
var storeCategories;
var storeBills;

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
			storeAccounts = request.transaction.objectStore("accounts");//html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
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
			{ accountName: "Cash on hand", accountType: "HomeAccount", accountBalance: "0", accountDate: today },
			{ accountName: "Credit Card", accountType: "HomeAccount", accountBalance: "0", accountDate: today },
			{ accountName: "Bank Account", accountType: "HomeAccount", accountBalance: "0", accountDate: today },
			{ accountName: "Ivan", accountType: "PrivatenIvan2", accountBalance: "30000", accountDate: "20/10/2010" },
			{ accountName: "Zoran", accountType: "PrivatenZoran2", accountBalance: "1000", accountDate: "21/11/2011" },
			{ accountName: "Niko", accountType: "PrivatenNiko2", accountBalance: "60000", accountDate: "21/10/2013" },
		];	
													//alert("created objects onupgradeneeded");
		storeAccounts.add(objAccounts[0]);storeAccounts.add(objAccounts[1]);storeAccounts.add(objAccounts[2]);
		storeAccounts.add(objAccounts[3]);storeAccounts.add(objAccounts[4]);storeAccounts.add(objAccounts[5]);

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
			storeIncomes = request.transaction.objectStore("incomes");//html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
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
			{ incomeName: "Party Income", incomeCategory: "Party", incomeAmmount: "500", incomeDueDate: "10/10/2010", incomeAccount: "Ivan", incomeRepeat: "no", incomeRepeatCycle: "", incomeRepeatEndDate: "" },
			{ incomeName: "My Payment", incomeCategory: "Pay", incomeAmmount: "100", incomeDueDate: "10/10/2010", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatCycle: "Monthly", incomeRepeatEndDate: "12/12/2012" },
			{ incomeName: "Codefu Award", incomeCategory: "Award", incomeAmmount: "200", incomeDueDate: "10/10/2010", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatCycle: "Dayly", incomeRepeatEndDate: "11/11/2010" },
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
			storeExpenses = request.transaction.objectStore("expenses");//html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
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
			{ expenseName: "Books", expenseCategory: "Education", expenseAmmount: "500", expenseDueDate: "10/10/2010", expenseAccount: "Ivan", expenseRepeat: "no", expenseRepeatPeriod: "", expenseBillPaid: "paidNo" },
			{ expenseName: "Pizza", expenseCategory: "Food", expenseAmmount: "100", expenseDueDate: "10/10/2010", expenseAccount: "Zoran", expenseRepeat: "yes", expenseRepeatPeriod: "1 Month", expenseBillPaid: "paidNo" },
			{ expenseName: "T-Shirt", expenseCategory: "Clothes", expenseAmmount: "400", expenseDueDate: "10/10/2010", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatPeriod: "1 Year", expenseBillPaid: "paidNo" },
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
		storeExpenses.createIndex( "by_expenseBillPaid", "expenseBillPaid", { unique: false } );
		storeExpenses.createIndex( "by_id", "id", { unique: false } );
		storeExpenses.createIndex( "paid_Bills_Only", ['expenseName','expenseCategory','expenseBillPaid'], { unique: false } );
			
		//var storeCategories;
		if(dbS.objectStoreNames.contains("categories")) {
			//dbS.deleteObjectStore("categories");
			//storeExpenses = dbS.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeCategories = request.transaction.objectStore("categories");//html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeCategories = html5rocks.indexedDB.db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeCategories = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");
													 //alert("after get objectStore onupgradeneeded"); 
	
//this part is to add items in the account objectStore (when app is first Installed)
		const objCategories = [ //if (isBill == 1) then (isExpense == 1) byDefault, no matter what is in the object
			{ categoryType: "Loan", isIncome: "1", isExpense: "1", isBill: "1" },
			{ categoryType: "Internet", isIncome: "0", isExpense: "1", isBill: "1" },
			{ categoryType: "Wather", isIncome: "0", isExpense: "1", isBill: "1" },
			{ categoryType: "Prize", isIncome: "1", isExpense: "0", isBill: "0" },
			{ categoryType: "Shopping", isIncome: "0", isExpense: "1", isBill: "0" },
			{ categoryType: "Salary", isIncome: "1", isExpense: "0", isBill: "0" },
			{ categoryType: "Stipend", isIncome: "1", isExpense: "0", isBill: "0" },
			{ categoryType: "Education", isIncome: "1", isExpense: "1", isBill: "0" },
			{ categoryType: "Food", isIncome: "0", isExpense: "1", isBill: "0" },
			{ categoryType: "Clothes", isIncome: "1", isExpense: "1", isBill: "0" },
		];	
													//alert("created objects onupgradeneeded");
		for (var ind = 0; ind < objCategories.length; ++ind) {
			storeCategories.add(objCategories[ind]);
			//alert(objCategories[ind].categoryType);
		}
		//storeCategories.add(objExpenses[0]);storeCategories.add(objExpenses[1]);storeCategories.add(objExpenses[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the categories			
		storeCategories.createIndex( "by_categoryType", "categoryType", { unique: false } );
		storeCategories.createIndex( "by_isIncome", "isIncome", { unique: false } );
		storeCategories.createIndex( "by_isExpense", "isExpense", { unique: false } );
		storeCategories.createIndex( "by_isBill", "isBill", { unique: false } );
												////alert("end opened");
		/*
		//var storeBills;
		if(dbS.objectStoreNames.contains("bills")) {
			//dbS.deleteObjectStore("bills");
			//storeBills = dbS.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeBills = request.transaction.objectStore("bills");
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
			{ billCategory: "Education", billAmmount: 520, billDueDate: "10/10/2010", billAccount: "Ivan", billRepeat: "no", billRepeatPeriod: "" },
			{ billCategory: "Food", billAmmount: 170, billDueDate: "10/10/2010", billAccount: "Zoran", billRepeat: "yes", billRepeatPeriod: "1 Month" },
			{ billCategory: "Clothes", billAmmount: 400, billDueDate: "10/10/2010", billAccount: "Niko", billRepeat: "yes", billRepeatPeriod: "1 Year" },
		];	
													//alert("created objects onupgradeneeded");
		storeBills.add(objBills[0]);storeBills.add(objBills[1]);storeBills.add(objBills[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the bills			
		storeBills.createIndex( "by_billCategory", "billCategory", { unique: false } );
		storeBills.createIndex( "by_billAmmount", "billAmmount", { unique: false } );
		storeBills.createIndex( "by_billDueDate", "billDueDate", { unique: false } );
		storeBills.createIndex( "by_billAccount", "billAccount", { unique: false } );
		storeBills.createIndex( "by_billRepeat", "billRepeat", { unique: false } );
		storeBills.createIndex( "by_billRepeatCycle", "billRepeatCycle", { unique: false } );
		storeBills.createIndex( "by_billRepeatEndDate", "billRepeatEndDate", { unique: false } );
		storeBills.createIndex( "by_id", "id", { unique: false } );	
	*/	
	};
												
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(idGet) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("clickedID", idGet);
}