# Book Review API

A RESTful API for managing books and their reviews, built with Node.js, Express, and MySQL using Sequelize ORM.

## Project Structure

book-review-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── book.js
│   │   ├── review.js
│   │   ├── user.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── books.js
│   └── app.js
├── .env
└── package.json


## Features

1. **User Authentication**
   - User registration
   - User login with JWT authentication

2. **Book Management**
   - Create new books (protected route)
   - Get all books with pagination
   - Get book by ID
   - Search books by title or author
   - Filter books by genre and author

3. **Review System**
   - Add reviews to books (protected route)
   - Update reviews (protected route)
   - Delete reviews (protected route)
   - View book reviews

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Books
- GET `/api/books` - Get all books (with pagination)
- GET `/api/books/:id` - Get book by ID
- POST `/api/books` - Add new book (protected)
- GET `/api/books/search?q=query` - Search books

### Reviews
- POST `/api/books/:id/reviews` - Add review
- PUT `/api/books/:bookId/reviews/:reviewId` - Update review
- DELETE `/api/books/:bookId/reviews/:reviewId` - Delete review

## Issues Encountered & Solutions

1. **Search Route Not Working**
   - Issue: Search endpoint returning 404
   - Cause: Route order in books.js - search route placed after `:id` route
   - Solution: Moved search route before the `:id` route to prevent Express interpreting "search" as an ID

2. **Reviews Not Showing in Book Details**
   - Issue: Empty reviews array when fetching book details
   - Cause: Association between Book and Review models not properly set up
   - Solution: Added proper associations in models/index.js

3. **Review Updates/Deletes**
   - Issue: 404 errors when trying to update/delete reviews
   - Solution: Implemented proper review ownership verification using userId from JWT token

## Technologies Used
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing
