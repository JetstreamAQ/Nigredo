const db = require('./database');
const fs = require('fs');

var sqlQuery = function(key, sql, type) {
	db.query(sql, function(err, res) {
		if (err) throw err;

		switch(type) {
			case 0: 
				let sql = "DELETE FROM Media WHERE Media.url=\'" + escape(key) + "\';";
				sqlQuery(key, sql, 1);
				return;
			case 1:
				console.log(key + " was deleted successfully!");
				break;
		}

		console.log("Database entries for " + key + " successfully deleted.");
	});
}

var deleteImage = function(key, callback) {
	let escKey = escape(key);

	fs.unlink(__dirname + "/../img/" + key, function(err) {
		if (err) {
			console.log(err);
			callback(-1);
		}

		//clearing the database of all related tags
		//NB: Deleting these in seperate queries.  Some images may have zero tags, which will cause a
		//    joint deletion query to delete nothing.
		let sql = "DELETE FROM MediaTag WHERE MediaTag.url=\'" + escKey + "\';";
		sqlQuery(key, sql, 0);

		callback(0);
	});
}

module.exports = deleteImage;
