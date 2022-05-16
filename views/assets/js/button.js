$('#scan').click(function() {
	$.post('/scan', {}, function(data) {
		if (data.done == 0) window.location.reload(true);
	});
});


