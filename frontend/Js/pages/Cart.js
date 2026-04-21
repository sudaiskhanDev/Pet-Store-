
 
    (function() {
        // ======================= CONFIGURATION =======================
        const API_BASE = "http://localhost:8000/api";
        const CART_API = `${API_BASE}/carts`;
        const STORAGE_URL = "http://localhost:8000/storage";
        
        // Token: try regular token first, then admin_token
        let token = localStorage.getItem("token");
        if (!token) token = localStorage.getItem("admin_token");
        
        let cartItems = [];     // store current cart items globally
        
        // ======================= NOTIFICATION =======================
        function showNotification(message, type = "success") {
            const container = document.getElementById("notificationContainer");
            if (!container) return;
            
            const notif = document.createElement("div");
            notif.className = `notification ${type}`;
            notif.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
            container.appendChild(notif);
            
            setTimeout(() => {
                notif.style.opacity = "0";
                notif.style.transform = "translateX(120%)";
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        }
        
        // ======================= RENDER CART =======================
        function renderCart() {
            const container = document.getElementById("cartContainer");
            const checkoutWrapper = document.getElementById("checkoutWrapper");
            
            if (!cartItems || cartItems.length === 0) {
                container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-basket"></i> Your cart is empty.<br><a href="All Products.html" style="color:#fe5c1f;">Continue Shopping →</a></div>`;
                if (checkoutWrapper) checkoutWrapper.style.display = "none";
                return;
            }
            
            container.innerHTML = "";
            let totalPrice = 0;
            
            cartItems.forEach(item => {
                const product = item.product;
                if (!product) return;
                
                const cartId = item.cart_id || item.id;
                const quantity = item.quantity || 0;
                const price = parseFloat(product.price) || 0;
                const subtotal = quantity * price;
                totalPrice += subtotal;
                
                const imageUrl = product.image 
                    ? (product.image.startsWith("http") ? product.image : `${STORAGE_URL}/${product.image}`)
                    : "https://via.placeholder.com/100?text=No+Img";
                
                const stockQty = product.stock_quantity ?? product.stock ?? 0;
                const isOutOfStock = stockQty <= 0;
                const stockWarning = (stockQty > 0 && stockQty <= 2) ? `<span class="out-of-stock-tag">Only ${stockQty} left!</span>` : "";
                
                const card = document.createElement("div");
                card.className = "cart-card";
                card.innerHTML = `
                    <img class="productImage" src="${imageUrl}" alt="${escapeHtml(product.name)}" onerror="this.src='https://via.placeholder.com/100?text=Product'">
                    <div style="flex:1;">
                        <h3>${escapeHtml(product.name)}</h3>
                        <p><b>Price:</b> $${price.toFixed(2)}</p>
                        <p class="product-description"><b>Description:</b> ${escapeHtml(product.description || "No description")}</p>
                        <p><b>Quantity:</b> ${quantity} ${stockWarning}</p>
                        ${isOutOfStock ? `<p style="color:#dc2626; font-weight:700;"><i class="fas fa-times-circle"></i> Out of Stock</p>` : ""}
                    </div>
                    <div class="cart-actions">
                        <button class="increaseBtn" data-id="${cartId}" data-qty="${quantity}" data-stock="${stockQty}" ${isOutOfStock ? "disabled" : ""}>+</button>
                        <button class="decreaseBtn" data-id="${cartId}" data-qty="${quantity}">-</button>
                        <button class="removeBtn" data-id="${cartId}" data-name="${escapeHtml(product.name)}"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                `;
                container.appendChild(card);
            });
            
            // attach event listeners after rendering
            document.querySelectorAll(".increaseBtn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    const currentQty = parseInt(btn.dataset.qty);
                    const stock = parseInt(btn.dataset.stock);
                    increaseQuantity(id, currentQty, stock);
                });
            });
            
            document.querySelectorAll(".decreaseBtn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    const currentQty = parseInt(btn.dataset.qty);
                    decreaseQuantity(id, currentQty);
                });
            });
            
            document.querySelectorAll(".removeBtn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    const name = btn.dataset.name;
                    removeFromCart(id, name);
                });
            });
            
            // update total and show checkout wrapper
            const totalSpan = document.getElementById("cartTotal");
            if (totalSpan) totalSpan.textContent = `$${totalPrice.toFixed(2)}`;
            if (checkoutWrapper) checkoutWrapper.style.display = "flex";
        }
        
        // ======================= LOAD CART FROM API =======================
        async function loadCart() {
            const container = document.getElementById("cartContainer");
            if (!container) return;
            
            if (!token) {
                container.innerHTML = `<div class="empty-cart"><i class="fas fa-lock"></i> Please <a href="../UserAuth/login.html" style="color:#fe5c1f;">login</a> to view your cart.</div>`;
                document.getElementById("checkoutWrapper").style.display = "none";
                return;
            }
            
            try {
                const response = await fetch(CART_API, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("admin_token");
                    container.innerHTML = `<div class="empty-cart">Session expired. <a href="../UserAuth/login.html">Login again</a></div>`;
                    return;
                }
                if (!response.ok) throw new Error("Failed to fetch cart");
                
                const data = await response.json();
                cartItems = Array.isArray(data) ? data : (data.data || []);
                renderCart();
            } catch (err) {
                console.error(err);
                container.innerHTML = `<div class="empty-cart">Error loading cart. Please try again later.</div>`;
                showNotification("Could not load cart", "error");
            }
        }
        
        // ======================= QUANTITY CONTROLS =======================
        async function increaseQuantity(cartId) {

    const item = cartItems.find(i => (i.cart_id || i.id) == cartId);
    if (!item) return;

    const stock = Number(
        item.product?.stock_quantity ??
        item.product?.stock ??
        0
    );

    const currentQty = Number(item.quantity);

    // 🔥 STRICT RULE
    if (currentQty >= stock - 1) {
        showNotification(`Out of stock. Only ${stock} item available`, "error");
        return;
    }

    await updateCartQuantity(cartId, currentQty + 1);
}
        
        async function decreaseQuantity(cartId, currentQty) {
            if (currentQty <= 1) {
                showNotification("Minimum quantity is 1. You can remove the item instead.", "error");
                return;
            }
            await updateCartQuantity(cartId, currentQty - 1);
        }
        
        async function updateCartQuantity(cartId, newQuantity) {
            try {
                const response = await fetch(`${CART_API}/${cartId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                if (!response.ok) throw new Error("Update failed");
                showNotification("Cart updated", "success");
                await loadCart(); // refresh
            } catch (err) {
                console.error(err);
                showNotification("Failed to update quantity", "error");
            }
        }
        
        async function removeFromCart(cartId, productName) {
            try {
                const response = await fetch(`${CART_API}/${cartId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Remove failed");
                showNotification(`${productName} removed from cart`, "success");
                await loadCart();
            } catch (err) {
                console.error(err);
                showNotification("Failed to remove item", "error");
            }
        }
        
        // ======================= CHECKOUT =======================
      function proceedToCheckout() {

    if (!cartItems.length) {
        showNotification("Cart is empty", "error");
        return;
    }

    const invalidItems = cartItems.filter(item => {
        const stock = Number(item.product?.stock_quantity ?? 0);
        const qty = Number(item.quantity);

        // 🔥 SAME STRICT RULE
        return qty >= stock;
    });

    if (invalidItems.length > 0) {
        const names = invalidItems.map(i => i.product.name).join(", ");
        showNotification(`Cannot checkout. ${names} out of stock`, "error");
        return;
    }

    window.location.href = "checkout.html";
}
        // ======================= HELPER =======================
        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }
        
        // ======================= INIT =======================
        document.addEventListener("DOMContentLoaded", () => {
            loadCart();
            const checkoutBtn = document.getElementById("checkoutBtn");
            if (checkoutBtn) {
                checkoutBtn.addEventListener("click", proceedToCheckout);
            }
        });
    })();
 