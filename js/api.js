const baseUrl = "https://api.noroff.dev/api/v1/social";

//Register

/**
 * Registers a new user.
 *
 * @param {string} name - User's name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} [avatar] - User's avatar URL.
 * @param {string} [banner] - User's banner URL.
 * @returns {Promise<Object>} The response object indicating success or failure with relevant data or error message.
 */

export async function registerUser(name, email, password, avatar, banner) {
  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        avatar: avatar || undefined,
        banner: banner || undefined,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data };
    } else {
      // Log the error response to understand its structure
      console.error("Error response from server:", data);

      // Extracting the error message
      const errorMessage =
        data.message || "An error occurred during registration.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Network or JSON parsing error:", error);
    return { success: false, message: error.message };
  }
}

//Login
/**
 * Logs a user in.
 *
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The response object indicating success or failure with relevant data or error message.
 */

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userName", data.name); // Storing the user's name

      return { success: true, data: data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//Logout
/**
 * Logs the current user out.
 *
 * @returns {Promise<Object>} The response object indicating success or failure.
 */
export async function logoutUser() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.ok) {
      // Successfully logged out
      localStorage.removeItem("accessToken"); // Removing the token from local storage
      return { success: true };
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

// Fetch Posts to feed
/**
 * Fetches posts to display in a feed.
 *
 * @param {string} token - Authentication token.
 * @param {number} [limit=10] - Number of posts to fetch.
 * @param {number} [offset=0] - Number of posts to skip.
 * @returns {Promise<Array>} An array of posts.
 */

export async function getPosts(token, limit = 10, offset = 0) {
  try {
    const url = `${baseUrl}/posts?_author=true&limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const postData = await response.json();
      return postData;
    } else {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }
  } catch (error) {
    console.error("Fetching posts failed:", error.message);
    return [];
  }
}

// Create posts
/**
 * Creates a new post.
 *
 * @param {string} token - Authentication token.
 * @param {Object} postData - Data for the new post.
 * @returns {Promise<Object>} The created post data.
 */
export async function createPost(token, postData) {
  try {
    const url = `${baseUrl}/posts?_author=true`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }
  } catch (error) {
    console.error("Creating post failed:", error.message);
    throw error;
    // Rethrowing error so it can be caught in the calling function
  }
}

// Delete post
/**
 * Deletes a post.
 *
 * @param {string} token - Authentication token.
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
export async function deletePost(token, postId) {
  try {
    const response = await fetch(`${baseUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }

    // Post deleted successfully
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

// Update post
/**
 * Updates a post.
 *
 * @param {string} token - Authentication token.
 * @param {string} postId - The ID of the post to update.
 * @param {Object} updatedData - New data to update the post.
 * @returns {Promise<Object>} The updated post data.
 */

export async function updatePost(token, postId, updatedData) {
  try {
    const response = await fetch(`${baseUrl}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//Get posts from user
/**
 * Fetches the profile of a user.
 *
 * @param {string} token - Authentication token.
 * @param {string} userName - The name of the user whose profile to fetch.
 * @returns {Promise<Object>} The user's profile data.
 */
export async function getUserProfile(token, userName) {
  try {
    const response = await fetch(`${baseUrl}/profiles/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

/**
 * Fetches the posts of a user.
 *
 * @param {string} token - Authentication token.
 * @param {string} userName - The name of the user whose posts to fetch.
 * @returns {Promise<Array>} An array of the user's posts.
 */
export async function getUserPosts(token, userName) {
  try {
    const url = `${baseUrl}/profiles/${userName}/posts`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const postData = await response.json();
      return postData;
    } else {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }
  } catch (error) {
    console.error("Fetching user posts failed:", error.message);
    return [];
  }
}

/**
 * Fetches posts from followed users.
 *
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} An array of posts from followed users.
 */
export async function fetchFollowedPosts(token) {
  try {
    const url = `${baseUrl}/posts/following?_author=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const postData = await response.json();
      return postData;
    } else {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }
  } catch (error) {
    console.error("Fetching followed posts failed:", error.message);
    return [];
  }
}
