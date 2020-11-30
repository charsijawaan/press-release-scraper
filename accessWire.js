const axios = require('axios')
const dbHelper = require('./dbHelper')
const $ = require('cheerio')
const helpers = require('./helpers')

module.exports.fetchAccessWire = async () => {
    console.log('Fetching from access wire...')
    
    let response = await axios.get('https://www.accesswire.com/users/api/newsroom')
    let articles = response.data.data.articles
  
      for(let i = 0; i < articles.length; i++) {
  
          let url = articles[i].releaseurl
          let title = articles[i].title
          let id = articles[i].id
          let date = articles[i].dateString
  
          let result = await dbHelper.accessWireArticlesExists(id)
  
          if(result.length == 0) {
              let pageResponse = await axios.get(url)
              let articleHeading = $('#articleHeading', pageResponse.data).text()
              let articleBody = $('#articleBody', pageResponse.data).text()
              
              if(articleHeading.includes('NASDAQ') || articleHeading.includes('nasdaq')
                  || articleHeading.includes('NYSE') || articleHeading.includes('nyse')
                    || articleBody.includes('NASDAQ') || articleBody.includes('nasdaq')
                      || articleBody.includes('NYSE') || articleBody.includes('nyse')) {
                        // Go to WSJ
                        console.log('WSJ HIT!!!')
  
              }
              await dbHelper.insertIntoAccessWire(articles[i])              
          }                              
      }
  
      console.log('Access Wire Sync complete...') 
  }