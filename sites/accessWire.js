const axios = require('axios')
const $ = require('cheerio')
const helpers = require('./../util/helpers')
const dbHelper = require('./../database/dbHelper')

module.exports.fetchAccessWire = async () => {
    console.log('Fetching from access wire...')
    try {
        let response = await axios.get('https://www.accesswire.com/users/api/newsroom')
        let articles = response.data.data.articles
  
      for(let i = 0; i < articles.length; i++) {

          try {
              let url = articles[i].releaseurl
              let title = articles[i].title
              let id = articles[i].id
              let date = articles[i].adate

              date = date.replace('T', ' ')
              date = date.replace('Z', '')

              let result = await dbHelper.accessWireArticlesExists(id)

              if(result.length === 0) {
                  let pageResponse = await axios.get(url)
                  let articleHeading = $('#articleHeading', pageResponse.data).text()
                  let articleBody = $('#articleBody', pageResponse.data).text()

                  articleHeading = articleHeading.toLowerCase()
                  articleBody = articleBody.toLowerCase()

                  if(articleHeading.includes('nasdaq') || articleBody.includes('nasdaq')) {
                      let symbolsArray = helpers.getSymbols(articleHeading + ' ' + articleBody, 'nasdaq')
                      if(symbolsArray.length === 0) {
                          symbolsArray.push('null')
                      }
                      let row = await dbHelper.insertIntoHits(url, articleHeading, articleBody, date, symbolsArray[0], 'nasdaq')
                      if(symbolsArray[0] != 'null')
                          await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                  }
                  else if(articleHeading.includes('nyse') || articleBody.includes('nyse')) {
                      let symbolsArray = helpers.getSymbols(articleHeading + ' '+ articleBody, 'nyse')
                      if(symbolsArray.length === 0) {
                          symbolsArray.push('null')
                      }
                      let row = await dbHelper.insertIntoHits(url, articleHeading, articleBody, date, symbolsArray[0], 'nyse')
                      if(symbolsArray[0] != 'null')
                          await helpers.crawlWSJ(row.insertId, symbolsArray[0])
                  }
                  await dbHelper.insertIntoAccessWire(articles[i])
              }
          }
          catch (ex) {
              console.log(ex)
          }
      }
      console.log('Access Wire Sync complete...') 
    }
    catch(error) {
        return
    }    
}