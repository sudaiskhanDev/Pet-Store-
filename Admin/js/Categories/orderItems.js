let orderItems = [];
let editItemId = null;

const orderIdInput = document.getElementById('orderId');
const productIdInput = document.getElementById('productId');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const saveBtn = document.getElementById('saveBtn');
const tableBody = document.getElementById('orderItemsTableBody');
const errorMsg = document.getElementById('errorMsg');

const API_BASE = "http://localhost:8000/api/order-items";

// Create row
function createRow(item) {
    const template = tableBody.querySelector('tr');
    const tr = template.cloneNode(true);

    tr.dataset.id = item.order_item_id;

    tr.querySelector('.td-id').textContent = item.order_item_id;
    tr.querySelector('.td-order').textContent = item.order_id;
    tr.querySelector('.td-product').textContent = item.product_id;
    tr.querySelector('.td-quantity').textContent = item.quantity;
    tr.querySelector('.td-price').textContent = item.price;

    const editBtn = tr.querySelector('.edit');
    const deleteBtn = tr.querySelector('.delete');

    editBtn.replaceWith(editBtn.cloneNode(true));
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));

    tr.querySelector('.edit').addEventListener('click', () => editItem(item.order_item_id));
    tr.querySelector('.delete').addEventListener('click', () => deleteItem(item.order_item_id));

    return tr;
}

// Fetch data
async function fetchItems() {
    const res = await fetch(API_BASE);
    orderItems = await res.json();

    tableBody.querySelectorAll('tr:not([data-id=""])').forEach(r => r.remove());

    orderItems.forEach(item => {
        const tr = createRow(item);
        tableBody.appendChild(tr);
    });
}

// Save / Update
saveBtn.addEventListener('click', async () => {

    const payload = {
        order_id: parseInt(orderIdInput.value),
        product_id: parseInt(productIdInput.value),
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value)
    };

    if (!payload.order_id || !payload.product_id || !payload.quantity || isNaN(payload.price)) {
        errorMsg.textContent = "Fill all fields correctly";
        return;
    }

    errorMsg.textContent = "";

    if (editItemId) {
        await fetch(`${API_BASE}/${editItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    resetForm();
    fetchItems();
});

// Edit
function editItem(id) {
    const item = orderItems.find(i => i.order_item_id === id);

    orderIdInput.value = item.order_id;
    productIdInput.value = item.product_id;
    quantityInput.value = item.quantity;
    priceInput.value = item.price;

    editItemId = id;
    saveBtn.textContent = "Update";
}

// Delete
async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;

    await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });

    fetchItems();
}

// Reset
function resetForm() {
    orderIdInput.value = "";
    productIdInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";
    editItemId = null;
    saveBtn.textContent = "Save";
}

// Init
fetchItems();