const db = require('./database');

var addTag = function(key, tag, callback) {
	var tagLC = tag.toLowerCase();

	//Checking if the passed tag already exists; if dne then add tag entry
	var sql = "SELECT name FROM Tag WHERE LOWER(name) = LOWER(\'" + escape(tagLC) + "\');";
	db.query(sql, function(err, res) {
		if (err) throw err;

		if (res.length > 0) {
			console.log("Tag: " + tag + "; already in DB");
		} else {
			sql = "INSERT INTO Tag VALUES(\'" + escape(tag.toLowerCase()) + "\');";
			db.query(sql, function(err, res) {
				if(err) throw err;

				console.log("Tag: " + tag + "; DNE, added to DB.");
			});
		}


		//Checking if the key is already tagged with the passed tag; if tagged with tag, then abort.
		sql = "SELECT DISTINCT Media.url FROM Media, MediaTag WHERE LOWER(MediaTag.name) = \"" + escape(tagLC) + "\" AND MediaTag.url = Media.url AND Media.url = \"" + key + "\";";
		db.query(sql, function(err, res) {
			if (err) throw err;

			if (res.length > 0) {
				callback(-1);
			} else {
				sql = "INSERT INTO MediaTag VALUES (\'" + key + "\', \'" + escape(tagLC) + "\');";
				db.query(sql, function(err, res) {
					if (err) throw err;
					callback(0);
				});
			}
		});
	});
	
};

module.exports = addTag;
