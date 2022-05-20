"use strict";

var mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createPool({
		host: process.env.HOST,
		user: process.env.DBUSER,
		password: process.env.PASSWORD,
		database: process.env.DATABASE
});

connection.getConnection((err, con) => {
	if(err) throw err;

	console.log("Connected to " + process.env.DATABASE + " as " + process.env.DBUSER + "!");
});

module.exports = connection;
