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
						dateStringIncomeCreated = cursorIn.value.incomeCreated;
						ammountIncome = cursorIn.value.incomeAmmount;						
						datePartsIterate = dateStringIncomeCreated.split("/");	//	17/04/2014/23/59
						dateFormatIncomeCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
//alert(dateFormatIncomeCreated + " ooooo " + dateFormatIncomeCreated.add(1).months());						
						//alert(dateFormatToday);
						//alert(dateFormatToday.getDate() + "/" + (dateFormatToday.getMonth()+1) + "/" + dateFormatToday.getFullYear());
						
						todayStartDate = new Date(dateFormatToday.getFullYear(),dateFormatToday.getMonth(),dateFormatToday.getDate());					
					//	alert(todayStartDate);
						weekStartDate = new Date(weekTestDate.getFullYear(),weekTestDate.getMonth(),weekTestDate.getDate());		
					//	alert(weekStartDate);
						monthStartDate = new Date(monthTestDate.getFullYear(),monthTestDate.getMonth(),monthTestDate.getDate());		
					//	alert(monthStartDate);
						yearStartDate = new Date(yearTestDate.getFullYear(),yearTestDate.getMonth(),yearTestDate.getDate());		
					//	alert(yearStartDate);

						cursorIn.continue();
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
	};
	
	request.onerror = html5rocks.indexedDB.onerror;
};