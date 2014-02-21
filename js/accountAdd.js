function funcAccountAdd() {
	var openedDB;
	var request;
	if(($('#accountName').val().length > 0) && ($('#accountType').val().length > 0) && ($('#accountBalance').val().length > 0) && ($('#accountDate').val().length > 0)){
		var obj =  { 
				accountName: $("#accountName").val(),
				accountType: $("#accountType").val(),
				accountBalance: $("#accountBalance").val(),
				accountDate: $("#accountDate").val()
			};				
		var test = "Ivan";
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;

		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		
				
		alert("New accound is added - WRONG");
		
		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
			store.add(obj);
			/*			store.delete(1);store.delete(5);store.delete(6);store.delete(7);store.delete(8);store.delete(9);store.delete(10);store.delete(11);store.delete(12);store.delete(13);store.delete(14);store.delete(15);store.delete(16);store.delete(17);store.delete(18);store.delete(19);store.delete(20);store.delete(21);store.delete(22);store.delete(23);store.delete(24);store.delete(25);store.delete(26);store.delete(27);store.delete(28);store.delete(29);store.delete(30);store.delete(31);store.delete(32);store.delete("1");
			*/
			//alert('New accound is added - TRUE');
			
			// now let's close the database again!
		/*	var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();	*/
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