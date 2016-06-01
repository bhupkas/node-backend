//function getDatabaseConnection(callback) {
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
  //callback(db);
//}
 module.exports = db;