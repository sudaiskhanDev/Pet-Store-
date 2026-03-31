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
// const registerForm = document.getElementById("registerForm");

// if(registerForm){
//     registerForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const formData = new FormData(registerForm);
//         const data = Object.fromEntries(formData.entries());

//         try{
//             const res = await fetch(API + "/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             const result = await res.json();

//             if(res.ok){
//                 showToast("Registration Successful! Please login.", "success");

//                 setTimeout(() => {
//                     window.location.href = "login.html";
//                 }, 1500);

//             } else {
//                 showToast(result.message || "Registration failed!", "error");
//             }

//         } catch(err){
//             console.error(err);
//             showToast("Network error!", "error");
//         }
//     });
// }

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







// // Path: frontend/JavaScript/index.js

// const API = "http://localhost:8000/api/user";

// // ==========================
// // Navbar Buttons
// // ==========================
// const loginBtn = document.getElementById("loginBtn");
// const registerBtn = document.getElementById("registerBtn");
// const logoutBtn = document.getElementById("logoutBtn");

// // ==========================
// // Check Login Status on Page Load
// // ==========================
// document.addEventListener("DOMContentLoaded", () => {
//     const token = localStorage.getItem("token");

//     if(token){
//         if(loginBtn) loginBtn.style.display = "none";
//         if(registerBtn) registerBtn.style.display = "none";
//         if(logoutBtn) logoutBtn.style.display = "inline-block";
//     } else {
//         if(loginBtn) loginBtn.style.display = "inline-block";
//         if(registerBtn) registerBtn.style.display = "inline-block";
//         if(logoutBtn) logoutBtn.style.display = "none";
//     }
// });

// // ==========================
// // LOGIN
// // ==========================
// const loginForm = document.getElementById("loginForm");

// if(loginForm){
//     loginForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const formData = new FormData(loginForm);
//         const data = Object.fromEntries(formData.entries());

//         try{
//             const res = await fetch(API + "/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             const result = await res.json();

//             if(res.ok){
//                 localStorage.setItem("token", result.token);
//                 alert("Login Successful!");

//                 // Correct relative path from login.html to index.html
//                 window.location.href = "../index.html"; 
//             } else {
//                 alert(result.message || "Login failed!");
//             }

//         } catch(err){
//             console.error(err);
//             alert("Network error!");
//         }
//     });
// }

// // ==========================
// // REGISTER
// // ==========================
// const registerForm = document.getElementById("registerForm");

// if(registerForm){
//     registerForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const formData = new FormData(registerForm);
//         const data = Object.fromEntries(formData.entries());

//         try{
//             const res = await fetch(API + "/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             const result = await res.json();

//             if(res.ok){
//                 alert("Registration Successful! Please login.");

//                 // Redirect to login.html inside same folder
//                 window.location.href = "login.html"; 
//             } else {
//                 alert(JSON.stringify(result));
//             }

//         } catch(err){
//             console.error(err);
//             alert("Network error!");
//         }
//     });
// }

// // ==========================
// // LOGOUT
// // ==========================
// if(logoutBtn){
//     logoutBtn.addEventListener("click", async () => {
//         const token = localStorage.getItem("token");
//         if(!token) return;

//         try{
//             await fetch(API + "/logout", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": "Bearer " + token,
//                     "Content-Type": "application/json"
//                 }
//             });

//             localStorage.removeItem("token");
//             alert("Logged Out!");

//             // Reload navbar page to update buttons
//             location.href = "../Html/index.html"; 

//         } catch(err){
//             console.error(err);
//             alert("Logout failed!");
//         }
//     });
// }


// // PRoducts
