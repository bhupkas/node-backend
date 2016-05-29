/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
require('./routes')(app);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function(){
  console.log("Express server listening on port %d in %s mode", server_port, server_ip_address);
});

setInterval(function() {
  getDataFromGoogleApi('randomString', function(chunk) {
    parseGoogleData(chunk,function(res) {
      getDatabaseConnection(function(db) {
        var StockPrice = require('./models/stockPrice')
        db.once('open', function() {

          StockPrice.findOne({ timeStamp: res["timeStamp"] }, function(err, thor) {
            if (err) return console.log(err);
            console.log(thor);
          });

          //var query = StockPrice.findOne({'timeStamp':res["timeStamp"]});
          //console.log(query.select('stockName'));
          var val = new StockPrice({
              stockName : res["stockName"],
              currentVal : res["currentVal"],
              absoluteVariation : res["absoluteVariation"],
              percentageVariation : res["percentageVariation"],
              timeStamp : res["timeStamp"],
              url:'www.google.co.in/async/finance_price_updates?async=lang:en,country:in,rmids:%2Fg%2F1dv8nhll,_fmt:jspb&ei=yntJV9PuOsvbvAS6oIPwAQ&ion=1&espv=2&client=ubuntu&yv=2',
              createdAt:Date.now(),
              updatedAt:Date.now(),
          });
          val.save(function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("Successfully saved");
              db.close();
            }
          });
        });
      });
    });
  });
}, 1000);

function getDataFromGoogleApi(url, callback) {
    var http = require('http');
    var options = {
      host: 'www.google.co.in',
      path: '/async/finance_price_updates?async=lang:en,country:in,rmids:%2Fg%2F1dv8nhll,_fmt:jspb&ei=yntJV9PuOsvbvAS6oIPwAQ&ion=1&espv=2&client=ubuntu&yv=2'
    };
    callbackFunc = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      callback(str);
      });
    }
  var req = http.request(options, callbackFunc).end();
}

function parseGoogleData(data, callback) {
  dataArray = data.split('\n');
  var cleanedData = '';
  dataArray.shift();
  for(var iter in dataArray) {
    cleanedData += dataArray[iter];
  }
  var parsedData = JSON.parse(cleanedData);
  var dict = {};
  var priceUpdates = parsedData.PriceUpdates[0][0];
  var stockName = priceUpdates[2];
  var timeStamp = priceUpdates[3];
  var currentVal = priceUpdates[1][8][1];
  var absoluteVariation = priceUpdates[1][9][1];
  var percentageVariation = priceUpdates[1][10][1];
  dict["stockName"] = stockName;
  dict["timeStamp"] = timeStamp;
  dict["currentVal"] = currentVal;
  dict["absoluteVariation"] = absoluteVariation;
  dict["percentageVariation"] = percentageVariation; 
  callback(dict);
}

function getDatabaseConnection(callback) {
  var connection_string = '127.0.0.1:27017/stocks';
  if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }
  var mongoose = require('mongoose');
  var url = 'mongodb://' + connection_string;
  mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  callback(db);
}