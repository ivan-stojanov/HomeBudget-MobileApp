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
var getIncomeID = sessionStorage.getItem("incomeClickedID");
if(getIncomeID == null) {
	getIncomeID = 1;
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

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {  
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
	
		if(dbS.objectStoreNames.contains("incomes")) {
			//dbS.deleteObjectStore("incomes");
			//store = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getIncomeID));
		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}
			
			$('#incomeName').text(result.incomeName);
			$('#incomeAmmount').text(result.incomeAmmount);
			$('#incomeAccount').text(result.incomeAccount);
			$('#incomeCategory').text(result.incomeCategory);			
			//$('#incomeDueDate').text(result.incomeDueDate);
			$('#incomeDueDate').text(result.incomeCreated);
			$('#incomeRepeatCycle').text(result.incomeRepeatCycle);
			$('#incomeRepeatEndDate').text(result.incomeRepeatEndDate);
				//get today date
				var today = new Date();
				var min = today.getMinutes();	if(min<10){min='0'+min}
				var h = today.getHours();		if(h<10){h='0'+h}
				var dd = today.getDate();		if(dd<10){dd='0'+dd}
				var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
				var yyyy = today.getFullYear(); 
				today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
			$('#currentDate').text(today);
			
			/*// now let's close the database again!
			var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();*/
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
		if(confirm("Are you sure you want to delete this income?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);
			
			requestDelete.onsuccess = function(e) {  
				html5rocks.indexedDB.db = e.target.result;
				var storeDelete = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
				
				//get the account that is connected with this income, and subtract the amount of this income, from the account balance
				var replace = new Object;	
				var openedIndexFindThisID = storeDelete.index("by_incomeName");
				var cursorFindThisID = openedIndexFindThisID.openCursor();	
				cursorFindThisID.onsuccess = function (ev){
					var cursorThisID = ev.target.result;
					if (cursorThisID){
						if(cursorThisID.value["id"] == (parseInt(getIncomeID))){/*
							replace.id = cursorThisID.value.id;
							replace.expenseAccount = cursorThisID.value.expenseAccount;
							replace.expenseAmmount = cursorThisID.value.expenseAmmount;
							if( cursorThisID.value.expenseBillPaid == "paidNo" ){ replace.expenseBillPaid = "paidYes"; }
							else			 									{ replace.expenseBillPaid = "paidNo";  }
							replace.expenseCategory = cursorThisID.value.expenseCategory;
							replace.expenseDueDate = cursorThisID.value.expenseDueDate;
							replace.expenseName = cursorThisID.value.expenseName;
							if(cursorThisID.value.expenseRepeatCycle == '') 	{ replace.expenseRepeatCycle = ''; } 
							else 			 { replace.expenseRepeatCycle = cursorThisID.value.expenseRepeatCycle; }
							if(cursorThisID.value.expenseRepeatEndDate == '')	{ replace.expenseRepeatEndDate = ''; }
							else			 { replace.expenseRepeatEndDate = cursorThisID.value.expenseRepeatEndDate; }*/
						}
						cursorThisID.continue();
					} else {/*
						if(replace.expenseCategory != 'Bill') {	
							if(confirm("Are you sure you want to delete this expense?")){		
								storeDelete.delete(parseInt(getExpenseID));
								alert("This expense is deleted!");
								window.location.href = "expensesList.html";
								return true;
							} else {
								event.preventDefault();
								return false;
							}							
						} else {
							if(confirm("Are you sure you want to mark this bill as UnPaid?")){		
								storeDelete.delete(parseInt(getExpenseID));
								storeDelete.add(replace);
								alert("This bill is marked as UnPaid!");
								window.location.href = "expensesList.html";						
								return true;
							} else {
								event.preventDefault();
								return false;
							}		
						}	
					*/}
				}				
				
				
				
				

				
				storeDelete.delete(parseInt(getIncomeID));
				alert("This income is deleted!");
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
});








