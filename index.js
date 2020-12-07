const helpers = require('./helpers')
const businessWire = require('./businessWire')
const accessWire = require('./accessWire')
const globalNewsWire = require('./globalNewsWire')
const prNewsWire = require('./prNewsWire')
const express = require('express')
const app = express()
let hbs = require('hbs')
const dbHelper = require('./dbHelper')

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

async function fetchAll() {
  //await businessWire.fetchBusinessWire()
  // await accessWire.fetchAccessWire()
  // await globalNewsWire.fetchGlobalNewsWire()
   await prNewsWire.fetchPrNewsWire()
}

app.get('/', async function (req, res) {
  
  let data = await dbHelper.getAllHits()
  
  res.render('home', {
    data: data
  })

})

app.get('/stay_awake',(req,res) => {
  return res.send('Hello');
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log('Crawler Started...')
  await fetchAll()
})