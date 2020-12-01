const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchAccessWire = async () => {
    console.log('Fetching from access wire...')
    
    let response = await axios.get('https://www.accesswire.com/users/api/newsroom')
    let articles = response.data.data.articles
  
      for(let i = 0; i < articles.length; i++) {
  
          let url = articles[i].releaseurl
          let title = articles[i].title
          let id = articles[i].id
          let date = articles[i].dateString
  
          let result = await dbHelper.accessWireArticlesExists(id)
  
          if(result.length == 0) {
              let pageResponse = await axios.get(url)
              let articleHeading = $('#articleHeading', pageResponse.data).text()
              let articleBody = $('#articleBody', pageResponse.data).text()
                            
              articleHeading = articleHeading.toLowerCase()
              articleHeading = articleHeading.replace(/\r?\n|\r/g, '')

              articleBody = articleBody.toLowerCase()
              articleBody = articleBody.replace(/\r?\n|\r/g, '')
        
              if(articleHeading.includes('nasdaq')) {
                let stockName = helpers.extractStockCompanyName(articleHeading, articleBody, 'nasdaq')
                await dbHelper.insertIntoHits(`http://www.globenewswire.com/` + urlList[i], articleHeading, articleBody, "2020", stockName, 'nasdaq')
            }
            else if(articleHeading.includes('nyse')) {
                let stockName = helpers.extractStockCompanyName(articleHeading, articleBody, 'nyse')
                await dbHelper.insertIntoHits(`http://www.globenewswire.com/` + urlList[i], articleHeading, articleBody, "2020", stockName, 'nyse')
            }
              await dbHelper.insertIntoAccessWire(articles[i])              
          }                              
      }
  
      console.log('Access Wire Sync complete...') 
  }