var config = {};

// database settings
config.databaseConnectionString = process.env.DB || 'mongodb://localhost/realMomsAPI';

// application settings
config.env = process.env.NODE_ENV || 'development';
config.port = process.env.PORT;
config.ratePerChild = 2;
config.maxPerFamily = 5;

module.exports = config;