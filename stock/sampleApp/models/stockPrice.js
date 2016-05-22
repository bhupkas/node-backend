var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockPricing = new Schema({
  name: String,
  timeStamp: String,
  price:String,
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var StockPrice = mongoose.model('StockPrice', stockPricing);

// make this available to our users in our Node applications
module.exports = StockPrice;
