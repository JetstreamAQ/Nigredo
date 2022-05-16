$('#scan').click(function() {
	$.post('/scan', {}, function(data) {
		if (data.done == 0) {
			//bad; no idea how long scanning and adding the scanned files to the DB takes
			setTimeout(function() {
				window.location.reload(true);
			}, 120);
		}
	});
});


