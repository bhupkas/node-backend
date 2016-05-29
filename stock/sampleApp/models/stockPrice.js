var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockPricing = new Schema({
	stockName:String,
	currentVal:String,
	absoluteVariation:String,
	percentageVariation:String,
	timeStamp: String,
	url:String,
	createdAt: Date,
	updatedAt: Date
});

// the schema is useless so far
// we need to create a model using it
var StockPrice = mongoose.model('StockPrice', stockPricing);

// make this available to our users in our Node applications
module.exports = StockPrice;
