import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

async function login() {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "";

    if (!email || !password) {
        loginMessage.textContent = "Please enter your email and password.";
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "dashboard.html";

    } catch (error) {

        loginMessage.textContent =
            "Invalid email or password.";

        console.error(error);

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Sign In";

    }

}

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keypress", function(event){

    if(event.key==="Enter"){
        login();
    }

});

onAuthStateChanged(auth,function(user){

    if(user){
        window.location.href="dashboard.html";
    }

});
