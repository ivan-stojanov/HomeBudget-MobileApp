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

function addBillCategoriesDropDown() {	
	$('#drop-down-list-category').append('<option value="testCategory">testCategory</option>');
}

function funcBillAdd() {
			
	var billCategory = $('#drop-down-list-category').val(); 
	var billRepeat = $('#repeat').val();
	var billAmmount = $('#billAmmount').val(); 
	var billAccount = $('#drop-down-list-account').val(); 
	var billDueDate =	$('#billDueDate').val(); 
	var billRepeatCycle = $('#drop-down-list-cycle').val();	 
	var billRepeatEndDate = $('#billRepeatEndDate').val();
	
	if(billRepeat == "off") {
		billRepeatCycle = "";
		billRepeatEndDate = "";
	}
/*
	alert(
		billCategory 				+ " : " + 
		billAmmount 				+ " : " + 
		billAccount 				+ " : " + 
		billDueDate 				+ " : " + 
		billRepeatCycle 			+ " : " + 
		billRepeatEndDate 		+ " : " + 
		billRepeat
	);
*/
	var openedDB;
	var request;
	var obj =  { 
			expenseName: billCategory,
			expenseCategory: "Bill",
			expenseAmmount: billAmmount,
			expenseAccount: billAccount,
			expenseDueDate: billDueDate,
			expenseRepeatCycle: billRepeatCycle,
			expenseRepeatEndDate: billRepeatEndDate
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
		var dbCLOSE;
		dbCLOSE = request.result;
		dbCLOSE.close();
		window.location.href = "./billsList.html";
	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}