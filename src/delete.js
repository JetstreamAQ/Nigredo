"use strict";

const db = require('./database');
const fs = require('fs');

var sqlQuery = function(key, sql, type) {
	return new Promise((res) => {
		db.query(sql, [escape(key)], function(err, res) {
			if (err) throw err;

			switch(type) {
				case 0: 
					let sql = "CALL DeleteMedia(?)";
					sqlQuery(key, sql, 1);
					return;
				case 1:
					console.log(key + " was deleted successfully!");
					break;
			}

			console.log("Database entries for " + key + " successfully deleted.");
		});

		res();
	});
}

var deleteImage = function(key, callback) {
	fs.unlink(__dirname + "/../img/" + key, async function(err) {
		if (err) {
			console.log(err);
			callback(-1);
		}

		//clearing the database of all related tags
		//NB: Deleting these in seperate queries.  Some images may have zero tags, which will cause a
		//    joint deletion query to delete nothing.
		let sql = "CALL DeleteMediaTag(?)";
		sqlQuery(key, sql, 0).then(setTimeout(function() {callback(0)}, 240));

		//callback(0);
	});
}

module.exports = deleteImage;
