var config = {};

// database settings
config.databaseConnectionString = process.env.DB || 'mongodb://localhost/realMomsAPI';

// application settings
config.env = process.env.NODE_ENV || 'development';
config.port = (process.env.NODE_ENV === 'production' ? 80 : (process.env.PORT || 8000));
config.ratePerChild = 2;
config.maxPerFamily = 5;

module.exports = config;