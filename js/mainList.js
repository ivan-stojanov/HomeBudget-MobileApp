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
			{ incomeName: "Party Income", incomeCategory: "Party", incomeAmmount: "500", incomeDueDate: "10/10/2014/23/59", incomeAccount: "Ivan", incomeRepeat: "no", incomeRepeatCycle: "", incomeRepeatEndDate: "", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "My Payment", incomeCategory: "Pay", incomeAmmount: "100", incomeDueDate: "10/10/2014/23/59", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatCycle: "Monthly", incomeRepeatEndDate: "12/12/2015/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
			{ incomeName: "Codefu Award", incomeCategory: "Award", incomeAmmount: "200", incomeDueDate: "10/10/2015/23/59", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatCycle: "Dayly", incomeRepeatEndDate: "12/12/2014/23/59", incomeRepeatLastUpdate: today, incomeCreated: today, incomeNumItems: "1" },
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
			{ expenseName: "Books", expenseCategory: "Education", expenseAmmount: "500", expenseDueDate: "10/10/2015", expenseAccount: "Ivan", expenseRepeat: "no", expenseRepeatPeriod: "", expenseBillPaid: "paidNo", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "Pizza", expenseCategory: "Food", expenseAmmount: "100", expenseDueDate: "10/10/2015", expenseAccount: "Zoran", expenseRepeat: "yes", expenseRepeatPeriod: "Monthly", expenseBillPaid: "paidNo", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
			{ expenseName: "T-Shirt", expenseCategory: "Clothes", expenseAmmount: "400", expenseDueDate: "10/10/2015", expenseAccount: "Niko", expenseRepeat: "yes", expenseRepeatPeriod: "Yearly", expenseBillPaid: "paidNo", expenseRepeatLastUpdate: today, expenseCreated: today, expenseNumItems: "1" },
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
		//upgrade incomes and expenses that have repeat cycle
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		
		var storeIncome = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
		var storeExpence = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		//updateIncomesExpensesDates(storeIncomes, storeExpenses);
		
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

							if((endRepeatDayDate - currentDayDate >= 0) && (currentDayDate - lastCreatedDayDate >= 0)) {
								//alert(lastUpdateDate);
								var difference_ms = currentDayDate - lastUpdateDate;
								//take out milliseconds
								difference_ms = difference_ms/1000;	var seconds = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var minutes = Math.floor(difference_ms % 60);
								difference_ms = difference_ms/60;	var hours = Math.floor(difference_ms % 24);  
																	var days = Math.floor(difference_ms/24);
																	
								if (repeatPeriodIncome == "Hourly") {

								} else if (repeatPeriodIncome == "Dayly") {  
									//alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
									if(days > 0) {
										var numberUpdates = days;
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
											if(currentDayDate - nextIncomeCreatedDayDate >= 0) {
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
									}								
								} else if (repeatPeriodIncome == "Weekly") {
							
								} else if (repeatPeriodIncome == "Monthly") {

								} else if (repeatPeriodIncome == "Yearly") {
								
								}
								//howMany++;
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
	}		
	
	request.onerror = html5rocks.indexedDB.onerror;
};

function updateIncomesExpensesDates(storeIncome, storeExpence) {		

	var dbS;										
	//DateFormat formatter = new SimpleDateFormat("dd/mm/yy");
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;
	// Convert both dates to milliseconds
	var date1_ms = new Date();
	var date2_ms = new Date(2014,3,14,23,20);
	// Calculate the difference in milliseconds
	var difference_ms = date1_ms - date2_ms;
	// Convert back to days and return
	alert(Math.round(difference_ms/one_day)); 
	 
	/*
		//take out milliseconds
		difference_ms = difference_ms/1000;
		var seconds = Math.floor(difference_ms % 60);
		difference_ms = difference_ms/60; 
		var minutes = Math.floor(difference_ms % 60);
		difference_ms = difference_ms/60; 
		var hours = Math.floor(difference_ms % 24);  
		var days = Math.floor(difference_ms/24);  
		alert(days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds');
	*/  
	/*
		var now = new Date();
		if (now.getMonth() == 11) {
			var current = new Date(now.getFullYear() + 1, 0, 1);
		} else {
			var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		}
	*/
}

function callFunction(idGet) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("clickedID", idGet);
}