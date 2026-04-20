 
  // ======================= CONFIGURATION =======================
  const BASE_URL = "http://localhost:8000"; 
  const API_URL = `${BASE_URL}/api/products`;
  const CATEGORY_API = `${BASE_URL}/api/categories`;

  let allProducts = [];

  // ======================= AUTH UI (token based) =======================
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  function updateAuthUI() {
    if (token) {
      if (loginBtn) loginBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (registerBtn) registerBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await fetch(`${BASE_URL}/api/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
      } catch(e) {}
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      window.location.reload();
    });
  }

  // ======================= FETCH CATEGORIES =======================
  async function fetchCategories() {
    const dropdown = document.getElementById("categoryFilter");
    if (!dropdown) return;

    try {
      const res = await fetch(CATEGORY_API);
      if (!res.ok) throw new Error("Category API error");
      const data = await res.json();
      const categories = Array.isArray(data) ? data : (data.data || []);
      
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.category_id || cat.id;
        option.textContent = cat.category_name || cat.name;
        dropdown.appendChild(option);
      });
    } catch (err) {
      console.error("Category fetch error:", err);
      const errorDiv = document.getElementById("error");
      if (errorDiv) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "Failed to load categories.";
      }
    }
  }

  // ======================= FETCH PRODUCTS =======================
  async function fetchProducts() {
    const productsContainer = document.getElementById("products");
    const errorDiv = document.getElementById("error");
    if (!productsContainer) return;

    productsContainer.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading products...</div>`;
    if (errorDiv) errorDiv.style.display = "none";

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      allProducts = data.products || (Array.isArray(data) ? data : []);
      renderProducts(allProducts);
    } catch (error) {
      console.error(error);
      if (errorDiv) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "Error loading products. Please check your connection.";
      }
      productsContainer.innerHTML = "";
    }
  }

  // ======================= RENDER PRODUCTS (FIT FORM CARDS) =======================
  function renderProducts(products) {
    const productsContainer = document.getElementById("products");
    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    if (!products || products.length === 0) {
      productsContainer.innerHTML = "<p style='text-align:center; padding:2rem;'>No products found.</p>";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      const productId = product.product_id || product.id;
      card.addEventListener("click", () => {
        window.location.href = `product-detail.html?id=${productId}`;
      });

      // Image URL with fallback
      let imageUrl = "https://via.placeholder.com/300x300?text=No+Image";
      if (product.image) {
        imageUrl = product.image.startsWith("http") ? product.image : `${BASE_URL}/storage/${product.image}`;
      }

      const stockQty = product.stock_quantity ?? product.stock ?? 0;
      let stockText = stockQty > 0 ? `${stockQty} in stock` : "Out of Stock";
      let stockColor = stockQty > 0 ? "#10b981" : "#ef4444";

      const price = parseFloat(product.price) || 0;
      const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

      const categoryName = product.category_name || (product.category?.name) || "General";
      const animalName = product.animal_name || (product.animal?.name) || "All Pets";

      card.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${imageUrl}" alt="${escapeHtml(product.name)}" onerror="this.src='https://via.placeholder.com/300x300?text=Product'">
        </div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-price">${formattedPrice}</div>
          <div class="product-category"><i class="fas fa-tag"></i> ${escapeHtml(categoryName)}</div>
          <div class="product-animal"><i class="fas fa-paw"></i> ${escapeHtml(animalName)}</div>
          <div class="product-stock"><i class="fas fa-boxes"></i> <span style="color:${stockColor};">${stockText}</span></div>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // ======================= FILTER LOGIC =======================
  function setupFilter() {
    const filterSelect = document.getElementById("categoryFilter");
    if (!filterSelect) return;
    filterSelect.addEventListener("change", function() {
      const selectedId = this.value;
      if (!selectedId) {
        renderProducts(allProducts);
      } else {
        const filtered = allProducts.filter(p => {
          const prodCatId = p.category_id || (p.category?.id);
          return String(prodCatId) === String(selectedId);
        });
        renderProducts(filtered);
      }
    });
  }

  // Helper: escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // ======================= INITIALIZE PAGE =======================
  window.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    fetchCategories();
    fetchProducts().then(() => {
      setupFilter();
    });
  });
 