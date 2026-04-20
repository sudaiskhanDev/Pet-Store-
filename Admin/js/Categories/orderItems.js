const API_BASE = "http://localhost:8000/api/order-items";
const ORDER_API = "http://localhost:8000/api/orders";
const PRODUCT_API = "http://localhost:8000/api/products";

const tableBody = document.getElementById("tableBody");
const orderDropdown = document.getElementById("order_id");
const productDropdown = document.getElementById("product_id");


// ================= INIT =================
fetchItems();
loadOrders();
loadProducts();


// ================= LOAD ORDERS DROPDOWN =================
async function loadOrders() {
    try {
        const res = await fetch(ORDER_API);
        const response = await res.json();

        // ✅ FIX: safe extraction
        const orders = response.data || response.orders || response;

        if (!Array.isArray(orders)) return;

        orderDropdown.innerHTML = `<option value="">Select Order</option>`;

        orders.forEach(order => {
            orderDropdown.innerHTML += `
                <option value="${order.order_id}">
                    Order #${order.order_id}
                </option>
            `;
        });

    } catch (error) {
        console.error("Order load error:", error);
    }
}


// ================= LOAD PRODUCTS DROPDOWN =================
async function loadProducts() {
    try {
        const res = await fetch(PRODUCT_API);
        const response = await res.json();

        // ✅ FIX: YOUR backend uses "products"
        const products = response.products || response.data || response;

        if (!Array.isArray(products)) return;

        productDropdown.innerHTML = `<option value="">Select Product</option>`;

        products.forEach(p => {
            productDropdown.innerHTML += `
                <option value="${p.product_id}">
                    ${p.name}
                </option>
            `;
        });

    } catch (error) {
        console.error("Product load error:", error);
    }
}


// ================= READ TABLE =================
async function fetchItems() {
    try {
        const res = await fetch(API_BASE);
        const response = await res.json();

        const items = response.data || response;

        if (!Array.isArray(items)) return;

        tableBody.innerHTML = "";

        items.forEach(item => {

            const productName = item.product?.name || "N/A";

            const productImage = item.product?.image
                ? `http://localhost:8000/storage/${item.product.image}`
                : "https://via.placeholder.com/50";

            tableBody.innerHTML += `
                <tr>
                    <td>${item.order_item_id}</td>
                    <td>${item.order_id}</td>
                    <td>${productName}</td>
                    <td>
                        <img src="${productImage}" width="50" height="50" style="object-fit:cover;">
                    </td>
                    <td>${item.quantity}</td>
                    <td>$ ${item.price}</td>
                    <td>
                        <button onclick='editItem(${JSON.stringify(item)})'>Edit</button>
                        <button onclick='deleteItem(${item.order_item_id})'>Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
}


// ================= CREATE / UPDATE =================
async function saveItem() {

    const id = document.getElementById("order_item_id").value;

    const data = {
        order_id: orderDropdown.value,
        product_id: productDropdown.value,
        quantity: document.getElementById("quantity").value,
        price: document.getElementById("price").value
    };

    let url = API_BASE;
    let method = "POST";

    if (id) {
        url = `${API_BASE}/${id}`;
        method = "PUT";
    }

    try {
        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        resetForm();
        fetchItems();

    } catch (error) {
        console.error("Save error:", error);
    }
}


// ================= EDIT =================
function editItem(item) {
    document.getElementById("order_item_id").value = item.order_item_id;
    orderDropdown.value = item.order_id;
    productDropdown.value = item.product_id;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
}


// ================= DELETE =================
async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;

    try {
        await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });

        fetchItems();

    } catch (error) {
        console.error("Delete error:", error);
    }
}


// ================= RESET =================
function resetForm() {
    document.getElementById("order_item_id").value = "";
    orderDropdown.value = "";
    productDropdown.value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
}