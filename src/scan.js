"use strict";

const glob = require("glob");
const path = require('path');
const db = require('./database');

var scan = function(src, callback) {
	let extensions = ['jpeg', 'png', 'jpg', 'JPG', 'PNG', 'JPEG'];
	let files = [[]];
	for (var i = 0; i < extensions.length; i++) {
		files[i] = glob(src + '/**/*.' + extensions[i], callback);
	}
};

var scanDir = function(directory, callback) {
	scan(directory, function(err, res) {
		if (err) throw err;
	
		var rootDir = path.join(__dirname + '/../img/');
		for (var i = 0; i < res.length; i++) {
			let trimPath = res[i].substring(rootDir.length, res[i].length);
			let sql = "CALL InsertMedia(?)";
			db.query(sql, [escape(trimPath)], function(err, result) {
				if (err != null && err.code == 'ER_DUP_ENTRY') {
					console.log(trimPath + " already insterted in the DB.");
					return;
				} else if (err) {
					throw err;
				}

				console.log(trimPath + " inserted.");
			});
		}
	});

	callback(0);
};

module.exports = scanDir;
