const API = "http://localhost:8000/api/carts";
const ORDER_API = "http://localhost:8000/api/orders";
const BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

async function loadCheckoutCart(){
    const res = await fetch(API, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const carts = await res.json();

    const container = document.getElementById("checkoutContainer");
    container.innerHTML = "";

    let total = 0;

    carts.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("checkout-item");
        div.innerHTML = `
            <p>${item.product.name} - ₹${item.product.price} x ${item.quantity}</p>
        `;
        container.appendChild(div);

        total += item.product.price * item.quantity;
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<h3>Total: ₹${total}</h3>`;
    container.appendChild(totalDiv);

    return carts; // return for order placement
}

loadCheckoutCart();





// Correct



// const API = "http://localhost:8000/api/carts";
// const ORDER_API = "http://localhost:8000/api/orders";
// const token = localStorage.getItem("token");

// // Fetch cart items and display in checkout
// async function loadCheckoutCart() {
//     const res = await fetch(API, {
//         headers: { "Authorization": "Bearer " + token }
//     });
//     const carts = await res.json();

//     const container = document.getElementById("checkoutContainer");
//     container.innerHTML = "";

//     let total = 0;

//     carts.forEach(item => {
//         const div = document.createElement("div");
//         div.classList.add("checkout-item");
//         div.textContent = `${item.product.name} - ₹${item.product.price} x ${item.quantity}`;
//         container.appendChild(div);

//         total += item.product.price * item.quantity;
//     });

//     const totalDiv = document.createElement("div");
//     totalDiv.innerHTML = `<h3>Total: ₹${total}</h3>`;
//     container.appendChild(totalDiv);

//     return carts; // return for order placement
// }

// // Handle form submit
// document.getElementById("checkoutForm").addEventListener("submit", async function(e) {
//     e.preventDefault();

//     const carts = await loadCheckoutCart();
//     if (carts.length === 0) {
//         alert("Your cart is empty!");
//         return;
//     }

//     const formData = new FormData(this);

//     const orderData = {
//         shipping_address: {
//             name: formData.get("name"),
//             address: formData.get("address"),
//             city: formData.get("city"),
//             zip: formData.get("zip")
//         },
//         payment_method: formData.get("payment_method"),
//         items: carts.map(item => ({
//             product_id: item.product.product_id,
//             quantity: item.quantity,
//             price: item.product.price
//         }))
//     };

//     try {
//         const res = await fetch(ORDER_API, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + token
//             },
//             body: JSON.stringify(orderData)
//         });

//         const result = await res.json();

//         if (res.status === 201) {
//             alert("Order placed successfully! Order ID: " + result.order_id);
//             window.location.href = "order-success.html"; // optional success page
//         } else {
//             alert("Failed to place order!");
//             console.log(result);
//         }
//     } catch (err) {
//         console.error(err);
//         alert("Error placing order!");
//     }
// });

// // Initial load of cart items
// loadCheckoutCart();