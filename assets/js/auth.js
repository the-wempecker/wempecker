const PASSCODE = "Wempecker6";

function authenticate(redirectUrl) {
    const input = document.getElementById("passcode").value;
    const error = document.getElementById("error");

    if (input === PASSCODE) {
        localStorage.setItem("isAuthenticated", "true");
        error.textContent = "";
        let redirect = redirectUrl || "/wiki/";
        if (redirect.startsWith('./')) {
            redirect = redirect.substring(2);
        }
        // Replace 'your-repo-name' with your actual repository name
        const basePath = window.location.pathname.startsWith('/wempecker') ? '/wempecker' : '';
        redirect = `${basePath}/${redirect}`.replace(/\/+/g, '/'); // Normalize slashes
        console.log("Final redirect URL:", redirect);
        window.location.href = redirect;
    } else {
        error.textContent = "Incorrect passcode";
    }
}

function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
}

function logout() {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/wempecker/index.html"; // Update with repo name
}