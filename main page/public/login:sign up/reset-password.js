// Handle Reset Password Form Submission
document.getElementById("reset-password-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Get the token from the URL
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Send the new password to the backend
    const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });

    const message = await response.text();
    alert(message);

    if (response.ok) {
        window.location.href = "login.html"; // Redirect to the login page after successful reset
    }
});
