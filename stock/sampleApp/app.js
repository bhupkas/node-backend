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
var StockPrice = require('./models/stockPrice')
db.once('open', function() {
  console.log("We are connected");
  var val = new StockPrice({
      name : 'oil',
      timeStamp : "ABVC",
      price : "wrf"
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

app.listen(server_port, server_ip_address, function(){
  console.log("Express server listening on port %d in %s mode", server_port, server_ip_address);
});

setInterval(function() {

  var http = require('http');
  // Voltas share price
  var options = {
    host: 'https://www.google.co.in'
    port: 80,
    path: '/async/finance_price_updates?async=lang:en,country:in,rmids:%2Fg%2F1dv8nhll,_fmt:jspb&ei=yntJV9PuOsvbvAS6oIPwAQ&ion=1&espv=2&client=ubuntu&yv=2'
  };

  http.get(options, function(resp){
    resp.on('data', function(chunk){
      //do something with chunk
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
});


}, 1000);