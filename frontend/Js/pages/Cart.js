const API = "http://localhost:8000/api/carts";
const BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

async function loadCart() {
    const res = await fetch(API, {
        headers: {
            "Authorization": "Bearer " + token
        }
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

        clone.querySelector(".increaseBtn").onclick = () => increase(item.cart_id, item.quantity);
        clone.querySelector(".decreaseBtn").onclick = () => decrease(item.cart_id, item.quantity);
        clone.querySelector(".removeBtn").onclick = () => removeItem(item.cart_id);

        container.appendChild(clone);
    });

    // Disable checkout if cart is empty
    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.disabled = carts.length === 0;
}

async function increase(id, q) {
    await fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ quantity: q + 1 })
    });
    loadCart();
}

async function decrease(id, q) {
    if (q <= 1) return;

    await fetch(API + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ quantity: q - 1 })
    });
    loadCart();
}

async function removeItem(id) {
    await fetch(API + "/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    loadCart();
}

// Redirect to checkout page
document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "checkout.html"; // Change path if your checkout.html is in different folder
});

// Initial load
loadCart();









// const API = "http://localhost:8000/api/carts";
// const BASE = "http://localhost:8000";

// const token = localStorage.getItem("token");

// async function loadCart(){

// const res = await fetch(API,{
// headers:{
// "Authorization":"Bearer "+token
// }
// });

// const carts = await res.json();

// const container = document.getElementById("cartContainer");
// const template = document.getElementById("cartTemplate");

// container.innerHTML="";

// carts.forEach(item=>{

// const clone = template.content.cloneNode(true);

// clone.querySelector(".productImage").src =
// BASE + "/storage/" + item.product.image;

// clone.querySelector(".productName").textContent =
// item.product.name;

// clone.querySelector(".productPrice").textContent =
// item.product.price;

// clone.querySelector(".productDescription").textContent =
// item.product.description;

// clone.querySelector(".productQty").textContent =
// item.quantity;

// clone.querySelector(".increaseBtn")
// .onclick = ()=>increase(item.cart_id,item.quantity);

// clone.querySelector(".decreaseBtn")
// .onclick = ()=>decrease(item.cart_id,item.quantity);

// clone.querySelector(".removeBtn")
// .onclick = ()=>removeItem(item.cart_id);

// container.appendChild(clone);

// });

// }

// loadCart();

// async function increase(id,q){

// await fetch(API+"/"+id,{
// method:"PUT",
// headers:{
// "Content-Type":"application/json",
// "Authorization":"Bearer "+token
// },
// body:JSON.stringify({
// quantity:q+1
// })
// });

// loadCart();
// }

// async function decrease(id,q){

// if(q<=1) return;

// await fetch(API+"/"+id,{
// method:"PUT",
// headers:{
// "Content-Type":"application/json",
// "Authorization":"Bearer "+token
// },
// body:JSON.stringify({
// quantity:q-1
// })
// });

// loadCart();
// }

// async function removeItem(id){

// await fetch(API+"/"+id,{
// method:"DELETE",
// headers:{
// "Authorization":"Bearer "+token
// }
// });

// loadCart();

// }