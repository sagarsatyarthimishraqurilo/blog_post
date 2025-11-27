const express = require("express");
const app = express();
const dbConfig = require("./config/db.config");
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const userModel = require("./models/user.models");
const postModel = require("./models/post.models");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ============================================================================ */
/*                                MIDDLEWARE SETUP                              */
/* ============================================================================ */

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set("view engine", "ejs");

// Serve static files from public directory
app.use("/static", express.static(path.join(__dirname, "public")));

// Parse cookies
app.use(cookieParser());

/* ============================================================================ */
/*                              DATABASE CONNECTION                             */
/* ============================================================================ */

// Connect to MongoDB
dbConfig.connectDB();

/* ============================================================================ */
/*                              AUTHENTICATION MIDDLEWARE                       */
/* ============================================================================ */

/**
 * Middleware to check if user is logged in
 * Verifies JWT token from cookies
 */
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  // Redirect to login if no token found
  if (!token) {
    return res.redirect("/login");
  }

  try {
    // Verify JWT token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    // Redirect to login if token is invalid
    return res.redirect("/login");
  }
}

/* ============================================================================ */
/*                                  PAGE ROUTES (GET)                           */
/* ============================================================================ */

// Home page route
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

// Login page route
app.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

// Register page route
app.get("/register", (req, res) => {
  res.render("register", { title: "Register Page" });
});

// Dashboard page route (protected)
app.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("posts");
    const posts = await postModel.find().populate("author").sort({ date: -1 });
    console.log(posts);
    res.render("dashboard", { title: "Dashboard", user, posts });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.redirect("/login");
  }
});

// Profile page route (protected)
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("posts");
    res.render("profile", { title: "Profile Page", user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).send("Error loading profile");
  }
});

/* ============================================================================ */
/*                              AUTHENTICATION ROUTES (POST)                    */
/* ============================================================================ */

/**
 * User Registration Route
 * Creates new user account with hashed password
 */
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .send("User with this email or username already exists");
    }

    // Validate required fields
    if (!username || !email || !password || !name) {
      return res.status(400).send("All fields are required");
    }

    // Hash password and create user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      name,
    });

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === "production",
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).send("Internal server error");
  }
});

/**
 * User Login Route
 * Authenticates user and creates session
 */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === "production",
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal server error");
  }
});

/**
 * User Logout Route
 * Clears authentication token
 */
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
});

/* ============================================================================ */
/*                                  POST ROUTES (POST)                          */
/* ============================================================================ */

/**
 * Create New Post Route
 * Creates a new blog post for authenticated user
 */
app.post("/posts/create", isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).send("Title and Content are required");
    }

    // Create new post
    const post = await postModel.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user.id,
    });

    // Add post reference to user's posts array
    await userModel.findByIdAndUpdate(req.user.id, {
      $push: { posts: post._id },
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).send("Error creating post");
  }
});

/**
 * Like/Unlike Post Route
 * Toggles like status for a post
 */
app.post("/posts/:id/like", isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Remove like - pull user from likes array
      await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    } else {
      // Add like - push user to likes array
      await postModel.findByIdAndUpdate(postId, { $push: { likes: userId } });
    }

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Like/Unlike error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Delete Post Route
 * Removes post and its references
 */
app.post("/posts/:id/delete", isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Check if user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).send("You are not authorized to delete this post");
    }

    // Delete the post
    await postModel.findByIdAndDelete(postId);

    // Remove post reference from user's posts array
    await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    return res.redirect("/profile");
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Edit Post Route
 * Updates existing post content
 */
app.post("/posts/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the post and verify ownership
    const post = await postModel.findById(postId);
    if (!post || post.author.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }

    // Update post with new data
    await postModel.findByIdAndUpdate(postId, {
      title: title.trim(),
      content: content.trim(),
      date: new Date(), // Update modification date
    });

    res.redirect("/profile");
  } catch (error) {
    console.error("Edit post error:", error);
    res.status(500).send("Error editing post");
  }
});

// function editPost(postId, title, content) {
//   // Unescape the content (remove any escaping that EJS might have added)
//   const unescapedTitle = title.replace(/\\'/g, "'").replace(/\\"/g, '"');
//   const unescapedContent = content.replace(/\\'/g, "'").replace(/\\"/g, '"');

//   document.getElementById("editPostTitle").value = unescapedTitle;
//   document.getElementById("editPostContent").value = unescapedContent;
//   document.getElementById("editPostForm").action = "/posts/" + postId + "/edit";
//   document.getElementById("editPostModal").classList.remove("hidden");
// }

/* ============================================================================ */
/*                              ERROR HANDLING ROUTES                           */
/* ============================================================================ */

// 404 - Page Not Found
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// 500 - Internal Server Error
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).render("500", { title: "Server Error" });
});

/* ============================================================================ */
/*                                  SERVER STARTUP                              */
/* ============================================================================ */

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Export app for testing purposes
module.exports = app;
