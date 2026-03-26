const API_BASE = "http://localhost:8000";
const API_URL = `${API_BASE}/api/products`;
const CATEGORY_URL = `${API_BASE}/api/categories`;
const ANIMAL_URL = `${API_BASE}/api/animal`;

const categorySelect = document.getElementById("categorySelect");
const animalSelect = document.getElementById("animalSelect");
const productListBody = document.querySelector("#productsList tbody");
const productForm = document.getElementById("productForm");

// Mapping for IDs → Names
let categoriesMap = {};
let animalsMap = {};

// Form submit
productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addProduct();
});

// Fetch Categories
async function fetchCategories() {
    try {
        const res = await fetch(CATEGORY_URL);
        const categories = await res.json();

        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            categoriesMap[cat.category_id] = cat.category_name; // save mapping
            const option = document.createElement("option");
            option.value = cat.category_id;
            option.textContent = cat.category_name;
            categorySelect.appendChild(option);
        });
    } catch (err) {
        alert("Failed to load categories");
        console.error(err);
    }
}

// Fetch Animals
async function fetchAnimals() {
    try {
        const res = await fetch(ANIMAL_URL);
        const animals = await res.json();

        animalSelect.innerHTML = '<option value="">Select Animal</option>';
        animals.forEach(animal => {
            animalsMap[animal.animal_id] = animal.animal_name; // save mapping
            const option = document.createElement("option");
            option.value = animal.animal_id;
            option.textContent = animal.animal_name;
            animalSelect.appendChild(option);
        });
    } catch (err) {
        alert("Failed to load animals");
        console.error(err);
    }
}

// Fetch Products
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const products = data.products;

        productListBody.innerHTML = "";

        products.forEach(product => {
            const tr = document.createElement("tr");

            // Correct image path
            let image = product.image
                ? `${API_BASE}/storage/${product.image}`
                : '';

            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.stock_quantity}</td>
                <td>${categoriesMap[product.category_id] ?? ''}</td>
                <td>${animalsMap[product.animal_id] ?? ''}</td>
                <td>${product.description ?? ''}</td>
                <td>${image ? `<img src="${image}" width="50" />` : 'No Image'}</td>
                <td>
                    <button class="edit-btn" data-id="${product.product_id}">Edit</button>
                    <button class="delete-btn" data-id="${product.product_id}">Delete</button>
                </td>
            `;

            productListBody.appendChild(tr);
        });

        // Event delegation for Edit/Delete
        productListBody.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
        });

        productListBody.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => editProduct(btn.dataset.id));
        });

    } catch (err) {
        alert("Failed to load products");
        console.error(err);
    }
}

// Add Product
async function addProduct() {
    try {
        const formData = new FormData(productForm);

        const res = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.status === 201) {
            alert(data.message || "Product added successfully!");
            productForm.reset();
            fetchProducts();
        } else {
            alert(JSON.stringify(data));
        }
    } catch (err) {
        alert("Failed to add product");
        console.error(err);
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.message || "Deleted successfully!");
        fetchProducts();
    } catch (err) {
        alert("Failed to delete product");
        console.error(err);
    }
}

// Edit Product (simple prompt)
async function editProduct(id) {
    const tr = [...productListBody.children].find(row => row.querySelector(".edit-btn").dataset.id == id);

    const name = prompt("New Product Name", tr.children[0].textContent);
    if (name === null) return;

    const price = prompt("New Price", tr.children[1].textContent);
    if (price === null) return;

    const stock = prompt("New Stock", tr.children[2].textContent);
    if (stock === null) return;

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock_quantity", stock);

        const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
        const data = await res.json();
        alert(data.message || "Product updated!");
        fetchProducts();
    } catch (err) {
        alert("Failed to edit product");
        console.error(err);
    }
}

// Initial Load
async function init() {
    await fetchCategories();
    await fetchAnimals();
    await fetchProducts();
}

init();












// const API_BASE = "http://localhost:8000/api";
// const API_URL = `${API_BASE}/products`;
// const CATEGORY_URL = `${API_BASE}/categories`;
// const ANIMAL_URL = `${API_BASE}/animal`;

// const categorySelect = document.getElementById("categorySelect");
// const animalSelect = document.getElementById("animalSelect");
// const productListBody = document.querySelector("#productsList tbody");
// const productForm = document.getElementById("productForm");

// productForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     addProduct();
// });

// // Fetch Categories
// async function fetchCategories() {
//     try {
//         const res = await fetch(CATEGORY_URL);
//         const categories = await res.json();

//         categorySelect.innerHTML = '<option value="">Select Category</option>';
//         categories.forEach(cat => {
//             const option = document.createElement("option");
//             option.value = cat.category_id;
//             option.textContent = cat.category_name;
//             categorySelect.appendChild(option);
//         });
//     } catch (err) {
//         alert("Failed to load categories");
//         console.error(err);
//     }
// }

// // Fetch Animals
// async function fetchAnimals() {
//     try {
//         const res = await fetch(ANIMAL_URL);
//         const animals = await res.json();

//         animalSelect.innerHTML = '<option value="">Select Animal</option>';
//         animals.forEach(animal => {
//             const option = document.createElement("option");
//             option.value = animal.animal_id;
//             option.textContent = animal.animal_name;
//             animalSelect.appendChild(option);
//         });
//     } catch (err) {
//         alert("Failed to load animals");
//         console.error(err);
//     }
// }

// // Fetch Products
// async function fetchProducts() {
//     try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         const products = data.products;

//         productListBody.innerHTML = "";

//         products.forEach(product => {
//             const tr = document.createElement("tr");

//             let image = product.image
//                 ? `http://localhost:8000/storage/${product.image}`
//                 : '';

//             tr.innerHTML = `
//                 <td>${product.name}</td>
//                 <td>${product.price}</td>
//                 <td>${product.stock_quantity}</td>
//                 <td>${product.category?.category_name ?? ''}</td>
//                 <td>${product.animal?.animal_name ?? ''}</td>
//                 <td>${product.description ?? ''}</td>
//                 <td>${image ? `<img src="${image}" width="50">` : 'No Image'}</td>
//                 <td>
//                     <button class="edit-btn" data-id="${product.product_id}">Edit</button>
//                     <button class="delete-btn" data-id="${product.product_id}">Delete</button>
//                 </td>
//             `;

//             productListBody.appendChild(tr);
//         });

//         // Attach event listeners for edit/delete
//         document.querySelectorAll(".delete-btn").forEach(btn => {
//             btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
//         });

//         document.querySelectorAll(".edit-btn").forEach(btn => {
//             btn.addEventListener("click", () => editProduct(btn.dataset.id));
//         });

//     } catch (err) {
//         alert("Failed to load products");
//         console.error(err);
//     }
// }

// // Add Product
// async function addProduct() {
//     try {
//         const formData = new FormData(productForm);

//         const res = await fetch(API_URL, {
//             method: "POST",
//             body: formData
//         });

//         const data = await res.json();

//         if (res.status === 201) {
//             alert(data.message);
//             productForm.reset();
//             fetchProducts();
//         } else {
//             alert(JSON.stringify(data));
//         }
//     } catch (err) {
//         alert("Failed to add product");
//         console.error(err);
//     }
// }

// // Delete Product
// async function deleteProduct(id) {
//     if (!confirm("Delete this product?")) return;

//     try {
//         const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//         const data = await res.json();
//         alert(data.message);
//         fetchProducts();
//     } catch (err) {
//         alert("Failed to delete product");
//         console.error(err);
//     }
// }

// // Edit Product
// async function editProduct(id) {
//     const tr = [...productListBody.children].find(row => row.querySelector(".edit-btn").dataset.id == id);

//     const name = prompt("New Product Name", tr.children[0].textContent);
//     if (!name) return;
//     const price = prompt("New Price", tr.children[1].textContent);
//     const stock = prompt("New Stock", tr.children[2].textContent);

//     try {
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("price", price);
//         formData.append("stock_quantity", stock);

//         const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
//         const data = await res.json();
//         alert(data.message);
//         fetchProducts();
//     } catch (err) {
//         alert("Failed to edit product");
//         console.error(err);
//     }
// }

// // Initial Load
// fetchCategories();
// fetchAnimals();
// fetchProducts();

 