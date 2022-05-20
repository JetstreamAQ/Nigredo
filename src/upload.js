"use strict";

const scan = require('./scan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const date = new Date();

var disk = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname + "/../img/" + date.getFullYear());
	},
	filename: function(req, file, callback) {
		callback(null, Date.now() + path.extname(file.originalname));
	}
});

var uploadFile = multer({storage: disk}).array('image', 20);

module.exports = uploadFile;
