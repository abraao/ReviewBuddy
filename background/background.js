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

chrome.extension.onRequest.addListener(reviewbuddy.options.dispatchRequest);
