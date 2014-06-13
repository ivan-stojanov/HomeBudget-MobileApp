$( document ).ready(function() {
	//get today date
	var today1 = new Date();
	var min1 = today1.getMinutes();	if(min1<10){min1='0'+min1}
	var h1 = today1.getHours();		if(h1<10){h1='0'+h1}
	var dd1 = today1.getDate();		if(dd1<10){dd1='0'+dd1}
	var mm1 = today1.getMonth()+1;	if(mm1<10){mm1='0'+mm1}	//January is 0!
	var yyyy1 = today1.getFullYear(); 
	var todayDMY1 = dd1+'/'+mm1+'/'+yyyy1;
	$('#currentDate').text(todayDMY1);
});

function funcCategoryAdd() {
			
	var categoryType = $('#categoryType').val();
	var categoryIsIncomeText = $('#categoryIsIncome').val(); 
	var categoryIsExpenseText = $('#categoryIsExpense').val(); 
	var categoryIsBillText = $('#categoryIsBill').val(); 
	
	if(categoryIsIncomeText == "on") { categoryIsIncome = "1"; } else { categoryIsIncome = "0"; }
	if(categoryIsExpenseText == "on") { categoryIsExpense = "1"; } else { categoryIsExpense = "0"; }
	if(categoryIsBillText == "on") { categoryIsBill = "1"; } else { categoryIsBill = "0"; }

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