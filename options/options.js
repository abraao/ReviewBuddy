var reviewbuddy = {};
reviewbuddy.options = {};

reviewbuddy.options.setup = function() {
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
	reviewbuddy.options.flashMessage("success", "Options saved.");
}

reviewbuddy.options.saveSingleOption = function(option) {
	if(!option.value) {
		localStorage.removeItem(option.id);
	}
	else {
		localStorage[option.id] = option.value;
	}
}

reviewbuddy.options.flashMessage = function(messageClass, messageText) {
	reviewbuddy.options.displayMessage(messageClass, messageText);
	
	setTimeout(reviewbuddy.options.clearMessages, 3000);
}

reviewbuddy.options.displayMessage = function(messageClass, messageText) {
	reviewbuddy.options.clearMessages();
	$("<p>").addClass(messageClass).append(messageText).appendTo($("#messageContainer"));
}

reviewbuddy.options.clearMessages = function() {
	$("#messageContainer").empty();
}

reviewbuddy.options.setup();
