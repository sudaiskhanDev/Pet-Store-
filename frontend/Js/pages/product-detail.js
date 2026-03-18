const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const PRODUCT_API = `http://localhost:8000/api/products/${id}`;
const CART_API = "http://localhost:8000/api/carts";

async function fetchProduct() {
    try {
        const response = await fetch(PRODUCT_API);
        if (!response.ok) throw new Error("Product not found");

        const product = await response.json();

        // Populate basic fields
        document.getElementById("name").textContent = product.name;
        document.getElementById("price").textContent = "Price: ₹" + product.price;
        document.getElementById("description").textContent = product.description || "No description available";

        // Image with placeholder
        document.getElementById("image").src = product.image
            ? `http://localhost:8000/storage/${product.image}`
            : "https://via.placeholder.com/400";

        // Extra fields: category & animal names (FIXED)
        document.getElementById("category").textContent = "Category: " + (product.category_name || "N/A");
        document.getElementById("animal").textContent = "Animal: " + (product.animal_name || "N/A");

    } catch (error) {
        console.error(error);
        alert("Error loading product. Please try again.");
    }
}

window.addEventListener("DOMContentLoaded", fetchProduct);

// ========================
// ADD TO CART FUNCTIONALITY
// ========================
const addBtn = document.querySelector(".buy-btn");

addBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "../../Html/UserAuth/login.html";
        return;
    }

    try {
        const res = await fetch(CART_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                product_id: id,
                quantity: 1
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Product added to cart");
        } else {
            alert(data.message || "Failed to add product to cart");
        }

    } catch (err) {
        console.error(err);
        alert("Error adding to cart. Try again.");
    }
});







// const params = new URLSearchParams(window.location.search);
// const id = params.get("id");

// const PRODUCT_API = `http://localhost:8000/api/products/${id}`;
// const CART_API = "http://localhost:8000/api/carts";

// async function fetchProduct(){
//     try {
//         const response = await fetch(PRODUCT_API);
//         const product = await response.json();

//         document.getElementById("name").textContent = product.name;
//         document.getElementById("price").textContent = "Price: $" + product.price;
//         document.getElementById("description").textContent = product.description;
//         document.getElementById("image").src = `http://localhost:8000/storage/${product.image}`;

//     } catch (error) {
//         console.error(error);
//     }
// }

// fetchProduct();


// // ========================
// // ADD TO CART
// // ========================

// const addBtn = document.querySelector(".buy-btn");

// addBtn.addEventListener("click", async () => {

//     const token = localStorage.getItem("token");

//     if(!token){
//         alert("Please login first");
//         window.location.href = "../Auth/login.html";
//         return;
//     }

//     try{

//         const res = await fetch(CART_API,{
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":"Bearer " + token
//             },
//             body: JSON.stringify({
//                 product_id: id,
//                 quantity: 1
//             })
//         });

//         const data = await res.json();

//         if(res.ok){
//             alert("Product added to cart");
//         }else{
//             alert(data.message);
//         }

//     }catch(err){
//         console.error(err);
//     }

// });