"use strict";

const express = require('express');
const router = express.Router();
const db = require('./database');

const entriesPerPage = 25;

router.get('/', function(req, res, next) {
	var sql = 'SELECT DISTINCT Media.url, GROUP_CONCAT(MediaTag.name SEPARATOR "; ") as tags FROM Media, MediaTag WHERE MediaTag.name REGEXP "^" AND MediaTag.url = Media.url GROUP BY Media.URL;'
	db.query(sql, function(err, data, fields) {
		if (err) throw err;

		const pageCount = Math.ceil(data.length / entriesPerPage);
		var page = req.query.page ? Number(req.query.page) : 1;
		if (page > pageCount) {
			res.redirect('/?page=' + encodeURIComponent(pageCount));
		} else if (page < 1) {
			res.redirect('/?page=' + encodeURIComponent(1));
		}


		res.render('index', {title: 'URL', data: data});
	});
});

module.exports = router;
