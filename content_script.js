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
reviewbuddy.config.crucible.changesetAdd = "/editRevisionsAjax/";

/*****************************************************************************
 * Global values. ugh
 *****************************************************************************/
reviewbuddy.global = {};

/**
 * The number of changesets added to the review.
 */
reviewbuddy.global.changesetsAdded = 0;

/**
 * The number of changesets being added to the review.
 */
reviewbuddy.global.changesetsNum = 0;

/**
 * Reset the global to no changesets added, with the given number
 * of changesets still to be added.
 */
reviewbuddy.global.resetState = function(changesetsNum) {
	reviewbuddy.global.changesetsAdded = 0;
	reviewbuddy.global.changesetsNum = changesetsNum;
}

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
 * the changesets that are part of that review.
 * 
 * Returns an empty string if review id is null or empty.
 */
reviewbuddy.createChangesetEditUrl = function(reviewId) {
	if(!reviewId) {
		return "";
	}
	
	return reviewbuddy.config.crucible.jsonApi + "/" + reviewId + reviewbuddy.config.crucible.changesetAdd;
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
 * Creates the data that we can send to Crucible in order to add a changeset
 * to a review.
 */
reviewbuddy.createChangesetAddData = function(changesetId, sourceName) {
	return "csid=" + changesetId + "&command=add&attachMethod=ITERATION&sourceName=" + sourceName;
}

/**
 * Adds a single changeset to a review.
 */
reviewbuddy.addChangesetToReview = function(changesetEditUrl, changesetId, reviewId, sourceName) {
	var data = reviewbuddy.createChangesetAddData(changesetId, sourceName);

	$.post(changesetEditUrl, data, function(data) { reviewbuddy.onChangesetAdded(data, reviewId); });
}

reviewbuddy.onChangesetAdded = function(data, reviewId) {
	reviewbuddy.global.changesetsAdded++;
	
	if(reviewbuddy.global.changesetsAdded >= reviewbuddy.global.changesetsNum) {
		reviewbuddy.onAllChangesetsAdded(reviewId);
	}
}

reviewbuddy.createReviewUrl = function(reviewId) {
	return reviewbuddy.config.crucible.reviewBaseUrl + "/" + reviewId;
}

reviewbuddy.redirectToReviewUrl = function(reviewId) {
	window.location.replace(reviewbuddy.createReviewUrl(reviewId));
}

/**
 * Called after all changesets have been added to a review.
 */
reviewbuddy.onAllChangesetsAdded = function(reviewId) {
	reviewbuddy.redirectToReviewUrl(reviewId);
}

/**
 * Try to get the source name from the URL.
 */
reviewbuddy.getSourceNameFromUrl = function() {
	var parts = window.location.href.split("/");
	
	if(null == parts || 0 == parts.length) {
		return "";
	}
	
	return parts[parts.length - 1];
}

/**
 * Get the source name from the page. I think this is like a project name.
 */
reviewbuddy.getSourceName = function() {
	return reviewbuddy.getSourceNameFromUrl();
}

/**
 * Adds an array of changesets to a review.
 */
reviewbuddy.addChangesetsToReview = function(changesets, reviewId) {
	if(!reviewId || !$.isArray(changesets)) {
		return;
	}
	
	var sourceName = reviewbuddy.getSourceName();
	if(!sourceName) {
		return;
	}
	
	var changesetEditUrl = reviewbuddy.createChangesetEditUrl(reviewId);
	
	reviewbuddy.global.resetState(changesets.length);
	
	for(ii in changesets) {
		reviewbuddy.addChangesetToReview(changesetEditUrl, changesets[ii], reviewId, sourceName);
	}
}

reviewbuddy.startReviewCreation();
