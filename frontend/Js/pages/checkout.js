const API = "http://localhost:8000/api/carts";
const ORDER_API = "http://localhost:8000/api/orders";
const ORDER_ITEMS_API = "http://localhost:8000/api/order-items";
const token = localStorage.getItem("token");

async function loadCheckoutCart(){
    const res = await fetch(API, {
       headers: {
    "Content-Type": "application/json",
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
        div.innerHTML = `<p>${item.product.name} - ₹${item.product.price} x ${item.quantity}</p>`;
        container.appendChild(div);

        total += item.product.price * item.quantity;
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<h3>Total: ₹${total}</h3>`;
    container.appendChild(totalDiv);

    return { carts, total }; // return both carts and total
}

loadCheckoutCart();

const checkoutForm = document.getElementById("checkoutForm");
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1️⃣ Get form data
    const formData = new FormData(checkoutForm);
    const shippingDetails = {
        name: formData.get("name"),
        address: formData.get("address"),
        city: formData.get("city"),
        zip: formData.get("zip"),
        phone: formData.get("phone"),
        payment_method: formData.get("payment_method")
    };

    // 2️⃣ Get cart items and total
    const { carts, total } = await loadCheckoutCart();

    // 3️⃣ Create order payload
    const orderData = {
        total_amount: total,
        payment_method: shippingDetails.payment_method,
        shipping_address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.zip}`,
        phone: shippingDetails.phone,
        order_date: new Date().toISOString().slice(0,10) // YYYY-MM-DD
    };

    // 4️⃣ Send order to backend
    const resOrder = await fetch(ORDER_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(orderData)
    });

    const orderResult = await resOrder.json();

    if(resOrder.ok){
        const orderId = orderResult.order.order_id;

        // 5️⃣ Save order items
        for(const item of carts){
            await fetch(ORDER_ITEMS_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    order_id: orderId,
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })
            });
        }

        alert("Order placed successfully!");
        window.location.href = "/pages/thankyou.html";
    } else {
        alert("Error placing order: " + orderResult.message);
    }
});


const TOKEN = localStorage.getItem("token");
const CHECKOUT_API = "http://localhost:8000/api/checkout";

document.getElementById("checkoutForm").addEventListener("submit", async(e)=>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const shipping_address = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('zip')}`;
    const phone = formData.get('phone');
    const payment_method = formData.get('payment_method');

    const res = await fetch(CHECKOUT_API,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+TOKEN
        },
        body: JSON.stringify({shipping_address, phone, payment_method})
    });

    const data = await res.json();

    if(res.ok){
        alert("Order placed successfully!");
        window.location.href="/pages/thankyou.html";
    } else {
        alert("Error: "+(data.message||""));
    }
});
 

async function placeOrder() {
    const res = await fetch("http://localhost:8000/api/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            shipping_address: document.getElementById("address").value,
            phone: document.getElementById("phone").value,
            payment_method: "cod" // ya stripe id agar online
        })
    });

    const data = await res.json();
    console.log(data);
}
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