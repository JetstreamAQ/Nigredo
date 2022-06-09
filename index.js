"use strict";

const express = require('express');
const {readFile, readFileSync} = require('fs').promises;
const sharp = require('express-sharp');
const path = require('path');
const bodyParser = require("body-parser");

const db = require('./src/database');
const addTag = require('./src/addTag');
const removeTag = require('./src/removeTag');
const scanDir = require('./src/scan');
const getTags = require('./src/getTags');
const upload = require('./src/upload');
const delImg = require("./src/delete");
const fetchImages = require("./src/fetchImages");

const app = express();
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/thumb', sharp.expressSharp ({
	imageAdapter: new sharp.FsAdapter(path.join(__dirname, 'img'))
}));

const entriesPerPage = 30;

var page = function(req, res, searchTerms) {
	let search = decodeURI(searchTerms).trim();
	let terms = search.split(" ");
	for (let i = 0; i < terms.length; ++i)
		terms[i] = escape(terms[i]);

	let queryTerms = "\'" + terms.join(',') + "\'";
	let urlTerms = encodeURIComponent(terms.join("+"));
	let searchURI = urlTerms;

	let sql = (search) ? "CALL search(" + queryTerms + ", " + terms.length + ")" : "CALL searchNoTerms()";
	db.query(sql, function(err, data, fields) {
		if (err) throw err;

		var pageCount = Math.ceil(data[0].length / entriesPerPage);
		if (pageCount == 0) { //TODO: Make a dummy page or something so you don't have to do this or something idk.
			var page = 1;
			var iter = 1;
			var end = 1;
			pageCount = 1;
			res.render('index', {data: data[0], page, iter, end, pageCount, searchURI, search});
			return;
		}

		var page = req.query.page ? Number(req.query.page) : 1;
		if (page > pageCount) {
			res.redirect('/?search=' + urlTerms + '&page=' + encodeURIComponent(pageCount));
		} else if (page < 1) {
			res.redirect('/?search=' + urlTerms + '&page=' + encodeURIComponent(1));
		}

		const lowerBound = (page - 1) * entriesPerPage;
		sql = (search) ? "CALL searchBound(" 
							+ queryTerms + ", " 
							+ terms.length + ", " 
							+ lowerBound + ", " 
							+ entriesPerPage + ");" :
						 "CALL searchNoTermsBound(" + lowerBound + ", " + entriesPerPage + ")";
		db.query(sql, (err, trimData) => {
			if(err) throw err;

			var iter = ((page - 3) < 1) ? 1 : page - 3;
			var end = (iter + 7) <= pageCount ? (iter + 7) : pageCount;

			if (end < (page + 4)) {
				iter -= (page + 4) - pageCount;
			}

			res.render('index', {data: trimData[0], page, iter, end, pageCount, searchURI, search});
		});
	});
};

app.get('/', (req, res) => {
	page(req, res, escape(""));
});

app.get('/reload', (req, res) => {
	res.end('<script>window.location.href="/";</script>');
});

app.post('/', (req, res) => {
	page(req, res, escape(req.body.search));
});

app.post('/scan', function(req, res) {
	scanDir(__dirname + '/img', function (result) {
		res.json({done: result});
	});
});

app.post('/addTag', function(req, res) {
	addTag(req.body.key, req.body.tag, function(result) {
		res.json({result: result});
	});
});

app.post('/removeTag', function(req, res) {
	removeTag(req.body.key, req.body.tag, function(result) {
		res.json({result: result});
	});
});

app.get('/getTags', function(req, res) {
	let input = req.originalUrl;
	let procIn = input.toLowerCase().substring(14 ,input.length); //processed input

	getTags(escape(procIn), function(result) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

app.post('/upload', function(req, res) {
	upload(req, res, function(err) {
		if (err) return res.end("Error uploading file(s).");

		let links = req.body.imgLinks.split("\n");
		for (let i = 0; i < links.length - 1; i++)
			links[i] = links[i].substring(0, links[i].length - 1);
		fetchImages(links, function() {
			scanDir(__dirname + '/img', function(result) {
				if (result === 0)
					res.end('<script>window.location.href="/";</script>');
			});
		});

	});
});

app.post('/deleteImage', function(req, res) {
	delImg(req.body.key, function(result) {
		res.json({result: result});
	});
});

app.listen(process.env.PORT || 3443, () => console.log("App running on port 3443"));
