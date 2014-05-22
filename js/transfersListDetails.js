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
var storeTransfers;
var today = new Date();

html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("transfers")) {
			//dbS.deleteObjectStore("transfers");
			//storeTransfers = dbS.createObjectStore('transfers', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('transfers', { keyPath: 'id', autoIncrement: true });
		}
		
		storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");	
		var openedIndexx = storeTransfers.index("by_transferDate");
		var numItemsRequest = openedIndexx.count();		
		var numPassed = 0;
		var numFuture = 0;
		numItemsRequest.onsuccess = function(evt) {	
			var numItems = evt.target.result;	
			if (openedIndexx) {
				var curCursorT = openedIndexx.openCursor();
				
				curCursorT.onsuccess = function(evt) {
					var cursorT = evt.target.result;
					if (cursorT) {
						var dateArrayForm = (cursorT.value.transferDate).split("-");
						
						var stringAdd = "";
						stringAdd += '<br>Date of Transfer: ' + dateArrayForm[2]+'/'+dateArrayForm[1]+'/'+dateArrayForm[0];
						stringAdd += '<br>From Account: ' + cursorT.value.transferFromAccount;
						stringAdd += '<br>To Account: ' + cursorT.value.transferToAccount;
						stringAdd += '<br>Amount: ' + cursorT.value.transferAmmount;
						stringAdd += '<hr>';

						var thisTransferDateArray = (cursorT.value.transferDate).split('-');
						var thisTransferDate = new Date(thisTransferDateArray[0],parseInt(thisTransferDateArray[1] - 1),thisTransferDateArray[2]);
						if(today >= thisTransferDate) { //it is in the past
							numPassed++;
							$('#pastTransfers').html($('#pastTransfers').html() + stringAdd);							
						} else {						//it is in the future
							numFuture++;
							$('#futureTransfers').html($('#futureTransfers').html() + stringAdd);
						}
						cursorT.continue();
					} else {
						if(numPassed == 0) {
							$('#pastTransfers').text($('#pastTransfers').text() + "<br>There are no transfers in the past!");
						}
						if(numFuture == 0) {
							$('#futureTransfers').text($('#futureTransfers').text() + "<br>There are no transfers in the future!");
						}
					}
				}
				
				curCursorT.onerror = function(evt) {
					alert("curCursorT.onerror");					
				}
			}
		}
			
		numItemsRequest.onerror = function(evt) { 
			alert("numItemsRequest.onerror"); 
		}
		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};