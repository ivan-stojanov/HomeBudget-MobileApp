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
//DA SE ZEMAT SAMO ONIE SO IMAT ZA EXPENSE-BILL POSTAVENO YES - neuspesno
		var openedIndexPaidBillsCount = store.index("by_expenseName");
		var countPaidBills = 0;		var countNotPaidBills = 0;
		if (openedIndexPaidBillsCount) {			
			var cursorPaidBillsCount = openedIndexPaidBillsCount.openCursor();	
			cursorPaidBillsCount.onsuccess = function (event){
				var cursorPaidBills = event.target.result;
				if (cursorPaidBills){
					if(cursorPaidBills.value["expenseCategory"] == "Bill"){	// && cursorPaidBills.value["expenseBillPaid"] == "paidYes"){
						var arrayStatusPaid = (cursorPaidBills.value["expenseBillPaid"]).split("+");
						var paidStatusYes = false;
						for(var countPaidStatus = 0; countPaidStatus < arrayStatusPaid.length; countPaidStatus++){
							if(arrayStatusPaid[countPaidStatus] == "paidYes") { paidStatusYes = true; }
						}
						if(paidStatusYes == true){
							countPaidBills++;
						} else {
							countNotPaidBills++;
						}
					}
					cursorPaidBills['continue']();
				}
			};
	
			var numItemsRequesr = openedIndexPaidBillsCount.count();	
			var countTest = 0;	var classUnderline = "";
			//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
			numItemsRequesr.onsuccess = function(evt) {   
				var numItems = evt.target.result;
				var text1, text2, text3, text4, text5, text6, text7;
				var curCursor = openedIndexPaidBillsCount.openCursor();				
				curCursor.onsuccess = function(evt) {	
				
					var cursor = evt.target.result;					
					if (cursor) {
					
						var appendToList;						
						var arrayBillPaidStatus = (cursor.value.expenseBillPaid).split("+");
						var paidBillStatusYes = false;
						for(var countBillPaidStatus = 0; countBillPaidStatus < arrayBillPaidStatus.length; countBillPaidStatus++){
							if(arrayBillPaidStatus[countBillPaidStatus] == "paidYes") { paidBillStatusYes = true; }
						}						
						if(countPaidBills == 0) { $('#billsListUL').hide(); } else { $('#billsListUL').show(); }
						if((cursor.value.expenseCategory != "Bill") || (cursor.value.expenseCategory == "Bill" && paidBillStatusYes == true/*cursor.value.expenseBillPaid == "paidYes"*/)){
							var numItemsCount = parseInt(cursor.value.expenseNumItems);
							if (cursor.value.expenseCategory == "Bill" && paidBillStatusYes == true/*cursor.value.expenseBillPaid == "paidYes"*/) { 
								appendToList = "#billsListULe";
								numItemsCount = 0;
								var arrayNumPaidBills = (cursor.value.expenseBillPaid).split("+");
								for(var countBills = 0; countBills < arrayNumPaidBills.length; countBills++){
									if(arrayNumPaidBills[countBills] == "paidYes"){
										numItemsCount++;
									}
								}
							} else {
								appendToList = "#expensesListUL";
							}
							countTest++;
							if (countPaidBills == 0) {
								if (countTest == numItems - countNotPaidBills) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }
							} else {
								if (countTest == numItems - countNotPaidBills) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }
							}
							var currentClass = (cursor.value.expenseName).toLowerCase().replace(" ","");
							var currentColor = setStyleColor(cursor.value.expenseAmmount);	//function defined below

							text1 = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" ';
							text2 = 'data-icon="arrow-r" data-iconpos="right" data-theme="c" ';
							text3 = 'class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '">';
							text4 = '<div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="expenseDetails.html" ';
							text5 = 'onclick="callFunction('+ cursor.value.id +')" rel="external" class="ui-link-inherit">';
							text6 = /*cursor.value.id + "." +*/ cursor.value.expenseName/*+ " - " + cursor.value.expenseBillPaid*/;
							text7 = '<label style="color:red" class="rightSide ' + currentClass + 'Style">-' + parseInt(cursor.value.expenseAmmount) * numItemsCount + ' MKD</label></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';
							
							$(appendToList).append(text1 + text2 + text3 + text4 + text5 + text6 + text7);
						}
						cursor.continue();
					}
					else { 
						if(countTest == 0)	{	$('#noExpenses').show();	$('#expensesListUL').hide();	$('#billsListULe').hide();	}
						else				{	$('#noExpenses').hide();	$('#expensesListUL').show();	$('#billsListULe').show();	}
						countTest == 0;
						}
				}				
			}	
		}
	}												////alert("end opened");
	request.onerror = html5rocks.indexedDB.onerror;
};

function callFunction(getExpenseID) {												
	//localStorage["clickedID"] = idGet;		//alert("id: " + idGet); 
	sessionStorage.setItem("expenseClickedID", getExpenseID);
}

function setStyleColor(currentBalance) {												
	if(currentBalance < 0) {
		return "red";
	} else if(currentBalance > 0) {
		return "green";
	} else {
		return "blue";
	}
}