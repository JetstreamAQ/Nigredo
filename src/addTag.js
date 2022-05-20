"use strict";

const db = require('./database');

var addTag = function(key, tag, callback) {
	let tagLC = escape(tag.toLowerCase());
	let keyEsc = escape(key);

	//Checking if the passed tag already exists; if dne then add tag entry
	let sql = "CALL TagFetch(?)"
	db.query(sql, [tagLC], function(err, res) {
		if (err) throw err;

		if (res[0].length > 0) {
			console.log("Tag: " + tag + "; already in DB");
		} else {
			sql = "CALL TagInsert(?)"
			db.query(sql, [tagLC], function(err, res) {
				if(err) throw err;

				console.log("Tag: " + tag + "; DNE, added to DB.");
			});
		}

		//Checking if the key is already tagged with the passed tag; if tagged with tag, then abort.
		sql = "CALL CheckTagged(?, ?)"
		db.query(sql, [tagLC, keyEsc], function(err, res) {
			if (err) throw err;

			if (res[0].length > 0) {
				callback(-1);
			} else {
				sql = "CALL TagImg(?, ?)"
				db.query(sql, [tagLC, keyEsc], function(err, res) {
					if (err) throw err;
					callback(0);
				});
			}
		});
	});
	
};

module.exports = addTag;
