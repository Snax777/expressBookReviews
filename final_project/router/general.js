const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Not all registration details are provided." });
  }

  if (!isValid(username)) {
    users.push({ username: username, password: password });

    return res.status(200).json({ message: "User successfully registered." });
  } else {
    return res.status(404).json({ message: "User already exists." });
  }
});

// Helper endpoint for Tasks 10 to 13
public_users.get("/books", function (req, res) {
  res.json(books);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10
public_users.get("/books/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000");

    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch {
    res.status(404).send("Data not found");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  const isbnArray = Object.keys(books);

  if (isbnArray.find((isbn) => isbn === bookISBN)) {
    return res.status(200).send(books[bookISBN]);
  } else {
    return res.status(404).send(`Data with ISBN number ${bookISBN} not found.`);
  }
});

// Task 11
public_users.get("/books/isbn/:isbn", async function (req, res) {
  const bookISBN = req.params.isbn;

  try {
    const response = await axios.get("http://localhost:5000");
    const data = response.data;

    const doesISBNExist = Object.keys(data).find((isbn) => isbn === bookISBN);

    if (doesISBNExist) {
      return res.status(200).send(data[bookISBN]);
    } else {
      return res
        .status(404)
        .send(`Book with ISBN number ${bookISBN} does not exist.`);
    }
  } catch {
    res.status(500).send("Server is down.");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const bookAuthor = req.params.author;

  const bookDetailsByAuthor = Object.values(books).filter(
    (book) => book.author === bookAuthor
  );

  if (bookDetailsByAuthor.length > 0) {
    return res.status(200).send(bookDetailsByAuthor);
  } else {
    return res.status(404).send(`Book(s) written by ${bookAuthor} not found.`);
  }
});

// Task 12
public_users.get("/books/author/:author", async function (req, res) {
  const bookAuthor = req.params.author;

  try {
    const response = await axios.get("http://localhost:5000");
    const data = response.data;

    const bookDetailsByAuthor = Object.values(data).filter(
      (book) => book.author === bookAuthor
    );

    if (bookDetailsByAuthor.length > 0) {
      return res.status(200).send(bookDetailsByAuthor);
    } else {
      return res
        .status(404)
        .send(`Book(s) written by ${bookAuthor} not found.`);
    }
  } catch {
    res.status(500).send("Server is down.");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;

  const bookDetailsByTitle = Object.values(books).filter(
    (book) => book.title === bookTitle
  );

  if (bookDetailsByTitle.length > 0) {
    return res.status(200).send(bookDetailsByTitle);
  } else {
    return res.status(404).send(`Book(s) with title ${bookTitle} not found.`);
  }
});

// Task 13
public_users.get("/books/title/:title", async function (req, res) {
  const bookTitle = req.params.title;

  try {
    const response = await axios.get("http://localhost:5000");
    const data = response.data;

    const bookDetailsByTitle = Object.values(data).filter(
      (book) => book.title === bookTitle
    );

    if (bookDetailsByTitle.length > 0) {
      return res.status(200).send(bookDetailsByTitle);
    } else {
      return res.status(404).send(`Book(s) with title ${bookTitle} not found.`);
    }
  } catch {
    res.status(500).send("Server is down.");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;

  if (Object.keys(books).find((isbn) => isbn === bookISBN)) {
    return res.status(200).send(books[bookISBN].reviews);
  } else {
    return res
      .status(404)
      .send(
        `Review(s) not found - book with ISBN number ${bookISBN} not found`
      );
  }
});

module.exports.general = public_users;
