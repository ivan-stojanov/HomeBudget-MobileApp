$( document ).ready(function() {
	//get today date
	var today1 = new Date();
	var min1 = today1.getMinutes();	if(min1<10){min1='0'+min1}
	var h1 = today1.getHours();		if(h1<10){h1='0'+h1}
	var dd1 = today1.getDate();		if(dd1<10){dd1='0'+dd1}
	var mm1 = today1.getMonth()+1;	if(mm1<10){mm1='0'+mm1}	//January is 0!
	var yyyy1 = today1.getFullYear(); 
	var todayDMY1 = dd1+'/'+mm1+'/'+yyyy1;
	$('#currentDate').text(todayDMY1);
});

var currentURLhaveAccountURLarray = (document.URL).split("?accountIncomeStart=");
var codedAccount = "";
if(currentURLhaveAccountURLarray.length == 2) {
	codedAccount = decodeURIComponent(currentURLhaveAccountURLarray[1]);		
}

function addAccountsDropDown() {
	
	//if you add income via add incomes then show all available accounts
	if(codedAccount == "") {
	
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
					var deletePoints = 0;
					var haveCashOnHand = false; var haveCreditCard = false; var haveBankAccount = false;
					var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
							if(cursor.value.id == 1) 		{	haveCashOnHand = true;	}
							else if(cursor.value.id == 2) 	{	haveCreditCard = true;	}
							else if(cursor.value.id == 3) 	{	haveBankAccount = true;	}
							else {
								var arrayDateAccount = (cursor.value.accountDate).split("/");
								var dateAccount = new Date(arrayDateAccount[2],arrayDateAccount[1] - 1,arrayDateAccount[0]);
								var dateToday = new Date();
								if(dateToday >= dateAccount){	//ovdeka
									$('#drop-down-list-account').append('<option value="' + cursor.value.accountName + '">' + cursor.value.accountName + '</option>');
									deletePoints++;
								} //ovdeka
							}								
							cursor.continue();
						} else {
							if(haveCashOnHand == false) {	
								$("#drop-down-list-account option[value='Cash on hand']").remove();
							}
							if(haveCreditCard == false) {	
								$("#drop-down-list-account option[value='Credit Card']").remove();
							}
							if(haveBankAccount == false) {
								$("#drop-down-list-account option[value='Bank Account']").remove();
							}
							if(deletePoints == 0) {
								$("#drop-down-list-account option[value='points']").remove();
							}
						}
					}
				}	
			}			
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
	}
	//if you add income via certain account, then show only that account in the list
	else {
		$("#drop-down-list-account option[value='Cash on hand']").remove();
		$("#drop-down-list-account option[value='Credit Card']").remove();
		$("#drop-down-list-account option[value='Bank Account']").remove();
		$("#drop-down-list-account option[value='points']").remove();
		$('#drop-down-list-account').append('<option value="' + codedAccount + '">' + codedAccount + '</option>');
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
			
			var openedIndex = store.index("by_isIncome");
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
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}
}

function funcIncomeAdd() {

	//get today date
	var today = new Date();
	var min = today.getMinutes();	if(min<10){min='0'+min}
	var h = today.getHours();		if(h<10){h='0'+h}
	var dd = today.getDate();		if(dd<10){dd='0'+dd}
	var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
	var yyyy = today.getFullYear(); 
	today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
	
	var incomeRepeat = $('#repeat').val();
	var incomeName = $('#incomeName').val();
	var incomeAmmount = $('#incomeAmmount').val(); 
	var incomeAccount = $('#drop-down-list-account').val(); 
	var incomeCategory = $('#drop-down-list-category').val(); 
	var incomeDueDate =	"2020-01-01";//$('#incomeDueDate').val(); 
	var incomeRepeatCycle = $('#drop-down-list-cycle').val();	 
	var incomeRepeatEndDate = $('#incomeRepeatEndDate').val();
		
	if(incomeRepeat == "off") {
		incomeRepeatCycle = "";
		incomeRepeatEndDate = "";
		incomeRepeat = "no";
	}
	
	if(incomeRepeat == "on") {
		incomeRepeat = "yes";
	}

	incomeDueDate = formatDate(incomeDueDate);
	incomeRepeatEndDate = formatDate(incomeRepeatEndDate);

	var openedDB;
	var request;
	var obj =  { 
			incomeName: incomeName,
			incomeAmmount: incomeAmmount,
			incomeAccount: incomeAccount,
			incomeCategory: incomeCategory,
			incomeDueDate: incomeDueDate,
			incomeRepeatCycle: incomeRepeatCycle,
			incomeRepeatEndDate: incomeRepeatEndDate,
			incomeRepeat: incomeRepeat,
			incomeRepeatLastUpdate: today,
			incomeCreated: today,
			incomeNumItems: "1"
		};	
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var storeIncome = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		storeIncome.add(obj);
		var modifyAccountObject;
	
	  //we need to loop throught all accounts, to find the chosen one and to update accountBalance by adding incomeAmmount
		var storeAccount = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var openedIndexx = storeAccount.index("by_accountName");
		var numItemsRequest = openedIndexx.count();		
		numItemsRequest.onsuccess = function(evt) {	
			var numItems = evt.target.result;	
			//storeAccount.add(obj);			
			if (openedIndexx) {
				//var singleKeyRange = IDBKeyRange.only((obj.incomeAccount).toString());
				var curCursorA = openedIndexx.openCursor(/*singleKeyRange.toString()*/);

				curCursorA.onsuccess = function(evt) {
					var cursorA = evt.target.result;
					if (cursorA) {
						if((cursorA.value.accountName).toString() == (obj.incomeAccount).toString()) {		
							modifyAccountObject =  { 
								accountName: cursorA.value.accountName,
								accountType: cursorA.value.accountType,
								accountBalance: (parseInt(cursorA.value.accountBalance) + parseInt(obj.incomeAmmount)).toString(),
								accountDate: cursorA.value.accountDate,
								id: cursorA.value.id
							};	
							storeAccount.delete(parseInt(modifyAccountObject.id));
							storeAccount.add(modifyAccountObject);
						}
						cursorA.continue();
					} else {
						//if you add income via add incomes then show all available accounts
						if(codedAccount != "") {
							window.location.href = "./accountsList.html";
						}
						//if you add income via certain account, then show only that account in the list
						else {
							window.location.href = "./incomesList.html";
						}						
					}
				}
				
				curCursorA.onerror = function(evt) {
					alert("curCursorA.onerror");					
				}
			}
		}
			
		numItemsRequest.onerror = function(evt) { 
			alert("numItemsRequest.onerror"); 
		}
	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}

function formatDate(enteredDate){
	var dateArray = enteredDate.split('-');
	if(dateArray.length == 3) {
		return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0] + "/23/59";
	} else {
		return "";
	}
}

$( document ).ready(function() {
});
