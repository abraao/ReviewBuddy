var reviewbuddy = {};
reviewbuddy.popup = {};

reviewbuddy.popup.dispatchRequest = function(request, sender, sendResponse) {
	if(request["popupClose"]) {
		window.close();
	}
}

reviewbuddy.popup.setUpListeners = function() {
	chrome.extension.onRequest.addListener(reviewbuddy.popup.dispatchRequest);
}

reviewbuddy.popup.setUpListeners();

chrome.extension.getBackgroundPage().reviewbuddy.injectContentScripts();
