// API URL
const API_BASE = "http://localhost:8000/api";
const API_URL = `${API_BASE}/products`;

// Select the scrollable products container
const productsDiv = document.querySelector(".products-list");

// Fetch products and show name + price only
async function fetchProductsScrollable() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const products = data.products;

        // Clear previous content
        productsDiv.innerHTML = "";

        // Loop through products
        products.forEach(product => {
            const div = document.createElement("div");
            div.classList.add("product-item");
            div.textContent = `${product.name} - $${product.price}`;
            productsDiv.appendChild(div);
        });

    } catch (err) {
        productsDiv.innerHTML = "<p>Failed to load products</p>";
        console.error(err);
    }
}

// Initial call
fetchProductsScrollable();