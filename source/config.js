var config = {};

// database settings
config.databaseConnectionString = 'mongodb://localhost/realMomsAPI';

// application settings
config.defaultPort = 8000;
config.ratePerChild = 2;
config.maxPerFamily = 5;

module.exports = config;