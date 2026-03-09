const API_URL = "http://localhost:8000/api/products";

async function fetchProducts() {

    const productsContainer = document.getElementById("products");
    const errorDiv = document.getElementById("error");

    productsContainer.innerHTML = "";
    errorDiv.textContent = "";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const products = data.products || [];

        if (products.length === 0) {
            errorDiv.textContent = "No products available.";
            return;
        }

        products.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.addEventListener("click", () => {
        window.location.href = `product-detail.html?id=${product.product_id}`;
    });

    const img = document.createElement("img");
            img.src = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "https://via.placeholder.com/200";

            img.alt = product.name;

            const name = document.createElement("div");
            name.className = "product-name";
            name.textContent = product.name;

            const price = document.createElement("div");
            price.className = "product-price";
            price.textContent = `Price: ₹${parseFloat(product.price).toLocaleString()}`;

            const description = document.createElement("div");
            description.className = "product-description";
            description.textContent = product.description
                ? product.description
                : "No description available";

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(description);

            productsContainer.appendChild(card);

        });

    } catch (error) {

        console.error(error);
        errorDiv.textContent = "Error loading products. Please try again later.";

    }

}

window.addEventListener("DOMContentLoaded", fetchProducts);