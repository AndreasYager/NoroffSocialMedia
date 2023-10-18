// Select the logout button
const logoutButton = document.getElementById("logoutButton");

// Add a click event listener to the logout button
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    // Remove the access token from local storage and redirect to the index page
    localStorage.removeItem("accessToken");
    window.location.href = "index.html";
  });
}

// Select the profile button and add a click event listener
document.getElementById("myProfileButton").addEventListener("click", () => {
  const userName = localStorage.getItem("userName");
  const accessToken = localStorage.getItem("accessToken");

  // If a username and access token exist, display the user's profile
  if (userName && accessToken) {
    displayUserProfileByUsername(userName, accessToken);
  } else {
    // TODO: Redirect to login page or show an error message if no user details are found
  }
});

// Define the search functionality
window.search = function () {
  // Get the search input value and convert it to lowercase
  const input = document.getElementById("searchInput").value.toLowerCase();
  // Select all post elements
  const postElements = document.querySelectorAll(".post");

  // Loop through each post element and check if it includes the search input
  postElements.forEach((postElement) => {
    const postText = postElement.textContent.toLowerCase();
    // If a post includes the search input, display it; otherwise, hide it
    if (postText.includes(input)) {
      postElement.style.display = "block";
    } else {
      postElement.style.display = "none";
    }
  });
};
