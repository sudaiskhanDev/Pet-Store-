const API = "http://localhost:8000/api/payments";

const table = document.getElementById('paymentsTable');
const template = document.getElementById('templateRow');

// 🔥 Create row without innerHTML
function createRow(p) {
    const tr = template.cloneNode(true);

    tr.style.display = "";
    tr.removeAttribute("id");

    tr.querySelector('.td-id').textContent = p.id;
    tr.querySelector('.td-order').textContent = p.order_id;
    tr.querySelector('.td-amount').textContent = p.amount;
    tr.querySelector('.td-stripe').textContent = p.stripe_payment_id || "";
    tr.querySelector('.td-status').textContent = p.status;

    tr.querySelector('.delete').addEventListener('click', () => del(p.id));

    return tr;
}

// 🔥 Load data
async function load() {
    try {
        const res = await fetch(API);
        const payments = await res.json();

        // clear old rows (except template)
        table.querySelectorAll('tr:not(#templateRow)').forEach(r => r.remove());

        payments.forEach(p => {
            const row = createRow(p);
            table.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// 🔥 Delete
async function del(id) {
    if (!confirm("Delete this payment?")) return;

    try {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        load();
    } catch (error) {
        console.error("Delete error:", error);
    }
}

// Init
load();



// let payments = [];
// let editId = null;

// const API = "http://localhost:8000/api/payments";

// const orderId = document.getElementById('orderId');
// const amount = document.getElementById('amount');
// const stripeId = document.getElementById('stripeId');
// const status = document.getElementById('status');
// const saveBtn = document.getElementById('saveBtn');
// const table = document.getElementById('paymentsTable');
// const errorMsg = document.getElementById('errorMsg');

// function createRow(p) {
//     const t = table.querySelector('tr');
//     const tr = t.cloneNode(true);

//     tr.dataset.id = p.id;

//     tr.querySelector('.td-id').textContent = p.id;
//     tr.querySelector('.td-order').textContent = p.order_id;
//     tr.querySelector('.td-amount').textContent = p.amount;
//     tr.querySelector('.td-stripe').textContent = p.stripe_payment_id || '';
//     tr.querySelector('.td-status').textContent = p.status;

//     tr.querySelector('.edit').onclick = () => edit(p.id);
//     tr.querySelector('.delete').onclick = () => del(p.id);

//     return tr;
// }

// async function load() {
//     const res = await fetch(API);
//     payments = await res.json();

//     table.querySelectorAll('tr:not([data-id=""])').forEach(r => r.remove());

//     payments.forEach(p => table.appendChild(createRow(p)));
// }

// saveBtn.onclick = async () => {

//     const payload = {
//         order_id: parseInt(orderId.value),
//         amount: parseFloat(amount.value),
//         stripe_payment_id: stripeId.value,
//         status: status.value
//     };

//     if (!payload.order_id || isNaN(payload.amount)) {
//         errorMsg.textContent = "Invalid input";
//         return;
//     }

//     errorMsg.textContent = "";

//     if (editId) {
//         await fetch(`${API}/${editId}`, {
//             method: 'PUT',
//             headers: {'Content-Type':'application/json'},
//             body: JSON.stringify(payload)
//         });
//     } else {
//         await fetch(API, {
//             method: 'POST',
//             headers: {'Content-Type':'application/json'},
//             body: JSON.stringify(payload)
//         });
//     }

//     reset();
//     load();
// };

// function edit(id) {
//     const p = payments.find(x => x.id === id);

//     orderId.value = p.order_id;
//     amount.value = p.amount;
//     stripeId.value = p.stripe_payment_id;
//     status.value = p.status;

//     editId = id;
// }

// async function del(id) {
//     await fetch(`${API}/${id}`, {method:'DELETE'});
//     load();
// }

// function reset() {
//     orderId.value = "";
//     amount.value = "";
//     stripeId.value = "";
//     status.value = "";
//     editId = null;
// }

// load();

