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
var storeIncomes;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.open = function() {	

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB);

	request.onsuccess = function(e) {
		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;
		
		var totalTodaySum = 0;	var total7daysSum = 0;	var totalThisMonthSum = 0;	var totalThisYearSum = 0;	var totalSum = 0;

		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//storeAccounts = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeA = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		
		var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
		var openedIndexAccounts = storeAccounts.index("by_id");
		var numItemsAccounts = openedIndexAccounts.count();	
		var accountsTotal = 0;
	//we need numItemsAccountsCount so that we can iterate with coursor if there are items that are found
		numItemsAccounts.onsuccess = function(evt) {
			var numItemsAccountsCount = evt.target.result;			
			if (openedIndexAccounts) {
				var curCursorAccounts = openedIndexAccounts.openCursor();
				curCursorAccounts.onsuccess = function(evt) {
					var cursorAcc = evt.target.result;
					if (cursorAcc) {
						var dateCreated = cursorAcc.value.accountDate;
						var arrayDateAccount = dateCreated.split("/");
						var dateAccountCreated = new Date(arrayDateAccount[2],arrayDateAccount[1] - 1,arrayDateAccount[0]);
						var currentDateNow = new Date();						
						if(currentDateNow >= dateAccountCreated) {
							accountsTotal += parseFloat(cursorAcc.value.accountBalance);
						}
						cursorAcc.continue();
					} else {
						$("#accountStatus").html(accountsTotal + " MKD");
						if((parseFloat(accountsTotal)) > 0) {	
							$('#accountStatus').css("color","green");
							$("#accountStatus").html("+" + $("#accountStatus").html());
						} else if((parseFloat(signToday + totalTodaySum)) < 0) {		
							$('#accountStatus').css("color","red");	
						} else {
							$('#accountStatus').css("color","blue");	
							if(($('#accountStatus').text()[0] == "+") || ($('#accountStatus').text()[0] == "-")){
								$('#accountStatus').html("&nbsp0 MKD");
							}
						}						
					}
				}
			}
		}			
		
		if(dbS.objectStoreNames.contains("incomes")) {
			//dbS.deleteObjectStore("incomes");
			//storeIncomes = dbS.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('incomes', { keyPath: 'id', autoIncrement: true });
		}
		
		var storeIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");	
		//$('#busy').hide();
		var openedIndexIncomes = storeIncomes.index("by_id");
		var numItemsIncomes = openedIndexIncomes.count();	
		var countTestIncomes = 0;	
		var incomesToday = 0;	var incomes7days = 0;	var incomesThisMonth = 0;	var incomesThisYear = 0;	var incomesTotal = 0;
		var dateStringIncomeCreated;	var ammountIncome;	var datePartsIterate;
		var dateFormatIncomeCreated;	var dateFormatToday = new Date();
		var todayStartDate;		var weekStartDate;		var monthStartDate;			var yearStartDate;
		var weekTestDate = new Date().add(-7).days();
		var monthTestDate = new Date().add((-1) * new Date().getDate() + 1).days();
		var yearTestDate = new Date().add((-1) * new Date().getMonth()).months().add((-1) * new Date().getDate() + 1).days();

		//alert(yearTestDate);
	//we need numItemsIncomesCount so that we can iterate with coursor if there are items that are found
		numItemsIncomes.onsuccess = function(evt) {   
			var numItemsIncomesCount = evt.target.result;			
			/*alert(numItemsIncomesCount);*/
			if (openedIndexIncomes) {
				var curCursorIncomes = openedIndexIncomes.openCursor(/*null, "prev"*/);				
				curCursorIncomes.onsuccess = function(evt) {			//alert(dateFormatToday.getMonth()+1);		
					var cursorIn = evt.target.result;					//alert(cursorIn.value.id);	
					if (cursorIn) {
						countTestIncomes++;
						
						dateFormatToday = new Date();
						todayStartDate = new Date(dateFormatToday.getFullYear(),dateFormatToday.getMonth(),dateFormatToday.getDate());
					//	alert(todayStartDate);
						weekStartDate = new Date(weekTestDate.getFullYear(),weekTestDate.getMonth(),weekTestDate.getDate());		
					//	alert(weekStartDate);
						monthStartDate = new Date(monthTestDate.getFullYear(),monthTestDate.getMonth(),monthTestDate.getDate());		
					//	alert(monthStartDate);
						yearStartDate = new Date(yearTestDate.getFullYear(),yearTestDate.getMonth(),yearTestDate.getDate());		
					//	alert(yearStartDate);
	//alert(dateFormatIncomeCreated + " ooooo " + dateFormatIncomeCreated.add(1).months());						
	//alert(dateFormatToday);
	//alert(dateFormatToday.getDate() + "/" + (dateFormatToday.getMonth()+1) + "/" + dateFormatToday.getFullYear());
						dateStringIncomeCreated = cursorIn.value.incomeCreated;
						ammountIncome = cursorIn.value.incomeAmmount;
						//loop throught all dates on creation so that we compare and sum the summary
						var differentDatesIncomes = dateStringIncomeCreated.split("+");
						if(differentDatesIncomes.length == 1) {
							datePartsIterate = dateStringIncomeCreated.split("/");	//	17/04/2014/23/59
							dateFormatIncomeCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
							if(dateFormatIncomeCreated - todayStartDate > 0) {
								incomesToday = parseInt(incomesToday) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - weekStartDate > 0) {
								incomes7days = parseInt(incomes7days) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - monthStartDate > 0) {
								incomesThisMonth = parseInt(incomesThisMonth) + parseInt(ammountIncome);
							}
							if(dateFormatIncomeCreated - yearStartDate > 0) {
								incomesThisYear = parseInt(incomesThisYear) + parseInt(ammountIncome);
							}
							incomesTotal = parseInt(incomesTotal) + parseInt(ammountIncome);
						} else {
							for(var i=0; i<differentDatesIncomes.length; i++) {
								datePartsIterate = differentDatesIncomes[i].split("/");	//	17/04/2014/23/59
								dateFormatIncomeCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
								
								if(dateFormatIncomeCreated - todayStartDate > 0) {								
									incomesToday = parseInt(incomesToday) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - weekStartDate > 0) {								
									incomes7days = parseInt(incomes7days) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - monthStartDate > 0) {								
									incomesThisMonth = parseInt(incomesThisMonth) + parseInt(ammountIncome);
								}
								if(dateFormatIncomeCreated - yearStartDate > 0) {								
									incomesThisYear = parseInt(incomesThisYear) + parseInt(ammountIncome);
								}
								incomesTotal = parseInt(incomesTotal) + parseInt(ammountIncome);
							}
						}
						cursorIn.continue();
					} else {
						$('#todayIncomes').text($('#todayIncomes').html() + "+" + incomesToday + " MKD");
						if(incomesToday > 0) {	$('#todayIncomes').css("color","green");		} else {	$('#todayIncomes').css("color","blue");		}
						
						$('#past7daysIncomes').text($('#past7daysIncomes').html() + "+" + incomes7days + " MKD");
						if(incomes7days > 0) {	$('#past7daysIncomes').css("color","green");	} else {	$('#past7daysIncomes').css("color","blue");	}
						
						$('#thisMonthIncomes').text($('#thisMonthIncomes').html() + "+" + incomesThisMonth + " MKD");
						if(incomesThisMonth > 0) {	$('#thisMonthIncomes').css("color","green");} else {	$('#thisMonthIncomes').css("color","blue");	}
						
						$('#thisYearIncomes').text($('#thisYearIncomes').html() + "+" + incomesThisYear + " MKD");
						if(incomesThisYear > 0) {	$('#thisYearIncomes').css("color","green");}  else {	$('#thisYearIncomes').css("color","blue");	}
						
						$('#totalIncomes').text($('#totalIncomes').html() + "+" + incomesTotal + " MKD");
						if(incomesTotal > 0) {	$('#totalIncomes').css("color","green");}	  	  else {	$('#totalIncomes').css("color","blue");		}
					
						totalTodaySum = parseInt(totalTodaySum) + parseInt(incomesToday);
						total7daysSum = parseInt(total7daysSum) + parseInt(incomes7days);
						totalThisMonthSum = parseInt(totalThisMonthSum) + parseInt(incomesThisMonth);
						totalThisYearSum = parseInt(totalThisYearSum) + parseInt(incomesThisYear);
						totalSum = parseInt(totalSum) + parseInt(incomesTotal);
						
						var signToday = "";	var sign7days = "";	var signMonth = "";	var signYear = "";	signTotal = "";	
						if(parseInt(totalTodaySum) >= 0)	{	signToday = "+";	}
						if(parseInt(total7daysSum) >= 0)	{	sign7days = "+";	}
						if(parseInt(totalThisMonthSum) >= 0){	signMonth = "+";	}
						if(parseInt(totalThisYearSum) >= 0)	{	signYear = "+";		}
						if(parseInt(totalSum) >= 0)			{	signTotal = "+";	}

						$('#todaySum').text(signToday + totalTodaySum);
						$('#past7daysSum').text(sign7days + total7daysSum);
						$('#thisMonthSum').text(signMonth + totalThisMonthSum);
						$('#thisYearSum').text(signYear + totalThisYearSum);
						$('#totalSum').text(signTotal + totalSum);
					}
				}
			}
			
			if (countTestIncomes == numItemsIncomesCount)   {
																/*var dbCLOSE;
																dbCLOSE = request.result;
																dbCLOSE.close();*/
															}
		}
			
		numItemsIncomes.onerror = function(evt) { var numItemsIncomesCount = 0; }
		
		if(dbS.objectStoreNames.contains("expenses")) {
			//dbS.deleteObjectStore("expenses");
			//storeExpenses = dbS.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
		}
		
		var storeExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");	
		//$('#busy').hide();
		var openedIndexExpenses = storeExpenses.index("by_id");
		var numItemsExpenses = openedIndexExpenses.count();	
		var countTestExpenses = 0;	
		var expensesToday = 0;	var expenses7days = 0;	var expensesThisMonth = 0;	var expensesThisYear = 0;	var expensesTotal = 0;
		var dateStringExpenseCreated;	var ammountExpense;	var datePartsIterate;
		var dateFormatExpenseCreated;	var dateFormatToday = new Date();
		var todayStartDate;		var weekStartDate;		var monthStartDate;			var yearStartDate;
		var weekTestDate = new Date().add(-7).days();
		var monthTestDate = new Date().add((-1) * new Date().getDate() + 1).days();
		var yearTestDate = new Date().add((-1) * new Date().getMonth()).months().add((-1) * new Date().getDate() + 1).days();

		//alert(yearTestDate);
	//we need numItemsExpensesCount so that we can iterate with coursor if there are items that are found
		numItemsExpenses.onsuccess = function(evt) {   
			var numItemsExpensesCount = evt.target.result;			
			/*alert(numItemsExpensesCount);*/
			if (openedIndexExpenses) {
				var curCursorExpenses = openedIndexExpenses.openCursor(/*null, "prev"*/);				
				curCursorExpenses.onsuccess = function(evt) {			//alert(dateFormatToday.getMonth()+1);		
					var cursorEx = evt.target.result;					//alert(cursorEx.value.id);	
					if (cursorEx) {
						countTestExpenses++;
						
						dateFormatToday = new Date();
						todayStartDate = new Date(dateFormatToday.getFullYear(),dateFormatToday.getMonth(),dateFormatToday.getDate());
					//	alert(todayStartDate);
						weekStartDate = new Date(weekTestDate.getFullYear(),weekTestDate.getMonth(),weekTestDate.getDate());		
					//	alert(weekStartDate);
						monthStartDate = new Date(monthTestDate.getFullYear(),monthTestDate.getMonth(),monthTestDate.getDate());		
					//	alert(monthStartDate);
						yearStartDate = new Date(yearTestDate.getFullYear(),yearTestDate.getMonth(),yearTestDate.getDate());		
					//	alert(yearStartDate);
	//alert(dateFormatExpenseCreated + " ooooo " + dateFormatExpenseCreated.add(1).months());						
	//alert(dateFormatToday);
	//alert(dateFormatToday.getDate() + "/" + (dateFormatToday.getMonth()+1) + "/" + dateFormatToday.getFullYear());
						dateStringExpenseCreated = cursorEx.value.expenseCreated;
						ammountExpense = cursorEx.value.expenseAmmount;
						
						//if the expense is a bill that is not paid, it's not counting in summary
						if(cursorEx.value.expenseCategory != "Bill") {
							//loop throught all dates on creation so that we compare and sum the summary
							var differentDatesExpenses = dateStringExpenseCreated.split("+");
							if(differentDatesExpenses.length == 1) {
								datePartsIterate = dateStringExpenseCreated.split("/");	//	17/04/2014/23/59
								dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
								if(dateFormatExpenseCreated - todayStartDate > 0) {								
									expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - weekStartDate > 0) {								
									expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - monthStartDate > 0) {								
									expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
								}
								if(dateFormatExpenseCreated - yearStartDate > 0) {								
									expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
								}
								expensesTotal = parseInt(expensesTotal) + parseInt(ammountExpense);
							} else {
								for(var i=0; i<differentDatesExpenses.length; i++) {
									datePartsIterate = differentDatesExpenses[i].split("/");	//	17/04/2014/23/59
									dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
									
									if(dateFormatExpenseCreated - todayStartDate > 0) {								
										expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - weekStartDate > 0) {								
										expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - monthStartDate > 0) {								
										expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - yearStartDate > 0) {								
										expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
									}
									expensesTotal = parseInt(expensesTotal) + parseInt(ammountExpense);
								}
							}
							cursorEx.continue();
						} else {	
							//if we sum ammounts from bills then first find which bills have paidYes status inside their status
							var arrayStatusPaid = (cursorEx.value.expenseBillPaid).split("+");
							var paidStatusYes = false;
							for(var countPaidStatus = 0; countPaidStatus < arrayStatusPaid.length; countPaidStatus++){
								if(arrayStatusPaid[countPaidStatus] == "paidYes") { paidStatusYes = true; }
							}
							
							if(paidStatusYes == true) {//if(cursorEx.value.expenseBillPaid == "paidYes") {
								//loop throught all dates on creation so that we compare and sum the summary
								var differentDatesExpenses = dateStringExpenseCreated.split("+");
								if(differentDatesExpenses.length == 1) {
									datePartsIterate = dateStringExpenseCreated.split("/");	//	17/04/2014/23/59
									dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);
									if(dateFormatExpenseCreated - todayStartDate > 0) {								
										expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - weekStartDate > 0) {								
										expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - monthStartDate > 0) {								
										expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
									}
									if(dateFormatExpenseCreated - yearStartDate > 0) {								
										expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
									}
									expensesTotal = parseInt(expensesTotal) + parseInt(ammountExpense);
								} else {
									for(var i=0; i<differentDatesExpenses.length; i++) {
										//we will count in the summary only the ones instances that are paid
										if(arrayStatusPaid[i] == "paidYes") {
											datePartsIterate = differentDatesExpenses[i].split("/");	//	17/04/2014/23/59
											dateFormatExpenseCreated = new Date(datePartsIterate[2],datePartsIterate[1] - 1,datePartsIterate[0],datePartsIterate[3],datePartsIterate[4]);										
											
											if(dateFormatExpenseCreated - todayStartDate > 0) {								
												expensesToday = parseInt(expensesToday) + parseInt(ammountExpense);
											}
											if(dateFormatExpenseCreated - weekStartDate > 0) {								
												expenses7days = parseInt(expenses7days) + parseInt(ammountExpense);
											}
											if(dateFormatExpenseCreated - monthStartDate > 0) {								
												expensesThisMonth = parseInt(expensesThisMonth) + parseInt(ammountExpense);
											}
											if(dateFormatExpenseCreated - yearStartDate > 0) {								
												expensesThisYear = parseInt(expensesThisYear) + parseInt(ammountExpense);
											}
											expensesTotal = parseInt(expensesTotal) + parseInt(ammountExpense);
										}
									}
								}
							}
							cursorEx.continue();
						}
					} else {
						$('#todayExpenses').text($('#todayExpenses').html() + "-" + expensesToday + " MKD");
						if(expensesToday > 0) {	$('#todayExpenses').css("color","red");		} else {	$('#todayExpenses').css("color","blue");		}

						$('#past7daysExpenses').text($('#past7daysExpenses').html() + "-" + expenses7days + " MKD");
						if(expenses7days > 0) {	$('#past7daysExpenses').css("color","red");	} else {	$('#past7daysExpenses').css("color","blue");	}
						
						$('#thisMonthExpenses').text($('#thisMonthExpenses').html() + "-" + expensesThisMonth + " MKD");
						if(expensesThisMonth > 0) {	$('#thisMonthExpenses').css("color","red");	} else {$('#thisMonthExpenses').css("color","blue");	}
						
						$('#thisYearExpenses').text($('#thisYearExpenses').html() + "-" + expensesThisYear + " MKD");
						if(expensesThisYear > 0) {	$('#thisYearExpenses').css("color","red");	} else {$('#thisYearExpenses').css("color","blue");	}

						$('#totalExpenses').text($('#totalExpenses').html() + "-" + expensesTotal + " MKD");
						if(expensesTotal > 0) {	$('#totalExpenses').css("color","red");	} else {$('#totalExpenses').css("color","blue");	}
					
						totalTodaySum = parseInt(totalTodaySum) - parseInt(expensesToday);
						total7daysSum = parseInt(total7daysSum) - parseInt(expenses7days);
						totalThisMonthSum = parseInt(totalThisMonthSum) - parseInt(expensesThisMonth);
						totalThisYearSum = parseInt(totalThisYearSum) - parseInt(expensesThisYear);
						totalSum = parseInt(totalSum) - parseInt(expensesTotal);
						
						var signToday = "";	var sign7days = "";	var signMonth = "";	var signYear = "";	signTotal = "";
						if(parseInt(totalTodaySum) >= 0)	{	signToday = "+";	}
						if(parseInt(total7daysSum) >= 0)	{	sign7days = "+";	}
						if(parseInt(totalThisMonthSum) >= 0){	signMonth = "+";	}
						if(parseInt(totalThisYearSum) >= 0)	{	signYear = "+";		}
						if(parseInt(totalSum) >= 0)			{	signTotal = "+";	}

						$('#todaySum').text(signToday + totalTodaySum + " MKD");
						if((parseFloat(signToday + totalTodaySum)) > 0) {	
							$('#todaySum').css("color","green");
						} else if((parseFloat(signToday + totalTodaySum)) < 0) {		
							$('#todaySum').css("color","red");	
						} else {
							$('#todaySum').css("color","blue");	
							if(($('#todaySum').text()[0] == "+") || ($('#todaySum').text()[0] == "-")){
								$('#todaySum').html("&nbsp0 MKD");
							}
						}
						
						$('#past7daysSum').text(sign7days + total7daysSum + " MKD");
						if((parseFloat(sign7days + total7daysSum)) > 0) {	
							$('#past7daysSum').css("color","green");
						} else if((parseFloat(sign7days + total7daysSum)) < 0) {		
							$('#past7daysSum').css("color","red");	
						} else {
							$('#past7daysSum').css("color","blue");
							if(($('#past7daysSum').text()[0] == "+") || ($('#past7daysSum').text()[0] == "-")){
								$('#past7daysSum').html("&nbsp0 MKD");
							}
						}
						
						$('#thisMonthSum').text(signMonth + totalThisMonthSum + " MKD");
						if((parseFloat(signMonth + totalThisMonthSum)) > 0) {	
							$('#thisMonthSum').css("color","green");
						} else if((parseFloat(signMonth + totalThisMonthSum)) < 0) {		
							$('#thisMonthSum').css("color","red");	
						} else {
							$('#thisMonthSum').css("color","blue");
							if(($('#thisMonthSum').text()[0] == "+") || ($('#thisMonthSum').text()[0] == "-")){
								$('#thisMonthSum').html("&nbsp0 MKD");
							}
						}
						
						$('#thisYearSum').text(signYear + totalThisYearSum + " MKD");
						if((parseFloat(signYear + totalThisYearSum)) > 0) {	
							$('#thisYearSum').css("color","green");
						} else if((parseFloat(signYear + totalThisYearSum)) < 0) {		
							$('#thisYearSum').css("color","red");	
						} else {
							$('#thisYearSum').css("color","blue");
							if(($('#thisYearSum').text()[0] == "+") || ($('#thisYearSum').text()[0] == "-")){
								$('#thisYearSum').html("&nbsp0 MKD");
							}
						}

						$('#totalSum').text(signTotal + totalSum + " MKD");
						if((parseFloat(signTotal + totalSum)) > 0) {	
							$('#totalSum').css("color","green");
						} else if((parseFloat(signTotal + totalSum)) < 0) {		
							$('#totalSum').css("color","red");	
						} else {
							$('#totalSum').css("color","blue");
							if(($('#totalSum').text()[0] == "+") || ($('#totalSum').text()[0] == "-")){
								$('#totalSum').html("&nbsp0 MKD");
							}
						}
					}
				}
			}
			
			if (countTestExpenses == numItemsExpensesCount)   {
																/*var dbCLOSE;
																dbCLOSE = request.result;
																dbCLOSE.close();*/
															}
		}
			
		numItemsExpenses.onerror = function(evt) { var numItemsExpensesCount = 0; }
	};
	
	request.onerror = html5rocks.indexedDB.onerror;
};

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