const API_BASE = "http://localhost:8000";
const API_URL = `${API_BASE}/api/products`;
const CATEGORY_URL = `${API_BASE}/api/categories`;
const ANIMAL_URL = `${API_BASE}/api/animal`;

const categorySelect = document.getElementById("categorySelect");
const animalSelect = document.getElementById("animalSelect");
const productListBody = document.querySelector("#productsList tbody");
const productForm = document.getElementById("productForm");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const productIdInput = document.getElementById("productId");

let categoriesMap = {};
let animalsMap = {};

// ----------------- TOAST -----------------
function showToast(message, type="info", duration=3000){
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    let icon = type==="success"?"fa-check-circle":type==="error"?"fa-exclamation-circle":"fa-info-circle";
    toast.innerHTML = `<i class="fa ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(()=> toast.classList.add("show"),100);
    setTimeout(()=> { toast.classList.remove("show"); setTimeout(()=>toast.remove(),400); }, duration);
}

// ----------------- CUSTOM CONFIRM -----------------
function showConfirm(message){
    return new Promise(resolve=>{
        const modal = document.getElementById("confirmModal");
        const confirmMessage = document.getElementById("confirmMessage");
        const yesBtn = document.getElementById("confirmYes");
        const noBtn = document.getElementById("confirmNo");

        confirmMessage.textContent = message;
        modal.style.display="flex";

        yesBtn.onclick=()=>{ modal.style.display="none"; resolve(true); };
        noBtn.onclick=()=>{ modal.style.display="none"; resolve(false); };
    });
}

// ----------------- FORM SUBMIT -----------------
productForm.addEventListener("submit", e=>{
    e.preventDefault();
    if(productIdInput.value) updateProduct(productIdInput.value);
    else addProduct();
});

// ----------------- FETCH CATEGORIES & ANIMALS -----------------
async function fetchCategories(){
    try{
        const res = await fetch(CATEGORY_URL);
        const categories = await res.json();
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(c=>{
            categoriesMap[c.category_id]=c.category_name;
            const opt=document.createElement("option");
            opt.value=c.category_id; opt.textContent=c.category_name;
            categorySelect.appendChild(opt);
        });
    }catch(err){ console.error(err); showToast("Failed to load categories","error"); }
}

async function fetchAnimals(){
    try{
        const res = await fetch(ANIMAL_URL);
        const animals = await res.json();
        animalSelect.innerHTML='<option value="">Select Animal</option>';
        animals.forEach(a=>{
            animalsMap[a.animal_id]=a.animal_name;
            const opt=document.createElement("option");
            opt.value=a.animal_id; opt.textContent=a.animal_name;
            animalSelect.appendChild(opt);
        });
    }catch(err){ console.error(err); showToast("Failed to load animals","error"); }
}

// ----------------- FETCH PRODUCTS -----------------
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const products = data.products;

        // Remove old rows except template
        productListBody.querySelectorAll(".product-row:not(:first-child)").forEach(r => r.remove());
        const template = productListBody.querySelector(".product-row");

        products.forEach(p => {
            const tr = template.cloneNode(true);
            tr.style.display = "";

            tr.querySelector(".name").textContent = p.name;
            tr.querySelector(".price").textContent = p.price;

            // Stock display logic
            const stockTd = tr.querySelector(".stock");
            if (p.stock_quantity <= 1) {
                stockTd.textContent = "Out of Stock";
                stockTd.style.color = "red"; // optional highlight
            } else {
                stockTd.textContent = p.stock_quantity;
                stockTd.style.color = "black";
            }

            tr.querySelector(".category").textContent = categoriesMap[p.category_id] ?? '';
            tr.querySelector(".animal").textContent = animalsMap[p.animal_id] ?? '';
            tr.querySelector(".description").textContent = p.description ?? '';

            // Product image
            const tdImage = tr.querySelector(".image");
            tdImage.innerHTML = "";
            if (p.image) {
                const img = document.createElement("img");
                img.src = `${API_BASE}/storage/${p.image}`;
                img.width = 50;
                tdImage.appendChild(img);
            } else tdImage.textContent = "No Image";

            // Edit / Delete buttons
            tr.querySelector(".edit-btn").onclick = () => populateForm(p);
            tr.querySelector(".delete-btn").onclick = () => deleteProduct(p.product_id);

            productListBody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        showToast("Failed to fetch products", "error");
    }
}

// ----------------- POPULATE FORM FOR UPDATE -----------------
function populateForm(product){
    productIdInput.value=product.product_id;
    formTitle.textContent="Update Product";
    submitBtn.textContent="Update Product";

    document.getElementById("name").value=product.name;
    document.getElementById("price").value=product.price;
    document.getElementById("stock_quantity").value=product.stock_quantity;
    document.getElementById("description").value=product.description??'';
    categorySelect.value=product.category_id;
    animalSelect.value=product.animal_id;
    document.getElementById("image").value="";
}

// ----------------- ADD & UPDATE -----------------
async function addProduct(){
    try{
        const formData=new FormData(productForm);
        const res = await fetch(API_URL,{method:"POST", body:formData});
        if(res.ok){ resetForm(); fetchProducts(); showToast("Product added successfully!","success"); }
        else { const error=await res.json(); showToast("Error: "+(error.message||"Failed"),"error"); }
    }catch(err){ showToast("Network error","error"); console.error(err); }
}

async function updateProduct(id){
    try{
        const formData=new FormData(productForm);
        formData.append("_method","PUT");
        const res = await fetch(`${API_URL}/${id}`,{method:"POST", body:formData});
        if(res.ok){ resetForm(); fetchProducts(); showToast("Product updated successfully!","success"); }
        else { const error=await res.json(); showToast("Error: "+(error.message||"Failed"),"error"); }
    }catch(err){ showToast("Network error","error"); console.error(err); }
}

// ----------------- DELETE -----------------
async function deleteProduct(id){
    const confirmed=await showConfirm("Delete this product?");
    if(!confirmed) return;

    try{
        await fetch(`${API_URL}/${id}`,{method:"DELETE"});
        fetchProducts(); showToast("Product deleted successfully!","success");
    }catch(err){ showToast("Failed to delete product","error"); console.error(err); }
}

// ----------------- RESET FORM -----------------
function resetForm(){
    productForm.reset();
    productIdInput.value="";
    formTitle.textContent="Add New Product";
    submitBtn.textContent="Add Product";
}

// ----------------- INIT -----------------
async function init(){
    await fetchCategories();
    await fetchAnimals();
    await fetchProducts();
}
init();
// const API_BASE = "http://localhost:8000";
// const API_URL = `${API_BASE}/api/products`;
// const CATEGORY_URL = `${API_BASE}/api/categories`;
// const ANIMAL_URL = `${API_BASE}/api/animal`;

// const categorySelect = document.getElementById("categorySelect");
// const animalSelect = document.getElementById("animalSelect");
// const productListBody = document.querySelector("#productsList tbody");
// const productForm = document.getElementById("productForm");
// const submitBtn = document.getElementById("submitBtn");
// const formTitle = document.getElementById("formTitle");
// const productIdInput = document.getElementById("productId");

// let categoriesMap = {};
// let animalsMap = {};

// // ----------------- TOAST -----------------
// function showToast(message, type="info", duration=3000){
//     const container = document.getElementById("toastContainer");
//     const toast = document.createElement("div");
//     toast.className = `toast ${type}`;
//     let icon = type==="success"?"fa-check-circle":type==="error"?"fa-exclamation-circle":"fa-info-circle";
//     toast.innerHTML = `<i class="fa ${icon}"></i> <span>${message}</span>`;
//     container.appendChild(toast);
//     setTimeout(()=> toast.classList.add("show"),100);
//     setTimeout(()=> { toast.classList.remove("show"); setTimeout(()=>toast.remove(),400); }, duration);
// }

// // ----------------- CUSTOM CONFIRM -----------------
// function showConfirm(message){
//     return new Promise(resolve=>{
//         const modal = document.getElementById("confirmModal");
//         const confirmMessage = document.getElementById("confirmMessage");
//         const yesBtn = document.getElementById("confirmYes");
//         const noBtn = document.getElementById("confirmNo");

//         confirmMessage.textContent = message;
//         modal.style.display="flex";

//         yesBtn.onclick=()=>{ modal.style.display="none"; resolve(true); };
//         noBtn.onclick=()=>{ modal.style.display="none"; resolve(false); };
//     });
// }

// // ----------------- FORM SUBMIT -----------------
// productForm.addEventListener("submit", e=>{
//     e.preventDefault();
//     if(productIdInput.value) updateProduct(productIdInput.value);
//     else addProduct();
// });

// // ----------------- FETCH CATEGORIES & ANIMALS -----------------
// async function fetchCategories(){
//     try{
//         const res = await fetch(CATEGORY_URL);
//         const categories = await res.json();
//         categorySelect.innerHTML = '<option value="">Select Category</option>';
//         categories.forEach(c=>{
//             categoriesMap[c.category_id]=c.category_name;
//             const opt=document.createElement("option");
//             opt.value=c.category_id; opt.textContent=c.category_name;
//             categorySelect.appendChild(opt);
//         });
//     }catch(err){ console.error(err); }
// }

// async function fetchAnimals(){
//     try{
//         const res = await fetch(ANIMAL_URL);
//         const animals = await res.json();
//         animalSelect.innerHTML='<option value="">Select Animal</option>';
//         animals.forEach(a=>{
//             animalsMap[a.animal_id]=a.animal_name;
//             const opt=document.createElement("option");
//             opt.value=a.animal_id; opt.textContent=a.animal_name;
//             animalSelect.appendChild(opt);
//         });
//     }catch(err){ console.error(err); }
// }

// // ----------------- FETCH PRODUCTS -----------------
// async function fetchProducts(){
//     try{
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         const products = data.products;
//         productListBody.querySelectorAll(".product-row:not(:first-child)").forEach(r=>r.remove());
//         const template = productListBody.querySelector(".product-row");

//         products.forEach(p=>{
//             const tr=template.cloneNode(true);
//             tr.style.display="";
//             tr.querySelector(".name").textContent=p.name;
//             tr.querySelector(".price").textContent=p.price;
//             tr.querySelector(".stock").textContent=p.stock_quantity;
//             tr.querySelector(".category").textContent=categoriesMap[p.category_id]??'';
//             tr.querySelector(".animal").textContent=animalsMap[p.animal_id]??'';
//             tr.querySelector(".description").textContent=p.description??'';

//             const tdImage=tr.querySelector(".image");
//             tdImage.innerHTML="";
//             if(p.image){
//                 const img=document.createElement("img");
//                 img.src=`${API_BASE}/storage/${p.image}`;
//                 img.width=50;
//                 tdImage.appendChild(img);
//             } else tdImage.textContent="No Image";

//             tr.querySelector(".edit-btn").onclick=()=>populateForm(p);
//             tr.querySelector(".delete-btn").onclick=()=>deleteProduct(p.product_id);

//             productListBody.appendChild(tr);
//         });

//     }catch(err){ console.error(err); }
// }

// // ----------------- POPULATE FORM FOR UPDATE -----------------
// function populateForm(product){
//     productIdInput.value=product.product_id;
//     formTitle.textContent="Update Product";
//     submitBtn.textContent="Update Product";

//     document.getElementById("name").value=product.name;
//     document.getElementById("price").value=product.price;
//     document.getElementById("stock_quantity").value=product.stock_quantity;
//     document.getElementById("description").value=product.description??'';
//     categorySelect.value=product.category_id;
//     animalSelect.value=product.animal_id;
//     document.getElementById("image").value="";
// }

// // ----------------- ADD & UPDATE -----------------
// async function addProduct(){
//     try{
//         const formData=new FormData(productForm);
//         const res = await fetch(API_URL,{method:"POST", body:formData});
//         if(res.ok){ resetForm(); fetchProducts(); showToast("Product added successfully!","success"); }
//         else { const error=await res.json(); showToast("Error: "+(error.message||"Failed"),"error"); }
//     }catch(err){ showToast("Network error","error"); console.error(err); }
// }

// async function updateProduct(id){
//     try{
//         const formData=new FormData(productForm);
//         formData.append("_method","PUT");
//         const res = await fetch(`${API_URL}/${id}`,{method:"POST", body:formData});
//         if(res.ok){ resetForm(); fetchProducts(); showToast("Product updated successfully!","success"); }
//         else { const error=await res.json(); showToast("Error: "+(error.message||"Failed"),"error"); }
//     }catch(err){ showToast("Network error","error"); console.error(err); }
// }

// // ----------------- DELETE -----------------
// async function deleteProduct(id){
//     const confirmed=await showConfirm("Delete this product?");
//     if(!confirmed) return;

//     try{
//         await fetch(`${API_URL}/${id}`,{method:"DELETE"});
//         fetchProducts(); showToast("Product deleted successfully!","success");
//     }catch(err){ showToast("Failed to delete product","error"); console.error(err); }
// }

// // ----------------- RESET FORM -----------------
// function resetForm(){
//     productForm.reset();
//     productIdInput.value="";
//     formTitle.textContent="Add New Product";
//     submitBtn.textContent="Add Product";
// }

// // ----------------- INIT -----------------
// async function init(){
//     await fetchCategories();
//     await fetchAnimals();
//     await fetchProducts();
// }
// init();

// const API_BASE = "http://localhost:8000";
// const API_URL = `${API_BASE}/api/products`;
// const CATEGORY_URL = `${API_BASE}/api/categories`;
// const ANIMAL_URL = `${API_BASE}/api/animal`;

// const categorySelect = document.getElementById("categorySelect");
// const animalSelect = document.getElementById("animalSelect");
// const productListBody = document.querySelector("#productsList tbody");
// const productForm = document.getElementById("productForm");

// // Mapping for IDs → Names
// let categoriesMap = {};
// let animalsMap = {};

// // Form submit
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
//             categoriesMap[cat.category_id] = cat.category_name; // save mapping
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
//             animalsMap[animal.animal_id] = animal.animal_name; // save mapping
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

//             // Correct image path
//             let image = product.image
//                 ? `${API_BASE}/storage/${product.image}`
//                 : '';

//             tr.innerHTML = `
//                 <td>${product.name}</td>
//                 <td>${product.price}</td>
//                 <td>${product.stock_quantity}</td>
//                 <td>${categoriesMap[product.category_id] ?? ''}</td>
//                 <td>${animalsMap[product.animal_id] ?? ''}</td>
//                 <td>${product.description ?? ''}</td>
//                 <td>${image ? `<img src="${image}" width="50" />` : 'No Image'}</td>
//                 <td>
//                     <button class="edit-btn" data-id="${product.product_id}">Edit</button>
//                     <button class="delete-btn" data-id="${product.product_id}">Delete</button>
//                 </td>
//             `;

//             productListBody.appendChild(tr);
//         });

//         // Event delegation for Edit/Delete
//         productListBody.querySelectorAll(".delete-btn").forEach(btn => {
//             btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
//         });

//         productListBody.querySelectorAll(".edit-btn").forEach(btn => {
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
//             alert(data.message || "Product added successfully!");
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
//         alert(data.message || "Deleted successfully!");
//         fetchProducts();
//     } catch (err) {
//         alert("Failed to delete product");
//         console.error(err);
//     }
// }

// // Edit Product (simple prompt)
// async function editProduct(id) {
//     const tr = [...productListBody.children].find(row => row.querySelector(".edit-btn").dataset.id == id);

//     const name = prompt("New Product Name", tr.children[0].textContent);
//     if (name === null) return;

//     const price = prompt("New Price", tr.children[1].textContent);
//     if (price === null) return;

//     const stock = prompt("New Stock", tr.children[2].textContent);
//     if (stock === null) return;

//     try {
//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("price", price);
//         formData.append("stock_quantity", stock);

//         const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
//         const data = await res.json();
//         alert(data.message || "Product updated!");
//         fetchProducts();
//     } catch (err) {
//         alert("Failed to edit product");
//         console.error(err);
//     }
// }

// // Initial Load
// async function init() {
//     await fetchCategories();
//     await fetchAnimals();
//     await fetchProducts();
// }

// init();







 