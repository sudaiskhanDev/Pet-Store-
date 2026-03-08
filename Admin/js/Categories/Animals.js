const apiBase = 'http://127.0.0.1:8000/api/animal';
const form = document.getElementById('simple-form');
const nameInput = document.getElementById('name');
const tableBody = document.querySelector('#animals-table tbody');

let editId = null; // track update mode

// Fetch animals and populate table
async function fetchAnimals() {
  const res = await fetch(apiBase);
  const data = await res.json();
  tableBody.innerHTML = '';
  data.forEach(animal => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${animal.animal_id}</td>
      <td>${animal.animal_name}</td>
      <td>
        <button class="btn btn-update" onclick="editAnimal(${animal.animal_id}, '${animal.animal_name}')">Update</button>
        <button class="btn btn-delete" onclick="deleteAnimal(${animal.animal_id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Create animal
async function createAnimal(name) {
  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ animal_name: name })
    });
    const data = await res.json();
    if (res.status === 201) {
      alert(`Animal "${data.animal_name}" added successfully!`);
      nameInput.value = '';
      fetchAnimals();
    } else if (res.status === 422) {
      alert(data.animal_name[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

// Update animal
async function updateAnimal(id, name) {
  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ animal_name: name })
    });
    const data = await res.json();
    if (res.status === 200) {
      alert(`Animal updated to "${data.animal_name}"!`);
      editId = null;
      nameInput.value = '';
      form.querySelector('button').textContent = 'Save';
      fetchAnimals();
    } else if (res.status === 422) {
      alert(data.animal_name[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

// Delete animal
async function deleteAnimal(id) {
  if (!confirm('Are you sure to delete this animal?')) return;
  try {
    await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    fetchAnimals();
  } catch (err) {
    console.error(err);
  }
}

// Prefill form for update
function editAnimal(id, name) {
  editId = id;
  nameInput.value = name;
  form.querySelector('button').textContent = 'Update';
}

// Form submit handler
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return alert('Please enter animal name!');
  if (editId) {
    updateAnimal(editId, name);
  } else {
    createAnimal(name);
  }
});

// Initial fetch
fetchAnimals();