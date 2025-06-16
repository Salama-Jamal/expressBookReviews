const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
      const { username, password } = req.body;

  // Check if username and password exist
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  // Check that the username is not already registered
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({
      message: 'Username already exists'
    });
  }

  // Register the new user
  const newUser = {
    username,
    password // In a real application, you should hash the password before storing it
  };
  
  users.push(newUser);
  
  return res.status(201).json({
    message: 'User registered successfully',
    user: {
      username: newUser.username
      // We do not return the password for security reasons
    }
  });
   res.send(JSON.stringify(books, null, 2));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users[username]) {
    return res.status(409).json({message: "Username already exists"});
  }

  users[username] = {password: password};
  req.session.authorization = {
    accessToken: jwt.sign({data: password}, 'access', {expiresIn: 60 * 60})
  };
  
  return res.status(200).json({message: "User successfully registered"});
});
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here`
    const isbn = req.params.isbn;
  
  // Find the book in the book matrix
  const book = books[isbn];
  
  if (book) {
    // If a book exists, return its details in an organized fashion
    res.send(JSON.stringify(book, null, 2));
  } else {
    // If the book does not exist, returns an error message
    res.status(404).send('Book not found');
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Retrieve the author's name from the request parameters
  const author = req.params.author;
  let booksByAuthor = [];
  
 // Get all the ISBN keys for books
  const isbns = Object.keys(books);
  
  // Iterate through all books to search for books by the desired author
  for (let isbn of isbns) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  
  if (booksByAuthor.length > 0) {
    // If you find books by the author, return them in an organized manner
    res.send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    // If there are no books by the author, return an error message
    res.status(404).send('No books found for this author');
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Retrieve the address from the request parameters
  const title = req.params.title;
  let booksByTitle = [];
  
  // Get all the ISBN keys for books
  const isbns = Object.keys(books);

  // Iterate through all books to search for the book by the desired title
  for (let isbn of isbns) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[isbn]);
    }
  }
  
  if (booksByTitle.length > 0) {
    // If you find the book, return its details in an organized manner
    res.send(JSON.stringify(booksByTitle, null, 2));
  } else {
    // If the book does not exist, return an error message
    res.status(404).send('No books found with this title');
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  // Retrieve ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Find the book in the book object
  const book = books[isbn];
  
  if (book && book.reviews) {
    // If the book exists and has reviews, return the reviews in an organized manner
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    // If the book does not exist or does not have reviews
    res.status(404).send('No reviews found for this book');
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

const axios = require('axios');
const BOOK_TITLE = 'Harry Potter'; // Replace with an existing book title in your data

// 1. Using Callback
function getBooksByTitleCallback(title, callback) {
  const encodedTitle = encodeURIComponent(title);
  axios.get(`http://localhost:5000/title/${encodedTitle}`)
    .then(response => callback(null, response.data))
    .catch(error => callback(error, null));
}

// 2. Using Promise
function getBooksByTitlePromise(title) {
  return new Promise((resolve, reject) => {
    const encodedTitle = encodeURIComponent(title);
    axios.get(`http://localhost:5000/title/${encodedTitle}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// 3. Using Async/Await
async function getBooksByTitleAsync(title) {
  try {
    const encodedTitle = encodeURIComponent(title);
    const response = await axios.get(`http://localhost:5000/title/${encodedTitle}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function tests
console.log(`=== Testing Books by Title: ${BOOK_TITLE} ===`);

// Callback Tests
getBooksByTitleCallback(BOOK_TITLE, (err, data) => {
  if (err) {
    console.error('Callback Error:', err.response?.data?.message || err.message);
  } else {
    console.log('Callback Success:');
    console.log(JSON.stringify(data, null, 2));
  }
});

// Promise Test
getBooksByTitlePromise(BOOK_TITLE)
  .then(data => {
    console.log('Promise Success:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => console.error('Promise Error:', err.response?.data?.message || err.message));

// Async/Await Test
// اختبار Async/Await
(async () => {
  try {
    const books = await getBooksByTitleAsync(BOOK_TITLE);
    console.log('Async/Await Success:');
    console.log(JSON.stringify(books, null, 2));
  } catch (err) {
    console.error('Async/Await Error:', err.response?.data?.message || err.message);
  }
})();
module.exports.general = public_users;
