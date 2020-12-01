const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchPrNewsWire = async () => {
    console.log('Fetching from Pr News Wire...')

    try {
      let response = await axios.get('https://www.prnewswire.com/news-releases/news-releases-list/')
      urlList = []
      
      let mainContainer = $('.col-md-8, .col-sm-8, .card-list, .card-list-hr', response.data)
      $('.row a', mainContainer.html()).each((i, elem) => {
        urlList.push(elem.attribs.href)
      })
    
      
      urlList = helpers.getUnique(urlList)
      
      for(let i = 0; i < urlList.length; i++) {
        let result = await dbHelper.prNewsWireArticlesExists(urlList[i])
    
        if(result.length == 0) {
          let pageResponse = await axios.get(`https://www.prnewswire.com/` + urlList[i])
          let articleHeading = $('.release-header .row:first-child', pageResponse.data).text()
          let articleBody = $('.release-body', pageResponse.data).text()      
          
          
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
  
          await dbHelper.insertIntoPrnewsWire(urlList[i])
        }
      }
    
      console.log('Pr News Wire Sync complete...') 
    }
    catch(error) {
      return
    } 
}