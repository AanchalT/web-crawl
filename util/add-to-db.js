'use strict'
module.exports = function(db,obj,callback) {
		db.collection('webcrawl').insert(obj,function(err,doc) {
			if (err)
				return callback(err);
			else
				return callback(null,doc);
		});
}