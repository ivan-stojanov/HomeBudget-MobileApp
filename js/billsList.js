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
											   //alert("request onupgradeneeded"); 
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
 /*		
//this part is to add items in the account objectStore (when app is first Installed)
		const obj = [
			{ incomeName: "Party Income", incomeCategory: "Party", incomeAmmount: 500, incomeDueDate: "10/10/2010", incomeAccount: "Ivan", incomeRepeat: "no", incomeRepeatPeriod: "" },
			{ incomeName: "My Payment", incomeCategory: "Pay", incomeAmmount: 100, incomeDueDate: "10/10/2010", incomeAccount: "Zoran", incomeRepeat: "yes", incomeRepeatPeriod: "1 Month" },
			{ incomeName: "Codefu Award", incomeCategory: "Award", incomeAmmount: 200, incomeDueDate: "10/10/2010", incomeAccount: "Niko", incomeRepeat: "yes", incomeRepeatPeriod: "1 Year" },
		];	
													//alert("created objects onupgradeneeded");
		store.add(obj[0]);store.add(obj[1]);store.add(obj[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the incomes			
		store.createIndex( "by_incomeName", "incomeName", { unique: false } );
		store.createIndex( "by_incomeCategory", "incomeCategory", { unique: false } );
		store.createIndex( "by_incomeAmmount", "incomeAmmount", { unique: false } );
		store.createIndex( "by_incomeDueDate", "incomeDueDate", { unique: false } );
		store.createIndex( "by_incomeAccount", "incomeAccount", { unique: false } );
		store.createIndex( "by_incomeRepeat", "incomeRepeat", { unique: false } );
		store.createIndex( "by_incomeRepeatPeriod", "incomeRepeatPeriod", { unique: false } );
		store.createIndex( "by_id", "id", { unique: false } );	
 */	
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
		/*const obj = [
			{ billCategory: "Education", billAmmount: 520, billDueDate: "10/10/2010", billAccount: "Ivan", billRepeat: "no", billRepeatPeriod: "" },
			{ billCategory: "Food", billAmmount: 170, billDueDate: "10/10/2010", billAccount: "Zoran", billRepeat: "yes", billRepeatPeriod: "1 Month" },
			{ billCategory: "Clothes", billAmmount: 400, billDueDate: "10/10/2010", billAccount: "Niko", billRepeat: "yes", billRepeatPeriod: "1 Year" },
		];	
		*/											//alert("created objects");
	//	store.add(obj[0]);store.add(obj[1]);store.add(obj[2]);
													//alert("add created objects");
		// Get everything in the store;
		//var keyRange = IDBKeyRange.lowerBound(0);
		
		
		var openedIndex = store.index("by_expenseCategory");
		var numItemsRequesr = openedIndex.count();	
		var countTest = 0;	var classUnderline = "";
	//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
		numItemsRequesr.onsuccess = function(evt) {   
			var numItems = evt.target.result;	
			var range = IDBKeyRange.only("Bill");
			/*alert(numItems);*/
			if (openedIndex) {
				var curCursor = openedIndex.openCursor(range/*null, "prev"*/);				
				curCursor.onsuccess = function(evt) {					
					var cursor = evt.target.result;				//alert(cursor);	
					if (cursor) {
						countTest++;
						if (countTest == numItems) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }

						$('#billsListUL').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="billDetails.html" onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">' + cursor.value.id + "." + cursor.value.expenseName + " - " + cursor.value.expenseBillPaid + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
						cursor.continue();
					}
				}
			}
			if (countTest == numItems)  {	/*var dbCLOSE;
											dbCLOSE = request.result;
											dbCLOSE.close(); */
										} 			
			
		}
			
		numItemsRequesr.onerror = function(evt) { var numItems = 0; }		
		
//		var upperBoundOpenKeyRange = IDBKeyRange.upperBound(6, false);	/*store.delete(9);store.delete(8);store.delete(7);*/
													////alert("created range");	
//		var cursorRequest = store.openCursor(/*upperBoundOpenKeyRange*/);
													////alert("opened cursor");	
//		cursorRequest.onsuccess = function(e) {
													//////alert("in loop cursor");	
//			var result = e.target.result;
//			if(!!result == false)
//				return;
													//alert(result.value.id);
			//$('ul'/*'#accountsList'*/).append('<li><a href="accountDetails.html" onclick="callFunction('+ result.value.id +')" rel="external">' + /*'<p class="line1">' + */ result.value.accountName + /*'</p>'*/ '</a></li>');			
			
//			$('ul'/*'#accountsList'*/).prepend('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accountDetails.html" onclick="callFunction('+ result.value.id +')" rel="external" class="ui-link-inherit">' + result.value.accountName + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
//			result.continue();

//		};
		
//		cursorRequest.onerror = html5rocks.indexedDB.onerror;  	
	   // html5rocks.indexedDB.getAllTodoItems();
	   		
		
		// now let's close the database again!
	/*	var dbCLOSE;
	    dbCLOSE = request.result;
		dbCLOSE.close();	*/
	};
												////alert("end opened");
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getBillID) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("billClickedID", getBillID);
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