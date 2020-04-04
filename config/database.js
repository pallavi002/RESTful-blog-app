const mongoose = require('mongoose');

let initDatabase = function () {

  let dbUri = process.env.DB_URI;

  mongoose.connect(dbUri);

  let connnection = mongoose.connection;

  connnection.on('connected', function () {
    console.log('Connnection established successfully');
  });

  connnection.on('error', function (err) {
    console.log('Error occured while connecting to the database');
  });

  connnection.on('disconnected', function () {
    console.log('Databas connected disabled');
  });
}
module.exports = initDatabase;
