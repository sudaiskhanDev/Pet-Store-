// Path: frontend/JavaScript/index.js

const API = "http://localhost:8000/api/user";

// ==========================
// Navbar Buttons
// ==========================
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================
// Check Login Status on Page Load
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
                alert("Login Successful!");

                // Correct relative path from login.html to index.html
                window.location.href = "../index.html"; 
            } else {
                alert(result.message || "Login failed!");
            }

        } catch(err){
            console.error(err);
            alert("Network error!");
        }
    });
}

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
                alert("Registration Successful! Please login.");

                // Redirect to login.html inside same folder
                window.location.href = "login.html"; 
            } else {
                alert(JSON.stringify(result));
            }

        } catch(err){
            console.error(err);
            alert("Network error!");
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
            alert("Logged Out!");

            // Reload navbar page to update buttons
            location.href = "../../index.html"; 

        } catch(err){
            console.error(err);
            alert("Logout failed!");
        }
    });
}