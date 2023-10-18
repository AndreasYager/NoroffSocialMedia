document.addEventListener("DOMContentLoaded", function () {
  /**
   * Get the postId from the URL parameters.
   * @type {URLSearchParams}
   */
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  const apiEndpoint = `https://api.noroff.dev/api/v1/social/posts/${postId}?_author=true&_comments=true`;

  const token = localStorage.getItem("accessToken");

  /**
   * Fetch and display the post data if postId is present.
   */
  if (postId) {
    fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        displayPost(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  } else {
    console.error("Post ID not found in URL.");
  }

  /**
   * Display the post on the web page.
   * @param {Object} post The post data to be displayed.
   */
  function displayPost(post) {
    const postContainer = document.getElementById("post-container");

    const authorAvatar = post.author?.avatar ?? "./images/avatar.jpg";

    const authorName = post.author?.name ?? "Unknown";

    const authorEmail = post.author?.email ?? "Unknown";

    postContainer.innerHTML = `
            <h1>${post.title}</h1>
            <p><strong>Post ID:</strong> ${post.id}</p>
            <img src="${authorAvatar}" alt="${authorName}'s Avatar" class="avatar"/>
            <p>${post.body}</p>  
            <p><strong>Author:</strong> ${authorName}</p>
            <p><strong>Email:</strong> ${authorEmail}</p>

        `;
  }
});
