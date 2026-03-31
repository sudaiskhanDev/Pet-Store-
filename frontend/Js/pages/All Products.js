const API_URL = "http://localhost:8000/api/products";
const CATEGORY_API = "http://localhost:8000/api/categories";

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

// 🔹 Render Function (IMPORTANT)
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

        card.addEventListener("click", () => {
            window.location.href = `product-detail.html?id=${product.product_id}`;
        });

        card.innerHTML = `
            <img src="${product.image ? `http://localhost:8000/storage/${product.image}` : 'https://via.placeholder.com/200'}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">Price: ₹${parseFloat(product.price).toLocaleString()}</div>
            <div class="product-category">Category: ${product.category_name || 'N/A'}</div>
            <div class="product-animal">Animal: ${product.animal_name || 'N/A'}</div>
        `;

        productsContainer.appendChild(card);
    });
}

// 🔹 Filter Logic
document.addEventListener("change", function (e) {
    if (e.target.id === "categoryFilter") {
        const selectedId = e.target.value;

        if (!selectedId) {
            renderProducts(allProducts); // All products
        } else {
            const filtered = allProducts.filter(p => p.category_id == selectedId);
            renderProducts(filtered);
        }
    }
});

// 🔹 Load on page start
window.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchProducts();
});


// const API_URL = "http://localhost:8000/api/products";

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

//         if (products.length === 0) {
//             errorDiv.textContent = "No products available.";
//             return;
//         }

//         products.forEach(product => {
//             const card = document.createElement("div");
//             card.className = "product-card";

//             // Click → Product Detail
//             card.addEventListener("click", () => {
//                 window.location.href = `product-detail.html?id=${product.product_id}`;
//             });

//             // Product Image
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

//             // // Description
//             // const description = document.createElement("div");
//             // description.className = "product-description";
//             // description.textContent = product.description || "No description available";

//            // Extra fields: Category & Animal
// const category = document.createElement("div");
// category.className = "product-category";
// category.textContent = "Category: " + (product.category_name || "N/A");

// const animal = document.createElement("div");
// animal.className = "product-animal";
// animal.textContent = "Animal: " + (product.animal_name || "N/A");

//             // Append all to card
//             card.appendChild(img);
//             card.appendChild(name);
//             card.appendChild(price);
//             // card.appendChild(description);
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












// const API_URL = "http://localhost:8000/api/products";

// async function fetchProducts() {

//     const productsContainer = document.getElementById("products");
//     const errorDiv = document.getElementById("error");

//     productsContainer.innerHTML = "";
//     errorDiv.textContent = "";

//     try {

//         const response = await fetch(API_URL);

//         if (!response.ok) {
//             throw new Error("Failed to fetch products");
//         }

//         const data = await response.json();
//         const products = data.products || [];

//         if (products.length === 0) {
//             errorDiv.textContent = "No products available.";
//             return;
//         }

//         products.forEach(product => {

//     const card = document.createElement("div");
//     card.className = "product-card";

//     card.addEventListener("click", () => {
//         window.location.href = `product-detail.html?id=${product.product_id}`;
//     });

//     const img = document.createElement("img");
//             img.src = product.image
//                 ? `http://localhost:8000/storage/${product.image}`
//                 : "https://via.placeholder.com/200";

//             img.alt = product.name;

//             const name = document.createElement("div");
//             name.className = "product-name";
//             name.textContent = product.name;

//             const price = document.createElement("div");
//             price.className = "product-price";
//             price.textContent = `Price: ₹${parseFloat(product.price).toLocaleString()}`;

//             const description = document.createElement("div");
//             description.className = "product-description";
//             description.textContent = product.description
//                 ? product.description
//                 : "No description available";

//             card.appendChild(img);
//             card.appendChild(name);
//             card.appendChild(price);
//             card.appendChild(description);

//             productsContainer.appendChild(card);

//         });

//     } catch (error) {

//         console.error(error);
//         errorDiv.textContent = "Error loading products. Please try again later.";

//     }

// }

// window.addEventListener("DOMContentLoaded", fetchProducts);