var reviewbuddy = {};
reviewbuddy.options = {};

reviewbuddy.options.pageSetup = function() {
	$(document).ready(function() {
		$("#saveButton").click(function() {
			reviewbuddy.options.saveOptions();
		});
	});
}

reviewbuddy.options.saveOptions = function() {
	alert("saved!");
}

reviewbuddy.options.pageSetup();
