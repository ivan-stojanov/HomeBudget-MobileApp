localStorage["openedDB"] = "MyTestDatabase";
var version = 3;
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
};

function init() {
												//  alert("init");
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
	var request = indexedDB.open(openedDB, version);  
												////alert("opened MyTest");
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
											   //alert("request onupgradeneeded"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
												////alert("before create objectStoreS onupgradeneeded"); 
		//var store;
		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//store = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
													////alert("before get objectStore onupgradeneeded"); 
			store = request.transaction.objectStore("accounts");/*html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");*/
													////alert("after get objectStore onupgradeneeded"); 
		}
		else {
													////alert("before create objectStore onupgradeneeded"); 
			store = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
													////alert("after create objectStore onupgradeneeded"); 
		}
													////alert("after objectStoreS onupgradeneeded"); 		
		//var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
													 //alert("after get objectStore onupgradeneeded"); 
// /*		
//this part is to add items in the account objectStore (when app is first Installed)
		const obj = [
			{ accountName: "Ivan", accountType: "PrivatenIvan", accountBalance: 35000, accountDate: "10/10/2010" },
			{ accountName: "Zoran", accountType: "PrivatenZoran", accountBalance: 1100, accountDate: "11/11/2011" },
			{ accountName: "Niko", accountType: "PrivatenNiko", accountBalance: 65000, accountDate: "11/10/2013" },
		];	
													//alert("created objects onupgradeneeded");
		store.add(obj[0]);store.add(obj[1]);store.add(obj[2]);
													//alert("add created objects onupgradeneeded");
//this part is for creating indexes for each attribute in the accounts													
		store.createIndex( "by_accountName", "accountName", { unique: false } );
		store.createIndex( "by_accountType", "accountType", { unique: false } );
		store.createIndex( "by_accountBalance", "accountBalance", { unique: false } );
		store.createIndex( "by_accountDate", "accountDate", { unique: false } );
		store.createIndex( "by_id", "id", { unique: false } );	
// */	
	};
	request.onsuccess = function(e) {
													////alert("request onsuccess"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
													////alert("before store");  
		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//store = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
			
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
													////alert("after store"); 
		const obj = [
			{ accountName: "Ivan", accountType: "PrivatenIvan", accountBalance: 35000, accountDate: "10/10/2010" },
			{ accountName: "Zoran", accountType: "PrivatenZoran", accountBalance: 1100, accountDate: "11/11/2011" },
			{ accountName: "Niko", accountType: "PrivatenNiko", accountBalance: 65000, accountDate: "11/10/2013" },
		];	
													//alert("created objects");
	//	store.add(obj[0]);store.add(obj[1]);store.add(obj[2]);
													//alert("add created objects");
		// Get everything in the store;
		//var keyRange = IDBKeyRange.lowerBound(0);
		
		
		var openedIndex = store.index("by_accountName");
		var numItemsRequesr = openedIndex.count();	
		var countTest = 0;	var classUnderline = "";
	//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
		numItemsRequesr.onsuccess = function(evt) {   
			var numItems = evt.target.result;			
			if (openedIndex) {
				var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
				curCursor.onsuccess = function(evt) {					
					var cursor = evt.target.result;					
					if (cursor) {
						countTest++;
						if (countTest == numItems) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }

						$('ul'/*'#accountsList'*/).append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accountDetails.html" onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">' + cursor.value.accountName + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
						cursor.continue();
					}
				}
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
	};
												////alert("end opened");
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(idGet) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("clickedID", idGet);
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