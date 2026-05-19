const API = "http://localhost:8000/api/user";

// ==========================
// TOAST FUNCTION (GLOBAL)
// ==========================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
 
// ==========================
// Navbar Buttons
// ==========================
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================
// Check Login Status
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if(token){
        if(loginBtn) loginBtn.style.display = "none";
        if(registerBtn) registerBtn.style.display = "none";
        if(adminBtn) adminBtn.style.display = "none";
        
        if(logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if(loginBtn) loginBtn.style.display = "inline-block";
        if(registerBtn) registerBtn.style.display = "inline-block";
        if(logoutBtn) logoutBtn.style.display = "none";
    }
});

// ==========================
// LOGIN
// ==========================
const loginForm = document.getElementById("loginForm");

if(loginForm){
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try{
            const res = await fetch(API + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if(res.ok){
                localStorage.setItem("token", result.token);

                showToast("Login Successful!", "success");

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1500);

            } else {
                showToast(result.message || "Login failed!", "error");
            }

        } catch(err){
            console.error(err);
            showToast("Network error!", "error");
        }
    });
}

// ==========================
// REGISTER
// ==========================
// ==========================
// REGISTER
// ==========================
const registerForm = document.getElementById("registerForm");

if(registerForm){
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try{
            const res = await fetch(API + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if(res.ok){
                showToast("Registration Successful! Please login.", "success");

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } else {
                // Check for field-specific errors first
                if(result.errors && result.errors.email){
                    showToast(result.errors.email[0], "error"); // show email error
                } else {
                    showToast(result.message || "Registration failed!", "error");
                }
            }

        } catch(err){
            console.error(err);
            showToast("Network error!", "error");
        }
    });
}
 
// ==========================
// LOGOUT
// ==========================
if(logoutBtn){
    logoutBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if(!token) return;

        try{
            await fetch(API + "/logout", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            localStorage.removeItem("token");

            showToast("Logged Out!", "success");

            setTimeout(() => {
                location.href = "../Html/index.html";
            }, 1200);

        } catch(err){
            console.error(err);
            showToast("Logout failed!", "error");
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    loadLatestProducts();
});

function loadLatestProducts() {
    const container = document.getElementById('product-list');
    if (!container) return;

    // Show loading spinner
    container.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading new arrivals...</div>`;

    fetch('http://127.0.0.1:8000/api/products/latest')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            const products = data.data || [];
            if (products.length === 0) {
                container.innerHTML = '<p class="no-products">No new arrivals at the moment.</p>';
                return;
            }

            container.innerHTML = ''; // clear spinner

            products.forEach(product => {
                // Build correct image URL
                let imageUrl = product.image;
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `http://localhost:8000/storage/${imageUrl}`;
                } else if (!imageUrl) {
                    imageUrl = 'https://via.placeholder.com/300?text=No+Image';
                }

                // Safely access properties with fallbacks
                const productName = product.name || 'Unnamed Product';
                const category = product.category_name || 'General';
                const animal = product.animal_name || 'All Pets';
                const price = parseFloat(product.price) || 0;
                const productId = product.product_id || product.id;

                const card = document.createElement('div');
                card.className = 'product-card';
                card.onclick = () => {
                    window.location.href = `./Pages/product-detail.html?id=${productId}`;
                };

                // Use innerHTML with proper escaping (to prevent XSS)
                card.innerHTML = `
                    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(productName)}" loading="lazy">
                    <h3>${escapeHtml(productName)}</h3>
                    <p>${escapeHtml(category)}</p>
                    <p>${escapeHtml(animal)}</p>
                    <b>Rs ${price.toFixed(2)}</b>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Failed to load new arrivals:', error);
            container.innerHTML = '<p class="error-message">Failed to load new arrivals. Please try again later.</p>';
        });
}

// Simple XSS prevention
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}



 
    (function() {
        // ========== 1. TOAST FUNCTION ==========
        function showToast(message, type = "success") {
            const container = document.getElementById("toast-container");
            if (!container) return;
            const toast = document.createElement("div");
            toast.classList.add("toast", type);
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add("show"), 10);
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ========== 2. AUTH UI ==========
        const loginBtn = document.getElementById("loginBtn");
        const registerBtn = document.getElementById("registerBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        function updateAuthUI() {
            const hasToken = !!localStorage.getItem("token");
            if (hasToken) {
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
                const token = localStorage.getItem("token");
                if (!token) return;
                try {
                    await fetch("http://localhost:8000/api/user/logout", {
                        method: "POST",
                        headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" }
                    });
                } catch(e) {}
                localStorage.removeItem("token");
                showToast("Logged out successfully", "success");
                updateAuthUI();
                setTimeout(() => window.location.reload(), 1200);
            });
        }

        // ========== 3. NEW ARRIVALS with SMALL CARDS & "NEW" BADGE ==========
        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        async function loadLatestProducts() {
            const container = document.getElementById('product-list');
            if (!container) return;
            container.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Loading new arrivals...</div>`;
            try {
                const res = await fetch('http://127.0.0.1:8000/api/products/latest');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const products = data.data || [];
                if (products.length === 0) {
                    container.innerHTML = '<p class="no-products">No new arrivals yet.</p>';
                    return;
                }
                container.innerHTML = '';
                products.forEach(product => {
                    let imageUrl = product.image;
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = `http://localhost:8000/storage/${imageUrl}`;
                    } else if (!imageUrl) {
                        imageUrl = 'https://via.placeholder.com/180?text=No+Img';
                    }
                    const productName = product.name || 'Unnamed';
                    const category = product.category_name || 'General';
                    const animal = product.animal_name || 'All Pets';
                    const price = parseFloat(product.price) || 0;
                    const productId = product.product_id || product.id;

                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.onclick = () => {
                        window.location.href = `./Pages/product-detail.html?id=${productId}`;
                    };
                    card.innerHTML = `
                        <span class="new-badge"><i class="fas fa-star"></i> NEW</span>
                        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(productName)}" loading="lazy">
                        <h3>${escapeHtml(productName)}</h3>
                        <p>${escapeHtml(category)}</p>
                        <p>${escapeHtml(animal)}</p>
                        <b>Rs ${price.toFixed(2)}</b>
                    `;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error(error);
                container.innerHTML = '<p class="error-message">Failed to load new arrivals.</p>';
            }
        }

        // ========== 4. INITIALIZE ==========
        updateAuthUI();
        loadLatestProducts();
        document.getElementById('year').textContent = new Date().getFullYear();
    })();
 