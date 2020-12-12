let cron = require('node-cron')
const express = require('express')
const app = express()
let hbs = require('hbs')
const dbHelper = require('./database/dbHelper')
const businessWire = require('./sites/businessWire')
const accessWire = require('./sites/accessWire')
const globalNewsWire = require('./sites/globalNewsWire')
const prNewsWire = require('./sites/prNewsWire')
const helpers = require('./util/helpers')

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))

async function fetchAll() {
  await businessWire.fetchBusinessWire()
  await accessWire.fetchAccessWire()
  await globalNewsWire.fetchGlobalNewsWire()
  await prNewsWire.fetchPrNewsWire()
  await removeErrors()
}

async function removeErrors() {
  console.log('Removing Errors..')
  try {
    let res = await dbHelper.getAllErrorsFromWSJ()
    await dbHelper.deleteErrorsInWSJ()

    for(let i = 0; i < res.length; i++) {
      let foo = await dbHelper.getHitWithID(res[i].id)

      await dbHelper.deleteRowInhits(foo[0].url)

      if(helpers.extractHostname(foo[0].url) === 'www.businesswire.com') {
        await dbHelper.deleteRowInBusinessNewsWire(foo[0].url)
      }
      else if(helpers.extractHostname(foo[0].url) === 'www.globenewswire.com') {
        await dbHelper.deleteRowInGlobalNewsWire(foo[0].url)
      }
      else if (helpers.extractHostname(foo[0].url) === 'www.accesswire.com') {
        await dbHelper.deleteRowInAccessNewsWire(foo[0].url)
      }
      else if (helpers.extractHostname(foo[0].url) === 'www.prnewswire.com') {
        await dbHelper.deleteRowInPrNewsWire(foo[0].url)
      }
    }
    console.log('Errors Removed')
  }  
  catch(ex) {
    console.log(ex)
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('Cleaning Database..')
  await dbHelper.deleteOldData()
  console.log('Database Cleaned')
})

app.get('/hits', async function (req, res) {
  
  let data = await dbHelper.getAllHits()
  
  res.render('home', {
    data: data
  })

})

app.get('/', async (req, res) => {
  
  if (req.query.atCloseMin != undefined && req.query.atCloseMax != undefined) {
    
  }

  if (req.query.afterHoursMin != undefined && req.query.afterHoursMax != undefined) {
    
  }

  if (req.query.floatMin != undefined && req.query.floatMax != undefined) {
    
  }

  if (req.query.volumeMin != undefined && req.query.volumeMax != undefined) {
    
  }

  let data = await dbHelper.getDataWSJ()
  res.render('index', {
      data: data
  })

})

app.get('/stay_awake',(req,res) => {
  return res.send('Hello');
})

const port = process.env.PORT || 3000

app.listen(port, async () => {
  console.log('Crawler Started...')

  await fetchAll()

  setInterval(async () => {
    await fetchAll()
  }, 700000)

})