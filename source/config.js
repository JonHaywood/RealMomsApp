var config = {};

// database settings
config.databaseConnectionString = process.env.DB || 'mongodb://localhost/realMomsAPI';

// application settings
config.env = process.env.NODE_ENV || 'development';
config.port = process.env.PORT || 8080;
config.ratePerChild = 3.50;
config.maxPerFamily = 9;

module.exports = config;