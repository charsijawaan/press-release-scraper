let conn = require('./dbConnection')

module.exports = {
    insertIntoAccessWire: (article) => {        
        return new Promise((resolve, reject) => {
            let sqlQuery = 'INSERT INTO accesswire_articles (id, url, title) VALUES(?,?,?)'
            conn.query(sqlQuery, [article.id, article.releaseurl, article.title], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },
    
    accessWireArticlesExists: (id) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM accesswire_articles WHERE id = ?'
            conn.query(sqlQuery, [id], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    insertIntoGlobalNewsWire: (url) => {        
        return new Promise((resolve, reject) => {
            let sqlQuery = 'INSERT INTO globalnewswire_articles (url) VALUES(?)'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    globalNewsWireArticlesExists: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM globalnewswire_articles WHERE url = ?'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    prNewsWireArticlesExists: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM prnewswire_articles WHERE url = ?'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    insertIntoPrnewsWire: (url) => {        
        return new Promise((resolve, reject) => {
            let sqlQuery = 'INSERT INTO prnewswire_articles (url) VALUES(?)'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    busineesWireArticlesExists: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM businesswire_articles WHERE url = ?'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    insertIntoBusinessWire: (url) => {        
        return new Promise((resolve, reject) => {
            let sqlQuery = 'INSERT INTO businesswire_articles (url) VALUES(?)'
            conn.query(sqlQuery, [url], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    insertIntoHits: (url, heading, body, date, stockName, marketName) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'INSERT INTO hits (url, heading, body, date , stock_name, market_name) VALUES(?,?,?,?,?,?)'
            conn.query(sqlQuery, [url, heading, body, date, stockName, marketName], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    getAllHits: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM hits'
            conn.query(sqlQuery, [], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    }

}

