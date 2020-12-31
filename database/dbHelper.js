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
    },

    insertIntoWSJ: (id, ticker, publicFloat, publicFloatUnitPart, marketCap,
                    marketCapUnitPart, volume, changeFromLast, changeFromLastUnitPart,
                    _52WeekRangeStart, _52WeekRangeEnd, stockPriceAtClose, stockPriceAfterHours, percentOfFloat, percentOfFloatUnitPart) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `INSERT INTO wsj (id, ticker, public_float, public_float_unit_part, 
            market_cap, market_cap_unit_part, volume, change_from_last, change_from_last_unit_part,
             start_52_week_range, end_52_week_range, stock_price_at_close, stock_price_after_hours, percent_of_float, percent_of_float_unit_part) 
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            conn.query(sqlQuery, [id, ticker, publicFloat, publicFloatUnitPart, marketCap,
                marketCapUnitPart, volume, changeFromLast, changeFromLastUnitPart,
                _52WeekRangeStart, _52WeekRangeEnd, stockPriceAtClose, stockPriceAfterHours, percentOfFloat, percentOfFloatUnitPart], (err, rows, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(rows)
            })
        })
    },

    getDataWSJ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT wsj.*, hits.date, hits.url, hits.heading, hits.market_name 
            FROM wsj INNER JOIN hits ON wsj.id = hits.id ORDER BY hits.date DESC`
            conn.query(sqlQuery, [], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    getHitsWithoutWSJ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM hits WHERE NOT EXISTS (SELECT * FROM wsj WHERE wsj.id = hits.id) ORDER BY hits.date DESC'
            conn.query(sqlQuery, [], (err, res, fileds) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    getAllErrorsFromWSJ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT * FROM wsj WHERE public_float = ? AND public_float_unit_part = ? 
            AND market_cap = ? AND market_cap_unit_part = ? AND volume = ? AND change_from_last = ? 
            AND change_from_last_unit_part = ? AND start_52_week_range = ? AND end_52_week_range = ? 
            AND stock_price_at_close = ? AND stock_price_after_hours = ?`
            conn.query(sqlQuery, [0,0,0,0,0,0,0,0,0,0,0], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    getHitWithID: (id) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT * FROM hits WHERE id = ? LIMIT 1`
            conn.query(sqlQuery, [id], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteRowInBusinessNewsWire: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM businesswire_articles WHERE url = ? LIMIT 1`
            conn.query(sqlQuery, [url], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteRowInGlobalNewsWire: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM globalnewswire_articles WHERE url = ? LIMIT 1`
            conn.query(sqlQuery, [url], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteRowInPrNewsWire: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM prnewswire_articles WHERE url = ? LIMIT 1`
            conn.query(sqlQuery, [url], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteRowInAccessNewsWire: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM accesswire_articles WHERE url = ? LIMIT 1`
            conn.query(sqlQuery, [url], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteRowInhits: (url) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM hits WHERE url = ? LIMIT 1`
            conn.query(sqlQuery, [url], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteErrorsInWSJ: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE FROM wsj WHERE public_float = ? AND public_float_unit_part = ? 
            AND market_cap = ? AND market_cap_unit_part = ? AND volume = ? AND change_from_last = ? 
            AND change_from_last_unit_part = ? AND start_52_week_range = ? AND end_52_week_range = ? 
            AND stock_price_at_close = ? AND stock_price_after_hours = ?`
            conn.query(sqlQuery, [0,0,0,0,0,0,0,0,0,0,0], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    deleteOldData: () => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `DELETE hits, wsj FROM hits INNER JOIN wsj ON hits.id = wsj.id WHERE hits.date < DATE_SUB(Date(NOW()), INTERVAL 3 DAY)`
            conn.query(sqlQuery, [], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    checkLogin: (username, password) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT * FROM login_details WHERE username = ? AND password = ? LIMIT 1`
            conn.query(sqlQuery, [username, password], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    },

    updateAdminPass: (password) => {
        return new Promise((resolve, reject) => {
            let sqlQuery = `UPDATE login_details SET password = ?`
            conn.query(sqlQuery, [password], (err, res, fields) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    }

}

