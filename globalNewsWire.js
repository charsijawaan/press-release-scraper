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
  
        if(articleHeading.includes('NASDAQ') || articleHeading.includes('nasdaq')
                  || articleHeading.includes('NYSE') || articleHeading.includes('nyse')
                    || articleBody.includes('NASDAQ') || articleBody.includes('nasdaq')
                      || articleBody.includes('NYSE') || articleBody.includes('nyse')) {
                        // Go to WSJ
                        console.log('WSJ HIT!!!')
  
        }
        await dbHelper.insertIntoGlobalNewsWire(urlList[i])
      }
    }
    console.log('Global News Wire Sync complete...') 
  }