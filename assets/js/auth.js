const PASSCODE = "Wempecker6"; // Replace with your own passcode

function authenticate() {
    const input = document.getElementById("passcode").value;
    const error = document.getElementById("error");

    if (input === PASSCODE) {
        localStorage.setItem("isAuthenticated", "true");
        error.textContent = "";
        // Get redirect URL from query parameter, default to wiki/wiki.html
        let redirect = "./wempecker/wiki";
        console.log("Initial redirect value:", redirect); // Debug: Log initial redirect
        // Ensure redirect is relative to root
        if (redirect.startsWith('/wempecker/')) {
            redirect = redirect.substring(1);
            console.log("Redirect after removing leading slash:", redirect); // Debug: Log modified redirect
        }
        console.log("Final redirect URL:", redirect); // Debug: Log final redirect
        window.location.href = redirect;
    } else {
        error.textContent = "Incorrect code";
    }
}

function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
}

function logout() {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "../index.html";
}