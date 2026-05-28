// ===============================
// LOGIN SCREEN (Supabase Magic Link)
// ===============================

import { login, logout, onAuthChange, getUser } from "./auth.js";
import { ensureUserProfile } from "./users.js";

export function loadLogin() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="login-container fade-in">
      <h2 class="module-title">Sign In</h2>

      <div class="card login-card">
        <p>Enter your email to receive a secure login link.</p>

        <input 
          id="loginEmail" 
          type="email" 
          class="login-input" 
          placeholder="you@example.com"
        />

        <button id="loginBtn" class="primary-btn">Send Login Link</button>

        <p id="loginStatus" class="login-status"></p>
      </div>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const status = document.getElementById("loginStatus");

    if (!email) {
      status.textContent = "Please enter a valid email.";
      return;
    }

    status.textContent = "Sending magic link…";

    const error = await login(email);

    if (error) {
      status.textContent = "Error sending login link.";
      console.error(error);
    } else {
      status.textContent = "Check your email for the login link!";
    }
  });

  // Listen for login state changes
  onAuthChange(async user => {
    if (user) {
      await ensureUserProfile();
      loadLoggedInScreen(user);
    }
  });
}

export async function loadLoggedInScreen(user) {
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

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logout();
    loadLogin();
  });
}
