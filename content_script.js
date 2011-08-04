var reviewbuddy = {};

/*****************************************************************************
 * Configuration
 *****************************************************************************/

reviewbuddy.config = {};
reviewbuddy.config.crucible = {};
reviewbuddy.config.crucible.baseUrl = "http://sandbox.fisheye.atlassian.com";
reviewbuddy.config.crucible.reviewBaseUrl = reviewbuddy.config.crucible.baseUrl + "/cru";
reviewbuddy.config.crucible.jsonApi = reviewbuddy.config.crucible.baseUrl + "/json/cru";
reviewbuddy.config.crucible.createReviewUrl = reviewbuddy.config.crucible.jsonApi + "/createReviewDialog";
reviewbuddy.config.crucible.revisionAdd = "/editRevisionsAjax/";

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
	$.post(reviewbuddy.config.crucible.createReviewUrl, function(data) { reviewbuddy.onReviewCreated(data, callback); });
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

/**
 * Given a review id, returns the URL that should be used to edit
 * the revisions that are part of that review.
 * 
 * Returns an empty string if review id is null or empty.
 */
reviewbuddy.createRevisionEditUrl = function(reviewId) {
	if(!reviewId) {
		return "";
	}
	
	return reviewbuddy.config.crucible.jsonApi + "/" + reviewId + reviewbuddy.config.crucible.revisionAdd;
}

reviewbuddy.startReviewCreation = function() {
	var changesets = reviewbuddy.getChangsets();
	
	if(0 == changesets) {
		alert("Cannot create review. No changesets on page.");
		return;
	}

	reviewbuddy.createReview(function(reviewId) { reviewbuddy.addChangesetsToReview(changesets, reviewId); });
}

/**
 * Creates the data that we can send to Crucible in order to add a revision
 * to a review.
 */
reviewbuddy.createRevisionAddData = function(changesetId) {
	return "csid=" + changesetId + "&command=add";
}

/**
 * Adds a single changeset to a review.
 * 
 * The revision edit URL is expected to already specify the review id.
 */
reviewbuddy.addChangesetToReview = function(revisionEditUrl, changesetId) {
	var data = reviewbuddy.createRevisionAddData(changesetId);
	$.post(revisionEditUrl, data, reviewbuddy.onRevisionAdded);
}

reviewbuddy.onRevisionAdded = function(data) {
	alert(data);
}

/**
 * Adds an array of changesets to a review.
 */
reviewbuddy.addChangesetsToReview = function(changesets, reviewId) {
	if(!reviewId || !$.isArray(changesets)) {
		return;
	}
	
	var revisionEditUrl = reviewbuddy.createRevisionEditUrl(reviewId);
	
	for(changesetId in changesets) {
		reviewbuddy.addChangesetToReview(revisionEditUrl, changesetId);
	}
}

reviewbuddy.startReviewCreation();
