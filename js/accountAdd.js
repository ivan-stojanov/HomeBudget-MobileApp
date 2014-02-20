function funcAccountAdd() {
	if(($('#accountName').val().length > 0) && ($('#accountType').val().length > 0) && ($('#accountBalance').val().length > 0) && ($('#accountDate').val().length > 0)){
		var html5rocks = {};
		html5rocks.indexedDB = {};
		var store;
		html5rocks.indexedDB.db = null;

		var openedDB = localStorage["openedDB"];	
		var request = indexedDB.open(openedDB);
		alert('request = indexedDB.open(openedDB)');
		request.onsuccess = function(e) {
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
		};
		
		request.onupgradeneeded = function(e) {  
			alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}		
	} else {	
        alert('Please fill all fields');
    }  
	
}