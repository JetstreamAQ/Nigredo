"use strict";

const { exec } = require("child_process");

const date = new Date();

var fetchImages = async function(urls, callback) {
	let re = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);

	for await (let url of urls) {
		if (re.test(url)) {
			let modUrl = "\"" + url + "\"";
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

	setTimeout(function() {
		callback();
	}, 240);
};

module.exports = fetchImages;
