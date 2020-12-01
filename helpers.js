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