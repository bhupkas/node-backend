
/*
 * GET home page.
 */

module.exports = function(app) {

	var name = "Rahul";
	var surname = "Bakolia";
	var jsonResponse = JSON.stringify({
			name : name,
			surname : surname
		});

	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/stocks';
	app.get('/', function(req,res) {
			res.send("Hello bhai log");
			});

	app.get('/temp', function(req,res) {
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(jsonResponse);
		});
	
	app.post('/oil', function(req,res) {

				MongoClient.connect(url, function (err, db) {
  		if (err) {
    			console.log('Unable to connect to the mongoDB server. Error:', err);
  		} else {
				
			  var collection = db.collection('oil');

    			var oil1 = {time: '1242435', price: 42.341431};
			var oil2 = {time: '2545645', price: 54.314134};

				console.log(req.body);
				console.log(req.body.time);
    			//collection.insert([oil1,oil2], function (err, result) {
      /*if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
			
    			console.log('Connection established to', url);
    			db.close();
 		     });*/
		}
	});


			res.send("Oye Oye");
		});

}
