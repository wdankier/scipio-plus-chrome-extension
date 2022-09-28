var _busyExporting = false;

const messageHandler = function(request, sender, sendResponse) {
	console.log(request);
	if (request && request.message && request.message === 'members_page') {
		if (_busyExporting === false) {
			setTimeout(function () {addMemberExportButton();}, 2000);
		}
		sendResponse(true);
	} else if (request && request.message && request.message === 'news_page') {
		if (_busyExporting === false) {
			setTimeout(function () {addNewsExportButton();}, 2000);
		}
		sendResponse(true);
	}
	sendResponse(false);
}

chrome.runtime.onMessage.addListener(messageHandler);

console.log("Scipio Plus is geactiveerd");
