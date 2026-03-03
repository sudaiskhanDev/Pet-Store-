const token = localStorage.getItem("admin_token");

// Redirect to login if no token
if (!token) {
    window.location.href = "login.html";
}

// Verify token on page load
fetch("http://127.0.0.1:8000/api/admin/me", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => {
    if (res.status === 401) {
        localStorage.removeItem("admin_token");
        window.location.href = "login.html";
        return;
    }
    return res.json();
})
.then(data => {
    if (data) {
        console.log("Logged in as:", data.email);
    }
})
.catch(() => {
    localStorage.removeItem("admin_token");
    window.location.href = "login.html";
});

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("http://127.0.0.1:8000/api/admin/logout", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        localStorage.removeItem("admin_token");
        window.location.href = "login.html";
    })
    .catch(() => {
        alert("Logout failed. Try again.");
    });
});