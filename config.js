let config = {}
config.db = {}

// config.webAddress = 'http://localhost:3000/'
config.webAddress = 'https://alethia-app.herokuapp.com/'
config.sessionSecret = 'sdfkjkdfjg4578945yu89'

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
// module.exports = sessionSecret

