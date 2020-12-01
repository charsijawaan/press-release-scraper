const helpers = require('./helpers')
const businessWire = require('./businessWire')
const accessWire = require('./accessWire')
const globalNewsWire = require('./globalNewsWire')
const prNewsWire = require('./prNewsWire')

// Run 24/7
run = async () => {
  while(true) {         
  
    accessWire.fetchAccessWire()
    globalNewsWire.fetchGlobalNewsWire()
    prNewsWire.fetchPrNewsWire()
    businessWire.fetchBusinessWire()

    // Now Snooze the server
    snoozeTime = Math.random() * (200000 - 30000) + 30000
    console.log('Now Snoozing for ' + (snoozeTime/1000) + ' seconds...')
    await helpers.snooze(snoozeTime)
  }  
}

run()