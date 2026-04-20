 

const API_BASE = "http://localhost:8000/api/order-items";
const tableBody = document.getElementById("tableBody");


// ================= READ =================
async function fetchItems() {
    try {
        const res = await fetch(API_BASE);
        const response = await res.json();

        console.log("API Response:", response);

        // ✅ handle both formats safely
        const items = Array.isArray(response) ? response : response.data;

        if (!Array.isArray(items)) {
            console.error("Invalid API response format:", response);
            return;
        }

        tableBody.innerHTML = "";

        items.forEach(item => {

            // ✅ SAFE PRODUCT NAME HANDLING
            const productName = item.product?.name || "N/A";

            tableBody.innerHTML += `
                <tr>
                    <td>${item.order_item_id}</td>
                    <td>${item.order_id}</td>
                    <td>${productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
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
        order_id: document.getElementById("order_id").value,
        product_id: document.getElementById("product_id").value,
        quantity: document.getElementById("quantity").value,
        price: document.getElementById("price").value
    };

    let url = API_BASE;
    let method = "POST";

    if (id) {
        url = `${API_BASE}/${id}`;
        method = "PUT";
    }

    await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    resetForm();
    fetchItems();
}


// ================= EDIT =================
function editItem(item) {
    document.getElementById("order_item_id").value = item.order_item_id;
    document.getElementById("order_id").value = item.order_id;
    document.getElementById("product_id").value = item.product_id;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
}


// ================= DELETE =================
async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;

    await fetch(`${API_BASE}/${id}`, {
        method: "DELETE"
    });

    fetchItems();
}


// ================= RESET =================
function resetForm() {
    document.getElementById("order_item_id").value = "";
    document.getElementById("order_id").value = "";
    document.getElementById("product_id").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
}


// INIT
fetchItems();

 