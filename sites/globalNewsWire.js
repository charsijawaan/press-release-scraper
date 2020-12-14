const axios = require('axios')
const $ = require('cheerio')
const helpers = require('./../util/helpers')
const dbHelper = require('./../database/dbHelper')

module.exports.fetchGlobalNewsWire = async () => {
    console.log('Fetching from Global News Wire...')

    try {
        for (let page = 1; page <= 6; page++) {
            let url = `http://www.globenewswire.com/Index?page=${page}#pagerPos`

            let response = await axios.get(url)

            let urlList = []

            try {
                $('.rl-container > .results-link > .post-title16px a', response.data).each((i, elem) => {
                    urlList.push(elem.attribs.href)
                })
    
                for (let i = 0; i < urlList.length; i++) {
    
                    let result = await dbHelper.globalNewsWireArticlesExists(`http://www.globenewswire.com` + urlList[i])
    
                    if (result.length === 0) {
    
                        try {
                            let pageResponse = await axios.get(`http://www.globenewswire.com/` + urlList[i])
                            let articleMetaData = $('#post-content-metadata', pageResponse.data)
                            let articleHeading = $('.article-headline', pageResponse.data).text()
                            let articleBody = $('.article-body', pageResponse.data).text()
                            let articleTime = null
    
                            $('time', articleMetaData.html()).each((i, elem) => {
                                let timestr = elem.children[0].data
                                articleTime = helpers.convertGlobalNewsTime(timestr)
                            })                        
    
                            articleHeading = articleHeading.toLowerCase()
                            articleBody = articleBody.toLowerCase()
    
                            if (articleHeading.includes('nasdaq') || articleBody.includes('nasdaq')) {
                                let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nasdaq')
                                if(symbolsArray.length === 0) {
                                    symbolsArray.push('null')
                                }
                                let row = await dbHelper.insertIntoHits(`http://www.globenewswire.com` + urlList[i], articleHeading, articleBody, articleTime, symbolsArray[0], 'nasdaq')
                                if(symbolsArray[0] != 'null')
                                    await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                            }
                            else if (articleHeading.includes('nyse') || articleBody.includes('nyse')) {
                                let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nyse')
                                if(symbolsArray.length === 0) {
                                    symbolsArray.push('null')
                                }
                                let row = await dbHelper.insertIntoHits(`http://www.globenewswire.com` + urlList[i], articleHeading, articleBody, articleTime, symbolsArray[0], 'nyse')
                                if(symbolsArray[0] != 'null')
                                    await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                            }
                            await dbHelper.insertIntoGlobalNewsWire(`http://www.globenewswire.com` + urlList[i])
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
        console.log('Global News Wire Sync complete...')
    }
    catch (error) {
        console.log(error)
        return
    }
}