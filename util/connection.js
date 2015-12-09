'use strict'
var MongoClient = require('mongodb').MongoClient;
module.exports = function(url,callback) {	
	MongoClient.connect(url, function(err, db) {
		if (err)
			return callback(err)
		else
			return callback(null,db)
	})
}