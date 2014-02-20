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

function accoundAdd() {

	if(($('#accountName').val().length > 0) && ($('#accountType').val().length > 0) && ($('#accountBalance').val().length > 0) && ($('#accountDate').val().length > 0)){
	
		var html5rocks = {};
		html5rocks.indexedDB = {};
		var store;
		html5rocks.indexedDB.db = null;

		var openedDB = localStorage["openedDB"];	
		var request = indexedDB.open(openedDB);

		request.onsuccess = function(e) {
		//	alert('request.onsuccess');
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
			$('#busy').hide();			
			var obj =  { 
						accountName: $("#accountName").val(),
						accountType: $("#accountType").val(),
						accountBalance: $("#accountBalance").val(),
						accountDate: $("#accountDate").val()
					};					
			store.add(obj);
			alert('New accound is added');
		//	alert('store.add');
		};
		
		request.onerror = html5rocks.indexedDB.onerror;
		//return true;
		
		
	} else {
	
        alert('Please fill all fields');
		//return false;
    }  
	
}