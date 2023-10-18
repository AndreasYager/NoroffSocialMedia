import { loginUser, registerUser } from "./api.js";

//Register
/**
 * Event listener that triggers the handleRegistration function
 * when the DOM content is fully loaded and the registration form is submitted.
 */
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");

  if (registrationForm) {
    registrationForm.addEventListener("submit", handleRegistration);
  }
});

/**
 * Handles user registration by collecting user details from the registration form,
 * calling the registerUser function and displaying the appropriate alert based on the registration outcome.
 *
 * @param {Event} e - The submit event triggered by the registration form.
 */

async function handleRegistration(e) {
  e.preventDefault();

  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const avatar = document.getElementById("avatar").value;
    const banner = document.getElementById("banner").value;

    const response = await registerUser(name, email, password, avatar, banner);

    if (response.success) {
      alert("Registration successful!");
    } else {
      alert("Registration failed: " + response.message);
    }
  } catch (error) {
    alert("An unexpected error occurred. Please try again.");
  }
}

//Login
/**
 * Event listener that triggers the handleLogin function when the login form is submitted.
 */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

/**
 * Handles user login by collecting credentials from the login form,
 * calling the loginUser function and redirecting to the feed page or displaying an error alert based on the login outcome.
 *
 * @param {Event} e - The submit event triggered by the login form.
 */
async function handleLogin(e) {
  e.preventDefault();

  try {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await loginUser(email, password);

    if (response.success) {
      window.location.href = "feed.html";
      localStorage.setItem("accessToken", response.data.accessToken);
    } else {
      alert("Login failed: " + response.message);
    }
  } catch (error) {
    alert("An unexpected error occurred during login. Please try again.");
  }
}
