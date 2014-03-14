function funcCategoryAdd() {
			
	var categoryType = $('#categoryType').val();
	var categoryIsIncomeText = $('#categoryIsIncome').val(); 
	var categoryIsExpenseText = $('#categoryIsExpense').val(); 
	var categoryIsBillText = $('#categoryIsBill').val(); 
	
	if(categoryIsIncomeText == "on") { categoryIsIncome = "1"; } else { categoryIsIncome = "0"; }
	if(categoryIsExpenseText == "on") { categoryIsExpense = "1"; } else { categoryIsExpense = "0"; }
	if(categoryIsBillText == "on") { categoryIsBill = "1"; } else { categoryIsBill = "0"; }
/*
	alert(
		categoryType 			+ " : " + 
		categoryIsIncome 		+ " : " + 
		categoryIsExpense 		+ " : " + 
		categoryIsBill 				
	);
*/
	var openedDB;
	var request;
	var obj =  { 
			categoryType: categoryType,
			isIncome: categoryIsIncome,
			isExpense: categoryIsExpense,
			isBill: categoryIsBill
		};	
		
	var html5rocks = {};
	html5rocks.indexedDB = {};
	html5rocks.indexedDB.db = null;

	openedDB = localStorage["openedDB"];	
	request = indexedDB.open(openedDB);		
	
	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;			
		var store = html5rocks.indexedDB.db.transaction(["categories"], "readwrite").objectStore("categories");	
		store.add(obj);


		window.location.href = "./categoriesList.html";
	};
	
	request.onupgradeneeded = function(e) {  
		alert('request.onupgradeneeded!');
	}
	
	request.onerror = function(e) {
		alert('request.onerror!');
	}		
}