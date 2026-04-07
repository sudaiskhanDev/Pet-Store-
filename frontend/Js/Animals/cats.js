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

            // Image
            const img = document.createElement("img");
            img.src = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "https://via.placeholder.com/200";
            img.alt = product.name;

            // Name
            const name = document.createElement("div");
            name.className = "product-name";
            name.textContent = product.name;

            // Price
            const price = document.createElement("div");
            price.className = "product-price";
            price.textContent = `Price: ₹${parseFloat(product.price).toLocaleString()}`;

            // Category
            const category = document.createElement("div");
            category.className = "product-category";
            category.textContent = "Category: " + (product.category_name || "N/A");

            // Animal
            const animal = document.createElement("div");
            animal.className = "product-animal";
            animal.textContent = "Animal: " + (product.animal_name || "N/A");

            // Stock logic
            const stock = document.createElement("div");
            stock.className = "product-stock";

            if (product.stock_quantity <= 1) {
                stock.textContent = "Out of Stock";
                stock.style.color = "red";
                stock.style.fontWeight = "bold";
            } else {
                stock.textContent = "Stock: " + product.stock_quantity;
                stock.style.color = "green";
            }

            // Append all
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(category);
            card.appendChild(animal);
            card.appendChild(stock);

            productsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error loading products.";
    }
}

window.addEventListener("DOMContentLoaded", fetchProducts);