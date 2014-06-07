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
};
function init() {
												
	html5rocks.indexedDB.open();	
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
												
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);  

	request.onupgradeneeded = function(e) {  
											   alert("request onupgradeneeded"); 
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		if(dbS.objectStoreNames.contains("categories")) {
			store = request.transaction.objectStore("categories");
		}
		else {
			store = html5rocks.indexedDB.db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
		}
	};
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		if(dbS.objectStoreNames.contains("categories")) {
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
		}
			
		var store = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");
		const objCategories = [ 
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
		
		var openedIndex = store.index("by_categoryType");
		var numItemsRequesr = openedIndex.count();	
		var countTest = 0;	var classUnderline = "";
		numItemsRequesr.onsuccess = function(evt) {   
			var numItems = evt.target.result;	
			if (openedIndex) {
				var curCursor = openedIndex.openCursor();				
				curCursor.onsuccess = function(evt) {					
					var cursor = evt.target.result;					
					if (cursor) {
						countTest++;
						if (countTest == numItems) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }

						$('#categoriesListUL').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="categoryDetails.html" onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">' /*+ cursor.value.id + "."*/ + cursor.value.categoryType + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
						cursor.continue();
					}
				}
			}
		}
			
		numItemsRequesr.onerror = function(evt) { var numItems = 0; }		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getCategoryID) {												
	sessionStorage.setItem("categoryClickedID", getCategoryID);
}