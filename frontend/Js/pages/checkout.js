 
    (function() {
        // ======================= CONFIGURATION =======================
        const API_BASE = "http://localhost:8000/api";
        const CART_API = `${API_BASE}/carts`;
        const CHECKOUT_API = `${API_BASE}/checkout`;
        const CREATE_PAYMENT_INTENT_API = `${API_BASE}/payments/create-payment-intent`;
        
        // Token handling: regular token first, then admin_token
        let token = localStorage.getItem("token");
        if (!token) token = localStorage.getItem("admin_token");
        
        // Stripe publishable key (from your code)
        const stripe = Stripe("pk_test_51T3YGjPubxVvHrmFHvOK8ut1lXw8X7nL77iYk0Y47aj4G6758ndZDGRnWu54qEuv2mk3feOfbRNTKZmwRe9A8Cbx00VNTxBm5d");
        let elements = stripe.elements();
        let card = null;
        
        // DOM elements
        const checkoutContainer = document.getElementById("checkoutContainer");
        const totalDisplay = document.getElementById("totalDisplay");
        const paymentMethodSelect = document.getElementById("paymentMethod");
        const cardContainer = document.getElementById("card-container");
        const placeOrderBtn = document.getElementById("placeOrderBtn");
        const loaderDiv = document.getElementById("loader");
        const checkoutForm = document.getElementById("checkoutForm");
        
        let cartItems = [];
        let totalAmount = 0;
        
        // ======================= TOAST NOTIFICATION =======================
        function showToast(message, type = "success") {
            const container = document.getElementById("toast-container");
            if (!container) return;
            const toast = document.createElement("div");
            toast.className = `toast ${type}`;
            toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(120%)";
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        // ======================= LOAD CART & CALCULATE TOTAL =======================
        async function loadCartAndTotal() {
            if (!token) {
                checkoutContainer.innerHTML = `<div class="error-message">Please <a href="../UserAuth/login.html">login</a> to view your cart.</div>`;
                totalDisplay.innerHTML = "";
                return;
            }
            
            try {
                const response = await fetch(CART_API, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("admin_token");
                    checkoutContainer.innerHTML = `<div class="error-message">Session expired. Please login again.</div>`;
                    return;
                }
                if (!response.ok) throw new Error("Failed to fetch cart");
                
                const data = await response.json();
                cartItems = Array.isArray(data) ? data : (data.data || []);
                
                if (cartItems.length === 0) {
                    checkoutContainer.innerHTML = `<div class="error-message">Your cart is empty. <a href="All Products.html">Continue shopping</a></div>`;
                    totalDisplay.innerHTML = "";
                    return;
                }
                
                // render items
                checkoutContainer.innerHTML = "";
                totalAmount = 0;
                cartItems.forEach(item => {
                    const product = item.product;
                    if (!product) return;
                    const quantity = item.quantity || 0;
                    const price = parseFloat(product.price) || 0;
                    const subtotal = quantity * price;
                    totalAmount += subtotal;
                    
                    const div = document.createElement("div");
                    div.className = "checkout-item";
                    div.innerHTML = `
                        <span>${escapeHtml(product.name)} x ${quantity}</span>
                        <span>$${price.toFixed(2)}</span>
                    `;
                    checkoutContainer.appendChild(div);
                });
                
                totalDisplay.innerHTML = `<strong>Total: $${totalAmount.toFixed(2)}</strong>`;
            } catch (err) {
                console.error(err);
                checkoutContainer.innerHTML = `<div class="error-message">Error loading cart. Please try again.</div>`;
                showToast("Could not load cart", "error");
            }
        }
        
        // ======================= STRIPE CARD ELEMENT =======================
        function initStripeCard() {
            if (!card) {
                card = elements.create('card', {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#1e293b',
                            '::placeholder': { color: '#94a3b8' }
                        }
                    }
                });
                card.mount('#card-element');
                card.addEventListener('change', (event) => {
                    const errorDiv = document.getElementById('card-errors');
                    if (event.error) {
                        errorDiv.textContent = event.error.message;
                    } else {
                        errorDiv.textContent = '';
                    }
                });
            }
        }
        
        // toggle card input visibility
        function toggleCardContainer() {
            if (paymentMethodSelect.value === 'card') {
                cardContainer.style.display = 'block';
                initStripeCard();
            } else {
                cardContainer.style.display = 'none';
            }
        }
        
        paymentMethodSelect.addEventListener('change', toggleCardContainer);
        
        // ======================= FORM SUBMIT (ORDER PLACEMENT) =======================
        checkoutForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            if (!token) {
                showToast("Please login to place order", "error");
                window.location.href = "../UserAuth/login.html";
                return;
            }
            
            if (cartItems.length === 0) {
                showToast("Your cart is empty", "error");
                return;
            }
            
            // validate stock (optional but good)
            const outOfStock = cartItems.filter(item => (item.product?.stock_quantity ?? 0) <= 0);
            if (outOfStock.length > 0) {
                showToast("Some items are out of stock. Please remove them from cart.", "error");
                return;
            }
            
            // disable button and show loader
            placeOrderBtn.disabled = true;
            loaderDiv.style.display = "block";
            
            // collect form data
            const formData = new FormData(checkoutForm);
            const name = formData.get('name');
            const address = formData.get('address');
            const city = formData.get('city');
            const zip = formData.get('zip');
            const phone = formData.get('phone');
            const payment_method = formData.get('payment_method');
            
            const shipping_address = `${address}, ${city}, ${zip}`;
            
            try {
                let payment_id = null;
                
                // Handle Stripe card payment
                if (payment_method === 'card') {
                    if (!card) {
                        throw new Error("Card element not initialized");
                    }
                    
                    // 1. Create PaymentIntent on backend
                    const intentRes = await fetch(CREATE_PAYMENT_INTENT_API, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ amount: totalAmount })
                    });
                    
                    if (!intentRes.ok) {
                        const errData = await intentRes.json();
                        throw new Error(errData.message || "Failed to initialize payment");
                    }
                    
                    const intentData = await intentRes.json();
                    const clientSecret = intentData.clientSecret;
                    
                    // 2. Confirm card payment with Stripe
                    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: { card: card }
                    });
                    
                    if (error) {
                        throw new Error(error.message);
                    }
                    
                    payment_id = paymentIntent.id;
                }
                
                // 3. Place order (COD or after successful card payment)
                const orderPayload = {
                    name: name,
                    shipping_address: shipping_address,
                    phone: phone,
                    payment_method: payment_method,
                    payment_id: payment_id
                };
                
                const orderRes = await fetch(CHECKOUT_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(orderPayload)
                });
                
                const orderData = await orderRes.json();
                
                if (orderRes.ok) {
                    showToast("Order placed successfully! Redirecting...", "success");
                    setTimeout(() => {
                        window.location.href = "thankyou.html";
                    }, 1500);
                } else {
                    throw new Error(orderData.message || "Order placement failed");
                }
                
            } catch (err) {
                console.error(err);
                showToast(err.message || "An unexpected error occurred", "error");
                placeOrderBtn.disabled = false;
                loaderDiv.style.display = "none";
            } finally {
                if (payment_method !== 'card') {
                    placeOrderBtn.disabled = false;
                    loaderDiv.style.display = "none";
                }
            }
        });
        
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
        
        // ======================= INITIALIZE =======================
        async function init() {
            await loadCartAndTotal();
            toggleCardContainer(); // initial state
        }
        
        init();
    })();
 