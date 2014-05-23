function addAccountsDropDowns() {
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
							$('#drop-down-list-from-account').append('<option value="' + cursor.value.accountName + '">' + cursor.value.accountName + '</option>');
							$('#drop-down-list-to-account').append('<option value="' + cursor.value.accountName + '">' + cursor.value.accountName + '</option>');
							deletePoints++;
						}								
						cursor.continue();
					} else {
						if(haveCashOnHand == false) {	
							$("#drop-down-list-from-account option[value='Cash on hand']").remove();
							$("#drop-down-list-to-account option[value='Cash on hand']").remove();
						}
						if(haveCreditCard == false) {	
							$("#drop-down-list-from-account option[value='Credit Card']").remove();
							$("#drop-down-list-to-account option[value='Credit Card']").remove();
						}
						if(haveBankAccount == false) {
							$("#drop-down-list-from-account option[value='Bank Account']").remove();
							$("#drop-down-list-to-account option[value='Bank Account']").remove();
						}
						if(deletePoints == 0) {
							$("#drop-down-list-from-account option[value='points']").remove();
							$("#drop-down-list-to-account option[value='points']").remove();
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

function funcTransferAdd() {

	//get today date
	var today = new Date();
	var min = today.getMinutes();	if(min<10){min='0'+min}
	var h = today.getHours();		if(h<10){h='0'+h}
	var dd = today.getDate();		if(dd<10){dd='0'+dd}
	var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
	var yyyy = today.getFullYear(); 
	today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
	
	var transferAmmount = $('#transferAmmount').val(); 
	var transferFromAccount = $('#drop-down-list-from-account').val(); 
	var transferToAccount = $('#drop-down-list-to-account').val(); 
	var transferDate =	$('#transferDate').val(); 
		
	var openedDB;
	var request;
	var objFromAccount;
	var objToAccount;
	var objTransfer = {
		transferAmmount: transferAmmount.toString(),
		transferDate: transferDate,	//formatDate(transferDate),
		transferFromAccount: "",	//this is added below
		transferToAccount: "",		//this is added below
		transferStatus: "fail"
	};
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;	
	
		var storeAccount = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var openedIndexx = storeAccount.index("by_accountName");
		var numItemsRequest = openedIndexx.count();		
		numItemsRequest.onsuccess = function(evt) {	
			var numItems = evt.target.result;	
			if (openedIndexx) {
				var curCursorA = openedIndexx.openCursor();

				curCursorA.onsuccess = function(evt) {
					var cursorA = evt.target.result;
					if (cursorA) {
						if((cursorA.value.accountName).toString() == transferFromAccount) {	
							objTransfer.transferFromAccount = (cursorA.value.id).toString();
							objFromAccount =  { 
								accountName: cursorA.value.accountName,
								accountType: cursorA.value.accountType,
								accountBalance: (parseInt(cursorA.value.accountBalance) - parseInt(transferAmmount)).toString(),
								accountDate: cursorA.value.accountDate,
								id: cursorA.value.id
							};	
						}						
						if((cursorA.value.accountName).toString() == transferToAccount) {
							objTransfer.transferToAccount = (cursorA.value.id).toString();						
							objToAccount =  { 
								accountName: cursorA.value.accountName,
								accountType: cursorA.value.accountType,
								accountBalance: (parseInt(cursorA.value.accountBalance) + parseInt(transferAmmount)).toString(),
								accountDate: cursorA.value.accountDate,
								id: cursorA.value.id
							};	
						}
						cursorA.continue();
					} else {
						var thisTransferDateArray = transferDate.split('-');
						var thisTransferDate = new Date(thisTransferDateArray[0],parseInt(thisTransferDateArray[1] - 1),thisTransferDateArray[2]);
						var todayDate = new Date();
						if(todayDate >= thisTransferDate) { //it is in the past
							objTransfer.transferStatus = "yes";
							//if it is in the past, then update accounts and make transfers
							storeAccount.delete(parseInt(objFromAccount.id));
							storeAccount.add(objFromAccount);						
							storeAccount.delete(parseInt(objToAccount.id));
							storeAccount.add(objToAccount);
						} else {							//it is in the future
							//if it is in the future, then don't update accounts and set status to not transfered
							objTransfer.transferStatus = "no";
						}					
						var storeTransfer = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
						storeTransfer.add(objTransfer);						
						window.location.href = "./transfersListDetails.html";
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
	/*var currentURLhaveAccountURLarray = (document.URL).split("?accountIncomeStart=");
	var codedAccount = "";
	if(currentURLhaveAccountURLarray.length == 2) {
		codedAccount = decodeURIComponent(currentURLhaveAccountURLarray[1]);		
	}*/
});
