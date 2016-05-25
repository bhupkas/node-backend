
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

// Routes

//app.get('/', routes.index);

/* Getting routes from routes folder */

require('./routes')(app);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


/* Calling function after regular intervals */

setInterval(function() {
/*
  
  var http = require('http');
  var options = {
    host : 'stock-pricing.herokuapp.com',
    path : '/temp'
  }
  callback = function(response) {
    console.log("Pel Pel ke");
    console.log(response);
    //var jsonResponse = JSON.parse(response);
    //console.log(jsonResponse);
    MongoClient.connect(url, function (err, db) {
      if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
          var collection = db.collection('oil');
          var oil1 = {time: '1242435', price: 42.341431};
          var oil2 = {time: '2545645', price: 54.314134};
          collection.insert([oil1,oil2], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
          console.log('Connection established to', url);
          db.close();
         });
    }
  });

  }

  http.request(options,callback).end();*/
  
  /*var mongodb = require('mongodb');
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://localhost:27017/stocks';*/
  var http = require('http');  
  var options = {
  host: 'stock-pricing.herokuapp.com',
  path: '/temp',
  method: 'GET'
};

var req = http.request(options, function(res) {
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (resBody) {
    var responseData = JSON.parse(resBody);
    //console.log(responseData);
    //console.log(responseData["name"]);
    var StockPrice = require('./models/stockPrice');

    var mongoose = require('mongoose');
    var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/stocks';
    console.log(process.env.MONGODB_URI);
    mongoose.connect(url);
    //var db = mongoose.connection;
    //var db = mongojs('mongodb://admin:password@IP_ADDRESS/bot', [], { authMechanism : 'ScramSHA1' });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("We are connected");
      var val = new StockPrice({
          name : 'oil',
          timeStamp : responseData["name"],
          price : responseData["surname"]
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
    //db.close();

    /*MongoClient.connect(url, function (err, db) {
      if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
          var collection = db.collection('oil');
          var oil1 = {name: responseData["name"], surname: responseData["surname"]};
          collection.insert([oil1], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
          console.log('Connection established to', url);
          db.close();
         });
    }
  });*/


  });
  

});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();


}, 1000000);
