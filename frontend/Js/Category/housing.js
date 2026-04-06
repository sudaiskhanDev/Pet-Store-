const API_URL = "http://localhost:8000/api/products";
const CATEGORY_NAME = "Housing & Bedding"; // current page category

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

        // Filter only Housing & Bedding category
        const filteredProducts = products.filter(p => p.category_name === CATEGORY_NAME);

        if (filteredProducts.length === 0) {
            errorDiv.textContent = "No products available in this category.";
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            // Click to go product detail
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

            // Stock
            const stock = document.createElement("div");
            stock.className = "product-stock";
            stock.textContent = "Stock: " + (product.stock_quantity ?? "N/A");

            // Append all to card
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(category);
            card.appendChild(animal);
            card.appendChild(stock); // Added stock here

            // Append card to container
            productsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error loading products. Please try again later.";
    }
}

window.addEventListener("DOMContentLoaded", fetchProducts);
// const API_URL = "http://localhost:8000/api/products";
// const CATEGORY_NAME = "Housing & Bedding"; // current page category

// async function fetchProducts() {
//     const productsContainer = document.getElementById("products");
//     const errorDiv = document.getElementById("error");

//     productsContainer.innerHTML = "";
//     errorDiv.textContent = "";

//     try {
//         const response = await fetch(API_URL);
//         if (!response.ok) throw new Error("Failed to fetch products");

//         const data = await response.json();
//         const products = data.products || [];

//         // Filter only Housing & Bedding category
//         const filteredProducts = products.filter(p => p.category_name === CATEGORY_NAME);

//         if (filteredProducts.length === 0) {
//             errorDiv.textContent = "No products available in this category.";
//             return;
//         }

//         filteredProducts.forEach(product => {
//             const card = document.createElement("div");
//             card.className = "product-card";

//             // Click to go product detail
//             card.addEventListener("click", () => {
//                 window.location.href = `../../Html/Pages/product-detail.html?id=${product.product_id}`;
//             });

//             // Image
//             const img = document.createElement("img");
//             img.src = product.image
//                 ? `http://localhost:8000/storage/${product.image}`
//                 : "https://via.placeholder.com/200";
//             img.alt = product.name;

//             // Name
//             const name = document.createElement("div");
//             name.className = "product-name";
//             name.textContent = product.name;

//             // Price
//             const price = document.createElement("div");
//             price.className = "product-price";
//             price.textContent = `Price: ₹${parseFloat(product.price).toLocaleString()}`;

//             // Category
//             const category = document.createElement("div");
//             category.className = "product-category";
//             category.textContent = "Category: " + (product.category_name || "N/A");

//             // Animal
//             const animal = document.createElement("div");
//             animal.className = "product-animal";
//             animal.textContent = "Animal: " + (product.animal_name || "N/A");

//             // Append all to card
//             card.appendChild(img);
//             card.appendChild(name);
//             card.appendChild(price);
//             card.appendChild(category);
//             card.appendChild(animal);

//             // Append card to container
//             productsContainer.appendChild(card);
//         });

//     } catch (error) {
//         console.error(error);
//         errorDiv.textContent = "Error loading products. Please try again later.";
//     }
// }

// window.addEventListener("DOMContentLoaded", fetchProducts);