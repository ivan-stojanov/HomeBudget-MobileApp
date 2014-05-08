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

function init() {
															//  alert("init");
  html5rocks.indexedDB.open(); // open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var storeIncomes;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		
		var totalTodaySum = 0;	var total7daysSum = 0;	var totalThisMonthSum = 0;	var totalThisYearSum = 0;
		
		if(dbS.objectStoreNames.contains("incomes")) {
			//dbS.deleteObjectStore("incomes");
			//storeIncomes = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		
		var storeIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		$('#busy').hide();
		var openedIndexIncomes = storeIncomes.index("by_id");
		var numItemsIncomes = openedIndexIncomes.count();	
		var countTestIncomes = 0;	
		var incomesToday = 0;	var incomes7days = 0;	var incomesThisMonth = 0;	var incomesThisYear = 0;
		var dateStringIncomeCreated;	var ammountIncome;	var datePartsIterate;
		var dateFormatIncomeCreated;	var dateFormatToday = new Date();
		var todayStartDate;		var weekStartDate;		var monthStartDate;			var yearStartDate;
		var weekTestDate = new Date().add(-7).days();
		var monthTestDate = new Date().add((-1) * new Date().getDate() + 1).days();
		var yearTestDate = new Date().add((-1) * new Date().getMonth()).months().add((-1) * new Date().getDate() + 1).days();

		//alert(yearTestDate);
	//we need numItemsIncomesCount so that we can iterate with coursor if there are items that are found
		numItemsIncomes.onsuccess = function(evt) {   
			var numItemsIncomesCount = evt.target.result;			
			/*alert(numItemsIncomesCount);*/
			if (openedIndexIncomes) {
				var curCursorIncomes = openedIndexIncomes.openCursor(/*null, "prev"*/);				
				curCursorIncomes.onsuccess = function(evt) {			//alert(dateFormatToday.getMonth()+1);		
					var cursorIn = evt.target.result;					//alert(cursorIn.value.id);	
					if (cursorIn) {
						countTestIncomes++;
						
						dateFormatToday = new Date();
						todayStartDate = new Date(dateFormatToday.getFullYear(),dateFormatToday.getMonth(),dateFormatToday.getDate());
					//	alert(todayStartDate);
						weekStartDate = new Date(weekTestDate.getFullYear(),weekTestDate.getMonth(),weekTestDate.getDate());		
					//	alert(weekStartDate);
						monthStartDate = new Date(monthTestDate.getFullYear(),monthTestDate.getMonth(),monthTestDate.getDate());		
					//	alert(monthStartDate);
						yearStartDate = new Date(yearTestDate.getFullYear(),yearTestDate.getMonth(),yearTestDate.getDate());		
					//	alert(yearStartDate);
	//alert(dateFormatIncomeCreated + " ooooo " + dateFormatIncomeCreated.add(1).months());						
	//alert(dateFormatToday);
	//alert(dateFormatToday.getDate() + "/" + (dateFormatToday.getMonth()+1) + "/" + dateFormatToday.getFullYear());
						dateStringIncomeCreated = cursorIn.value.incomeCreated;
						ammountIncome = cursorIn.value.incomeAmmount;
						//loop throught all dates on creation so that we compare and sum the summary
						var differentDatesIncomes = dateStringIncomeCreated.split("+");
						if(differentDatesIncomes.length == 1) {
							datePartsIterate = dateStringIncomeCreated.split("/");	//	17/04/2014/23/59
							dateFormatIncomeCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
							if(dateFormatIncomeCreated - todayStartDate > 0) {								
								incomesToday = parseInt(incomesToday) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - weekStartDate > 0) {								
								incomes7days = parseInt(incomes7days) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - monthStartDate > 0) {								
								incomesThisMonth = parseInt(incomesThisMonth) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - yearStartDate > 0) {								
								incomesThisYear = parseInt(incomesThisYear) + parseInt(ammountIncome);
							}
						} else {
							for(var i=0; i<differentDatesIncomes.length; i++) {
								datePartsIterate = differentDatesIncomes[i].split("/");	//	17/04/2014/23/59
								dateFormatIncomeCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
								
								if(dateFormatIncomeCreated - todayStartDate > 0) {								
									incomesToday = parseInt(incomesToday) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - weekStartDate > 0) {								
									incomes7days = parseInt(incomes7days) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - monthStartDate > 0) {								
									incomesThisMonth = parseInt(incomesThisMonth) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - yearStartDate > 0) {								
									incomesThisYear = parseInt(incomesThisYear) + parseInt(ammountIncome);
								}
							}
						}
						cursorIn.continue();
					} else {
						$('#todayIncomes').text($('#todayIncomes').html() + "+" + incomesToday);
						$('#past7daysIncomes').text($('#past7daysIncomes').html() + "+" + incomes7days);
						$('#thisMonthIncomes').text($('#thisMonthIncomes').html() + "+" + incomesThisMonth);
						$('#thisYearIncomes').text($('#thisYearIncomes').html() + "+" + incomesThisYear);
						
						totalTodaySum = parseInt(totalTodaySum) + parseInt(incomesToday);
						total7daysSum = parseInt(total7daysSum) + parseInt(incomes7days);
						totalThisMonthSum = parseInt(totalThisMonthSum) + parseInt(incomesThisMonth);
						totalThisYearSum = parseInt(totalThisYearSum) + parseInt(incomesThisYear);
						
						var signToday = "";	var sign7days = "";	var signMonth = "";	var signYear = "";
						if(parseInt(totalTodaySum) >= 0)	{	signToday = "+";	}
						if(parseInt(total7daysSum) >= 0)	{	sign7days = "+";	}
						if(parseInt(totalThisMonthSum) >= 0){	signMonth = "+";	}
						if(parseInt(totalThisYearSum) >= 0)	{	signYear = "+";		}

						$('#todaySum').text(signToday + totalTodaySum);
						$('#past7daysSum').text(sign7days + total7daysSum);
						$('#thisMonthSum').text(signMonth + totalThisMonthSum);
						$('#thisYearSum').text(signYear + totalThisYearSum);
					}
				}
			}
			
			if (countTestIncomes == numItemsIncomesCount)   {
																/*var dbCLOSE;
																dbCLOSE = request.result;
																dbCLOSE.close();*/
															}
		}
			
		numItemsIncomes.onerror = function(evt) { var numItemsIncomesCount = 0; }
		
		
		
		
		
		
		
		
		
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("expenses");
			//storeExpenses = dbS.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		
		var storeExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		$('#busy').hide();
		var openedIndexExpenses = storeExpenses.index("by_id");
		var numItemsExpenses = openedIndexExpenses.count();	
		var countTestExpenses = 0;	
		var expensesToday = 0;	var expenses7days = 0;	var expensesThisMonth = 0;	var expensesThisYear = 0;
		var dateStringExpenseCreated;	var ammountExpense;	var datePartsIterate;
		var dateFormatExpenseCreated;	var dateFormatToday = new Date();
		var todayStartDate;		var weekStartDate;		var monthStartDate;			var yearStartDate;
		var weekTestDate = new Date().add(-7).days();
		var monthTestDate = new Date().add((-1) * new Date().getDate() + 1).days();
		var yearTestDate = new Date().add((-1) * new Date().getMonth()).months().add((-1) * new Date().getDate() + 1).days();

		//alert(yearTestDate);
	//we need numItemsExpensesCount so that we can iterate with coursor if there are items that are found
		numItemsExpenses.onsuccess = function(evt) {   
			var numItemsExpensesCount = evt.target.result;			
			/*alert(numItemsExpensesCount);*/
			if (openedIndexExpenses) {
				var curCursorExpenses = openedIndexExpenses.openCursor(/*null, "prev"*/);				
				curCursorExpenses.onsuccess = function(evt) {			//alert(dateFormatToday.getMonth()+1);		
					var cursorEx = evt.target.result;					//alert(cursorEx.value.id);	
					if (cursorEx) {
						countTestExpenses++;
						
						dateFormatToday = new Date();
						todayStartDate = new Date(dateFormatToday.getFullYear(),dateFormatToday.getMonth(),dateFormatToday.getDate());
					//	alert(todayStartDate);
						weekStartDate = new Date(weekTestDate.getFullYear(),weekTestDate.getMonth(),weekTestDate.getDate());		
					//	alert(weekStartDate);
						monthStartDate = new Date(monthTestDate.getFullYear(),monthTestDate.getMonth(),monthTestDate.getDate());		
					//	alert(monthStartDate);
						yearStartDate = new Date(yearTestDate.getFullYear(),yearTestDate.getMonth(),yearTestDate.getDate());		
					//	alert(yearStartDate);
	//alert(dateFormatExpenseCreated + " ooooo " + dateFormatExpenseCreated.add(1).months());						
	//alert(dateFormatToday);
	//alert(dateFormatToday.getDate() + "/" + (dateFormatToday.getMonth()+1) + "/" + dateFormatToday.getFullYear());
						dateStringExpenseCreated = cursorEx.value.expenseCreated;
						ammountExpense = cursorEx.value.expenseAmmount;
						//loop throught all dates on creation so that we compare and sum the summary
						var differentDatesExpenses = dateStringExpenseCreated.split("+");
						if(differentDatesExpenses.length == 1) {
							datePartsIterate = dateStringExpenseCreated.split("/");	//	17/04/2014/23/59
							dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
							if(dateFormatExpenseCreated - todayStartDate > 0) {								
								expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
							}
							if(dateFormatExpenseCreated - weekStartDate > 0) {								
								expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
							}
							if(dateFormatExpenseCreated - monthStartDate > 0) {								
								expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
							}
							if(dateFormatExpenseCreated - yearStartDate > 0) {								
								expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
							}
						} else {
							for(var i=0; i<differentDatesExpenses.length; i++) {
								datePartsIterate = differentDatesExpenses[i].split("/");	//	17/04/2014/23/59
								dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
								
								if(dateFormatExpenseCreated - todayStartDate > 0) {								
									expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - weekStartDate > 0) {								
									expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - monthStartDate > 0) {								
									expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - yearStartDate > 0) {								
									expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
								}
							}
						}
						cursorEx.continue();
					} else {
						$('#todayExpenses').text($('#todayExpenses').html() + "-" + expensesToday);
						$('#past7daysExpenses').text($('#past7daysExpenses').html() + "-" + expenses7days);
						$('#thisMonthExpenses').text($('#thisMonthExpenses').html() + "-" + expensesThisMonth);
						$('#thisYearExpenses').text($('#thisYearExpenses').html() + "-" + expensesThisYear);
						
						totalTodaySum = parseInt(totalTodaySum) - parseInt(expensesToday);
						total7daysSum = parseInt(total7daysSum) - parseInt(expenses7days);
						totalThisMonthSum = parseInt(totalThisMonthSum) - parseInt(expensesThisMonth);
						totalThisYearSum = parseInt(totalThisYearSum) - parseInt(expensesThisYear);
						
						var signToday = "";	var sign7days = "";	var signMonth = "";	var signYear = "";
						if(parseInt(totalTodaySum) >= 0)	{	signToday = "+";	}
						if(parseInt(total7daysSum) >= 0)	{	sign7days = "+";	}
						if(parseInt(totalThisMonthSum) >= 0){	signMonth = "+";	}
						if(parseInt(totalThisYearSum) >= 0)	{	signYear = "+";		}

						$('#todaySum').text(signToday + totalTodaySum);
						$('#past7daysSum').text(sign7days + total7daysSum);
						$('#thisMonthSum').text(signMonth + totalThisMonthSum);
						$('#thisYearSum').text(signYear + totalThisYearSum);
					}
				}
			}
			
			if (countTestExpenses == numItemsExpensesCount)   {
																/*var dbCLOSE;
																dbCLOSE = request.result;
																dbCLOSE.close();*/
															}
		}
			
		numItemsExpenses.onerror = function(evt) { var numItemsExpensesCount = 0; }
	};
	
	request.onerror = html5rocks.indexedDB.onerror;
};