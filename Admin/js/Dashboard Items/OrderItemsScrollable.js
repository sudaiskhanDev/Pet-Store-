document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "http://localhost:8000/api";
    const ORDER_ITEMS_API = `${API_BASE}/order-items`;

    const container = document.querySelector(".order-items-list");

    if (!container) {
        console.error("order-items-list not found");
        return;
    }

    async function loadOrderItems() {

        container.innerHTML = "<p>Loading...</p>";

        try {
            const res = await fetch(ORDER_ITEMS_API);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            const response = await res.json();
            const items = response.data;

            if (!Array.isArray(items) || items.length === 0) {
                container.innerHTML = "<p>No order items found</p>";
                return;
            }

            container.innerHTML = "";

            items.forEach(item => {

                const product = item.product;

                // ✅ FIX IMAGE URL HERE
                const imageSrc = product?.image
                    ? `http://localhost:8000/storage/${product.image}`
                    : "https://via.placeholder.com/60";

                const div = document.createElement("div");
                div.classList.add("order-item");

                div.innerHTML = `
                    <div class="item-card">

                        <img 
                            src="${imageSrc}" 
                            alt="${product?.name || 'No Image'}" 
                            class="product-img"
                            onerror="this.src='https://via.placeholder.com/60'"
                        />

                        <div class="details">
                            <h4>${product?.name || "No Product Name"}</h4>
                            <p><b>Order ID:</b> ${item.order_id}</p>
                            <p><b>Quantity:</b> ${item.quantity}</p>
                            <p><b>Price:</b> $${item.price}</p>
                        </div>

                    </div>
                `;

                container.appendChild(div);
            });

        } catch (err) {
            console.error(err);
            container.innerHTML = "<p style='color:red;'>Failed to load order items</p>";
        }
    }

    loadOrderItems();
});