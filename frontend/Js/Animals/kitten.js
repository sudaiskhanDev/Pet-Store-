const API_URL = "http://localhost:8000/api/products";
const ANIMAL_NAME = "Kitten"; // change this for other pages: "Cats", "Dogs", "Puppy"

async function fetchProducts() {
    const container = document.getElementById("products");
    const errorDiv = document.getElementById("error");
    const template = document.getElementById("product-template");

    container.innerHTML = "";
    errorDiv.textContent = "";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const products = data.products || [];

        // Filter by animal
        const filtered = products.filter(p => p.animal_name === ANIMAL_NAME);

        if (filtered.length === 0) {
            errorDiv.textContent = "No products found.";
            return;
        }

        filtered.forEach(product => {
            const clone = template.content.cloneNode(true);

            // Elements inside template
            const img = clone.querySelector(".product-image");
            const name = clone.querySelector(".product-name");
            const price = clone.querySelector(".product-price");
            const category = clone.querySelector(".product-category");
            const animal = clone.querySelector(".product-animal");

            // Optional: add stock div dynamically if not in template
            let stockDiv = clone.querySelector(".product-stock");
            if (!stockDiv) {
                stockDiv = document.createElement("div");
                stockDiv.className = "product-stock";
                clone.querySelector(".product-card").appendChild(stockDiv);
            }

            // Fill data
            img.src = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : "https://via.placeholder.com/200";

            name.textContent = product.name;
            price.textContent = "Price: ₹" + parseFloat(product.price).toLocaleString();
            category.textContent = "Category: " + (product.category_name || "N/A");
            animal.textContent = "Animal: " + (product.animal_name || "N/A");

            // Stock logic
            if (product.stock_quantity <= 1) {
                stockDiv.textContent = "Out of Stock";
                stockDiv.style.color = "red";
            } else {
                stockDiv.textContent = "Stock: " + product.stock_quantity;
                stockDiv.style.color = "green";
            }

            // Click to go to product detail
            clone.querySelector(".product-card").addEventListener("click", () => {
                window.location.href = `../../Html/Pages/product-detail.html?id=${product.product_id}`;
            });

            container.appendChild(clone);
        });

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error loading products.";
    }
}

window.onload = fetchProducts;