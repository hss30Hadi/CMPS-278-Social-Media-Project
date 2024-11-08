// Handle Sign-Up Form Submission
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send sign-up data to the backend
    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
    });

    const message = await response.text();
    alert(message);

    // If the response is OK, show the verification section
    if (response.ok) {
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("verification-section").style.display = "block";
    }
});

// Handle Verification Code Submission
document.getElementById("verify-button").addEventListener("click", async function() {
    const email = document.getElementById("email").value;
    const code = document.getElementById("verification-code").value;

    // Send the verification code to the backend
    const verifyResponse = await fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const verifyMessage = await verifyResponse.text();
    alert(verifyMessage);

    // If verification is successful, redirect to the login page
    if (verifyResponse.ok) {
        window.location.href = "login.html"; // Redirect to the login page
    }
});

// Toggle between login and forgot password forms
document.getElementById("forgot-password-link").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-section").style.display = "block";
});

// Handle Forgot Password Form Submission
document.getElementById("forgot-password-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("forgot-email").value;

    // Send the reset password request to the backend
    const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const message = await response.text();
    alert(message);
});

