var reviewbuddy = {};
reviewbuddy.options = {};

reviewbuddy.options.pageSetup = function() {
	$(document).ready(function() {
		reviewbuddy.options.loadOptions();
		
		$("#saveButton").click(function() {
			reviewbuddy.options.saveOptions();
		});
	});
}

/**
 * Load options and place them on the page.
 */
reviewbuddy.options.loadOptions = function() {
	for(key in localStorage) {
		reviewbuddy.options.loadSingleOption(key, localStorage[key]);
	}
}

/**
 * Load a single option and place it on the page.
 */
reviewbuddy.options.loadSingleOption = function(optionId, optionValue) {
	var optionTag = $("#" + optionId);
	
	if(0 == optionTag.length) {
		reviewbuddy.options.displayMessage("error", "Error loading option " + optionId + ": option field not on page.");
		return;
	}
	
	optionTag[0].value = optionValue;
}

reviewbuddy.options.saveOptions = function() {
	var options = $(".option");
	
	if(null == options || 0 == options.length) {
		reviewbuddy.options.displayMessage("warning", "No options to save.");
		return;
	}
	
	$.each(options, function(ii, option) { reviewbuddy.options.saveSingleOption(option); });
	reviewbuddy.options.displayMessage("success", "Options saved.");
}

reviewbuddy.options.saveSingleOption = function(option) {
	if(!option.value) {
		localStorage.removeItem(option.id);
	}
	else {
		localStorage[option.id] = option.value;
	}
}

reviewbuddy.options.displayMessage = function(messageClass, messageText) {
	$("<p>").addClass(messageClass).append(messageText).appendTo($("#messageContainer"));
}

reviewbuddy.options.pageSetup();
