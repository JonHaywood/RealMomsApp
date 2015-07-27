var config = {};

// database settings
config.databaseConnectionString = process.env.DB || 'mongodb://localhost/realMomsAPI';

// application settings
config.port = process.env.PORT || 8000;
config.ratePerChild = 2;
config.maxPerFamily = 5;

module.exports = config;