const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Determine the current environment (development, production, etc.)
const env = process.env.NODE_ENV || 'development';

// Get the database configuration for the current environment
const dbConfig = config[env];

// Create a new Sequelize instance with the database configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false, // Disable SQL query logging in the console
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Export the Sequelize instance for use in other parts of the application
module.exports = sequelize;