let orders = [];
const ordersTableBody = document.getElementById('ordersTableBody');
const templateRow = ordersTableBody.querySelector('.template');
const API_BASE = "http://localhost:8000/api/orders";

// Clone template row and populate table
function createOrderRow(order) {
    const tr = templateRow.cloneNode(true);
    tr.style.display = "table-row";
    tr.classList.remove('template');
    tr.dataset.id = order.order_id;

    tr.querySelector('.td-id').textContent = order.order_id;
    // Show user_id + user name
    tr.querySelector('.td-user').textContent = `${order.user_id} - ${order.user.name}`;
    tr.querySelector('.td-date').textContent = order.order_date;
    tr.querySelector('.td-status').textContent = order.status;
    tr.querySelector('.td-amount').textContent = order.total_amount;
    tr.querySelector('.td-payment').textContent = order.payment_method;
    tr.querySelector('.td-shipping').textContent = order.shipping_address;
    tr.querySelector('.td-phone').textContent = order.phone;

    // Add delete functionality
    const deleteBtn = tr.querySelector('.delete');
    deleteBtn.addEventListener('click', async () => {
        if (!confirm(`Are you sure you want to delete Order #${order.order_id}?`)) return;
        const res = await fetch(`${API_BASE}/${order.order_id}`, { method: 'DELETE' });
        if (res.ok) fetchOrders();
        else alert('Failed to delete order');
    });

    return tr;
}

// Fetch and render orders
async function fetchOrders() {
    try {
        const res = await fetch(API_BASE);
        orders = await res.json();

        // Clear old rows except template
        ordersTableBody.querySelectorAll('tr:not(.template)').forEach(r => r.remove());

        orders.forEach(order => {
            const tr = createOrderRow(order);
            ordersTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Initial load
fetchOrders();














// let orders = [];
// let editOrderId = null;

// const userIdInput = document.getElementById('userId');
// const orderDateInput = document.getElementById('orderDate');
// const statusInput = document.getElementById('status');
// const totalAmountInput = document.getElementById('totalAmount');
// const paymentMethodInput = document.getElementById('paymentMethod');
// const shippingAddressInput = document.getElementById('shippingAddress');
// const phoneInput = document.getElementById('phone');
// const saveBtn = document.getElementById('saveBtn');
// const ordersTableBody = document.getElementById('ordersTableBody');
// const errorMsg = document.getElementById('errorMsg');

// const API_BASE = "http://localhost:8000/api/orders";

// // Clone template row and populate
// function createOrderRow(order) {
//     const templateRow = ordersTableBody.querySelector('tr');
//     const tr = templateRow.cloneNode(true);
//     tr.dataset.id = order.order_id;

//     tr.querySelector('.td-id').textContent = order.order_id;
//     tr.querySelector('.td-user').textContent = order.user_id;
//     tr.querySelector('.td-date').textContent = order.order_date;
//     tr.querySelector('.td-status').textContent = order.status;
//     tr.querySelector('.td-amount').textContent = order.total_amount;
//     tr.querySelector('.td-payment').textContent = order.payment_method;
//     tr.querySelector('.td-shipping').textContent = order.shipping_address;
//     tr.querySelector('.td-phone').textContent = order.phone;

//     const editBtn = tr.querySelector('.edit');
//     const deleteBtn = tr.querySelector('.delete');

//     // Remove old listeners
//     editBtn.replaceWith(editBtn.cloneNode(true));
//     deleteBtn.replaceWith(deleteBtn.cloneNode(true));

//     tr.querySelector('.edit').addEventListener('click', () => editOrder(order.order_id));
//     tr.querySelector('.delete').addEventListener('click', () => deleteOrder(order.order_id));

//     return tr;
// }

// // Fetch and render orders
// async function fetchOrders() {
//     try {
//         const res = await fetch(API_BASE);
//         orders = await res.json();

//         // Clear all except template
//         ordersTableBody.querySelectorAll('tr:not([data-id=""])').forEach(r => r.remove());

//         orders.forEach(order => {
//             const tr = createOrderRow(order);
//             ordersTableBody.appendChild(tr);
//         });
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }

// // Save or update order
// saveBtn.addEventListener('click', async () => {
//     const payload = {
//         user_id: parseInt(userIdInput.value),
//         order_date: orderDateInput.value,
//         status: statusInput.value.trim(),
//         total_amount: parseFloat(totalAmountInput.value),
//         payment_method: paymentMethodInput.value.trim(),
//         shipping_address: shippingAddressInput.value.trim(),
//         phone: phoneInput.value.trim()
//     };

//     // Basic client validation
//     if (!payload.user_id || !payload.order_date || !payload.status || isNaN(payload.total_amount)) {
//         errorMsg.textContent = 'Please fill all required fields correctly.';
//         return;
//     }

//     errorMsg.textContent = '';

//     if (editOrderId) {
//         const res = await fetch(`${API_BASE}/${editOrderId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();
//         if (res.ok) {
//             resetForm();
//             fetchOrders();
//         } else {
//             errorMsg.textContent = JSON.stringify(data);
//         }
//     } else {
//         const res = await fetch(API_BASE, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();
//         if (res.ok) {
//             resetForm();
//             fetchOrders();
//         } else {
//             errorMsg.textContent = JSON.stringify(data);
//         }
//     }
// });

// // Edit order
// function editOrder(id) {
//     const order = orders.find(o => o.order_id === id);
//     if (!order) return;
//     userIdInput.value = order.user_id;
//     orderDateInput.value = order.order_date;
//     statusInput.value = order.status;
//     totalAmountInput.value = order.total_amount;
//     paymentMethodInput.value = order.payment_method;
//     shippingAddressInput.value = order.shipping_address;
//     phoneInput.value = order.phone;
//     editOrderId = id;
//     saveBtn.textContent = 'Update';
// }

// // Delete order
// async function deleteOrder(id) {
//     if (!confirm('Are you sure you want to delete this order?')) return;
//     const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
//     if (res.ok) fetchOrders();
// }

// // Reset form
// function resetForm() {
//     userIdInput.value = '';
//     orderDateInput.value = '';
//     statusInput.value = '';
//     totalAmountInput.value = '';
//     paymentMethodInput.value = '';
//     shippingAddressInput.value = '';
//     phoneInput.value = '';
//     editOrderId = null;
//     saveBtn.textContent = 'Save';
//     errorMsg.textContent = '';
// }

// // Initial load
// fetchOrders();