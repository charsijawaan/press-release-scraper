const puppeteer = require('puppeteer')
const dbHelper = require('./../database/dbHelper')

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
    for (let i = 0; i < source.length; ++i) {
        if (source.substring(i, i + find.length) === find) {
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

        if (needle >= text.length - 1 || text[needle] !== ':') {
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
        if(str[i] === '-' || str[i] === '+' || str[i] === '.' || isDigit(str[i])) {
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

getMonth = (str) => {
    if(str === 'jan') {
        return '01'
    } else if(str === 'feb') {
        return '02'
    } else if(str === 'mar') {
        return '03'
    } else if(str === 'apr') {
        return '04'
    } else if(str === 'may') {
        return '05'
    } else if(str === 'jun') {
        return '06'
    } else if(str === 'jul') {
        return '07'
    } else if(str === 'aug') {
        return '08'
    } else if(str === 'sep') {
        return '09'
    } else if(str === 'oct') {
        return '10'
    } else if(str === 'nov') {
        return '11'
    } else if(str === 'dec') {
        return '12'
    }
}

module.exports.convertTime = (time) => {
    time = time.replace(/,/g, "")
    time = time.split(" ")
    let month = getMonth(time[0].toLowerCase())
    return `${time[2]}-${month}-${time[1]} ${time[3]}`
}

module.exports.extractHostname = (url) => {
    var hostname

    if (url.indexOf("//") > -1) 
        hostname = url.split('/')[2]    
    else
        hostname = url.split('/')[0]
    
    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]

    return hostname
}

getGlobalMonth = (str) => {
    if(str === 'january') {
        return '01'
    }
    else if(str === 'february') {
        return '02'
    }
    else if(str === 'march') {
        return '03'
    }
    else if(str === 'april') {
        return '04'
    }
    else if(str === 'may') {
        return '05'
    }
    else if(str === 'june') {
        return '06'
    }
    else if(str === 'july') {
        return '07'
    }
    else if(str === 'august') {
        return '08'
    }
    else if(str === 'september') {
        return '09'
    }
    else if(str === 'october') {
        return '10'
    }
    else if(str === 'november') {
        return '11'
    }
    else if(str === 'december') {
        return '12'
    }
}

module.exports.convertGlobalNewsTime = (time) => {
    time = time.replace(/,/g, "")
    time = time.split(" ")

    let month = getGlobalMonth(time[0].toLowerCase())
    return `${time[2]}-${month}-${time[1]} ${time[3]}`
    
}


module.exports.crawlWSJ = async (id, ticker) => {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    try {
        await page.goto(`https://www.wsj.com/market-data/quotes/${ticker}`, { waitUntil: 'networkidle2' })

        try {
            const _1 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[5]/div/span'))[0]
            const _2 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[1]/ul/li[3]/div/span/text()'))[0]
            const _3 = (await page.$x('//*[@id="quote_volume"]'))[0]
            const _4 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/div/div[2]/div[2]/ul/li[2]/div/span/span'))[0]
            const _5 = (await page.$x('//*[@id="root"]/div/div/div/div[2]/div/div/div[1]/div[2]/div[1]/ul[2]/li[4]/div/span[2]'))[0]
            
            // At Close
            const _6 = (await page.$x('//*[@id="quote_val"]'))[0]

            // After Hours
            const _7 = (await page.$x('//*[@id="ms_quote_val"]'))[0]

            try {

                let publicFloat
                let parsedPublicFloat
                try {
                    publicFloat = await page.evaluate(el => {
                        return el.textContent;
                    }, _1)
                    parsedPublicFloat = parsePublicFloat(publicFloat)
                }
                catch (ex) {
                    parsedPublicFloat = [0, 0]
                }

                let marketCap
                let parsedMarketCap
                try {
                    marketCap = await page.evaluate(el => {
                        return el.textContent;
                    }, _2)
                    parsedMarketCap = parsePublicFloat(marketCap)
                }
                catch (ex) {
                    parsedMarketCap = [0, 0]
                }

                let volume
                try {
                    volume = await page.evaluate(el => {
                        return el.textContent;
                    }, _3)
                    volume = parseFloat(volume.replace(/\D/g,''))
                }
                catch (ex) {
                    volume = 0
                }

                let change
                let parsedChange
                try {
                    change = await page.evaluate(el => {
                        return el.textContent;
                    }, _4)
                    parsedChange = parsePublicFloat(change)
                }
                catch (ex) {
                    parsedChange = [0, 0]
                }

                let _52WeekRange
                let parsed52WeekRange
                try {
                    _52WeekRange = await page.evaluate(el => {
                        return el.textContent;
                    }, _5)
                    parsed52WeekRange = parse52WeekRange(_52WeekRange)
                }
                catch (ex) {
                    parsed52WeekRange = [0, 0]
                }

                let stockPriceAtClose
                try {
                    stockPriceAtClose = await page.evaluate(el => {
                        return el.textContent;
                    }, _6)
                }
                catch (ex) {
                    stockPriceAtClose = 0
                }

                let stockPriceAfterHours
                try {
                    stockPriceAfterHours = await page.evaluate(el => {
                        return el.textContent;
                    }, _7)
                }
                catch (ex) {
                    stockPriceAfterHours = 0
                }

                await dbHelper.insertIntoWSJ(id, ticker, parseFloat(parsedPublicFloat[0]),
                    parsedPublicFloat[1], parseFloat(parsedMarketCap[0]), parsedMarketCap[1],
                    volume, parseFloat(parsedChange[0]), parsedChange[1], parsed52WeekRange[0],
                    parsed52WeekRange[1], parseFloat(stockPriceAtClose), parseFloat(stockPriceAfterHours))

                await browser.close()
            }
            catch (ex) {
                console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
                console.log(ex)
                await browser.close()
            }
        }
        catch (ex) {
            console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
            console.log(ex)
            await browser.close()
        }

    }
    catch (ex) {
        console.log('ERROR IN = ' + `https://www.wsj.com/market-data/quotes/${ticker}`)
        console.log(ex)
        await browser.close()
    }

}