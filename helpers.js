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

isLetter = (str) => {
    return str.length === 1 && str.match(/[a-z]/i);
}

isDigit = (str) => {
    return /^\d+$/.test(str);
}

findIndexes = (source, find) => {
    if (!source) {
        return [];
    }
    if (!find) {
        return source.split('').map(function(_, i) { return i; });
    }
    let result = [];
    for (i = 0; i < source.length; ++i) {
        if (source.substring(i, i + find.length) == find) {
            result.push(i);
        }
    }
    return result;
}

module.exports.getSymbols = (text, marketName, caseSensitiveSearch) => {
    if (!caseSensitiveSearch) {
        text = text.toLocaleLowerCase();
        marketName = marketName.toLocaleLowerCase();
    }

    let indexes = findIndexes(text, marketName);
    let symbols = [];

    for (let i = 0; i < indexes.length; i++) {
        let needle = indexes[i] + marketName.length;

        // try to find ':' upto 15 characters after the market name
        let stop = needle + 15;
        for (; needle <= stop && needle < text.length; needle++) {
            if (text[needle] === ':') {
                break;
            }
        }

        if (needle >= text.length - 1 || text[needle] != ':') {
            continue;
        }
        needle++;

        // try to find the first alphabet that occurs after ':'
        while (needle < text.length && !isLetter(text[needle])) {
            needle++;
        }

        if (needle === text.length) {
            continue;
        }

        let symbol = [];
        while (needle < text.length && isLetter(text[needle])) {
            symbol.push(text.charAt(needle));
            needle++;
        }

        symbols.push(symbol.join(''));
    }

    return symbols;
}

parsePublicFloat = (str) => {
    str.split(" ").join("")

    if(str === 'N/A'){
        return [0, 0]
    }

    let numericPart = ''
    let unitPart = ''
    for(let i = 0; i < str.length; i++) {
        if(str[i] === '.' || isDigit(str[i])) {
            numericPart += str[i]
        }
        else {
            unitPart += str[i]
        }
    }
    return [numericPart, unitPart]
}

parse52WeekRange = (str) => {
    let res = str.split("-")
    // start index
    res[0] = res[0].trim()
    // end index
    res[1] = res[1].trim()
    return res
}


module.exports.crawlWSJ = async (id, ticker) => {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    try {
        await page.goto(`https://www.wsj.com/market-data/quotes/${ticker}`, { waitUntil: 'networkidle2' })

        try {
            const _1 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[5]/div/span'))[0];
            const _2 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[3]/div/span/text()'))[0];
            const _3 = (await page.$x('//*[@id="quote_volume"]'))[0];
            const _4 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[2]/ul/li[2]/div/span/span'))[0];
            const _5 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[1]/div[2]/div[1]/ul[3]/li[4]/div/span[2]'))[0];

            try {
                let publicFloat = await page.evaluate(el => {
                    return el.textContent;
                }, _1)

                let marketCap = await page.evaluate(el => {
                    return el.textContent;
                }, _2)

                let volume = await page.evaluate(el => {
                    return el.textContent;
                }, _3)

                let change = await page.evaluate(el => {
                    return el.textContent;
                }, _4)

                let _52WeekRange = await page.evaluate(el => {
                    return el.textContent;
                }, _5)


                let parsedPublicFloat = parsePublicFloat(publicFloat)
                let parsedMarketCap = parsePublicFloat(marketCap)
                volume = parseFloat(volume.replace(/\D/g,''))
                let parsedChange = parsePublicFloat(change)
                let parsed52WeekRange = parse52WeekRange(_52WeekRange)

                await dbHelper.insertIntoWSJ(id, ticker, parseFloat(parsedPublicFloat[0]),
                    parsedPublicFloat[1], parseFloat(parsedMarketCap[0]), parsedMarketCap[1],
                    volume, parseFloat(parsedChange[0]), parsedChange[1], parsed52WeekRange[0], parsed52WeekRange[1])

                await browser.close()
            }
            catch (ex) {
                console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
                console.log(ex)
            }
        }
        catch (ex) {
            console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
            console.log(ex)
        }

    }
    catch (ex) {
        console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
        console.log(ex)
    }

}