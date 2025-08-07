const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const existingUsername = users.filter((user) => user.username === username);

  if (existingUsername.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  const existingUser = users.filter(
    (user) => user.username === username && user.password === password
  );

  if (existingUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Not all login details are provided." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        name: username,
        userPassword: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send(`Welcome back ${username}`);
  } else {
    return res
      .status(400)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.name;
  const review = req.body.review;
  const bookISBN = req.params.isbn;

  if (!Object.keys(books).find((isbn) => isbn === bookISBN)) {
    return res.status(404).send(`Book with book number ${bookISBN} not found`);
  } else {
    let bookReviews = books[bookISBN].reviews;

    userReviewFound = Object.keys(bookReviews).find(
      (name) => name === username
    );

    if (userReviewFound) {
      bookReviews[username] = review;
      books[bookISBN].reviews = bookReviews;

      return res.status(200).send("Review successfully updated.");
    } else {
      bookReviews = {
        ...bookReviews,
        [username]: review,
      };
      books[bookISBN].reviews = bookReviews;

      return res.status(200).send("Review successfully added.");
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.name;
  const bookISBN = req.params.isbn;

  if (!Object.keys(books).find((isbn) => isbn === bookISBN)) {
    return res.status(404).send(`Book with book number ${bookISBN} not found`);
  } else {
    let reviews = books[bookISBN].reviews;

    if (!Object.keys(reviews).find((name) => name === username)) {
      return res.status(404).send(`Review of ${username} not found`);
    } else {
      delete books[bookISBN].reviews[username];

      return res.status(200).send("Review successfully deleted.");
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
