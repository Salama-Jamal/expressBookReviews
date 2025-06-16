const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

  // Check if credentials are provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  // Search for the user
  const user = users.find(user => user.username === username);
  
  // Check if the user exists and the password is correct
  if (!user) {
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  if (user.password !== password) { // In a real application, you should hash the password and compare hashes
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  // Create JWT token
  const token = jwt.sign(
    { username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' } // Expires in 1 hour
  );

  return res.status(200).json({
    message: 'Login successful',
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
  const { review } = req.body;
  const token = req.headers['authorization'];

  // Check if token and review are provided
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }
  if (!review) {
    return res.status(400).json({ message: 'Review content is required' });
  }

  try {
    // Check if token is valid
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    const username = decoded.username;

    // Search for the book
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Initialize the reviews field if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    // Add/modify the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: 'Review added/modified successfully',
      book: books[isbn]
    });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers['authorization'];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    // Check if token is valid
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    const username = decoded.username;

    // Search for the book
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if there are reviews for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'No review found for this user' });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: 'Review deleted successfully',
      book: books[isbn]
    });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
