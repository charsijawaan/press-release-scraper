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

        try {
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

                if(result.length === 0) {
                    try {
                        // let row = null
                        // let symbolsArray = null
                        let pageResponse = await axios.get(`https://www.businesswire.com` + urlList[i])
                        let articleHeading = $('.bw-release-main header', pageResponse.data).text()
                        let articleBody = $('.bw-release-body', pageResponse.data).text()

                        articleHeading = articleHeading.toLowerCase()
                        articleBody = articleBody.toLowerCase()

                        timeList[i].replace('T', ' ')
                        timeList[i].replace('Z', '')

                        if(articleHeading.includes('nasdaq') || articleBody.includes('nasdaq')) {
                            let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nasdaq')
                            if(symbolsArray.length === 0) {
                                symbolsArray.push('null')
                            }
                            let row = await dbHelper.insertIntoHits(`https://www.businesswire.com` + urlList[i], articleHeading, articleBody, timeList[i], symbolsArray[0], 'nasdaq')
                            if(symbolsArray[0] != 'null')
                                await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                        }
                        else if(articleHeading.includes('nyse') || articleBody.includes('nyse')) {
                            let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nyse')
                            if(symbolsArray.length === 0) {
                                symbolsArray.push('null')
                            }
                            let row = await dbHelper.insertIntoHits(`https://www.businesswire.com` + urlList[i], articleHeading, articleBody, timeList[i], symbolsArray[0], 'nyse')
                            if(symbolsArray[0] != 'null')
                                await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                        }
                        await dbHelper.insertIntoBusinessWire('https://www.businesswire.com' + urlList[i])
                    }
                    catch (ex) {
                        console.log(ex)
                    }
                }
            }
        }
        catch (ex) {
            console.log(ex)
        }

    }
    catch (ex) {
        console.log(ex)
    }

    console.log('Business Wire Sync complete...') 
}
