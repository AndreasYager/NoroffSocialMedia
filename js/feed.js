import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  fetchFollowedPosts,
} from "./api.js";

// Display posts
/**
 * Loads and displays posts.
 *
 * @param {number} limit - Number of posts to load.
 * @param {number} offset - Number of posts to skip for pagination.
 * @param {boolean} fetchFollowed - Determines whether to fetch posts from followed users.
 * @param {Array} postsData - An array containing post objects.
 * @param {boolean} clearExisting - Determines whether to clear existing posts before loading new ones.
 */
async function loadPosts(
  limit = 10,
  offset = 0,
  fetchFollowed = false,
  postsData = null,
  clearExisting = false
) {
  try {
    const postsContainer = document.getElementById("posts-container");
    const loggedInUsername = localStorage.getItem("userName");
    // Clear existing posts if needed
    if (clearExisting) {
      postsContainer.innerHTML = "";
    }
    let posts;
    // Use provided posts data or fetch new posts
    if (postsData) {
      posts = postsData;
    } else {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found. User needs to log in.");
      }

      // Fetch posts either normally or followed based on fetchFollowed flag
      if (fetchFollowed) {
        posts = await fetchFollowedPosts(token);
      } else {
        posts = await getPosts(token, limit, offset);
      }
    }
    // Display posts
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const authorName = post.author?.name ?? "Unknown";
      const authorAvatar = post.author?.avatar ?? "./images/avatar.jpg";

      postElement.innerHTML = `
        <h2 class="post-title">${post.title}</h2>
        <p class="post-content">${post.body}</p>
        <p><strong>Author:</strong> <a href="#" class="author-link">${authorName}</a></p>
        <img src="${authorAvatar}" alt="${authorName}'s Avatar" class="avatar"/>
        `;

      // Check if the post is made by the logged-in user
      if (authorName === loggedInUsername) {
        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete Post";
        deleteButton.addEventListener("click", async () => {
          const confirmed = confirm(
            "Are you sure you want to delete this post?"
          );
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
        postElement.appendChild(deleteButton); // Append the delete button to the post

        // Edit Button
        const editButton = document.createElement("button");
        editButton.innerText = "Edit Post";
        editButton.addEventListener("click", async () => {
          const newTitle = prompt("Edit post title:", post.title);
          const newBody = prompt("Edit post content:", post.body);

          if (newTitle && newBody) {
            try {
              const token = localStorage.getItem("accessToken");
              const updatedData = { title: newTitle, body: newBody };
              const updatedPost = await updatePost(token, post.id, updatedData);
              alert("Post has been updated.");
              loadPosts();
            } catch (error) {
              alert("Unable to update the post.");
              console.error("Error updating post:", error);
            }
          } else {
            alert("Title and body cannot be empty.");
          }
        });
        postElement.appendChild(editButton); // Append the edit button to the post
      }

      //Post specific
      const titleElement = postElement.querySelector(".post-title");
      const contentElement = postElement.querySelector(".post-content");

      [titleElement, contentElement].forEach((clickableElement) => {
        clickableElement.style.cursor = "pointer";
        clickableElement.addEventListener("click", () => {
          console.log("Redirecting... Post ID:", post.id);
          window.location.href = `post.html?postId=${post.id}`;
        });
      });

      postsContainer.appendChild(postElement);

      // Add event listener to navigate to the author's profile
      const authorLink = postElement.querySelector(".author-link");
      if (authorLink) {
        authorLink.addEventListener("click", () => {
          try {
            const userName = post.author?.name;
            if (!userName) throw new Error("Author name not available");

            localStorage.setItem("selectedUserProfile", userName);
            window.location.href = "profile.html";
          } catch (error) {
            console.error("Error navigating to user profile:", error);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Create post
/**
 * Handles the creation of a new post.
 *
 * @param {Event} event - The submit event triggered by the post creation form.
 */
async function handlePostCreation(event) {
  try {
    event.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found. User needs to log in.");
    }

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;

    const postData = {
      title: title,
      body: body,
    };

    const newPost = await createPost(token, postData);
    console.log("New post created:", newPost);

    // Reset offset to load the feed from the beginning.
    currentOffset = 0;

    // Call loadPosts to refresh the feed.
    loadPosts(limit, currentOffset, false, null, true);
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

// Offset
let currentOffset = 0;
const limit = 100;

window.onload = () => {
  loadPosts(limit, currentOffset);

  document.getElementById("load-more").addEventListener("click", () => {
    currentOffset += limit;
    loadPosts(limit, currentOffset, false, null, false);
  });

  const postForm = document.getElementById("post-form");
  postForm.addEventListener("submit", handlePostCreation);
  document
    .getElementById("viewFollowedPostsBtn")
    .addEventListener("click", () => {
      currentOffset = 0;
      loadPosts(limit, currentOffset, true, null, true);
    });

  document
    .getElementById("viewAllPostsBtn")
    .addEventListener("click", function () {
      window.location.href = "feed.html";
    });
};
