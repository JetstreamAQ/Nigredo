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

const app = express();
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/thumb', sharp.expressSharp ({
	imageAdapter: new sharp.FsAdapter(path.join(__dirname, 'img'))
}));

const entriesPerPage = 20;
var search = "";

var page = function(req, res, searchTerms) {
	search = searchTerms;

	//tag searching
	let terms = search.split(" ");
	let queryTerms = "(\'" + terms.join('\', \'') + "\')";
	let searchURI = search;

	var sql = `SELECT DISTINCT A.url, B.tags 
			   FROM (SELECT * FROM Media) as A 
			   LEFT JOIN ( 
					SELECT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags 
					FROM MediaTag GROUP BY MediaTag.url) as B 
			   ON A.url = B.url;`;
	if (search) {
		sql = `SELECT DISTINCT A.url, B.tags
			   FROM (
					SELECT DISTINCT MediaTag.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') AS tags
					FROM Media, MediaTag
					WHERE MediaTag.name IN` + queryTerms + ` AND MediaTag.url = Media.url
					GROUP BY Media.url
					HAVING COUNT(MediaTag.name) = ` + terms.length + `) as A
			   INNER JOIN (
					SELECT DISTINCT Media.url, GROUP_CONCAT(MediaTag.name SEPARATOR ' ') as tags
					FROM Media, MediaTag
					WHERE MediaTag.url = Media.url
					GROUP BY Media.URL) as B
			   ON A.url = B.url;`;
	}

	db.query(sql, function(err, data, fields) {
		if (err) throw err;

		var pageCount = Math.ceil(data.length / entriesPerPage);
		if (pageCount == 0) { //TODO: Make a dummy page or something so you don't have to do this or something idk.
			var page = 1;
			var iter = 1;
			var end = 1;
			pageCount = 1;
			res.render('index', {title: 'URL', data: data, page, iter, end, pageCount, searchURI, search});
			return;
		}

		var page = req.query.page ? Number(req.query.page) : 1;
		if (page > pageCount) {
			res.redirect('/?page=' + encodeURIComponent(pageCount));
		} else if (page < 1) {
			res.redirect('/?page=' + encodeURIComponent(1));
		}

		const lowerBound = (page - 1) * entriesPerPage;
		sql = sql.substring(0, sql.length - 1)+ ' LIMIT ' + lowerBound + ', ' + entriesPerPage + ';';
		db.query(sql, (err, trimData) => {
			if(err) throw err;

			var iter = ((page - 3) < 1) ? 1 : page - 3;
			var end = (iter + 7) <= pageCount ? (iter + 7) : pageCount;

			if (end < (page + 3)) {
				iter -= (page + 3) - pageCount;
			}

			res.render('index', {title: 'URL', data: trimData, page, iter, end, pageCount, searchURI, search});
		});
	});
};

app.get('/', (req, res) => {
	page(req, res, escape(search));
});

app.post('/', (req, res) => {
	page(req, res, escape(req.body.search));
});

app.post('/scan', function(req, res) {
	console.log('Recieved.');

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
	input = req.originalUrl;
	procIn = input.toLowerCase().substring(14 ,input.length);

	getTags(escape(procIn), function(result) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	});
});

app.listen(process.env.PORT || 3443, () => console.log("App running on port 3443"));
