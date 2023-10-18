import {
  getUserProfile,
  getUserPosts,
  deletePost,
  updatePost,
  createPost,
} from "./api.js";

/**
 * Load and display the user profile.
 */
async function loadUserProfile() {
  try {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("accessToken");
    const userProfile = await getUserProfile(token, userName);

    let displayHtml = `<h2>Welcome, ${userName}!</h2>`;
    if (userProfile?.avatar) {
      displayHtml += `<img src="${userProfile.avatar}" alt="${userName}'s profile picture" class="avatar"/>`;
    }

    document.getElementById("userNameDisplay").innerHTML = displayHtml;
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
}

/**
 * Load and display user posts.
 */
async function loadUserPosts() {
  try {
    const userName = localStorage.getItem("userName");
    const token = localStorage.getItem("accessToken");
    const posts = await getUserPosts(token, userName);
    displayPosts(posts);
  } catch (error) {
    console.error("Error loading user posts:", error);
  }
}

/**
 * Display posts with delete and edit functionalities.
 * @param {Array} posts - An array of user posts.
 */
function displayPosts(posts) {
  const postsContainer = document.getElementById("myPostsContainer");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const authorName = localStorage.getItem("userName") ?? "Unknown";
    const authorAvatar = post.author?.avatar ?? "./images/avatar.jpg";

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <h2 class="post-title">${post.title}</h2>
        <p class="post-content">${post.body}</p>
        <p>Posted by: <span class="author-link">${authorName}</span></p>
        <img src="${authorAvatar}" alt="${authorName}'s profile picture" class="avatar"/>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Post";
    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this post?");
      if (confirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          await deletePost(token, post.id);
          postElement.remove();
          alert("Post has been deleted.");
        } catch (error) {
          alert("Unable to delete the post.");
          console.error("Error deleting post:", error);
        }
      }
    });
    postElement.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Post";
    editButton.addEventListener("click", async () => {
      const newTitle = prompt("Edit post title:", post.title);
      const newBody = prompt("Edit post content:", post.body);

      if (newTitle && newBody) {
        try {
          const token = localStorage.getItem("accessToken");
          const updatedData = { title: newTitle, body: newBody };
          await updatePost(token, post.id, updatedData);
          alert("Post has been updated.");
          loadUserPosts();
        } catch (error) {
          alert("Unable to update the post.");
          console.error("Error updating post:", error);
        }
      } else {
        alert("Title and body cannot be empty.");
      }
    });
    postElement.appendChild(editButton);

    postsContainer.appendChild(postElement);
  });
}

/**
 * Handles the creation of a new post.
 *
 * @param {Event} event - The submit event triggered by the post creation form.
 */
async function handlePostCreation(event) {
  event.preventDefault();

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found. User needs to log in.");
    }

    // Getting values from the form inputs
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    // Define the post object
    const postData = {
      title: title,
      body: body,
    };

    await createPost(token, postData);

    loadUserPosts();

    document.getElementById("title").value = "";
    document.getElementById("body").value = "";
  } catch (error) {
    console.error("Error creating post:", error);
    alert("An error occurred while creating the post.");
  }
}

// When the DOM content is loaded, initialize profile and posts
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadUserPosts();
});

// Prevent form from submitting the traditional way and handle submission with JS
document
  .getElementById("post-form")
  .addEventListener("submit", handlePostCreation);
