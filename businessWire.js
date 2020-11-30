const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchBusinessWire = async () => {
    console.log('Fetching from Business Wire...')
    let response = await axios.get('https://www.businesswire.com/portal/site/home/news/')
    let urlList = []
  
    let mainContainer = $('.bwNewsList', response.data)
  
    $('a', mainContainer.html()).each((i, elem) => {    
      urlList.push(elem.attribs.href)
    })
  
    urlList = helpers.getUnique(urlList)
  
    for(let i = 0; i < urlList.length; i++) {
      let result = await dbHelper.busineesWireArticlesExists(urlList[i])
  
      if(result.length == 0) {
        let pageResponse = await axios.get(`https://www.businesswire.com/` + urlList[i])
  
        let articleHeading = $('.bw-release-main header', pageResponse.data).text().trim()
        let articleBody = $('.bw-release-body', pageResponse.data).text()
        
        if(articleHeading.includes('NASDAQ') || articleHeading.includes('nasdaq')
                  || articleHeading.includes('NYSE') || articleHeading.includes('nyse')
                    || articleBody.includes('NASDAQ') || articleBody.includes('nasdaq')
                      || articleBody.includes('NYSE') || articleBody.includes('nyse')) {
                        console.log('WSJ HIT!!!')
  
        }
  
        await dbHelper.insertIntoBusinessWire(urlList[i])
      }
  
    }
    console.log('Business Wire Sync complete...') 
  }