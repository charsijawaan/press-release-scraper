const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchBusinessWire = async () => {

    console.log('Fetching from Business Wire...')

    try {
        let response = await axios.get('https://www.businesswire.com/portal/site/home/news/')
        let urlList = []
        let timeList = []
  
        let mainContainer = $('.bwNewsList', response.data)
    
        $('.bwTimestamp > time', mainContainer.html()).each((i, elem) => {
            timeList.push(elem.attribs.datetime)
        })


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

                articleHeading = articleHeading.toLowerCase().replace(/\r?\n|\r/g, '')
                articleBody = articleBody.toLowerCase().replace(/\r?\n|\r/g, '')

                timeList[i].replace('T', ' ')
                timeList[i].replace('Z', '')
  
                if(articleHeading.includes('nasdaq') || articleBody.includes('nasdaq')) {
                    let stockName = helpers.extractStockCompanyName(articleHeading, articleBody, 'nasdaq')
                    await dbHelper.insertIntoHits(`https://www.businesswire.com/` + urlList[i], articleHeading, articleBody, timeList[i], stockName, 'nasdaq')
                }
                else if(articleHeading.includes('nyse') || articleBody.includes('nyse')) {
                    let stockName = helpers.extractStockCompanyName(articleHeading, articleBody, 'nyse')
                    await dbHelper.insertIntoHits(`https://www.businesswire.com/` + urlList[i], articleHeading, articleBody, timeList[i], stockName, 'nyse')
                }
                await dbHelper.insertIntoBusinessWire(urlList[i])
            }
        }
    console.log('Business Wire Sync complete...') 
    }
    catch(error) {
      console.log(error)
      return
    }    
}