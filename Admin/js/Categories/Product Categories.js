let categories = [];
let editCategoryId = null;

const categoryNameInput = document.getElementById('categoryName');
const categoryDescInput = document.getElementById('categoryDescription');
const saveBtn = document.getElementById('saveBtn');
const categoriesTableBody = document.getElementById('categoriesTableBody');
const errorMsg = document.getElementById('errorMsg');

const API_BASE = "http://localhost:8000/api/categories";

// Clone template row and populate values without innerHTML
function createCategoryRow(cat) {
    const templateRow = categoriesTableBody.querySelector('tr');
    const tr = templateRow.cloneNode(true); // Deep clone
    tr.dataset.id = cat.category_id;

    tr.querySelector('.td-id').textContent = cat.category_id;
    tr.querySelector('.td-name').textContent = cat.category_name;
    tr.querySelector('.td-desc').textContent = cat.description || '';

    const editBtn = tr.querySelector('.edit');
    const deleteBtn = tr.querySelector('.delete');

    // Remove old event listeners
    editBtn.replaceWith(editBtn.cloneNode(true));
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));

    tr.querySelector('.edit').addEventListener('click', () => editCategory(cat.category_id));
    tr.querySelector('.delete').addEventListener('click', () => deleteCategory(cat.category_id));

    return tr;
}

// Fetch and render categories
async function fetchCategories() {
    try {
        const res = await fetch(API_BASE);
        categories = await res.json();

        // Clear all except template
        categoriesTableBody.querySelectorAll('tr:not([data-id=""])').forEach(r => r.remove());

        categories.forEach(cat => {
            const tr = createCategoryRow(cat);
            categoriesTableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Save or update category
saveBtn.addEventListener('click', async () => {
    const name = categoryNameInput.value.trim();
    const description = categoryDescInput.value.trim();

    if (!name) {
        errorMsg.textContent = 'Category name is required';
        return;
    }

    if (categories.some(c => c.category_name.toLowerCase() === name.toLowerCase() && c.category_id !== editCategoryId)) {
        errorMsg.textContent = 'Category name already exists';
        return;
    }

    errorMsg.textContent = '';

    const payload = { category_name: name, description };

    if (editCategoryId) {
        const res = await fetch(`${API_BASE}/${editCategoryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            resetForm();
            fetchCategories();
        } else {
            errorMsg.textContent = data.category_name ? data.category_name[0] : 'Update failed';
        }
    } else {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            resetForm();
            fetchCategories();
        } else {
            errorMsg.textContent = data.category_name ? data.category_name[0] : 'Save failed';
        }
    }
});

// Edit category
function editCategory(id) {
    const cat = categories.find(c => c.category_id === id);
    if (!cat) return;
    categoryNameInput.value = cat.category_name;
    categoryDescInput.value = cat.description || '';
    editCategoryId = id;
    saveBtn.textContent = 'Update';
}

// Delete category
async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCategories();
}

// Reset form
function resetForm() {
    categoryNameInput.value = '';
    categoryDescInput.value = '';
    editCategoryId = null;
    saveBtn.textContent = 'Save';
    errorMsg.textContent = '';
}

// Initial load
fetchCategories();





















// // File: ../../js/Categories/Product Categories.js

// let categories = [];
// let editCategoryId = null;

// const categoryNameInput = document.getElementById('categoryName');
// const categoryDescInput = document.getElementById('categoryDescription');
// const saveBtn = document.getElementById('saveBtn');
// const categoriesTableBody = document.getElementById('categoriesTableBody');
// const errorMsg = document.getElementById('errorMsg');

// const API_BASE = "http://localhost:8000/api/categories"; // Update if your backend URL is different

// // Fetch all categories
// async function fetchCategories() {
//     try {
//         const res = await fetch(API_BASE);
//         categories = await res.json();
//         renderCategories();
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }

// // Render categories in table
// function renderCategories() {
//     categoriesTableBody.innerHTML = '';
//     categories.forEach(cat => {
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//             <td>${cat.category_id}</td>
//             <td>${cat.category_name}</td>
//             <td>${cat.description || ''}</td>
//             <td>
//                 <button class="edit" onclick="editCategory(${cat.category_id})">Edit</button>
//                 <button class="delete" onclick="deleteCategory(${cat.category_id})">Delete</button>
//             </td>
//         `;
//         categoriesTableBody.appendChild(tr);
//     });
// }

// // Save or update category
// saveBtn.addEventListener('click', async () => {
//     const name = categoryNameInput.value.trim();
//     const description = categoryDescInput.value.trim();

//     if (!name) {
//         errorMsg.textContent = 'Category name is required';
//         return;
//     }

//     // Client-side duplicate check (optional)
//     if (categories.some(c => c.category_name.toLowerCase() === name.toLowerCase() && c.category_id !== editCategoryId)) {
//         errorMsg.textContent = 'Category name already exists';
//         return;
//     }

//     errorMsg.textContent = '';

//     const payload = { category_name: name, description };

//     if (editCategoryId) {
//         // Update
//         const res = await fetch(`${API_BASE}/${editCategoryId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();
//         if (res.ok) {
//             categoryNameInput.value = '';
//             categoryDescInput.value = '';
//             editCategoryId = null;
//             saveBtn.textContent = 'Save';
//             fetchCategories();
//         } else {
//             errorMsg.textContent = data.category_name ? data.category_name[0] : 'Update failed';
//         }
//     } else {
//         // Create
//         const res = await fetch(API_BASE, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
//         const data = await res.json();
//         if (res.ok) {
//             categoryNameInput.value = '';
//             categoryDescInput.value = '';
//             fetchCategories();
//         } else {
//             errorMsg.textContent = data.category_name ? data.category_name[0] : 'Save failed';
//         }
//     }
// });

// // Edit category
// function editCategory(id) {
//     const cat = categories.find(c => c.category_id === id);
//     if (!cat) return;
//     categoryNameInput.value = cat.category_name;
//     categoryDescInput.value = cat.description || '';
//     editCategoryId = id;
//     saveBtn.textContent = 'Update';
// }

// // Delete category
// async function deleteCategory(id) {
//     if (!confirm('Are you sure you want to delete this category?')) return;
//     const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
//     if (res.ok) fetchCategories();
// }

// // Initial load
// fetchCategories();