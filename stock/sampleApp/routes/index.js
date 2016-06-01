
/*
 * GET home page.
 */

module.exports = function(app) {

	var db = require('../db');

	var name = "Rahul";
	var surname = "Bakolia";
	var jsonResponse = JSON.stringify({
			name : name,
			surname : surname
		});

	app.get('/stock', function(req,res) {
		var stockName = req.query.stockName;
		var timeStamp = req.query.timeStamp;
		var StockPrice = require('.././models/stockPrice');
		StockPrice.findOne({ timeStamp: timeStamp, "stockName" : stockName }, function(err, result) {
			if(err) {
					var jsonResponse = JSON.stringify({
					status : "fail",
					details : "No such record"
				});
				res.writeHead(500, {"Content-Type": "application/json"});
				res.end(jsonResponse);					
			} else {
				console.log(result);
				var jsonResponse = JSON.stringify({
					status : "success",
					details : result
				});
				console.log(result);
				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(jsonResponse);
			}	
		});
	});
	
	app.get('/', function(req,res) {
			res.send("Hello bhai log");
		});

	app.get('/temp', function(req,res) {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(jsonResponse);
		});
}
