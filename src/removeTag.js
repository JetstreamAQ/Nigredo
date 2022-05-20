"use strict";

const db = require('./database');

var removeTag = function(key, tag, callback) {
	let tagLC = tag.toLowerCase().replace(/ /g, '_');

	let sql = "SELECT DISTINCT Media.url FROM Media, MediaTag WHERE LOWER(MediaTag.name)=\""+ escape(tagLC) +"\" AND MediaTag.url=Media.url;";
	db.query(sql, function(err, res) {
		if (err) throw err;

		sql = "DELETE FROM MediaTag WHERE LOWER(MediaTag.name) = \"" + escape(tagLC) + "\" AND MediaTag.url = \"" + key + "\";";
		db.query(sql, function(err, res) {if(err) throw err;});

		if (res.length - 1 == 0) {
			sql = "DELETE FROM Tag WHERE Lower(Tag.name) = \"" + escape(tagLC) + "\";";
			db.query(sql, function(err, res) {if(err) throw err;});
		}

		callback(0);
	});
};

module.exports = removeTag;
