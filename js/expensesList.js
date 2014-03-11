localStorage["openedDB"] = "MyTestDatabase";
//var version = 4;
													// alert("start");	
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
												//alert("init");
	html5rocks.indexedDB.open();	// open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
												//alert("opened");
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB/*, version*/);  
												////alert("opened MyTest");
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
											   alert("request onupgradeneeded"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
												////alert("before create objectStoreS onupgradeneeded"); 
		//var store;
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			store = request.transaction.objectStore("expenses");/*html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			store = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
													 //alert("after get objectStore onupgradeneeded"); 
	};
	request.onsuccess = function(e) {
													//alert("request onsuccess"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
													////alert("before store");  
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
			
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
													////alert("after store"); 
													//alert("created objects");
													//alert("add created objects");
		// Get everything in the store;
		//var keyRange = IDBKeyRange.lowerBound(0);		
//DA SE ZEMAT SAMO ONIE SO IMAT ZA EXPENSE-BILL POSTAVENO YES - neuspesno
	/*	var lowerBound = ['AAAAA','Bill','paidYes'];
		var upperBound = ['ZZZZZ','Bill','paidYes'];
		var range = IDBKeyRange.bound(lowerBound,upperBound);
		var openedIndexPaidBills = store.index('paid_Bills_Only');
		var numItemsPaidBills = openedIndexPaidBills.count();	
		numItemsPaidBills.onsuccess = function(evt) {
			var loopPaindBillsOnly = openedIndexPaidBills.openCursor(range);
			loopPaindBillsOnly.onsuccess = function (event){
				alert(evt.target.result);
			}
		}
	*/
		var openedIndexPaidBillsCount = store.index("by_expenseName");
		var countPaidBills = 0;		var countNotPaidBills = 0;
		if (openedIndexPaidBillsCount) {			
			var cursorPaidBillsCount = openedIndexPaidBillsCount.openCursor();	
			cursorPaidBillsCount.onsuccess = function (event){
				var cursorPaidBills = event.target.result;
				if (cursorPaidBills){
					if(cursorPaidBills.value["expenseCategory"] == "Bill" && cursorPaidBills.value["expenseBillPaid"] == "paidYes"){
						countPaidBills++;
					}
					if(cursorPaidBills.value["expenseCategory"] == "Bill" && cursorPaidBills.value["expenseBillPaid"] == "paidNo"){
						countNotPaidBills++;
					}
					cursorPaidBills['continue']();
				}
			};
	
			var numItemsRequesr = openedIndexPaidBillsCount.count();	
			var countTest = 0;	var classUnderline = "";
			//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;
			
				var curCursor = openedIndexPaidBillsCount.openCursor();				
				curCursor.onsuccess = function(evt) {	
				
					var cursor = evt.target.result;					
					if (cursor) {
					
						if((cursor.value.expenseCategory != "Bill") || (cursor.value.expenseCategory == "Bill" && cursor.value.expenseBillPaid == "paidYes")){
					
							countTest++;
							if (countTest == numItems - countNotPaidBills) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }
								var text1 = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" ';
								var text2 = 'data-icon="arrow-r" data-iconpos="right" data-theme="c" ';
								var text3 = 'class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '">';
								var text4 = '<div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="expenseDetails.html" ';
								var text5 = 'onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">';
								var text6 = cursor.value.id + "." + cursor.value.expenseName + " - " + cursor.value.expenseBillPaid; ;
								var text7 = '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';
								
								$('#expensesListUL').append(text1 + text2 + text3 + text4 +	text5 +	text6 +	text7);
						}
						cursor.continue();
					}
				}				
			}	
		}
	}												////alert("end opened");
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getExpenseID) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("expenseClickedID", getExpenseID);
}
/* 
//deleting database
var dbreq = window.indexedDB.deleteDatabase("MyTest");
dbreq.onsuccess = function (event) {
	 // Database deleted
}
dbreq.onerror = function (event) {
	// Log or show the error message
}
*/