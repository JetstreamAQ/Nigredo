const db = require('./database');

var getTags = function(search, callback) {
	let sql = 'SELECT * FROM Tag WHERE Tag.name REGEXP \'^' + search + '\'';
	db.query(sql, function(err, data) {
		if (err) throw err;

		var tags = [];
		for (i = 0; i < data.length; i++) {
			tags[i] = decodeURI(data[i].name);
		}

		callback(tags);
	});
}

module.exports = getTags;
