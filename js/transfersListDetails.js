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
		
		var storeAccount = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var openedIndexxAcc = storeAccount.index("by_id");
		var numItemsRequestAcc = openedIndexxAcc.count();	
		var arrayAccountNames = new Array();
		
		numItemsRequestAcc.onsuccess = function(evt) {	
			var numItemsAcc = evt.target.result;

			if (openedIndexxAcc) {
				var curCursorA = openedIndexxAcc.openCursor();

				curCursorA.onsuccess = function(evt) {
					var cursorA = evt.target.result;
					if (cursorA) {
						arrayAccountNames[cursorA.value.id] = cursorA.value.accountName;
						cursorA.continue();
					} else {
					
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
										var displayAccoutFrom = arrayAccountNames[cursorT.value.transferFromAccount];
										var displayAccoutTo = arrayAccountNames[cursorT.value.transferToAccount];
										if(!displayAccoutFrom) 	
										{	displayAccoutFrom = "<del>" + cursorT.value.transferHistoryFromAccount + "</del>(Deleted Account)";	}
										if(!displayAccoutTo) 	
										{	displayAccoutTo = "<del>" + cursorT.value.transferHistoryToAccount + "</del>(Deleted Account)";		}
										
										var stringAdd = "";
										stringAdd += '<tr><td>Date of Transfer: </td><td>' + dateArrayForm[2]+'/'+dateArrayForm[1]+'/'+dateArrayForm[0] + "</td></tr>";
										stringAdd += '<tr><td>From Account: </td><td>' + displayAccoutFrom + "</td></tr>";
										stringAdd += '<tr><td>To Account: </td><td>' + displayAccoutTo + "</td></tr>";
										stringAdd += '<tr><td>Amount: </td><td>' + cursorT.value.transferAmmount + " MKD" + "</td></tr>";

										var thisTransferDateArray = (cursorT.value.transferDate).split('-');
										var thisTransferDate = new Date(thisTransferDateArray[0],parseInt(thisTransferDateArray[1] - 1),thisTransferDateArray[2]);
										
										if(today >= thisTransferDate) { //it is in the past 
											if(cursorT.value.transferStatus == "fail") {	// if it is canceled while upcoming, then there is no transfer
												stringAdd = "<tr><td><b><label class='canceled'>CANCELED:</label></b></td><td> &nbsp </td></tr>'" + stringAdd;
											}										
											numPassed++;
											stringAdd += '<tr><td> &nbsp </td><td><input type="button" value="Remove from list" onclick="removePast(' + cursorT.value.id + ')"/>' + '</td></tr>';
											stringAdd += '<tr><td> &nbsp </td><td> &nbsp </td></tr>';
											$('#pastTransfersTable').html($('#pastTransfersTable').html() + stringAdd);							
										} else {						//it is in the future
											if((!arrayAccountNames[cursorT.value.transferFromAccount]) || (!arrayAccountNames[cursorT.value.transferToAccount]) || (cursorT.value.transferStatus == "fail")) {
												stringAdd = "<tr><td><br><b><label class='canceled'>CANCELED:</label></b></td><td> &nbsp </td></tr>" + stringAdd;
											}										
											numFuture++;											
							var objTransferCurrent = {
								transferAmmount: (cursorT.value.transferAmmount).toString(),
								transferDate: (thisTransferDateArray[0] + "-" + thisTransferDateArray[1] + "-" + thisTransferDateArray[2]),
								transferFromAccount: cursorT.value.transferFromAccount,
								transferToAccount: cursorT.value.transferToAccount,
								transferHistoryFromAccount: cursorT.value.transferHistoryFromAccount,
								transferHistoryToAccount: cursorT.value.transferHistoryToAccount,
								transferStatus: cursorT.value.transferStatus,
								id: cursorT.value.id
							};	
											//stringAdd += '<br>';
											var cancel = "&nbsp";
											if(objTransferCurrent.transferStatus != "fail") {
												cancel = '<input type="button" value="Cancel" onclick="cancelFuture(' + objTransferCurrent.id + ',' +objTransferCurrent.transferAmmount + ',\'' + objTransferCurrent.transferDate + '\',' + objTransferCurrent.transferFromAccount + ',' + objTransferCurrent.transferToAccount + ',\'' + objTransferCurrent.transferStatus + '\',\'' + objTransferCurrent.transferHistoryFromAccount + '\',\'' + objTransferCurrent.transferHistoryToAccount + '\')"/>';
											}
											stringAdd += '<tr><td>' + cancel + '</td><td><input type="button" value="Remove from list" onclick="removeFuture(' + cursorT.value.id + ')"/></td></tr>';
											stringAdd += '<tr><td> &nbsp </td><td> &nbsp </td></tr>';
											$('#futureTransfersTable').html($('#futureTransfersTable').html() + stringAdd);
										}
										cursorT.continue();
									} else {
										if(numPassed == 0) {
											$('#pastTransfersTable').html($('#pastTransfersTable').html() + "<tr><td colspan='2'>There are no records about transfers in the past!</td></tr>");
										}
										if(numFuture == 0) {
											$('#futureTransfersTable').html($('#futureTransfersTable').html() + "<tr><td colspan='2'>There are no records about upcoming transfers!</td></tr>");
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
					}
				}
				
				curCursorA.onerror = function(evt) {
					alert("curCursorA.onerror");					
				}
			}
		}
			
		numItemsRequestAcc.onerror = function(evt) { 
			alert("numItemsRequestAcc.onerror"); 
		}		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

function removePast(id) {
	if(confirm("Are you sure you want to remove this transfer from list?")){	
	
		var openedDB = localStorage["openedDB"];	
		var request = indexedDB.open(openedDB);

		request.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;

			var storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
			storeTransfers.delete(id);
			alert("The transfer is removed!");
			window.location.href = "transfersListDetails.html";
			return true;
		}		
	} else {
		event.preventDefault();
		return false;
	}
}

function removeFuture(id) {
	if(confirm("Are you sure you want to remove this transfer from list?")){	
	
		var openedDB = localStorage["openedDB"];	
		var request = indexedDB.open(openedDB);

		request.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;

			var storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
			storeTransfers.delete(id);
			alert("The transfer is removed from list!");
			window.location.href = "transfersListDetails.html";
			return true;
		}		
	} else {
		event.preventDefault();
		return false;
	}
}

function cancelFuture(id,transferAmmount,transferDate,transferFromAccount,transferToAccount,transferStatus,transferHistoryFromAccount,transferHistoryToAccount)
{
	var objTransferCurrent = {
		transferAmmount: (transferAmmount).toString(),
		transferDate: transferDate,
		transferFromAccount: transferFromAccount,
		transferToAccount: transferToAccount,
		transferHistoryFromAccount: transferHistoryFromAccount,
		transferHistoryToAccount: transferHistoryToAccount,
		transferStatus: "fail",
		id: id
	};	
	
	//alert(transferDate.toString());
	if(confirm("Are you sure you want to cancel this transfer from list?")){	
	
		var openedDB = localStorage["openedDB"];	
		var request = indexedDB.open(openedDB);

		request.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;

			var storeTransfers = html5rocks.indexedDB.db.transaction(["transfers"], "readwrite").objectStore("transfers");
			storeTransfers.delete(objTransferCurrent.id);
			storeTransfers.add(objTransferCurrent);
			
			alert("The transfer is canceled!");
			window.location.href = "transfersListDetails.html";
			return true;
		}		
	} else {
		event.preventDefault();
		return false;
	}
}