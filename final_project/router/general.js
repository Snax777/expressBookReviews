const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Not all registration details are provided." });
  }

  if (!isValid(username)) {
    users.push({username: username, password: password});

    return res.status(200).json({message: "User successfully registered."});
  } else {
    return res.status(404).json({message: "User already exists."});
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;

  res.send(books[bookISBN]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const bookAuthor = req.params.author;

  const bookDetailsByAuthor = Object.values(books).filter(
    (book) => book.author === bookAuthor
  );

  res.send(bookDetailsByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;

  const bookDetailsByTitle = Object.values(books).filter(
    (book) => book.title === bookTitle
  );

  res.send(bookDetailsByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;

  res.send(books[bookISBN].reviews);
});

module.exports.general = public_users;
