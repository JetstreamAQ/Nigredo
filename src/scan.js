"use strict";

const glob = require("glob");
const path = require('path');
const db = require('./database');

var scan = async function(src, callback) {
	let extensions = ['jpeg', 'png', 'jpg', 'JPG', 'PNG', 'JPEG'];
	let files = [[]];
	let i = 0;
	for await (let extension of extensions) {
		files[i] = glob(src + '/**/*.' + extension, callback);
		i++;
	}
};

var scanDir = async function(directory, callback) {
	await scan(directory, async function(err, res) {
		if (err) throw err;
	
		var rootDir = path.join(__dirname + '/../img/');
		//for (var i = 0; i < res.length; i++) {
		for await (let path of res) {
			let trimPath = path.substring(rootDir.length, path.length);
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

	setTimeout(function () {
		callback(0);
	}, 240);
};

module.exports = scanDir;
