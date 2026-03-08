const API_BASE = "http://localhost:8000/api";
const API_URL = `${API_BASE}/products`;
const CATEGORY_URL = `${API_BASE}/categories`;
const ANIMAL_URL = `${API_BASE}/animal`;

const categorySelect = document.getElementById("categorySelect");
const animalSelect = document.getElementById("animalSelect");
const productListBody = document.querySelector("#productsList tbody");
const productForm = document.getElementById("productForm");

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

            let image = product.image
                ? `http://localhost:8000/storage/${product.image}`
                : '';

            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.stock_quantity}</td>
                <td>${product.category?.category_name ?? ''}</td>
                <td>${product.animal?.animal_name ?? ''}</td>
                <td>${product.description ?? ''}</td>
                <td>${image ? `<img src="${image}" width="50">` : 'No Image'}</td>
                <td>
                    <button class="edit-btn" data-id="${product.product_id}">Edit</button>
                    <button class="delete-btn" data-id="${product.product_id}">Delete</button>
                </td>
            `;

            productListBody.appendChild(tr);
        });

        // Attach event listeners for edit/delete
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
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
            alert(data.message);
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
        alert(data.message);
        fetchProducts();
    } catch (err) {
        alert("Failed to delete product");
        console.error(err);
    }
}

// Edit Product
async function editProduct(id) {
    const tr = [...productListBody.children].find(row => row.querySelector(".edit-btn").dataset.id == id);

    const name = prompt("New Product Name", tr.children[0].textContent);
    if (!name) return;
    const price = prompt("New Price", tr.children[1].textContent);
    const stock = prompt("New Stock", tr.children[2].textContent);

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock_quantity", stock);

        const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
        const data = await res.json();
        alert(data.message);
        fetchProducts();
    } catch (err) {
        alert("Failed to edit product");
        console.error(err);
    }
}

// Initial Load
fetchCategories();
fetchAnimals();
fetchProducts();



// const API_URL = "http://localhost:8000/api/products";
// const CATEGORY_URL = "http://localhost:8000/api/categories";
// const ANIMAL_URL = "http://localhost:8000/api/animal";

// const categorySelect = document.getElementById("categorySelect");
// const animalSelect = document.getElementById("animalSelect");
// const productListBody = document.querySelector("#productsList tbody");
// const productForm = document.getElementById("productForm");

// productForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     addProduct();
// });

// /* ================================
//    FETCH CATEGORIES
// ================================ */
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

// /* ================================
//    FETCH ANIMALS
// ================================ */
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

// /* ================================
//    FETCH PRODUCTS
// ================================ */
// async function fetchProducts() {
//     try {
//         const res = await fetch(API_URL);
//         const products = await res.json();

//         productListBody.innerHTML = "";

//         products.forEach(product => {
//             const tr = document.createElement("tr");

//             tr.innerHTML = `
//                 <td>${product.name}</td>
//                 <td>${product.price}</td>
//                 <td>${product.stock_quantity}</td>
//                 <td>${product.category_name || product.category_id}</td>
//                 <td>${product.animal_name || product.animal_id}</td>
//                 <td>${product.description || "N/A"}</td>
//                 <td><img src="http://localhost:8000/storage/${product.image}" width="50" onerror="this.src='https://via.placeholder.com/50'"></td>
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

// /* ================================
//    ADD PRODUCT
// ================================ */
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

// /* ================================
//    DELETE PRODUCT
// ================================ */
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

// /* ================================
//    EDIT PRODUCT
// ================================ */
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

// /* ================================
//    INITIAL LOAD
// ================================ */
// fetchCategories();
// fetchAnimals();
// fetchProducts();