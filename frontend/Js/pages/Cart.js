const API = "http://localhost:8000/api/carts";
const BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

// ---------------- UI Notification Function ----------------
function showNotification(message, type = 'error') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.padding = '10px 20px';
    notif.style.marginTop = '10px';
    notif.style.borderRadius = '5px';
    notif.style.color = '#fff';
    notif.style.fontWeight = '500';
    notif.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    notif.style.opacity = '1';
    notif.style.transition = 'opacity 0.5s ease-out';
    notif.style.backgroundColor = type === 'error' ? '#ff0000' : '#4BB543';

    container.appendChild(notif);

    // Fade out after 3 seconds
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => container.removeChild(notif), 500);
    }, 3000);
}

// ---------------- Load Cart ----------------
async function loadCart() {
    const res = await fetch(API, {
        headers: { "Authorization": "Bearer " + token }
    });

    const carts = await res.json();
    const container = document.getElementById("cartContainer");
    const template = document.getElementById("cartTemplate");

    container.innerHTML = "";

    carts.forEach(item => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".productImage").src = BASE + "/storage/" + item.product.image;
        clone.querySelector(".productName").textContent = item.product.name;
        clone.querySelector(".productPrice").textContent = item.product.price;
        clone.querySelector(".productDescription").textContent = item.product.description;
        clone.querySelector(".productQty").textContent = item.quantity;

        // Increase / Decrease / Remove with notifications
        clone.querySelector(".increaseBtn").onclick = () => increase(item.cart_id, item.quantity, item.product.stock_quantity);
        clone.querySelector(".decreaseBtn").onclick = () => decrease(item.cart_id, item.quantity, item.product.name);
        clone.querySelector(".removeBtn").onclick = () => removeItem(item.cart_id, item.product.name);

        container.appendChild(clone);
    });

    // Disable checkout if cart is empty
    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.disabled = carts.length === 0;
}

// ---------------- Increase Quantity ----------------
async function increase(id, q, stock) {
    if (q + 1 > stock) {
        showNotification(`Out of stock! Only ${stock} available.`, 'error');
        return;
    }

    await fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ quantity: q + 1 })
    });
    showNotification('Quantity increased', 'success');
    loadCart();
}

// ---------------- Decrease Quantity ----------------
async function decrease(id, q, name) {
    if (q <= 1) {
        showNotification('Minimum quantity is 1', 'error');
        return;
    }

    await fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ quantity: q - 1 })
    });
    showNotification('Quantity decreased', 'success');
    loadCart();
}

// ---------------- Remove Item ----------------
async function removeItem(id, name) {
    await fetch(API + "/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    showNotification(`${name} removed from cart`, 'success');
    loadCart();
}

// ---------------- Checkout Button ----------------
document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "checkout.html"; // Change path if needed
});

// ---------------- Initial Load ----------------
loadCart();
// const API = "http://localhost:8000/api/carts";
// const BASE = "http://localhost:8000";
// const token = localStorage.getItem("token");

// async function loadCart() {
//     const res = await fetch(API, {
//         headers: {
//             "Authorization": "Bearer " + token
//         }
//     });

//     const carts = await res.json();
//     const container = document.getElementById("cartContainer");
//     const template = document.getElementById("cartTemplate");

//     container.innerHTML = "";

//     carts.forEach(item => {
//         const clone = template.content.cloneNode(true);

//         clone.querySelector(".productImage").src = BASE + "/storage/" + item.product.image;
//         clone.querySelector(".productName").textContent = item.product.name;
//         clone.querySelector(".productPrice").textContent = item.product.price;
//         clone.querySelector(".productDescription").textContent = item.product.description;
//         clone.querySelector(".productQty").textContent = item.quantity;

//         clone.querySelector(".increaseBtn").onclick = () => increase(item.cart_id, item.quantity);
//         clone.querySelector(".decreaseBtn").onclick = () => decrease(item.cart_id, item.quantity);
//         clone.querySelector(".removeBtn").onclick = () => removeItem(item.cart_id);

//         container.appendChild(clone);
//     });

//     // Disable checkout if cart is empty
//     const checkoutBtn = document.getElementById("checkoutBtn");
//     checkoutBtn.disabled = carts.length === 0;
// }

// async function increase(id, q) {
//     await fetch(API + "/" + id, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + token
//         },
//         body: JSON.stringify({ quantity: q + 1 })
//     });
//     loadCart();
// }

// async function decrease(id, q) {
//     if (q <= 1) return;

//     await fetch(API + "/" + id, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + token
//         },
//         body: JSON.stringify({ quantity: q - 1 })
//     });
//     loadCart();
// }

// async function removeItem(id) {
//     await fetch(API + "/" + id, {
//         method: "DELETE",
//         headers: {
//             "Authorization": "Bearer " + token
//         }
//     });
//     loadCart();
// }

// // Redirect to checkout page
// document.getElementById("checkoutBtn").addEventListener("click", () => {
//     window.location.href = "checkout.html"; // Change path if your checkout.html is in different folder
// });

// // Initial load
// loadCart();





