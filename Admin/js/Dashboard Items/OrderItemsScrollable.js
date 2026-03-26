// Use existing API_BASE to avoid conflicts
const ORDER_ITEMS_API = `${API_BASE}/order-items`;

// Select container
const orderItemsDiv = document.querySelector(".order-items-list");

// Fetch and display order items
async function fetchOrderItemsScrollable() {
    try {
        const res = await fetch(ORDER_ITEMS_API);
        const items = await res.json();

        orderItemsDiv.innerHTML = ""; // clear old items

        items.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("order-item");
            div.textContent = `Item #${item.order_item_id} - Order #${item.order_id} - Product #${item.product_id} - Qty: ${item.quantity} - $${item.price}`;
            orderItemsDiv.appendChild(div);
        });

    } catch (err) {
        orderItemsDiv.innerHTML = "<p>Failed to load order items</p>";
        console.error(err);
    }
}

// Initial call
fetchOrderItemsScrollable();