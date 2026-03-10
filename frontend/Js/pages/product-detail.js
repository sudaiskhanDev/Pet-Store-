const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const PRODUCT_API = `http://localhost:8000/api/products/${id}`;
const CART_API = "http://localhost:8000/api/carts";

async function fetchProduct(){
    try {
        const response = await fetch(PRODUCT_API);
        const product = await response.json();

        document.getElementById("name").textContent = product.name;
        document.getElementById("price").textContent = "Price: ₹" + product.price;
        document.getElementById("description").textContent = product.description;
        document.getElementById("image").src = `http://localhost:8000/storage/${product.image}`;

    } catch (error) {
        console.error(error);
    }
}

fetchProduct();


// ========================
// ADD TO CART
// ========================

const addBtn = document.querySelector(".buy-btn");

addBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login first");
        window.location.href = "../Auth/login.html";
        return;
    }

    try{

        const res = await fetch(CART_API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            body: JSON.stringify({
                product_id: id,
                quantity: 1
            })
        });

        const data = await res.json();

        if(res.ok){
            alert("Product added to cart");
        }else{
            alert(data.message);
        }

    }catch(err){
        console.error(err);
    }

});