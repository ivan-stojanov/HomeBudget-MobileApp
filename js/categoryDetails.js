															// alert("start");	
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;	
// Handle the prefix of Chrome to IDBTransaction/IDBKeyRange.
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}
indexedDB.onerror = function(e) {
	console.log(e);
};

var getCategoryID = sessionStorage.getItem("categoryClickedID");
if(getCategoryID == null) {
	getCategoryID = 1;
}
function init() {
  html5rocks.indexedDB.open();
}
window.addEventListener("DOMContentLoaded", init, false);
var currentObj;	
var elementIncome = '';		var selectedIncomeYes = '';		var selectedIncomeNo = '';
var elementExpense = '';	var selectedExpenseYes = '';	var selectedExpenseNo = '';
var elementBill = '';		var selectedBillYes = '';		var selectedBillNo = '';
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
	
		if(dbS.objectStoreNames.contains("categories")) {
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
		}
		
		var store = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
		$('#busy').hide();
		var requestID = store.get(parseInt(getCategoryID));
		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){alert(result);}
			currentObj = result;
			
			if(result.isIncome == 0) {
				$('#catIncomeIDinitialNO').show();
				$('#catIncomeIDinitialYES').hide();
			} else {
				$('#catIncomeIDinitialYES').show();
				$('#catIncomeIDinitialNO').hide();
			}
			
			if(result.isExpense == 0) {
				$('#catExpenseIDinitialNO').show();
				$('#catExpenseIDinitialYES').hide();
			} else {
				$('#catExpenseIDinitialYES').show();
				$('#catExpenseIDinitialNO').hide();
			}

			if(result.isBill == 0) {
				$('#catBillIDinitialNO').show();
				$('#catBillIDinitialYES').hide();
			} else {
				$('#catBillIDinitialYES').show();
				$('#catBillIDinitialNO').hide();
			}
			
			$('#categoryType').text(result.categoryType);
			$('#categoryIsIncome').text(result.isIncome);
			$('#categoryIsExpense').text(result.isExpense);
			$('#categoryIsBill').text(result.isBill);			
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
		if(confirm("Are you sure you want to delete this category?")){	
			var html5rocks = {};
			html5rocks.indexedDB = {};
			html5rocks.indexedDB.db = null;

			var openedDB = localStorage["openedDB"];	
			var requestDelete = indexedDB.open(openedDB);	
				requestDelete.onsuccess = function(e) {  
					html5rocks.indexedDB.db = e.target.result;
					var storeDelete = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
					storeDelete.delete(parseInt(getCategoryID));
					alert("This category is deleted!");
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
	
	$(".categoryIsIncomeB").change(function(){
	
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		var newCurrentIncome = currentObj;
		var openedDB = localStorage["openedDB"];	
		var requestChangeI = indexedDB.open(openedDB);
		
		requestChangeI.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;
			var storeChangeI = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
			storeChangeI.delete(parseInt(currentObj.id));
			newCurrentIncome.id = currentObj.id;		
			newCurrentIncome.categoryType = currentObj.categoryType;
			if(currentObj.isIncome == "0") { 
				newCurrentIncome.isIncome = "1"; 
			} else { 
				newCurrentIncome.isIncome = "0"; 
			}
			newCurrentIncome.isExpense = currentObj.isExpense;
			newCurrentIncome.isBill = currentObj.isBill;
			storeChangeI.add(newCurrentIncome);
			$("#categoryIsIncome").html(newCurrentIncome.isIncome);
			$("#categoryIsExpense").html(newCurrentIncome.isExpense);
			$("#categoryIsBill").html(newCurrentIncome.isBill);
			currentObj = newCurrentIncome;
		}
		
		requestChangeI.onerror = function(e) {
			alert('requestChangeI.onerror!');
		}		
	});
	
	$(".categoryIsExpenseB").change(function(){
	
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		var newCurrentExpense = currentObj;
		var openedDB = localStorage["openedDB"];	
		var requestChangeE = indexedDB.open(openedDB);
		
		requestChangeE.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;
			var storeChangeE = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
			storeChangeE.delete(parseInt(currentObj.id));
			newCurrentExpense.id = currentObj.id;		
			newCurrentExpense.categoryType = currentObj.categoryType;
			newCurrentExpense.isIncome = currentObj.isIncome;
			if(currentObj.isExpense == "0") { 
				newCurrentExpense.isExpense = "1"; 
			} else { 
				newCurrentExpense.isExpense = "0"; 
			}
			newCurrentExpense.isBill = currentObj.isBill;
			storeChangeE.add(newCurrentExpense);
			$("#categoryIsIncome").html(newCurrentExpense.isIncome);
			$("#categoryIsExpense").html(newCurrentExpense.isExpense);
			$("#categoryIsBill").html(newCurrentExpense.isBill);
			currentObj = newCurrentExpense;
		}
		
		requestChangeE.onerror = function(e) {
			alert('requestChangeE.onerror!');
		}
		
	});
	
	$(".categoryIsBillB").change(function(){
	
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		var newCurrentBill = currentObj;
		var openedDB = localStorage["openedDB"];	
		var requestChangeB = indexedDB.open(openedDB);
		
		requestChangeB.onsuccess = function(e) {  
			html5rocks.indexedDB.db = e.target.result;
			var storeChangeB = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
			storeChangeB.delete(parseInt(currentObj.id));
			newCurrentBill.id = currentObj.id;		
			newCurrentBill.categoryType = currentObj.categoryType;
			newCurrentBill.isIncome = currentObj.isIncome;
			newCurrentBill.isExpense = currentObj.isExpense;
			if(currentObj.isBill == "0") { 
				newCurrentBill.isBill = "1"; 
			} else { 
				newCurrentBill.isBill = "0"; 
			}
			storeChangeB.add(newCurrentBill);
			$("#categoryIsIncome").html(newCurrentBill.isIncome);
			$("#categoryIsExpense").html(newCurrentBill.isExpense);
			$("#categoryIsBill").html(newCurrentBill.isBill);
			currentObj = newCurrentBill;
		}
		
		requestChangeB.onerror = function(e) {
			alert('requestChangeB.onerror!');
		}
		
	});

});