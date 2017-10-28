
var args = process.argv
var currencyNameArg = args[2]

const https = require('https');
 
var url = 'https://bitbay.net/API/Public/'+currencyNameArg+'PLN/orderbook.json'

class Currency {

	constructor(name, rate) {
	    this.name = name;
	    this.rate = rate;
  	}
}

function parseResponse(jsonResponse) {
	var rate = jsonResponse.bids[0][0];
	if (rate) {
		return new Currency(currencyNameArg, rate);
	}

	return null;
}

var sentRequest = (url ,callback) => {
	https.get(url, (resp) => {
	  let data = '';
	 
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	   
	  resp.on('end', () => {
	  	var currencyObj = parseResponse(JSON.parse(data))
	    callback(true, currencyObj);
	  });
	 
	}).on("error", (err) => {
		callback(false, null);
	});
}

var printTable = (currencyName, currencyRate) => {
	var Table = require('cli-table');
	var table = new Table();

	var currencyValTextRepresentation = currencyName + " ➡ PLN ";

	table.push(
	    { 'Currency': currencyValTextRepresentation }
	  , { '🤑 RATE': String(currencyRate) }
	);

	console.log(table.toString());	
}

sentRequest(url, (success, currencyObj) => {
	if (success && currencyObj != null) {
		printTable(currencyObj.name, currencyObj.rate);
	} else {
		console.log("💥 REQ ERROR");
	}
})

