const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchPrNewsWire = async () => {
    console.log('Fetching from Pr News Wire...')

    try {
        let response = await axios.get('https://www.prnewswire.com/news-releases/news-releases-list/')
        let urlList = []

        try {
            let mainContainer = $('.col-md-8, .col-sm-8, .card-list, .card-list-hr', response.data)
            $('.row a', mainContainer.html()).each((i, elem) => {
                urlList.push(elem.attribs.href)
            })

            urlList = helpers.getUnique(urlList)

            for(let i = 0; i < urlList.length; i++) {

                let result = await dbHelper.prNewsWireArticlesExists(urlList[i])

                if(result.length == 0) {

                    try {
                        let pageResponse = await axios.get(`https://www.prnewswire.com/` + urlList[i])
                        let articleHeading = $('.release-header .row:first-child', pageResponse.data).text()
                        let articleBody = $('.release-body', pageResponse.data).text()

                        articleHeading = articleHeading.toLowerCase()
                        articleBody = articleBody.toLowerCase()

                        if(articleHeading.includes('nasdaq') || articleBody.includes('nasdaq')) {
                            let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nasdaq')
                            if(symbolsArray.length === 0) {
                                symbolsArray.push('null')
                            }
                            let row = await dbHelper.insertIntoHits(`https://www.prnewswire.com` + urlList[i], articleHeading, articleBody, "2020", symbolsArray[0], 'nasdaq')
                            if(symbolsArray[0] != 'null')
                                await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                        }
                        else if(articleHeading.includes('nyse') || articleBody.includes('nyse')) {
                            let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nyse')
                            if(symbolsArray.length === 0) {
                                symbolsArray.push('null')
                            }
                            let row = await dbHelper.insertIntoHits(`https://www.prnewswire.com` + urlList[i], articleHeading, articleBody, "2020", symbolsArray[0], 'nyse')
                            if(symbolsArray[0] != 'null')
                                await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                        }
                    }
                    catch (ex) {
                        console.log(ex)
                    }
                    await dbHelper.insertIntoPrnewsWire('https://www.prnewswire.com' + urlList[i])
                }
            }
        }
        catch (ex) {
            console.log(ex)
        }

      console.log('Pr News Wire Sync complete...')
    }
    catch(error) {
      return
    } 
}