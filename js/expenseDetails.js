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
};

var getExpenseID = sessionStorage.getItem("expenseClickedID");
if(getExpenseID == null) {
	getExpenseID = 1;
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
	
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("expenses");
			//store = dbS.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getExpenseID));
		
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}

			if(result.expenseCategory == "Bill") {
				document.getElementById('spanMSG').innerHTML="Mark this Bill as UnPaid";
			}	
			$('#expenseName').text(result.expenseName);
			$('#expenseAmmount').text(result.expenseAmmount);
			$('#expenseAccount').text(result.expenseAccount);
			$('#expenseCategory').text(result.expenseCategory);			
			//$('#expenseDueDate').text(result.expenseDueDate);
			$('#expenseDueDate').text(result.expenseCreated);
			$('#expenseRepeatCycle').text(result.expenseRepeatCycle);
			$('#expenseRepeatEndDate').text(result.expenseRepeatEndDate);
				//get today date
				var today = new Date();
				var min = today.getMinutes();	if(min<10){min='0'+min}
				var h = today.getHours();		if(h<10){h='0'+h}
				var dd = today.getDate();		if(dd<10){dd='0'+dd}
				var mm = today.getMonth()+1;	if(mm<10){mm='0'+mm}	//January is 0!
				var yyyy = today.getFullYear(); 
				today = dd+'/'+mm+'/'+yyyy+'/'+h+'/'+min;
			$('#currentDate').text(today);
			
		}
	};
	request.onerror = html5rocks.indexedDB.onerror;
};

$( document ).ready(function() {
	$(".confirmDelete").on("click", function(event){
	
	//alert(getExpenseID);
	//PREKU NEKOJ INDEKS IZMINI GI SITE I KOGA KE DOJDES DO getExpenseID ZACUVAJ SE ZA NEGO
	//AKO NE E BILL IZBRISI GO SO KODOT VO PRODOLZENIE
	//AKO E BILL ZAMENI GO STATUSO VO UNPAID, SO KODOT OD billDetails.js - LINE 120
	
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		var openedDB = localStorage["openedDB"];	
		var requestDelete = indexedDB.open(openedDB);	
		
		requestDelete.onsuccess = function(e) {  
		
			html5rocks.indexedDB.db = e.target.result;
			var storeDelete = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
			
			var replace = new Object;	
			var openedIndexFindThisID = storeDelete.index("by_expenseName");
			var cursorFindThisID = openedIndexFindThisID.openCursor();	
			cursorFindThisID.onsuccess = function (ev){
				var cursorThisID = ev.target.result;
				if (cursorThisID){
					if(cursorThisID.value["id"] == (parseInt(getExpenseID))){
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
						else			 { replace.expenseRepeatEndDate = cursorThisID.value.expenseRepeatEndDate; }
					}
					cursorThisID.continue();
				} else {
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
				}
			}
		}			
		
		requestDelete.onerror = function(e) {
			alert('request.onerror!');
		}				
		
	});
});
