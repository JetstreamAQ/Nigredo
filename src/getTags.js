"use strict";

const db = require('./database');

var getTags = function(search, callback) {
	let sql = 'CALL GetTags(?)';
	db.query(sql, ['^' + search], function(err, data) {
		if (err) throw err;

		var tags = [];
		for (let i = 0; i < data[0].length; i++) {
			tags[i] = decodeURI(data[0][i].name);
		}

		callback(tags);
	});
}

module.exports = getTags;
