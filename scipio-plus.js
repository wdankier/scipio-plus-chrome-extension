const messageHandler = function(request, sender, sendResponse) {
	console.log(request);
	if (request && request.message && request.message === 'members_page') {
		setTimeout(function () {addMemberExportButton();}, 2000);
	} else if (request && request.message && request.message === 'news_page') {
		setTimeout(function () {addNewsExportButton();}, 2000);
	}
}

chrome.runtime.onMessage.addListener(messageHandler);

console.log("Scipio Plus is geactiveerd");
