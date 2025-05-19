const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('book_review_db', 'root', 'Pass@123', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;