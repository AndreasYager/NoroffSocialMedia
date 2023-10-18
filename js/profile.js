import { getUserPosts } from "./api.js";

document.getElementById("userNameDisplay").innerHTML = localStorage.getItem(
  "selectedUserProfile"
);
const selectedUserName = localStorage.getItem("selectedUserProfile");

if (selectedUserName) {
  document.getElementById(
    "userNameDisplay"
  ).innerHTML = `<h2>${selectedUserName}'s Profile</h2>`;
} else {
  console.error("User name not found in localStorage");
}

async function loadUserPosts() {
  try {
    const token = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("selectedUserProfile");

    const posts = await getUserPosts(token, userName);
    // Display posts
    displayPosts(posts);
  } catch (error) {
    console.error("Error loading user posts:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserPosts();
});

function displayPosts(posts) {
  const postsContainer = document.getElementById("userPostsContainer");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    console.log("Post Author Object:", post.author);
    const authorName = localStorage.getItem("selectedUserProfile") ?? "Unknown";
    const authorAvatar = post.author?.avatar ?? "./images/avatar.jpg";
    const authorId = post.author?._id ?? "";

    postsContainer.innerHTML += `
      <article class="post">
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p>Posted by: <span class="author-link" data-author-id="${authorId}">${authorName}</span></p>
        <img src="${authorAvatar}" alt="${authorName}s profile picture" class="avatar"/>
      </article>
    `;
  });
}
