require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Book Review API' });
});

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });