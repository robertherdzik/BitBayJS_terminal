var args = process.argv
var currency = args[2]

const https = require('https');
 
var url = 'https://bitbay.net/API/Public/'+currency+'PLN/orderbook.json'

var sentRequest = (url ,callback) => {
	https.get(url, (resp) => {
	  let data = '';
	 
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  
	  resp.on('end', () => {
	  	var parsedObject = JSON.parse(data)
	    return callback(parsedObject)
	  });
	 
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
}

var printTable = (currencyName, currencyRate) => {
	var Table = require('cli-table');
	var table = new Table();

	var currencyValTextRepresentation = currency + " ➡ PLN "

	table.push(
	    { 'Currency': currencyValTextRepresentation }
	  , { '🤑 RATE': currencyRate }
	);

	console.log(table.toString());	
}

sentRequest(url, (myObject) => {
	var currencyValue = myObject.bids[0][0]
	printTable(currency, currencyValue)
})
