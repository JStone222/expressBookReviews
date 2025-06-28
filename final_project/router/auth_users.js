const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let users = require("./usersdb.js");  // <---- get shared users array

const regd_users = express.Router();

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid login credentials" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Validate inputs
    if (!review) {
      return res.status(400).json({ message: "Review text is required as a query parameter." });
    }
  
    const username = req.session.authorization?.accessToken
      ? jwt.verify(req.session.authorization.accessToken, 'access').username
      : null;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized: No valid session token found." });
    }
  
    // Check if book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found with the given ISBN." });
    }
  
    // If no reviews exist, initialize
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Add or update review
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully.",
      reviews: book.reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Verify JWT and extract username
    const token = req.session.authorization?.accessToken;
    let username;
  
    try {
      const decoded = jwt.verify(token, 'access');
      username = decoded.username;
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or missing session token." });
    }
  
    // Check if the book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found with the given ISBN." });
    }
  
    // Check if the review exists for this user
    if (book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({
        message: "Review deleted successfully.",
        reviews: book.reviews
      });
    } else {
      return res.status(404).json({ message: "No review found for this user on the given book." });
    }
});
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
