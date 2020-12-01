const puppeteer = require('puppeteer')
const dbHelper = require('./dbHelper')

module.exports.snooze = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports.getUnique = (array) => {
    let uniqueArray = []
  
    for(let value of array){
        if(uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value)
        }
    }
    return uniqueArray
}

module.exports.extractStockCompanyName = (heading, body, marketName) => {
    let res = body.split(marketName)
    if(res[1][0] === ':' || res[1][1] === ':') {
        let closeBracketIndex = res[1].indexOf(')')
        let stockName = res[1].substring(0, closeBracketIndex);
        stockName = stockName.replace(' ', '')
        stockName = stockName.replace(':', '')
        return stockName
    }
    else {
        console.log('Cannot get Company Name')
        return "error"
    }
}

module.exports.crawlWSJ = async (id, ticker) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://www.wsj.com/market-data/quotes/${ticker}`, { waitUntil: 'networkidle2' });

    /*
      _1 is public float
      _2 is market cap
      _3 is volume
      _4 is change from last
    */
    const _1 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[5]/div/span'))[0];
    const _2 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[3]/div/span/text()'))[0];
    const _3 = (await page.$x('//*[@id="quote_volume"]'))[0];
    const _4 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[2]/ul/li[2]/div/span/span'))[0];

    let publicFloat = await page.evaluate(el => {
        return el.textContent;
    }, _1);

    let marketCap = await page.evaluate(el => {
        return el.textContent;
    }, _2);

    let volume = await page.evaluate(el => {
        return el.textContent;
    }, _3);

    let change = await page.evaluate(el => {
        return el.textContent;
    }, _4);

    publicFloat = parseFloat(publicFloat.replace(/\D/g,''));
    marketCap = parseFloat(marketCap.replace(/\D/g,''))
    volume = parseFloat(volume.replace(/\D/g,''))
    change = parseFloat(change.replace(/\D/g,''))

    await dbHelper.insertIntoWSJ(id, ticker, publicFloat, marketCap, volume, change)

    await browser.close();
}