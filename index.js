const express = require('express')
const app = express()
let hbs = require('hbs')
const dbHelper = require('./database/dbHelper')
const businessWire = require('./sites/businessWire')
const accessWire = require('./sites/accessWire')
const globalNewsWire = require('./sites/globalNewsWire')
const prNewsWire = require('./sites/prNewsWire')

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

async function fetchAll() {
  await businessWire.fetchBusinessWire()
  await accessWire.fetchAccessWire()
  await globalNewsWire.fetchGlobalNewsWire()
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