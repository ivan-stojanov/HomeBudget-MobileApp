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

//get today date
var today = new Date();
var min = today.getMinutes();	if(min<10){min='0'+min}
var h = today.getHours();		if(h<10){h='0'+h}
var dd = today.getDate();		if(dd<10){dd='0'+dd}
var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
var yyyy = today.getFullYear(); 
today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;

var html5rocks = {};
html5rocks.indexedDB = {};
var storeAccounts;
var storeIncomes;
var storeExpenses;
var storeCategories;
var storeBills;
var storeTransfers;

html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
//												alert("html5rocks.indexedDB.open mainList.js");
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
			{ accountName: "testIncomes", accountType: "test", accountBalance: "0", accountDate: "20/10/2010" },
			{ accountName: "testExpenses", accountType: "test", accountBalance: "0", accountDate: "21/11/2011" },
			{ accountName: "testBills", accountType: "test", accountBalance: "0", accountDate: "21/10/2013" },
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
			{ incomeName: "Party Income", incomeCategory: "Party", incomeAmmount: "500", incomeDueDate: "10/10/2014/23/59", incomeAccount: "Ivan", incomeRepeat: "no", incomeRepeatCycle: "", incomeRepeatEndDate: "", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "My Payment", incomeCategory: "Pay", incomeAmmount: "100", incomeDueDate: "10/10/2014/23/59", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatCycle: "Monthly", incomeRepeatEndDate: "12/12/2017/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "Codefu Award", incomeCategory: "Award", incomeAmmount: "200", incomeDueDate: "10/10/2015/23/59", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatCycle: "Dayly", incomeRepeatEndDate: "12/12/2017/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "Website Visits", incomeCategory: "Pay", incomeAmmount: "150", incomeDueDate: "10/10/2015/23/59", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatCycle: "Hourly", incomeRepeatEndDate: "26/04/2014/20/30", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "Clothes Sell", incomeCategory: "Pay", incomeAmmount: "2000", incomeDueDate: "10/10/2015/23/59", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatCycle: "Weekly", incomeRepeatEndDate: "12/12/2017/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "Other Sources", incomeCategory: "Other", incomeAmmount: "20000", incomeDueDate: "10/10/2015/23/59", incomeAccount: "Ivan", incomeRepeat: "yes", incomeRepeatCycle: "Yearly", incomeRepeatEndDate: "12/12/2017/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "testIN", incomeCategory: "Other", incomeAmmount: "10", incomeDueDate: "10/10/2015/23/59", incomeAccount: "testIncomes", incomeRepeat: "yes", incomeRepeatCycle: "Dayly", incomeRepeatEndDate: "12/12/2017/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
		];	
		
													//alert("created objects onupgradeneeded");
		storeIncomes.add(objIncomes[0]);storeIncomes.add(objIncomes[1]);storeIncomes.add(objIncomes[2]);
		storeIncomes.add(objIncomes[3]);storeIncomes.add(objIncomes[4]);storeIncomes.add(objIncomes[5]);
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
		storeIncomes.createIndex( "by_incomeRepeatLastUpdate", "incomeRepeatLastUpdate", { unique: false } );
		storeIncomes.createIndex( "by_incomeCreated", "incomeCreated", { unique: false } );
		storeIncomes.createIndex( "by_incomeNumItems", "incomeNumItems", { unique: false } );
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
			{ expenseName: "Books", expenseCategory: "Education", expenseAmmount: "500", expenseDueDate: "12/12/2015/23/59", expenseAccount: "Ivan", expenseRepeat: "no", expenseRepeatCycle: "", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2015/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Pizza", expenseCategory: "Food", expenseAmmount: "100", expenseDueDate: "12/12/2015/23/59", expenseAccount: "Zoran", expenseRepeat: "yes", expenseRepeatCycle: "Monthly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2015/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "T-Shirt", expenseCategory: "Clothes", expenseAmmount: "400", expenseDueDate: "12/12/2015/23/59", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatCycle: "Yearly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2015/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Bus", expenseCategory: "Ride", expenseAmmount: "400", expenseDueDate: "12/05/2014/23/59", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatCycle: "Dayly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/05/2014/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Bill: Wi-Fi", expenseCategory: "Bill", expenseAmmount: "100", expenseDueDate: "12/12/2015/23/59", expenseAccount: "Zoran", expenseRepeat: "yes", expenseRepeatCycle: "Hourly", expenseBillPaid: "paidYes", expenseRepeatEndDate: "27/04/2014/04/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Bill: Laptops", expenseCategory: "Bill", expenseAmmount: "400", expenseDueDate: "12/12/2014/23/59", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatCycle: "Weekly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2014/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Bill: testBL", expenseCategory: "Bill", expenseAmmount: "0", expenseDueDate: "12/12/2014/23/59", expenseAccount: "testBills", expenseRepeat: "yes", expenseRepeatCycle: "Dayly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2014/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "testEX", expenseCategory: "Clothes", expenseAmmount: "0", expenseDueDate: "12/12/2014/23/59", expenseAccount: "testExpenses", expenseRepeat: "yes", expenseRepeatCycle: "Dayly", expenseBillPaid: "paidNoo", expenseRepeatEndDate: "12/12/2014/23/59", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
		];	
													//alert("created objects onupgradeneeded");
		storeExpenses.add(objExpenses[0]);storeExpenses.add(objExpenses[1]);storeExpenses.add(objExpenses[2]);
		storeExpenses.add(objExpenses[3]);storeExpenses.add(objExpenses[4]);storeExpenses.add(objExpenses[5]);
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
		storeExpenses.createIndex( "by_expenseRepeatLastUpdate", "expenseRepeatLastUpdate", { unique: false } );
		storeExpenses.createIndex( "by_expenseCreated", "expenseCreated", { unique: false } );
		storeExpenses.createIndex( "by_expenseNumItems", "expenseNumItems", { unique: false } );
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
		//var storeTransfers;
		if(dbS.objectStoreNames.contains("transfers")) {
			//dbS.deleteObjectStore("transfers");
			//storeTransfers = dbS.createObjectStore('transfers', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			storeTransfers = request.transaction.objectStore("transfers");//html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			storeTransfers = html5rocks.indexedDB.db.createObjectStore('transfers', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
													 //alert("after get objectStore onupgradeneeded"); 
//this part is to add items in the account objectStore (when app is first Installed)
		const objTransfers = [
			{ transferFromAccount: "1", transferToAccount: "2", transferAmmount: "100", transferDate: "2014-08-16", transferHistoryFromAccount: "", transferHistoryToAccount: "", transferStatus: "no" },
			{ transferFromAccount: "1", transferToAccount: "3", transferAmmount: "200", transferDate: "2014-05-16", transferHistoryFromAccount: "", transferHistoryToAccount: "", transferStatus: "no" },
			{ transferFromAccount: "1", transferToAccount: "4", transferAmmount: "300", transferDate: "2014-02-13", transferHistoryFromAccount: "", transferHistoryToAccount: "", transferStatus: "no" },
		];					/* 1 = Cash on hand */  //these numbers are IDs of the accounts, in case their names are changed
													//alert("created objects onupgradeneeded");
		storeTransfers.add(objTransfers[0]);storeTransfers.add(objTransfers[1]);storeTransfers.add(objTransfers[2]);

													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the transfers													
		storeTransfers.createIndex( "by_transferFromAccount", "transferFromAccount", { unique: false } );
		storeTransfers.createIndex( "by_transferToAccount", "transferToAccount", { unique: false } );
		storeTransfers.createIndex( "by_transferAmmount", "transferAmmount", { unique: false } );
		storeTransfers.createIndex( "by_transferDate", "transferDate", { unique: false } );
		storeTransfers.createIndex( "by_transferHistoryFromAccount", "transferHistoryFromAccount", { unique: false } );
		storeTransfers.createIndex( "by_transferHistoryToAccount", "transferHistoryToAccount", { unique: false } );
		storeTransfers.createIndex( "by_transferStatus", "transferStatus", { unique: false } );
		
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

	request.onsuccess = function(e) {

	//upgrade incomes that have repeat cycle
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;

		var storeIncome = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");		
			var openedIndexIncomes = storeIncome.index("by_incomeRepeat");			
			var numIncomesRepeated = openedIndexIncomes.count();
			
			numIncomesRepeated.onsuccess = function(evt) {	
				var numIncomes = evt.target.result;	
				if (openedIndexIncomes) {
					var singleKeyRangeIncome = IDBKeyRange.only("yes");
					var curCursorIncomesRepeated = openedIndexIncomes.openCursor(singleKeyRangeIncome);
					//var howMany = 0;
					curCursorIncomesRepeated.onsuccess = function(evt) {
						var cursorIncome = evt.target.result;
						if (cursorIncome) {
							//get current object, in case we need it for update
							var obj =  { 
								incomeName: cursorIncome.value.incomeName,
								incomeAmmount: cursorIncome.value.incomeAmmount,
								incomeAccount: cursorIncome.value.incomeAccount,
								incomeCategory: cursorIncome.value.incomeCategory,
								incomeDueDate: cursorIncome.value.incomeDueDate,
								incomeRepeatCycle: cursorIncome.value.incomeRepeatCycle,
								incomeRepeatEndDate: cursorIncome.value.incomeRepeatEndDate,
								incomeRepeat: cursorIncome.value.incomeRepeat,
								incomeRepeatLastUpdate: cursorIncome.value.incomeRepeatLastUpdate,
								incomeCreated: cursorIncome.value.incomeCreated,
								incomeNumItems: cursorIncome.value.incomeNumItems,
								id: cursorIncome.value.id
							};
						
							//count the difference between CURRENT TIME and LAST UPDATE of the current object
							var repeatPeriodIncome = cursorIncome.value.incomeRepeatCycle;
							var lastUpdateStringFormat = cursorIncome.value.incomeRepeatLastUpdate;
							var currentDayStringFormat = today;
							var endDateStringFormat = cursorIncome.value.incomeRepeatEndDate;
							var datePartsL = lastUpdateStringFormat.split("/");//	17/04/2014/23/59
							var datePartsC = currentDayStringFormat.split("/");//	17/04/2014/23/59
							var datePartsE = endDateStringFormat.split("/");//	17/04/2014/23/59
							var lastUpdateDate = new Date(datePartsL[2],datePartsL[1] - 1,datePartsL[0],datePartsL[3],datePartsL[4]);
							var currentDayDate = new Date(datePartsC[2],datePartsC[1] - 1,datePartsC[0],datePartsC[3],datePartsC[4]);
							var endRepeatDayDate = new Date(datePartsE[2],datePartsE[1] - 1,datePartsE[0],datePartsE[3],datePartsE[4]);
							
							var createdDayStringFormat = cursorIncome.value.incomeCreated;
							var dateCreatedParts = createdDayStringFormat.split("+");	//	17/04/2014/23/59+17/05/2014/23/59
							if(dateCreatedParts.length > 1) {							//	get day of last creation of last income
								createdDayStringFormat = dateCreatedParts[dateCreatedParts.length - 1];
							}							
							var datePartsCR = createdDayStringFormat.split("/");//	17/04/2014/23/59
							var lastCreatedDayDate = new Date(datePartsCR[2],datePartsCR[1] - 1,datePartsCR[0],datePartsCR[3],datePartsCR[4]);
							//alert(lastCreatedDayDate);

							if((endRepeatDayDate - lastCreatedDayDate/*currentDayDate*/ >= 0) && (currentDayDate - lastCreatedDayDate >= 0)) {
								//alert(lastUpdateDate);
								var difference_ms = currentDayDate - lastUpdateDate;
								//take out milliseconds
								difference_ms = difference_ms/1000;	var seconds = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var minutes = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var hours = Math.floor(difference_ms % 24);  
																	var days = Math.floor(difference_ms/24);
								
								var numberTimesIncomeAdded;
								if (repeatPeriodIncome == "Hourly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									if(days > 0) {
										hours = hours + (days * 24);
									}
									if(hours > 0) {
										var numberUpdates = hours;
										numberTimesIncomeAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each hour, if repeated hourly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours() + 1, lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextIncomeDayStringFormat = nextIncomeCreatedDayDate;
											//get nextIncomeDayStringFormat date in string format
											var minNext = nextIncomeDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextIncomeDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextIncomeDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextIncomeDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextIncomeDayStringFormat.getFullYear(); 
											nextIncomeDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextIncomeCreatedDayDate >= 0) && (endRepeatDayDate - nextIncomeCreatedDayDate >= 0)) {
												obj.incomeCreated = obj.incomeCreated + "+" + nextIncomeDayStringFormat;
												obj.incomeNumItems = (parseInt(obj.incomeNumItems) + 1).toString();
												obj.incomeRepeatLastUpdate = currentDayStringFormat;
												storeIncome.delete(parseInt(obj.id));
												storeIncome.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextIncomeDayStringFormat
											var datePartsNextUp = nextIncomeDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance
										updateAccountBalanceRepeat(numberTimesIncomeAdded,obj.incomeAmmount,obj.incomeAccount,"income");
									}								
								} else if (repeatPeriodIncome == "Dayly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									if(days > 0) {
										var numberUpdates = days;
										numberTimesIncomeAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate() + 1, lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextIncomeDayStringFormat = nextIncomeCreatedDayDate;
											//get nextIncomeDayStringFormat date in string format
											var minNext = nextIncomeDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextIncomeDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextIncomeDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextIncomeDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextIncomeDayStringFormat.getFullYear(); 
											nextIncomeDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											/*//this will be used in months
											if(nextIncomeCreatedDayDate.getMonth() != lastCreatedDayDate.getMonth()) {
												var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate() - 1, lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											}*/
											if((currentDayDate - nextIncomeCreatedDayDate >= 0) && (endRepeatDayDate - nextIncomeCreatedDayDate >= 0)) {
												obj.incomeCreated = obj.incomeCreated + "+" + nextIncomeDayStringFormat;
												obj.incomeNumItems = (parseInt(obj.incomeNumItems) + 1).toString();
												obj.incomeRepeatLastUpdate = currentDayStringFormat;
												storeIncome.delete(parseInt(obj.id));
												storeIncome.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextIncomeDayStringFormat
											var datePartsNextUp = nextIncomeDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance
										updateAccountBalanceRepeat(numberTimesIncomeAdded,obj.incomeAmmount,obj.incomeAccount,"income");
									}								
								} else if (repeatPeriodIncome == "Weekly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									var weeks = 0;
									if(days > 0) {
										weeks = Math.floor(days/7);
									}
									if(weeks > 0) {
										var numberUpdates = weeks;
										numberTimesIncomeAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each hour, if repeated hourly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate() + 7, lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextIncomeDayStringFormat = nextIncomeCreatedDayDate;
											//get nextIncomeDayStringFormat date in string format
											var minNext = nextIncomeDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextIncomeDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextIncomeDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextIncomeDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextIncomeDayStringFormat.getFullYear(); 
											nextIncomeDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextIncomeCreatedDayDate >= 0) && (endRepeatDayDate - nextIncomeCreatedDayDate >= 0)) {
												obj.incomeCreated = obj.incomeCreated + "+" + nextIncomeDayStringFormat;
												obj.incomeNumItems = (parseInt(obj.incomeNumItems) + 1).toString();
												obj.incomeRepeatLastUpdate = currentDayStringFormat;
												storeIncome.delete(parseInt(obj.id));
												storeIncome.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextIncomeDayStringFormat
											var datePartsNextUp = nextIncomeDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance
										updateAccountBalanceRepeat(numberTimesIncomeAdded,obj.incomeAmmount,obj.incomeAccount,"income");
									}								
								} else if (repeatPeriodIncome == "Monthly") {
									var monthss = 0;
						/*	START - HERE WE NEED TO CALCULATE NUMBER OF MONTHS BETWEEN TWO DATES: currentDayDate - lastUpdateDate	*/
									var lastUpdateDateTest = lastUpdateDate;
									while(currentDayDate - lastUpdateDateTest >= 0) {
										monthss++;
										lastUpdateDateTest = lastUpdateDateTest.add(1).months();
										//alert(lastUpdateDateTest);
									}
									monthss--;
									if(monthss == -1) {
										monthss = 0;
									}
									//alert(monthss);
						/*	END - HERE WE NEED TO CALCULATE NUMBER OF MONTHS BETWEEN TWO DATES: currentDayDate - lastUpdateDate		*/
									if(monthss > 0) {
										var numberUpdates = monthss;
										numberTimesIncomeAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											//var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth() + 1, lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											var nextIncomeCreatedDayDate = lastCreatedDayDate.add(1).months();
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextIncomeDayStringFormat = nextIncomeCreatedDayDate;
											//get nextIncomeDayStringFormat date in string format
											var minNext = nextIncomeDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextIncomeDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextIncomeDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextIncomeDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextIncomeDayStringFormat.getFullYear(); 
											nextIncomeDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextIncomeCreatedDayDate >= 0) && (endRepeatDayDate - nextIncomeCreatedDayDate >= 0)) {
												obj.incomeCreated = obj.incomeCreated + "+" + nextIncomeDayStringFormat;
												obj.incomeNumItems = (parseInt(obj.incomeNumItems) + 1).toString();
												obj.incomeRepeatLastUpdate = currentDayStringFormat;
												storeIncome.delete(parseInt(obj.id));
												storeIncome.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextIncomeDayStringFormat
											var datePartsNextUp = nextIncomeDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance
										updateAccountBalanceRepeat(numberTimesIncomeAdded,obj.incomeAmmount,obj.incomeAccount,"income");
									}								
								} else if (repeatPeriodIncome == "Yearly") {
									var yearss = 0;
						/*	START - HERE WE NEED TO CALCULATE NUMBER OF YEARS BETWEEN TWO DATES: currentDayDate - lastUpdateDate	*/
									var lastUpdateDateTest = lastUpdateDate;
									while(currentDayDate - lastUpdateDateTest >= 0) {
										yearss++;
										lastUpdateDateTest = lastUpdateDateTest.add(1).years();
										//alert(lastUpdateDateTest);
									}
									yearss--;
									if(yearss == -1) {
										yearss = 0;
									}
									//alert(yearss);
						/*	END - HERE WE NEED TO CALCULATE NUMBER OF YEARS BETWEEN TWO DATES: currentDayDate - lastUpdateDate		*/
									if(yearss > 0) {
										var numberUpdates = yearss;
										numberTimesIncomeAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											//var nextIncomeCreatedDayDate = new Date(lastCreatedDayDate.getFullYear() + 1, lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											var nextIncomeCreatedDayDate = lastCreatedDayDate.add(1).years();
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextIncomeDayStringFormat = nextIncomeCreatedDayDate;
											//get nextIncomeDayStringFormat date in string format
											var minNext = nextIncomeDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextIncomeDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextIncomeDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextIncomeDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextIncomeDayStringFormat.getFullYear(); 
											nextIncomeDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextIncomeCreatedDayDate >= 0) && (endRepeatDayDate - nextIncomeCreatedDayDate >= 0)) {
												obj.incomeCreated = obj.incomeCreated + "+" + nextIncomeDayStringFormat;
												obj.incomeNumItems = (parseInt(obj.incomeNumItems) + 1).toString();
												obj.incomeRepeatLastUpdate = currentDayStringFormat;
												storeIncome.delete(parseInt(obj.id));
												storeIncome.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextIncomeDayStringFormat
											var datePartsNextUp = nextIncomeDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance
										updateAccountBalanceRepeat(numberTimesIncomeAdded,obj.incomeAmmount,obj.incomeAccount,"income");
									}								
								}
							}
							cursorIncome.continue();
						} else {
							//window.location.href = "./incomesList.html";
							//alert(howMany);
						}
					}
					
					curCursorIncomesRepeated.onerror = function(evt) {
						alert("curCursorIncomesRepeated.onerror");					
					}
					
				}
				//alert(numIncomes);
			}
			
			numIncomesRepeated.onerror = function(evt) { 
				alert("numIncomesRepeated.onerror"); 
			}
		//upgrade expenses that have repeat cycle
		var storeExpence = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
			var openedIndexExpenses = storeExpence.index("by_expenseRepeat");
			var numExpensesRepeated = openedIndexExpenses.count();
			
			numExpensesRepeated.onsuccess = function(evt) {	
				var numExpenses = evt.target.result;	
				if (openedIndexExpenses) {
					var singleKeyRangeExpense = IDBKeyRange.only("yes");
					var curCursorExpensesRepeated = openedIndexExpenses.openCursor(singleKeyRangeExpense);
					//var howMany = 0;
					curCursorExpensesRepeated.onsuccess = function(evt) {
						var cursorExpense = evt.target.result;
						if (cursorExpense) {
							//get current object, in case we need it for update
							var obj =  { 
								expenseName: cursorExpense.value.expenseName,
								expenseAmmount: cursorExpense.value.expenseAmmount,
								expenseAccount: cursorExpense.value.expenseAccount,
								expenseCategory: cursorExpense.value.expenseCategory,
								expenseDueDate: cursorExpense.value.expenseDueDate,
								expenseRepeatCycle: cursorExpense.value.expenseRepeatCycle,
								expenseRepeatEndDate: cursorExpense.value.expenseRepeatEndDate,
								expenseRepeat: cursorExpense.value.expenseRepeat,
								expenseRepeatLastUpdate: cursorExpense.value.expenseRepeatLastUpdate,
								expenseCreated: cursorExpense.value.expenseCreated,
								expenseNumItems: cursorExpense.value.expenseNumItems,
								expenseBillPaid: cursorExpense.value.expenseBillPaid,
								id: cursorExpense.value.id
							};
						
							//count the difference between CURRENT TIME and LAST UPDATE of the current object
							var repeatPeriodExpense = cursorExpense.value.expenseRepeatCycle;
							var lastUpdateStringFormat = cursorExpense.value.expenseRepeatLastUpdate;
							var currentDayStringFormat = today;
							var endDateStringFormat = cursorExpense.value.expenseRepeatEndDate;
							var datePartsL = lastUpdateStringFormat.split("/");//	17/04/2014/23/59
							var datePartsC = currentDayStringFormat.split("/");//	17/04/2014/23/59
							var datePartsE = endDateStringFormat.split("/");//	17/04/2014/23/59
							var lastUpdateDate = new Date(datePartsL[2],datePartsL[1] - 1,datePartsL[0],datePartsL[3],datePartsL[4]);
							var currentDayDate = new Date(datePartsC[2],datePartsC[1] - 1,datePartsC[0],datePartsC[3],datePartsC[4]);
							var endRepeatDayDate = new Date(datePartsE[2],datePartsE[1] - 1,datePartsE[0],datePartsE[3],datePartsE[4]);
							
							var createdDayStringFormat = cursorExpense.value.expenseCreated;
							var dateCreatedParts = createdDayStringFormat.split("+");	//	17/04/2014/23/59+17/05/2014/23/59
							if(dateCreatedParts.length > 1) {							//	get day of last creation of last income
								createdDayStringFormat = dateCreatedParts[dateCreatedParts.length - 1];
							}							
							var datePartsCR = createdDayStringFormat.split("/");//	17/04/2014/23/59
							var lastCreatedDayDate = new Date(datePartsCR[2],datePartsCR[1] - 1,datePartsCR[0],datePartsCR[3],datePartsCR[4]);
							//alert(lastCreatedDayDate);

							if((endRepeatDayDate - lastCreatedDayDate/*currentDayDate*/ >= 0) && (currentDayDate - lastCreatedDayDate >= 0)) {
								//alert(lastUpdateDate);
								var difference_ms = currentDayDate - lastUpdateDate;
								//take out milliseconds
								difference_ms = difference_ms/1000;	var seconds = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var minutes = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var hours = Math.floor(difference_ms % 24);  
																	var days = Math.floor(difference_ms/24);
								
								var numberTimesExpenseAdded;
								if (repeatPeriodExpense == "Hourly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									if(days > 0) {
										hours = hours + (days * 24);
									}
									if(hours > 0) {
										var numberUpdates = hours;
										numberTimesExpenseAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each hour, if repeated hourly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextExpenseCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours() + 1, lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextExpenseDayStringFormat = nextExpenseCreatedDayDate;
											//get nextExpenseDayStringFormat date in string format
											var minNext = nextExpenseDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextExpenseDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextExpenseDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextExpenseDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextExpenseDayStringFormat.getFullYear(); 
											nextExpenseDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextExpenseCreatedDayDate >= 0) && (endRepeatDayDate - nextExpenseCreatedDayDate >= 0)) {
												obj.expenseCreated = obj.expenseCreated + "+" + nextExpenseDayStringFormat;
												obj.expenseBillPaid = obj.expenseBillPaid + "+paidNoo";
												obj.expenseNumItems = (parseInt(obj.expenseNumItems) + 1).toString();
												obj.expenseRepeatLastUpdate = currentDayStringFormat;
												storeExpence.delete(parseInt(obj.id));
												storeExpence.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextExpenseDayStringFormat
											var datePartsNextUp = nextExpenseDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance (bills are pending for start)
										if(obj.expenseCategory != "Bill") {
											updateAccountBalanceRepeat(numberTimesExpenseAdded,obj.expenseAmmount,obj.expenseAccount,"expense");
										}
									}								
								} else if (repeatPeriodExpense == "Dayly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									if(days > 0) {
										var numberUpdates = days;
										numberTimesExpenseAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextExpenseCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate() + 1, lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextExpenseDayStringFormat = nextExpenseCreatedDayDate;
											//get nextExpenseDayStringFormat date in string format
											var minNext = nextExpenseDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextExpenseDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextExpenseDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextExpenseDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextExpenseDayStringFormat.getFullYear(); 
											nextExpenseDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextExpenseCreatedDayDate >= 0) && (endRepeatDayDate - nextExpenseCreatedDayDate >= 0)) {
												obj.expenseCreated = obj.expenseCreated + "+" + nextExpenseDayStringFormat;
												obj.expenseBillPaid = obj.expenseBillPaid + "+paidNoo";
												obj.expenseNumItems = (parseInt(obj.expenseNumItems) + 1).toString();
												obj.expenseRepeatLastUpdate = currentDayStringFormat;
												storeExpence.delete(parseInt(obj.id));
												storeExpence.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextExpenseDayStringFormat
											var datePartsNextUp = nextExpenseDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance (bills are pending for start)
										if(obj.expenseCategory != "Bill") {
											updateAccountBalanceRepeat(numberTimesExpenseAdded,obj.expenseAmmount,obj.expenseAccount,"expense");
										}
									}								
								} else if (repeatPeriodExpense == "Weekly") {
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									var weeks = 0;
									if(days > 0) {
										weeks = Math.floor(days/7);
									}
									if(weeks > 0) {
										var numberUpdates = weeks;
										numberTimesExpenseAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each hour, if repeated hourly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											var nextExpenseCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate() + 7, lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextExpenseDayStringFormat = nextExpenseCreatedDayDate;
											//get nextExpenseDayStringFormat date in string format
											var minNext = nextExpenseDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextExpenseDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextExpenseDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextExpenseDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextExpenseDayStringFormat.getFullYear(); 
											nextExpenseDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextExpenseCreatedDayDate >= 0) && (endRepeatDayDate - nextExpenseCreatedDayDate >= 0)) {
												obj.expenseCreated = obj.expenseCreated + "+" + nextExpenseDayStringFormat;
												obj.expenseBillPaid = obj.expenseBillPaid + "+paidNoo";								
												obj.expenseNumItems = (parseInt(obj.expenseNumItems) + 1).toString();
												obj.expenseRepeatLastUpdate = currentDayStringFormat;
												storeExpence.delete(parseInt(obj.id));
												storeExpence.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextExpenseDayStringFormat
											var datePartsNextUp = nextExpenseDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance (bills are pending for start)
										if(obj.expenseCategory != "Bill") {
											updateAccountBalanceRepeat(numberTimesExpenseAdded,obj.expenseAmmount,obj.expenseAccount,"expense");
										}
									}								
								} else if (repeatPeriodExpense == "Monthly") {
									var monthss = 0;
						/*	START - HERE WE NEED TO CALCULATE NUMBER OF MONTHS BETWEEN TWO DATES: currentDayDate - lastUpdateDate	*/
									var lastUpdateDateTest = lastUpdateDate;
									while(currentDayDate - lastUpdateDateTest >= 0) {
										monthss++;
										lastUpdateDateTest = lastUpdateDateTest.add(1).months();
										//alert(lastUpdateDateTest);
									}
									monthss--;
									if(monthss == -1) {
										monthss = 0;
									}
									//alert(monthss);
						/*	END - HERE WE NEED TO CALCULATE NUMBER OF MONTHS BETWEEN TWO DATES: currentDayDate - lastUpdateDate		*/
									if(monthss > 0) {
										var numberUpdates = monthss;
										numberTimesExpenseAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											//var nextExpenseCreatedDayDate = new Date(lastCreatedDayDate.getFullYear(), lastCreatedDayDate.getMonth() + 1, lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											var nextExpenseCreatedDayDate = lastCreatedDayDate.add(1).months();
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextExpenseDayStringFormat = nextExpenseCreatedDayDate;
											//get nextExpenseDayStringFormat date in string format
											var minNext = nextExpenseDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextExpenseDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextExpenseDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextExpenseDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextExpenseDayStringFormat.getFullYear(); 
											nextExpenseDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextExpenseCreatedDayDate >= 0) && (endRepeatDayDate - nextExpenseCreatedDayDate >= 0)) {
												obj.expenseCreated = obj.expenseCreated + "+" + nextExpenseDayStringFormat;
												obj.expenseBillPaid = obj.expenseBillPaid + "+paidNoo";
												obj.expenseNumItems = (parseInt(obj.expenseNumItems) + 1).toString();
												obj.expenseRepeatLastUpdate = currentDayStringFormat;
												storeExpence.delete(parseInt(obj.id));
												storeExpence.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextExpenseDayStringFormat
											var datePartsNextUp = nextExpenseDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance (bills are pending for start)
										if(obj.expenseCategory != "Bill") {
											updateAccountBalanceRepeat(numberTimesExpenseAdded,obj.expenseAmmount,obj.expenseAccount,"expense");
										}
									}								
								} else if (repeatPeriodExpense == "Yearly") {
									var yearss = 0;
						/*	START - HERE WE NEED TO CALCULATE NUMBER OF YEARS BETWEEN TWO DATES: currentDayDate - lastUpdateDate	*/
									var lastUpdateDateTest = lastUpdateDate;
									while(currentDayDate - lastUpdateDateTest >= 0) {
										yearss++;
										lastUpdateDateTest = lastUpdateDateTest.add(1).years();
										//alert(lastUpdateDateTest);
									}
									yearss--;
									if(yearss == -1) {
										yearss = 0;
									}
									//alert(yearss);
						/*	END - HERE WE NEED TO CALCULATE NUMBER OF YEARS BETWEEN TWO DATES: currentDayDate - lastUpdateDate		*/
									if(yearss > 0) {
										var numberUpdates = yearss;
										numberTimesExpenseAdded = numberUpdates;
										while(numberUpdates > 0) {
											//add the new income each day, if repeated dayly
											//HERE IS THE CODE FOR ADD NEW INCOME IN DATABASE
											//update database LastUpdateDate attribute										

											//var nextExpenseCreatedDayDate = new Date(lastCreatedDayDate.getFullYear() + 1, lastCreatedDayDate.getMonth(), lastCreatedDayDate.getDate(), lastCreatedDayDate.getHours(), lastCreatedDayDate.getMinutes());
											var nextExpenseCreatedDayDate = lastCreatedDayDate.add(1).years();
											
											//when update, each update should have update day, day after day, NOT the current one for all
											var nextExpenseDayStringFormat = nextExpenseCreatedDayDate;
											//get nextExpenseDayStringFormat date in string format
											var minNext = nextExpenseDayStringFormat.getMinutes();	if(minNext<10){minNext='0'+minNext}
											var hNext = nextExpenseDayStringFormat.getHours();		if(hNext<10){hNext='0'+hNext}
											var ddNext = nextExpenseDayStringFormat.getDate();		if(ddNext<10){ddNext='0'+ddNext}
											var mmNext = nextExpenseDayStringFormat.getMonth()+1;	if(mmNext<10){mmNext='0'+mmNext}  //January is 0!
											var yyyyNext = nextExpenseDayStringFormat.getFullYear(); 
											nextExpenseDayStringFormat = ddNext+'/'+mmNext+'/'+yyyyNext+'/'+hNext+'/'+minNext;
											
											if((currentDayDate - nextExpenseCreatedDayDate >= 0) && (endRepeatDayDate - nextExpenseCreatedDayDate >= 0)) {
												obj.expenseCreated = obj.expenseCreated + "+" + nextExpenseDayStringFormat;
												obj.expenseBillPaid = obj.expenseBillPaid + "+paidNoo";
												obj.expenseNumItems = (parseInt(obj.expenseNumItems) + 1).toString();
												obj.expenseRepeatLastUpdate = currentDayStringFormat;
												storeExpence.delete(parseInt(obj.id));
												storeExpence.add(obj);
												numberUpdates--;
											} else {
												numberUpdates = 0;
											}
							
											//now there is new last created day date (for the last update) - nextExpenseDayStringFormat
											var datePartsNextUp = nextExpenseDayStringFormat.split("/");//	17/04/2014/23/59
											lastCreatedDayDate = new Date(datePartsNextUp[2],datePartsNextUp[1] - 1,datePartsNextUp[0],datePartsNextUp[3],datePartsNextUp[4]);											
										}
										//when updating in repeat cycle, then also update account balance (bills are pending for start)
										if(obj.expenseCategory != "Bill") {
											updateAccountBalanceRepeat(numberTimesExpenseAdded,obj.expenseAmmount,obj.expenseAccount,"expense");
										}
									}								
								}
								//howMany++;
							}
							cursorExpense.continue();
						} else {
							//window.location.href = "./incomesList.html";
							//alert(howMany);
			/*var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();*/

						}
					}
					
					curCursorExpensesRepeated.onerror = function(evt) {
						alert("curCursorExpensesRepeated.onerror");					
					}
					
				}
				//alert(numExpenses);
			}
			
			numExpensesRepeated.onerror = function(evt) { 
				alert("numExpensesRepeated.onerror"); 
			}
		
		//update transfers that were marked as upcoming and are NOT CANCELED
		var storeTransfer = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");	
			var openedIndexTransfers = storeTransfer.index("by_transferStatus");
			var numAllTransfers = openedIndexTransfers.count();
			
			numAllTransfers.onsuccess = function(evt) {	
				var numTransfers = evt.target.result;
				if (openedIndexTransfers) {
					var singleKeyRangeTransfer = IDBKeyRange.only("no");
					var curCursorTransfer = openedIndexTransfers.openCursor(singleKeyRangeTransfer);
					curCursorTransfer.onsuccess = function(evet) {
					
						var cursorTrans = evet.target.result;
						if (cursorTrans) {						
							var thisTransferDateArray = (cursorTrans.value.transferDate).split('-');
							var thisTransferDate = new Date(thisTransferDateArray[0],parseInt(thisTransferDateArray[1] - 1),thisTransferDateArray[2]);
							var todayDate = new Date();
							if((todayDate >= thisTransferDate) && (cursorTrans.value.transferStatus != "fail")) { //it is in the past and is not canceled		
								//if it is in the past, then update accounts and make transfers
								var objTransfer = {
									transferAmmount: (cursorTrans.value.transferAmmount).toString(),
									transferDate: cursorTrans.value.transferDate,
									transferFromAccount: cursorTrans.value.transferFromAccount,
									transferToAccount: cursorTrans.value.transferToAccount,
									transferHistoryFromAccount: cursorTrans.value.transferHistoryFromAccount,
									transferHistoryToAccount: cursorTrans.value.transferHistoryToAccount,
									transferStatus: "yes",
									id: cursorTrans.value.id
								};
								storeTransfer.delete(parseInt(objTransfer.id));
								storeTransfer.add(objTransfer);	

								//update accounts for created transfers
								var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");

								var requestAccountFromID = storeAccounts.get(parseInt(objTransfer.transferFromAccount));
								// Get everything in the storeAccounts so you can set new balance	
								requestAccountFromID.onsuccess = function(e) {
									var resultAccountFrom = e.target.result;
									if(!!resultAccountFrom == false){alert(resultAccountFrom);}

									var objFromAccount =  { 
										accountName: resultAccountFrom.accountName,
										accountType: resultAccountFrom.accountType,
										accountBalance: (parseInt(resultAccountFrom.accountBalance) - parseInt(objTransfer.transferAmmount)).toString(),
										accountDate: resultAccountFrom.accountDate,
										id: resultAccountFrom.id
									};										
									storeAccounts.delete(parseInt(objFromAccount.id));
									storeAccounts.add(objFromAccount);
								}
								
								var requestAccountToID = storeAccounts.get(parseInt(objTransfer.transferToAccount));
								// Get everything in the storeAccounts so you can set new balance	
								requestAccountToID.onsuccess = function(e) {
									var resultAccountTo = e.target.result;
									if(!!resultAccountTo == false){alert(resultAccountTo);}

									var objToAccount =  { 
										accountName: resultAccountTo.accountName,
										accountType: resultAccountTo.accountType,
										accountBalance: (parseInt(resultAccountTo.accountBalance) + parseInt(objTransfer.transferAmmount)).toString(),
										accountDate: resultAccountTo.accountDate,
										id: resultAccountTo.id
									};										
									storeAccounts.delete(parseInt(objToAccount.id));
									storeAccounts.add(objToAccount);
								}	
								
							} else {							//it is in the future
								//if it is in the future, then don't update accounts and set status to not transfered
							}
							cursorTrans.continue();
						} else {
						
						}
					}
				}
			}
			
			numAllTransfers.onerror = function(evt) { 
				alert("numAllTransfers.onerror"); 
			}
			
	}	
	
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(idGet) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("clickedID", idGet);
}

function updateAccountBalanceRepeat(numberTimesAdded,ammountUpdate,accountUpdate,type) {	
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	var openedDBUpdate = localStorage["openedDB"];	
	var requestUpdate = indexedDB.open(openedDBUpdate);		
	
	requestUpdate.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		//when income/expense is added in repeat cycle, update account balance
		//we need to loop throught all accounts, to find the chosen one and to update accountBalance by adding ammountUpdate
		var storeAccountUpdate = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var openedIndexUpdate = storeAccountUpdate.index("by_accountName");
		var numItemsRequestAccountUpdate = openedIndexUpdate.count();	
		var modifyAccountObjectUpdate;
		numItemsRequestAccountUpdate.onsuccess = function(evet) {
			var numItemsAccountUpdate = evet.target.result;
			if (openedIndexUpdate) {
				//var singleKeyRange = IDBKeyRange.only((accountUpdate).toString());
				var curCursorAUpdate = openedIndexUpdate.openCursor(/*singleKeyRange.toString()*/);
				curCursorAUpdate.onsuccess = function(evt) {
					var cursorAUpdate = evt.target.result;
					if (cursorAUpdate) {
						if((cursorAUpdate.value.accountName).toString() == (accountUpdate).toString()) {
							var newBalance;
							if(type == "income") {
								newBalance = (parseInt(cursorAUpdate.value.accountBalance) + ((numberTimesAdded) * parseInt(ammountUpdate))).toString()
							} else {				//if(type = "expense") {
								newBalance = (parseInt(cursorAUpdate.value.accountBalance) - ((numberTimesAdded) * parseInt(ammountUpdate))).toString()
							}
							modifyAccountObjectUpdate =  { 
								accountName: cursorAUpdate.value.accountName,
								accountType: cursorAUpdate.value.accountType,
								accountBalance: newBalance,
								accountDate: cursorAUpdate.value.accountDate,
								id: cursorAUpdate.value.id
							};	
							storeAccountUpdate.delete(parseInt(modifyAccountObjectUpdate.id));
							storeAccountUpdate.add(modifyAccountObjectUpdate);
						}
						cursorAUpdate.continue();
					}
				}
			}
		}
	}
}