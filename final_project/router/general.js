const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./usersdb.js"); // shared users array

const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists. Please choose a different one." });
    }
  
    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const books = require('../booksdb.js');
  return res.status(200).send(JSON.stringify(books, null, 4));
});

const axios = require('axios');

// Get books using async/await with Axios
// Simulated async book fetch using Promise
public_users.get('/books-async', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          // Simulate async DB or API response
          setTimeout(() => {
            resolve(books);
          }, 100); // delay to simulate async
        });
      };
  
      const bookList = await getBooks();
      return res.status(200).json({
        message: "Books fetched using simulated async/await",
        books: bookList
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details by ISBN using async/await with simulated Promise
public_users.get('/books-async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const book = books[isbn];
            if (book) {
              resolve(book);
            } else {
              reject(new Error("Book not found with given ISBN"));
            }
          }, 100);
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json({
        message: "Book fetched using async/await",
        book: book
      });
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
  
    for (let key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given author." });
    }
  });

// Get book details by author using async/await (simulated with Promise)
public_users.get('/books-async/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
  
    try {
      const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const matchingBooks = [];
  
            for (let key in books) {
              if (books[key].author.toLowerCase() === author) {
                matchingBooks.push(books[key]);
              }
            }
  
            if (matchingBooks.length > 0) {
              resolve(matchingBooks);
            } else {
              reject(new Error("No books found for the given author."));
            }
          }, 100);
        });
      };
  
      const booksByAuthor = await getBooksByAuthor(author);
      return res.status(200).json({
        message: "Books fetched by author using async/await",
        books: booksByAuthor
      });
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
});
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchingBooks = [];
  
    for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
        matchingBooks.push(books[key]);
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with the given title." });
    }
  });

// Get book details by title using async/await (simulated with Promise)
public_users.get('/books-async/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
  
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const matchingBooks = [];
  
            for (let key in books) {
              if (books[key].title.toLowerCase() === title) {
                matchingBooks.push(books[key]);
              }
            }
  
            if (matchingBooks.length > 0) {
              resolve(matchingBooks);
            } else {
              reject(new Error("No books found with the given title."));
            }
          }, 100);
        });
      };
  
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json({
        message: "Books fetched by title using async/await",
        books: booksByTitle
      });
  
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found for the provided ISBN." });
    }
  });

module.exports.general = public_users;
