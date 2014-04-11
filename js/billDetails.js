															// alert("start");	
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

//var idGET = getUrlVars()["id"];
//var idGET = localStorage["clickedID"];
var getBillID = sessionStorage.getItem("billClickedID");
if(getBillID == null) {
	getBillID = 1;
}
															//alert(idGET);
function init() {
															//  alert("init");
  html5rocks.indexedDB.open(); // open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;
var message;
var status;
var currentObj;	

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("bills");
			//store = dbS.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getBillID));
		
		requestID.onsuccess = function(event) {	//function(e)
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			currentObj = result;
			
			if(result.expenseBillPaid == "paidYes") {
				message = "Mark as UnPaid";
				status = "paidYes";
			} else {
				message = "Mark as Paid";
				status = "paidNo";
			}
			
			if(result.expenseBillPaid == "paidYes") {
				$('#changeBillIDinitialPAID').show();
				$('#changeBillIDinitialUNPAID').hide();
			} else {
				$('#changeBillIDinitialUNPAID').show();
				$('#changeBillIDinitialPAID').hide();
			}
			
			$("#billPaid").text(message);
			$('#billCategory').text(result.expenseName);			
			$('#billAmmount').text(result.expenseAmmount);
			$('#billAccount').text(result.expenseAccount);
			$('#billDueDate').text(result.expenseDueDate);
			$('#billRepeatCycle').text(result.expenseRepeatCycle);
			$('#billRepeatEndDate').text(result.expenseRepeatEndDate);
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;
			$('#currentDate').text(today);
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
		if(confirm("Are you sure you want to delete this bill?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);	
				requestDelete.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
					var storeDelete = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
					storeDelete.delete(parseInt(getBillID));
					alert("This bill is deleted!");

					return true;
				}
				
				requestDelete.onerror = function(e) {
					alert('request.onerror!');
				}				
		} else {
			event.preventDefault();
			return false;
		}
	});
	
	$(".changeBill").change(function(){

		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		var openedDB = localStorage["openedDB"];
		var newCurrentBill = currentObj;
		var requestChange = indexedDB.open(openedDB);	
		
		requestChange.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;
			if(currentObj.expenseBillPaid == "paidYes") {
				newCurrentBill.expenseBillPaid = "paidNo";
			} else { 
				newCurrentBill.expenseBillPaid = "paidYes";
			}
			var storeReplace = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
			storeReplace.delete(parseInt(currentObj.id));
			storeReplace.add(newCurrentBill);

			//window.location.href = "billDetails.html";
			
			var modifyAccountObject;	
		  //we need to loop throught all accounts, to find the chosen one and to update accountBalance via billAmmount
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
							//alert((cursorA.value.accountName).toString() + " + " + (currentObj.expenseAccount).toString());
						
							if((cursorA.value.accountName).toString() == (currentObj.expenseAccount).toString()) {
								var newAccountAmmount;
								if(newCurrentBill.expenseBillPaid == "paidNo") {
									newAccountAmmount = (parseInt(cursorA.value.accountBalance) + parseInt(currentObj.expenseAmmount)).toString();
								}else if(newCurrentBill.expenseBillPaid == "paidYes") {
									newAccountAmmount = (parseInt(cursorA.value.accountBalance) - parseInt(currentObj.expenseAmmount)).toString();
								}								
								modifyAccountObject =  { 
									accountName: cursorA.value.accountName,
									accountType: cursorA.value.accountType,
									accountBalance: newAccountAmmount,
									accountDate: cursorA.value.accountDate,
									id: cursorA.value.id
								};	
								storeAccount.delete(parseInt(modifyAccountObject.id));
								storeAccount.add(modifyAccountObject);
							}
							cursorA.continue();
						} else {
							//window.location.href = "./billsDetails.html";						
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

		}
			
		requestChange.onerror = function(e) {
			alert('requestChange.onerror!');
		}		
	});
	
});

/* //this was with button
$( document ).ready(function() {
	$("#btnPaid").on("click", function(event){
		
		var question;
		var answer;
		if (status == "paidYes") {
			question = "Are you sure you want to mark this bill as UnPaid?";
			answer = "This bill is marked as UnPaid!";
		} else {			
			question = "Are you sure you want to mark this bill as Paid?";
			answer = "This bill is marked as Paid!";
		}

		if(confirm(question)){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;
			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);	
				requestDelete.onsuccess = function(e) {
					var replace = new Object;

					html5rocks.indexedDB.db = e.target.result;
					var storeReplace = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
					var openedIndex = storeReplace.index("by_id");
					var range = IDBKeyRange.only(parseInt(getBillID));
					var curCursor = openedIndex.openCursor(range);		
					curCursor.onsuccess = function(evt) {					
						var cursor = evt.target.result;					
						if (cursor) {
						
							replace.id = cursor.value.id;
							replace.expenseAccount = cursor.value.expenseAccount;
							replace.expenseAmmount = cursor.value.expenseAmmount;
							if( cursor.value.expenseBillPaid == "paidNo" )  	{ replace.expenseBillPaid = "paidYes"; }
							else												{ replace.expenseBillPaid = "paidNo"; }
							replace.expenseCategory = cursor.value.expenseCategory;
							replace.expenseDueDate = cursor.value.expenseDueDate;
							replace.expenseName = cursor.value.expenseName;
							if(cursor.value.expenseRepeatCycle == '') 	{ replace.expenseRepeatCycle = ''; } 
							else 										{ replace.expenseRepeatCycle = cursor.value.expenseRepeatCycle; }
							if(cursor.value.expenseRepeatEndDate == '')	{ replace.expenseRepeatEndDate = ''; }
							else										{ replace.expenseRepeatEndDate = cursor.value.expenseRepeatEndDate; }
							
							cursor.continue();
						} else { //when search is done
							//alert(replace.replaceID);
							storeReplace.delete(parseInt(replace.id));
							storeReplace.add(replace);
							window.location.href = "billDetails.html";
						}						
					}
					//storeDelete.delete(parseInt(getBillID));
					//http://stackoverflow.com/questions/11217309/how-to-update-an-html5-indexeddb-record
					alert(answer);
					return true;
				}
				requestDelete.onerror = function(e) {
					alert('request.onerror!');
				}				
		} else {
			event.preventDefault();
			return false;
		}		
	});
});*/


/*
	const objCategories = [ 
		{ categoryType: "Education", isIncome: "1", isExpense: "1", isBill: "0" },
		{ categoryType: "Food", isIncome: "0", isExpense: "1", isBill: "0" },
		{ categoryType: "Clothes", isIncome: "1", isExpense: "1", isBill: "0" },
	];	
	for (var ind = 0; ind < objCategories.length; ++ind) {
		storeCategories.add(objCategories[ind]);
		//alert(objCategories[ind].categoryType);
	}
*/