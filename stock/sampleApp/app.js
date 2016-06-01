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
        var db = require('./db');
        var StockPrice = require('./models/stockPrice');
        db.once('open', function() {
          StockPrice.findOne({ timeStamp: res["timeStamp"] }, function(err, result) {
            if (err) return console.log(err);
            if(result == null) {
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
                }
              });
            }
            db.close();
          });
        });
    });
  });
}, 1000);

// Todo : Calling batch process to clear the data

/*setInterval(function() {
  getDatabaseConnection(function(db) {
    var StockPrice = require('./models/stockPrice');
    StockPrice.find(function(err, stocks) {
      if (err) return console.error(err);
      console.dir(stocks);
    });
    StockPrice.remove(function(err,result) {
      if(err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
    db.close();
  });
}, 60*60*1000);
*/
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


