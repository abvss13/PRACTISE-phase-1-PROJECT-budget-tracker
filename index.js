const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const transactionsListEl = document.getElementById("transactions-list");
const addTransactionFormEl = document.getElementById("addtransaction");
const categoryInputEl = document.getElementById("category");
const amountInputEl = document.getElementById("amount");

let transactions = [] ;

function calculateBalance(exchangeRate) {
    let total = 0;
    let income = 0;
    let expenses = 0;
    for (let transaction of transactions) {
      total += transaction.amount * exchangeRate[transaction.currency];
      if (transaction.amount > 0) {
        income += transaction.amount * exchangeRate[transaction.currency];
      } else {
        expenses += transaction.amount * exchangeRate[transaction.currency];
      }
    }
    balanceEl.textContent = `$${(total / exchangeRate.USD).toFixed(2)}`;
  incomeEl.textContent = `$${(income / exchangeRate.USD).toFixed(2)}`;
  expensesEl.textContent = `$${Math.abs(expenses / exchangeRate.USD).toFixed(2)}`;
}

function renderTransactions() {
    transactionsListEl.innerHTML = ""; 
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      let li = document.createElement("li");
      li.innerHTML = `${transaction.category}: ${transaction.currency} ${transaction.amount.toFixed(2)} <button class="delete" data-index="${i}">Delete</button>`;
      transactionsListEl.appendChild(li);
    }
    calculateBalance(exchangeRate);
  }

  let url = "https://v6.exchangerate-api.com/v6/15cfd02f9c537f84a4c24f5d/latest/USD";
function fetchExchangeRate() {
    fetch(url, { method: "GET" })
    .then(response => response.json())
    .then(data => {
      exchangeRate = data.conversion_rates;
      renderTransactions();
    })
    .catch(error => console.log(error));
}

let exchangeRate = {};
fetchExchangeRate(); 

addTransactionFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    let category = categoryInputEl.value.trim();
    let currency = "USD";
    let amount = parseFloat(amountInputEl.value.trim());
    if (category && amount) {
      transactions.push({category: category, currency: currency, amount: amount}); // add the new transaction to the transactions array
      categoryInputEl.value = "";
      amountInputEl.value = "";
      renderTransactions();
    }
  });