const DEMO_CARD_NUMBER = "4111111111111111";
const DEMO_PIN = "1234";

let balanceInCents = 245075;
let transactionCount = 0;

const loginPanel = document.querySelector("#login-panel");
const accountPanel = document.querySelector("#account-panel");
const loginForm = document.querySelector("#login-form");
const cardInput = document.querySelector("#card-number");
const pinInput = document.querySelector("#pin");
const loginMessage = document.querySelector("#login-message");
const transactionMessage = document.querySelector("#transaction-message");
const amountInput = document.querySelector("#amount");

function formatMoney(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}

function showBalance() {
	document.querySelector("#balance").textContent = formatMoney(balanceInCents);
}

cardInput.addEventListener("input", () => {
	const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
	cardInput.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});

pinInput.addEventListener("input", () => {
	pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4);
});

loginForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const enteredCard = cardInput.value.replace(/\D/g, "");

	if (enteredCard !== DEMO_CARD_NUMBER || pinInput.value !== DEMO_PIN) {
		loginMessage.textContent = "Those details don't match the demo account. Check the sample credentials and try again.";
		return;
	}

	loginMessage.textContent = "";
	loginPanel.hidden = true;
	accountPanel.hidden = false;
	showBalance();
});

function transact(direction) {
	const amount = Number(amountInput.value);
	const cents = Math.round(amount * 100);
	transactionMessage.textContent = "";

	if (!Number.isFinite(amount) || cents < 1) {
		transactionMessage.textContent = "Enter an amount greater than $0.00.";
		amountInput.focus();
		return;
	}

	if (direction === "withdraw" && cents > balanceInCents) {
		transactionMessage.textContent = "That amount is greater than your available balance.";
		return;
	}

	balanceInCents += direction === "deposit" ? cents : -cents;
	transactionCount += 1;
	showBalance();
	transactionMessage.style.color = "#16634f";
	transactionMessage.textContent = `${formatMoney(cents)} ${direction === "deposit" ? "deposited" : "withdrawn"} successfully.`;
	document.querySelector("#activity-count").textContent = `${transactionCount} ${transactionCount === 1 ? "transaction" : "transactions"}`;
	amountInput.value = "";
}

document.querySelector("#withdraw-button").addEventListener("click", () => transact("withdraw"));
document.querySelector("#deposit-button").addEventListener("click", () => transact("deposit"));

document.querySelector("#logout-button").addEventListener("click", () => {
	accountPanel.hidden = true;
	loginPanel.hidden = false;
	loginForm.reset();
	loginMessage.textContent = "";
	transactionMessage.textContent = "";
});
