let mysql = require('mysql')
let config = require('./../config')

let conn = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.dbName
})

// connect to database with the config above
conn.connect()

module.exports = conn