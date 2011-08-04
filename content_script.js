var reviewbuddy = {};

/*****************************************************************************
 * Configuration
 *****************************************************************************/

reviewbuddy.config = {};
reviewbuddy.config.crucibleBaseUrl = "http://sandbox.fisheye.atlassian.com";
reviewbuddy.config.crucibleCreateReviewUrl = reviewbuddy.config.crucibleBaseUrl + "/json/cru/createReviewDialog";

/*****************************************************************************
 * Implementation
 *****************************************************************************/

/**
 * Given a link, return the changeset id to which it corresponds.
 */
reviewbuddy.changesetFromLink = function(link) {
	if(null != link) {
		return link.innerText;
	}

	// Return null instead of an empty string to make it easier to use with $.map
	return null;
}

/**
 * Returns all the changesets in the page.
 */
reviewbuddy.getChangsets = function() {
	var changesetLinks = $("a.changeset-link");

	if((null == changesetLinks) || (0 == changesetLinks.length)) {
		return [];
	}

	return $.map(changesetLinks, function(elt, idx) {
		return reviewbuddy.changesetFromLink(elt);
	});
}

/**
 * Creates a review in Crucible.
 * 
 * Calls the callback, passing in the review id (if successful), or an empty string (on failure).
 */
reviewbuddy.createReview = function(callback) {
	$.post(reviewbuddy.config.crucibleCreateReviewUrl, function(data) { reviewbuddy.onReviewCreated(data, callback); });
}

/**
 * Given the data returned by Crucible, returns true if the review was created
 * successfully, false otherwise.
 */
reviewbuddy.wasReviewCreated = function(data) {
	if(!data) {
		return false;
	}

	try {
		var json = $.parseJSON(data);
	} catch(ex) {
		return false;
	}
	
	return true;
}

/**
 * Parse the review creation response from Crucible for the review id.
 */
reviewbuddy.parseReviewId = function(data) {
	// The expected format for payload is /cru/REVIEWID
	var parts = data.payload.split("/");
	
	return parts[parts.length - 1];
}

/**
 * Handle review creation response from Crucible.
 */
reviewbuddy.onReviewCreated = function(data, callback) {
	if(!reviewbuddy.wasReviewCreated(data)) {
		callback(""); // pass empty string on failure
	}
	
	callback(reviewbuddy.parseReviewId(data));
}

reviewbuddy.startReviewCreation = function() {
	var changesets = reviewbuddy.getChangsets();
	
	if(0 == changesets) {
		alert("Cannot create review. No changesets on page.");
		return;
	}

	reviewbuddy.createReview(function(reviewId) { alert("review id is " + reviewId); });
}

reviewbuddy.startReviewCreation();
