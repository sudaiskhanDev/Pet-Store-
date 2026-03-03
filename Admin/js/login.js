document.getElementById("loginBtn").addEventListener("click", login);

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("admin_token", data.token);
            window.location.href = "dashboard.html";
        } else {
            alert("Login Failed");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Server Error");
    });
}