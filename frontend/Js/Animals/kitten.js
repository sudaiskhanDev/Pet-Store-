const API_URL = "http://localhost:8000/api/products";
const ANIMAL_NAME = "Kitten";

async function fetchProducts() {
    const container = document.getElementById("products");
    const errorDiv = document.getElementById("error");
    const template = document.getElementById("product-template");

    container.innerHTML = "";
    errorDiv.textContent = "";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const products = data.products || [];

        // Filter Cats
        const filtered = products.filter(p => p.animal_name === ANIMAL_NAME);

        if (filtered.length === 0) {
            errorDiv.textContent = "No products found.";
            return;
        }

        filtered.forEach(product => {

            const clone = template.content.cloneNode(true);

            // Select elements inside template
            const img = clone.querySelector(".product-image");
            const name = clone.querySelector(".product-name");
            const price = clone.querySelector(".product-price");
            const category = clone.querySelector(".product-category");
            const animal = clone.querySelector(".product-animal");

            // Fill data
            img.src = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "https://via.placeholder.com/200";

            name.textContent = product.name;
            price.textContent = "Price: ₹" + parseFloat(product.price).toLocaleString();
            category.textContent = "Category: " + (product.category_name || "N/A");
            animal.textContent = "Animal: " + (product.animal_name || "N/A");

            // Click event
            clone.querySelector(".product-card").addEventListener("click", () => {
                window.location.href = `../../Html/Pages/product-detail.html?id=${product.product_id}`;
            });

            container.appendChild(clone);
        });

    } catch (error) {
        errorDiv.textContent = "Error loading products.";
    }
}

window.onload = fetchProducts;