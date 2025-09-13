const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

let transactions = [];

const categories = {
  income: ["Salary", "Freelance", "Other"],
  expense: ["Food", "Transport", "Shopping", "Entertainment", "Other"]
};

typeInput.addEventListener("change", () => {
  categoryInput.innerHTML = '<option value="" disabled selected>Select Category</option>';
  categories[typeInput.value].forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryInput.appendChild(option);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  if (!description || !amount || !type || !category) return;

  const transaction = { description, amount, type, category };
  transactions.push(transaction);
  updateUI();

  descriptionInput.value = "";
  amountInput.value = "";
  typeInput.value = "";
  categoryInput.innerHTML = '<option value="" disabled selected>Select Category</option>';
});

function updateUI() {
  transactionList.innerHTML = "";
  let totalIncome = 0, totalExpense = 0;

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `${t.description} (${t.category}) <span class="${t.type}">₹${t.amount}</span>`;
    transactionList.appendChild(li);

    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  const balance = totalIncome - totalExpense;
  totalIncomeEl.textContent = `₹${totalIncome}`;
  totalExpenseEl.textContent = `₹${totalExpense}`;
  balanceEl.textContent = `₹${balance}`;

  updateChart(totalIncome, totalExpense);
}

let chart = null;
function updateChart(income, expense) {
  const ctx = document.getElementById("pieChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#e91e63", "#f8bbd0"]
      }]
    }
  });
}

