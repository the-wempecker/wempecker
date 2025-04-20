const PASSCODE = "Wempecker6";

function authenticate(redirectUrl) {
    const passcodeInput = document.getElementById("passcode");
    const errorElement = document.getElementById("error");

    // Check if DOM elements exist
    if (!passcodeInput || !errorElement) {
        console.error("Error: passcode or error element not found");
        return;
    }

    const input = passcodeInput.value;
    errorElement.textContent = ""; // Clear previous error

    if (input === PASSCODE) {
        try {
            localStorage.setItem("isAuthenticated", "true");
            // Close modal immediately
            closeAuthModal();
            // Use redirectUrl, fallback to /wempecker/wiki/
            let redirect = redirectUrl || "/wempecker/wiki/";
            if (redirect.startsWith('./')) {
                redirect = redirect.substring(2);
            }
            // Prepend base path for GitHub Pages
            const basePath = window.location.pathname.startsWith('/wempecker') ? '/wempecker' : '';
            redirect = `${basePath}/${redirect}`.replace(/\/+/g, '/');
            console.log("Final redirect URL:", redirect);
            window.location.href = redirect;
        } catch (e) {
            console.error("Redirect failed:", e);
            errorElement.textContent = "Redirect failed. Please try again.";
        }
    } else {
        errorElement.textContent = "Incorrect passcode";
    }
}

function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
}

function logout() {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/index.html";
}