
var args = process.argv
var currencyNameArg = args[2]

// List of my personal cryptocurrencies 😎
var myFavoriteCurrencies = ['LSK', 'ETH', 'BTC']

const https = require('https');

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

var prepareCurrencyTableRow = (currencyName) => {
	var currencyValTextRepresentation = currencyName + " ➡ PLN ";

	return {'Currency': currencyValTextRepresentation}
}

var prepareRateTableRow = (currencyRate) => {
	return { '🤑 RATE': String(currencyRate) }
}

var printTable = (currencyName, currencyRate) => {
	var Table = require('cli-table');
	var table = new Table();

	table.push(
	    prepareCurrencyTableRow(currencyName),
	  	prepareRateTableRow(currencyRate)
	);

	console.log(table.toString());	
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

var getRequestParameters = () => {
	var currencyNames;

	if (currencyNameArg == null ) {
		 currencyNames = myFavoriteCurrencies;
	} else {
		currencyNames = [currencyNameArg];
	}

	return currencyNames;
}

var parameters = getRequestParameters();
var recursiveItemIndex = 0;
// Recurence function which contains serial request to the 'bitbay' API
var showResults = (requestParameter) => {
	if (recursiveItemIndex < parameters.length) {
		setTimeout(() => {
			var url = 'https://bitbay.net/API/Public/'+requestParameter+'PLN/orderbook.json';
			
			sentRequest(url, (success, currencyObj) => {
				if (success && currencyObj != null) {
					printTable(currencyObj.name, currencyObj.rate);
				} else {
					console.log("💥 REQ ERROR");
				}

				recursiveItemIndex++;
				showResults(parameters[recursiveItemIndex]);
			})	
		}, 100);
	}
}

// ------------------------------------------------
// Run script 
// ------------------------------------------------
showResults(parameters[0])