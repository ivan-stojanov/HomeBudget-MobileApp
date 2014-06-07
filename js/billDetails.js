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
var storeAccounts;
var replaceAccount = new Object;
var replaceAccountComplete = new Object;
var replaceAccountInstances = new Object;
var thisBillAccount = "";
var thisBillAmmount = "";
var replaceDeletedInstance;
html5rocks.indexedDB.db = null;
//var message;
//var status;
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
		//$('#busy').hide();
		var requestID = store.get(parseInt(getBillID));
		
		requestID.onsuccess = function(event) {	//function(e)
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			currentObj = result;
			//$("#billPaid").text(message);
			$('#billCategory').text(result.expenseName);			
			$('#billAmmount').text(result.expenseAmmount);
			$('#billAccount').text(result.expenseAccount);
			$('#billRepeatCycle').text(result.expenseRepeatCycle);
			$('#billRepeatEndDate').text(result.expenseRepeatEndDate);
				//get today date
				var today = new Date();
				var min = today.getMinutes();	if(min<10){min='0'+min}
				var h = today.getHours();		if(h<10){h='0'+h}
				var dd = today.getDate();		if(dd<10){dd='0'+dd}
				var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
				var yyyy = today.getFullYear(); 
				today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
				var todayDMY = dd+'/'+mm+'/'+yyyy;
			$('#currentDate').text(todayDMY);
			
			if(result.expenseNumItems == 1){
				$('#changeBillLabel').show();
				if(result.expenseBillPaid == "paidYes") {
					$('#changeBillIDinitialPAID').show();
					$('#changeBillIDinitialUNPAID').hide();
					var numPaidItems = 1;
				} else {
					$('#changeBillIDinitialUNPAID').show();
					$('#changeBillIDinitialPAID').hide();
					var numPaidItems = 0;
				}
			} else {
				$('#changeBillIDinitialPAID').hide();
				$('#changeBillIDinitialUNPAID').hide();
				$('#changeBillLabel').hide();				
				
				var listDates = (result.expenseCreated).split("+");
				var listPaidStatus = (result.expenseBillPaid).split("+");
				var numPaidItems = 0;
				for(var countDates = 0; countDates < listDates.length; countDates++) {
					var selectPaid = "";	var selectUnPaid = "";
					if(listPaidStatus[countDates] == "paidYes"){
						selectPaid = "selected=''";
						numPaidItems++;
					} else if(listPaidStatus[countDates] == "paidNoo"){
						selectUnPaid = "selected=''";
					}
					$('#billCreated').html($('#billCreated').html() + "<br><br>Date of bill: " + listDates[countDates]);
					$('#billCreated').html($('#billCreated').html() + "<select name='changeBill1' class='changeBill1' onchange=changeStatus('" + result.expenseBillPaid + "','" + listPaidStatus[countDates] + "','" + countDates + "','" + listDates[countDates] + "')><option value='off' " + selectUnPaid + ">UnPaid</option><option value='on' " + selectPaid + ">Paid</option></select><input type='submit' value='Delete This' onclick=deleteDate('" + result.expenseCreated + "','" + listDates[countDates] + "','" + countDates + "','" + listDates.length + "','" + listPaidStatus[countDates] + "','" + result.expenseBillPaid + "')>");	
				}
			}
			//this informations we need in case user delete this bill, then we need to update the account that is related to the bill
			thisBillAccount = result.expenseAccount;
			thisBillAmmount = result.expenseAmmount;
			
			storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
			var openedIndexFindAccount = storeAccounts.index("by_accountName");
			var singleKeyRangeAccount = IDBKeyRange.only(thisBillAccount);
			var cursorFindAccount = openedIndexFindAccount.openCursor(singleKeyRangeAccount);	
			
			cursorFindAccount.onsuccess = function (eve){
				var cursorThisAccount = eve.target.result;
				if (cursorThisAccount){
					if(cursorThisAccount.value.accountName == thisBillAccount){
						replaceAccount.accountName = cursorThisAccount.value.accountName;
						replaceAccount.accountType = cursorThisAccount.value.accountType;
						replaceAccount.accountBalance = (parseFloat(cursorThisAccount.value.accountBalance) + parseFloat(thisBillAmmount));
						replaceAccount.accountDate = cursorThisAccount.value.accountDate;
						replaceAccount.id = cursorThisAccount.value.id;
						//this is when delete by button from header, then we need to extract sum for all instances (not bills)
						replaceAccountComplete.accountName = cursorThisAccount.value.accountName;
						replaceAccountComplete.accountType = cursorThisAccount.value.accountType;
						replaceAccountComplete.accountBalance = (parseFloat(cursorThisAccount.value.accountBalance) + (parseFloat(thisBillAmmount) * parseFloat(result.expenseNumItems)));
						replaceAccountComplete.accountDate = cursorThisAccount.value.accountDate;
						replaceAccountComplete.id = cursorThisAccount.value.id;
						//this is when delete by button from header, then we need to extract sum for all instances (bills only)
						replaceAccountInstances.accountName = cursorThisAccount.value.accountName;
						replaceAccountInstances.accountType = cursorThisAccount.value.accountType;
						replaceAccountInstances.accountBalance = (parseFloat(cursorThisAccount.value.accountBalance) + (parseFloat(thisBillAmmount) * parseFloat(numPaidItems)));
						replaceAccountInstances.accountDate = cursorThisAccount.value.accountDate;
						replaceAccountInstances.id = cursorThisAccount.value.id;
					}
					cursorThisAccount.continue();
				} else {
					//alert("finish");
				}
			}
			replaceDeletedInstance =  {
 				expenseName: result.expenseName,
 				expenseAmmount: result.expenseAmmount,
 				expenseAccount: result.expenseAccount,
 				expenseCategory: result.expenseCategory,
 				expenseDueDate: result.expenseDueDate,
 				expenseRepeatCycle: result.expenseRepeatCycle,
 				expenseRepeatEndDate: result.expenseRepeatEndDate,
 				expenseRepeat: result.expenseRepeat,
 				expenseRepeatLastUpdate: result.expenseRepeatLastUpdate,
 				expenseCreated: result.expenseCreated,
				expenseNumItems: (parseInt(result.expenseNumItems) - 1).toString(),
 				expenseBillPaid: result.expenseBillPaid,
 				id: result.id
  			};
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

String.prototype.replaceBetween = function(start, end, what) {
	return this.substring(0, start) + what + this.substring(end);
};

function changeStatus(comleteStringStatus, statusToChange, currentPosition, dateThisInstance) {
	var originalString = comleteStringStatus;
	var newOriginalString;
	var deleteStartPosition8;
	if(currentPosition == 0) {
		deleteStartPosition8 = 0;
	} else {
		deleteStartPosition8 = (8 * (parseInt(currentPosition)));
	}
	var checkStatus = comleteStringStatus.substring(deleteStartPosition8, parseInt(deleteStartPosition8) + 7);
	var newStatus;
	if(checkStatus == "paidNoo") {
		newStatus = "paidYes";
	} else {
		newStatus = "paidNoo";
	}	

	newOriginalString = originalString.replaceBetween(deleteStartPosition8, parseInt(deleteStartPosition8) + 7, newStatus);
	//alert(newOriginalString);	
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;
	var openedDB = localStorage["openedDB"];
	var newCurrentBill = currentObj;
	var requestChange = indexedDB.open(openedDB);	
	
	requestChange.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		newCurrentBill.expenseBillPaid = newOriginalString;
		var storeReplace = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		storeReplace.delete(parseInt(currentObj.id));
		storeReplace.add(newCurrentBill);
		
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
							if(newStatus == "paidNoo") {
								newAccountAmmount = (parseInt(cursorA.value.accountBalance) + parseInt(currentObj.expenseAmmount)).toString();
							}else if(newStatus == "paidYes") {
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
						var messageStatus;
						if(newStatus == "paidNoo") {
							messageStatus = "UnPaid";
						}else if(newStatus == "paidYes") {
							messageStatus = "Paid";
						}								
						alert("Bill that was created at " + dateThisInstance + " has been changed as " + messageStatus);
						window.location.href = "billDetails.html";
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
}

function deleteDate(comleteStringDate, dateToDelete, currentPosition, totalPositions, payedStatus, comleteStringPaidStatus) {
  	//alert(comleteStringDate);
  	//var completeString = comleteStringDate;
  	if(totalPositions == 1) {
  		if(confirm("Are you sure you want to completely delete this bill?")){		
  			var html5rocks = {};
  			html5rocks.indexedDB = {};
  			html5rocks.indexedDB.db = null;
  			var openedDB = localStorage["openedDB"];	
  			var requestDelete = indexedDB.open(openedDB);			
  			requestDelete.onsuccess = function(e) {
  				html5rocks.indexedDB.db = e.target.result;
				if(payedStatus == "paidYes"){
					var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
					storeAccounts.delete(parseInt(replaceAccount.id));
					storeAccounts.add(replaceAccount);
				}
  				var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
  				store.delete(parseInt(getBillID));
  				alert("This bill is deleted!");
  				window.location.href = "expensesList.html";
  				return true;				
  			}			
  			requestDelete.onerror = function(e) {
  				alert('request.onerror!');
  			}				
  		} else {
  			event.preventDefault();
  			return false;
  		}
  	} else {
  		if(confirm("Are you sure you want to delete this instance of the bill created at " + dateToDelete + " ?")){		
			//get info for updating replaceDeletedInstance.expenseBillPaid
			var originalStringPaidStatus = comleteStringPaidStatus;		
			var newOriginalPaidStatusString;
			if(currentPosition == 0) {
				newOriginalPaidStatusString = originalStringPaidStatus.replaceBetween(currentPosition, 8, "");		
			} else {
				var deleteStartPosition8 = ((8 * (parseInt(currentPosition))) - 1);				
				newOriginalPaidStatusString = originalStringPaidStatus.replaceBetween(deleteStartPosition8, parseInt(deleteStartPosition8) + 8, "");
			}
		
  			if (currentPosition == 0) {					//if the first instance of the bill is deleted
  				var allStringDates = comleteStringDate;
  				var allWithoutDeletedDate = allStringDates.replace(dateToDelete + "+", "");
  				replaceDeletedInstance.expenseCreated = allWithoutDeletedDate;
				replaceDeletedInstance.expenseBillPaid = newOriginalPaidStatusString;
  				//alert(allWithoutDeletedDate);
  			} else {									//if the other then first instance of the bill is deleted
  				var allStringDates = comleteStringDate;
  				var allWithoutDeletedDate = allStringDates.replace("+" + dateToDelete, "");
  				replaceDeletedInstance.expenseCreated = allWithoutDeletedDate;
				replaceDeletedInstance.expenseBillPaid = newOriginalPaidStatusString;
  				//alert(allWithoutDeletedDate);
  			}
  			
  			var html5rocks = {};
  			html5rocks.indexedDB = {};
  			html5rocks.indexedDB.db = null;
  			var openedDB = localStorage["openedDB"];	
  			var requestDelete = indexedDB.open(openedDB);			
  			requestDelete.onsuccess = function(e) {
  				html5rocks.indexedDB.db = e.target.result;
				if(payedStatus == "paidYes"){
					var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
					storeAccounts.delete(parseInt(replaceAccount.id));
					storeAccounts.add(replaceAccount);
				}
  				var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");				
  				store.delete(parseInt(getBillID));
  				store.add(replaceDeletedInstance);
  				alert("This instance of the bill is deleted!");
  				window.location.href = "billDetails.html";
  				return true;				
  			}			
  			requestDelete.onerror = function(e) {
  				alert('request.onerror!');
  			}		
  		} else {
  			event.preventDefault();
  			return false;
  		}
  	}
  	//completeString.replace(dateToDelete, "");
  }
 
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
					//first update the account balance that is connected with this bill
					var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
					storeAccounts.delete(parseInt(replaceAccountInstances.id));
					storeAccounts.add(replaceAccountInstances);
					//then delete the bill
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
				newCurrentBill.expenseBillPaid = "paidNoo";
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
								if(newCurrentBill.expenseBillPaid == "paidNoo") {
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

//$('#testSlider').html('<select name="changeBill1 class="changeBill1"><option value="off">UnPaid</option><option value="on" selected="">Paid</option></select>');
//$('#testSlider').html('<select name="changeBill1" class="changeBill1 ui-slider-switch" data-role="slider" data-mini="true"><option value="off">UnPaid</option><option value="on" selected="">Paid</option></select><div role="application" class="ui-slider ui-slider-switch ui-btn-down-c ui-btn-corner-all ui-mini"><span class="ui-slider-label ui-slider-label-a ui-btn-active ui-btn-corner-all" role="img" style="width: 100%;">Paid3</span><span class="ui-slider-label ui-slider-label-b ui-btn-down-c ui-btn-corner-all" role="img" style="width: 0%;">UnPaid</span><div class="ui-slider-inneroffset"><a href="#" class="ui-slider-handle ui-slider-handle-snapping ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="on" aria-valuetext="Paid" title="Paid" aria-labelledby="undefined-label" style="left: 100%;"><span class="ui-btn-inner"><span class="ui-btn-text"></span></span></a></div></div>');			

