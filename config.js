let config = {}

config.db = {}

// Local Database config
// config.db.host = 'localhost'
// config.db.user = 'root'
// config.db.password = ''
// config.db.dbName = 'scraper_db'
// config.db.port = 3306

// Remote Database config
config.db.host = 'scraper-database.cohesbi5e4hv.us-east-2.rds.amazonaws.com'
config.db.user = 'admin'
config.db.password = 'Createyour1'
config.db.dbName = 'scraper_db'
config.db.port = 3306

module.exports = config

