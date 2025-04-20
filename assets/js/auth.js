const PASSCODE = "Wempecker6"; // Replace with your own passcode

function authenticate(redirectUrl) {
    const input = document.getElementById("passcode").value;
    const error = document.getElementById("error");

    if (input === PASSCODE) {
        localStorage.setItem("isAuthenticated", "true");
        error.textContent = "";
        let redirect = redirectUrl || "/wiki/";
        console.log("Initial redirect value:", redirect);
        if (redirect.startsWith('./')) {
            redirect = redirect.substring(2);
            console.log("Redirect after removing leading ./:", redirect);
        }
        console.log("Final redirect URL:", redirect);
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