function addAccountsDropDown() {

		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;

		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		

		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");				
			
			var openedIndex = store.index("by_accountName");
			var numItemsRequesr = openedIndex.count();	
		//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;	
				/*alert(numItems);*/
				if (openedIndex) {
					var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
							$('#drop-down-list-account').append('<option value="' + cursor.value.accountName + '">' + cursor.value.accountName + '</option>');
							cursor.continue();
						}
					}
				}	
			}			
			//$('#drop-down-list-account').append('<option value="test1">Test1: 1 day</option>');
			/*alert('request.onsuccess!');*/
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
}

function addCategoriesDropDown() {	

		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;

		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		

		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");		
			
			var openedIndex = store.index("by_isExpense");
			var range = IDBKeyRange.only("1");
			var numItemsRequesr = openedIndex.count();	
		//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;	
				/*alert(numItems);*/
				if (openedIndex) {
					var curCursor = openedIndex.openCursor(range/*null, "prev"*/);				
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
							$('#drop-down-list-category').append('<option value="' + cursor.value.categoryType + '">' + cursor.value.categoryType + '</option>');
							cursor.continue();
						}
					}
				}	
			}			
			/*alert('request.onsuccess!');*/
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
}

function funcExpenseAdd() {
			
	var expenseRepeat = $('#repeat').val();
	var expenseName = $('#expenseName').val();
	var expenseAmmount = $('#expenseAmmount').val(); 
	var expenseAccount = $('#drop-down-list-account').val(); 
	var expenseCategory = $('#drop-down-list-category').val(); 
	var expenseDueDate =	$('#expenseDueDate').val(); 
	var expenseRepeatCycle = $('#drop-down-list-cycle').val();	 
	var expenseRepeatEndDate = $('#expenseRepeatEndDate').val();
	
	if(expenseRepeat == "off") {
		expenseRepeatCycle = "";
		expenseRepeatEndDate = "";
	}
/*
	alert(
		expenseName 					+ " : " + 
		expenseAmmount 				+ " : " + 
		expenseAccount 				+ " : " + 
		expenseCategory 				+ " : " + 
		expenseDueDate 				+ " : " + 
		expenseRepeatCycle 			+ " : " + 
		expenseRepeatEndDate 		+ " : " + 
		expenseRepeat
	);
*/
	var openedDB;
	var request;
	var obj =  { 
			expenseName: expenseName,
			expenseAmmount: expenseAmmount,
			expenseAccount: expenseAccount,
			expenseCategory: expenseCategory,
			expenseDueDate: expenseDueDate,
			expenseRepeatCycle: expenseRepeatCycle,
			expenseRepeatEndDate: expenseRepeatEndDate,
			expenseBillPaid: "paidNo"
		};	
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
			
//	alert("New income is added - WRONG");
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		store.add(obj);
//		alert('New income is added - TRUE');
		
		// now let's close the database again!
		/*var dbCLOSE;
		dbCLOSE = request.result;
		dbCLOSE.close();*/
		window.location.href = "./expensesList.html";
	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}