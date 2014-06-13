localStorage["openedDB"] = "MyTestDatabase";
//var version = 4;

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
	html5rocks.indexedDB.open();	// open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	
	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB/*, version*/);  
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		//var store;
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
			store = request.transaction.objectStore("expenses");/*html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");*/
		}
		else {
			store = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
	};
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
			
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
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
						
						var currentClass = (cursor.value.expenseName).toLowerCase().replace(" ","");
						var currentColor;// = setStyleColor(cursor.value.expenseBillPaid);	//function defined below
						var sign = "-";
						var numberAllPaid = 0;
						var numberAllUnPaid = 0;
						var arrayPaidStatus = (cursor.value.expenseBillPaid).split("+");
						for(var countBillsStatus = 0; countBillsStatus < arrayPaidStatus.length; countBillsStatus++){
							if(arrayPaidStatus[countBillsStatus] == "paidYes"){
								numberAllPaid++;
							} else if(arrayPaidStatus[countBillsStatus] == "paidNoo"){
								numberAllUnPaid++;
							}
						}
						var labelaText;
						if(numberAllPaid == 0) {
							sign = "pending: ";
							currentColor = setStyleColor("paidNoo");	//function defined below
							labelaText = '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + parseInt(cursor.value.expenseAmmount) * parseInt(cursor.value.expenseNumItems) + ' MKD</label>';
						} else if(numberAllUnPaid == 0) {
							sign = "-";
							currentColor = setStyleColor("paidYes");	//function defined below
							labelaText = '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + parseInt(cursor.value.expenseAmmount) * parseInt(cursor.value.expenseNumItems) + ' MKD</label>';
						} else {
							sign = "-";
							currentColor = setStyleColor("paidYes");	//function defined below
							labelaText = '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + parseInt(cursor.value.expenseAmmount) * parseInt(numberAllPaid) + ' MKD</label>';
							
							sign = "pending: ";
							currentColor = setStyleColor("paidNoo");	//function defined below
							labelaText += '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + parseInt(cursor.value.expenseAmmount) * parseInt(numberAllUnPaid) + ' MKD, &nbsp </label>';
						}

						$('#billsListUL').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="billDetails.html" onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">' + /*cursor.value.id + "." +*/ cursor.value.expenseName /*+ " - " + cursor.value.expenseBillPaid*/ + labelaText + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
						cursor.continue();
					} else {
						if(countTest == 0)	{	$('#noBills').show();	$('#billsListUL').hide();	}
						else				{	$('#noBills').hide();	$('#billsListUL').show();	}
						countTest == 0;
					}
				}
			}
			if (countTest == numItems)  {	
										} 
		}
			
		numItemsRequesr.onerror = function(evt) { var numItems = 0; }		
		
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getBillID) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("billClickedID", getBillID);
}

function setStyleColor(currentPaidStatus) {												
	if(currentPaidStatus == "paidYes") {
		return "red";
	} else { 	//if(currentPaidStatus == "paidNoo")
		return "blue";
	}
}
