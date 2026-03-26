// API URL
const ORDERS_API_BASE = "http://localhost:8000/api";
const ORDERS_API = `${ORDERS_API_BASE}/orders`;

// Select the orders container
const ordersDiv = document.querySelector(".orders-list");

// Fetch and display orders in scrollable box
async function fetchOrdersScrollable() {
    try {
        const res = await fetch(ORDERS_API);
        const orders = await res.json();

        // Clear previous content
        ordersDiv.innerHTML = "";

        // Loop through orders
        orders.forEach(order => {
            const div = document.createElement("div");
            div.classList.add("order-item");
            div.textContent = `Order #${order.order_id} - ${order.user.name} - $${order.total_amount}`;
            ordersDiv.appendChild(div);
        });

    } catch (err) {
        ordersDiv.innerHTML = "<p>Failed to load orders</p>";
        console.error(err);
    }
}

// Initial call
fetchOrdersScrollable();rs