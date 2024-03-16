const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function simulateSuccessfulSignUp() {
    // Perform sign-up process (e.g., validate inputs, send data to server)
    // Assuming sign-up is successful, redirect to another page
    window.location.href = "../mainPage/index.html"; // Replace "success-page.html" with your desired URL
}

function simulateSuccessfulSignIn() {
    // Perform sign-in process (e.g., validate credentials, authenticate)
    // Assuming sign-in is successful, redirect to another page
    window.location.href = "../mainPage/index.html"; // Replace "success-page.html" with your desired URL
}