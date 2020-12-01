const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchGlobalNewsWire = async () => {
    console.log('Fetching from Global News Wire...')
    
    let response = await axios.get('http://www.globenewswire.com/')
    urlList = []
    
    $('.rl-container > .results-link > .post-title16px a', response.data).each((i, elem) => {
      urlList.push(elem.attribs.href)    
    })
  

    for(i = 0; i < urlList.length; i++) {

      let result = await dbHelper.globalNewsWireArticlesExists(urlList[i])

      if(result.length == 0) {
        let pageResponse = await axios.get(`http://www.globenewswire.com/` + urlList[i])      
        let articleHeading = $('.article-headline', pageResponse.data).text()
        let articleBody = $('.article-body', pageResponse.data).text()      

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
        await dbHelper.insertIntoGlobalNewsWire(urlList[i])
      }
    }
    console.log('Global News Wire Sync complete...') 
  }