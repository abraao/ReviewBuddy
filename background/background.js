var reviewbuddy = {};
reviewbuddy.options = {};

reviewbuddy.options.dispatchRequest = function(request, sender, sendResponse) {
	var optionId = request["optionId"];
	
	if(!optionId) {
		sendResponse({});
	}
	else {
		var response = {};
		response[optionId] = localStorage[optionId];

		sendResponse(response);
	}
}

reviewbuddy.injectContentScripts = function() {
		chrome.tabs.executeScript(null, {
			file: "jquery.js"
		});
	
		chrome.tabs.executeScript(null, {
			file: "content_script.js"
		});
}

reviewbuddy.setUpListeners = function() {
	chrome.extension.onRequest.addListener(reviewbuddy.options.dispatchRequest);

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if(/fisheye/.test(tab.url)) {
			chrome.pageAction.show(tabId);
		}
	});
}

reviewbuddy.setUpListeners();

