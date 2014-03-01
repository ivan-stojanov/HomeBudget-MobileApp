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
	$('#drop-down-list-category').append('<option value="testCategory">testCategory</option>');
}

function funcIncomeAdd() {
			
	var incomeRepeat = $('#repeat').val();
	var incomeName = $('#incomeName').val();
	var incomeAmmount = $('#incomeAmmount').val(); 
	var incomeAccount = $('#drop-down-list-account').val(); 
	var incomeCategory = $('#drop-down-list-category').val(); 
	var incomeDueDate =	$('#incomeDueDate').val(); 
	var incomeRepeatCycle = $('#drop-down-list-cycle').val();	 
	var incomeRepeatEndDate = $('#incomeRepeatEndDate').val();
	
	if(incomeRepeat == "off") {
		incomeRepeatCycle = "";
		incomeRepeatEndDate = "";
	}
/*
	alert(
		incomeName 					+ " : " + 
		incomeAmmount 				+ " : " + 
		incomeAccount 				+ " : " + 
		incomeCategory 				+ " : " + 
		incomeDueDate 				+ " : " + 
		incomeRepeatCycle 			+ " : " + 
		incomeRepeatEndDate 		+ " : " + 
		incomeRepeat
	);
*/
	var openedDB;
	var request;
	var obj =  { 
			incomeName: incomeName,
			incomeAmmount: incomeAmmount,
			incomeAccount: incomeAccount,
			incomeCategory: incomeCategory,
			incomeDueDate: incomeDueDate,
			incomeRepeatCycle: incomeRepeatCycle,
			incomeRepeatEndDate: incomeRepeatEndDate
		};	
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
			
	alert("New income is added - WRONG");
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		store.add(obj);
//		alert('New income is added - TRUE');
		
		// now let's close the database again!

	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}