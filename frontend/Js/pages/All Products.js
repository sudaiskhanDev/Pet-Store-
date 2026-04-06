const BASE_URL = "http://localhost:8000"; 
const API_URL = `${BASE_URL}/api/products`;
const CATEGORY_API = `${BASE_URL}/api/categories`;

let allProducts = [];

// 🔹 Fetch Categories
async function fetchCategories() {
    const dropdown = document.getElementById("categoryFilter");

    try {
        const res = await fetch(CATEGORY_API);
        const data = await res.json();

        data.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.category_id;
            option.textContent = cat.category_name;
            dropdown.appendChild(option);
        });

    } catch (err) {
        console.error("Category fetch error:", err);
        document.getElementById("error").textContent = "Failed to load categories.";
    }
}

// 🔹 Fetch Products
async function fetchProducts() {
    const productsContainer = document.getElementById("products");
    const errorDiv = document.getElementById("error");

    productsContainer.innerHTML = "";
    errorDiv.textContent = "";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        allProducts = data.products || [];

        renderProducts(allProducts);

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error loading products.";
    }
}

// 🔹 Render Function with Stock Display
function renderProducts(products) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        // Navigate to product detail on click
        card.addEventListener("click", () => {
            window.location.href = `product-detail.html?id=${product.product_id}`;
        });

        card.innerHTML = `
            <img src="${product.image ? `${BASE_URL}/storage/${product.image}` : 'https://via.placeholder.com/200'}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">Price: ₹${parseFloat(product.price).toLocaleString()}</div>
            <div class="product-category">Category: ${product.category_name || 'N/A'}</div>
            <div class="product-animal">Animal: ${product.animal_name || 'N/A'}</div>
            <div class="product-stock">Stock: ${product.stock_quantity ?? 'N/A'}</div>
        `;

        productsContainer.appendChild(card);
    });
}

// 🔹 Filter Logic
document.getElementById("categoryFilter").addEventListener("change", function() {
    const selectedId = this.value;
    const filtered = selectedId ? allProducts.filter(p => p.category_id == selectedId) : allProducts;
    renderProducts(filtered);
});

// 🔹 Load on page start
window.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
});
// const API_URL = "http://localhost:8000/api/products";
// const CATEGORY_API = "http://localhost:8000/api/categories";

// let allProducts = [];

// // 🔹 Fetch Categories
// async function fetchCategories() {
//     const dropdown = document.getElementById("categoryFilter");

//     try {
//         const res = await fetch(CATEGORY_API);
//         const data = await res.json();

//         data.forEach(cat => {
//             const option = document.createElement("option");
//             option.value = cat.category_id;
//             option.textContent = cat.category_name;
//             dropdown.appendChild(option);
//         });

//     } catch (err) {
//         console.error("Category fetch error:", err);
//     }
// }

// // 🔹 Fetch Products
// async function fetchProducts() {
//     const productsContainer = document.getElementById("products");
//     const errorDiv = document.getElementById("error");

//     productsContainer.innerHTML = "";
//     errorDiv.textContent = "";

//     try {
//         const response = await fetch(API_URL);
//         if (!response.ok) throw new Error("Failed to fetch products");

//         const data = await response.json();
//         allProducts = data.products || [];

//         renderProducts(allProducts);

//     } catch (error) {
//         console.error(error);
//         errorDiv.textContent = "Error loading products.";
//     }
// }

// // 🔹 Render Function (IMPORTANT)
// function renderProducts(products) {
//     const productsContainer = document.getElementById("products");
//     productsContainer.innerHTML = "";

//     if (products.length === 0) {
//         productsContainer.innerHTML = "<p>No products found.</p>";
//         return;
//     }

//     products.forEach(product => {
//         const card = document.createElement("div");
//         card.className = "product-card";

//         card.addEventListener("click", () => {
//             window.location.href = `product-detail.html?id=${product.product_id}`;
//         });

//         card.innerHTML = `
//             <img src="${product.image ? `http://localhost:8000/storage/${product.image}` : 'https://via.placeholder.com/200'}">
//             <div class="product-name">${product.name}</div>
//             <div class="product-price">Price: ₹${parseFloat(product.price).toLocaleString()}</div>
//             <div class="product-category">Category: ${product.category_name || 'N/A'}</div>
//             <div class="product-animal">Animal: ${product.animal_name || 'N/A'}</div>
//         `;

//         productsContainer.appendChild(card);
//     });
// }

// // 🔹 Filter Logic
// document.addEventListener("change", function (e) {
//     if (e.target.id === "categoryFilter") {
//         const selectedId = e.target.value;

//         if (!selectedId) {
//             renderProducts(allProducts); // All products
//         } else {
//             const filtered = allProducts.filter(p => p.category_id == selectedId);
//             renderProducts(filtered);
//         }
//     }
// });

// // 🔹 Load on page start
// window.addEventListener("DOMContentLoaded", () => {
//     fetchCategories();
//     fetchProducts();
// });

