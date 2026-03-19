const API_URL = "http://localhost:8000/api/products";
const ANIMAL_NAME = "Cats"; // filter by animal

async function fetchProducts() {
    const productsContainer = document.getElementById("products");
    const errorDiv = document.getElementById("error");

    productsContainer.innerHTML = "";
    errorDiv.textContent = "";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const products = data.products || [];

        // Filter only Cats
        const filteredProducts = products.filter(p => p.animal_name === ANIMAL_NAME);

        if (filteredProducts.length === 0) {
            errorDiv.textContent = "No products available for this animal.";
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.addEventListener("click", () => {
                window.location.href = `../../Html/Pages/product-detail.html?id=${product.product_id}`;
            });

            const img = document.createElement("img");
            img.src = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "https://via.placeholder.com/200";

            const name = document.createElement("div");
            name.className = "product-name";
            name.textContent = product.name;

            const price = document.createElement("div");
            price.className = "product-price";
            price.textContent = `Price: ₹${parseFloat(product.price).toLocaleString()}`;

            const category = document.createElement("div");
            category.className = "product-category";
            category.textContent = "Category: " + (product.category_name || "N/A");

            const animal = document.createElement("div");
            animal.className = "product-animal";
            animal.textContent = "Animal: " + (product.animal_name || "N/A");

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(category);
            card.appendChild(animal);

            productsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error loading products.";
    }
}

window.addEventListener("DOMContentLoaded", fetchProducts);