// ===============================
// LOGIN MODULE — Supabase Auth
// ===============================

import { signIn, signOut, getUser } from "./auth.js";
import { supabase } from "./supabase.js";

// ===============================
// MAIN LOGIN SCREEN
// ===============================
export async function loadLogin() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  const user = await getUser();

  // If logged in → show welcome screen
  if (user) {
    return loadLoggedInScreen(user);
  }

  // LOGIN FORM
  content.innerHTML = `
    <div class="login-container fade-in">
      <h2 class="module-title">Sign In</h2>

      <div class="card login-card">
        <p>Enter your email and password to continue.</p>

        <input 
          id="loginEmail" 
          type="email" 
          class="login-input" 
          placeholder="you@example.com"
        />

        <input 
          id="loginPassword" 
          type="password" 
          class="login-input" 
          placeholder="Password"
        />

        <button id="loginBtn" class="primary-btn">Sign In</button>

        <p id="loginStatus" class="login-status"></p>

        <hr class="divider" />

        <button id="goToRegister" class="secondary-btn">Join The Cruise Companion</button>
      </div>
    </div>
  `;

  // LOGIN BUTTON
  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const status = document.getElementById("loginStatus");

    if (!email || !password) {
      status.textContent = "Please enter both email and password.";
      return;
    }

    status.textContent = "Signing in…";

    const user = await signIn(email, password);

    if (!user) {
      status.textContent = "Invalid login. Please try again.";
      return;
    }

    loadLoggedInScreen(user);
  };

  // SWITCH TO REGISTRATION SCREEN
  document.getElementById("goToRegister").onclick = () => {
    loadEmailRegistration();
  };
}

// ===============================
// LOGGED-IN SCREEN
// ===============================
export function loadLoggedInScreen(user) {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="login-container fade-in">
      <h2 class="module-title">Welcome</h2>

      <div class="card login-card">
        <p>You are logged in as:</p>
        <h3>${user.email}</h3>

        <button id="logoutBtn" class="secondary-btn">Sign Out</button>
      </div>
    </div>
  `;

  document.getElementById("logoutBtn").onclick = async () => {
    await signOut();
    loadLogin();
  };
}

// ===============================
// EMAIL REGISTRATION MODULE
// ===============================
export function loadEmailRegistration() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="login-container fade-in">
      <h2 class="module-title">Join The Cruise Companion</h2>

      <p class="muted">
        Register your email to receive updates, deals, and cruise planning tools.
      </p>

      <div class="card login-card">
        <input 
          id="regEmail" 
          type="email" 
          class="login-input" 
          placeholder="you@example.com"
        />

        <button id="regBtn" class="primary-btn">Register</button>
        <p id="regStatus" class="login-status"></p>

        <hr class="divider" />

        <button id="backToLogin" class="secondary-btn">Back to Login</button>
      </div>
    </div>
  `;

  // REGISTER EMAIL
  document.getElementById("regBtn").onclick = async () => {
    const email = document.getElementById("regEmail").value.trim();
    const status = document.getElementById("regStatus");

    if (!email) {
      status.textContent = "Please enter a valid email.";
      return;
    }

    const { error } = await supabase
      .from("email_signups")
      .insert({ email });

    status.textContent = error
      ? "Error saving email."
      : "You're all set! Thanks for joining.";
  };

  // BACK TO LOGIN
  document.getElementById("backToLogin").onclick = () => {
    loadLogin();
  };
}
