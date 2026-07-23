import { auth } from "./firebase-config.js";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");
const togglePassword = document.getElementById("toggle-password");

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
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("dashboard.html");
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Invalid email or password.";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in";
  }
}

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Hide" : "Show";
});

onAuthStateChanged(auth, (user) => {
  if (user) window.location.replace("dashboard.html");
});
