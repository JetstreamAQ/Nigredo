"use strict";

const { exec } = require("child_process");

const date = new Date();

var fetchImages = function(urls, callback) {
	let standard = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);

	for (let i = 0; i < urls.length; i++) {
		if (standard.test(urls[i])) {
			let modUrl = "\"" + urls[i] + "\"";
			exec("./scripts/imgGet.sh -d img/" + date.getFullYear() + " " + modUrl, function(err, stdout, stderr) {
				if (err) {
					console.log("error: " + err.message);
					return;
				}

				if (stderr) {
					console.log("stderr: " + stderr);
				}

				console.log(stdout);
			});	
		}
	}

	callback();
};

module.exports = fetchImages;
