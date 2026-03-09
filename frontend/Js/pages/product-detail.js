const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const API_URL = `http://localhost:8000/api/products/${id}`;

async function fetchProduct(){
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const product = await response.json();

        document.getElementById("name").textContent = product.name;
        document.getElementById("price").textContent = "Price: ₹" + parseFloat(product.price).toLocaleString();
        document.getElementById("description").textContent = product.description;
        document.getElementById("image").src = `http://localhost:8000/storage/${product.image}`;
    } catch (error) {
        document.getElementById("name").textContent = "Error loading product";
        console.error(error);
    }
}

fetchProduct();