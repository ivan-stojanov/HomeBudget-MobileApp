localStorage["openedDB"] = "MyTestDatabase";
//var version = 3;
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

//var getAccountID = getUrlVars()["id"];
//var getAccountID = localStorage["clickedID"];
var getAccountID = sessionStorage.getItem("accountClickedID");
if(getAccountID == null) {
	getAccountID = 1;
}
var getAccountName = sessionStorage.getItem("accountClickedName");

function init() {
													//alert("function init");
	html5rocks.indexedDB.open();	// open displays the data previously saved
}
window.addEventListener("DOMContentLoaded", init, false);

var html5rocks = {};
html5rocks.indexedDB = {};
var store;
html5rocks.indexedDB.db = null;

html5rocks.indexedDB.onerror = function(e) {
	alert("html5rocks.indexedDB.onerror");
	console.log(e);
};
//alert("accountsList2.js");
html5rocks.indexedDB.open = function() {	 

	var openedDB = localStorage["openedDB"];	
	var request = indexedDB.open(openedDB/*, version*/);  
	// We can only create Object stores in a versionchange transaction.
	request.onupgradeneeded = function(e) {  
		//alert("request onupgradeneeded"); 
	};
	request.onsuccess = function(e) {

		html5rocks.indexedDB.db = e.target.result;
		var dbS = e.target.result;

		if(dbS.objectStoreNames.contains("accounts")) {
			//dbS.deleteObjectStore("accounts");
			//store = dbS.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}
		else {
			var storeS = html5rocks.indexedDB.db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
		}			
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");		
		//here we call initial pages
		updateAccountsList(store);
		updateAccountDetails(getAccountID);
		updateAccountDetailsEdit(getAccountID);	
	};
	request.onerror = html5rocks.indexedDB.onerror;
};



function updateAccountsList(store)
{
	$('#accountsListUL').empty();
	// Get everything in the store;
	var openedIndex = store.index("by_accountName");
	var numItemsRequesr = openedIndex.count();	
	var countTest = 0;	var classUnderline = "";
	var cashOnHandID = "";	var cashOnHandAccName;	var cashOnHandColor;	var cashOnHandClass;
	var cashOnHandSign;		var cashOnHandMoney;	var cashOnHandUnderline;
	var creditCardID = "";	var creditCardAccName;	var creditCardColor;	var creditCardClass;
	var creditCardSign;		var creditCardMoney;	var creditCardUnderline;
	var bankAccountID = "";	var bankAccountAccName;	var bankAccountColor;	var bankAccountClass;
	var bankAccountSign;	var bankAccountMoney;	var bankAccountUnderline;
	//we need numItems because we need to find last item in the cursor and add the class "last child" so that is underlined
	numItemsRequesr.onsuccess = function(evt) {  
		var deleteBankAccount = 2;	var deleteCreditCard = 1;	var deleteCashOnHand = 0;
		var currentCashOnHandBalance = 0;	var currentCreditCardBalance = 0;	var currentBankAccountBalance = 0;
		var numItems = evt.target.result;	
		var countDeleteDefaults = 3;
		if (openedIndex) {
			var curCursor = openedIndex.openCursor(/*null, "prev"*/);				
			curCursor.onsuccess = function(evt) {					
				var cursor = evt.target.result;					
				if (cursor) {
					countTest++;						
					if(cursor.value.id > 3) {
						if (countTest == numItems) { classUnderline = " ui-last-child"; } else { classUnderline = ""; }
						
						var currentClass = (cursor.value.accountName).toLowerCase().replace(" ","");
						var currentColor = setStyleColor(cursor.value.accountBalance);	//function defined below
						var sign = "";
						if(cursor.value.accountBalance > 0) {	sign = "+ ";	}
						
						$('#accountsListUL').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + classUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accounts.html#accountDetails" onclick="callFunction('+ cursor.value.id + ',\'' + cursor.value.accountName + '\'' + ')" class="ui-link-inherit">' + cursor.value.accountName + '<label style="color:' + currentColor + '" class="rightSide ' + currentClass + 'Style">' + sign + cursor.value.accountBalance + ' MKD</label>' + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
						
					} else if(cursor.value.id == 1) {
						deleteCashOnHand = 4;
						currentCashOnHandBalance = cursor.value.accountBalance;
						cashOnHandUnderline = classUnderline;
						cashOnHandID = cursor.value.id;
						cashOnHandAccName = cursor.value.accountName;
						cashOnHandClass = "cashonhandStyle";
						cashOnHandMoney = cursor.value.accountBalance;
						if(cashOnHandMoney >  0) {	cashOnHandSign = "+";	} else { cashOnHandSign = ""; }
						cashOnHandColor = setStyleColor(cashOnHandMoney);	//function defined below
					} else if(cursor.value.id == 2) {
						deleteCreditCard = 4;
						currentCreditCardBalance = cursor.value.accountBalance;
						creditCardUnderline = classUnderline;
						creditCardID = cursor.value.id;
						creditCardAccName = cursor.value.accountName;
						creditCardClass = "creditcardStyle";
						creditCardMoney = cursor.value.accountBalance;
						if(creditCardMoney >  0) {	creditCardSign = "+";	} else { creditCardSign = ""; }
						creditCardColor = setStyleColor(creditCardMoney);	//function defined below
					} else if(cursor.value.id == 3) {
						deleteBankAccount = 4;
						currentBankAccountBalance = cursor.value.accountBalance;
						bankAccountUnderline = classUnderline;
						bankAccountID = cursor.value.id;
						bankAccountAccName = cursor.value.accountName;
						bankAccountClass = "bankaccountStyle";
						bankAccountMoney = cursor.value.accountBalance;
						if(bankAccountMoney >  0) {	bankAccountSign = "+";	} else { bankAccountSign = ""; }
						bankAccountColor = setStyleColor(bankAccountMoney);	//function defined below
					}
					cursor.continue();
				} else {
					if(cashOnHandID != "") {				
						$('#accountsListUL').prepend('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + cashOnHandUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accounts.html#accountDetails" onclick="callFunction('+ cashOnHandID + ',\'' + cashOnHandAccName + '\'' + ')" class="ui-link-inherit">' + cashOnHandAccName + '<label style="color:' + cashOnHandColor + '" class="rightSide ' + cashOnHandClass + 'Style">' + cashOnHandSign + cashOnHandMoney + ' MKD</label>' + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
					}
					if(creditCardID != "") {
						$('#accountsListUL').prepend('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + creditCardUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accounts.html#accountDetails" onclick="callFunction('+ creditCardID + ',\'' + creditCardAccName + '\'' + ')" class="ui-link-inherit">' + creditCardAccName + '<label style="color:' + creditCardColor + '" class="rightSide ' + creditCardClass + 'Style">' + creditCardSign + creditCardMoney + ' MKD</label>' + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
					}
					if(bankAccountID != "") {					
						$('#accountsListUL').prepend('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c' + bankAccountUnderline + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="accounts.html#accountDetails" onclick="callFunction('+ bankAccountID + ',\'' + bankAccountAccName + '\'' + ')" class="ui-link-inherit">' + bankAccountAccName + '<label style="color:' + bankAccountColor + '" class="rightSide ' + bankAccountClass + 'Style">' + bankAccountSign + bankAccountMoney + ' MKD</label>' + '</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
					}
			/*
					var setStyle;	var sign = "";
					//alert("bank: " + deleteBankAccount + ", credit: " + deleteCreditCard + ", cash: " + deleteCashOnHand);
					if(deleteBankAccount < 4) {
//						$("#accountsListUL").children().eq(deleteBankAccount).remove(); //3. Bank(2)
					} else {
						setStyle = document.getElementsByClassName("bankaccountStyle")[0];
						if(currentBankAccountBalance >  0) {	sign = "+";	}
						setStyle.innerHTML = sign + currentBankAccountBalance + " MKD";
						setStyle.style.color = setStyleColor(currentBankAccountBalance);	//function defined below
					}
					if(deleteCreditCard < 4) {
//						$("#accountsListUL").children().eq(deleteCreditCard).remove(); //2. Credit(1)
					} else {
						setStyle = document.getElementsByClassName("creditcardStyle")[0];
						if(currentCreditCardBalance >  0) {	sign = "+";	}
						setStyle.innerHTML = sign + currentCreditCardBalance + " MKD";
						setStyle.style.color = setStyleColor(currentCreditCardBalance);	//function defined below
					}
					if(deleteCashOnHand < 4) {
//						$("#accountsListUL").children().eq(deleteCashOnHand).remove(); //1. Cash(0)
					} else {
						setStyle = document.getElementsByClassName("cashonhandStyle")[0];
						if(currentCashOnHandBalance >  0) {	sign = "+";	}
						setStyle.innerHTML = sign + currentCashOnHandBalance + " MKD";
						setStyle.style.color = setStyleColor(currentCashOnHandBalance);	//function defined below
					}
			*/
				}
			}
		}
		if (countTest == numItems)  {
									} 			
	}
		
	numItemsRequesr.onerror = function(evt) { var numItems = 0; }
}





function callFunction(getAccountID,getAccountName) {
	var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
	//localStorage["incomeClickedID"] = getAccountID;		//alert("id: " + getAccountID); 
	sessionStorage.setItem("accountClickedID", getAccountID);
	sessionStorage.setItem("accountClickedName", getAccountName);
	updateAccountDetails(getAccountID);
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

function formatDate(enteredDate){
	var dateArray = enteredDate.split('-');
	if(dateArray.length == 3) {
		return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
	} else {
		return "";
	}
}

/* 	Account Details - Start	2.js	*/
var getAccountIDeAccountDetails;
	function updateAccountDetails(getAccountID) {
		getAccountIDeAccountDetails = getAccountID;
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var requestID = store.get(parseInt(getAccountID));		
		// Get everything in the store;	
		requestID.onsuccess = function(e) {	
			var result = event.target.result;
			if(!!result == false){/*alert(result);*/}
			
			$('#accName').text(result.accountName);
			$('#accNameValue').attr("value",result.accountName);
			$('#accType').text(result.accountType);
			$('#accBalance').text(result.accountBalance);
			$('#accDate').text(result.accountDate);
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
	}
	
	$( document ).ready(function() {
		var getAccountIDAccDet = getAccountIDeAccountDetails;
		$(".confirmDelete").on("click", function(event){
			if(confirm("Are you sure you want to delete this account?")){	
				var html5rocks = {};
				html5rocks.indexedDB = {};
				html5rocks.indexedDB.db = null;

				var openedDB = localStorage["openedDB"];	
				var requestDelete = indexedDB.open(openedDB);	
					requestDelete.onsuccess = function(e) {  
						html5rocks.indexedDB.db = e.target.result;
						var storeDelete = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
						storeDelete.delete(parseInt(sessionStorage.getItem("accountClickedID")));
						updateAccountsList(storeDelete);
						alert("This account is deleted!");
						return true;
					}
					
					requestDelete.onerror = function(e) {
						alert('request.onerror!');
					}	
					//return true;
			} else {
				event.preventDefault();
				return false;
			}
		});
		
		$("#editThisAcc").on("click", function(event){
			updateAccountDetailsEdit(sessionStorage.getItem("accountClickedID"));
		});
		
		$("#addIncomeAcc").on("click", function(event){
			window.location.href = "incomeAdd.html?accountIncomeStart=" + getAccountName;
		});
		
		$("#addExpenseAcc").on("click", function(event){
			window.location.href = "expenseAdd.html?accountExpenseStart=" + getAccountName;
		});
	});
/* 	Account Details - End	2.js	*/
/* 	Account Details Edit - Start	2.js	*/
var getAccountIDeAccountDetailsEdit;
	function updateAccountDetailsEdit(getAccountID) {
		getAccountIDeAccountDetailsEdit = getAccountID;
		var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");
		var requestIDEdit = store.get(parseInt(getAccountID));			
		// Get everything in the store;	
		requestIDEdit.onsuccess = function(event) {	
			var result = event.target.result;
			if(!!result == false){/*alert(result);*/}				
			$('#accNameEdit').text(result.accountName);
			$('#accNameValue').attr("value",result.accountName);
			if(getAccountID > 3) {
				//if we have account that we created than we can change the name
				$('#accNameEdit').hide();
				$('#accNameValue').parent().show();
			} else {
				//we can not change account name of the first 3 accounts
				$('#accNameEdit').show();
				$('#accNameValue').parent().hide();
			}
			//$('#accType').text(result.accountType);
			$('#accTypeValue').attr("value",result.accountType);
			//$('#accBalance').text(result.accountBalance);
			$('#accBalanceValue').attr("value",result.accountBalance);
			$('#accDateEdit').text(result.accountDate);
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
	}

	$( document ).ready(function() {
		$("#saveAcc").on("click", function(event){
		var getAccountIDAccDetEdit = getAccountIDeAccountDetailsEdit;
			if(confirm("Are you sure you want to update this account?")){	
				var html5rocks = {};
				html5rocks.indexedDB = {};
				html5rocks.indexedDB.db = null;
				var modifyAccountObject;
				
				var openedDB = localStorage["openedDB"];	
				var requestEdit = indexedDB.open(openedDB);	
					requestEdit.onsuccess = function(e) {  
						html5rocks.indexedDB.db = e.target.result;
						var storeEdit = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	

						modifyAccountObject =  { 
							accountName: $("#accNameValue").val(),
							accountType: $("#accTypeValue").val(),
							accountBalance: $("#accBalanceValue").val(),
							accountDate: $("#accDateEdit").html(),
							id: parseInt(getAccountIDAccDetEdit)
						};
						
						storeEdit.delete(parseInt(modifyAccountObject.id));
						storeEdit.add(modifyAccountObject);
						
						if(getAccountName != $("#accNameValue").val()) {
							//alert("name changed we should update this account name at all places");
							//update all incomes
							var storeEditIncomes = html5rocks.indexedDB.db.transaction(["incomes"], "readwrite").objectStore("incomes");
							var openedIndexIncomes = storeEditIncomes.index("by_incomeAccount");
							var numItemsIncomes = openedIndexIncomes.count();	
							var countTestIncomes = 0;
							numItemsIncomes.onsuccess = function(evt) {   		
								var numItemsIn = evt.target.result;
								var range = IDBKeyRange.only(getAccountName);
								if (openedIndexIncomes) {
									var curCursorIncomes = openedIndexIncomes.openCursor(range);		
									curCursorIncomes.onsuccess = function(evt) {
										var cursorIncomeAccount = evt.target.result;
										if (cursorIncomeAccount) {
											countTestIncomes++;
											//here we update income //alert("Income: " + countTestIncomes);
											var objIncomeAccount =  { 
												incomeName: cursorIncomeAccount.value.incomeName,
												incomeAmmount: cursorIncomeAccount.value.incomeAmmount,
												incomeAccount: $("#accNameValue").val(),
												incomeCategory: cursorIncomeAccount.value.incomeCategory,
												incomeDueDate: cursorIncomeAccount.value.incomeDueDate,
												incomeRepeatCycle: cursorIncomeAccount.value.incomeRepeatCycle,
												incomeRepeatEndDate: cursorIncomeAccount.value.incomeRepeatEndDate,
												incomeRepeat: cursorIncomeAccount.value.incomeRepeat,
												incomeRepeatLastUpdate: cursorIncomeAccount.value.incomeRepeatLastUpdate,
												incomeCreated: cursorIncomeAccount.value.incomeCreated,
												incomeNumItems: cursorIncomeAccount.value.incomeNumItems,
												id: cursorIncomeAccount.value.id
											};
											storeEditIncomes.delete(parseInt(objIncomeAccount.id));
											storeEditIncomes.add(objIncomeAccount);
											cursorIncomeAccount.continue();
										} else {
											//update all expenses
											var storeEditExpenses = html5rocks.indexedDB.db.transaction(["expenses"], "readwrite").objectStore("expenses");
											var openedIndexExpenses = storeEditExpenses.index("by_expenseAccount");
											var numItemsExpenses = openedIndexExpenses.count();	
											var countTestExpenses = 0;
											numItemsExpenses.onsuccess = function(evt) {   		
												var numItemsEx = evt.target.result;
												var rangeEx = IDBKeyRange.only(getAccountName);
												if (openedIndexExpenses) {
													var curCursorExpenses = openedIndexExpenses.openCursor(rangeEx);		
													curCursorExpenses.onsuccess = function(evt) {
														var cursorExpenseAccount = evt.target.result;
														if (cursorExpenseAccount) {
															countTestExpenses++;
															//here we update expense //alert("Expense: " + countTestExpenses);
															var objExpenseAccount =  { 
																expenseName: cursorExpenseAccount.value.expenseName,
																expenseAmmount: cursorExpenseAccount.value.expenseAmmount,
																expenseAccount: $("#accNameValue").val(),
																expenseCategory: cursorExpenseAccount.value.expenseCategory,
																expenseDueDate: cursorExpenseAccount.value.expenseDueDate,
																expenseRepeatCycle: cursorExpenseAccount.value.expenseRepeatCycle,
																expenseRepeatEndDate: cursorExpenseAccount.value.expenseRepeatEndDate,
																expenseRepeat: cursorExpenseAccount.value.expenseRepeat,
																expenseRepeatLastUpdate: cursorExpenseAccount.value.expenseRepeatLastUpdate,
																expenseCreated: cursorExpenseAccount.value.expenseCreated,
																expenseNumItems: cursorExpenseAccount.value.expenseNumItems,
																expenseBillPaid: cursorExpenseAccount.value.expenseBillPaid,
																id: cursorExpenseAccount.value.id
															};
															storeEditExpenses.delete(parseInt(objExpenseAccount.id));
															storeEditExpenses.add(objExpenseAccount);
															cursorExpenseAccount.continue();
														} else {
															sessionStorage.setItem("accountClickedName", $("#accNameValue").val());
															alert("This account is updated!");
															updateAccountDetails(getAccountIDAccDetEdit)
															window.location.href = "accounts.html#accountDetails";
															return true;
														}
													}
												}
											}
											numItemsExpenses.onerror = function(evt) { var numItemsEx = 0; }
										}
									}
								}
							}	
							numItemsIncomes.onerror = function(evt) { var numItemsIn = 0; }
						} else {
							//alert("name no changed");
							sessionStorage.setItem("accountClickedName", $("#accNameValue").val());
							alert("This account is updated!");
							updateAccountDetails(getAccountIDAccDetEdit)
							window.location.href = "accounts.html#accountDetails";
							return true;
						}					
					}
					
					requestEdit.onerror = function(e) {
						alert('request.onerror!');
					}				
			} else {
				event.preventDefault();
				return false;
			}
		});
	});
/* 	Account Details Edit - End	2.js	*/
/* 	Account Add - Start	2.js	*/
	function funcAccountAdd() {
		var openedDB;
		var request;
		var accountDate = formatDate($("#accountDate").val());
		var obj =  { 
				accountName: $("#accountName").val(),
				accountType: $("#accountType").val(),
				accountBalance: $("#accountBalance").val(),
				accountDate: accountDate
			};				
		var html5rocks = {};
		html5rocks.indexedDB = {};
		html5rocks.indexedDB.db = null;
		openedDB = localStorage["openedDB"];	
		request = indexedDB.open(openedDB);		
		
		request.onsuccess = function(e) {
			html5rocks.indexedDB.db = e.target.result;			
			var store = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");	
			store.add(obj);
		/*	// now let's close the database again!
			var dbCLOSE;
			dbCLOSE = request.result;
			dbCLOSE.close();
		*/
			updateAccountsList(store);
			window.location.href = "./accounts.html#accountsList";
		};
		
		request.onupgradeneeded = function(e) {  
	//		alert('request.onupgradeneeded!');
		}
		
		request.onerror = function(e) {
			alert('request.onerror!');
		}	
	}
	$(document).ready(function() {
		$("#save").on("click", function(event){	
			if(($('#accountName').val().length > 0) && ($('#accountType').val().length > 0) && ($('#accountBalance').val().length > 0) && ($('#accountDate').val().length > 0)){

				if(confirm("Are you sure you want to create this account?")){	
//					alert();
					funcAccountAdd();				
				} else {
					event.preventDefault();
					return false;
				}
				
			} else {	
				alert('Please fill all fields');
				return false;
			} 
		});
		
		$("#createNewAccBtn").on("click", function(event){
			$("#accountName").val("");
			$("#accountType").val("");
			$("#accountBalance").val("");
			$("#accountDate").val("");
		});
	});	
/* 	Account Add - End	2.js	*/

	$(document).ready(function() {
		$(".back-btn").on("click", function(event){		
	//		alert("back");
			var storeAccounts = html5rocks.indexedDB.db.transaction(["accounts"], "readwrite").objectStore("accounts");		
			updateAccountsList(storeAccounts);
	//		updateAccountDetails(getAccountID);
	//		updateAccountDetailsEdit(getAccountID);
		});
	});	