const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchPrNewsWire = async () => {
    console.log('Fetching from Pr News Wire...')
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
        
        if(articleHeading.includes('NASDAQ') || articleHeading.includes('nasdaq')
                  || articleHeading.includes('NYSE') || articleHeading.includes('nyse')
                    || articleBody.includes('NASDAQ') || articleBody.includes('nasdaq')
                      || articleBody.includes('NYSE') || articleBody.includes('nyse')) {
                        // Go to WSJ
                        console.log('WSJ HIT!!!')
  
        }
        await dbHelper.insertIntoPrnewsWire(urlList[i])
      }
    }
  
    console.log('Pr News Wire Sync complete...') 
  
  }