// Use existing API_BASE to avoid conflicts
const PAYMENTS_API = `${API_BASE}/payments`;

// Select the payments container
const paymentsDiv = document.querySelector(".payments-list");

// Fetch and display payments
async function fetchPaymentsScrollable() {
    try {
        const res = await fetch(PAYMENTS_API);
        const payments = await res.json();

        paymentsDiv.innerHTML = ""; // clear previous

        payments.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("payment-item");
            div.textContent = `Payment #${p.id} - Order #${p.order_id} - $${p.amount} - ${p.status}`;
            paymentsDiv.appendChild(div);
        });

    } catch (err) {
        paymentsDiv.innerHTML = "<p>Failed to load payments</p>";
        console.error(err);
    }
}

// Initial call
fetchPaymentsScrollable();