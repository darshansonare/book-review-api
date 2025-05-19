const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Book, Review } = require('../models');
const { Op } = require('sequelize');
// Get all books
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, author } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (genre) where.genre = genre;
    if (author) where.author = author;
    
    const books = await Book.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      books: books.rows,
      totalPages: Math.ceil(books.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search books
router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }
  
      const books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { author: { [Op.like]: `%${q}%` } }
          ]
        }
      });
  
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: Review,
        attributes: ['rating', 'comment']
      }]
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new book (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const book = await Book.create({
      title,
      author,
      genre,
      description
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


  
  router.post('/:id/reviews', auth, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const bookId = req.params.id;
      const userId = req.user.id;
  
      // Check if book exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Check if user already reviewed this book
      const existingReview = await Review.findOne({
        where: {
          bookId,
          userId
        }
      });
  
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this book' });
      }
  
      // Create the review
      const review = await Review.create({
        rating,
        comment,
        bookId,
        userId
      });
  
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
 
  
  // Update review
router.put('/:bookId/reviews/:reviewId', auth, async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const { bookId, reviewId } = req.params;
      const userId = req.user.id;
  
      const review = await Review.findOne({
        where: {
          id: reviewId,
          bookId,
          userId
        }
      });
  
      if (!review) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
      }
  
      await review.update({ rating, comment });
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete review
  router.delete('/:bookId/reviews/:reviewId', auth, async (req, res) => {
    try {
      const { bookId, reviewId } = req.params;
      const userId = req.user.id;
  
      const review = await Review.findOne({
        where: {
          id: reviewId,
          bookId,
          userId
        }
      });
  
      if (!review) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
      }
  
      await review.destroy();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;