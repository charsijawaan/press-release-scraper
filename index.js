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
  accessWire.fetchAccessWire()
  globalNewsWire.fetchGlobalNewsWire()
  prNewsWire.fetchPrNewsWire()
  businessWire.fetchBusinessWire()
}

app.get('/start987654321', async function (req, res) {
  res.send('Program Started..')
  setInterval(() => {
    fetchAll()
  }, 70000)    
})



app.get('/home', async function (req, res) {
  
  let data = await dbHelper.getAllHits()
  
  res.render('home', {
    data: data
  })
})

const port = process.env.PORT || 3000;
app.listen(port)