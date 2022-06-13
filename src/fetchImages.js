"use strict";

const { exec } = require("child_process");

const date = new Date();

var fetchImages = async function(urls, callback) {
	if (urls.length == 1 && urls[0] == "")
		callback();

	for await (let url of urls) {
		let modUrl = "\"" + url + "\"";
		await exec("./scripts/imgGet.sh -d img/" + date.getFullYear() + " " + modUrl, function(err, stdout, stderr) {
			if (err) {
				console.log("error: " + err.message);
				return;
			}

			if (stderr) {
				console.log("stderr: " + stderr);
			}

			console.log(stdout);

			if (url === urls[urls.length - 1])
				callback();
		});	
	}
};

module.exports = fetchImages;
